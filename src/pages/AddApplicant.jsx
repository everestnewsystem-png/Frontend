import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { useNavigate } from "react-router-dom";
import { useError } from "../context/ErrorContext";
import { CheckCircle } from "lucide-react";

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

const AddApplicant = () => {
  const navigate = useNavigate();
  const { showError } = useError();

  const [agents, setAgents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

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

  // ✅ Fetch agents and countries safely
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [agentsRes, countriesRes] = await Promise.all([
          api.get("/agents"),
          api.get("/countries"),
        ]);
        setAgents(agentsRes.data || []);
        setCountries(countriesRes.data || []);
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          "Error loading agents and countries.";
        showError(msg);
      }
    };
    loadDropdowns();
  }, [showError]);

  const update = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const validateForm = () => {
    if (!form.fullName || !form.passportNo || !form.dob || !form.passportExpiry) {
      showError("Please fill all required fields before submitting.");
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post("/applicants", form);

      // ✅ success overlay
      setSuccess({
        title: "Applicant Added Successfully",
        message: `${form.fullName} has been added to the system.`,
      });

      setTimeout(() => {
        navigate("/applicants");
      }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Error adding applicant. Please check your input.";
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <TopStrip />
      <SecondStrip />

      {/* ✅ Success Overlay */}
      {success && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-green-600 text-white max-w-sm w-full mx-4 rounded-lg shadow-lg p-6 text-center">
            <CheckCircle size={36} className="mx-auto mb-2 text-white" />
            <h2 className="text-lg font-bold mb-1">{success.title}</h2>
            <p className="text-sm text-green-100">{success.message}</p>
            <button
              onClick={() => setSuccess(null)}
              className="mt-4 bg-white text-green-700 px-4 py-2 rounded font-semibold hover:bg-gray-100"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="p-6 max-w-4xl mx-auto animate-fade">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-white mb-6">
            Add New Applicant
          </h1>

          {/* ✅ FORM SECTIONS */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-600">
              Required Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                required
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
              <FormInput
                label="Passport Number"
                required
                value={form.passportNo}
                onChange={(e) => update("passportNo", e.target.value)}
              />
              <FormInput
                type="date"
                label="Date of Birth"
                required
                value={form.dob}
                onChange={(e) => update("dob", e.target.value)}
              />
              <FormInput
                type="date"
                label="Passport Expiry"
                required
                value={form.passportExpiry}
                onChange={(e) => update("passportExpiry", e.target.value)}
              />

              <SelectField
                label="Agent"
                options={agents.map((a) => ({
                  label: a.name,
                  value: a._id,
                }))}
                value={form.agent}
                onChange={(e) => update("agent", e.target.value)}
              />

              <SelectField
                label="Country"
                options={countries.map((c) => ({
                  label: c.countryName,
                  value: c._id,
                }))}
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
              />

              <FormInput
                label="Main Contact"
                required
                value={form.contactMain}
                onChange={(e) => update("contactMain", e.target.value)}
              />
              <FormInput
                label="Marital Status"
                value={form.maritalStatus}
                onChange={(e) => update("maritalStatus", e.target.value)}
              />
              <FormInput
                label="Birth Place"
                value={form.birthPlace}
                onChange={(e) => update("birthPlace", e.target.value)}
              />
              <FormInput
                label="Gender"
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
              />
              <SelectField
                label="Progress Status"
                options={progressOptions.map((p) => ({ label: p, value: p }))}
                value={form.progressStatus}
                onChange={(e) => update("progressStatus", e.target.value)}
              />
            </div>
          </div>

          {/* Optional Info */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-600">
              Optional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Father's Name"
                value={form.fatherName}
                onChange={(e) => update("fatherName", e.target.value)}
              />
              <FormInput
                label="Mother's Name"
                value={form.motherName}
                onChange={(e) => update("motherName", e.target.value)}
              />
              <FormInput
                label="Secondary Contact"
                value={form.contactSecondary}
                onChange={(e) => update("contactSecondary", e.target.value)}
              />
              <FormInput
                label="Company"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
              />
              <FormInput
                label="File Number"
                value={form.fileNo}
                onChange={(e) => update("fileNo", e.target.value)}
              />
              <FormInput
                type="date"
                label="Appointment Date"
                value={form.appointmentDate}
                onChange={(e) => update("appointmentDate", e.target.value)}
              />
              <FormInput
                type="date"
                label="Submitted Date"
                value={form.submittedDate}
                onChange={(e) => update("submittedDate", e.target.value)}
              />
              <FormInput
                type="date"
                label="Physical Date"
                value={form.physicalDate}
                onChange={(e) => update("physicalDate", e.target.value)}
              />
              <FormInput
                type="date"
                label="Police Dispatch Date"
                value={form.policeDispatchDate}
                onChange={(e) =>
                  update("policeDispatchDate", e.target.value)
                }
              />
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
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {loading ? "Adding Applicant..." : "Add Applicant"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Small reusable components to clean up JSX
const FormInput = ({ label, value, onChange, required, type = "text" }) => (
  <div>
    <label className="block text-gray-300 text-sm font-medium mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      value={value}
      onChange={onChange}
    />
  </div>
);

const SelectField = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-gray-300 text-sm font-medium mb-2">
      {label}
    </label>
    <select
      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      value={value}
      onChange={onChange}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default AddApplicant;
