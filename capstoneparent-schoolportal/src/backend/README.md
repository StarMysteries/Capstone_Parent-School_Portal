# School Management System Backend

A comprehensive backend API for managing school operations including users, students, classes, library, and parent-teacher communication.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Staff accounts with multiple roles
- **Student Management**: Student records, grades, and attendance
- **Parent Portal**: Parent registration and child monitoring
- **Class Management**: Classes, subjects, and grade tracking
- **Library System**: Learning materials and book borrowing
- **Announcements & Events**: School-wide communication
- **File Management**: Support for attachments and uploads

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT, bcrypt
- **Validation**: express-validator

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (Supabase account)
- npm or yarn

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd school-management-backend

# Install dependencies
npm install
```

### 3. Environment Configuration

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name [migration_name]

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 5. Start server

```bash
# Run server
node server.js

```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PATCH /api/users/:id/status` - Update user status
- `POST /api/users/:id/roles` - Assign role
- `DELETE /api/users/:id/roles/:roleId` - Remove role

### Students

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/:id/grades` - Get student grades
- `GET /api/students/:id/attendance` - Get student attendance

### Parents

- `POST /api/parents/register` - Submit parent registration
- `GET /api/parents/registrations` - Get all registrations
- `GET /api/parents/registrations/:id` - Get registration by ID
- `PATCH /api/parents/registrations/:id/verify` - Verify registration
- `GET /api/parents/my-children` - Get my children
- `GET /api/parents/children/:studentId/grades` - Get child grades
- `GET /api/parents/children/:studentId/attendance` - Get child attendance

### Classes

- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `POST /api/classes/:id/subjects` - Add subject to class
- `GET /api/classes/:id/subjects` - Get class subjects
- `PUT /api/classes/subjects/:subjectId/students/:studentId/grades` - Update grades
- `POST /api/classes/students/:studentId/attendance` - Update attendance

### Library

- `GET /api/library/materials` - Get all materials
- `GET /api/library/materials/:id` - Get material by ID
- `POST /api/library/materials` - Create material
- `PUT /api/library/materials/:id` - Update material
- `DELETE /api/library/materials/:id` - Delete material
- `POST /api/library/materials/:id/copies` - Add copy
- `PATCH /api/library/copies/:copyId/status` - Update copy status
- `POST /api/library/borrow` - Borrow material
- `PATCH /api/library/borrow/:borrowId/return` - Return material
- `GET /api/library/borrow/history` - Get borrow history
- `GET /api/library/categories` - Get all categories
- `POST /api/library/categories` - Create category

### Announcements

- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements` - Create announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

## Detailed API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account

**Request:**

```json
{
  "email": "user@school.com",
  "password": "SecurePass123",
  "fname": "John",
  "lname": "Doe",
  "contact_num": "09123456789",
  "address": "123 School St, City"
}
```

**Response (201):**

```json
{
  "user_id": 1,
  "email": "user@school.com",
  "fname": "John",
  "lname": "Doe",
  "contact_num": "09123456789",
  "address": "123 School St, City",
  "account_status": "Active",
  "created_at": "2026-02-17T10:30:00Z"
}
```

**Status Codes:**

- `201` - User created successfully
- `400` - Invalid input or email already exists
- `500` - Server error

---

#### POST /api/auth/login

Login and get JWT token

**Request:**

```json
{
  "email": "user@school.com",
  "password": "SecurePass123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "email": "user@school.com",
    "fname": "John",
    "lname": "Doe",
    "roles": ["Admin"]
  }
}
```

**Status Codes:**

- `200` - Login successful
- `400` - Invalid credentials
- `404` - User not found

---

#### POST /api/auth/send-otp

Send OTP to email

**Request:**

```json
{
  "email": "user@school.com"
}
```

**Response (200):**

```json
{
  "message": "OTP sent to email",
  "expires_in": 600
}
```

---

#### POST /api/auth/verify-otp

Verify OTP code

**Request:**

```json
{
  "email": "user@school.com",
  "otpCode": "123456"
}
```

**Response (200):**

```json
{
  "message": "OTP verified",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**

- `200` - OTP verified
- `400` - Invalid or expired OTP

---

#### GET /api/auth/me

Get current authenticated user

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "user_id": 1,
  "email": "user@school.com",
  "fname": "John",
  "lname": "Doe",
  "roles": ["Admin", "Principal"],
  "account_status": "Active"
}
```

**Status Codes:**

- `200` - User retrieved
- `401` - Unauthorized (invalid token)

---

### Student Endpoints

#### POST /api/students

Create a new student (Admin, Principal, Vice Principal only)

**Request:**

```json
{
  "fname": "Juan",
  "lname": "Dela Cruz",
  "sex": "M",
  "lrn_number": "LRN202501001",
  "gl_id": 1,
  "syear_start": 2025,
  "syear_end": 2026,
  "status": "ENROLLED"
}
```

