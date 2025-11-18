import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import ApplicantTable from "../components/tables/applicant-table";
import Loading from "../components/loading";
import { Search, AlertTriangle, RefreshCw, Clock, UserSearch } from "lucide-react";

const Police = () => {
  const [expired, setExpired] = useState([]);
  const [reapply, setReapply] = useState([]);
  const [nopcc, setNopcc] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searched, setSearched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  // ✅ Fetch expired/reapply PCC data
  const fetchPoliceData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/police/check");
      setExpired(res.data.expiredPccs || []);
      setReapply(res.data.needReApply || []);
      setNopcc(res.data.nopcc || []);
    } catch (err) {
      console.error("Error loading police data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: proper search with ?name= query param
  const runSearch = async () => {
    if (!searchValue.trim()) return;

    setSearchLoading(true);
    try {
      const query = encodeURIComponent(searchValue.trim());
      const res = await api.get(`/applicants/search?name=${query}`);
      setSearched(res.data || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearched([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    setSearched([]);
  };

  useEffect(() => {
    fetchPoliceData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Police Clearance Certificate
            </h1>
            <p className="text-gray-400">
              Monitor PCC expiration and re-application status
            </p>
          </div>

          <button
            onClick={fetchPoliceData}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <RefreshCw size={18} />
            <span>Refresh Data</span>
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="space-y-8">
            {/* Expired PCCs */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-red-500/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Expired PCCs</h2>
                  <p className="text-red-400 font-semibold">
                    {expired.length} certificate(s) have expired
                  </p>
                </div>
                <div className="ml-auto bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/30">
                  <span className="text-red-400 font-bold text-lg">
                    {expired.length}
                  </span>
                </div>
              </div>

              {expired.length > 0 ? (
                <ApplicantTable data={expired} onDelete={() => {}} />
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={24} className="text-green-400" />
                  </div>
                  <h3 className="text-green-400 font-semibold text-lg mb-2">
                    No Expired PCCs
                  </h3>
                  <p className="text-gray-400">
                    All police clearance certificates are currently valid
                  </p>
                </div>
              )}
            </div>

            {/* Reapply PCCs */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-amber-500/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Clock size={24} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Need Re-application
                  </h2>
                  <p className="text-amber-400 font-semibold">
                    {reapply.length} certificate(s) crossed 90 days validity
                  </p>
                </div>
                <div className="ml-auto bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/30">
                  <span className="text-amber-400 font-bold text-lg">
                    {reapply.length}
                  </span>
                </div>
              </div>

              {reapply.length > 0 ? (
                <ApplicantTable data={reapply} onDelete={() => {}} />
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock size={24} className="text-green-400" />
                  </div>
                  <h3 className="text-green-400 font-semibold text-lg mb-2">
                    No Re-application Needed
                  </h3>
                  <p className="text-gray-400">
                    All PCCs are within their validity period
                  </p>
                </div>
              )}
            </div>
            {/* No PCCs */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-amber-500/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Clock size={24} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Need PCC - Applicants without PCC
                  </h2>
                  <p className="text-amber-400 font-semibold">
                    {nopcc.length} certificate(s) no pcc dates
                  </p>
                </div>
                <div className="ml-auto bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/30">
                  <span className="text-amber-400 font-bold text-lg">
                    {nopcc.length}
                  </span>
                </div>
              </div>

              {nopcc.length > 0 ? (
                <ApplicantTable data={nopcc} onDelete={() => {}} />
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock size={24} className="text-green-400" />
                  </div>
                  <h3 className="text-green-400 font-semibold text-lg mb-2">
                    Not Found
                  </h3>
                  <p className="text-gray-400">
                    All PCCs are within their validity period
                  </p>
                </div>
              )}
            </div>

            {/* Search Section */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-blue-500/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <UserSearch size={24} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Search Applicants</h2>
                  <p className="text-blue-400 font-semibold">
                    Find applicants by name for PCC verification
                  </p>
                </div>
              </div>

              {/* Search Input */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Type applicant name to search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && runSearch()}
                  />
                </div>
                <button
                  onClick={runSearch}
                  disabled={!searchValue.trim() || searchLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  {searchLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search size={18} />
                  )}
                  <span>Search</span>
                </button>
                {searched.length > 0 && (
                  <button
                    onClick={clearSearch}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Search Results */}
              {searchLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="text-gray-400 text-sm">Searching applicants...</div>
                  </div>
                </div>
              ) : searched.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Search Results ({searched.length})
                    </h3>
                    <span className="text-green-400 text-sm font-medium">
                      Found {searched.length} applicant(s)
                    </span>
                  </div>
                  <ApplicantTable data={searched} onDelete={() => {}} />
                </div>
              ) : searchValue && !searchLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserSearch size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-400 font-semibold text-lg mb-2">
                    No Applicants Found
                  </h3>
                  <p className="text-gray-500">
                    No applicants found matching "{searchValue}"
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserSearch size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-gray-400 font-semibold text-lg mb-2">
                    Ready to Search
                  </h3>
                  <p className="text-gray-500">
                    Enter an applicant name above to search the database
                  </p>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {expired.length + reapply.length}
                </div>
                <div className="text-gray-400 font-medium">Total Alerts</div>
                <div className="text-sm text-gray-500 mt-2">
                  PCCs needing attention
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-red-500/20 text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {expired.length}
                </div>
                <div className="text-gray-400 font-medium">Expired</div>
                <div className="text-sm text-gray-500 mt-2">
                  Immediate action required
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-amber-500/20 text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">
                  {reapply.length}
                </div>
                <div className="text-gray-400 font-medium">Re-apply</div>
                <div className="text-sm text-gray-500 mt-2">
                  Crossed 90 days validity
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Police;
