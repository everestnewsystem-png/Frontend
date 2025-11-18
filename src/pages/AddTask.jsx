import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, User, FileText } from "lucide-react";

const AddTask = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error loading users:", err));
  }, []);

  const submit = async () => {
    if (!task.trim() || !userId) return;
    setLoading(true);
    try {
      await api.post("/tasks", { taskTo: userId, taskText: task });
      navigate("/task-setup");
    } catch (error) {
      console.error("Error adding task:", error);
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
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Add New Task</h1>
                <p className="text-gray-400 text-sm">Create and assign a new task</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Plus size={24} className="text-blue-400" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                <User size={16} className="text-blue-400" />
                <span>Assign To User *</span>
              </label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                <FileText size={16} className="text-green-400" />
                <span>Task Description *</span>
              </label>
              <textarea
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white resize-none"
                rows={4}
                placeholder="Enter task details..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>

            <button
              onClick={submit}
              disabled={!task.trim() || !userId || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
