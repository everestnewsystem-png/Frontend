import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import Box from "../components/box";
import { useNavigate } from "react-router-dom";
import { Users, CheckSquare, CreditCard, Settings } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    { 
      label: "Users", 
      path: "/users", 
      color: "from-purple-600 to-purple-800", 
      icon: <Users size={24} />
    },
    { 
      label: "Task Management", 
      path: "/task-setup", 
      color: "from-green-600 to-green-800", 
      icon: <CheckSquare size={24} />
    },
    { 
      label: "Payments", 
      path: "/payments", 
      color: "from-amber-600 to-amber-800", 
      icon: <CreditCard size={24} />
    },
    { 
      label: "Tools", 
      path: "/tools", 
      color: "from-cyan-600 to-cyan-800", 
      icon: <Settings size={24} />
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-gray-400 text-lg">
            System administration and management tools
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Box 
                label={item.label}
                icon={item.icon}
                gradient={item.color}
                onClick={() => navigate(item.path)}
              />
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-white mb-2">24</div>
            <div className="text-gray-400 font-medium">Active Users</div>
            <div className="text-sm text-green-400 mt-2">+5 this week</div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-white mb-2">156</div>
            <div className="text-gray-400 font-medium">Pending Tasks</div>
            <div className="text-sm text-amber-400 mt-2">12 overdue</div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-3xl font-bold text-white mb-2">$12,458</div>
            <div className="text-gray-400 font-medium">Revenue</div>
            <div className="text-sm text-blue-400 mt-2">This month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;