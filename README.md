# 🍌 Banana Clicker Game

A real time multiplayer game where players compete to collect most bananas. Built with react,Node js ,Express, and Socket.IO

##  ✨ Features

- **Real-time-Gameplay** : Instantly see other players score and status
- **Authentication system** : Secure JWT-Based authentication with cookie storage
- **Role-based access** : Difference interfaces for players and admins
- **Responsive Design** : Beautiful UI and lucide react for icons


## Tech Stack

## Frontend 
- React
- Zustand
- Tailwind v4.0
- Socket.IO Client
- Axios 
- Lucide React 

## Backend
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication
- Cookie-based session storage

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running locally
- npm package manager


## installation

1. Clone the repo
```bash
git clone git@github.com:Mrinal-xx-Singha/Fruits_Click_Game.git

cd backend
cd frontend
```
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/banana-game
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
PORT=3000
```
4. Start the development servers:
```bash
npm run dev
```

This will start both the frontend(port 5173) and backend (port 3000)servers


### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Players
- `GET /api/players` - Get all players (admin only)
- `PATCH /api/players/:id/toggle-block` - Toggle player block status (admin only)
- `GET /api/players/leaderboard` - Get top players leaderboard
