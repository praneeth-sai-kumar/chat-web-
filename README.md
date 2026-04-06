Real-Time Chat Application
Live Demo

Frontend: [https://your-frontend.vercel.app](https://chat-web-coral-psi.vercel.app/)
Backend: [https://your-backend.onrender.com](https://chat-web-ihak.onrender.com/)

Overview

This is a full-stack real-time chat application that enables one-to-one communication using unique usernames without requiring authentication.

The system combines REST APIs for data persistence and WebSockets for real-time communication, ensuring efficient message delivery and consistent state across clients.

Key Features
Messaging
One-to-one private chat between users
Real-time message delivery using Socket.io
Instant updates without page refresh
User Experience
Username-based access (no login system)
Search functionality to find users
Online and offline user tracking
Offline message delivery when users reconnect
Message Controls
Delete for Me: hides the message for the current user only
Delete for Everyone: replaces the message with a placeholder (restricted to sender)
Pin and unpin messages for emphasis
Tech Stack
Frontend
React (Vite)
Axios
Socket.io Client
Backend
Node.js
Express.js
Socket.io
Database
MongoDB Atlas
System Architecture

The application follows a hybrid architecture:

REST APIs are used to fetch historical data and manage resources
WebSockets are used to handle real-time communication

Data Flow:
Frontend → REST API → Database
Frontend ← WebSocket → Backend

API Endpoints
Users

POST /api/users/register
Registers or logs in a user using a unique username

GET /api/users
Returns the list of all users

Messages

GET /api/messages?user1=&user2=
Fetches chat history between two users

Local Setup
Clone Repository

git clone https://github.com/yourusername/chat-app.git
cd chat-app

Backend Setup

cd backend
npm install

Create a .env file:

MONGO_URI=your_mongodb_connection_string

Run the backend:
npm run dev

Frontend Setup

cd frontend
npm install
npm run dev

Deployment

Frontend is deployed on Vercel
Backend is deployed on Render
Database is hosted on MongoDB Atlas

Design Decisions
Username-based system avoids authentication complexity and speeds up onboarding
Separation of concerns using REST and WebSockets improves scalability
Socket-based communication ensures low-latency updates
Message filtering on frontend ensures chat isolation
Tradeoffs
No authentication system implemented
MongoDB network access is open for development convenience
Free-tier backend hosting may introduce cold start delays
Future Enhancements
Authentication using JWT
Typing indicators
Message read and delivery receipts
Group chat functionality
File and media sharing

Author
praneeth
