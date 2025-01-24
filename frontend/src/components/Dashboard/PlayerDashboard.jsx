import React from "react";
import { useAuthStore } from "../../store/authStore";
import { useGameStore } from "../../store/gameStore";
import { useNavigate } from "react-router-dom";
import { Banana, LogOut } from "lucide-react";

const PlayerDashboard = () => {
  const { user, logout } = useAuthStore();
  const { players, updateBananaCount } = useGameStore();
  const navigate = useNavigate();

  const currentPlayer = players.find((p) => p.id === user?.id);

  console.log(currentPlayer);

  const handleBananaClick = () => {
    if (user?.id) {
      updateBananaCount(user.id);
    } else {
      console.error("User ID is not available");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Error during logout ", err);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome. {user?.username}!
          </h1>
          <button
            onClickCapture={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
        {/* Main content section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="text-center py-8">
              <div className="mb-4">
                <span className="text-4xl font-bold text-yellow-500">
                  {currentPlayer?.bananaCount || 0}
                </span>
                <p className="text-gray-600">Bananas Collected</p>
              </div>
              {/* Button to collect bananas */}
              <button
                onClick={handleBananaClick}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <Banana className="mr-2 h-5 w-5" />
                Click for Banana!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
