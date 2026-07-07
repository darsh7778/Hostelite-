# Hostelite

Hostelite is a smart hostel management system for educational institutions. It provides a centralized platform for students, wardens, and administrators to manage hostel operations including:

- Student profile management with document verification
- Room allocation and management
- Complaint submission and resolution tracking
- Daily meal planning and student feedback/rating system
- User management with role-based access control

## Project Structure

```
Hostelite-project/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/                 # Business logic (11 files)
│   ├── middleware/                   # Auth, file upload, role checks
│   ├── models/                       # Mongoose schemas (7 files)
│   ├── routes/                       # API route definitions (10 files)
│   ├── utils/                        # ImageKit integration
│   ├── app.js                        # Express app setup
│   ├── server.js                     # Server entry point
│   └── .env                          # Environment variables
└── frontend/
    ├── src/
    │   ├── components/               # Reusable UI components
    │   ├── contexts/                 # React Context (Auth)
    │   ├── pages/                    # Page components (14 files)
    │   ├── services/                 # API client
    │   ├── styles/                   # CSS modules
    │   ├── assets/                   # Static assets
    │   ├── App.jsx                   # React Router setup
    │   └── main.jsx                  # React entry point
    └── package.json
```

## Backend Architecture

### Technology Stack
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- ImageKit for file storage
- Nodemailer for email (OTP)
- PDFKit for PDF generation
- Multer for file uploads
- cookie-parser for cookie handling

### Design Pattern
MVC-like structure with Controllers handling business logic, Models defining data structure, Routes defining API endpoints, and Middleware for cross-cutting concerns.

## Frontend Architecture

### Technology Stack
- React 19 with React Router DOM
- Axios for API calls
- Lucide React for icons
- ImageKit React SDK for image uploads
- Vite as build tool

### State Management
React Context API for authentication (AuthContext), local state for component-specific data.

### Routing
Protected routes with role-based access control using ProtectedRoute component.

## Database Design

### MongoDB Collections

- **User** - Authentication and basic user info
- **UserProfile** - Extended student/warden profile with documents
- **Room** - Room inventory and assignment
- **Complaint** - Student complaints and resolution tracking
- **Meal** - Daily meal plans
- **MealRating** - Student meal feedback
- **SystemSettings** - Global system configuration

## Authentication Flow

### Registration (with Email OTP Verification)
- POST /api/auth/register
- Validates role limits (max 1 admin, 2 wardens)
- Hashes password with bcrypt
- Generates 6-digit OTP and hashes it with SHA-256
- Sends OTP to user's email via Nodemailer
- Stores user temporarily with OTP (10-minute expiry)
- Returns success message with email
- User must verify OTP to complete registration

### OTP Verification
- POST /api/auth/verify-otp
- Accepts email and 6-digit OTP
- Validates OTP against hashed value
- Checks OTP expiry (10 minutes)
- Clears OTP fields from user document
- Returns success message
- User can now login

### Resend OTP
- POST /api/auth/resend-otp
- Generates new 6-digit OTP
- Invalidates previous OTP
- Sends new OTP to email
- Rate limited (3 requests per 15 minutes)

### Login
- POST /api/auth/login
- Validates credentials
- Generates access token (15-minute expiry)
- Generates refresh token (7-day expiry)
- Hashes refresh token and stores in database
- Sets refresh token in httpOnly, secure, sameSite cookie
- Returns access token + user info
- Frontend stores access token in localStorage

### Token Refresh
- POST /api/auth/refresh-token
- Verifies refresh token from cookie
- Validates against hashed token in database
- Generates new access token
- Returns new access token
- Automatic refresh on 401 errors via API interceptor

### Logout
- POST /api/auth/logout
- Clears refresh token from database
- Clears refresh token cookie
- Frontend clears access token from localStorage
- Redirects to login

### Password Reset (with OTP)
- POST /api/auth/forgot-password
- Validates email exists in database
- Generates 6-digit OTP and hashes it with SHA-256
- Stores OTP with 15-minute expiry
- Sends OTP to user's email via Nodemailer
- Rate limited (3 requests per 15 minutes)

