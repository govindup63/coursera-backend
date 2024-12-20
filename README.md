# Course Management API

A robust backend API for managing online courses, handling both admin and user operations. Built with Express.js and MongoDB, this API provides secure authentication and comprehensive course management features.

## Features

### Admin Operations
- **Authentication**
  - Secure signup with email validation
  - JWT-based signin system
  - Protected routes with admin authentication

- **Course Management**
  - Create new courses with detailed information
  - Update existing course details
  - View all courses created by the admin
  - Input validation for course data

### User Operations
- **Authentication**
  - User signup with email validation
  - Secure signin with JWT tokens
  - Protected user routes

- **Course Access**
  - Browse available courses
  - Purchase courses
  - View purchased courses
  - Track course enrollment history

## Technology Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- bcrypt for password hashing
- JWT for authentication
- Zod for input validation

## API Endpoints

### Admin Routes

```
POST /admin/signup
POST /admin/signin
POST /admin/course
PUT /admin/course
GET /admin/course/bulk
```

### User Routes

```
POST /user/signup
POST /user/signin
GET /user/purchases
```

### Course Routes

```
POST /course/purchase
GET /course/preview
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/govindup63/coursera-backend.git
   ```

2. Install dependencies:
   ```bash
   cd coursera-backend
   npm install
   ```

3. Set up environment variables:
   ```env
   JWT_ADMIN_SECRET=your_admin_secret
   JWT_USER_SECRET=your_user_secret
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Usage

### Admin Authentication

```javascript
// Admin Signup
POST /admin/signup
{
    "firstName": "string",
    "lastName": "string",
    "email": "admin@example.com",
    "password": "string"
}

// Admin Signin
POST /admin/signin
{
    "email": "admin@example.com",
    "password": "string"
}
```

### Course Management

```javascript
// Create Course
POST /admin/course
{
    "title": "string",
    "description": "string",
    "price": number,
    "imageUrl": "string"
}

// Update Course
PUT /admin/course
{
    "courseId": "string",
    "title": "string",
    "description": "string",
    "price": number,
    "imageUrl": "string"
}
```

### User Operations

```javascript
// User Signup
POST /user/signup
{
    "firstName": "string",
    "lastName": "string",
    "email": "user@example.com",
    "password": "string"
}

// Purchase Course
POST /course/purchase
{
    "courseId": "string"
}
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Input validation using Zod
- Protected routes with middleware authentication
- Separate JWT secrets for admin and user authentication

## Error Handling

The API includes comprehensive error handling for:
- Invalid input validation
- Authentication failures
- Database operation errors
- Course creation and update errors
- Purchase verification

## Contributing

Feel free to submit issues and pull requests to improve the API.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
