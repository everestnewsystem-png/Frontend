import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { useParams, useNavigate } from "react-router-dom";

const EditAgent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [isSuper, setIsSuper] = useState(false);

  useEffect(() => {
    api.get(`/agents/${id}`).then((res) => {
      setName(res.data.agent.name);
      setContact(res.data.agent.contact);
      setIsSuper(res.data.agent.isSuper);
    });
  }, [id]);

  const submit = async () => {
    await api.put(`/agents/${id}`, { name, contact, isSuper });
    navigate("/agents");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Edit Agent</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Agent Name
              </label>
              <input
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Contact Information
              </label>
              <input
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
              <input
                type="checkbox"
                checked={isSuper}
                onChange={(e) => setIsSuper(e.target.checked)}
                className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-500 rounded focus:ring-blue-400"
              />
              <span className="text-white font-medium">Super Agent</span>
            </div>

            <button
              onClick={submit}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAgent;