# Uber Clone

This project is a full-stack clone of the popular ride-sharing service, Uber. It includes a React-based frontend for the user and driver interfaces, and a Node.js backend with Express and MongoDB for the server-side logic.

---

## 🚀 Live Demo
  Experience the platform in action:
  👉 [https://uber-clone-ten-gilt.vercel.app/](https://uber-clone-ten-gilt.vercel.app/)

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Contributing](#contributing)
- [License](#license)

## Features

-   **User Authentication**: Secure registration and login for both users and captains (drivers).
-   **Real-time Location Tracking**: Live tracking of driver and user locations using WebSockets.
-   **Ride Management**: Create, confirm, start, and end rides.
-   **Fare Calculation**: Automatic fare estimation based on distance.
-   **Payment Integration**: Simulated payment processing with Razorpay.
-   **Email Notifications**: OTP verification and other email-based communication.
-   **Interactive Map**: Google Maps integration for location searching and route display.

## Technologies Used

**Frontend:**

-   React
-   Vite
-   Tailwind CSS
-   React Router
-   Axios
-   Socket.IO Client

**Backend:**

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JSON Web Tokens (JWT)
-   Socket.IO
-   Nodemailer
-   Razorpay (for payments)

## Project Structure

The project is organized into two main directories: `frontend` and `backend`.

```

├── .gitignore
├── README.md
├── backend/
│   ├── .env
│   ├── README.md
│   ├── app.js
│   ├── server.js
│   ├── socket.js
│   ├── package.json
│   ├── package-lock.json
│   ├── controllers/
│   │   ├── captain.js
│   │   ├── map.js
│   │   ├── payments.js
│   │   ├── ride.js
│   │   └── user.js
│   ├── db/
│   │   └── db.js
│   ├── mail/
│   │   └── templates/
│   │       ├── emailVerificationTemplate.js
│   │       └── paymentSuccessEmail.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   │   ├── blacklistToken.js
│   │   ├── captain.js
│   │   ├── otp.js
│   │   ├── ride.js
│   │   └── user.js
│   ├── routes/
│   │   ├── captain.js
│   │   ├── maps.js
│   │   ├── payment.js
│   │   ├── ride.js
│   │   └── user.js
│   ├── services/
│   │   ├── captain.js
│   │   ├── maps.js
│   │   ├── payment.js
│   │   ├── ride.js
│   │   └── user.js
│   └── utils/
│       └── mailSender.js
│
├── frontend/
│    ├── .env
│    ├── .gitignore
│    ├── README.md
│    ├── index.html
│    ├── package.json
│    ├── package-lock.json
│    ├── vite.config.js
│    ├── eslint.config.js
│    ├── public/
│    │   └── vite.svg
│    └── src/
│    ├── App.css
│    ├── App.jsx
│    ├── index.css
│    ├── main.jsx
│    ├── assets/
│    │   └── react.svg
│    ├── components/
│    │   ├── CaptainDetails.jsx
│    │   ├── ConfirmRide.jsx
│    │   ├── ConfirmRidePopUp.jsx
│    │   ├── FinishRide.jsx
│    │   ├── LiveTracking.jsx
│    │   ├── LocationSearchPanel.jsx
│    │   ├── LookingForDriver.jsx
│    │   ├── RidePopUp.jsx
│    │   ├── VehiclePanel.jsx
│    │   └── WaitingForDriver.jsx
│    ├── context/
│    │   ├── CapatainContext.jsx
│    │   ├── SocketContexts.jsx
│    │   └── UserContext.jsx
│    └── pages/
│    ├── CaptainHome.jsx
│    ├── CaptainLogout.jsx
│    ├── CaptainProtectWrapper.jsx
│    ├── CaptainRiding.jsx
│    ├── CaptainSignup.jsx
│    ├── CaptainVerifyEmail.jsx
│    ├── CaptianLogin.jsx
│    ├── Home.jsx
│    ├── Riding.jsx
│    ├── Start.jsx
│    ├── UserLogin.jsx
│    ├── UserLogout.jsx
│    ├── UserProtectWrapper.jsx
│    ├── UserSignup.jsx
│    └── VerifyEmail.jsx

```

## Getting Started

### Prerequisites

-   Node.js (v14 or later)
-   npm or yarn
-   MongoDB instance (local or cloud)
-   A Google Maps API key
-   A Razorpay account for payment integration

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/indrajeetPanjiyar/UBER_CLONE
    cd uber-clone
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Configure backend environment variables:**

    Create a `.env` file in the `backend` directory and add the following:

    ```
    PORT=3000
    MONGO_URI=<your_mongodb_uri>
    JWT_SECRET=<your_jwt_secret>
    EMAIL_USER=<your_email_address>
    EMAIL_PASS=<your_email_password>
    RAZORPAY_KEY_ID=<your_razorpay_key_id>
    RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
    ```

4.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

5.  **Configure frontend environment variables:**

    Create a `.env` file in the `frontend` directory and add your Google Maps API key:

    ```
    VITE_GOOGLE_MAPS_API_KEY=<your_google_maps_api_key>
    ```

6.  **Run the application:**

    -   Start the backend server:
        ```bash
        cd ../backend
        npm start
        ```
    -   Start the frontend development server:
        ```bash
        cd ../frontend
        npm run dev
        ```

The application should now be running at `http://localhost:5173`.

## API Endpoints

For a detailed list of all backend API endpoints, please refer to the `Backend/README.md` file.

## Frontend Components

The frontend is built with a component-based architecture. Key components include:

-   `LocationSearchPanel`: For searching pickup and destination locations.
-   `VehiclePanel`: To select the type of vehicle for the ride.
-   `LiveTracking`: Displays the real-time location of the user and driver on the map.
-   `RidePopUp`: A modal for managing ride status (confirm, start, end).
-   `CaptainDetails`: Shows details of the assigned captain.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
