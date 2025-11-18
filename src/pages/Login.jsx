import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);

      login(res.data.token, res.data.user);
      
      navigate("/home"); // redirect after login
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={submit}
        className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-96 border border-white/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 transition-all duration-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 hover:border-gray-400">
              <User size={20} className="text-gray-400 mr-3" />
              <input
                className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 transition-all duration-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 hover:border-gray-400">
              <Lock size={20} className="text-gray-400 mr-3" />
              <input
                type="password"
                className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200"
          >
            Sign In
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;