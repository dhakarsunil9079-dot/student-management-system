# CampusDesk — Cognifyz Full Stack Development Project

A responsive Student Management System built to demonstrate the eight tasks in the Cognifyz Full Stack Development internship brief.

## Features
- EJS-rendered pages and Express server-side form handling
- Client-side and server-side validation
- Responsive Bootstrap layout and custom CSS
- Dynamic UI feedback, search, and delete confirmation
- REST API for student CRUD operations
- MongoDB/Mongoose persistence
- Session authentication with bcrypt password hashing
- Protected pages and API routes
- External API example (`/api/external/sample-post`)
- Helmet security headers, request logging, rate limiting and centralized error handling
- Short-lived in-memory cache and nightly scheduled cache cleanup

## Requirements
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Setup
1. Extract the project folder and open it in a terminal.
2. Install packages:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and set `MONGODB_URI` and a long random `SESSION_SECRET`.
4. Start MongoDB if using a local database.
5. Run the app:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000`, create an account, then add student records.

## Main routes
| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Landing page |
| GET/POST | `/register` | Create account |
| GET/POST | `/login` | Sign in |
| POST | `/logout` | Sign out |
| GET | `/students` | List and search students |
| GET/POST | `/students/new`, `/students` | Add student |
| GET/PUT/DELETE | `/students/:id` | Update or delete student (edit form at `/students/:id/edit`) |
| GET | `/api/students` | List students (authentication required) |
| GET/POST/PUT/DELETE | `/api/students/:id` | REST CRUD endpoints (authentication required) |
| GET | `/api/external/sample-post` | External API integration demo |
| GET | `/health` | Health check |

## Notes for the internship demonstration
- Create a user account first; student pages and APIs require sign-in.
- Use the dashboard to demonstrate CRUD, search, responsive layout and validation.
- The API routes use the same authenticated session as the browser. For Postman, sign in and reuse the session cookie.
- The external API example uses JSONPlaceholder and requires internet access.
- The scheduled maintenance job clears the in-memory cache nightly. It is intentionally lightweight for this internship demonstration.
- OAuth is an advanced authentication concept mentioned as an example in the brief; this project demonstrates secure session authentication rather than a third-party OAuth login.

## Suggested video walkthrough
1. Show the landing page on desktop and mobile widths.
2. Register and sign in.
3. Add a student and show required-field/email validation.
4. Search, edit and delete a record.
5. Show MongoDB records and explain the schema.
6. Demonstrate the REST API and external API endpoint.
7. Explain middleware, rate limiting, cache and scheduled job.

## Internship task mapping
- Task 1: EJS + Express forms and server rendering
- Task 2: Client/server validation and MongoDB-backed temporary/persistent storage
- Task 3: Responsive Bootstrap UI and CSS transitions-ready layout
- Task 4: Complex validation, dynamic DOM behavior and multi-page navigation
- Task 5: RESTful CRUD endpoints and front-end interaction
- Task 6: MongoDB, authentication and protected routes
- Task 7: External API, timeout/error handling and rate limiting
- Task 8: Middleware, scheduled background maintenance and caching
