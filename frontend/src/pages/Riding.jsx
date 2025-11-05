import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContexts'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {} // Retrieve ride data
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    socket.on("ride-ended", () => {
        navigate('/home')
    })

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;

            script.onload = () => {
                resolve(true);
            }
            script.onerror= () =>{
                resolve(false);
            }
            document.body.appendChild(script);
        })
    }

    const handleClick = async () => {
        try{
          const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
          
          if(!res) {
            alert("RazorPay SDK failed to load");
            return;
          }

          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/payments/create-order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: ride.fare,
              rideId: ride._id
            }),
          });

          if(!response) {
            alert("Server error. Are you online?");
            return;
          }

          const orderData = await response.json();

          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            currency: orderData.currency,
            amount: orderData.amount,
            order_id: orderData.id,
            name: "Uber Clone",
            description: "Thank you for riding with us",
            handler: async function (response) {
              const paymentData = {
                name: ride?.user?.fullname?.firstname + " " + ride?.user?.fullname?.lastname,
                email: ride?.user?.email,
                amount: ride?.fare,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              };
              const verifyResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/payments/verify-payment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
              });
                const verifyData = await verifyResponse.json();
                if(verifyData.success) {
                  alert("Payment Successful");
                  navigate('/home');
                } else {
                  alert("Payment verification failed");
                }
            },
            prefill: {
              name: ride?.user?.fullname?.firstname,
              email: ride?.user?.email,
            },
          };

          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        }
        catch(err){
            console.log("Payment Error: ",err);
            alert("Payment failed");
        }
    }

    return (
        <div className='h-screen'>
            <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>
            <div className='h-1/2'>
                <LiveTracking />

            </div>
            <div className='h-1/2 p-4'>
                <div className='flex items-center justify-between'>
                    <img className='h-12' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                    <div className='text-right'>
                        <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname}</h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                        <p className='text-sm text-gray-600'>Mahindra Thar</p>

                    </div>
                </div>

                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>

                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>562/11-A</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{ride?.fare} </h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button 
                  onClick={handleClick}
                  className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Make a Payment</button>
            </div>
        </div>
    )
}

export default Riding;