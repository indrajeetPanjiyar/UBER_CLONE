import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import OTPInput from 'react-otp-input'
import axios from 'axios'

const VerifyEmail = () => {

  const [otp, setOtp] = useState('')
  const { user } = useContext(UserDataContext)
  const navigate = useNavigate()

  useEffect(() => {
    if(!user){
        navigate('/signup')
    }
  }, [user, navigate])

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();

    const { fullName, email, password } = user;

    const userData = {
    fullname: {
        firstname: user.fullname.firstname,
        lastname: user.fullname.lastname
    },
    email,
    password,
    otp,
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, userData);
    // console.log("Response from verify and signup:", response);
    if(response){
        const data = response.data;
        localStorage.setItem('token', data.token);
        navigate('/home');
    }
  }

    return (
        <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
            <div className="max-w-[500px] p-4 lg:p-8">
                <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-9">
                    Verify Email
                </h1>
                <p className="text-[1.125rem] leading-6 my-4 text-richblack-100">
                    A verification code has been sent to you. Enter the code below.
                </p>
                <form onSubmit={handleVerifyAndSignup}>
                    <OTPInput 
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => (
                            <input 
                                {...props}
                                placeholder="-"
                                style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                }}
                                className="w-12 border-0 bg-gray-300 rounded-lg text-black aspect-square text-center focus:border-0 focus:outline-2 focus:outline-black" />)}
                        containerStyle={{
                            justifyContent:"space-between",
                            gap:"0 6px",
                        }}
                    />
                    <button type="submit"
                            className="w-full bg-black py-3 px-3 rounded-xl mt-6 font-medium text-white">
                        Verify Email
                    </button>
                    </form>
                    <div className="mt-6 flex items-center justify-between">
                        <button className="flex items-center text-blue-400 gap-x-2"
                                onClick={() => navigate("/signup")}>
                            Resend it
                        </button>
                    </div>
                </div>
        </div>
    )
}

export default VerifyEmail