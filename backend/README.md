# API DOCUMENTATION

# USER Endpoints
## Endpoint: `/users/register`

### Description
This endpoint is used to register a new user in the system. It validates the input data, checks for existing users with the same email, hashes the password, and stores the user in the database. Upon successful registration, it returns a JSON Web Token (JWT) and the user object (excluding the password).

---

### Request Method
**POST**

---

### Request Body
The following fields are required in the request body:

```json
{
  "fullname": {
    "firstname": "string (min: 3 characters, required)",
    "lastname": "string (min: 3 characters, required)"
  },
  "email": "string (valid email format, required)",
  "password": "string (min: 6 characters, required)"
}
```

---

### Response

#### Success Response
- **Status Code:** `201 Created`
- **Body:**
```json
{
  "token": "string (JWT token)",
  "user": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "socketId": "string (optional)"
  }
}
```

#### Error Responses
1. **Validation Error**
   - **Status Code:** `400 Bad Request`
   - **Body:**
   ```json
   {
     "errors": [
       {
         "msg": "string (error message)",
         "param": "string (field name)",
         "location": "string (body)"
       }
     ]
   }
   ```

2. **User Already Exists**
   - **Status Code:** `400 Bad Request`
   - **Body:**
   ```json
   {
     "message": "User already registered with this email"
   }
   ```

3. **Server Error**
   - **Status Code:** `500 Internal Server Error`
   - **Body:**
   ```json
   {
     "message": "Server error",
     "error": "string (error message)"
   }
   ```

---

### Notes
- Ensure the `.env` file contains the necessary environment variables (`DB_CONNECT`, `JWT_SECRET`, etc.).
- The password is hashed before being stored in the database.



## Endpoint: `/users/login`

### Description
Authenticates a user using email and password. Returns a JWT token and basic user information if login is successful.

---

### Request Method
**POST**

---

### Request Headers

| Key           | Value              |
|---------------|--------------------|
| Content-Type  | application/json   |

---

### Request Body

```json
{
  "email": "user@example.com",
  "password": "userpassword123"
}
```

| Field    | Type   | Required | Validation                      |
|----------|--------|----------|---------------------------------|
| email    | String | Yes      | Must be a valid email address   |
| password | String | Yes      | Minimum 6 characters            |

---

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Body:**
```json
{
  "token": "your-jwt-token-here",
  "user": {
    "_id": "userId",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "user@example.com",
    "socketId": null
  }
}
```

| Field | Description |
|-------|-------------|
| token | JWT token for authentication (Bearer token) |
| user  | Logged-in user’s information (excluding password) |

#### Error Responses

| Status Code | Description                                  | Example                                      |
|-------------|----------------------------------------------|----------------------------------------------|
| 400 Bad Request | Validation errors (invalid email format, short password, etc.) | `{ "errors": [...] }`                       |
| 401 Unauthorized | Invalid email or password                | `{ "message": "Invalid email or password" }` |
| 500 Server Error | Server-side issue                        | `{ "message": "Server error" }`              |

---


---

### Notes
- Always send the JWT token in the Authorization header (Bearer token) for protected routes after login.
- Ensure frontend validations before calling this API.
- Passwords are securely hashed and compared


## Endpoint: `/users/profile`

### Description
This endpoint retrieves the profile details of the currently authenticated user. It requires a valid JWT token for authentication.

---

### Request Method
**GET**

---

### Request Headers
- **Authorization:** `Bearer <JWT token>`

---

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Body:**
```json
{
  "_id": "string",
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "socketId": "string (optional)"
}
```

#### Error Responses
1. **Unauthorized**
   - **Status Code:** `401 Unauthorized`
   - **Body:**
   ```json
   {
     "message": "Unauthorized"
   }
   ```

2. **Token Expired**
   - **Status Code:** `401 Unauthorized`
   - **Body:**
   ```json
   {
     "message": "Token expired"
   }
   ```

3. **Server Error**
   - **Status Code:** `500 Internal Server Error`
   - **Body:**
   ```json
   {
     "message": "Server error",
     "error": "string (error message)"
   }
   ```

---

### Notes
- Ensure the JWT token is sent in the `Authorization` header.
- The token must not be blacklisted or expired.



---

## Endpoint: `/users/logout`

### Description
This endpoint logs out the currently authenticated user by blacklisting the JWT token and clearing the `token` cookie.

---

### Request Method
**GET**

---

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Body:**
```json
{
  "message": "Logged out successfully"
}
```

#### Error Responses
1. **Unauthorized**
   - **Status Code:** `401 Unauthorized`
   - **Body:**
   ```json
   {
     "message": "Unauthorized"
   }
   ```

2. **Server Error**
   - **Status Code:** `500 Internal Server Error`
   - **Body:**
   ```json
   {
     "message": "Server error",
     "error": "string (error message)"
   }
   ```

---

### Notes
- Ensure the JWT token is sent in the `Authorization` header or as a cookie.
- After logout, the token will be blacklisted and cannot be used again.



# CAPTAIN Endpoints
## Endpoint: `/captains/register`

### Description
This endpoint registers a new captain (driver) in the system. It validates the input data, checks for existing captains with the same email or vehicle plate, hashes the password, and stores the captain in the database. Upon successful registration, it returns a JWT token and the captain object (excluding the password).

---

### Request Method
**POST**

---

### Request Body
The following fields are required in the request body:

```json
{
  "fullname": {
    "firstname": "string (min: 3 characters, required)",
    "lastname": "string (min: 3 characters, optional)"
  },
  "email": "string (valid email format, required)",
  "password": "string (min: 6 characters, required)",
  "vehicle": {
    "color": "string (min: 3 characters, required)",
    "plate": "string (min: 3 characters, required, unique)",
    "capacity": "number (min: 1, required)",
    "vehicleType": "string (one of: car, bike, auto, required)"
  }
}
```

---

### Response

#### Success Response
- **Status Code:** `201 Created`
- **Body:**
```json
{
  "token": "string (JWT token)",
  "captain": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "password": "string (hashed)",
    "socketId": "string (optional)",
    "status": "active",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": "number",
      "vehicleType": "string"
    },
    "_id": "string",
    "__v": "number",
  }
}
```

#### Error Responses
1. **Validation Error**
   - **Status Code:** `400 Bad Request`
   - **Body:**
   ```json
   {
     "errors": [
       {
         "msg": "string (error message)",
         "param": "string (field name)",
         "location": "string (body)"
       }
     ]
   }
   ```

2. **Captain Already Exists**
   - **Status Code:** `400 Bad Request`
   - **Body:**
   ```json
   {
     "error": "Captain with this email already exists"
   }
   ```

3. **Server Error**
   - **Status Code:** `500 Internal Server Error`
   - **Body:**
   ```json
   {
     "message": "Server error",
     "error": "string (error message)"
   }
   ```

---

### Notes
- Ensure the `.env` file contains the necessary environment variables (`DB_CONNECT`, `JWT_SECRET`, etc.).
- The password is hashed before being stored in the database.
- The vehicle plate must be unique for each captain.
- The JWT token should be used for authentication in protected



## Endpoint: `/captains/login`

### Description
Authenticates a captain (driver) using email and password. Returns a JWT token and the captain object if login is successful.

---

### Request Method
**POST**

---

### Request Headers

| Key           | Value              |
|---------------|--------------------|
| Content-Type  | application/json   |

---

### Request Body

```json
{
  "email": "captain@example.com",
  "password": "captainpassword123"
}
```

| Field    | Type   | Required | Validation                      |
|----------|--------|----------|---------------------------------|
| email    | String | Yes      | Must be a valid email address   |
| password | String | Yes      | Minimum 6 characters            |

---

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Body:**
```json
{
  "token": "your-jwt-token-here",
  "captain": {
    "_id": "captainId",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "captain@example.com",
    "password": "hashedPassword",
    "socketId": null,
    "status": "active",
    "vehicle": {
      "color": "Red",
      "plate": "XYZ123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "__v": 0
  }
}
```

#### Error Responses

| Status Code | Description                                  | Example                                      |
|-------------|----------------------------------------------|----------------------------------------------|
| 400 Bad Request | Validation errors or invalid credentials | `{ "errors": [...] }` or `{ "error": "Invalid email or password" }` |
| 500 Server Error | Server-side issue                        | `{ "error": "Internal server error" }`       |

---

### Notes
- Always send the JWT token in the Authorization header (Bearer token) for protected captain routes after login.
- Passwords are securely hashed and compared.


---



## Endpoint: `/captains/profile`

### Description
Retrieves the profile details of the currently authenticated captain. Requires a valid JWT token for authentication.

---

### Request Method
**GET**

---

### Request Headers
- **Authorization:** `Bearer <JWT token>`

---

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Body:**
```json
{
  "captain": {
    "_id": "captainId",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "captain@example.com",
    "socketId": null,
    "status": "active",
    "vehicle": {
      "color": "Red",
      "plate": "XYZ123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "__v": 0
  }
}
```

#### Error Responses

| Status Code | Description                                  | Example                                      |
|-------------|----------------------------------------------|----------------------------------------------|
| 401 Unauthorized | Missing or invalid token                 | `{ "message": "Unauthorized" }`              |
| 404 Not Found    | Captain not found                        | `{ "error": "Captain not found" }`           |
| 500 Server Error | Server-side issue                        | `{ "error": "Internal server error" }`       |

---

### Notes
- Ensure the JWT token is sent in the `Authorization` header.
- The token must not be blacklisted or expired.


---



## Endpoint: `/captains/logout`

### Description
Logs out the currently authenticated captain by blacklisting the JWT token and clearing the `token` cookie.

---

### Request Method
**GET**

---

### Request Headers
- **Authorization:** `Bearer <JWT token>` (or as a cookie)

---

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Body:**
```json
{
  "message": "Logged out successfully"
}
```

#### Error Responses

| Status Code | Description                                  | Example                                      |
|-------------|----------------------------------------------|----------------------------------------------|
| 401 Unauthorized | Missing or invalid token                 | `{ "message": "Unauthorized" }`              |
| 500 Server Error | Server-side issue                        | `{ "error": "Internal server error" }`       |

---

### Notes
- After logout, the JWT token will be blacklisted and cannot be used again.
- Ensure the JWT token is sent in the `Authorization` header or as a