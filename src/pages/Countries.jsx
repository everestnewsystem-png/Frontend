import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import CountryTable from "../components/tables/country-table";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading";
import { Search, Plus, Globe, RefreshCw } from "lucide-react";

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await api.get("/countries");
      setCountries(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this country?")) return;
    try {
      await api.delete(`/countries/${id}`);
      fetchCountries();
    } catch (error) {
      console.error("Error deleting country:", error);
      alert("Error deleting country. Please try again.");
    }
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setFiltered(countries);
      return;
    }
    
    setFiltered(
      countries.filter((c) =>
        c.countryName.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const clearSearch = () => {
    setSearch("");
    setFiltered(countries);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Countries</h1>
            <p className="text-gray-400">
              Manage destination countries for applicants
            </p>
          </div>
          
          <button
            onClick={() => navigate("/add-country")}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Country</span>
          </button>
        </div>

        {/* Search and Stats Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Search countries by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <Search size={18} />
                <span>Search</span>
              </button>
              <button
                onClick={clearSearch}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-gray-600 flex items-center space-x-2"
              >
                <RefreshCw size={18} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-750 rounded-lg p-4 text-center border border-gray-600">
              <div className="text-2xl font-bold text-white mb-1">
                {countries.length}
              </div>
              <div className="text-gray-400 text-sm">Total Countries</div>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-4 text-center border border-gray-600">
              <div className="text-2xl font-bold text-white mb-1">
                {filtered.length}
              </div>
              <div className="text-gray-400 text-sm">
                {search ? "Search Results" : "Active Countries"}
              </div>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-4 text-center border border-gray-600">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {countries.filter(c => c.applicantsCount > 0).length}
              </div>
              <div className="text-gray-400 text-sm">With Applicants</div>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-4 text-center border border-gray-600">
              <div className="text-2xl font-bold text-amber-400 mb-1">
                {countries.filter(c => !c.applicantsCount || c.applicantsCount === 0).length}
              </div>
              <div className="text-gray-400 text-sm">No Applicants</div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <Loading />
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Globe size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Country List
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {search ? (
                      <>Showing {filtered.length} of {countries.length} countries matching "{search}"</>
                    ) : (
                      <>Managing {countries.length} destination countries</>
                    )}
                  </p>
                </div>
              </div>
              
              {search && filtered.length > 0 && (
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-white text-sm font-medium"
                >
                  Clear search
                </button>
              )}
            </div>

            {filtered.length > 0 ? (
              <CountryTable data={filtered} onDelete={handleDelete} />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-gray-400 font-semibold text-lg mb-2">
                  {search ? "No Countries Found" : "No Countries Available"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {search 
                    ? `No countries found matching "${search}"`
                    : "Get started by adding your first country"
                  }
                </p>
                {!search && (
                  <button
                    onClick={() => navigate("/add-country")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                  >
                    <Plus size={18} />
                    <span>Add First Country</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions Footer */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div>
            {countries.length > 0 && (
              <span>
                Total {countries.length} countries • {filtered.length} currently showing
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchCountries}
              className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-1"
            >
              <RefreshCw size={14} />
              <span>Refresh Data</span>
            </button>
            <div className="w-px h-4 bg-gray-600"></div>
            <button
              onClick={() => navigate("/add-country")}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>Add New Country</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countries;