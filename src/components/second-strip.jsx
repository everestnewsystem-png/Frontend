import { useAuth } from "../context/AuthContext";
import { Sparkles, Coffee, Target } from "lucide-react";
import { useState, useEffect } from "react";

const SecondStrip = () => {
  const { user } = useAuth();
  const [currentGreeting, setCurrentGreeting] = useState(0);

  const greetings = [
    "Happy to work with you today!",
    "Ready to make today productive?",
    "Great things are ahead!",
    "Let's achieve something amazing!",
    "Your productivity is our priority!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreeting((prev) => (prev + 1) % greetings.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 border-b border-gray-700 shadow-sm backdrop-blur-sm">
      <div className="w-full bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800 animate-pulse"></div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-white">
                    Welcome back, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{user?.username}</span>!
                  </span>
                  <Coffee size={16} className="text-amber-400" />
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Target size={14} className="text-green-400" />
                  <div className="text-sm text-gray-300 font-medium transition-all duration-500">
                    {greetings[currentGreeting]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">

              <div className="text-xs text-gray-400 font-medium">Tasks</div>
            </div>
            
            <div className="w-px h-8 bg-gray-600"></div>
            
            <div className="text-center">
             
              <div className="text-xs text-gray-400 font-medium">Pending</div>
            </div>
            
            <div className="w-px h-8 bg-gray-600"></div>
            
            <div className="text-center">
           
              <div className="text-xs text-gray-400 font-medium">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondStrip;