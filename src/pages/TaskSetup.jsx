import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

const TaskSetup = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks"); // ✅ FIXED from /admin/tasks
      setTasks([...res.data.active, ...res.data.completed]);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`); // ✅ FIXED endpoint
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Task Setup</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/add-task")}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={18} />
              <span>Add Task</span>
            </button>
            <button
              onClick={fetchTasks}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-6">
          {loading ? (
            <p className="text-gray-400">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-400">No tasks available.</p>
          ) : (
            <table className="w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700 text-sm text-gray-400 uppercase">
                  <th className="py-3 px-2">#</th>
                  <th className="py-3 px-2">Task</th>
                  <th className="py-3 px-2">Assigned To</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t, i) => (
                  <tr
                    key={t._id}
                    className="border-b border-gray-700 hover:bg-gray-750"
                  >
                    <td className="py-3 px-2 text-gray-400">{i + 1}</td>
                    <td className="py-3 px-2">{t.taskText || t.task}</td>
                    <td className="py-3 px-2">
                      {t.taskTo?.username || "System"}
                    </td>
                    <td
                      className={`py-3 px-2 font-semibold ${
                        t.isCompleted ? "text-green-400" : "text-blue-400"
                      }`}
                    >
                      {t.isCompleted ? "Completed" : "Active"}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => navigate(`/edit-task/${t._id}`)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteTask(t._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskSetup;
