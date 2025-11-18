import { useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Globe, Save } from "lucide-react";

const AddCountry = () => {
  const [countryName, setCountryName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!countryName.trim()) return;
    
    setLoading(true);
    try {
      await api.post("/countries", { countryName });
      navigate("/countries");
    } catch (error) {
      console.error("Error adding country:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/countries")}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Add New Country</h1>
                <p className="text-gray-400 text-sm">Add a new destination country to the system</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Globe size={24} className="text-blue-400" />
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Country Name <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter country name"
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && submit()}
              />
            </div>

            <button
              onClick={submit}
              disabled={!countryName.trim() || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Plus size={20} />
              )}
              <span>{loading ? "Adding Country..." : "Add Country"}</span>
            </button>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Tips</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Use the full official country name</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Check for existing countries to avoid duplicates</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Applicants can be assigned to this country once added</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCountry;