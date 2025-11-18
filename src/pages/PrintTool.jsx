import { useEffect, useState, useRef } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { Printer, Search } from "lucide-react";

const PrintTool = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [prevMonthAppointments, setPrevMonthAppointments] = useState([]);
  const [thisMonthAppointments, setThisMonthAppointments] = useState([]);
  const [nextMonthAppointments, setNextMonthAppointments] = useState([]);
  const [noDateAppointments, setNoDateAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const printRefs = {
    all: useRef(),
    prev: useRef(),
    current: useRef(),
    next: useRef(),
    nodate: useRef(),
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/applicants?all=true");
        const applicants = res.data?.results || res.data || [];

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const filteredAll = applicants.filter(
          (a) => a.progressStatus?.toLowerCase() === "appointment confirmed"
        );

        const withDate = applicants.filter((a) => a.appointmentDate);
        const noDate = applicants.filter(
          (a) =>
            a.progressStatus?.toLowerCase() === "appointment confirmed" &&
            !a.appointmentDate
        );

        const prevMonth = withDate.filter((a) => {
          const d = new Date(a.appointmentDate);
          return (
            d.getMonth() === currentMonth - 1 &&
            d.getFullYear() === currentYear
          );
        });

        const currentMonthData = withDate.filter((a) => {
          const d = new Date(a.appointmentDate);
          return (
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
          );
        });

        const nextMonth = withDate.filter((a) => {
          const d = new Date(a.appointmentDate);
          return (
            d.getMonth() === currentMonth + 1 &&
            d.getFullYear() === currentYear
          );
        });

        setAllAppointments(filteredAll);
        setPrevMonthAppointments(prevMonth);
        setThisMonthAppointments(currentMonthData);
        setNextMonthAppointments(nextMonth);
        setNoDateAppointments(noDate);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const printSection = (ref) => {
    const printContent = ref.current.innerHTML;
    const printWindow = window.open("", "", "width=1000,height=800");
    printWindow.document.write(`
      <html>
        <head><title>Appointments Print</title></head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US") : "-";

  const filterBySearch = (list) => {
    if (!search.trim()) return list;
    const regex = new RegExp(search, "i");
    return list.filter((a) => regex.test(a.fullName || ""));
  };

  const renderTable = (data, title, ref) => {
    const filtered = filterBySearch(data);
    return (
      <div
        ref={ref}
        className="bg-gray-800 text-white border border-gray-700 rounded-xl p-4 mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex gap-3">
            <button
              onClick={() => printSection(ref)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white flex items-center gap-2"
            >
              <Printer size={16} /> Print
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-gray-900 border border-gray-700 rounded-lg">
            <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
              <tr>
                <th className="p-2">SN</th>
                <th className="p-2">Full Name</th>
                <th className="p-2">Agent</th>
                <th className="p-2">Country</th>
                <th className="p-2">Progress</th>
                <th className="p-2">Appointment Date</th>
                <th className="p-2">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr
                  key={a._id}
                  className="border-b border-gray-700 hover:bg-gray-800"
                >
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2">{a.fullName}</td>
                  <td className="p-2">{a.agent?.name || "-"}</td>
                  <td className="p-2">{a.country?.countryName || "-"}</td>
                  <td className="p-2">{a.progressStatus || "-"}</td>
                  <td className="p-2">{formatDate(a.appointmentDate)}</td>
                  <td className="p-2">{a.contactMain || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-4">No records found.</p>
          )}
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="text-center text-gray-400 py-10">
        Loading appointment data...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Appointments Overview</h1>
          <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              className="bg-transparent outline-none text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {renderTable(allAppointments, "All Appointments (Status: Confirmed)", printRefs.all)}
        {renderTable(
          prevMonthAppointments,
          "Appointments - Previous Month",
          printRefs.prev
        )}
        {renderTable(
          thisMonthAppointments,
          "Appointments - This Month",
          printRefs.current
        )}
        {renderTable(
          nextMonthAppointments,
          "Appointments - Next Month",
          printRefs.next
        )}
        {renderTable(
          noDateAppointments,
          "Applicants with No Appointment Date (Confirmed)",
          printRefs.nodate
        )}
      </div>
    </div>
  );
};

export default PrintTool;
