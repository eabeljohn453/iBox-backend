# iBox Backend - Complete API Documentation

## Quick Reference

**Base URL:** `http://localhost:5000/api`

**Authentication:** JWT in HttpOnly cookie (automatically included)

**Content Type:** `application/json` (except file uploads)

---

## Table of Contents

- [Authentication Endpoints](#authentication-endpoints)
- [File Management Endpoints](#file-management-endpoints)
- [Dashboard Endpoints](#dashboard-endpoints)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)
- [Examples](#examples)

---npm install
cp .env.example .env
# Edit .env with your values
npm run dev

## Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Rate Limited:** Yes (100 requests per 15 minutes)

**Description:** Create a new user account

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Request Validation:**
- `name` - Required, string, 1-255 characters
- `email` - Required, valid email format, must be unique
- `password` - Required, string, minimum 6 characters recommended

**Response (201 Created):**
```json
{
  "message": "user created"
}
```

**Response (400 Bad Request):**
```json
{
  "message": "required all fields"
}
```
```json
{
  "message": "email already exists"
}
```
```json
{
  "message": "invalid email"
}
```

**Response (500 Server Error):**
```json
{
  "message": "error occured"
}
```

**Error Codes:**
| Code | Reason |
|------|--------|
| 400 | Missing required fields |
| 400 | Email already exists |
| 400 | Invalid email format |
| 500 | Server error during registration |

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

---

### 2. Login User

**Endpoint:** `POST /auth/login`

**Rate Limited:** Yes (100 requests per 15 minutes)

**Description:** Authenticate user and receive JWT token in cookie

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Request Validation:**
- `email` - Required, valid email format
- `password` - Required, non-empty string

**Response (200 OK):**
```json
{
  "message": "Login success"
}
```

**Response Cookie:**
```
Set-Cookie: token=<jwt_token>; HttpOnly; SameSite=Lax; Path=/
```

**Response (400 Bad Request):**
```json
{
  "message": "Email and password required"
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

**Response (500 Server Error):**
```json
{
  "message": "Server error"
}
```

**Error Codes:**
| Code | Reason |
|------|--------|
| 400 | Missing email or password |
| 401 | Email not found |
| 401 | Password incorrect |
| 500 | Server error during login |

**JWT Token Structure:**
```javascript
{
  id: "507f1f77bcf86cd799439010",
  iat: 1707128400,           // Issued at
  exp: 1707214800            // Expires in 1 day
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

---

### 3. Get User Profile

**Endpoint:** `GET /auth/get`

**Authentication:** Required (JWT token in cookie)

**Description:** Fetch authenticated user's profile information

**Headers:**
```
Cookie: token=<jwt_token>
```

**Query Parameters:** None

**Request Body:** None

**Response (200 OK):**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired token"
}
```

**Response (500 Server Error):**
```json
{
  "message": "error"
}
```

**Error Codes:**
| Code | Reason |
|------|--------|
| 401 | Missing token |
| 401 | Invalid token |
| 401 | Expired token |
| 500 | Database error |

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/get \
  -b cookies.txt
```

---

## File Management Endpoints

### 1. Upload File

**Endpoint:** `POST /files/upload`

**Authentication:** Required (JWT token in cookie)

**Rate Limited:** No (use rate limiting on frontend)

**Description:** Upload a single file to cloud storage

**Headers:**
```
Content-Type: multipart/form-data
Cookie: token=<jwt_token>
```

**Request Body:**
```
file: <binary_file_data>
```

**Form Parameters:**
- `file` - Required, binary file data, max 50MB

**Supported File Types:**
- **Images:** JPG, JPEG, PNG, GIF, WebP, BMP, SVG
- **Videos:** MP4, AVI, MKV, MOV, WebM, FLV, WMV
- **Audio:** MP3, WAV, AAC, FLAC, OGG
- **Documents:** PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Other:** ZIP, RAR, 7Z, TAR, and any other file type

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439010",
  "name": "document.pdf",
  "url": "https://res.cloudinary.com/dxyz1234/image/upload/v1707128400/storage_app/document_abc.pdf",
  "publicId": "storage_app/document_abc123",
  "size": 2048576,
  "type": "document",
  "createdAt": "2024-02-05T10:30:00.000Z",
  "updatedAt": "2024-02-05T10:30:00.000Z",
  "__v": 0
}
```

**Response (400 Bad Request):**
```json
{
  "message": "no file provided"
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired token"
}
```

**Response (500 Server Error):**
```json
{
  "message": "Upload failed"
}
```

**File Type Categories:**
```javascript
// Determined by MIME type
"image"    → image/* (all image formats)
"video"    → video/*, audio/* (videos and audio)
"document" → PDF, Word, Excel files
"other"    → All other file types
```

**Error Codes:**
| Code | Reason |
|------|--------|
| 400 | No file provided |
| 400 | File size exceeds 50MB |
| 401 | Invalid/expired token |
| 500 | Cloudinary upload failed |
| 500 | Database save failed |

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/files/upload \
  -b cookies.txt \
  -F "file=@/path/to/file.pdf"
```

**JavaScript Fetch Example:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/files/upload', {
  method: 'POST',
  credentials: 'include',
  body: formData
});

const result = await response.json();
console.log(result._id);  // File ID in database
```

---

### 2. Get Images

**Endpoint:** `GET /files/images`

**Authentication:** Required (JWT token in cookie)

**Description:** Retrieve all images uploaded by authenticated user

**Headers:**
```
Cookie: token=<jwt_token>
```

**Query Parameters:**
```
?page=1&limit=10
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Integer | 1 | Page number for pagination |
| `limit` | Integer | 10 | Items per page |

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "vacation_photo.jpg",
    "url": "https://res.cloudinary.com/.../vacation_photo.jpg",
    "size": 1024000,
    "date": "2024-02-05T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "profile_pic.png",
    "url": "https://res.cloudinary.com/.../profile_pic.png",
    "size": 512000,
    "date": "2024-02-04T15:45:00Z"
  }
]
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired token"
}
```

**Response (500 Server Error):**
```json
{
  "message": "error occured"
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/files/images?page=1&limit=10" \
  -b cookies.txt
```

---

### 3. Get Documents

**Endpoint:** `GET /files/document`

**Authentication:** Required (JWT token in cookie)

**Description:** Retrieve all documents uploaded by authenticated user

**Headers:**
```
Cookie: token=<jwt_token>
```

**Query Parameters:** None

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "report.pdf",
    "url": "https://res.cloudinary.com/.../report.pdf",
    "size": 2048576,
    "date": "2024-02-05T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "spreadsheet.xlsx",
    "url": "https://res.cloudinary.com/.../spreadsheet.xlsx",
    "size": 512000,
    "date": "2024-02-04T15:45:00Z"
  }
]
```

**Included Document Types:**
- PDF files
- Microsoft Word (DOC, DOCX)
- Microsoft Excel (XLS, XLSX)
- Microsoft PowerPoint (PPT, PPTX)

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/files/document \
  -b cookies.txt
```

---

### 4. Get Videos

**Endpoint:** `GET /files/videos`

**Authentication:** Required (JWT token in cookie)

**Description:** Retrieve all videos uploaded by authenticated user

**Headers:**
```
Cookie: token=<jwt_token>
```

**Query Parameters:** None

**Response (200 OK):**
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

**Included Video/Audio Types:**
- Video formats: MP4, AVI, MKV, MOV, WebM, FLV, WMV
- Audio formats: MP3, WAV, AAC, FLAC, OGG

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/files/videos \
  -b cookies.txt
```

---

### 5. Get Other Files

**Endpoint:** `GET /files/other`

**Authentication:** Required (JWT token in cookie)

**Description:** Retrieve all uncategorized files uploaded by authenticated user

**Headers:**
```
Cookie: token=<jwt_token>
```

**Query Parameters:** None

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "archive.zip",
    "url": "https://res.cloudinary.com/.../archive.zip",
    "size": 10485760,
    "date": "2024-02-05T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "config.json",
    "url": "https://res.cloudinary.com/.../config.json",
    "size": 2048,
    "date": "2024-02-04T15:45:00Z"
  }
]
```

**Other File Types:**
- Archives: ZIP, RAR, 7Z, TAR, GZIP
- Code: JS, PY, JSON, XML, YAML, HTML, CSS
- Data: CSV, SQL, TXT
- Any other unrecognized file type

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/files/other \
  -b cookies.txt
```

---

### 6. Rename File

**Endpoint:** `PATCH /files/:id/rename`

**Authentication:** Required (JWT token in cookie)

**Description:** Rename an uploaded file

**Headers:**
```
Content-Type: application/json
Cookie: token=<jwt_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | String | MongoDB ObjectId of the file |

**Request Body:**
```json
{
  "newName": "renamed_document.pdf"
}
```

**Request Validation:**
- `newName` - Required, non-empty string
- File must belong to authenticated user

**Response (201 Created):**
```json
{
  "message": "name chaned",
  "File": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439010",
    "name": "renamed_document.pdf",
    "url": "https://res.cloudinary.com/.../document.pdf",
    "publicId": "storage_app/document_abc123",
    "size": 2048576,
    "type": "document",
    "createdAt": "2024-02-05T10:30:00Z",
    "updatedAt": "2024-02-05T10:35:00Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "message": "enter the name"
}
```

**Response (404 Not Found):**
```json
{
  "message": "File not found"
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired token"
}
```

**Response (500 Server Error):**
```json
{
  "message": "Rename failed"
}
```

**Error Codes:**
| Code | Reason |
|------|--------|
| 400 | Empty filename |
| 400 | Whitespace-only filename |
| 404 | File not found |
| 401 | Invalid token |
| 500 | Database update failed |

**cURL Example:**
```bash
curl -X PATCH http://localhost:5000/api/files/507f1f77bcf86cd799439011/rename \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "newName": "new_filename.pdf"
  }'
```

---

### 7. Delete File

**Endpoint:** `DELETE /files/:id`

**Authentication:** Required (JWT token in cookie)

**Description:** Permanently delete an uploaded file

**Headers:**
```
Cookie: token=<jwt_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | String | MongoDB ObjectId of the file |

**Request Body:** None

**Response (200 OK):**
```json
{
  "message": "File deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "message": "file not found"
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired token"
}
```

**Response (500 Server Error):**
```json
{
  "message": "Delete failed"
}
```

**What Gets Deleted:**
1. File from Cloudinary cloud storage
2. File metadata from MongoDB database
3. Storage space reclaimed for user quota

**Error Codes:**
| Code | Reason |
|------|--------|
| 404 | File ID doesn't exist |
| 401 | Invalid token |
| 500 | Cloudinary deletion failed |
| 500 | Database deletion failed |

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/files/507f1f77bcf86cd799439011 \
  -b cookies.txt
```

---

## Dashboard Endpoints

### Get Dashboard Analytics

**Endpoint:** `GET /dashboard`

**Authentication:** Required (JWT token in cookie)

**Description:** Retrieve user's storage statistics and file analytics

**Headers:**
```
Cookie: token=<jwt_token>
```

**Query Parameters:** None

**Request Body:** None

**Response (200 OK):**
```json
{
  "storage": {
    "total": 10,
    "used": 3.45,
    "usedPercentage": 34
  },
  "documents": {
    "files": 5,
    "date": "2/5/2024, 10:30:00 AM"
  },
  "images": {
    "files": 12,
    "date": "2/4/2024, 3:15:00 PM"
  },
  "videos": {
    "files": 2,
    "date": "2/3/2024, 9:45:00 AM"
  },
  "other": {
    "files": 3,
    "date": "2/2/2024, 2:20:00 PM"
  },
  "recent": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "presentation.pptx",
      "date": "2/5/2024, 10:30:00 AM"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "photo.jpg",
      "date": "2/4/2024, 3:15:00 PM"
    }
  ]
}
```

**Response Fields:**

**storage object:**
- `total` (Number, GB) - Total storage quota
- `used` (Number, GB) - Used storage (2 decimal places)
- `usedPercentage` (Number, 0-100) - Percentage of quota used

**documents, images, videos, other objects:**
- `files` (Number) - Count of files in category
- `date` (String, localized) - Latest upload date in category, or "-" if empty

**recent array:**
- `id` (String) - File MongoDB ID
- `name` (String) - Original filename
- `date` (String, localized) - Upload timestamp
- Array contains up to 5 most recent files

**Response (401 Unauthorized):**
```json
{
  "message": "User not authenticated"
}
```

**Response (400 Bad Request):**
```json
{
  "message": "Invalid user ID format"
}
```

**Response (500 Server Error):**
```json
{
  "message": "Failed to fetch dashboard data"
}
```

**Calculation Details:**

Storage Metrics:
```javascript
// Storage calculation
totalBytes = SUM(file.size) for all user files
usedGB = totalBytes / (1024^3)
usedPercentage = ROUND((usedGB / 10) * 100)

// File type latest upload
latestUploadDate = MAX(file.createdAt) for each type

// Recent files
recent = ORDER BY createdAt DESC LIMIT 5
```

**Error Codes:**
| Code | Reason |
|------|--------|
| 401 | Missing/invalid token |
| 400 | Invalid MongoDB ObjectId format |
| 500 | Database aggregation failed |
| 500 | Cloudinary connection failed |

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -b cookies.txt
```

**JavaScript Fetch Example:**
```javascript
const response = await fetch('http://localhost:5000/api/dashboard', {
  method: 'GET',
  credentials: 'include'
});

const data = await response.json();
console.log(`Storage Used: ${data.storage.used}GB / ${data.storage.total}GB`);
console.log(`Images: ${data.images.files}`);
console.log(`Documents: ${data.documents.files}`);
```

---

## Response Formats

### Success Response

**For single object:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-02-05T10:30:00Z"
}
```

**For arrays:**
```json
[
  { /* object 1 */ },
  { /* object 2 */ }
]
```

**For messages:**
```json
{
  "message": "Success message"
}
```

**For dashboard:**
```json
{
  "storage": { /* nested object */ },
  "documents": { /* nested object */ },
  "recent": [ /* array */ ]
}
```

### Error Response

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, successful operations |
| 201 | Created | User registered, file uploaded |
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Invalid/expired token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected server error |

---

## Examples

### Complete Authentication Flow

**1. Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "SecurePass123"
  }' \
  -c cookies.txt
```

**2. Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "SecurePass123"
  }' \
  -c cookies.txt