- POST /api/auth/reset-password
- Validates email, OTP, and new password
- Verifies OTP against hashed value
- Checks OTP expiry (15 minutes)
- Hashes new password with bcrypt
- Updates password in database
- Clears OTP fields
- Invalidates all sessions (clears refresh tokens)
- Returns success message

### Token Storage
- **Access Token:** localStorage (client-side) - 15 minutes
- **Refresh Token:** httpOnly cookie (server-side) - 7 days

## Authorization Flow

### Middleware Chain
- **authMiddleware** - Verifies JWT, attaches user to req
- **roleMiddleware** - Checks user role against allowed roles
- **isAdmin** - Specific admin-only check
- **authorizeRoles** - Generic role checker

### Role Hierarchy
- **Admin:** Full system access, user management, settings
- **Warden:** Complaint management, meal updates
- **Student:** Profile submission, complaints, meal rating

## Security Mechanisms

### Enhanced Security
- Short-lived access tokens (15 minutes) - reduces exposure window
- Refresh token rotation - new token on each refresh
- httpOnly cookies - protects against XSS attacks
- Secure cookies - HTTPS only in production
- sameSite cookies - CSRF protection
- Hashed refresh tokens - stored securely in database
- Automatic token refresh - seamless user experience
- Proper logout - clears tokens from both client and server

### Existing Security
- Password hashing with bcrypt (salt rounds: 10)
- Role-based access control
- Input validation on forms
- File type restrictions (images only)
- File size limits (5MB)
- OTP expiry (5 minutes)
- CORS configured for specific origin with credentials

## Token Flow

### Access Token
- Generated on login and refresh
- Stored in localStorage
- Sent in Authorization header: `Bearer <token>`
- Validated on each protected route
- 15-minute expiry

### Refresh Token
- Generated on login
- Stored in httpOnly cookie
- Sent automatically with requests (via withCredentials)
- Validated against hashed token in database
- 7-day expiry
- Used to obtain new access tokens
- Cleared on logout

## Cookies

### Refresh Token Cookie
- Name: `refreshToken`
- httpOnly: true (prevents XSS)
- secure: true in production (HTTPS only)
- sameSite: strict (CSRF protection)
- maxAge: 7 days
- path: /

## Sessions

Not used - stateless JWT authentication with refresh token mechanism

## API Structure

### Base URL
`http://localhost:8000/api`

### Route Groups

- **/auth** - Authentication
  - POST /auth/register - Send OTP for email verification
  - POST /auth/verify-otp - Verify OTP and complete registration
  - POST /auth/resend-otp - Resend OTP (rate limited)
  - POST /auth/login
  - POST /auth/refresh-token
  - POST /auth/logout
  - POST /auth/forgot-password
  - POST /auth/reset-password
- **/users** - User management
- **/profile** - User profiles
- **/complaints** - Complaint system
- **/meals** - Meal management
- **/ratings** - Meal ratings
- **/rooms** - Room management
- **/admin** - Admin operations
- **/system-settings** - System configuration
- **/imagekit** - Image uploads

## Frontend Routes

- `/` - Login page
- `/register` - Registration
- `/dashboard` - Role-based dashboard
- `/complaints` - Student complaints
- `/warden/complaints` - Warden complaint management
- `/warden/meals` - Warden meal updates
- `/student/meals` - Student meal view + rating
- `/student/profile` - Student profile submission
- `/admin/users` - User management
- `/admin/student/:id` - Student profile view/edit
- `/admin/system-settings` - System settings
- `/forgot-password` - Password reset

## Controllers

### Key Controllers

- **authController** - Register, login, password reset, token refresh, logout
- **userController** - User CRUD, room assignment
- **userProfileController** - Profile submission/retrieval
- **complaintController** - Complaint submission/status updates
- **mealController** - Meal plan updates
- **ratingController** - Meal rating submission/retrieval
- **room.controller** - Room creation/assignment
- **adminController** - Admin-specific operations
- **pdfController** - PDF generation
- **imagekitController** - Image upload handling

## Models/Schemas

### User Model
- name, email, password (required)
- role (enum: student, warden, admin)
- room (ref: Room)
- hostelName
- registrationOTP, registrationOTPExpires (for email verification)
- registrationData (temporary storage during registration)
- resetOTP, resetOTPExpires (for password reset)
- refreshToken (hashed refresh token storage)

