import { Eye, Pencil, Trash, Printer } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";

const ApplicantTable = ({ data, onDelete }) => {
  const { user } = useAuth();
  const role = user?.role;

  // Show only first 10 applicants initially (speed boost)
  const [showAll, setShowAll] = useState(false);
  const visibleData = showAll ? data : data?.slice(0, 10);

  // Progress status color mapping
  const getProgressColor = (status) => {
    const colors = {
      'new': 'bg-blue-600/20 text-blue-400',
      'init paid': 'bg-yellow-600/20 text-yellow-400',
      'document sent': 'bg-purple-600/20 text-purple-400',
      'submitted': 'bg-indigo-600/20 text-indigo-400',
      'resubmitted': 'bg-indigo-600/20 text-indigo-400',
      'permit received': 'bg-green-600/20 text-green-400',
      'permit rejected': 'bg-red-600/20 text-red-400',
      'embassy submitted': 'bg-cyan-600/20 text-cyan-400',
      'mail received': 'bg-emerald-600/20 text-emerald-400',
      'visa rejected': 'bg-red-600/20 text-red-400',
      'Visa stampped': 'bg-green-600/20 text-green-400',
      'Flight Done': 'bg-green-600/20 text-green-400',
      'cancelled': 'bg-gray-600/20 text-gray-400',
    };
    return colors[status] || 'bg-gray-600/20 text-gray-400';
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-700 bg-gray-800 animate-fade">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
          <tr>
            <th className="p-4 font-semibold">SN</th>
            <th className="p-4 font-semibold">Name</th>
            <th className="p-4 font-semibold">Country</th>
            <th className="p-4 font-semibold">Agent</th>
            <th className="p-4 font-semibold">Contact</th>
            <th className="p-4 font-semibold">Progress</th>
            <th className="p-4 font-semibold">Company</th>
            <th className="p-4 font-semibold">File No</th>
            <th className="p-4 font-semibold">Appt.</th>
            <th className="p-4 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {visibleData?.map((applicant, index) => (
            <tr
              key={applicant._id}
              className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150"
            >
              <td className="p-4 text-gray-300 font-medium">{index + 1}</td>
              
              <td className="p-4">
                <div>
                  <span className="text-white font-semibold block">{applicant.fullName}</span>
                  
                </div>
              </td>

              <td className="p-4">
                <span className="text-gray-300">{applicant.country?.countryName}</span>
              </td>

              <td className="p-4">
                <span className="text-gray-300">{applicant.agent?.name}</span>
              </td>

              <td className="p-4">
                <span className="text-gray-300">{applicant.contactMain}</span>
              </td>

              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getProgressColor(applicant.progressStatus)}`}>
                  {applicant.progressStatus}
                </span>
              </td>

              <td className="p-4">
                <span className="text-gray-300">{applicant.company || "-"}</span>
              </td>

              <td className="p-4">
                <span className="text-gray-300 font-mono">{applicant.fileNo || "-"}</span>
              </td>

              <td className="p-4">
                <span className="text-gray-300 text-sm">
                  {applicant.appointmentDate
                    ? new Date(applicant.appointmentDate).toLocaleDateString()
                    : "-"}
                </span>
              </td>

              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/view-applicant/${applicant._id}`}
                    className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-600/20 rounded-lg transition-all duration-200"
                    title="View Applicant"
                  >
                    <Eye size={18} />
                  </Link>

                  <Link
                    to={`/edit-applicant/${applicant._id}`}
                    className="text-gray-400 hover:text-white p-2 hover:bg-gray-600/20 rounded-lg transition-all duration-200"
                    title="Edit Applicant"
                  >
                    <Pencil size={18} />
                  </Link>

                 

                  <button
                    disabled={role !== "admin"}
                    onClick={() => onDelete(applicant._id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      role !== "admin"
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-red-400 hover:text-red-300 hover:bg-red-600/20"
                    }`}
                    title={
                      role !== "admin"
                        ? "Admin only"
                        : "Delete Applicant"
                    }
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Show ALL button */}
      {!showAll && data?.length > 10 && (
        <div className="p-4 text-center border-t border-gray-700">
          <button
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 font-medium transform hover:scale-105"
            onClick={() => setShowAll(true)}
          >
            Show All Applicants ({data.length} total)
          </button>
        </div>
      )}

      {showAll && data?.length > 10 && (
        <div className="p-4 text-center border-t border-gray-700">
          <button
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
            onClick={() => setShowAll(false)}
          >
            Show Less (First 10)
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicantTable;