# iBox Backend - File Storage & Management System

A modern, scalable backend API for a cloud-based file storage and management application built with Express.js, MongoDB, and Cloudinary.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Security](#security)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## ✨ Features

### Core Functionality
- **User Authentication** - Secure JWT-based authentication with password hashing
- **File Management** - Upload, download, rename, and delete files
- **File Organization** - Automatic file type categorization (documents, images, videos, others)
- **Cloud Storage** - Integration with Cloudinary for reliable file storage
- **Dashboard Analytics** - Real-time storage usage and file statistics
- **Rate Limiting** - DDoS protection with rate limiting on auth routes
- **Pagination** - Efficient file listing with pagination support

### Storage Features
- **10GB Storage Quota** - Per-user storage limit with percentage tracking
- **File Type Detection** - Automatic MIME type detection and categorization
- **Metadata Tracking** - Creation date, file size, file count by type
- **Recent Files** - Quick access to 5 most recently uploaded files

### Security Features
- 🔐 Password hashing with bcryptjs (10 salt rounds)
- 🔑 JWT tokens with 1-day expiration
- 🍪 HttpOnly cookies (CSRF-safe)
- 🚫 Rate limiting (100 requests per 15 minutes)
- 🔒 Authenticated routes (middleware validation)
- 👤 User ownership verification on file operations

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5.2.1
- **Language:** JavaScript (ES Modules)

### Database & Storage
- **Database:** MongoDB v9.0.2
- **ODM:** Mongoose v9.0.2
- **File Storage:** Cloudinary v2.8.0
- **File Upload:** Multer v2.0.2

### Authentication & Security
- **JWT:** jsonwebtoken v9.0.3
- **Password Hashing:** bcryptjs v3.0.3
- **Rate Limiting:** express-rate-limit v8.2.1
- **Email Validation:** validator v13.15.26
- **CORS:** cors v2.8.5

### Development Tools
- **Dev Server:** Nodemon v3.1.11
- **Environment:** dotenv v17.2.3
- **Cookie Parser:** cookie-parser v1.4.7

---

## 📁 Project Structure

```
iBox-backend/
│
├── backend/
│   ├── server.js                      # Main Express server entry point
│   │
│   ├── config/                        # Configuration files
│   │   ├── cloudinary.js              # Cloudinary setup and initialization
│   │   └── database.js                # MongoDB connection
│   │
│   ├── controllers/                   # Business logic
│   │   ├── authController.js          # Authentication (register, login, user profile)
│   │   ├── dashboardController.js     # Dashboard analytics and statistics
│   │   ├── fileController.js          # File operations (upload, list by type)
│   │   └── handleController.js        # File operations (rename, delete)
│   │
│   ├── models/                        # Database schemas
│   │   ├── user.js                    # User schema with validation
│   │   └── file.js                    # File schema with references
│   │
│   ├── routes/                        # API routes
│   │   ├── authRoutes.js              # Authentication endpoints
│   │   ├── dashboardRoutes.js         # Dashboard endpoints
│   │   └── fileRoutes.js              # File management endpoints
│   │
│   ├── middleware/                    # Custom middleware
│   │   ├── auth.js                    # JWT authentication middleware
│   │   ├── limiter.js                 # Rate limiting middleware
│   │   └── upload.js                  # Multer file upload configuration
│   │
│   └── utils/                         # Utility functions
│       └── fileType.js                # MIME type detection helper
│
├── package.json                       # Dependencies and scripts
├── .env                               # Environment variables (git ignored)
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
└── README.md                          # This file

```

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18+ and npm v9+
- **MongoDB** v5.0+ (local or Atlas cloud)
- **Cloudinary** account (free tier available)
- **Git** for version control

### Verify Installation

```bash
node --version      # Should be v18 or higher
npm --version       # Should be v9 or higher
mongod --version    # If using local MongoDB
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ibox-backend.git
cd ibox-backend
```

### 2. Install Dependencies

```bash
npm install
```

This installs all dependencies listed in `package.json`:
```
bcryptjs          - Password hashing
cloudinary        - Cloud file storage
cors              - Cross-origin requests
express           - Web framework
express-rate-limit - Rate limiting
jsonwebtoken      - JWT authentication
mongoose          - MongoDB ODM
multer            - File upload handling
validator         - Input validation
dotenv            - Environment variables
cookie-parser     - Cookie parsing
nodemon           - Development auto-reload
```

### 3. Create Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values (see [Configuration](#configuration) section)

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ibox-db
# OR use MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ibox-db

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Storage Configuration
STORAGE_LIMIT_GB=10
MAX_FILE_SIZE_MB=50
```

### Detailed Configuration Guide

#### 1. **MongoDB Setup**

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
# Connection string: mongodb://localhost:27017/ibox-db
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/cloud](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string from Atlas dashboard
4. Replace `<username>` and `<password>` with your credentials

#### 2. **Cloudinary Setup**

1. Sign up at [cloudinary.com](https://cloudinary.com/users/register/free)
2. Go to Dashboard
3. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret
4. Add to `.env`

#### 3. **JWT Secret**

Generate a secure JWT secret:

```bash
# On macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ▶️ Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

Output:
```
✓ MongoDB connected
✓ Server is running on port 5000
```

### Production Mode

```bash
npm start
```

### Access the Server

- **Base URL:** `http://localhost:5000`
- **API Prefix:** `/api`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format

All endpoints return JSON responses with the following format:

**Success (2xx):**
```json
{
  "data": { /* response data */ },
  "message": "Success message"
}
```

**Error (4xx/5xx):**
```json
{
  "message": "Error description"
}
```

---

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully"
}
```

**Errors:**
- `400` - Missing fields or email already exists
- `400` - Invalid email format

---

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login success"
}
```

**Sets Cookie:**
```
Set-Cookie: token=<jwt_token>; HttpOnly; SameSite=Lax
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

---

#### Get User Profile
```http
GET /auth/get
Cookie: token=<jwt_token>

```

**Response (200):**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Errors:**
- `401` - Invalid or expired token
- `500` - Server error

---

### File Endpoints

#### Upload File
```http
POST /files/upload
Content-Type: multipart/form-data
Authorization: Bearer token

file: <binary_file_data>
```

**Query Parameters:**
- `file` (required) - File to upload (max 50MB)

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439010",
  "name": "document.pdf",
  "url": "https://res.cloudinary.com/.../document.pdf",
  "publicId": "storage_app/document_abc123",
  "size": 2048576,
  "type": "document",
  "createdAt": "2024-02-05T10:30:00Z",
  "updatedAt": "2024-02-05T10:30:00Z"
}
```

**Errors:**
- `400` - No file provided
- `401` - Unauthorized
- `500` - Upload failed

---

#### Get Images
```http
GET /files/images?page=1&limit=10
Cookie: token=<jwt_token>
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "photo.jpg",
    "url": "https://res.cloudinary.com/.../photo.jpg",
    "size": 1024000,
    "date": "2024-02-05T10:30:00Z"
  }
]
```

---

#### Get Documents
```http
GET /files/document
Cookie: token=<jwt_token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "report.pdf",
    "url": "https://res.cloudinary.com/.../report.pdf",
    "size": 2048576,
    "date": "2024-02-05T10:30:00Z"
  }
]
```

---

#### Get Videos
```http
GET /files/videos
Cookie: token=<jwt_token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "tutorial.mp4",
    "url": "https://res.cloudinary.com/.../tutorial.mp4",
    "size": 50000000,
    "date": "2024-02-05T10:30:00Z"
  }
]
```

---

#### Get Other Files
```http
GET /files/other
Cookie: token=<jwt_token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "archive.zip",
    "url": "https://res.cloudinary.com/.../archive.zip",
    "size": 10485760,
    "date": "2024-02-05T10:30:00Z"
  }
]
```

---

#### Rename File
```http
PATCH /files/:id/rename
Content-Type: application/json
Cookie: token=<jwt_token>

{
  "newName": "new_filename.pdf"
}
```

**Path Parameters:**
- `id` (required) - File ID

**Response (200):**
```json
{
  "message": "File renamed successfully",
  "file": { /* file object */ }
}
```

**Errors:**
- `400` - Empty filename
- `404` - File not found
- `401` - Unauthorized
- `500` - Rename failed

---

#### Delete File
```http
DELETE /files/:id
Cookie: token=<jwt_token>
```

**Path Parameters:**
- `id` (required) - File ID

**Response (200):**
```json
{
  "message": "File deleted successfully"
}
```

**Errors:**
- `404` - File not found
- `401` - Unauthorized
- `500` - Delete failed

---

### Dashboard Endpoints

#### Get Dashboard Analytics
```http
GET /dashboard
Cookie: token=<jwt_token>
```

**Response (200):**
```json
{
  "storage": {
    "total": 10,
    "used": 3.45,
    "usedPercentage": 35
  },
  "documents": {
    "files": 5,
    "date": "2024-02-05, 10:30:00 AM"
  },
  "images": {
    "files": 12,
    "date": "2024-02-04, 3:15:00 PM"
  },
  "videos": {
    "files": 2,
    "date": "2024-02-03, 9:45:00 AM"
  },
  "other": {
    "files": 3,
    "date": "2024-02-02, 2:20:00 PM"
  },
  "recent": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "presentation.pptx",
      "date": "2024-02-05, 10:30:00 AM"
    }
  ]
}
```

**Errors:**
- `401` - Unauthorized
- `500` - Failed to fetch dashboard

---

## 🗄️ Database Schema

