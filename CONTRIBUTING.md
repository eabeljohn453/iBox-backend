# Contributing to iBox Backend

Welcome! This guide will help you contribute to the iBox Backend project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guide](#code-style-guide)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Common Tasks](#common-tasks)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors regardless of background, experience, or identity.

### Expected Behavior

- **Be respectful** - Treat all contributors with respect and kindness
- **Be constructive** - Provide helpful feedback and suggestions
- **Be collaborative** - Work together to solve problems
- **Be professional** - Maintain a professional tone in all interactions

### Unacceptable Behavior

- Harassment or discriminatory comments
- Offensive or inappropriate language
- Personal attacks
- Unwelcome advances or attention
- Publishing private information without consent

---

## Getting Started

### 1. Fork the Repository

```bash
# Click "Fork" on GitHub
# This creates your own copy of the repository
```

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/ibox-backend.git
cd ibox-backend
```

### 3. Add Upstream Remote

```bash
# This keeps your fork in sync with the original repository
git remote add upstream https://github.com/ORIGINAL_OWNER/ibox-backend.git

# Verify
git remote -v
# Should show:
# origin    https://github.com/YOUR_USERNAME/ibox-backend.git (fetch)
# origin    https://github.com/YOUR_USERNAME/ibox-backend.git (push)
# upstream  https://github.com/ORIGINAL_OWNER/ibox-backend.git (fetch)
# upstream  https://github.com/ORIGINAL_OWNER/ibox-backend.git (push)
```

### 4. Create Development Branch

```bash
# Sync with latest changes
git fetch upstream
git rebase upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

---

## Development Workflow

### Before You Start

1. **Check Existing Issues**
   - Search GitHub issues to avoid duplicate work
   - Claim an issue by commenting "I'd like to work on this"

2. **Create an Issue (if none exists)**
   - Describe the problem or feature
   - Provide context and examples
   - Wait for maintainer feedback before coding

### During Development

1. **Set Up Environment**
   ```bash
   npm install
   cp .env.example .env
   # Configure .env with your test values
   ```

2. **Create Focused Commits**
   ```bash
   # Make small, logical commits
   git add .
   git commit -m "feat: add user email validation"
   ```

3. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Keep Branch Updated**
   ```bash
   # If original repo was updated
   git fetch upstream
   git rebase upstream/main
   git push --force origin feature/your-feature-name
   ```

### After Development

1. **Create Pull Request**
   - Click "Compare & pull request" on GitHub
   - Fill out PR template completely
   - Link any related issues

2. **Respond to Reviews**
   - Be open to feedback
   - Discuss concerns professionally
   - Make requested changes promptly

---

## Code Style Guide

### General Principles

- **Clean Code** - Write readable, maintainable code
- **Consistency** - Follow existing patterns in codebase
- **Comments** - Add comments for complex logic, not obvious code
- **DRY** - Don't Repeat Yourself - extract common functionality

### JavaScript/Node.js Style

#### Naming Conventions

```javascript
// Variables & Functions: camelCase
const userEmail = "user@example.com";
const getUserById = async (id) => { /* ... */ };

// Classes & Constructors: PascalCase
class UserModel { /* ... */ }

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const JWT_EXPIRE_TIME = "1d";

// Private functions: Leading underscore
const _validateEmail = (email) => { /* ... */ };

// MongoDB Collections: PascalCase singular
const User = mongoose.model("User", userSchema);
const File = mongoose.model("File", fileSchema);
```

#### Code Formatting

```javascript
// Use async/await instead of promises
// ❌ WRONG
User.findById(id).then(user => {
  return res.json(user);
}).catch(err => {
  res.status(500).json({ message: "Error" });
});

// ✓ CORRECT
try {
  const user = await User.findById(id);
  return res.json(user);
} catch (error) {
  return res.status(500).json({ message: "Error" });
}
```

```javascript
// Arrow functions for callbacks
// ❌ WRONG
array.map(function(item) {
  return item * 2;
});

// ✓ CORRECT
array.map((item) => item * 2);
```

```javascript
// Destructuring
// ❌ WRONG
const user = req.user;
const userId = user.id;

// ✓ CORRECT
const { id: userId } = req.user;
```

```javascript
// Template literals for strings
// ❌ WRONG
const message = "User " + name + " not found";

// ✓ CORRECT
const message = `User ${name} not found`;
```

#### Function Structure

```javascript
/**
 * Detailed JSDoc comment
 * @param {type} paramName - Description
 * @returns {type} Description
 * @throws {Error} When something goes wrong
 */
export const functionName = async (req, res) => {
  try {
    // Validate input
    if (!req.body.required) {
      return res.status(400).json({ message: "Missing required field" });
    }

    // Main logic
    const result = await doSomething();

    // Return response
    return res.status(200).json(result);
  } catch (error) {
    // Error handling
    console.error("Function error:", error);
    return res.status(500).json({ message: "Operation failed" });
  }
};
```

#### Error Handling

```javascript
// ✓ CORRECT - Comprehensive error handling
try {
  // Operation
  const data = await fetchData();
  return res.json(data);
} catch (error) {
  // Log for debugging
  console.error("Fetch error:", {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  // Return user-friendly error
  return res.status(500).json({
    message: "Failed to fetch data"
  });
}
```

### Controllers

```javascript
// controllers/exampleController.js

import Model from "../models/model.js";

/**
 * Get all documents for authenticated user
 * Filters by userId and type
 * Supports pagination
 */
export const getDocuments = async (req, res) => {
  try {
    // 1. Validate authentication
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 2. Validate & parse query parameters
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // 3. Query database
    const documents = await Model.find({
      userId: req.user.id,
      type: "document"
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // 4. Format response
    const formatted = documents.map((doc) => ({
      id: doc._id,
      name: doc.name,
      url: doc.url,
      size: doc.size,
      date: doc.createdAt.toLocaleString()
    }));

    // 5. Return response
    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Get documents error:", error);
    return res.status(500).json({ message: "Failed to fetch documents" });
  }
};
```

### Routes

```javascript
// routes/exampleRoutes.js

import express from "express";
import { getDocuments, createDocument } from "../controllers/documentController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Middleware applied to all routes in this group
router.use(authMiddleware);

// GET /documents
router.get("/", getDocuments);

// POST /documents
router.post("/", createDocument);

export default router;
```

### Models

```javascript
// models/exampleModel.js

import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
  // Required fields
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true  // Index for fast queries
  },

  name: {
    type: String,
    required: true,
    trim: true  // Remove whitespace
  },

  email: {
    type: String,
    lowercase: true,  // Store lowercase
    unique: true,     // Ensure uniqueness
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: "Invalid email format"
    }
  },

  // Optional fields with defaults
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  // Compound index for common queries
}, {
  timestamps: true  // Add createdAt, updatedAt
});

// Add compound index
exampleSchema.index({ userId: 1, status: 1 });

export default mongoose.model("Example", exampleSchema);
```

---

## Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

```
feat:      New feature
fix:       Bug fix
refactor:  Code refactoring
perf:      Performance improvement
style:     Code style changes (no functional change)
test:      Add/update tests
docs:      Documentation changes
chore:     Build, dependencies, or tooling
ci:        CI/CD changes
revert:    Revert previous commit
```

### Scope (Optional)

```
- auth:       Authentication
- files:      File operations
- dashboard:  Dashboard analytics
- db:         Database operations
- api:        API endpoints
- config:     Configuration
- middleware: Middleware
- utils:      Utility functions
```

### Subject

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at end
- Max 50 characters
- Be specific and descriptive

### Examples

**Good Commits:**
```
feat(auth): add email validation to registration

fix(files): correct MIME type detection for videos

refactor(controllers): extract common pagination logic

docs: add API endpoint documentation

test(auth): add password validation tests
```

**Bad Commits:**
```
fixed bug          # Too vague
Updated code       # Capitalized, not imperative
Add new stuff      # Vague scope

feat: added new features  # Added not imperative
feat(auth): update the authentication system to better handle errors and add more logging  # Too long
```

### Commit Examples

```bash
# Feature commit
git commit -m "feat(auth): add email verification for new registrations

- Add verification email sending via Nodemailer
- Add email verification token to User model
- Add verification middleware to protect routes
- Add tests for verification flow"

# Bug fix commit
git commit -m "fix(files): resolve MIME type bug for audio files

The function was returning 'viau' instead of 'video' for audio files.
This caused incorrect file categorization in the UI.

Fixes #123"

# Documentation commit
git commit -m "docs: update API documentation for dashboard endpoint"
```

---

## Pull Request Process

### Before Creating PR

1. **Self-Review**
   ```bash
   # Check your changes
   git diff upstream/main
   
   # Review specific file
   git show HEAD:filename
   ```

2. **Run Tests**
   ```bash
   npm test
   ```

3. **Test Manually**
   - Use Postman or curl to test affected endpoints
   - Verify no console errors
   - Check database for expected changes

4. **Update Documentation**
   - If API changes, update API_DOCUMENTATION.md
   - If setup changes, update SETUP_GUIDE.md
   - Update code comments as needed

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Related Issue
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe how you tested these changes:
- [ ] Manual testing with Postman
- [ ] Unit tests added
- [ ] Existing tests still pass

## Screenshots (if applicable)
Add screenshots of UI changes or API responses.

## Checklist
- [ ] Code follows style guide
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.log left in code
- [ ] All tests pass
- [ ] No security issues introduced
```

### PR Review Process

1. **Maintainer Reviews**
   - Code review
   - Testing verification
   - Documentation check

2. **Address Feedback**
   ```bash
   # Make changes
   git add .
   git commit -m "refactor: address PR review feedback"
   git push origin feature/your-feature-name
   ```

3. **Approval & Merge**
   - Maintainer approves
   - PR gets merged to main
   - Your branch can be deleted

---

## Testing Guidelines

### Test Structure

```javascript
// tests/example.test.js
import User from "../models/user.js";

describe("User Model", () => {
  describe("Email validation", () => {
    test("should accept valid email", () => {
      expect(validateEmail("user@example.com")).toBe(true);
    });

    test("should reject invalid email", () => {
      expect(validateEmail("invalid")).toBe(false);
    });
  });

  describe("Password hashing", () => {
    test("should hash password", async () => {
      const hash = await hashPassword("password123");
      expect(hash).not.toBe("password123");
    });
  });
});
```

### API Testing

```javascript
// tests/api.test.js
import request from "supertest";
import app from "../backend/server.js";

describe("Authentication API", () => {
  test("POST /api/auth/register - should create user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123"
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("user created");
  });

  test("POST /api/auth/register - should reject duplicate email", async () => {
    // First registration
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123"
      });

    // Duplicate registration
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Jane Doe",
        email: "john@example.com",
        password: "Password456"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("already exists");
  });
});
```

---

## Common Tasks

### Add a New Endpoint

1. **Create Controller Function**
   ```javascript
   // controllers/exampleController.js
   export const newEndpoint = async (req, res) => {
     try {
       // Implementation
       return res.status(200).json({ success: true });
     } catch (error) {
       console.error("Error:", error);
       return res.status(500).json({ message: "Error" });
     }
   };
   ```

2. **Add Route**
   ```javascript
   // routes/exampleRoutes.js
   import { newEndpoint } from "../controllers/exampleController.js";
   router.post("/new-endpoint", authMiddleware, newEndpoint);
   ```

3. **Update Documentation**
   - Add to API_DOCUMENTATION.md
   - Include request/response examples
   - Document any special requirements

### Fix a Bug

1. Create issue if none exists
2. Create branch: `git checkout -b fix/bug-description`
3. Make minimal changes to fix only the bug
4. Test thoroughly
5. Create PR with clear description

### Improve Documentation

1. Create branch: `git checkout -b docs/improvement-description`
2. Update relevant markdown files
3. Ensure code examples are correct and runnable
4. Create PR with changes

### Refactor Code

1. Create branch: `git checkout -b refactor/description`
2. Make focused changes (one aspect at a time)
3. Ensure all tests still pass
4. Update documentation if needed
5. Create PR explaining refactoring benefits

---

## Questions?

- 📖 Check the [README.md](README.md)
- 🏗️ Review [ARCHITECTURE.md](ARCHITECTURE.md)
- 📚 Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- 💬 Open a GitHub issue with question label

---

**Thank you for contributing! 🚀**

Your contributions make iBox Backend better for everyone.

---

**Last Updated:** February 5, 2026  
**Version:** 1.0.0
