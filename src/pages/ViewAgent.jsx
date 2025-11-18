import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import ApplicantTable from "../components/tables/applicant-table";

const ViewAgent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    // Load agent info
    api.get(`/agents/${id}`).then((res) => {
      console.log("AGENT RES ---->", res.data);
      setAgent(res.data);
    });

    // Load assigned applicants
    api.get(`/applicants/agent/${id}`).then((res) => {
      setApplicants(Array.isArray(res.data) ? res.data : []);
    });
  }, [id]);

  if (!agent) return null;

  return (
    <div>
      <TopStrip />
      <SecondStrip />

      <div className="p-5 max-w-4xl mx-auto">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-semibold">
            Agent: {agent.name || agent.agent?.name}
          </h1>

          <button
            onClick={() => navigate(`/edit-agent/${agent._id || agent.agent?._id}`)}
            className="px-4 py-2 bg-gray-800 text-white rounded"
          >
            Edit Agent
          </button>
        </div>

        <h2 className="text-lg font-semibold mt-4 mb-2">
          Applicants Assigned ({applicants.length})
        </h2>

        <ApplicantTable data={applicants} onDelete={() => {}} />
      </div>
    </div>
  );
};

export default ViewAgent;
