import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft, User, FileText } from "lucide-react";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [task, setTask] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));

    // ✅ Fixed data fetching route
    api.get(`/admin/tasks/${id}`)
      .then((res) => {
        if (res.data) {
          setTask(res.data.task || res.data.taskText || "");
          setUserId(res.data.userId || res.data.taskTo || "");
        }
      })
      .catch((err) => console.error("Error loading task:", err));
  }, [id]);

  const submit = async () => {
    if (!task.trim() || !userId) return;

    setLoading(true);
    try {
      await api.put(`/admin/tasks/${id}`, { userId, task });
      navigate("/task-setup");
    } catch (error) {
      console.error("Error updating task:", error);
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/task-setup")}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Edit Task</h1>
                <p className="text-gray-400 text-sm">
                  Update task details and assignment
                </p>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-blue-400" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                <User size={16} className="text-blue-400" />
                <span>
                  Assign To User <span className="text-red-400">*</span>
                </span>
              </label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                <option value="" className="text-gray-400">
                  Select user
                </option>
                {users.map((u) => (
                  <option key={u._id} value={u._id} className="text-white">
                    {u.username} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Task Description <span className="text-red-400">*</span>
              </label>
              <textarea
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={4}
                placeholder="Enter task description..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>

            <button
              onClick={submit}
              disabled={!task.trim() || !userId || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={20} />
              )}
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
