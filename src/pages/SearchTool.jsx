import { useEffect, useState, useRef } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import ApplicantTable from "../components/tables/applicant-table";
import { Search, Printer, Globe, Users, Workflow } from "lucide-react";

const progressOptions = [
  "new",
  "init paid",
  "document sent",
  "submitted",
  "resubmitted",
  "permit received",
  "permit rejected",
  "embassy submitted",
  "mail received",
  "visa rejected",
  "Visa stampped",
  "Flight Done",
  "cancelled",
];

const SearchTool = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedProgress, setSelectedProgress] = useState("");
  const [countries, setCountries] = useState([]);
  const [agents, setAgents] = useState([]);
  const [results, setResults] = useState([]);
  const [limitedResults, setLimitedResults] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  // ✅ For "Progress Status Only" section
  const [progressOnly, setProgressOnly] = useState("");
  const [progressApplicants, setProgressApplicants] = useState([]);
  const [showAllProgress, setShowAllProgress] = useState(false);
  const progressPrintRef = useRef();

  // ✅ Fetch agents & countries
  useEffect(() => {
    const loadData = async () => {
      try {
        const [countryRes, agentRes] = await Promise.all([
          api.get("/countries"),
          api.get("/agents"),
        ]);
        setCountries(countryRes.data);
        setAgents(agentRes.data);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      }
    };
    loadData();
  }, []);

  // ✅ Combined search handler
  const runSearch = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (searchValue.trim()) queryParams.append("name", searchValue);
      if (selectedCountry) queryParams.append("country", selectedCountry);
      if (selectedAgent) queryParams.append("agent", selectedAgent);
      if (selectedProgress) queryParams.append("progress", selectedProgress);

      const res = await api.get(`/applicants/search?${queryParams.toString()}`);
      const data = res.data?.results || res.data || [];
      setResults(data);
      setLimitedResults(data.slice(0, 10));
      setShowAll(false);
    } catch (error) {
      console.error("Search error:", error);
      alert("No applicants found or invalid search.");
      setResults([]);
      setLimitedResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show all / collapse toggle
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  // ✅ Simple print function
  const handlePrint = (ref) => {
    const printContent = ref.current.innerHTML;
    const printWindow = window.open("", "", "width=1000,height=800");
    printWindow.document.write(`
      <html>
        <head><title>Applicant Results</title></head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // ✅ Fetch applicants by Progress Status only
  const fetchByProgressOnly = async () => {
    if (!progressOnly) return alert("Please select a progress status first.");
    try {
      const res = await api.get(`/applicants/search?progress=${progressOnly}`);
      const data = res.data?.results || res.data || [];
      setProgressApplicants(data);
      setShowAllProgress(false);
    } catch (error) {
      console.error("Error fetching progress applicants:", error);
      alert("Failed to fetch applicants for selected progress.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Advanced Applicant Search</h1>

        {/* 🔍 Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-gray-800 border border-gray-700 p-5 rounded-xl">
          {/* All Applicants */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-1">
              <Search size={16} className="text-blue-400" /> Search Applicants
            </label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Name, Passport, etc."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {/* By Country */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-1">
              <Globe size={16} className="text-green-400" /> Country
            </label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.countryName}
                </option>
              ))}
            </select>
          </div>

          {/* By Progress */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-1">
              <Workflow size={16} className="text-amber-400" /> Progress Status
            </label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              value={selectedProgress}
              onChange={(e) => setSelectedProgress(e.target.value)}
            >
              <option value="">All Statuses</option>
              {progressOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* By Agent */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 text-sm mb-1">
              <Users size={16} className="text-purple-400" /> Agent
            </label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              <option value="">All Agents</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🔘 Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={runSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white disabled:bg-gray-600"
          >
            {loading ? "Searching..." : "Run Search"}
          </button>
          <button
            onClick={() => {
              setSearchValue("");
              setSelectedCountry("");
              setSelectedAgent("");
              setSelectedProgress("");
              setResults([]);
              setLimitedResults([]);
            }}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white"
          >
            Reset Filters
          </button>
        </div>

        {/* Results Table */}
        {results.length > 0 ? (
          <div
            ref={printRef}
            className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-12"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Search Results</h2>
              <div className="flex gap-3">
                <button
                  onClick={toggleShowAll}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
                >
                  {showAll ? "Show Less" : "Show All"}
                </button>
                <button
                  onClick={() => handlePrint(printRef)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium flex items-center gap-2"
                >
                  <Printer size={16} /> Print
                </button>
              </div>
            </div>

            <ApplicantTable
              data={showAll ? results : limitedResults}
              onDelete={() => {}}
            />
          </div>
        ) : (
          <div className="text-center text-gray-400 py-10">
            No applicants found. Try refining your search.
          </div>
        )}

        {/* 🚀 NEW FEATURE: Search by Progress Status Only */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mt-10 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white">
            Search by Progress Status Only
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white flex-1"
              value={progressOnly}
              onChange={(e) => setProgressOnly(e.target.value)}
            >
              <option value="">Select Progress Status</option>
              {progressOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <button
              onClick={fetchByProgressOnly}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
            >
              Show Applicants
            </button>
          </div>

          {progressApplicants.length > 0 && (
            <div
              ref={progressPrintRef}
              className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Applicants with Status: {progressOnly}
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAllProgress(!showAllProgress)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
                  >
                    {showAllProgress ? "Show Less" : "Show All"}
                  </button>
                  <button
                    onClick={() => handlePrint(progressPrintRef)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium flex items-center gap-2"
                  >
                    <Printer size={16} /> Print
                  </button>
                </div>
              </div>
              <ApplicantTable
                data={
                  showAllProgress
                    ? progressApplicants
                    : progressApplicants.slice(0, 10)
                }
                onDelete={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchTool;
