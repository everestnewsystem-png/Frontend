import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import Box from "../components/box";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, Calendar, Eye,Printer, Settings,PersonStanding  } from "lucide-react";

const Tools = () => {
  const navigate = useNavigate();

  const menuItems = [
    { 
      label: "Search Tool", 
      path: "/search-tool", 
      color: "from-blue-600 to-blue-800", 
      icon: <Search size={24} />
    },
    { 
      label: "Search Permits", 
      path: "/search-permits", 
      color: "from-blue-600 to-blue-800", 
      icon: <Search size={24} />
    },
    { 
      label: "Progress Change Tool", 
      path: "/progress-change-tool", 
      color: "from-green-600 to-green-800", 
      icon: <TrendingUp size={24} />
    },
    { 
      label: "Appointment Set Tool", 
      path: "/appointment-set-tool", 
      color: "from-purple-600 to-purple-800", 
      icon: <Calendar size={24} />
    },
    { 
      label: "AppointmentView Tool", 
      path: "/print-tool", 
      color: "from-amber-600 to-amber-800", 
      icon: <Eye size={24} />
    },
    { 
      label: "Letter Tool", 
      path: "/offer", 
      color: "from-green-600 to-green-800", 
      icon: <Calendar size={24} />
    },
    { 
      label: "Agent Change Tool", 
      path: "/agentassign", 
      color: "from-green-600 to-green-800", 
      icon: <PersonStanding size={24} />
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Settings size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">System Tools</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Access specialized tools for managing applicants, progress tracking, appointments, and document printing
          </p>
        </div>

        {/* Tools Grid */}
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
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-white mb-2">4</div>
            <div className="text-gray-400 font-medium">Available Tools</div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/20 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">156</div>
            <div className="text-gray-400 font-medium">Documents Printed</div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20 text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">89</div>
            <div className="text-gray-400 font-medium">Progress Updates</div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">42</div>
            <div className="text-gray-400 font-medium">Appointments Set</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;