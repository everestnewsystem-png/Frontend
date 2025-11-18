import { useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import Button from "../components/button";
import { useNavigate } from "react-router-dom";
import { useError } from "../context/ErrorContext"; // ✅ Global Error Overlay
import { CheckCircle } from "lucide-react";

const AddAgent = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [isSuper, setIsSuper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // ✅ local success overlay
  const navigate = useNavigate();
  const { showError } = useError(); // ✅ from global context

  const submit = async () => {
    if (!name.trim()) {
      showError("Agent name is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/agents", { name, contact, isSuper });

      // ✅ show success overlay
      setSuccess({
        title: "Agent Added Successfully",
        message: `${res.data?.agent?.name || name} has been added.`,
      });

      // ✅ delay navigation to allow user to see success
      setTimeout(() => {
        navigate("/agents");
      }, 1500);
    } catch (error) {
      console.error("Error adding agent:", error);

      const msg =
        error.response?.data?.message ||
        "Failed to add agent. Please check the form and try again.";
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <TopStrip />
      <SecondStrip />

      {/* ✅ SUCCESS OVERLAY */}
      {success && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-green-600 text-white max-w-sm w-full mx-4 rounded-lg shadow-lg p-6 text-center animate-fade-in">
            <CheckCircle size={36} className="mx-auto mb-2 text-white" />
            <h2 className="text-lg font-bold mb-1">{success.title}</h2>
            <p className="text-sm text-green-100">{success.message}</p>
            <button
              onClick={() => setSuccess(null)}
              className="mt-4 bg-white text-green-700 px-4 py-2 rounded font-semibold hover:bg-gray-100"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-white mb-6">
            Add New Agent
          </h1>

          <div className="space-y-4">
            {/* Agent Name */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Agent Name <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter agent name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Contact Information
              </label>
              <input
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Phone, email, or other contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            {/* Super Agent */}
            <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
              <input
                type="checkbox"
                checked={isSuper}
                onChange={(e) => setIsSuper(e.target.checked)}
                className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-500 rounded focus:ring-blue-400"
              />
              <span className="text-white font-medium">Super Agent</span>
            </div>

            {/* Submit Button */}
            <Button
              text={loading ? "Adding Agent..." : "Add Agent"}
              onClick={submit}
              disabled={!name.trim() || loading}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAgent;
