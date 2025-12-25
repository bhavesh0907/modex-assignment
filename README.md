🎬 Full Stack Movie Ticket Booking System

Modex Full Stack Developer Assignment

A complete end-to-end movie ticket booking platform built as part of the Modex Full Stack Developer Assessment.
The system enables users to browse shows, select seats, manage bookings, and allows admins to create and manage shows.

Both frontend and backend are fully deployed with CI/CD pipelines.

🔗 Live Demo
Frontend (Vercel)

👉 https://modex-assignment.vercel.app

Backend (Render)

👉 https://modex-backend-ir7z.onrender.com

📌 Project Overview

This project demonstrates a production-ready full-stack application, covering:

Interactive seat booking UI

RESTful backend APIs

Database design with Prisma ORM

Deployment on cloud platforms

CI/CD via GitHub integrations

✨ Features
👤 User Features

View all available movie shows

Real-time seat availability (auto-refresh)

Select and book multiple seats

View booking history

Cancel bookings anytime

User identity stored using LocalStorage

Fully responsive UI

🛠 Admin Features

Create new movie shows

Define movie name, show time, and seat capacity

View all available shows

⚙ System Features

REST APIs using Express.js

PostgreSQL database with Prisma ORM

Secure CORS configuration

Auto-refresh polling for seat updates

Deployed frontend & backend

CI/CD via GitHub → Vercel & Render

🧱 System Architecture
Frontend (React + Vite, Vercel)
        |
        |  HTTPS (Axios)
        v
Backend (Node.js + Express, Render)
        |
        v
Database (PostgreSQL + Prisma)

📁 Project Structure
Frontend
src/
 ├─ pages/
 │   ├─ Home.jsx
 │   ├─ Booking.jsx
 │   ├─ MyBookings.jsx
 │   ├─ Admin.jsx
 ├─ components/
 │   └─ SeatGrid.jsx
 ├─ api.js
 ├─ App.jsx
 └─ main.jsx

Backend
backend/
 ├─ src/
 │   ├─ server.js
 │   ├─ routes/
 │   │   ├─ shows.js
 │   │   ├─ bookings.js
 │   ├─ prisma/
 │       └─ schema.prisma
 ├─ package.json
 ├─ Dockerfile
 └─ render.yaml

🗄 Database Schema
Show
Field	Type	Description
id	Int	Primary Key
name	String	Movie name
datetime	DateTime	Show time
totalSeats	Int	Total seats
availableSeats	Int	Seats remaining
Booking
Field	Type	Description
id	Int	Primary Key
userName	String	User who booked
showId	Int	Foreign key
seats	Int[]	Booked seat numbers
status	String	confirmed / cancelled
createdAt	Date	Timestamp
📡 API Documentation
Base URL
https://modex-backend-ir7z.onrender.com

🎥 Show APIs

GET /shows
Returns all available shows.

GET /shows/:id
Returns show details and seat availability.

POST /shows (Admin)
Creates a new show.

🎟 Booking APIs

POST /book
Book seats for a show.

GET /bookings/:userName
Fetch all bookings by a user.

POST /cancel
Cancel a booking.

🚀 Deployment
Frontend – Vercel

Framework: React + Vite

Auto-deployment via GitHub

SPA routing handled via vercel.json

Backend – Render

Node.js + Express server

PostgreSQL hosted on Render

Docker-based deployment

Auto-redeploy on Git push

🛠 Tech Stack
Frontend

React.js

Vite

Axios

CSS

Backend

Node.js

Express.js

Prisma ORM

PostgreSQL

DevOps & Tools

GitHub

Vercel

Render

Docker

render.yaml

⚠ Limitations

Render free tier may sleep (initial 503 delay)

Basic pseudo-authentication (LocalStorage only)

Polling-based updates (no WebSockets)

Admin panel has no authentication

🚀 Future Improvements

JWT-based authentication

WebSocket-based real-time seat updates

Payment gateway integration

Admin analytics dashboard

Email/SMS booking confirmations

📄 License

This project is submitted for the Modex Full Stack Developer Assessment.
All rights reserved by the author.
