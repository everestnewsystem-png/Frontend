import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const TopStrip = () => {
  const { logout, user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const ticker = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const today = time.toLocaleDateString();
  const now = time.toLocaleTimeString();

  return (
    <div className="w-full bg-gray-900 border-b border-gray-700 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Time Display */}
        <div className="hidden md:flex items-center space-x-4  ">
          <div className="   text-white font-semibold text-sm bg-blue-600/20 px-4 py-2 rounded-lg border border-blue-500/30  ">
            {today} • <span className="text-blue-300">{now}</span>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="text-white text-sm font-medium">
              {user?.username}
            </div>
          </div>
          
          <div className="w-px h-6 bg-gray-600"></div>
          
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-gray-400 hover:text-red-400 hover:bg-red-600/10 px-3 py-2 rounded-lg transition-all duration-200 border border-transparent hover:border-red-500/20"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopStrip;