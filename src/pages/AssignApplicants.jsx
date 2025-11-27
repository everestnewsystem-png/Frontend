// src/pages/AssignApplicants.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { Search, UserCheck, Users, ArrowRight } from "lucide-react";

const safeArray = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw.items)) return raw.items;
  if (Array.isArray(raw.results)) return raw.results;
  if (Array.isArray(raw.applicants)) return raw.applicants;
  if (Array.isArray(raw.data?.applicants)) return raw.data.applicants;
  return [];
};

// if backend ever nests data, merge it – for your current schema this just returns item
const flattenApplicant = (item) => {
  if (!item || typeof item !== "object") return item;
  let base = { ...item };
  if (item.applicant && typeof item.applicant === "object") {
    base = { ...item, ...item.applicant };
  } else if (item.user && typeof item.user === "object") {
    base = { ...item, ...item.user };
  } else if (item.profile && typeof item.profile === "object") {
    base = { ...item, ...item.profile };
  }
  return base;
};

// Get an agentId for counting / filtering, using current agents list
const getAgentIdFromApplicant = (app, agents) => {
  if (!app) return null;

  // from your schema: agent is ObjectId
  if (app.agentId) return app.agentId;
  if (app.agent && typeof app.agent === "object" && app.agent._id) {
    return app.agent._id;
  }
  if (typeof app.agent === "string" && agents && agents.length) {
    const match =
      agents.find((ag) => ag._id === app.agent) ||
      agents.find(
        (ag) =>
          ag.name === app.agent ||
          ag.fullname === app.agent ||
          ag.code === app.agent
      );
    if (match) return match._id;
  }
  return null;
};

// NAME helper – now uses fullName from your schema
const getApplicantDisplayName = (a) => {
  if (!a) return "Unnamed";

  return (
    a.fullName || // 👈 main field from your schema
    a.name ||
    a.fullname ||
    a.full_name ||
    a.applicantName ||
    a.applicant_name ||
    a.displayName ||
    a.display_name ||
    `${a.firstname || a.firstName || ""} ${
      a.surname || a.lastName || a.lastname || ""
    }`.trim() ||
    a.passportNo || // at least something readable
    a.email ||
    a.username ||
    a._id ||
    "Unnamed"
  );
};

// STATUS helper – now uses progressStatus from your schema
const getApplicantStatus = (a) => {
  if (!a) return "—";
  return (
    a.progressStatus || // 👈 main field from your schema
    a.status ||
    a.progress ||
    a.stage ||
    a.currentStatus ||
    a.applicationStatus ||
    a.pipelineStatus ||
    a.state ||
    "—"
  );
};

