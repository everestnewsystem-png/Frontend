import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/loading";
import { CreditCard, User, Edit, Trash2, ArrowLeft, DollarSign, Calendar, FileText } from "lucide-react";

const ViewPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/applicants/${id}`),
      api.get(`/payments/applicant/${id}`)
    ]).then(([applicantRes, paymentsRes]) => {
      setApplicant(applicantRes.data);
      setPayments(paymentsRes.data);
      setLoading(false);
    });
  }, [id]);

  const deletePayment = async (pid) => {
    if (!confirm("Are you sure you want to delete this payment record?")) return;
    try {
      await api.delete(`/payments/${pid}`);
      const res = await api.get(`/payments/applicant/${id}`);
      setPayments(res.data);
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMethodColor = (method) => {
    const colors = {
      'cash': 'bg-green-500/20 text-green-400',
      'card': 'bg-blue-500/20 text-blue-400',
      'bank transfer': 'bg-purple-500/20 text-purple-400',
      'online': 'bg-cyan-500/20 text-cyan-400'
    };
    return colors[method?.toLowerCase()] || 'bg-gray-500/20 text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <TopStrip />
        <SecondStrip />
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                  <CreditCard size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Payment History
                  </h1>
                  <p className="text-gray-400">
                    for {applicant?.fullName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                <span className="text-green-400 font-bold text-lg">
                  ${payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0).toFixed(2)}
                </span>
                <span className="text-gray-400 text-sm ml-2">Total Paid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Payment Records</h2>
                <p className="text-gray-400 text-sm">
                  {payments.length} payment record(s) found
                </p>
              </div>
            </div>
            <div className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              <span className="text-blue-400 font-semibold">{payments.length}</span>
            </div>
          </div>

          {payments.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="p-4 font-semibold">SN</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Purpose</th>
                    <th className="p-4 font-semibold">Method</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={payment._id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150">
                      <td className="p-4 text-gray-300 font-medium">{index + 1}</td>
                      <td className="p-4">
                        <span className="text-gray-300 flex items-center space-x-1">
                          <Calendar size={12} />
                          <span>{formatDate(payment.date)}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-white">{payment.purpose}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getMethodColor(payment.method)}`}>
                          {payment.method}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-green-400 font-bold flex items-center space-x-1">
                          <DollarSign size={14} />
                          <span>{payment.amount}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/edit-payment/${payment._id}`)}
                            className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-600/20 rounded-lg transition-all duration-200"
                            title="Edit Payment"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deletePayment(payment._id)}
                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-600/20 rounded-lg transition-all duration-200"
                            title="Delete Payment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={24} className="text-gray-400" />
              </div>
              <h3 className="text-gray-400 font-semibold text-lg mb-2">
                No Payment Records
              </h3>
              <p className="text-gray-500">
                No payment records found for this applicant
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        {payments.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {payments.length}
              </div>
              <div className="text-gray-400 font-medium">Total Payments</div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">
                ${payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0).toFixed(2)}
              </div>
              <div className="text-gray-400 font-medium">Total Amount</div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/20 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {new Set(payments.map(p => p.method)).size}
              </div>
              <div className="text-gray-400 font-medium">Payment Methods</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPayment;