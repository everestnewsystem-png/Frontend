import { useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { useNavigate } from "react-router-dom";
import { UserPlus, Save, ArrowLeft, User, Lock, Shield } from "lucide-react";

const AddUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "viewer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (f, v) => setForm({ ...form, [f]: v });

  const submit = async () => {
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/users", form);
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      viewer: "Can view data but cannot make changes",
      editor: "Can view and edit most data",
      admin: "Full system access including user management"
    };
    return descriptions[role] || "";
  };

  const getRoleColor = (role) => {
    const colors = {
      viewer: "text-blue-400",
      editor: "text-green-400",
      admin: "text-red-400"
    };
    return colors[role] || "text-gray-400";
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
                onClick={() => navigate("/users")}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Add New User</h1>
                <p className="text-gray-400 text-sm">Create a new system user account</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <UserPlus size={24} className="text-blue-400" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                <User size={16} className="text-blue-400" />
                <span>Username <span className="text-red-400">*</span></span>
              </label>
              <input
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter username"
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                <Lock size={16} className="text-green-400" />
                <span>Password <span className="text-red-400">*</span></span>
              </label>
              <input
                type="password"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter password (min. 6 characters)"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
              {form.password && form.password.length < 6 && (
                <p className="text-amber-400 text-xs mt-2">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                <Shield size={16} className="text-purple-400" />
                <span>User Role <span className="text-red-400">*</span></span>
              </label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
              >
                <option value="viewer" className="text-white">Viewer</option>
                <option value="editor" className="text-white">Editor</option>
                <option value="admin" className="text-white">Admin</option>
              </select>
              
              {/* Role Description */}
              <div className="mt-2 p-3 bg-gray-750 rounded-lg border border-gray-600">
                <div className={`text-sm font-medium ${getRoleColor(form.role)}`}>
                  {form.role.charAt(0).toUpperCase() + form.role.slice(1)} Role
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {getRoleDescription(form.role)}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={submit}
              disabled={loading || !form.username.trim() || !form.password.trim() || form.password.length < 6}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={20} />
              )}
              <span>{loading ? "Creating User..." : "Add User"}</span>
            </button>
          </div>

          {/* Role Permissions Summary */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Role Permissions</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-gray-750 rounded-lg">
                <div>
                  <span className="text-blue-400 font-medium">Viewer</span>
                  <div className="text-gray-400 text-xs">Read-only access</div>
                </div>
                <div className="text-gray-500 text-xs">Basic</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-750 rounded-lg">
                <div>
                  <span className="text-green-400 font-medium">Editor</span>
                  <div className="text-gray-400 text-xs">Can create and edit data</div>
                </div>
                <div className="text-gray-500 text-xs">Standard</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-750 rounded-lg border border-red-500/20">
                <div>
                  <span className="text-red-400 font-medium">Admin</span>
                  <div className="text-gray-400 text-xs">Full system control</div>
                </div>
                <div className="text-red-400 text-xs font-medium">Full Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;