Full Stack Ticket Booking System – Modex Assignment

A complete end-to-end movie ticket booking platform built for the Modex Full Stack Developer Assessment.
The system allows users to browse shows, book seats, manage bookings, and enables admins to create shows.
Both frontend (Vercel) and backend (Render) are fully deployed.

🔹 Live Links
Frontend (Vercel):

https://modex-assignment.vercel.app

Backend (Render):

https://modex-backend-ir7z.onrender.com

📌 Overview

This project demonstrates a fully functional full-stack application including:

React frontend with seat selection UI

Express + Prisma backend with PostgreSQL

Real-time seat updates via polling

User booking management

Admin show creation

Fully deployed system with CI/CD (GitHub → Vercel & Render)

✨ Features
User Features

View all available shows

See seat availability using a grid layout

Select multiple seats and confirm booking

View all their bookings

Cancel bookings anytime

Auto-refresh every few seconds

Stores user identity using LocalStorage

Admin Features

Create new shows

Add movie name, datetime, seat capacity

View all shows

System Features

REST APIs using Express

Database via Prisma ORM

Secure CORS configuration

Deployed backend + frontend

Fully responsive UI

🧱 Architecture
Frontend (React + Vite, Vercel)
        |
        | Axios HTTPS Requests
        v
Backend (Node.js + Express, Render)
        |
        v
Database (PostgreSQL + Prisma)

Frontend Structure
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

Backend Structure
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
availableSeats	Int	Seats left
Booking
Field	Type	Description
id	Int	Primary Key
userName	String	User making the booking
showId	Int	Foreign key
seats	Int[]	Booked seat numbers
status	String	confirmed / cancelled
createdAt	Date	Timestamp
📡 API Documentation
Base URL
https://modex-backend-ir7z.onrender.com

Show APIs
GET /shows

Returns list of shows.

GET /shows/:id

Returns show details with seat info.

POST /shows (Admin)

Creates a new show.

Booking APIs
POST /book

Books X seats for a show.

GET /bookings/:userName

Returns all bookings made by the user.

POST /cancel

Cancels a booking.

🚀 Deployment
Frontend – Vercel

Framework: React + Vite

Deployed with automatic GitHub integration

SPA routing handled via vercel.json

Backend – Render

Node.js Express server

Runs via Docker or Node build

PostgreSQL database on Render

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

Other Tools

Render (Hosting)

Vercel (Frontend hosting)

GitHub

Dockerfile / render.yaml

📸 Screenshots (Insert your screenshots here)

Home Page

Booking Page

My Bookings Page

Admin Page

Render Backend Dashboard

Vercel Deployment Dashboard

⚠ Limitations

Render free tier may sleep → causes 503 waits

Basic pseudo-auth (localStorage name only)

No WebSocket live updates (polling only)

Admin has no login authentication

🚀 Future Improvements

JWT-based authentication

Payment gateway integration

Real-time WebSocket updates

Analytics dashboard for admin

Email/SMS booking confirmation

📄 License

This project is submitted for the Modex Full Stack Developer Assessment.
All rights reserved by the author.
