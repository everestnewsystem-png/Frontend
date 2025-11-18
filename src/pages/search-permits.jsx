import { useEffect, useState, useRef } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import ApplicantTable from "../components/tables/applicant-table";
import { Printer, RefreshCw, Clock, AlertTriangle, CheckSquare } from "lucide-react";

const SearchPermits = () => {
  const [submittedApplicants, setSubmittedApplicants] = useState([]);
  const [missingDates, setMissingDates] = useState([]);
  const [releasingSoon, setReleasingSoon] = useState([]);
  const [remainingDispatch, setRemainingDispatch] = useState([]);
  const [delayedPermits, setDelayedPermits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Print Refs for each table
  const printRefs = {
    submitted: useRef(),
    missing: useRef(),
    releasing: useRef(),
    remaining: useRef(),
    delayed: useRef(),
  };

  const handlePrint = (ref) => {
    const content = ref.current.innerHTML;
    const printWindow = window.open("", "", "width=1000,height=800");
    printWindow.document.write(`
      <html>
        <head><title>Permit Report</title></head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const calculateDaysDiff = (dateString) => {
    if (!dateString) return null;
    const diff = (new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24);
    return Math.floor(diff);
  };

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applicants?all=true");
      const data = res.data?.results || res.data || [];
      const submitted = data.filter(
        (a) =>
          a.progressStatus === "submitted" ||
          a.progressStatus === "resubmitted"
      );

      // Categories
      const withDates = [];
      const noDates = [];
      const soon = [];
      const remaining = [];
      const delayed = [];

      for (const a of submitted) {
        const submittedDate = a.submittedDate || a.submitted_date;
        const physicalDate = a.physicalDate || a.physical_date;
        const diff = calculateDaysDiff(physicalDate);

        if (!submittedDate && !physicalDate) {
          noDates.push(a);
        } else {
          withDates.push(a);

          if (diff >= 15 && diff <= 30) soon.push(a);
          else if (diff >= 31 && diff <= 60) remaining.push(a);
          else if (diff > 60) delayed.push(a);
        }
      }

      setSubmittedApplicants(withDates);
      setMissingDates(noDates);
      setReleasingSoon(soon);
      setRemainingDispatch(remaining);
      setDelayedPermits(delayed);
    } catch (err) {
      console.error("Error loading permits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const TableSection = ({ title, icon, color, data, refProp }) => {
    const [showAll, setShowAll] = useState(false);
    const visibleData = showAll ? data : data.slice(0, 10);

    return (
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 ${color}/20 rounded-xl flex items-center justify-center`}
            >
              {icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className={`${color} font-semibold`}>
                {data.length} applicant(s)
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold text-sm"
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
            <button
              onClick={() => handlePrint(refProp)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2"
            >
              <Printer size={16} /> Print
            </button>
          </div>
        </div>

        {data.length > 0 ? (
          <div ref={refProp}>
            <ApplicantTable data={visibleData} onDelete={() => {}} />
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">No applicants found.</div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Permit Tracking & Status Overview
            </h1>
            <p className="text-gray-400">
              Analyze submitted and delayed permit applications
            </p>
          </div>
          <button
            onClick={fetchApplicants}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center">Loading data...</p>
        ) : (
          <>
            {/* 1️⃣ All Applicants with Result Submitted */}
            <TableSection
              title="All Applicants with Result Submitted"
              icon={<CheckSquare className="text-blue-400" size={22} />}
              color="text-blue-400"
              data={submittedApplicants}
              refProp={printRefs.submitted}
            />

            {/* 2️⃣ Applicants Missing Dates */}
            <TableSection
              title="Applicants Missing Submitted or Physical Date"
              icon={<AlertTriangle className="text-red-400" size={22} />}
              color="text-red-400"
              data={missingDates}
              refProp={printRefs.missing}
            />

            {/* 3️⃣ Permit Releasing Soon */}
            <TableSection
              title="Permit Releasing Soon (15 - 30 days)"
              icon={<Clock className="text-amber-400" size={22} />}
              color="text-amber-400"
              data={releasingSoon}
              refProp={printRefs.releasing}
            />

            {/* 4️⃣ Permit Remaining to Dispatch */}
            <TableSection
              title="Permit Remaining to Dispatch (31 - 60 days)"
              icon={<Clock className="text-yellow-400" size={22} />}
              color="text-yellow-400"
              data={remainingDispatch}
              refProp={printRefs.remaining}
            />

            {/* 5️⃣ Permit Delays */}
            <TableSection
              title="Permit Delays (More than 60 days)"
              icon={<AlertTriangle className="text-red-400" size={22} />}
              color="text-red-400"
              data={delayedPermits}
              refProp={printRefs.delayed}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPermits;