const AssignApplicants = () => {
  const [agents, setAgents] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const [loadingAgents, setLoadingAgents] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [agentSearch, setAgentSearch] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [selectedApplicantIds, setSelectedApplicantIds] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [applicantSearch, setApplicantSearch] = useState("");

  // ---------- LOAD AGENTS ----------
  const loadAgents = async () => {
    try {
      setLoadingAgents(true);
      const res = await api.get("/agents");
      setAgents(safeArray(res.data));
    } catch (e) {
      console.error(e);
      setError("Failed to load agents.");
    } finally {
      setLoadingAgents(false);
    }
  };

  // ---------- LOAD APPLICANTS ----------
  const loadApplicants = async (all = false) => {
    try {
      setLoadingApplicants(true);
      const url = all ? "/applicants?all=true" : "/applicants";
      const res = await api.get(url);

      const raw = safeArray(res.data);
      const flattened = raw.map(flattenApplicant);

      setApplicants(flattened);
    } catch (e) {
      console.error(e);
      setError("Failed to load applicants.");
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    loadAgents();
    loadApplicants(false); // initial (paginated) load
  }, []);

  // ---------- FILTER AGENTS ----------
  const filteredAgents = useMemo(() => {
    const term = agentSearch.toLowerCase();
    if (!term) return agents;
    return agents.filter((a) =>
      (a.name || a.fullname || "").toLowerCase().includes(term)
    );
  }, [agents, agentSearch]);

  // ---------- COUNT APPLICANTS PER AGENT ----------
  const applicantsCountByAgent = useMemo(() => {
    const counts = {};
    applicants.forEach((app) => {
      const id = getAgentIdFromApplicant(app, agents);
      if (!id) return;
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }, [applicants, agents]);

  // ---------- APPLICANTS OF SELECTED AGENT ----------
  const assignedApplicants = useMemo(() => {
    if (!selectedAgentId) return [];
    return applicants.filter(
      (app) => getAgentIdFromApplicant(app, agents) === selectedAgentId
    );
  }, [applicants, agents, selectedAgentId]);

  const selectedAgent = agents.find((a) => a._id === selectedAgentId);

  // ---------- SELECT APPLICANTS ----------
  const toggleApplicantSelection = (id) => {
    setSelectedApplicantIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllApplicants = () => {
    if (selectedApplicantIds.length === applicants.length) {
      setSelectedApplicantIds([]);
    } else {
      setSelectedApplicantIds(applicants.map((a) => a._id));
    }
  };

  // ---------- ASSIGN ----------
  // Build safe payload for PUT /applicants/:id using your Applicant schema
  const buildApplicantUpdatePayload = (app, newAgentId) => {
    if (!app) return { agent: newAgentId };

    return {
      // required fields from your schema
      fullName: app.fullName,
      passportNo: app.passportNo,
      dob: app.dob,
      passportExpiry: app.passportExpiry,
      agent: newAgentId, // 👈 UPDATE HERE
      country: app.country,
      contactMain: app.contactMain,
      contactSecondary: app.contactSecondary,
      gender: app.gender,
      maritalStatus: app.maritalStatus,
      birthPlace: app.birthPlace,

      // optional fields (keep if present)
      progressStatus: app.progressStatus,
      fatherName: app.fatherName,
      motherName: app.motherName,
      company: app.company,
      fileNo: app.fileNo,
      appointmentDate: app.appointmentDate,
      submittedDate: app.submittedDate,
      physicalDate: app.physicalDate,
      policeDispatchDate: app.policeDispatchDate,
    };
  };

  // ---------- ASSIGN ----------
  const handleAssign = async () => {
    setError("");
    setSuccess("");

    if (!selectedAgentId) {
      setError("Please select an agent first.");
      return;
    }
    if (!selectedApplicantIds.length) {
      setError("Please select at least one applicant.");
      return;
    }

    try {
      setAssigning(true);

      // Use existing backend route: PUT /api/applicants/:id
      await Promise.all(
        selectedApplicantIds.map((id) => {
          const app = applicants.find((a) => a._id === id);
          const payload = buildApplicantUpdatePayload(app, selectedAgentId);

          return api.put(`/applicants/${id}`, payload); // 👈 no backend change
        })
      );

      // Update frontend state so UI matches DB
      setApplicants((prev) =>
        prev.map((app) =>
          selectedApplicantIds.includes(app._id)
            ? {
                ...app,
                agentId: selectedAgentId,
                agent: selectedAgent || app.agent,
              }
            : app
        )
      );

      setSelectedApplicantIds([]);
      setSuccess("Applicants assigned successfully.");
    } catch (e) {
      console.error("Assign error:", e);
      setError("Failed to assign applicants.");
    } finally {
      setAssigning(false);
    }
  };

  const filteredApplicants = useMemo(() => {
    const term = applicantSearch.toLowerCase().trim();
    if (!term) return applicants;

    return applicants.filter((a) => {
      const name = getApplicantDisplayName(a).toLowerCase();
      const passport = (a.passportNo || "").toLowerCase();
      const status = getApplicantStatus(a).toLowerCase();

      return (
        name.includes(term) || passport.includes(term) || status.includes(term)
      );
    });
  }, [applicantSearch, applicants]);

  return (
    <div className="min-h-screen bg-slate-100">
      <TopStrip />
      <SecondStrip />

      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-slate-700" />
          <h1 className="text-2xl font-semibold text-slate-800">
            Assign Applicants
          </h1>
        </div>

        {(error || success) && (
          <div className="mb-4 text-sm space-y-2">
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-700 px-3 py-2 rounded">
                {success}
              </div>
            )}
          </div>
        )}

        {/* ========== AGENTS LIST ========== */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-600" />
              <h2 className="text-sm font-semibold text-slate-800">Agents</h2>
            </div>

            <div className="relative w-64 text-sm">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                placeholder="Search agent..."
                className="w-full pl-8 pr-2 py-1.5 rounded-md border text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left w-12">SN</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-center w-28">
                    Applicants count
                  </th>
                  <th className="px-3 py-2 text-center w-32">Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingAgents && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-3 text-center text-slate-500"
                    >
                      Loading agents...
                    </td>
                  </tr>
                )}

                {!loadingAgents &&
                  filteredAgents.map((ag, idx) => {
                    const isActive = ag._id === selectedAgentId;
                    const count = applicantsCountByAgent[ag._id] || 0;

                    return (
                      <tr
                        key={ag._id}
                        className={
                          isActive ? "bg-blue-50" : "hover:bg-slate-50"
                        }
                      >
                        <td className="px-3 py-2 border-t">{idx + 1}</td>
                        <td className="px-3 py-2 border-t">
                          {ag.name || ag.fullname || "Unnamed"}
                        </td>
                        <td className="px-3 py-2 border-t text-center">
                          {count}
                        </td>
                        <td className="px-3 py-2 border-t text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedAgentId(ag._id)}
                            className={`px-3 py-1 rounded-full text-[11px] border transition ${
                              isActive
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            {isActive ? "Selected" : "Select"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                {!loadingAgents && filteredAgents.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-3 text-center text-slate-500"
                    >
                      No agents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedAgent && (
            <div className="px-4 py-2 border-t bg-slate-50 text-xs">
              Selected Agent:{" "}
              <span className="font-medium">
                {selectedAgent.name || selectedAgent.fullname}
              </span>
            </div>
          )}
        </div>

        {/* ========== APPLICANTS FOR SELECTED AGENT ========== */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Applicants Assigned to Selected Agent
            </h2>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left w-12">SN</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Status / Progress</th>
                </tr>
              </thead>
              <tbody>
                {!selectedAgentId && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-3 text-center text-slate-500"
                    >
                      Select an agent to see assigned applicants.
                    </td>
                  </tr>
                )}

                {selectedAgentId &&
                  assignedApplicants.map((app, idx) => (
                    <tr key={app._id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 border-t">{idx + 1}</td>
                      <td className="px-3 py-2 border-t">
                        {getApplicantDisplayName(app)}
                      </td>
                      <td className="px-3 py-2 border-t">
                        {getApplicantStatus(app)}
                      </td>
                    </tr>
                  ))}

                {selectedAgentId && !assignedApplicants.length && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-3 text-center text-slate-500"
                    >
                      No applicants currently assigned to this agent.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========== ALL APPLICANTS ========== */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search applicant..."
            value={applicantSearch}
            onChange={(e) => setApplicantSearch(e.target.value)}
            className="px-3 py-1.5 border rounded-md text-xs w-56"
          />

          <button
            type="button"
            onClick={() => loadApplicants(true)}
            className="px-3 py-1 rounded-md text-xs bg-slate-800 text-white hover:bg-slate-900"
          >
            Show All
          </button>
        </div>

        <div className="bg-white rounded-lg shadow mb-10">
          <div className="border-b px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              All Applicants
            </h2>

            <button
              type="button"
              onClick={() => loadApplicants(true)}
              className="px-3 py-1 rounded-md text-xs bg-slate-800 text-white hover:bg-slate-900"
            >
              Show All
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-center w-10">
                    <input
                      type="checkbox"
                      onChange={selectAllApplicants}
                      checked={
                        applicants.length > 0 &&
                        selectedApplicantIds.length === applicants.length
                      }
                    />
                  </th>
                  <th className="px-3 py-2 text-left w-12">SN</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Current Agent</th>
                  <th className="px-3 py-2 text-left">Status / Progress</th>
                </tr>
              </thead>
              <tbody>
                {loadingApplicants && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-3 text-center text-slate-500"
                    >
                      Loading applicants...
                    </td>
                  </tr>
                )}

                {!loadingApplicants &&
                  filteredApplicants.map((app, idx) => {
                    const checked = selectedApplicantIds.includes(app._id);
                    const agentId = getAgentIdFromApplicant(app, agents);
                    const agent =
                      agents.find((a) => a._id === agentId) || app.agent;

                    const agentName =
                      (agent && (agent.name || agent.fullname)) ||
                      (typeof agent === "string" ? agent : "—");

                    return (
                      <tr key={app._id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 border-t text-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleApplicantSelection(app._id)}
                          />
                        </td>
                        <td className="px-3 py-2 border-t">{idx + 1}</td>
                        <td className="px-3 py-2 border-t">
                          {getApplicantDisplayName(app)}
                        </td>
                        <td className="px-3 py-2 border-t">{agentName}</td>
                        <td className="px-3 py-2 border-t">
                          {getApplicantStatus(app)}
                        </td>
                      </tr>
                    );
                  })}

                {!loadingApplicants && applicants.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-3 text-center text-slate-500"
                    >
                      No applicants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4">
            <button
              type="button"
              disabled={
                assigning ||
                !selectedAgentId ||
                selectedApplicantIds.length === 0
              }
              onClick={handleAssign}
              className={`w-full py-2 rounded-md text-sm flex items-center justify-center gap-2 border ${
                assigning ||
                !selectedAgentId ||
                selectedApplicantIds.length === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              {assigning ? "Assigning..." : "Assign Selected to Agent"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignApplicants;
