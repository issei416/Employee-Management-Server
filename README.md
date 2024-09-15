# 🛠️ Employee Management System - Backend

This is the backend for the Employee Management System project, built with Node.js and Express. It provides RESTful API endpoints for managing employee data, attendance, and leave records.

## 🚀 Features

- **User Authentication**: Secure login with JWT (JSON Web Token) authentication.
- **Employee Management**: Manage employee details, profiles, and roles.
- **Attendance Tracking**: Track employee attendance and working hours.
- **Leave Management**: Handle employee leave requests and records.
- **Project Management**: Manage project assignments for employees.
- **Profile Picture Upload**: Employees can upload and update their profile pictures.

## 🧰 Tech Stack

- **Node.js**: The JavaScript runtime used for building the server-side logic.
- **Express.js**: A fast, unopinionated web framework for Node.js.
- **MongoDB**: NoSQL database for storing employee, attendance, leave, and project data.
- **JWT**: JSON Web Tokens used for secure authentication.
- **Multer**: Middleware for handling `multipart/form-data`, primarily for profile picture uploads.
- **Render**: Hosting platform for deploying the backend server.

## 📂 Environment Variables

The following environment variables should be set in your `.env` file:

```bash
PORT=4000
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret Key>
TZ=<Your Time zone>
```

## 📦 Dependencies

* **axios**:  
 For making HTTP requests to external services.
* **bcryptj**:  
 For hashing passwords before storing them in the database.
* **cors**:  
 To enable Cross-Origin Resource Sharing.
* **dotenv**:  
 For loading environment variables from .env files.
* **express**:  
 Web framework used for routing and middleware handling.
* **jsonwebtoken**:  
 For generating and verifying JWT tokens.
* **mongoose**:  
 MongoDB object modeling tool for Node.js.
* **multer**:  
 For handling file uploads, including profile pictures.