```

**3. Get Profile**
```bash
curl -X GET http://localhost:5000/api/auth/get \
  -b cookies.txt
```

### Complete File Operations Flow

**1. Upload File**
```bash
curl -X POST http://localhost:5000/api/files/upload \
  -b cookies.txt \
  -F "file=@resume.pdf"
```

**2. Get Documents**
```bash
curl -X GET http://localhost:5000/api/files/document \
  -b cookies.txt
```

**3. Rename File** (use ID from upload response)
```bash
curl -X PATCH http://localhost:5000/api/files/507f1f77bcf86cd799439011/rename \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "newName": "My Resume.pdf"
  }'
```

**4. Delete File**
```bash
curl -X DELETE http://localhost:5000/api/files/507f1f77bcf86cd799439011 \
  -b cookies.txt
```

**5. View Dashboard**
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -b cookies.txt
```

---

## Testing Tools

**Recommended Tools:**
- **Postman** - GUI for API testing with collections
- **Insomnia** - Alternative to Postman
- **curl** - Command-line HTTP client
- **VS Code REST Client** - Extension for .http files
- **Thunder Client** - Lightweight VS Code extension

**Testing Collection:**
Consider importing these endpoints into Postman as a collection for easy testing and documentation.

---

**Last Updated:** February 5, 2026  
**Version:** 1.0.0
