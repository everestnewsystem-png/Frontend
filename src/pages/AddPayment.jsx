import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { useNavigate } from "react-router-dom";

const AddPayment = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);

  const [form, setForm] = useState({
    applicantId: "",
    amount: "",
    method: "",
    purpose: "",
    date: new Date().toISOString().substring(0, 10),
  });

  const update = (key, value) => setForm({ ...form, [key]: value });

  useEffect(() => {
    api.get("/applicants?all=true").then((res) =>
      setApplicants(res.data.results || [])
    );
  }, []);

  const submit = async () => {
    await api.post("/payments", form);
    navigate("/payments");
  };

  return (
    <div>
      <TopStrip />
      <SecondStrip />
      <div className="p-5 max-w-lg mx-auto">
        <h1 className="text-xl font-semibold mb-4">Add Payment</h1>

        <select
          className="border w-full p-2 rounded mb-4"
          value={form.applicantId}
          onChange={(e) => update("applicantId", e.target.value)}
        >
          <option value="">Select Applicant</option>
          {applicants.map((a) => (
            <option key={a._id} value={a._id}>
              {a.fullName}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="border w-full p-2 rounded mb-4"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => update("amount", e.target.value)}
        />

        <input
          className="border w-full p-2 rounded mb-4"
          placeholder="Purpose"
          value={form.purpose}
          onChange={(e) => update("purpose", e.target.value)}
        />

        <input
          className="border w-full p-2 rounded mb-4"
          placeholder="Method (Cash / Bank / Online)"
          value={form.method}
          onChange={(e) => update("method", e.target.value)}
        />

        <input
          type="date"
          className="border w-full p-2 rounded mb-4"
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
        />

        <button
          onClick={submit}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Add Payment
        </button>
      </div>
    </div>
  );
};

export default AddPayment;