### User Schema

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase, validated),
  password: String (required, hashed),
  totalStorageUsed: String (default: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `email` (unique)

**Methods:**
- `getJWT()` - Generate JWT token
- `validatePassword(password)` - Compare password with hash

---

### File Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, references User),
  name: String,
  url: String,
  publicId: String (Cloudinary ID),
  size: Number,
  type: String (enum: "document", "image", "video", "other"),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `userId` (for fast user file queries)
- Compound: `userId + type` (for filtered queries)

**File Types:**
- `document` - PDF, Word, Excel files
- `image` - JPG, PNG, GIF, WebP, etc.
- `video` - MP4, AVI, MKV, MOV, WebM
- `other` - All other file types

---

## 🔧 Middleware

### Authentication Middleware (`middleware/auth.js`)

Verifies JWT tokens from cookies and attaches user info to request.

```javascript
// Usage in routes
router.get("/protected", authMiddleware, controllerFunction)

// req.user is now available
{
  id: "507f1f77bcf86cd799439010"
}
```

**Returns:**
- `401` - Invalid or expired token

---

### Rate Limiter Middleware (`middleware/limiter.js`)

Protects endpoints from abuse.

**Configuration:**
- Window: 15 minutes
- Max requests: 100 per window

**Applied to:**
- `POST /auth/register`
- `POST /auth/login`

---

### Upload Middleware (`middleware/upload.js`)

Handles file uploads with Multer.

**Configuration:**
- Storage: Memory storage (for Cloudinary)
- Max file size: 50MB
- Access: `.single("file")` for single file upload

---

## 🛡️ Error Handling

### Error Response Format

```json
{
  "message": "Descriptive error message"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| `200` | OK | File fetched, upload successful |
| `201` | Created | User registered, file uploaded |
| `204` | No Content | Successful delete (empty response) |
| `400` | Bad Request | Missing fields, invalid input |
| `401` | Unauthorized | Invalid token, wrong credentials |
| `403` | Forbidden | File belongs to another user |
| `404` | Not Found | User/file doesn't exist |
| `500` | Server Error | Database connection failed |

### Common Error Scenarios

**Missing Authentication:**
```json
{
  "message": "User not authenticated"
}
```

**Invalid File:**
```json
{
  "message": "File not found"
}
```

**Validation Error:**
```json
{
  "message": "All fields are required"
}
```

---

## 🔐 Security

### Password Security

- Hashed with bcryptjs (10 salt rounds)
- Never stored in plaintext
- Compared with `bcrypt.compare()` during login

### JWT Security

- Token payload: `{ id: user._id }`
- Expiration: 1 day
- Stored in HttpOnly cookie (prevents XSS)
- Signed with secret key

### CORS Security

- Configured for specific origin (frontend URL)
- Credentials enabled for cookie transmission
- Prevents unauthorized cross-origin requests

### Rate Limiting

- 100 requests per 15 minutes on auth endpoints
- Prevents brute force attacks
- Prevents DoS attacks

### Input Validation

- Email validation using validator.js
- MongoDB ObjectId validation
- Filename sanitization
- File type checking via MIME detection

### Authorization

- User ownership verification on file operations
- File operations scoped to authenticated user
- Dashboard data isolated per user

---

## 📖 Contributing

### Code Style

- **Language:** ES6+ JavaScript
- **Modules:** ES Modules (import/export)
- **Naming:** camelCase for variables, PascalCase for classes
- **Async:** Always use async/await, avoid callbacks

### Adding New Endpoints

1. Create controller function in `controllers/`
2. Add route in `routes/`
3. Apply middleware as needed
4. Update this README with endpoint documentation
5. Test with curl or Postman

### Commit Messages

```
feat: Add new feature
fix: Fix bug in component
docs: Update documentation
refactor: Reorganize code
test: Add tests
```

---

## 🔍 Troubleshooting

### MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
mongod

# Or verify MongoDB Atlas connection string
# Ensure IP whitelist includes your current IP
```

### Cloudinary Upload Fails

**Error:** `UnauthorizedError` or `Invalid credentials`

**Solution:**
- Verify Cloudinary credentials in `.env`
- Ensure API secret is correct (check Cloudinary dashboard)
- Check folder permissions

### JWT Token Expired

**Error:** `401 Invalid or expired token`

**Solution:**
- User needs to login again to get new token
- Implement refresh token endpoint for better UX

### File Size Exceeds Limit

**Error:** `413 Payload Too Large`

**Solution:**
- Increase `fileSize` limit in `middleware/upload.js`
- Update `MAX_FILE_SIZE_MB` in `.env`
- Note: Cloudinary free tier has storage limits

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Ensure frontend URL in `.env` matches client URL
- Add credentials to fetch requests
- Check CORS configuration in `server.js`

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 📞 Support

For issues, bugs, or feature requests, please:
1. Check the troubleshooting section
2. Review the API documentation
3. Check existing issues on GitHub
4. Create a new issue with detailed description

---

**Last Updated:** February 5, 2026  
**Version:** 1.0.0
