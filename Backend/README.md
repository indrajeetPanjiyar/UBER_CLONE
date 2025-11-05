# Backend API Documentation

This document provides a detailed overview of the backend API endpoints for the Uber Clone application.

## Table of Contents
1.  [User Routes](#user-routes)
2.  [Captain Routes](#captain-routes)
3.  [Map Routes](#map-routes)
4.  [Payment Routes](#payment-routes)
5.  [Ride Routes](#ride-routes)

---

## User Routes

Base Path: `/users`

### POST /register

**Description**

Registers a new user. Validates input, hashes the password, creates the user record, and returns a JWT token and the created user (password excluded).

**Endpoint**

-   URL: `/users/register`
-   Method: `POST`
-   Content-Type: `application/json`

**Request body**

```json
{
  "fullname": {
    "firstname": "string", // required, min length 3
    "lastname": "string" // optional, min length 3
  },
  "email": "string", // required, must be a valid email
  "password": "string" // required, min length 6
}
```

**Responses**

-   `201 Created`: `{ "success": true, "token": "<jwt>", "user": { ... } }`
-   `400 Bad Request`: For validation errors or if the user already exists.
-   `500 Internal Server Error`: For server-side errors.

---

### POST /login

**Description**

Authenticates an existing user and returns a JWT token.

**Endpoint**

-   URL: `/users/login`
-   Method: `POST`
-   Content-Type: `application/json`

**Request body**

```json
{
  "email": "string",      // required, must be a valid email
  "password": "string"    // required, min length 6
}
```

**Responses**

-   `200 OK`: `{ "success": true, "message": "login successful", "token": "<jwt>", "user": { ... } }`
-   `400 Bad Request`: For validation errors or invalid credentials.
-   `500 Internal Server Error`.

---

### POST /sendotp

**Description**

Sends a One-Time Password (OTP) to the user's registered email address.

**Endpoint**

-   URL: `/users/sendotp`
-   Method: `POST`
-   Content-Type: `application/json`

**Request body**

```json
{
  "email": "string" // required, must be a valid email
}
```

**Responses**

-   `200 OK`: `{ "success": true, "message": "OTP sent successfully" }`
-   `400 Bad Request`: For validation errors.
-   `500 Internal Server Error`.

---

### GET /profile

**Description**

Returns the profile of the authenticated user. Requires a valid JWT token.

**Endpoint**

-   URL: `/users/profile`
-   Method: `GET`
-   Auth: Required (JWT for users)

**Responses**

-   `200 OK`: `{ "success": true, "user": { ... } }`
-   `401 Unauthorized`: If the token is missing, invalid, or expired.

---

### GET /logout

**Description**

Logs out the authenticated user by blacklisting the JWT token.

**Endpoint**

-   URL: `/users/logout`
-   Method: `GET`
-   Auth: Required (JWT for users)

**Responses**

-   `200 OK`: `{ "success": true, "message": "Logged out successfully" }`
-   `401 Unauthorized`: If the token is missing, invalid, or expired.

---

## Captain Routes

Base Path: `/captains`

### POST /register

**Description**

Registers a new captain (driver) with their vehicle details.

**Endpoint**

-   URL: `/captains/register`
-   Method: `POST`
-   Content-Type: `application/json`

**Request body**

```json
{
  "fullname": {
    "firstname": "string", // required, min length 3
    "lastname": "string"   // optional, min length 3
  },
  "email": "string",      // required, must be a valid email
  "password": "string",   // required, min length 6
  "vehicle": {
    "color": "string",        // required, min length 3
    "plate": "string",        // required, min length 3
    "capacity": 1,             // required, integer >= 1
    "vehicleType": "car"      // required, one of: "bike", "car", "auto"
  }
}
```

**Responses**

-   `201 Created`: `{ "success": true, "captain": { ... } }`
-   `400 Bad Request`: For validation errors or if the captain already exists.
-   `500 Internal Server Error`.

---

### POST /login

**Description**

Authenticates an existing captain and returns a JWT token.

**Endpoint**

-   URL: `/captains/login`
-   Method: `POST`
-   Content-Type: `application/json`

**Request body**

```json
{
  "email": "string",      // required, must be a valid email
  "password": "string"    // required, min length 6
}
```

**Responses**

-   `200 OK`: `{ "token": "<jwt>", "captain": { ... } }`
-   `400 Bad Request`: For validation errors or invalid credentials.
-   `401 Unauthorized`.

---

### POST /sendotp

**Description**

Sends an OTP to the captain's registered email address.

**Endpoint**

-   URL: `/captains/sendotp`
-   Method: `POST`
-   Content-Type: `application/json`

**Request body**

```json
{
  "email": "string" // required, must be a valid email
}
```

**Responses**

-   `200 OK`: `{ "success": true, "message": "OTP sent successfully" }`
-   `400 Bad Request`: For validation errors.
-   `500 Internal Server Error`.

---

### GET /profile

**Description**

Returns the profile of the authenticated captain. Requires a valid JWT token.

**Endpoint**

-   URL: `/captains/profile`
-   Method: `GET`
-   Auth: Required (JWT for captains)

**Responses**

-   `200 OK`: `{ "success": true, "captain": { ... } }`
-   `401 Unauthorized`: If the token is missing, invalid, or expired.

---

### GET /logout

**Description**

Logs out the authenticated captain by blacklisting the JWT token.

**Endpoint**

-   URL: `/captains/logout`
-   Method: `GET`
-   Auth: Required (JWT for captains)

**Responses**

-   `200 OK`: `{ "success": true, "message": "Logged out successfully" }`
-   `401 Unauthorized`: If the token is missing, invalid, or expired.

---

## Map Routes

Base Path: `/maps`

### GET /get-coordinates

**Description**

Get geographic coordinates (latitude and longitude) for a given address.

**Endpoint**

-   URL: `/maps/get-coordinates`
-   Method: `GET`
-   Auth: Required (JWT for users)

**Query Parameters**

-   `address`: `string` (required, min length 3)

**Responses**

-   `200 OK`: `{ "success": true, "coordinates": { "lat": <number>, "lng": <number> } }`
-   `400 Bad Request`: For validation errors.
-   `401 Unauthorized`.

---

### GET /get-distance-time

**Description**

Get the estimated travel distance and time between an origin and a destination.

**Endpoint**

-   URL: `/maps/get-distance-time`
-   Method: `GET`
-   Auth: Required (JWT for users)

**Query Parameters**

-   `origin`: `string` (required, min length 3)
-   `destination`: `string` (required, min length 3)

**Responses**

-   `200 OK`: `{ "success": true, "distance": "<string>", "duration": "<string>" }`
-   `400 Bad Request`: For validation errors.
-   `401 Unauthorized`.

---

### GET /get-suggestions

**Description**

Get autocomplete suggestions for a partial address input.

**Endpoint**

-   URL: `/maps/get-suggestions`
-   Method: `GET`
-   Auth: Required (JWT for users)

**Query Parameters**

-   `input`: `string` (required, min length 3)

**Responses**

-   `200 OK`: `{ "success": true, "suggestions": [ ... ] }`
-   `400 Bad Request`: For validation errors.
-   `401 Unauthorized`.

---

## Payment Routes

Base Path: `/payment`

### POST /create-order

**Description**

Creates a Razorpay payment order for a ride.

**Endpoint**

-   URL: `/payment/create-order`
-   Method: `POST`
-   Content-Type: `application/json`

**Request body**

```json
{
  "amount": "number", // required
  "rideId": "string" // required, must be a valid Mongo ID
}
```

**Responses**

-   `200 OK`: `{ "success": true, "order": { ... } }`
-   `400 Bad Request`: For validation errors.

---

### POST /verify-payment

**Description**

Verifies a Razorpay payment after completion.

**Endpoint**

-   URL: `/payment/verify-payment`
-   Method: `POST`
-   Content-Type: `application/json`

**Request body**

```json
{
  "razorpay_order_id": "string", // required
  "razorpay_payment_id": "string", // required
  "razorpay_signature": "string" // required
}
```

**Responses**

-   `200 OK`: `{ "success": true, "message": "Payment verified successfully" }`
-   `400 Bad Request`: For validation errors.

---

## Ride Routes

Base Path: `/ride`

### POST /create

**Description**

Creates a new ride request from a user.

**Endpoint**

-   URL: `/ride/create`
-   Method: `POST`
-   Auth: Required (JWT for users)
-   Content-Type: `application/json`

**Request body**

```json
{
  "pickup": "string", // required, min length 3
  "destination": "string", // required, min length 3
  "vehicleType": "string" // required, one of: 'auto', 'car', 'moto'
}
```

**Responses**

-   `201 Created`: `{ "success": true, "ride": { ... } }`
-   `400 Bad Request`: For validation errors.
-   `401 Unauthorized`.

---

### GET /get-fare

**Description**

Calculates the estimated fare for a ride based on pickup and destination.

**Endpoint**

-   URL: `/ride/get-fare`
-   Method: `GET`
-   Auth: Required (JWT for users)

**Query Parameters**

-   `pickup`: `string` (required, min length 3)
-   `destination`: `string` (required, min length 3)

**Responses**

-   `200 OK`: `{ "success": true, "fare": <number> }`
-   `400 Bad Request`: For validation errors.
-   `401 Unauthorized`.

---

### POST /confirm

**Description**

Allows a captain to confirm and accept a ride request.

**Endpoint**

-   URL: `/ride/confirm`
-   Method: `POST`
-   Auth: Required (JWT for captains)
-   Content-Type: `application/json`

**Request body**

```json
{
  "rideId": "string" // required, must be a valid Mongo ID
}
```

**Responses**

-   `200 OK`: `{ "success": true, "message": "Ride confirmed" }`
-   `400 Bad Request`: For validation errors.
-   `401 Unauthorized`.

---

### GET /start-ride

**Description**

Allows a captain to start a confirmed ride using an OTP.

**Endpoint**

-   URL: `/ride/start-ride`
-   Method: `GET`
-   Auth: Required (JWT for captains)

**Query Parameters**

-   `rideId`: `string` (required, must be a valid Mongo ID)
-   `otp`: `string` (required, 6 characters)

**Responses**

-   `200 OK`: `{ "success": true, "message": "Ride started" }`
-   `400 Bad Request`: For validation errors or incorrect OTP.
-   `401 Unauthorized`.

---

### POST /end-ride

**Description**

Allows a captain to end a started ride.

**Endpoint**

-   URL: `/ride/end-ride`
-   Method: `POST`
-   Auth: Required (JWT for captains)
-   Content-Type: `application/json`

**Request body**

```json
{
  "rideId": "string" // required, must be a valid Mongo ID
}
```

**Responses**

-   `200 OK`: `{ "success": true, "message": "Ride ended" }`
-   `400 Bad Request`: For validation errors.
-   `401 Unauthorized`.