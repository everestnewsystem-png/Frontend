import { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import ApplicantTable from "../components/tables/applicant-table";

const ViewCountry = () => {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    api.get(`/countries/${id}`).then((res) => setCountry(res.data));
    api.get(`/applicants/country/${id}`).then((res) => setApplicants(res.data));
  }, [id]);

  return (
    <div>
      <TopStrip />
      <SecondStrip />

      <div className="p-5">
        <h1 className="text-2xl mb-4 text-gray-700">
          Country: {country?.countryName}
        </h1>

        <h2 className="text-lg mb-2 text-gray-600">Applicants</h2>

        <ApplicantTable data={applicants} onDelete={() => {}} />
      </div>
    </div>
  );
};

export default ViewCountry;
