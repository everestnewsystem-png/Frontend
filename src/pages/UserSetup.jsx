import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading";
import { Users, Edit, Trash2, User, UserPlus } from "lucide-react";

const UserSetup = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users"); // ✔ auto-prefixes /api
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/${id}`); // ✔ auto-prefixes /api
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-red-500/20 text-red-400",
      editor: "bg-yellow-500/20 text-yellow-400",
      viewer: "bg-blue-500/20 text-blue-400",
    };
    return colors[role] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Manage system users & permissions</p>
          </div>

          <button
            onClick={() => navigate("/add-user")}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <UserPlus size={20} />
            <span>Add User</span>
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">System Users</h2>
                  <p className="text-gray-400 text-sm">{users.length} user(s)</p>
                </div>
              </div>

              <div className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                <span className="text-blue-400 font-semibold">{users.length}</span>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="p-4 font-semibold">SN</th>
                    <th className="p-4 font-semibold">Username</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((usr, index) => (
                    <tr
                      key={usr._id}
                      className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150"
                    >
                      <td className="p-4 text-gray-300 font-medium">{index + 1}</td>

                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                            <User size={16} className="text-white" />
                          </div>
                          <span className="text-white font-medium">{usr.username}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(
                            usr.role
                          )}`}
                        >
                          {usr.role}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/edit-user/${usr._id}`)}
                            className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-600/20 rounded-lg transition-all duration-200"
                            title="Edit User"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            onClick={() => deleteUser(usr._id)}
                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-600/20 rounded-lg transition-all duration-200"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={24} className="text-gray-400" />
                </div>
                <h3 className="text-gray-400 font-semibold text-lg mb-2">No Users Found</h3>
                <p className="text-gray-500 mb-6">Create the first user to begin</p>

                <button
                  onClick={() => navigate("/add-user")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                >
                  <UserPlus size={18} />
                  <span>Add First User</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSetup;
