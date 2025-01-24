import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { socket } from "./lib/Socket";

import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import PlayerDashboard from "./components/Dashboard/PlayerDashboard";
import Leaderboard from "./components/Leaderboard/Leaderboard";
const App = () => {
  const { user, checkAuth } = useAuthStore();

  console.log(user);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      socket.connect();
    } else {
      socket.disconnect();
    }
    return () => {
      socket.disconnect();
    };
  }, [user]);
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginForm />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <SignupForm />}
        />

        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <PlayerDashboard />
            )
          }
        />
        <Route
          path="/leaderboard"
          element={user ? <Leaderboard /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
