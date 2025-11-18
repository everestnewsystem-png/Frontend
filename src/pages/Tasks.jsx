import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import Loading from "../components/loading";
import { CheckCircle, User, Calendar, RefreshCw, CheckSquare, Square } from "lucide-react";

const Tasks = () => {
  const [active, setActive] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      setActive(res.data.active || []);
      setCompleted(res.data.completed || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleTask = async (taskId, isCompleted) => {
    try {
      const route = isCompleted
        ? `/tasks/complete/${taskId}`
        : `/tasks/uncomplete/${taskId}`;
      await api.patch(route);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const TaskItem = ({ task, isCompleted }) => (
    <div
      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer group ${
        isCompleted
          ? "bg-green-500/10 border-green-500/20 hover:bg-green-500/15"
          : "bg-gray-750 border-gray-600 hover:bg-gray-700"
      }`}
      onClick={() => toggleTask(task._id, !isCompleted)}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
            isCompleted
              ? "bg-green-500 text-white"
              : "bg-gray-600 text-gray-400 group-hover:bg-blue-500 group-hover:text-white"
          }`}
        >
          {isCompleted ? <CheckSquare size={14} /> : <Square size={14} />}
        </div>

        <div className="flex-1">
          <div
            className={`font-medium ${
              isCompleted ? "text-green-400 line-through" : "text-white"
            }`}
          >
            {task.taskText}
          </div>

          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
            <User size={12} />
            <span>{task.taskTo?.username || "You"}</span>
            {task.createdAt && (
              <>
                <Calendar size={12} />
                <span>{formatDate(task.createdAt)}</span>
              </>
            )}
            {isCompleted && task.completedAt && (
              <span className="text-green-400">
                <CheckCircle size={12} /> Completed {formatDate(task.completedAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Assigned Tasks</h1>
          <button
            onClick={fetchTasks}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Active</h2>
              {active.length ? (
                active.map((t) => <TaskItem key={t._id} task={t} isCompleted={false} />)
              ) : (
                <div className="text-center text-gray-500 py-8">No active tasks</div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Completed</h2>
              {completed.length ? (
                completed.map((t) => <TaskItem key={t._id} task={t} isCompleted={true} />)
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No completed tasks
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
