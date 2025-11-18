import { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import Loading from "../components/loading";
import { Printer, Edit, User, Calendar, Phone, MapPin, FileText, Globe, Users, Building, Shield, ArrowLeft } from "lucide-react";

const ViewApplicant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/applicants/${id}`).then((res) => {
      setApplicant(res.data);
      setLoading(false);
    });
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'new': 'bg-blue-500/20 text-blue-400',
      'init paid': 'bg-yellow-500/20 text-yellow-400',
      'document sent': 'bg-purple-500/20 text-purple-400',
      'submitted': 'bg-indigo-500/20 text-indigo-400',
      'resubmitted': 'bg-indigo-500/20 text-indigo-400',
      'permit received': 'bg-green-500/20 text-green-400',
      'permit rejected': 'bg-red-500/20 text-red-400',
      'embassy submitted': 'bg-cyan-500/20 text-cyan-400',
      'mail received': 'bg-emerald-500/20 text-emerald-400',
      'visa rejected': 'bg-red-500/20 text-red-400',
      'Visa stampped': 'bg-green-500/20 text-green-400',
      'Flight Done': 'bg-green-500/20 text-green-400',
      'cancelled': 'bg-gray-500/20 text-gray-400',
    };
    return statusColors[status] || 'bg-gray-500/20 text-gray-400';
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

  if (!applicant) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-6xl mx-auto animate-fade">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/applicants")}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                  <User size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {applicant.fullName}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(applicant.progressStatus)}`}>
                      {applicant.progressStatus}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Passport: {applicant.passportNo}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 border border-gray-600"
              >
                <Printer size={18} />
                <span>Print</span>
              </button>

              <button
                onClick={() => navigate(`/edit-applicant/${id}`)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Edit size={18} />
                <span>Edit Applicant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <User size={20} className="text-blue-400" />
              <span>Personal Information</span>
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Gender</label>
                  <p className="text-white">{applicant.gender || "-"}</p>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Date of Birth</label>
                  <p className="text-white flex items-center space-x-1">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{formatDate(applicant.dob)}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">Address / Birth Place</label>
                <p className="text-white flex items-center space-x-1">
                  <MapPin size={14} className="text-gray-400" />
                  <span>{applicant.birthPlace || "-"}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Father's Name</label>
                  <p className="text-white">{applicant.fatherName || "-"}</p>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Mother's Name</label>
                  <p className="text-white">{applicant.motherName || "-"}</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">Marital Status</label>
                <p className="text-white">{applicant.maritalStatus || "-"}</p>
              </div>
            </div>
          </div>

          {/* Passport & Contact Information */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <FileText size={20} className="text-green-400" />
              <span>Passport & Contact</span>
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Passport Number</label>
                  <p className="text-white font-mono">{applicant.passportNo}</p>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Passport Expiry</label>
                  <p className="text-white flex items-center space-x-1">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{formatDate(applicant.passportExpiry)}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Main Contact</label>
                  <p className="text-white flex items-center space-x-1">
                    <Phone size={14} className="text-gray-400" />
                    <span>{applicant.contactMain}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Secondary Contact</label>
                  <p className="text-white flex items-center space-x-1">
                    <Phone size={14} className="text-gray-400" />
                    <span>{applicant.contactSecondary || "-"}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Information */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Users size={20} className="text-purple-400" />
              <span>Assignment Information</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">Country</label>
                <p className="text-white flex items-center space-x-1">
                  <Globe size={14} className="text-gray-400" />
                  <span>{applicant.country?.countryName || "-"}</span>
                </p>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">Agent</label>
                <p className="text-white">{applicant.agent?.name || "-"}</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">Company</label>
                <p className="text-white flex items-center space-x-1">
                  <Building size={14} className="text-gray-400" />
                  <span>{applicant.company || "-"}</span>
                </p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">File Number</label>
                <p className="text-white font-mono">{applicant.fileNo || "-"}</p>
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Calendar size={20} className="text-amber-400" />
              <span>Important Dates</span>
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Appointment Date</label>
                  <p className="text-white">{formatDate(applicant.appointmentDate)}</p>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Submitted Date</label>
                  <p className="text-white">{formatDate(applicant.submittedDate)}</p>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Physical Date</label>
                  <p className="text-white">{formatDate(applicant.physicalDate)}</p>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Police Dispatch</label>
                  <p className="text-white flex items-center space-x-1">
                    <Shield size={14} className="text-gray-400" />
                    <span>{formatDate(applicant.policeDispatchDate)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              <p className="text-gray-400 text-sm">Manage this applicant's records</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/print-tool/${id}`)}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 border border-gray-600"
              >
                <FileText size={16} />
                <span>Print Documents</span>
              </button>
              <button
                onClick={() => navigate(`/edit-applicant/${id}`)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewApplicant;