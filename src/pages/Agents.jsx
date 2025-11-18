import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import AgentTable from "../components/tables/agent-table";
import Loading from "../components/loading";
import { useNavigate } from "react-router-dom";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchAgents = async () => {
    setLoading(true);
    const res = await api.get("/agents");

    const mapped = res.data.map((ag) => ({
      ...ag,
      applicantsCount: ag.assignedCount || ag.applicantsCount || 0,
    }));

    setAgents(mapped);
    setFiltered(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this agent?")) return;
    await api.delete(`/agents/${id}`);
    fetchAgents();
  };

  const handleSearch = () => {
    const val = search.toLowerCase();
    setFiltered(agents.filter((ag) => ag.name.toLowerCase().includes(val)));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/add-agent")}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            + Add New Agent
          </button>

          <div className="flex gap-2 w-full sm:w-auto">
            <input
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg border border-gray-600 transition-all duration-200"
            >
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <AgentTable data={filtered} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default Agents;