import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import Loading from "../components/loading";
import { AlertTriangle, Clock, Calendar } from "lucide-react";

const Passport = () => {
  const [expired, setExpired] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPassportData = async () => {
    setLoading(true);
    const res = await api.get("/passport/check");
    setExpired(res.data.expiredPassports);
    setExpiringSoon(res.data.expiringSoon);
    setLoading(false);
  };

  useEffect(() => {
    fetchPassportData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Passport Status Monitor
            </h1>
            <p className="text-gray-400">
              Track passport expiration status for all applicants
            </p>
          </div>
          
          <button
            onClick={fetchPassportData}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Refresh Data
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="space-y-8">
            {/* Expired Passports Section */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-red-500/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Expired Passports
                  </h2>
                  <p className="text-red-400 font-semibold">
                    {expired.length} passport(s) have expired
                  </p>
                </div>
                <div className="ml-auto bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/30">
                  <span className="text-red-400 font-bold text-lg">
                    {expired.length}
                  </span>
                </div>
              </div>

              {expired.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-700">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                      <tr>
                        <th className="p-4 font-semibold">SN</th>
                        <th className="p-4 font-semibold">Applicant Name</th>
                        <th className="p-4 font-semibold">Passport Number</th>
                        <th className="p-4 font-semibold">Expiry Date</th>
                        <th className="p-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expired.map((applicant, index) => (
                        <tr
                          key={applicant._id}
                          className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150"
                        >
                          <td className="p-4 text-gray-300 font-medium">
                            {index + 1}
                          </td>
                          <td className="p-4">
                            <span className="text-white font-semibold">
                              {applicant.fullName}
                            </span>
                            {applicant.agent?.name && (
                              <div className="text-gray-400 text-xs mt-1">
                                Agent: {applicant.agent.name}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="text-gray-300 font-mono">
                              {applicant.passportNo}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-red-400 font-medium">
                              {formatDate(applicant.passportExpiry)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium">
                              EXPIRED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-green-400" />
                  </div>
                  <h3 className="text-green-400 font-semibold text-lg mb-2">
                    No Expired Passports
                  </h3>
                  <p className="text-gray-400">
                    All passports are currently valid
                  </p>
                </div>
              )}
            </div>

            {/* Expiring Soon Section */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-amber-500/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Clock size={24} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Expiring Soon
                  </h2>
                  <p className="text-amber-400 font-semibold">
                    {expiringSoon.length} passport(s) expiring within 360 days
                  </p>
                </div>
                <div className="ml-auto bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/30">
                  <span className="text-amber-400 font-bold text-lg">
                    {expiringSoon.length}
                  </span>
                </div>
              </div>

              {expiringSoon.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-700">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                      <tr>
                        <th className="p-4 font-semibold">SN</th>
                        <th className="p-4 font-semibold">Applicant Name</th>
                        <th className="p-4 font-semibold">Passport Number</th>
                        <th className="p-4 font-semibold">Expiry Date</th>
                        <th className="p-4 font-semibold">Days Left</th>
                        <th className="p-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiringSoon.map((applicant, index) => {
                        const daysLeft = getDaysUntilExpiry(applicant.passportExpiry);
                        const getDaysColor = (days) => {
                          if (days <= 30) return 'text-red-400';
                          if (days <= 90) return 'text-amber-400';
                          return 'text-yellow-400';
                        };

                        return (
                          <tr
                            key={applicant._id}
                            className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150"
                          >
                            <td className="p-4 text-gray-300 font-medium">
                              {index + 1}
                            </td>
                            <td className="p-4">
                              <span className="text-white font-semibold">
                                {applicant.fullName}
                              </span>
                              {applicant.agent?.name && (
                                <div className="text-gray-400 text-xs mt-1">
                                  Agent: {applicant.agent.name}
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="text-gray-300 font-mono">
                                {applicant.passportNo}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-amber-400 font-medium">
                                {formatDate(applicant.passportExpiry)}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`font-bold ${getDaysColor(daysLeft)}`}>
                                {daysLeft} days
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                daysLeft <= 30 
                                  ? 'bg-red-500/20 text-red-400'
                                  : daysLeft <= 90
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {daysLeft <= 30 ? 'URGENT' : daysLeft <= 90 ? 'SOON' : 'WATCH'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-green-400" />
                  </div>
                  <h3 className="text-green-400 font-semibold text-lg mb-2">
                    No Passports Expiring Soon
                  </h3>
                  <p className="text-gray-400">
                    All passports have sufficient validity
                  </p>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {expired.length + expiringSoon.length}
                </div>
                <div className="text-gray-400 font-medium">Total Alerts</div>
                <div className="text-sm text-gray-500 mt-2">Passports needing attention</div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 border border-red-500/20 text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {expired.length}
                </div>
                <div className="text-gray-400 font-medium">Expired</div>
                <div className="text-sm text-gray-500 mt-2">Immediate action required</div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 border border-amber-500/20 text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">
                  {expiringSoon.length}
                </div>
                <div className="text-gray-400 font-medium">Expiring Soon</div>
                <div className="text-sm text-gray-500 mt-2">Within 360 days</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Passport;