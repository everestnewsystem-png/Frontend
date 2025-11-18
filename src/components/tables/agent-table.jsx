import { Eye, Pencil, Trash } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const AgentTable = ({ data, onDelete }) => {
  const { user } = useAuth();

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-700 bg-gray-800 animate-fade">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
          <tr>
            <th className="p-4 font-semibold">SN</th>
            <th className="p-4 font-semibold">Agent Name</th>
            <th className="p-4 font-semibold">Contact</th>
            <th className="p-4 font-semibold">Assigned</th>
            <th className="p-4 font-semibold">Type</th>
            <th className="p-4 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((agent, index) => (
            <tr
              key={agent._id}
              className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150"
            >
              <td className="p-4 text-gray-300">{index + 1}</td>
              <td className="p-4 text-white font-medium">{agent.name}</td>
              <td className="p-4 text-gray-300">{agent.contact || "-"}</td>
              <td className="p-4">
                <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                  {agent.applicantsCount || 0}
                </span>
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    agent.isSuper
                      ? "bg-purple-600/20 text-purple-400"
                      : "bg-gray-600/20 text-gray-400"
                  }`}
                >
                  {agent.isSuper ? "Super Agent" : "Regular"}
                </span>
              </td>

              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/view-agent/${agent._id}`}
                    className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-600/20 rounded-lg transition-all duration-200"
                    title="View Agent"
                  >
                    <Eye size={18} />
                  </Link>

                  <Link
                    to={`/edit-agent/${agent._id}`}
                    className="text-gray-400 hover:text-white p-2 hover:bg-gray-600/20 rounded-lg transition-all duration-200"
                    title="Edit Agent"
                  >
                    <Pencil size={18} />
                  </Link>

                  <button
                    disabled={user?.role !== "admin"}
                    onClick={() => onDelete(agent._id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      user?.role !== "admin"
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-red-400 hover:text-red-300 hover:bg-red-600/20"
                    }`}
                    title={
                      user?.role !== "admin"
                        ? "Admin only"
                        : "Delete Agent"
                    }
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentTable;
