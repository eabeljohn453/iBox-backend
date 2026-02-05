# iBox Backend - Complete Setup Guide

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Prerequisites Installation](#prerequisites-installation)
3. [Project Setup](#project-setup)
4. [Database Configuration](#database-configuration)
5. [Cloud Storage Configuration](#cloud-storage-configuration)
6. [Environment Variables](#environment-variables)
7. [Verification](#verification)
8. [Running the Server](#running-the-server)
9. [Testing the API](#testing-the-api)
10. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **OS:** Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 2GB free space
- **Internet:** Required for cloud services

### Recommended Setup
- **OS:** Ubuntu 20.04+ or macOS 12+
- **RAM:** 8GB+
- **CPU:** Multi-core processor
- **Node.js:** v18+ (v20 recommended)

---

## Prerequisites Installation

### 1. Install Node.js & npm

**Option A: Using NodeSource (Recommended for Linux)**

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version    # v20.x.x
npm --version     # 10.x.x
```

**Option B: Using Homebrew (macOS)**

```bash
# Install Homebrew first (if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@20

# Verify installation
node --version
npm --version
```

**Option C: Official Installer (All Platforms)**

1. Visit [nodejs.org](https://nodejs.org/)
2. Download LTS version (v20+)
3. Run installer and follow prompts
4. Verify: `node --version && npm --version`

---

### 2. Install MongoDB

**Option A: MongoDB Atlas (Recommended for Quick Start)**

No installation needed! Use cloud-hosted MongoDB.

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new project
4. Create shared cluster (free tier)
5. Add IP whitelist: Add your IP or allow all (0.0.0.0/0)
6. Create database user with username and strong password
7. Get connection string (will use in `.env`)

**Option B: Local MongoDB Installation**

**Ubuntu/Debian:**
```bash
# Add MongoDB repository
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh  # Opens MongoDB shell
> exit
```

**macOS:**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongosh
> exit
```

**Windows:**
1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run installer with default options
3. MongoDB starts automatically as Windows service
4. Verify: Open PowerShell and run `mongosh`

**Connection String for Local MongoDB:**
```
mongodb://localhost:27017/ibox-db
```

---

### 3. Install Git (Optional but Recommended)

**Ubuntu/Debian:**
```bash
sudo apt-get install -y git
```

**macOS:**
```bash
brew install git
```

**Windows:**
Download from [git-scm.com](https://git-scm.com)

**Verify:**
```bash
git --version
```

---

### 4. Text Editor / IDE

**Recommended Options:**
- **VS Code** (Free, lightweight) - [code.visualstudio.com](https://code.visualstudio.com)
- **WebStorm** (Paid, feature-rich) - [jetbrains.com/webstorm](https://www.jetbrains.com/webstorm/)
- **Sublime Text** (Paid, lightweight) - [sublimetext.com](https://www.sublimetext.com)

**VS Code Extensions (Recommended):**
- REST Client - Test APIs directly in editor
- MongoDB for VS Code - Database management
- Thunder Client - Alternative to Postman
- Prettier - Code formatter
- ESLint - Code linter

---

## Project Setup

### 1. Clone or Navigate to Project

**If cloning from Git:**
```bash
git clone https://github.com/yourusername/ibox-backend.git
cd ibox-backend
```

**If already downloaded:**
```bash
cd path/to/ibox-backend
```

### 2. Install Dependencies

```bash
# Install all npm packages
npm install
```

**What gets installed:**
```
bcryptjs               - Password hashing
cloudinary            - Cloud storage service
cookie-parser         - Parse HTTP cookies
cors                  - Cross-origin requests
express               - Web framework
express-rate-limit   - Rate limiting
jsonwebtoken         - JWT authentication
mongoose             - MongoDB ODM
multer               - File upload handling
validator            - Input validation
dotenv               - Environment variables
nodemon              - Development auto-reload
```

**Verify installation:**
```bash
npm list --depth=0
```

---

### 3. Verify Project Structure

```bash
# Check if all required folders exist
ls -la backend/

# Expected output:
# config/
# controllers/
# middleware/
# models/
# routes/
# utils/
# server.js
```

---

## Database Configuration

### Option 1: MongoDB Atlas (Cloud) - Recommended

#### Step 1: Create Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start free"
3. Create account or use Google/GitHub login

#### Step 2: Create Project
1. Click "Create a project"
2. Name it "ibox-project"
3. Click "Create Project"

#### Step 3: Create Cluster
1. Click "Create Deployment"
2. Select "M0 Free" tier
3. Choose region closest to you
4. Click "Create Deployment"
5. Wait 1-3 minutes for cluster creation

#### Step 4: Add Database User
1. In left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Username: `ibox_user`
4. Password: Generate strong password (copy it!)
5. Click "Add User"

#### Step 5: Add IP Whitelist
1. Click "Network Access" in sidebar
2. Click "Add IP Address"
3. Option A: Add your IP (automatic detection)
4. Option B: Allow all IPs: `0.0.0.0/0` (less secure)
5. Click "Confirm"

#### Step 6: Get Connection String
1. Click "Databases" in sidebar
2. Click "Connect" on your cluster
3. Select "Drivers"
4. Copy the connection string
5. Format: `mongodb+srv://ibox_user:PASSWORD@cluster.mongodb.net/ibox-db?retryWrites=true&w=majority`
6. Replace `PASSWORD` with your database user password

---

### Option 2: Local MongoDB

#### Ubuntu/Debian

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start if not running
sudo systemctl start mongod

# Test connection
mongosh
# In shell:
> show databases
> exit

# Connection string: mongodb://localhost:27017/ibox-db
```

#### macOS

```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start if not running
brew services start mongodb-community

# Test connection
mongosh

# Connection string: mongodb://localhost:27017/ibox-db
```

#### Windows PowerShell

```powershell
# Check MongoDB service status
Get-Service MongoDB

# Start service if stopped
Start-Service MongoDB

# Test connection
mongosh

# Connection string: mongodb://localhost:27017/ibox-db
```

---

## Cloud Storage Configuration

### Cloudinary Setup (Required)

#### Step 1: Create Account
1. Go to [cloudinary.com](https://cloudinary.com/)
2. Click "Sign Up"
3. Create account using email or Google/GitHub
4. Verify email address

#### Step 2: Get API Credentials
1. Go to [cloudinary.com/console](https://cloudinary.com/console)
2. You'll see your dashboard with credentials:
   - **Cloud Name** - Publicly visible
   - **API Key** - Keep secret
   - **API Secret** - Keep very secret ❗

#### Step 3: Configure Upload Settings (Optional)
1. In console, click "Settings" (gear icon)
2. Go to "Upload" tab
3. Optional: Set size restrictions, allowed file types
4. Default settings work fine

#### Step 4: Copy Credentials
```
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Environment Variables

### Create .env File

```bash
# In project root directory
cp .env.example .env
```

### Edit .env with Your Values

```bash
# Using nano editor
nano .env

# Or using VS Code
code .env
```

### Required Environment Variables

```env
# ============================================================================
# SERVER
# ============================================================================
PORT=5000
NODE_ENV=development

# ============================================================================
# DATABASE
# ============================================================================

# For MongoDB Atlas:
MONGO_URI=mongodb+srv://ibox_user:YOUR_PASSWORD@cluster0.abc123.mongodb.net/ibox-db?retryWrites=true&w=majority

# For Local MongoDB:
# MONGO_URI=mongodb://localhost:27017/ibox-db

# ============================================================================
# AUTHENTICATION
# ============================================================================

# Generate with: openssl rand -base64 32
JWT_SECRET=your_64_character_random_string_here_minimum_32_characters_required

# ============================================================================
# CLOUDINARY
# ============================================================================
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ============================================================================
# CORS & FRONTEND
# ============================================================================
FRONTEND_URL=http://localhost:3000

# ============================================================================
# STORAGE
# ============================================================================
STORAGE_LIMIT_GB=10
MAX_FILE_SIZE_MB=50
```

### Generate JWT Secret

**Using OpenSSL (Linux/macOS):**
```bash
openssl rand -base64 32
# Output: abc123defghijklmnopqrstuvwxyz...
```

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: abc123defghijklmnopqrstuvwxyz...
```

### Verify .env File

```bash
# Check if file exists
cat .env

# Should show all your variables
# Make sure .env is in .gitignore
grep ".env" .gitignore
```

---

## Verification

### 1. Check Node.js Setup

```bash
node --version        # Should be v18+
npm --version         # Should be v9+
npm list -g npm       # Check npm installations
```

### 2. Check MongoDB Connection

**For MongoDB Atlas:**
```bash
# Test connection with mongosh
mongosh "mongodb+srv://ibox_user:PASSWORD@cluster0.abc123.mongodb.net/ibox-db" \
  --username ibox_user \
  --password PASSWORD

# In shell:
> show databases
> use ibox-db
> exit
```

**For Local MongoDB:**
```bash
mongosh
# In shell:
> use ibox-db
> db.users.insertOne({ name: "test" })
> db.users.find()
> db.dropDatabase()  # Clean up test data
> exit
```

### 3. Check Environment Variables

```bash
# Create small test script
cat > test-env.js << 'EOF'
require('dotenv').config();

const required = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLOUDINARY_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

console.log('Environment Variable Status:\n');
required.forEach(env => {
  const value = process.env[env];
  const status = value ? '✓' : '✗';
  console.log(`${status} ${env}: ${value ? '***configured***' : 'MISSING'}`);
});

if (required.every(env => process.env[env])) {
  console.log('\n✓ All required variables configured!');
  process.exit(0);
} else {
  console.log('\n✗ Missing required variables. Check your .env file.');
  process.exit(1);
}
EOF

# Run test
node test-env.js

# Clean up
rm test-env.js
```

### 4. Test Cloudinary Connection

```bash
# Create test script
cat > test-cloudinary.js << 'EOF'
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.api.resources({ type: 'upload', max_results: 1 })
  .then(() => {
    console.log('✓ Cloudinary connection successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('✗ Cloudinary connection failed:', error.message);
    process.exit(1);
  });
EOF

# Run test
node test-cloudinary.js

# Clean up
rm test-cloudinary.js
```

---

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

**Expected Output:**
```
mongo is connected
server is running port 5000
```

**Features:**
- Auto-reload on file changes
- Source maps for debugging
- Full error stack traces

### Production Mode

```bash
npm start
```

### Access the Server

```bash
# Test if server is running
curl http://localhost:5000

# Or open in browser
http://localhost:5000
```

### Stopping the Server

```bash
# Press Ctrl+C in terminal
```

---

## Testing the API

### 1. Using curl (Command Line)

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "TestPassword123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "TestPassword123"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/auth/get \
  -b cookies.txt
```

---

### 2. Using Postman (Recommended)

1. **Download Postman** from [postman.com](https://www.postman.com/downloads/)
2. **Import Collection:**
   - Click "File" → "Import"
   - Create new collection manually
   - Add requests for each endpoint

3. **Test Authentication:**
   - Set request to POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "TestPass123"
   }
   ```
   - Click Send

4. **Manage Cookies:**
   - Postman automatically handles cookies
   - Subsequent requests include cookie automatically

---

### 3. Using VS Code REST Client Extension

1. **Install Extension:**
   - Open VS Code
   - Extensions → Search "REST Client"
   - Install by Huachao Mao

2. **Create test file `api-test.http`:**

```http
### Register User
POST http://localhost:5000/api/auth/register HTTP/1.1
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "JanePassword123"
}

### Login User
POST http://localhost:5000/api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "JanePassword123"
}

### Get Profile
GET http://localhost:5000/api/auth/get HTTP/1.1

### Get Dashboard
GET http://localhost:5000/api/dashboard HTTP/1.1
```

3. **Click "Send Request"** above each request

---

## Troubleshooting

### Issue: MongoDB Connection Refused

**Error:** `MongooseError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**

```bash
# Check if MongoDB is running
# For local MongoDB:
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# For macOS:
brew services start mongodb-community

# For MongoDB Atlas:
# Verify connection string in .env
# Check username/password in connection string
# Ensure IP is whitelisted in MongoDB Atlas
```

---

### Issue: Invalid Cloudinary Credentials

**Error:** `UnauthorizedError` or `Invalid Cloudinary credentials`

**Solutions:**

```bash
# Verify credentials:
1. Go to https://cloudinary.com/console
2. Check Cloud Name, API Key, API Secret
3. Copy exact values (no extra spaces)
4. Update .env file
5. Restart server (Ctrl+C then npm run dev)

# Test Cloudinary connection:
node -e "
const c = require('cloudinary').v2;
c.config({
  cloud_name: '${CLOUDINARY_NAME}',
  api_key: '${CLOUDINARY_API_KEY}',
  api_secret: '${CLOUDINARY_API_SECRET}'
});
c.api.ping().then(r => console.log('✓ Connected')).catch(e => console.log('✗', e.message));
"
```

---

### Issue: JWT Secret Not Working

**Error:** `Invalid Signature` or JWT verification fails

**Solutions:**

```bash
# Generate new JWT secret
openssl rand -base64 32

# Update .env with new secret
JWT_SECRET=<new_secret_here>

# All users must re-login (old tokens invalid)
```

---

### Issue: CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**

```bash
# Check FRONTEND_URL in .env matches your client
FRONTEND_URL=http://localhost:3000

# If frontend on different port, update:
FRONTEND_URL=http://localhost:8000

# Restart server
```

---

### Issue: Port Already in Use

**Error:** `Error: listen EADDRINUSE :::5000`

**Solutions:**

```bash
# Find process using port 5000
lsof -i :5000    # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>     # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=5001 npm run dev
```

---

### Issue: File Upload Fails

**Error:** `Upload failed` or `Invalid Cloudinary credentials`

**Solutions:**

```bash
# Check file size
# Max: 50MB

# Check Cloudinary folder
# Go to Cloudinary console → Media Library
# Should see "storage_app" folder after first upload

# Check permissions
# Ensure Cloudinary API key is correct
# Test with simple text file first
```

---

### Issue: Database Operations Slow

**Solutions:**

```bash
# Check MongoDB Atlas metrics
# Go to Monitoring in Atlas console

# Optimize queries with indexes
# File queries indexed on userId

# Check network connection
# Use connection string from Atlas > Connect > Drivers

# For local MongoDB
# Check available disk space
df -h
```

---

## Next Steps

1. **Review Documentation:**
   - `README.md` - Project overview
   - `API_DOCUMENTATION.md` - API reference
   - `ARCHITECTURE.md` - System design

2. **Start Development:**
   - Familiarize yourself with code structure
   - Review controllers and routes
   - Run the development server

3. **Test Endpoints:**
   - Use Postman or curl
   - Verify all endpoints work
   - Check error handling

4. **Deploy (Future):**
   - Use Heroku, AWS, or DigitalOcean
   - Set production environment variables
   - Monitor server logs

---

**Still Having Issues?**

1. Check server logs carefully
2. Review error messages in the troubleshooting section
3. Verify all configuration variables
4. Test each service independently
5. Check MongoDB and Cloudinary dashboards

---

**Last Updated:** February 5, 2026  
**Version:** 1.0.0
