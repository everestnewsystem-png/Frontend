import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft, DollarSign, CreditCard, FileText, Calendar } from "lucide-react";

const EditPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    amount: "",
    method: "",
    purpose: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm({ ...form, [k]: v });

  // ✅ FIXED DATA FETCH SECTION
  useEffect(() => {
    if (!id) return;
    api
      .get(`/payments/record/${id}`)
      .then((res) => {
        const p = res.data;
        if (!p) return;
        setForm({
          amount: p.amount || "",
          method: p.method || "",
          purpose: p.purpose || "",
          date: p.date ? p.date.substring(0, 10) : "",
        });
      })
      .catch((err) => {
        console.error("Error fetching payment data:", err);
      });
  }, [id]);

  const submit = async () => {
    if (!form.amount || !form.method || !form.purpose || !form.date) return;

    setLoading(true);
    try {
      await api.put(`/payments/${id}`, form);
      navigate(-1);
    } catch (error) {
      console.error("Error updating payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Online Payment",
    "Check",
    "Money Order",
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Edit Payment</h1>
                <p className="text-gray-400 text-sm">Update payment record details</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-green-400" />
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                <DollarSign size={16} className="text-green-400" />
                <span>
                  Amount <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter amount"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                <CreditCard size={16} className="text-blue-400" />
                <span>
                  Payment Method <span className="text-red-400">*</span>
                </span>
              </label>
               <input
          className="border w-full p-2 rounded mb-4"
          placeholder="Method (Cash / Bank / Online)"
          value={form.method}
          onChange={(e) => update("method", e.target.value)}
        />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                <FileText size={16} className="text-purple-400" />
                <span>
                  Purpose <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter payment purpose"
                value={form.purpose}
                onChange={(e) => update("purpose", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                <Calendar size={16} className="text-amber-400" />
                <span>
                  Payment Date <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="date"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </div>

            <button
              onClick={submit}
              disabled={!form.amount || !form.method || !form.purpose || !form.date || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={20} />
              )}
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPayment;
