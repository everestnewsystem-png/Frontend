import { Eye, Pencil, Trash } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const CountryTable = ({ data, onDelete }) => {
  const { user } = useAuth();

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-700 bg-gray-800 animate-fade">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
          <tr>
            <th className="p-4 font-semibold">SN</th>
            <th className="p-4 font-semibold">Country</th>
            <th className="p-4 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((country, index) => (
            <tr
              key={country._id}
              className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150"
            >
              <td className="p-4 text-gray-300">{index + 1}</td>
              
              <td className="p-4 text-white font-medium">
                {country.countryName}
              </td>

              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/view-country/${country._id}`}
                    className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-600/20 rounded-lg transition-all duration-200"
                    title="View Country"
                  >
                    <Eye size={18} />
                  </Link>

                  <Link
                    to={`/edit-country/${country._id}`}
                    className="text-gray-400 hover:text-white p-2 hover:bg-gray-600/20 rounded-lg transition-all duration-200"
                    title="Edit Country"
                  >
                    <Pencil size={18} />
                  </Link>

                  <button
                    disabled={user?.role !== "admin"}
                    onClick={() => onDelete(country._id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      user?.role !== "admin"
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-red-400 hover:text-red-300 hover:bg-red-600/20"
                    }`}
                    title={
                      user?.role !== "admin"
                        ? "Admin only"
                        : "Delete Country"
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
    </div>
  );
};

export default CountryTable;