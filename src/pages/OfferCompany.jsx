// src/pages/OfferCompany.jsx
import { useEffect, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { Pencil, Trash2, Plus } from "lucide-react";
import {useNavigate} from "react-router-dom";
const emptyForm = {
  name: "",
  address: "",
  cui: "",
  traderegno: "",
  contact: "",
  email: "",
  representative: "",
};

const OfferCompany = () => {
    const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/offers/companies");
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/offers/companies/${editingId}`, form);
      } else {
        await api.post("/offers/companies", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await fetchCompanies();
    } catch (err) {
      console.error(err);
      alert("Error saving company");
    }
  };

  const handleEdit = (company) => {
    setEditingId(company._id);
    setForm({
      name: company.name,
      address: company.address,
      cui: company.cui,
      traderegno: company.traderegno,
      contact: company.contact,
      email: company.email,
      representative: company.representative,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    try {
      await api.delete(`/offers/companies/${id}`);
      setCompanies((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting company");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <TopStrip />
      <SecondStrip />
      <div className="max-w-5xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Offer Companies</h1>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium bg-white hover:bg-slate-50"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
          <button
            type="button"
            onClick={() => navigate("/generateoffer")
              }
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium bg-white hover:bg-slate-50"
          >
            <Plus className="w-4 h-4" />
            Generate Offer
          </button>
           <button
            type="button"
            onClick={() => navigate("/generate-cim")
              }
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium bg-white hover:bg-slate-50"
          >
            <Plus className="w-4 h-4" />
            Generate Full CIM
          </button>
        </div>

        {/* Add / Edit form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Company Name"
            className="border rounded-md px-3 py-2 text-sm"
            required
          />
          <input
            name="representative"
            value={form.representative}
            onChange={handleChange}
            placeholder="Director Name"
            className="border rounded-md px-3 py-2 text-sm"
            required
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Company Address"
            className="border rounded-md px-3 py-2 text-sm"
            required
          />
          <input
            name="cui"
            value={form.cui}
            onChange={handleChange}
            placeholder="CUI"
            className="border rounded-md px-3 py-2 text-sm"
            required
          />
          <input
            name="traderegno"
            value={form.traderegno}
            onChange={handleChange}
            placeholder="Trade Reg. No."
            className="border rounded-md px-3 py-2 text-sm"
            required
          />
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            className="border rounded-md px-3 py-2 text-sm"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded-md px-3 py-2 text-sm"
            required
          />

          <div className="flex items-center gap-2 md:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              disabled={loading}
            >
              {editingId ? "Update Company" : "Save Company"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-md border px-4 py-2 text-sm font-medium bg-white"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* Companies table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left">SN</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Contact</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr key={company._id} className="border-t">
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{company.name}</td>
                  <td className="px-3 py-2">{company.email}</td>
                  <td className="px-3 py-2">{company.contact}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleEdit(company)}
                      className="inline-flex items-center mr-2 p-1 rounded hover:bg-slate-100"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(company._id)}
                      className="inline-flex items-center p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td className="px-3 py-3 text-center text-slate-500" colSpan={5}>
                    No companies added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfferCompany;
