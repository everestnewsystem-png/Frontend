import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { useParams, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/errorMessage";
import { Save, ArrowLeft } from "lucide-react";

const progressOptions = [
  "new",
  "init paid",
  "document sent",
  "submitted",
  "resubmitted",
  "permit received",
  "permit rejected",
  "embassy submitted",
  "appointment confirmed",
  "mail received",
  "visa rejected",
  "Visa stampped",
  "Flight Done",
  "cancelled",
];

const EditApplicant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    passportNo: "",
    dob: "",
    passportExpiry: "",
    agent: "",
    country: "",
    contactMain: "",
    maritalStatus: "",
    gender: "",
    progressStatus: "new",

    fatherName: "",
    motherName: "",
    contactSecondary: "",
    company: "",
    fileNo: "",
    appointmentDate: "",
    submittedDate: "",
    physicalDate: "",
    policeDispatchDate: "",
  });

  const update = (field, val) => {
    setForm({ ...form, [field]: val });
  };

  useEffect(() => {
    api.get(`/agents`).then((res) => setAgents(res.data));
    api.get(`/countries`).then((res) => setCountries(res.data));

    api.get(`/applicants/${id}`).then((res) => {
      const a = res.data;
      setForm({
        fullName: a.fullName,
        passportNo: a.passportNo,
        dob: a.dob?.substring(0, 10),
        passportExpiry: a.passportExpiry?.substring(0, 10),
        agent: a.agent?._id,
        country: a.country?._id,
        contactMain: a.contactMain,
        maritalStatus: a.maritalStatus,
        gender: a.gender,
        progressStatus: a.progressStatus,

        fatherName: a.fatherName,
        motherName: a.motherName,
        contactSecondary: a.contactSecondary,
        company: a.company,
        fileNo: a.fileNo,
        appointmentDate: a.appointmentDate?.substring(0, 10),
        submittedDate: a.submittedDate?.substring(0, 10),
        physicalDate: a.physicalDate?.substring(0, 10),
        policeDispatchDate: a.policeDispatchDate?.substring(0, 10),
      });
    });
  }, [id]);

  const submit = async () => {
    if (
      !form.fullName ||
      !form.passportNo ||
      !form.dob ||
      !form.passportExpiry
    ) {
      return setError("Please fill all required fields.");
    }

    setLoading(true);
    try {
      await api.put(`/applicants/${id}`, form);
      navigate("/applicants");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating applicant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopStrip />
      <SecondStrip />

      <div className="p-6 max-w-4xl mx-auto animate-fade">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/applicants")}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Edit Applicant
                </h1>
                <p className="text-gray-400 text-sm">
                  Update applicant information
                </p>
              </div>
            </div>
          </div>

          <ErrorMessage message={error} />

          {/* Required Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-600">
              Required Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Passport Number <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter passport number"
                  value={form.passportNo}
                  onChange={(e) => update("passportNo", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Date of Birth <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={form.dob}
                  onChange={(e) => update("dob", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Passport Expiry <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={form.passportExpiry}
                  onChange={(e) => update("passportExpiry", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Agent <span className="text-red-400">*</span>
                </label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={form.agent}
                  onChange={(e) => update("agent", e.target.value)}
                >
                  <option value="" className="text-gray-400">
                    Select Agent
                  </option>
                  {agents.map((ag) => (
                    <option key={ag._id} value={ag._id} className="text-white">
                      {ag.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Country <span className="text-red-400">*</span>
                </label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                >
                  <option value="" className="text-gray-400">
                    Select Country
                  </option>
                  {countries.map((c) => (
                    <option key={c._id} value={c._id} className="text-white">
                      {c.countryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Main Contact <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter main contact"
                  value={form.contactMain}
                  onChange={(e) => update("contactMain", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Marital Status
                </label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter marital status"
                  value={form.maritalStatus}
                  onChange={(e) => update("maritalStatus", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Gender
                </label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter gender"
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Progress Status
                </label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={form.progressStatus}
                  onChange={(e) => update("progressStatus", e.target.value)}
                >
                  {progressOptions.map((p) => (
                    <option key={p} value={p} className="text-white">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Optional Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-600">
              Optional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Father's Name
                </label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter father's name"
                  value={form.fatherName}
                  onChange={(e) => update("fatherName", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Mother's Name
                </label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter mother's name"
                  value={form.motherName}
                  onChange={(e) => update("motherName", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Secondary Contact
                </label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter secondary contact"
                  value={form.contactSecondary}
                  onChange={(e) => update("contactSecondary", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Company
                </label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter company name"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  File Number
                </label>
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter file number"
                  value={form.fileNo}
                  onChange={(e) => update("fileNo", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={form.appointmentDate}
                  onChange={(e) => update("appointmentDate", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Submitted Date
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={form.submittedDate}
                  onChange={(e) => update("submittedDate", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Physical Date
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={form.physicalDate}
                  onChange={(e) => update("physicalDate", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Police Dispatch Date
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={form.policeDispatchDate}
                  onChange={(e) => update("policeDispatchDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={submit}
            disabled={
              loading ||
              !form.fullName ||
              !form.passportNo ||
              !form.dob ||
              !form.passportExpiry
            }
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save size={20} />
            )}
            <span>{loading ? "Updating..." : "Update Applicant"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditApplicant;