**Response (201):**

```json
{
  "student_id": 1,
  "fname": "Juan",
  "lname": "Dela Cruz",
  "sex": "M",
  "lrn_number": "LRN202501001",
  "gl_id": 1,
  "syear_start": 2025,
  "syear_end": 2026,
  "status": "ENROLLED",
  "created_at": "2026-02-17T10:30:00Z"
}
```

**Status Codes:**

- `201` - Student created
- `400` - Invalid input
- `401` - Unauthorized
- `403` - Insufficient permissions

---

#### GET /api/students

Get all students (with optional filters)

**Query Parameters:**

```
?status=ENROLLED&grade_level=1&syear_start=2025&page=1&limit=20
```

**Response (200):**

```json
{
  "data": [
    {
      "student_id": 1,
      "fname": "Juan",
      "lname": "Dela Cruz",
      "sex": "M",
      "lrn_number": "LRN202501001",
      "status": "ENROLLED"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

---

#### GET /api/students/:id

Get student details

**Response (200):**

```json
{
  "student_id": 1,
  "fname": "Juan",
  "lname": "Dela Cruz",
  "sex": "M",
  "lrn_number": "LRN202501001",
  "gl_id": 1,
  "status": "ENROLLED",
  "parent_registrations": [],
  "subject_records": []
}
```

---

#### PUT /api/students/:id

Update student (Admin, Principal, Vice Principal, Teacher)

**Request:**

```json
{
  "fname": "Juan",
  "status": "GRADUATED"
}
```

**Response (200):**

```json
{
  "student_id": 1,
  "fname": "Juan",
  "lname": "Dela Cruz",
  "status": "GRADUATED",
  "updated_at": "2026-02-17T11:45:00Z"
}
```

---

#### GET /api/students/:id/grades

Get student grades for all subjects

**Response (200):**

```json
{
  "student_id": 1,
  "records": [
    {
      "subject_id": 1,
      "subject_name": "Mathematics",
      "q1_grade": 85,
      "q2_grade": 88,
      "q3_grade": 90,
      "q4_grade": 87,
      "avg_grade": 88,
      "remarks": "PASSED"
    }
  ]
}
```

---

#### GET /api/students/:id/attendance

Get student attendance records

**Response (200):**

```json
{
  "student_id": 1,
  "records": [
    {
      "month": "Jan",
      "school_days": 20,
      "days_present": 19,
      "days_absent": 1,
      "attendance_rate": 95
    },
    {
      "month": "Feb",
      "school_days": 20,
      "days_present": 18,
      "days_absent": 2,
      "attendance_rate": 90
    }
  ]
}
```

---

### Class Endpoints

#### POST /api/classes

Create a new class

**Request:**

```json
{
  "gl_id": 1,
  "section_id": 1,
  "class_adviser": 2,
  "syear_start": 2025,
  "syear_end": 2026,
  "class_sched": "Monday - Friday, 7:30 AM - 4:30 PM"
}
```

**Response (201):**

```json
{
  "clist_id": 1,
  "gl_id": 1,
  "section_id": 1,
  "class_adviser": 2,
  "syear_start": 2025,
  "syear_end": 2026,
  "class_sched": "Monday - Friday, 7:30 AM - 4:30 PM"
}
```

---

#### GET /api/classes

Get all classes with filters

**Query Parameters:**

```
?school_year=2025&grade_level=1&page=1&limit=10
```

**Response (200):**

```json
{
  "data": [
    {
      "clist_id": 1,
      "grade_level": "Grade 7",
      "section": "A",
      "class_adviser": "Robert Teacher",
      "syear_start": 2025
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12
  }
}
```

---

#### POST /api/classes/:id/subjects

Add subject to class

**Request:**

```json
{
  "subject_name": "Mathematics",
  "time_start": "08:00",
  "time_end": "09:00",
  "subject_teacher": 2
}
```

**Response (201):**

```json
{
  "srecord_id": 1,
  "subject_name": "Mathematics",
  "time_start": "08:00:00",
  "time_end": "09:00:00",
  "subject_teacher": 2
}
```

---

#### PUT /api/classes/subjects/:subjectId/students/:studentId/grades

Update student grades for a subject

**Request:**

```json
{
  "q1_grade": 85,
  "q2_grade": 88,
  "q3_grade": 90,
  "q4_grade": 87
}
```

**Response (200):**

```json
{
  "srs_id": 1,
  "srecord_id": 1,
  "student_id": 1,
  "q1_grade": 85,
  "q2_grade": 88,
  "q3_grade": 90,
  "q4_grade": 87,
  "avg_grade": 88,
  "remarks": "PASSED"
}
```

---

#### POST /api/classes/students/:studentId/attendance

Record student attendance

**Request:**

```json
{
  "school_days": 20,
  "days_present": 18,
  "days_absent": 2,
  "month": "Feb"
}
```

**Response (201):**

```json
{
  "attendance_id": 1,
  "student_id": 1,
  "month": "Feb",
  "school_days": 20,
  "days_present": 18,
  "days_absent": 2,
  "attendance_rate": 90
}
```

---

### Announcement Endpoints

#### POST /api/announcements

Create announcement (Admin, Principal, Vice Principal only)

**Request:**

```json
{
  "announcement_title": "School Foundation Day",
  "announcement_desc": "Celebrate our school's foundation day",
  "announcement_type": "General",
  "file_ids": [1, 2]
}
```

**Response (201):**

```json
{
  "announcement_id": 1,
  "announcement_title": "School Foundation Day",
  "announcement_desc": "Celebrate our school's foundation day",
  "announcement_type": "General",
  "announced_by": 1,
  "created_at": "2026-02-17T10:30:00Z",
  "files": []
}
```

---

#### GET /api/announcements

Get all announcements with optional filters

**Query Parameters:**

```
?type=General&page=1&limit=20
```

**Response (200):**

```json
{
  "data": [
    {
      "announcement_id": 1,
      "announcement_title": "School Foundation Day",
      "announcement_type": "General",
      "announced_by_name": "John Administrator",
      "created_at": "2026-02-17T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

---

### Event Endpoints

#### POST /api/events

Create event (Admin, Principal, Vice Principal only)

**Request:**

```json
{
  "event_title": "Sports Festival",
  "event_desc": "Annual sports festival",
  "event_date": "2025-03-15",
  "photo_path": "/events/sports-festival.jpg"
}
```

**Response (201):**

```json
{
  "event_id": 1,
  "event_title": "Sports Festival",
  "event_desc": "Annual sports festival",
  "event_date": "2025-03-15",
  "photo_path": "/events/sports-festival.jpg",
  "created_by": 1,
  "created_at": "2026-02-17T10:30:00Z"
}
```

---

#### GET /api/events

Get all events (public endpoint)

**Query Parameters:**

```
?page=1&limit=10
```

**Response (200):**

```json
{
  "data": [
    {
      "event_id": 1,
      "event_title": "Sports Festival",
      "event_date": "2025-03-15",
      "photo_path": "/events/sports-festival.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8
  }
}
```

---

### Library Endpoints

#### POST /api/library/materials

Create learning material (Librarian, Admin only)

**Request:**

```json
{
  "item_name": "Mathematics for Grade 7",
  "author": "John Smith",
  "item_type": "Book",
  "category_id": 1,
  "gl_id": 1
}
```

**Response (201):**

```json
{
  "item_id": 1,
  "item_name": "Mathematics for Grade 7",
  "author": "John Smith",
  "item_type": "Book",
  "category_id": 1,
  "gl_id": 1,
  "uploaded_by": 5,
  "uploaded_at": "2026-02-17T10:30:00Z"
}
```

---

#### GET /api/library/materials

Get all learning materials with filters

**Query Parameters:**

```
?item_type=Book&category_id=1&grade_level=1&page=1&limit=20
```

**Response (200):**

```json
{
  "data": [
    {
      "item_id": 1,
      "item_name": "Mathematics for Grade 7",
      "author": "John Smith",
      "item_type": "Book",
      "category_name": "Textbooks",
      "copies_available": 2,
      "copies_borrowed": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 32
  }
}
```

---

#### POST /api/library/materials/:id/copies

Add copy of material

**Request:**

```json
{
  "copy_code": 1,
  "condition": "Good condition"
}
```

**Response (201):**

```json
{
  "copy_id": 1,
  "item_id": 1,
  "copy_code": 1,
  "status": "AVAILABLE",
  "condition": "Good condition",
  "added_at": "2026-02-17T10:30:00Z"
}
```

---

#### POST /api/library/borrow

Borrow material

**Request:**

```json
{
  "copy_id": 1,
  "student_id": 1,
  "due_at": "2026-03-17T23:59:59Z"
}
```

**Response (201):**

```json
{
  "mbr_id": 1,
  "copy_id": 1,
  "student_id": 1,
  "borrowed_at": "2026-02-17T10:30:00Z",
  "due_at": "2026-03-17T23:59:59Z",
  "status": "BORROWED"
}
```

---

#### PATCH /api/library/borrow/:borrowId/return

Return borrowed material

**Request:**

```json
{
  "penalty_cost": 0,
  "remarks": "Returned in good condition"
}
```

**Response (200):**

```json
{
  "mbr_id": 1,
  "copy_id": 1,
  "student_id": 1,
  "returned_at": "2026-02-20T10:30:00Z",
  "penalty_cost": 0,
  "remarks": "Returned in good condition"
}
```

---

#### GET /api/library/categories

Get all material categories (public)

**Response (200):**

```json
{
  "data": [
    {
      "category_id": 1,
      "category_name": "Books",
      "materials_count": 15
    },
    {
      "category_id": 2,
      "category_name": "Textbooks",
      "materials_count": 22
    }
  ]
}
```

---

### Parent Endpoints

#### POST /api/parents/register

Submit parent registration

**Headers:**

```
Authorization: Bearer {parent_token}
```

**Request:**

```json
{
  "student_ids": [1, 2]
}
```

**Response (201):**

```json
{
  "pr_id": 1,
  "parent_id": 6,
  "status": "PENDING",
  "submitted_at": "2026-02-17T10:30:00Z",
  "students": [
    {
      "student_id": 1,
      "fname": "Juan",
      "lname": "Dela Cruz"
    }
  ]
}
```

---

#### GET /api/parents/registrations

Get all parent registrations (Admin, Teacher, Principal only)

**Query Parameters:**

```
?status=PENDING&page=1&limit=10
```

**Response (200):**

```json
{
  "data": [
    {
      "pr_id": 1,
      "parent_name": "Juan Parent",
      "status": "PENDING",
      "student_count": 2,
      "submitted_at": "2026-02-17T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

---

#### PATCH /api/parents/registrations/:id/verify

Verify parent registration (Admin, Teacher, Principal only)

**Request:**

```json
{
  "status": "VERIFIED",
  "remarks": "Approved parent registration"
}
```

**Response (200):**

```json
{
  "pr_id": 1,
  "parent_id": 6,
  "status": "VERIFIED",
  "verified_by": 1,
  "verified_at": "2026-02-17T11:45:00Z",
  "remarks": "Approved parent registration"
}
```

---

#### GET /api/parents/my-children

Get current parent's children (Parent role)

**Headers:**

```
Authorization: Bearer {parent_token}
```

**Response (200):**

```json
{
  "children": [
    {
      "student_id": 1,
      "fname": "Juan",
      "lname": "Dela Cruz",
      "grade_level": "Grade 7",
      "section": "A",
      "status": "ENROLLED"
    }
  ]
}
```

---

#### GET /api/parents/children/:studentId/grades

Get child's grades (Parent role)

**Response (200):**

```json
{
  "student_id": 1,
  "fname": "Juan",
  "records": [
    {
      "subject_name": "Mathematics",
      "q1_grade": 85,
      "q2_grade": 88,
      "q3_grade": 90,
      "q4_grade": 87,
      "avg_grade": 88,
      "remarks": "PASSED"
    }
  ]
}
```

---

#### GET /api/parents/children/:studentId/attendance

Get child's attendance (Parent role)

**Response (200):**

```json
{
  "student_id": 1,
  "fname": "Juan",
  "records": [
    {
      "month": "Feb",
      "school_days": 20,
      "days_present": 18,
      "days_absent": 2,
      "attendance_rate": 90
    }
  ]
}
```

---

## Response Format

All API responses follow this standard format:

### Success Response (2xx)

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response (4xx, 5xx)

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "details": {...}
}
```

---

## HTTP Status Codes

| Code  | Meaning                                  |
| ----- | ---------------------------------------- |
| `200` | OK - Request successful                  |
| `201` | Created - Resource created               |
| `400` | Bad Request - Invalid input              |
| `401` | Unauthorized - Invalid/missing token     |
| `403` | Forbidden - Insufficient permissions     |
| `404` | Not Found - Resource not found           |
| `422` | Unprocessable Entity - Validation failed |
| `500` | Internal Server Error                    |

---

## Project Structure

```
src/
├── config/
│   └── database.js          # Prisma client configuration
├── middlewares/
│   ├── auth.js              # Authentication & authorization
│   ├── errorHandler.js      # Global error handling
│   └── validation.js        # Request validation
├── routes/
│   ├── index.js             # Main router
│   ├── auth.routes.js
│   ├── users.routes.js
│   ├── students.routes.js
│   ├── parents.routes.js
│   ├── classes.routes.js
│   ├── library.routes.js
│   ├── announcements.routes.js
│   └── events.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── users.controller.js
│   ├── students.controller.js
│   ├── parents.controller.js
│   ├── classes.controller.js
│   ├── library.controller.js
│   ├── announcements.controller.js
│   └── events.controller.js
├── services/
│   ├── auth.service.js
│   ├── users.service.js
│   ├── students.service.js
│   ├── parents.service.js
│   ├── classes.service.js
│   ├── library.service.js
│   ├── announcements.service.js
│   └── events.service.js
├── utils/
│   ├── hashUtil.js          # Password & token hashing
│   └── emailUtil.js         # Email sending
├── app.js                   # Express app configuration
└── server.js                # Server entry point
```

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Role-based access control (RBAC)
- OTP verification for trusted devices
- SQL injection prevention (Prisma ORM)
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