### UserProfile Model
- user (ref: User, unique)
- role (enum: student, warden)
- Personal details: fullName, fatherName, motherName, phone, address
- Aadhaar: aadhaarNumber, aadhaarPhoto, aadhaarFileId
- profilePhoto, profileFileId
- studentType (university_student/working_professional)
- universityName, companyName
- submitted (boolean)

### Room Model
- roomNumber (unique)
- isOccupied (boolean)
- assignedTo (ref: User)

### Complaint Model
- student (ref: User)
- warden (ref: User)
- title, description
- status (enum: pending, resolved)

### Meal Model
- date (unique)
- breakfast, lunch, dinner
- updatedBy (ref: User)

### MealRating Model
- student (ref: User)
- date
- mealType (enum: breakfast, lunch, dinner)
- rating (1-5)
- comment
- Index: {student, date, mealType} unique

### SystemSettings Model
- totalRooms (number)

## Middleware

### authMiddleware
- Extracts Bearer token from Authorization header
- Verifies JWT with JWT_SECRET
- Fetches user from DB, excludes password
- Attaches user to req.user

### multer
- Memory storage for ImageKit uploads
- 5MB file size limit
- Image-only file filter

### roleMiddleware
- Factory function returning role-checking middleware
- Compares user.role against allowed roles array

## Utilities

### imagekit.js
- Initializes ImageKit client with env vars
- Exports hasCredentials flag

### uploadToImageKit.js
- uploadToImageKit() - Uploads file buffer to ImageKit
- deleteFromImageKit() - Deletes file by ID

## Environment Variables

### Required (.env)
Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/hostelite

# JWT Authentication
JWT_SECRET=your-secret-key-here

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# ImageKit Configuration (for file uploads)
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
```

### Notes
- **EMAIL_PASS**: For Gmail, generate an App Password at https://myaccount.google.com/apppasswords
- **JWT_SECRET**: Use a strong, random string for production
- **IMAGEKIT**: Optional - only required if using ImageKit for file uploads
- **NODE_ENV**: Set to `production` for production deployment

## Third-Party Libraries

### Backend
- express, cors, dotenv
- mongoose, mongodb
- bcryptjs, jsonwebtoken
- cookie-parser
- multer, nodemailer
- express-rate-limit
- imagekit, pdfkit

### Frontend
- react, react-dom, react-router-dom
- axios (withCredentials: true for cookies)
- lucide-react
- imagekitio-react
- vite, eslint

## External APIs

- **ImageKit** - Cloud image storage
- **Gmail SMTP** - Email delivery for OTP
- **Unsplash** - Placeholder images (frontend only)

## Error Handling

### Backend
- Try-catch blocks in all controllers
- Generic error responses with status codes
- User-friendly error messages

### Frontend
- Try-catch in async operations
- Error state management
- Loading states
- Automatic token refresh on 401 errors

## File Upload Flow

### Profile Photos/Aadhaar
1. User selects file via ImageUploadSimple component
2. File preview displayed
3. User clicks "Upload to Cloud"
4. POST to /api/imagekit/upload with FormData
5. Multer middleware processes file to memory
6. ImageKit controller uploads to ImageKit
7. Returns URL and fileId
8. URL stored in component state
9. On form submit, URL sent to backend
10. Backend stores URL in UserProfile document

## Email Flow

### Registration OTP
1. User submits registration form
2. Backend validates input and role limits
3. Generates 6-digit OTP and hashes with SHA-256
4. Stores user temporarily with OTP (10-minute expiry)
5. Nodemailer sends OTP via Gmail SMTP
6. User enters OTP on verification page
7. Backend validates OTP and expiry
8. Clears OTP fields, registration complete
9. User can now login

### Password Reset OTP
1. User requests reset with email
2. Backend generates 6-digit OTP
3. OTP hashed with SHA-256, stored with 15-min expiry
4. Nodemailer sends email via Gmail SMTP
5. User enters OTP and new password
6. Backend validates OTP and expiry
7. Password updated if valid
8. All sessions invalidated (refresh tokens cleared)

## Frontend API Service

### api.js
- Axios instance with base URL and JWT interceptor
- withCredentials: true for cookie support
- Automatic token refresh on 401 errors
- Request queue for concurrent refresh attempts
- Redirect to login on refresh failure
