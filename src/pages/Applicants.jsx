import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import ApplicantTable from "../components/tables/applicant-table";
import Loading from "../components/loading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, UserPlus, RefreshCw } from "lucide-react";

const Applicants = () => {
  const { user } = useAuth();
  const role = user?.role;

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState([]);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const res = await api.get("/applicants");

      const extractArray = (obj) => {
        if (!obj) return [];

        if (Array.isArray(obj)) return obj;

        if (Array.isArray(obj.data)) return obj.data;
        if (Array.isArray(obj.applicants)) return obj.applicants;
        if (Array.isArray(obj.items)) return obj.items;
        if (Array.isArray(obj.list)) return obj.list;

        for (let key in obj) {
          if (Array.isArray(obj[key])) return obj[key];
          if (typeof obj[key] === "object") {
            const nested = extractArray(obj[key]);
            if (nested.length) return nested;
          }
        }

        return [];
      };

      const arr = extractArray(res.data);

      setData(arr);
      setVisible(arr.slice(0, 10));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleDelete = async (id) => {
    if (role !== "admin") return;
    if (!confirm("Delete this applicant?")) return;

    await api.delete(`/applicants/${id}`);
    fetchApplicants();
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setVisible(data.slice(0, 10));
      setShowAll(false);
      return;
    }

    setSearchLoading(true);
    setTimeout(() => {
      const filtered = data.filter((a) =>
        a.fullName?.toLowerCase().includes(search.toLowerCase())
      );
      setVisible(filtered);
      setShowAll(true);
      setSearchLoading(false);
    }, 500);
  };

  const showAllRows = () => {
    setVisible(data);
    setShowAll(true);
  };

  const resetView = () => {
    setVisible(data.slice(0, 10));
    setShowAll(false);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Applicants</h1>
            <p className="text-gray-400">Manage and track all applicant records</p>
          </div>
          
          <button
            onClick={() => navigate("/add-applicant")}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <UserPlus size={20} />
            <span>Add Applicant</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Search applicants by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={searchLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                {searchLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search size={18} />
                )}
                <span>Search</span>
              </button>
              <button
                onClick={resetView}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-gray-600 flex items-center space-x-2"
              >
                <RefreshCw size={18} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-300">
                Showing {visible.length} of {data.length} applicants
                {search && (
                  <span className="text-blue-400 ml-2">
                    • Search: "{search}"
                  </span>
                )}
              </div>
              
              {!showAll && data.length > 10 && !search && (
                <button
                  onClick={showAllRows}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 border border-gray-600"
                >
                  Show All ({data.length})
                </button>
              )}
            </div>

            <ApplicantTable data={visible} onDelete={handleDelete} />

            {visible.length === 0 && !loading && (
              <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-gray-400 font-semibold text-lg mb-2">
                  No Applicants Found
                </h3>
                <p className="text-gray-500">
                  {search ? `No applicants found matching "${search}"` : "No applicants in the system"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Applicants;