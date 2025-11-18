import { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "viewer",
  });

  const update = (f, v) => setForm({ ...form, [f]: v });

  useEffect(() => {
    api.get(`/users/${id}`).then((res) => {
      setForm({
        username: res.data.username,
        password: "",
        role: res.data.role,
      });
    });
  }, [id]);

  const submit = async () => {
    await api.put(`/users/${id}`, form);
    navigate("/users");
  };

  return (
    <div>
      <TopStrip />
      <SecondStrip />

      <div className="p-5 max-w-lg mx-auto">
        <h1 className="text-xl font-semibold mb-4">Edit User</h1>

        <input
          className="border p-2 w-full rounded mb-3"
          value={form.username}
          onChange={(e) => update("username", e.target.value)}
        />

        <input
          className="border p-2 w-full rounded mb-3"
          placeholder="New Password (optional)"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
        />

        <select
          className="border p-2 w-full rounded mb-3"
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={submit}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditUser;
