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
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view/edit data
npm run prisma:studio
```

### 5. Seed Grade Levels (Optional)

You may want to manually add grade levels to your database:
```sql
INSERT INTO grade_levels (grade_level) VALUES
('Kindergarten'),
('Grade 1'),
('Grade 2'),
('Grade 3'),
('Grade 4'),
('Grade 5'),
('Grade 6');
```

### 6. Run the Application
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
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