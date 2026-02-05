# iBox Backend - Architecture Documentation

## System Overview

iBox Backend is a cloud-based file storage and management API built on a modern Node.js stack with MongoDB and Cloudinary integration.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT/FRONTEND                         │
│                     (React/Vue/Angular SPA)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    HTTP/HTTPS (REST API)
                             │
        ┌────────────────────▼────────────────────┐
        │     Express.js Server (Node.js)         │
        │          Port: 5000                     │
        │                                         │
        │  ┌─────────────────────────────────┐   │
        │  │       Routes Layer              │   │
        │  │  • authRoutes.js                │   │
        │  │  • fileRoutes.js                │   │
        │  │  • dashboardRoutes.js           │   │
        │  └─────────────────────────────────┘   │
        │                  │                      │
        │  ┌──────────────▼──────────────────┐   │
        │  │     Middleware Layer            │   │
        │  │  • auth.js (JWT verification)  │   │
        │  │  • upload.js (Multer)          │   │
        │  │  • limiter.js (Rate limit)     │   │
        │  └─────────────────────────────────┘   │
        │                  │                      │
        │  ┌──────────────▼──────────────────┐   │
        │  │    Controllers Layer            │   │
        │  │  • authController.js           │   │
        │  │  • fileController.js           │   │
        │  │  • handleController.js         │   │
        │  │  • dashboardController.js      │   │
        │  └─────────────────────────────────┘   │
        │                  │                      │
        │  ┌──────────────▼──────────────────┐   │
        │  │     Models/Schema Layer         │   │
        │  │  • User Model                  │   │
        │  │  • File Model                  │   │
        │  │  • Validation Logic            │   │
        │  └─────────────────────────────────┘   │
        └────────────────────┬────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         ┌──────▼────────┐      ┌────────▼───────┐
         │    MongoDB    │      │  Cloudinary    │
         │    Database   │      │  File Storage  │
         │               │      │                │
         │  ┌─────────┐  │      │  ┌──────────┐  │
         │  │  Users  │  │      │  │  Buckets │  │
         │  ├─────────┤  │      │  └──────────┘  │
         │  │ Files   │  │      │  ┌──────────┐  │
         │  └─────────┘  │      │  │ Assets   │  │
         └───────────────┘      └──────────────┘

