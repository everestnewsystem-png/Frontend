import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import Box from "../components/box";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Countries", path: "/countries", color: "from-blue-600 to-blue-800", icon: "🌍" },
    { label: "Applicants", path: "/applicants", color: "from-blue-700 to-blue-900", icon: "👥" },
    { label: "Agents", path: "/agents", color: "from-indigo-600 to-indigo-800", icon: "🤝" },
    { label: "Passports", path: "/passport", color: "from-blue-800 to-indigo-900", icon: "📘" },
    { label: "Police Clearance", path: "/police", color: "from-slate-700 to-slate-900", icon: "👮" },
    { label: "Tasks", path: "/tasks", color: "from-cyan-600 to-cyan-800", icon: "✅" },
    { label: "Dashboard", path: "/dashboard", color: "from-gray-700 to-gray-900", icon: "📊" },
    { label: "Tools", path: "/tools", color: "from-teal-600 to-teal-800", icon: "🛠️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-800/30 to-transparent rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-indigo-800/30 to-transparent rounded-full blur-3xl opacity-30 animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-800/20 to-transparent rounded-full blur-3xl opacity-20 animate-pulse-slow delay-500"></div>
      </div>

      <div className="relative z-10">
        <TopStrip />
        <SecondStrip />
  
        {/* Main content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent mb-6">
              Management Portal
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Streamline your workflow with our comprehensive suite of management tools and features
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-stagger-fade">
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

          {/* Footer CTA */}
          <div className="text-center mt-20 animate-fade-in-up delay-1000">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft border border-gray-700/50">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Need Assistance?
              </h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Our support team is here to help you get the most out of your management portal.
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;