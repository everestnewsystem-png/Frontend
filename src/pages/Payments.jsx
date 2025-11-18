import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import Loading from "../components/loading";
import { useNavigate } from "react-router-dom";
import { CreditCard, Plus, Search, Eye, Calendar, RefreshCw } from "lucide-react";

const Payments = () => {
  const [recent, setRecent] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searched, setSearched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRecent = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payments/recent");
      setRecent(res.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const runSearch = async () => {
    if (!searchValue.trim()) {
      setSearched([]);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await api.get(`/payments/search?name=${searchValue}`);
      setSearched(res.data);
    } catch (error) {
      console.error("Error searching payments:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    setSearched([]);
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const PaymentRow = ({ payment, index }) => (
    <tr className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150">
      <td className="p-4 text-gray-300 font-medium">{index + 1}</td>

      <td className="p-4 text-white font-medium">
        {payment.applicantId?.fullName || "N/A"}
      </td>

      <td className="p-4 text-green-400 font-bold">${payment.amount}</td>

      <td className="p-4 text-gray-300 capitalize">{payment.method}</td>

      <td className="p-4 text-gray-300">{payment.purpose}</td>

      <td className="p-4 text-gray-300 flex items-center gap-1">
        <Calendar size={12} /> {formatDate(payment.date)}
      </td>

      <td className="p-4">
        <button
          onClick={() =>
            navigate(`/view-payment/${payment.applicantId?._id}`)
          }
          className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-600/20 rounded-lg transition-all duration-200"
          title="View Payments"
        >
          <Eye size={16} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Payment Management</h1>

          <button
            onClick={() => navigate("/add-payment")}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Payment</span>
          </button>
        </div>

        {/* SEARCH SECTION */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Search size={20} className="text-blue-400" />
            Search Payments
          </h2>

          <div className="flex gap-3">
            <input
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400"
              placeholder="Search by applicant name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && runSearch()}
            />

            <button
              onClick={runSearch}
              disabled={searchLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>

            {searched.length > 0 && (
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg"
              >
                <RefreshCw size={18} />
              </button>
            )}
          </div>
        </div>

        {/* SEARCH RESULTS */}
        {searched.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6">
            <h2 className="text-xl text-white font-semibold mb-4">Search Results</h2>

            <table className="w-full text-sm text-left">
              <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="p-4 font-semibold">SN</th>
                  <th className="p-4 font-semibold">Applicant</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Method</th>
                  <th className="p-4 font-semibold">Purpose</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {searched.map((payment, index) => (
                  <PaymentRow key={payment._id} payment={payment} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* RECENT PAYMENTS */}
        <div className="bg-gray-800 p-6 rounded-xl shadow border border-gray-700">
          <h2 className="text-xl text-white font-semibold mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-green-400" />
            Recent Payments
          </h2>

          {loading ? (
            <Loading />
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="p-4 font-semibold">SN</th>
                  <th className="p-4 font-semibold">Applicant</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Method</th>
                  <th className="p-4 font-semibold">Purpose</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((payment, index) => (
                  <PaymentRow key={payment._id} payment={payment} index={index} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