```

---

## Layer Architecture (Clean Code)

### 1. **Routes Layer** (API Entry Points)

**Files:** `routes/*.js`

**Responsibility:**
- Define HTTP endpoints
- Apply middleware to routes
- Route incoming requests to controllers

**Design Pattern:** Separation of concerns

```
Request → Routes → Middleware → Controllers
```

**Example Flow:**
```
POST /api/files/upload
  ↓
[fileRoutes.js] Defines route
  ↓
[auth.js] Verify JWT token
  ↓
[upload.js] Process file upload
  ↓
[uploadFile controller] Business logic
```

---

### 2. **Middleware Layer** (Request Processing)

**Files:** `middleware/*.js`

**Core Middleware:**

#### **auth.js** - JWT Authentication
- Extracts JWT from cookies
- Validates token signature and expiration
- Attaches user info to `req.user`
- Returns 401 if invalid

```javascript
// Flow
Request with cookie: token=<jwt>
  ↓
JWT decoded and verified
  ↓
req.user = { id: user_id }
  ↓
Passes to next middleware/controller
```

#### **upload.js** - File Upload Processing
- Uses Multer for multipart/form-data parsing
- Stores files in memory buffer
- Validates file size (max 50MB)
- Passes file to controller

```javascript
// Flow
multipart/form-data request
  ↓
Multer processes file → memory buffer
  ↓
req.file = { buffer, mimetype, originalname, size }
  ↓
Controller receives file for Cloudinary upload
```

#### **limiter.js** - Rate Limiting
- Uses express-rate-limit
- Tracks requests by IP
- Returns 429 if limit exceeded
- Applied to auth routes

```javascript
// Configuration
15-minute window: 100 requests max
  ↓
Tracks IP address
  ↓
Returns 429 Too Many Requests if exceeded
```

---

### 3. **Controllers Layer** (Business Logic)

**Files:** `controllers/*.js`

**Responsibility:**
- Process requests
- Interact with database
- Call external services
- Format responses

**Controller Types:**

#### **authController.js** - Authentication
```javascript
register()   → Create new user
login()      → Authenticate user, issue JWT
address()    → Fetch user profile
```

#### **fileController.js** - File Management
```javascript
uploadFile() → Upload file to Cloudinary
getImages()  → Fetch user's images
getvideo()   → Fetch user's videos
getFile()    → Fetch user's documents
getOther()   → Fetch user's other files
```

#### **handleController.js** - File Operations
```javascript
rename()     → Rename file
deleteFile() → Delete file from Cloudinary & DB
```

#### **dashboardController.js** - Analytics
```javascript
getDashboard() → Aggregated user statistics
               → Storage usage
               → File counts by type
               → Recent files
```

---

### 4. **Models/Schema Layer** (Data Structure)

**Files:** `models/*.js`

**User Schema:**
```javascript
{
  name: String,              // Required, displayed name
  email: String,             // Required, unique, validated
  password: String,          // Required, hashed with bcrypt
  totalStorageUsed: String,  // Tracks storage consumption
  timestamps: true           // createdAt, updatedAt
}

Methods:
- getJWT()              // Generate authentication token
- validatePassword()    // Verify password during login
```

**File Schema:**
```javascript
{
  userId: ObjectId,      // Reference to User
  name: String,          // Original filename
  url: String,           // Cloudinary URL
  publicId: String,      // Cloudinary resource ID
  size: Number,          // File size in bytes
  type: String,          // Category: document, image, video, other
  timestamps: true       // Upload & modification dates
}

Relationships:
- Belongs to User (userId)
- Indexed for fast queries
```

---

### 5. **Configuration Layer** (Setup & Integration)

**Files:** `config/*.js`

#### **database.js** - MongoDB Connection
```javascript
mongoose.connect(MONGO_URI)
  ↓
Establishes connection pool
  ↓
Enables schema validation
```

#### **cloudinary.js** - Cloud Storage Setup
```javascript
cloudinary.config({
  cloud_name,
  api_key,
  api_secret
})
  ↓
Authenticates with Cloudinary API
  ↓
Enables upload/delete operations
```

---

### 6. **Utils Layer** (Helper Functions)

**Files:** `utils/*.js`

#### **fileType.js** - MIME Type Detection
```javascript
getFileType(mimetype)
  ↓
Checks MIME type
  ↓
Returns category: image, video, document, or other
```

**Supported Types:**
- **Image:** image/* (JPEG, PNG, GIF, WebP, etc.)
- **Video:** video/*, audio/* (MP4, WebM, MKV, MP3, etc.)
- **Document:** PDF, Word, Excel files
- **Other:** All remaining file types

---

## Data Flow Examples

### Authentication Flow

```
1. CLIENT
   POST /api/auth/register
   Body: { name, email, password }
         ↓
2. ROUTES (authRoutes.js)
   Matches POST /register
         ↓
3. MIDDLEWARE
   [generalLimiter] Check rate limit
         ↓
4. CONTROLLER (authController.register)
   • Validate input
   • Check if email exists
   • Hash password with bcrypt
   • Create user in MongoDB
   • Return success response
         ↓
5. DATABASE (MongoDB)
   Stores user document
         ↓
6. RESPONSE (201 Created)
   { message: "User created successfully" }
```

### File Upload Flow

```
1. CLIENT
   POST /api/files/upload
   File: binary data
         ↓
2. ROUTES (fileRoutes.js)
   Matches POST /upload
         ↓
3. MIDDLEWARE
   [auth] Verify JWT token → req.user
   [upload] Process multipart → req.file
         ↓
4. CONTROLLER (fileController.uploadFile)
   • Validate file exists
   • Determine file type via MIME detection
   • Create upload stream to Cloudinary
   • Stream file buffer to Cloudinary API
         ↓
5. EXTERNAL SERVICE (Cloudinary)
   • Receives file upload stream
   • Stores file in cloud storage
   • Returns: url, publicId, size, bytes
         ↓
6. DATABASE (MongoDB)
   Creates file document with metadata
   {
     userId, name, url, publicId,
     size, type, timestamps
   }
         ↓
7. RESPONSE (201 Created)
   Returns created file document with URL
```

### Dashboard Analytics Flow

```
1. CLIENT
   GET /api/dashboard
         ↓
2. ROUTES (dashboardRoutes.js)
         ↓
3. MIDDLEWARE
   [auth] Verify JWT → req.user.id
         ↓
4. CONTROLLER (dashboardController.getDashboard)
   Creates MongoDB aggregation pipeline
         ↓
5. DATABASE (MongoDB Aggregation)
   $match: filter files by userId
   $facet: 3 parallel aggregations
   
   Stream 1: Storage Usage
   $group → Sum all file sizes
   
   Stream 2: Files by Type
   $group → Count files per type
   
   Stream 3: Recent Files
   $sort → Latest 5 files
         ↓
6. CONTROLLER
   Formats aggregation results:
   • Convert bytes → GB
   • Calculate percentage
   • Format dates
         ↓
7. RESPONSE (200 OK)
   {
     storage: { total, used, usedPercentage },
     documents: { files, date },
     images: { files, date },
     videos: { files, date },
     other: { files, date },
     recent: [ ... ]
   }
```

---

## Authentication & Authorization

### Token-Based Authentication (JWT)

```javascript
// Step 1: User logs in
POST /api/auth/login
{ email, password }

// Step 2: Server verifies credentials
bcrypt.compare(password, hashedPassword)

// Step 3: Server issues JWT token
jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" })

// Step 4: Token stored in HttpOnly cookie
res.cookie("token", token, { httpOnly: true, sameSite: "lax" })

// Step 5: Client automatically includes cookie in requests
Cookie: token=<jwt>

// Step 6: Middleware verifies token
jwt.verify(token, JWT_SECRET)
req.user = { id: decoded.id }
```

### Authorization Levels

**Public Routes** (no authentication):
- `POST /auth/register`
- `POST /auth/login`

**Private Routes** (authentication required):
- `GET /auth/get` - User profile
- `POST /files/upload` - Upload file
- `GET /files/images` - List images
- `GET /files/document` - List documents
- `GET /files/videos` - List videos
- `PATCH /files/:id/rename` - Rename file
- `DELETE /files/:id` - Delete file
- `GET /dashboard` - Dashboard analytics

**User Ownership** (user must own resource):
- File rename/delete - Must be file owner
- File operations - Scoped to user

---

## Security Architecture

### 1. **Authentication Security**

```
Password Storage:
Plain → bcrypt(salt=10) → Hash → Stored in DB

Password Verification:
Input → bcrypt.compare() → Hash matches check
```

### 2. **Session Management**

```
JWT Structure: { id, iat, exp }
├─ id: User identifier
├─ iat: Issued at timestamp
└─ exp: Expiration timestamp (1 day)

Storage: HttpOnly Cookie
├─ Prevents JavaScript access (XSS safe)
├─ Auto-included in requests
└─ Protected from CSRF with SameSite=Lax
```

### 3. **Request Validation**

```
Input Validation:
├─ Email: validator.isEmail()
├─ Password: Required field check
├─ File: MIME type detection
└─ ObjectId: MongoDB validation

File Validation:
├─ Size: Max 50MB check
├─ Type: MIME type detection
└─ Storage: User quota check
```

### 4. **Rate Limiting**

```
Request Tracking:
├─ IP-based identification
├─ 15-minute sliding window
├─ 100 requests per window
└─ Applied to auth routes

Protection:
├─ Brute force attack prevention
├─ DoS attack mitigation
└─ Resource exhaustion prevention
```

### 5. **CORS Security**

```
Same-Origin Policy:
├─ Only specific frontend URL allowed
├─ Prevents unauthorized cross-origin requests
├─ Credentials required for cookie transmission
└─ Protects against CSRF attacks
```

### 6. **Data Isolation**

```
User Data Scoping:
├─ Each file query filtered by userId
├─ Dashboard data isolated per user
├─ No cross-user file access
└─ Authorization checks on file operations
```

---

## Database Design

### Schema Relationships

```
User (1) ──┬──→ (Many) File
           │
           └─ Relationship: userId in File
              
User
├─ _id (ObjectId)
├─ name
├─ email (unique index)
├─ password
└─ timestamps

File
├─ _id (ObjectId)
├─ userId (foreign key → User._id)
├─ name
├─ url (Cloudinary)
├─ publicId (Cloudinary reference)
├─ size
├─ type (document, image, video, other)
└─ timestamps
```

### Indexing Strategy

```
Indexes Created:
├─ User.email (unique) - Fast email lookups
├─ File.userId - Fast user file queries
└─ File.userId + File.type - Fast filtered queries

Query Optimization:
├─ User lookup by email: O(1) with index
├─ User files: O(log n) with userId index
└─ Filtered files: O(log n) with compound index
```

---

## External Service Integration

### Cloudinary Integration

```
Upload Process:
1. File received from client
   ↓
2. Stored in memory buffer by Multer
   ↓
3. Stream created from buffer
   ↓
4. upload_stream() to Cloudinary API
   ↓
5. Cloudinary stores file
   ↓
6. Returns: url, publicId, size

Metadata:
├─ url: https://res.cloudinary.com/.../file
├─ publicId: storage_app/file_abc123
└─ bytes: file size from Cloudinary

Delete Process:
1. Get file publicId from database
   ↓
2. Call cloudinary.uploader.destroy(publicId)
   ↓
3. File removed from cloud storage
   ↓
4. Database record deleted
```

---

## Error Handling Architecture

### Error Flow

```
Try-Catch Blocks:
├─ Controller level catches all errors
├─ Logs error details for debugging
└─ Returns appropriate HTTP status

Error Types:
├─ 400: Bad Request (invalid input)
├─ 401: Unauthorized (auth failure)
├─ 403: Forbidden (ownership violation)
├─ 404: Not Found (resource missing)
└─ 500: Server Error (unexpected failure)
```

### Error Response Format

```json
{
  "message": "Human-readable error description"
}
```

---

## Scalability Considerations

### Current Capacity

```
Per User:
├─ Storage: 10GB limit
├─ Files: No hard limit (indexes support >1M documents)
├─ Upload size: 50MB per file
└─ Concurrent requests: 100 per 15 minutes

Server:
├─ Single Node.js instance
├─ Single MongoDB instance
└─ Cloudinary handles file distribution
```

### Scaling Strategies (Future)

```
Horizontal Scaling:
├─ Load balancer (nginx/HAProxy)
├─ Multiple Express instances
├─ Session store (Redis)
└─ Cloudinary already distributed

Vertical Scaling:
├─ Upgrade server resources
├─ MongoDB replication set
├─ Query optimization
└─ Caching layer (Redis)

Data Scaling:
├─ Database sharding by userId
├─ Archival for old files
├─ CDN for file distribution
└─ Pagination for large datasets
```

---

## Development Workflow

### Local Development

```
1. Clone repository
   ↓
2. Install dependencies
   npm install
   ↓
3. Create .env file
   ↓
4. Start MongoDB
   mongod
   ↓
5. Run development server
   npm run dev
   ↓
6. Access http://localhost:5000
```

### Testing Workflow

```
Manual Testing:
├─ Postman/Insomnia for API testing
├─ curl for command-line testing
└─ Browser developer tools for debugging

Test Scenarios:
├─ Authentication (register, login)
├─ File operations (upload, list, rename, delete)
├─ Dashboard analytics
├─ Error handling
└─ Rate limiting
```

---

## Performance Metrics

### Response Times (Target)

```
Authentication:
├─ Register: < 500ms
├─ Login: < 300ms
└─ Profile: < 200ms

File Operations:
├─ Upload (10MB): < 5s
├─ List files: < 200ms
├─ Rename: < 200ms
└─ Delete: < 500ms

Analytics:
├─ Dashboard: < 1s
└─ Aggregation: < 2s
```

### Database Queries

```
Optimized Queries:
├─ User lookup: Indexed on email
├─ File list: Indexed on userId
├─ Type filtering: Compound index
└─ Aggregation: Optimized pipeline
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────┐
│        Frontend (Client)             │
│   (Deployed on Vercel/Netlify)      │
└────────────────────┬────────────────┘
                     │ HTTPS
        ┌────────────▼────────────┐
        │    Load Balancer        │
        │  (If scaled)            │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │   Express.js Server     │
        │ (Deployed on Heroku/    │
        │  AWS/DigitalOcean)      │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
    ┌───▼──┐           ┌────────▼────┐
    │MongoDB│           │ Cloudinary  │
    │Atlas  │           │   API       │
    └───────┘           └─────────────┘
```

---

**Last Updated:** February 5, 2026  
**Version:** 1.0.0
