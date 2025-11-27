import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { Search } from "lucide-react";

const progressOptions = [
  "new",
  "init paid",
  "document sent",
  "submitted",
  "resubmitted",
  "permit received",
  "permit rejected",
  "embassy submitted",
  "appointment confirmed",
  "interview faced",
  "mail received",
  "visa rejected",
  "Visa stampped",
  "Flight Done",
  "cancelled",
];

const ProgressChangeTool = () => {
  const [applicants, setApplicants] = useState([]);
  const [selected, setSelected] = useState([]);
  const [newStatus, setNewStatus] = useState("new");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searching, setSearching] = useState(false);

  // 🆕 status filter for table header
  const [statusFilter, setStatusFilter] = useState("all");

  // 🔹 original: fetch FIRST 10 (because backend paginates by 10)
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

  // 🆕 new: fetch ALL applicants (backend already supports ?all=true)
  const fetchAllApplicants = async () => {
    setFetching(true);
    try {
      const res = await api.get("/applicants?all=true");
      const data = res.data?.results || res.data || [];
      setApplicants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching ALL applicants:", error);
      setApplicants([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchApplicants(); // first load → only 10
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const runChange = async () => {
    if (selected.length === 0) return alert("Select applicants first!");
    setLoading(true);
    try {
      await api.put("/tools/progress-change", {
        ids: selected,
        progressStatus: newStatus,
      });
      alert("Progress updated successfully");
      fetchApplicants();
      setSelected([]);
    } catch (error) {
      console.error("Error updating progress:", error);
      alert("Error updating progress");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search applicants by name
  const runSearch = async () => {
    // 🆕 if no value → fetch ALL applicants and show them
    if (!searchValue.trim()) {
      await fetchAllApplicants();
      return;
    }

    setSearching(true);
    try {
      const res = await api.get(`/applicants/search?name=${searchValue}`);
      const data = res.data?.results || res.data || [];
      setApplicants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
      alert("No applicants found");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    setStatusFilter("all");      // reset filter too
    fetchApplicants();           // back to first 10
  };

  // 🆕 filter by status (client side)
  const filteredApplicants =
    statusFilter === "all"
      ? applicants
      : applicants.filter(
          (a) =>
            (a.progressStatus || "").toLowerCase() ===
            statusFilter.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Progress Change Tool</h1>

        {/* 🔍 Search Section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <div className="relative flex-1 w-full">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search applicant by name..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && runSearch()}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={runSearch}
              disabled={searching}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white disabled:bg-gray-600"
            >
              {searching ? "Searching..." : "Search"}
            </button>
            {(searchValue || statusFilter !== "all") && (
              <button
                onClick={clearSearch}
                className="px-5 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center gap-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div>
            <label className="block text-gray-300 mb-1">New Status:</label>
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {progressOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={runChange}
            disabled={loading || selected.length === 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading
              ? "Updating..."
              : `Update ${selected.length || ""} Selected`}
          </button>
        </div>

        {/* 🆕 Show All button (table-level) */}
        {!fetching && (
          <div className="flex justify-end mb-2">
            <button
              onClick={fetchAllApplicants}
              className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-xs font-medium text-white"
            >
              Show All
            </button>
          </div>
        )}

        {/* Applicants Table */}
        {fetching ? (
          <div className="text-center text-gray-400 py-10">
            Loading applicants...
          </div>
        ) : Array.isArray(filteredApplicants) && filteredApplicants.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="p-3">Select</th>
                  <th className="p-3 text-left">Name</th>

                  {/* 🆕 Progress header with status filter */}
                  <th className="p-3 text-left">
                    <div className="flex flex-col gap-1">
                      <span>Progress</span>
                      <select
                        className="bg-gray-800 border border-gray-600 rounded-md px-2 py-1 text-[11px] text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All</option>
                        {progressOptions.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </th>

                  <th className="p-3 text-left">Agent</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((a) => (
                  <tr
                    key={a._id}
                    className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(a._id)}
                        onChange={() => toggleSelect(a._id)}
                        className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-500 rounded focus:ring-blue-400"
                      />
                    </td>
                    <td className="p-3 font-medium">{a.fullName || "-"}</td>
                    <td className="p-3 text-gray-300">
                      {a.progressStatus || "N/A"}
                    </td>
                    <td className="p-3 text-gray-400">
                      {a.agent?.name || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            No applicants found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressChangeTool;
