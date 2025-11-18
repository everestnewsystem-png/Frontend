import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { Calendar, CheckSquare, Users, Search, FileSearch } from "lucide-react";

const AppointmentSetTool = () => {
  const [applicants, setApplicants] = useState([]);
  const [selected, setSelected] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("name"); // name | file
  const [searching, setSearching] = useState(false);

  // ✅ Fetch all applicants initially
  useEffect(() => {
    const fetchApplicants = async () => {
      setFetching(true);
      try {
        const res = await api.get("/applicants");
        const data = res.data?.results || res.data || [];
        setApplicants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setApplicants([]);
      } finally {
        setFetching(false);
      }
    };
    fetchApplicants();
  }, []);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === applicants.length) {
      setSelected([]);
    } else {
      setSelected(applicants.map((a) => a._id));
    }
  };

  const run = async () => {
    if (!date) return alert("Select a date");
    if (selected.length === 0) return alert("Select applicants");

    setLoading(true);
    try {
      await api.put("/tools/appointment-set", {
        ids: selected,
        appointmentDate: date,
      });

      alert("Updated successfully");
      setSelected([]);
      setDate("");
    } catch (error) {
      console.error("Error setting appointments:", error);
      alert("Error setting appointments");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ Search logic (by name or file number)
  const runSearch = async () => {
    if (!searchValue.trim()) return alert("Enter a value to search");

    setSearching(true);
    try {
      const queryParam =
        searchType === "file"
          ? `fileNo=${encodeURIComponent(searchValue)}`
          : `name=${encodeURIComponent(searchValue)}`;

      const res = await api.get(`/applicants/search?${queryParam}`);
      const data = res.data?.results || res.data || [];
      setApplicants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
      alert("Error while searching applicants");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = async () => {
    setSearchValue("");
    setSearching(true);
    try {
      const res = await api.get("/applicants");
      const data = res.data?.results || res.data || [];
      setApplicants(Array.isArray(data) ? data : []);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Calendar size={24} className="text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Appointment Set Tool
                </h1>
                <p className="text-gray-400">
                  Bulk update appointment dates for multiple applicants
                </p>
              </div>
            </div>
            <div className="bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
              <span className="text-blue-400 font-semibold">
                {selected.length} selected
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="name">By Name</option>
                <option value="file">By File No</option>
              </select>

              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder={
                    searchType === "file"
                      ? "Enter file number..."
                      : "Enter applicant name..."
                  }
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                />
              </div>

              <button
                onClick={runSearch}
                disabled={searching}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                {searching ? "Searching..." : "Search"}
              </button>

              {searchValue && (
                <button
                  onClick={clearSearch}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Appointment Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={run}
                disabled={!date || selected.length === 0 || loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CheckSquare size={18} />
                )}
                <span>
                  {loading
                    ? "Updating..."
                    : `Update ${selected.length} Applicants`}
                </span>
              </button>
            </div>
          </div>

          {/* Selection Info */}
          {selected.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-blue-400" />
                  <span className="text-blue-400 font-medium">
                    {selected.length} applicant(s) selected for appointment on{" "}
                    {formatDate(date)}
                  </span>
                </div>
                <button
                  onClick={() => setSelected([])}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Applicants Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Applicants List</h2>
            <button
              onClick={toggleAll}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-2"
            >
              <CheckSquare size={16} />
              <span>
                {selected.length === applicants.length
                  ? "Deselect All"
                  : "Select All"}
              </span>
            </button>
          </div>

          {/* SAFE rendering */}
          {fetching ? (
            <div className="text-center text-gray-400 py-8">
              Loading applicants...
            </div>
          ) : Array.isArray(applicants) && applicants.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="p-4 font-semibold text-center">Select</th>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">File No</th>
                    <th className="p-4 font-semibold">Agent</th>
                    <th className="p-4 font-semibold">Appointment</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {applicants.map((a) => (
                    <tr
                      key={a._id}
                      className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150"
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(a._id)}
                          onChange={() => toggle(a._id)}
                          className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-500 rounded focus:ring-blue-400"
                        />
                      </td>
                      <td className="p-4 text-white font-medium">
                        {a.fullName || "-"}
                      </td>
                      <td className="p-4 text-gray-300">
                        {a.fileNo || a.fileNumber || "-"}
                      </td>
                      <td className="p-4 text-gray-300">
                        {a.agent?.name || "-"}
                      </td>
                      <td className="p-4 text-gray-300">
                        {formatDate(a.appointmentDate)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selected.includes(a._id)
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-600/20 text-gray-400"
                          }`}
                        >
                          {selected.includes(a._id)
                            ? "Selected"
                            : "Not Selected"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-gray-400" />
              </div>
              <h3 className="text-gray-400 font-semibold text-lg mb-2">
                No Applicants Found
              </h3>
              <p className="text-gray-500">
                No applicant records available for appointment setting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentSetTool;
