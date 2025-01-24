import React from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../../store/gameStore";
import { useAuthStore } from "../../store/authStore";
import { Users, Ban, CheckCircle, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const { logout } = useAuthStore();
  const { players, togglePlayerBlock } = useGameStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <Users className="mr-2" /> Player Management
          </h1>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banana Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {players.map((player) => (
                  <tr key={player.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {player.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {player.bananaCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          player.isOnline
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-gray-800"
                        }`}
                      >
                        {player.isOnline ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          togglePlayerBlock(player.id, !player.isBlocked)
                        }
                        className={`inline-flex items-center px-3 py-1 rounded-md ${
                          player.isBlocked
                            ? "text-green-700 bg-green-100 hover:bg-green-200"
                            : "text-red-700 bg-red-100 hover:bg-red-200"
                        }`}
                      >
                        {player.isBlocked ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4 mr-1" />
                            Block
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
