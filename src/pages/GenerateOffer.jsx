// src/pages/GenerateOffer.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { Plus, Minus, Printer } from "lucide-react";

// plain-text template for saving to DB
const templateText = `{{offercompany.name}}
{{offercompany.address}}
CUI: {{offercompany.cui}}, Reg. No: {{offercompany.traderegno}}
Email: {{offercompany.email}}
Contact: {{offercompany.contact}}

OFERTĂ FERMĂ DE ANGAJARE 

Subscrisa {{offercompany.name}}, cu sediul {{offercompany.address}}, înregistrată în Registrul Comerțului sub nr. {{offercompany.traderegno}},
cod unic de înregistrare {{offercompany.cui}},

aduce la cunoștința Candidatului oferta fermă de angajare a acestuia,
având conținutul și prevederile contractului individual de muncă de mai jos:

1. IDENTIFICAREA PĂRȚILOR

A. Angajator: {{offercompany.name}}, cu sediul {{offercompany.address}},
reprezentată legal de {{offercompany.representative}}, în calitate de Administrator.

B. Angajat: {{offerapplicant.name}}, cetățean {{offerapplicant.citizenship}},
domiciliat la {{offerapplicant.address}}, identificat cu pașaport nr. {{offerapplicant.passport_no}}.

2. LOCUL DE MUNCĂ 
Locul desfășurării activității este {{offercontract.workplace}}.

3. FUNCȚIA 
Funcția ocupată: {{offercontract.position}}.

4. ATRIBUȚII 
Atribuțiile sunt prevăzute în fișa postului

5. DATA ÎNCEPERE 
Activitatea începe imediat după obținerea vizei și sosirea în România.

6. DURATA CONTRACTULUI 
Contractul individual de muncă este pe perioadă nedeterminată.

7. CONCEDIU DE ODIHNĂ 
30 zile lucrătoare pe an.

8. SALARIUL 
Salariu brut: {{offercontract.salary}} USD, plata se face în data de 15th ale lunii următoare.

9. PROGRAM DE LUCRU 
{{offercontract.hours_per_day}} ore pe zi, {{offercontract.days_per_week}} zile pe săptămână.

10. REGULAMENT INTERN 
Regulamentul intern va fi comunicat Angajatului la sosire.

11. PERIOADA DE PROBĂ 
180 zile calendaristice.

12. PREAVIZ 
Termenul de preaviz este de {{offercontract.notice_days}} zile lucrătoare.

Prezenta ofertă este valabilă până la {{offercontract.valid_until}}.

{{offercompany.name}}
Semnătura __________________ 


BINDING EMPLOYMENT OFFER

The undersigned {{offercompany.name}}, headquartered at {{offercompany.address}},
registered with the Trade Registry under no. {{offercompany.traderegno}},
unique registration code {{offercompany.cui}},

informs the Candidate of its binding employment offer, having the content
and provisions of the individual employment contract below:

1. IDENTIFICATION OF THE PARTIES

A. Employer: {{offercompany.name}}, headquartered at {{offercompany.address}},
legally represented by {{offercompany.representative}}, as Administrator.

B. Employee: {{offerapplicant.name}}, citizen of {{offerapplicant.citizenship}},
domiciled at {{offerapplicant.address}}, identified with passport no. {{offerapplicant.passport_no}}.

2. WORKPLACE
The workplace shall be {{offercontract.workplace}}.

3. POSITION
Occupied position: {{offercontract.position}}.

4. DUTIES
The duties are described in the job description.

5. START DATE
The activity starts immediately after obtaining the visa and arrival on Romanian territory.

6. CONTRACT DURATION
The employment contract is of indefinite duration.

7. ANNUAL LEAVE
30 working days per year.

8. SALARY
Gross salary: {{offercontract.salary}} USD, payment is made on the 15th of the following month.

9. WORKING SCHEDULE
{{offercontract.hours_per_day}} hours per day, {{offercontract.days_per_week}} days per week.

10. INTERNAL REGULATIONS
The internal regulations will be communicated to the Employee upon arrival.

11. PROBATION PERIOD
180 calendar days.

12. NOTICE PERIOD
The notice period is {{offercontract.notice_days}} working days.

This offer is valid until {{offercontract.valid_until}}.

{{offerapplicant.name}}
Angajat/Employee:
Signature __________________
`;

const GenerateOffer = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [stampPreview, setStampPreview] = useState(null);
  const [generatedText, setGeneratedText] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    surname: "",
    firstname: "",
    birthplace: "",
    country: "",
    dob: "",
    passportIssue: "",
    passportNo: "",
    address: "",
    jobEnglish: "",
    jobRomanian: "",
    dutyHours: 8,
    daysPerWeek: 5,
    salary: "",
    offerDate: "",
    validUntil: "",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/offers/companies");
        setCompanies(res.data);
      } catch (err) {
        console.error(err);
        alert("Error loading companies");
      }
    };
    fetchCompanies();
  }, []);

  const selectedCompany = useMemo(
    () => companies.find((c) => c._id === selectedCompanyId),
    [companies, selectedCompanyId]
  );

  const fullName = useMemo(
    () => `${form.firstname} ${form.surname}`.trim(),
    [form.firstname, form.surname]
  );

  const resolved = useMemo(() => {
    if (!selectedCompany) return null;
    return {
      companyName: selectedCompany.name,
      companyAddress: selectedCompany.address,
      cui: selectedCompany.cui,
      traderegno: selectedCompany.traderegno,
      email: selectedCompany.email,
      contact: selectedCompany.contact,
      representative: selectedCompany.representative,

      applicantName: fullName,
      applicantCitizenship: form.country,
      applicantAddress: form.address || form.birthplace,
      applicantPassportNo: form.passportNo || form.passportIssue,

      workplace: selectedCompany.address,
      position: form.jobEnglish,
      salary: form.salary,
      hoursPerDay: form.dutyHours,
      daysPerWeek: form.daysPerWeek,
      noticeDays: 30,
      validUntil: form.validUntil || form.offerDate,
    };
  }, [selectedCompany, fullName, form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (field, delta) => {
    setForm((prev) => {
      let val = Number(prev[field] || 0) + delta;
      if (val < 0) val = 0;
      return { ...prev, [field]: val };
    });
  };

  const handleStampChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setStampPreview(url); // only kept in memory
  };

  const buildOfferTextForDb = () => {
    if (!resolved) return "";
    let text = templateText;
    const replacements = {
      "{{offercompany.name}}": resolved.companyName,
      "{{offercompany.address}}": resolved.companyAddress,
      "{{offercompany.cui}}": resolved.cui,
      "{{offercompany.traderegno}}": resolved.traderegno,
      "{{offercompany.email}}": resolved.email,
      "{{offercompany.contact}}": resolved.contact,
      "{{offercompany.representative}}": resolved.representative,

      "{{offerapplicant.name}}": resolved.applicantName,
      "{{offerapplicant.citizenship}}": resolved.applicantCitizenship,
      "{{offerapplicant.address}}": resolved.applicantAddress,
      "{{offerapplicant.passport_no}}": resolved.applicantPassportNo,

      "{{offercontract.workplace}}": resolved.workplace,
      "{{offercontract.position}}": resolved.position,
      "{{offercontract.salary}}": resolved.salary,
      "{{offercontract.hours_per_day}}": String(resolved.hoursPerDay),
      "{{offercontract.days_per_week}}": String(resolved.daysPerWeek),
      "{{offercontract.notice_days}}": String(resolved.noticeDays),
      "{{offercontract.valid_until}}": resolved.validUntil,
    };

    Object.entries(replacements).forEach(([key, value]) => {
      text = text.split(key).join(value || "");
    });

    return text;
  };

  const handleGenerateAndSave = async () => {
    if (!resolved) {
      alert("Select a company first.");
      return;
    }

    const text = buildOfferTextForDb();
    if (!text) return;

    setGeneratedText(text);

    try {
      setSaving(true);
      await api.post("/offers", {
        company: selectedCompany._id,
        ...form,
        offerText: text,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    if (!generatedText) {
      alert("Generate the offer first.");
      return;
    }
    window.print();
  };

  return (
    <>
      {/* PRINT & PREVIEW STYLES */}
      <style>
        {`
        @media print {
          body {
            background: #fff !important;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            width: 210mm;
            margin: 0 auto;
            padding: 20mm 20mm;
            background: white;
            font-size: 11pt;
            line-height: 1.4;
          }
          .offer-header {
            margin-bottom: 10mm;
          }
          .offer-table {
            width: 100%;
            border-collapse: collapse;
          }
          .offer-table td {
            width: 50%;
            border: 1px solid #000;
            vertical-align: top;
            padding: 6pt 8pt;
          }
          .offer-title {
            font-weight: 700;
            text-align: center;
            text-transform: uppercase;
            margin-bottom: 6pt;
          }
          .offer-section-title {
            font-weight: 700;
          }
          .signature-block {
            margin-top: 16pt;
            position: relative;
            page-break-inside: avoid;
          }
          .signature-label {
            margin-top: 4pt;
          }
          .stamp-on-sign {
            position: absolute;
            left: 0;       /* Romanian side */
            bottom: 0;
            width: 120px;
            opacity: 0.85;
            transform: translate(10px, -20px); /* fine tune */
          }
        }

        /* Screen preview */
        .print-page {
          width: 210mm;
          margin: 20px auto;
          padding: 20mm 20mm;
          background: white;
          font-size: 11pt;
          line-height: 1.4;
          box-shadow: 0 0 10px rgba(0,0,0,0.15);
        }
        .offer-header {
          margin-bottom: 10mm;
        }
        .offer-table {
          width: 100%;
          border-collapse: collapse;
        }
        .offer-table td {
          width: 50%;
          border: 1px solid #000;
          vertical-align: top;
          padding: 6pt 8pt;
        }
        .offer-title {
          font-weight: 700;
          text-align: center;
          text-transform: uppercase;
          margin-bottom: 6pt;
        }
        .offer-section-title {
          font-weight: 700;
        }
        .signature-block {
          margin-top: 16pt;
          position: relative;
        }
        .signature-label {
          margin-top: 4pt;
        }
        .stamp-on-sign {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 120px;
          opacity: 0.85;
          transform: translate(10px, -20px);
        }
        `}
      </style>

      <div className="min-h-screen bg-slate-100">
        {/* UI SECTION (hidden on print) */}
        <div className="no-print">
          <TopStrip />
          <SecondStrip />

          <div className="max-w-6xl mx-auto py-6 px-4">
            <h1 className="text-2xl font-semibold mb-4">Generate Offer</h1>

            {/* Company selection */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="font-semibold mb-3 text-sm">Select Company</h2>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">-- Choose company --</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {resolved && (
                <div className="mt-4 text-xs text-slate-600 space-y-1">
                  <div><strong>Address:</strong> {resolved.companyAddress}</div>
                  <div><strong>CUI:</strong> {resolved.cui}</div>
                  <div><strong>Trade Reg No:</strong> {resolved.traderegno}</div>
                  <div><strong>Email:</strong> {resolved.email}</div>
                  <div><strong>Contact:</strong> {resolved.contact}</div>
                  <div><strong>Director:</strong> {resolved.representative}</div>
                </div>
              )}
            </div>

            {/* Applicant details */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="font-semibold mb-3 text-sm">Applicant Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <input
                  name="surname"
                  value={form.surname}
                  onChange={handleChange}
                  placeholder="Surname"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  placeholder="First name eg. Ram Bahadur"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="birthplace"
                  value={form.birthplace}
                  onChange={handleChange}
                  placeholder="Birth place eg.kathmandu, Nepal"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country / Citizenship"
                  className="border rounded-md px-3 py-2"
                />
                
                <input
                  name="passportNo"
                  value={form.passportNo}
                  onChange={handleChange}
                  placeholder="Passport Number"
                  className="border rounded-md px-3 py-2"
                />
                
              </div>
            </div>

            {/* Job details */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="font-semibold mb-3 text-sm">Job & Contract Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <input
                  name="jobEnglish"
                  value={form.jobEnglish}
                  onChange={handleChange}
                  placeholder="Job (English)"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="jobRomanian"
                  value={form.jobRomanian}
                  onChange={handleChange}
                  placeholder="Job (Romanian)"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="Salary (USD)"
                  className="border rounded-md px-3 py-2"
                />

                <div className="flex items-center border rounded-md px-3 py-2">
                  <span className="mr-2 text-xs">Duty Hours / day</span>
                  <button
                    type="button"
                    onClick={() => handleNumberChange("dutyHours", -1)}
                    className="p-1 rounded border mr-1"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2">{form.dutyHours}</span>
                  <button
                    type="button"
                    onClick={() => handleNumberChange("dutyHours", 1)}
                    className="p-1 rounded border ml-1"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center border rounded-md px-3 py-2">
                  <span className="mr-2 text-xs">Days / week</span>
                  <button
                    type="button"
                    onClick={() => handleNumberChange("daysPerWeek", -1)}
                    className="p-1 rounded border mr-1"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2">{form.daysPerWeek}</span>
                  <button
                    type="button"
                    onClick={() => handleNumberChange("daysPerWeek", 1)}
                    className="p-1 rounded border ml-1"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <input
                  name="offerDate"
                  value={form.offerDate}
                  onChange={handleChange}
                  placeholder="Offer Date (text)"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="validUntil"
                  value={form.validUntil}
                  onChange={handleChange}
                  placeholder="Offer valid until (text)"
                  className="border rounded-md px-3 py-2"
                />
              </div>
            </div>

            {/* Stamp uploader */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="font-semibold mb-3 text-sm">Upload Company Stamp (optional)</h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleStampChange}
                className="text-sm"
              />
              {stampPreview && (
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-1">
                    Preview (will appear on Romanian signature).
                  </p>
                  <img
                    src={stampPreview}
                    alt="Company Stamp"
                    className="h-20 object-contain border rounded bg-white"
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={handleGenerateAndSave}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {saving ? "Generating..." : "Generate Offer"}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                disabled={!generatedText}
                className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm bg-white"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* PRINT LAYOUT – single container, browser auto-splits pages */}
        {resolved && generatedText && (
          <div className="print-page">
            {/* Header */}
            <div className="offer-header">
              <div>{resolved.companyName}</div>
              <div>{resolved.companyAddress}</div>
              <div>
                CUI: {resolved.cui}, Reg. No: {resolved.traderegno}
              </div>
              <div>Email: {resolved.email}</div>
              <div>Contact: {resolved.contact}</div>
            </div>

            {/* First table (sections 1–4) */}
            <table className="offer-table">
              <tbody>
                <tr>
                  <td>
                    <div className="offer-title">OFERTĂ FERMĂ DE ANGAJARE</div>

                    <p>
                      Subscrisa <b>{resolved.companyName}</b>, cu sediul{" "}
                      {resolved.companyAddress}, înregistrată în Registrul
                      Comerțului sub nr. {resolved.traderegno}, cod unic de
                      înregistrare {resolved.cui},
                    </p>
                    <p>
                      aduce la cunoștința Candidatului oferta fermă de angajare
                      a acestuia, având conținutul și prevederile contractului
                      individual de muncă de mai jos:
                    </p>

                    <p className="offer-section-title">
                      1. IDENTIFICAREA PĂRȚILOR
                    </p>
                    <p>
                      A. Angajator: <b>{resolved.companyName}</b>, cu sediul{" "}
                      {resolved.companyAddress}, reprezentată legal de{" "}
                      {resolved.representative}, în calitate de Administrator.
                    </p>
                    <p>
                      B. Angajat: <b>{resolved.applicantName}</b>, cetățean{" "}
                      {resolved.applicantCitizenship}, domiciliat la{" "}
                      {resolved.applicantAddress}, identificat cu pașaport nr.{" "}
                      <b>{resolved.applicantPassportNo}</b>.
                    </p>

                    <p className="offer-section-title">2. LOCUL DE MUNCĂ</p>
                    <p>Locul desfășurării activității este {resolved.workplace}.</p>

                    <p className="offer-section-title">3. FUNCȚIA</p>
                    <p>Funcția ocupată: <b>{resolved.position}</b>.</p>

                    <p className="offer-section-title">4. ATRIBUȚII</p>
                    <p>Atribuțiile sunt prevăzute în fișa postului.</p>
                  </td>

                  <td>
                    <div className="offer-title">BINDING EMPLOYMENT OFFER</div>

                    <p>
                      The undersigned <b>{resolved.companyName}</b>, headquartered at{" "}
                      {resolved.companyAddress}, registered with the Trade
                      Registry under no. {resolved.traderegno}, unique
                      registration code {resolved.cui},
                    </p>
                    <p>
                      informs the Candidate of its binding employment offer,
                      having the content and provisions of the individual
                      employment contract below:
                    </p>

                    <p className="offer-section-title">
                      1. IDENTIFICATION OF THE PARTIES
                    </p>
                    <p>
                      A. Employer: <b>{resolved.companyName}</b>, headquartered at{" "}
                      {resolved.companyAddress}, legally represented by{" "}
                      {resolved.representative}, as Administrator.
                    </p>
                    <p>
                      B. Employee: <b>{resolved.applicantName}</b>, citizen of{" "}
                      {resolved.applicantCitizenship}, domiciled at{" "}
                      {resolved.applicantAddress}, identified with passport no.{" "}
                      <b>{resolved.applicantPassportNo}</b>.
                    </p>

                    <p className="offer-section-title">2. WORKPLACE</p>
                    <p>The workplace shall be {resolved.workplace}.</p>

                    <p className="offer-section-title">3. POSITION</p>
                    <p>Occupied position: <b>{resolved.position}</b>.</p>

                    <p className="offer-section-title">4. DUTIES</p>
                    <p>The duties are described in the job description.</p>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Second table (sections 5–12 + signatures) */}
            <table className="offer-table" style={{ marginTop: "12pt" }}>
              <tbody>
                <tr>
                  <td>
                    <p className="offer-section-title">5. DATA ÎNCEPERE</p>
                    <p>
                      Activitatea începe imediat după obținerea vizei și
                      sosirea în România.
                    </p>

                    <p className="offer-section-title">
                      6. DURATA CONTRACTULUI
                    </p>
                    <p>
                      Contractul individual de muncă este pe perioadă
                      nedeterminată.
                    </p>

                    <p className="offer-section-title">
                      7. CONCEDIU DE ODIHNĂ
                    </p>
                    <p> Durata concediului de odihnă este de 20 de zile lucrătoare.</p>

                    <p className="offer-section-title">8. SALARIUL</p>
                    <p>
                      Salariu brut: <b>{resolved.salary} </b>USD, plata se face în
                      data de 15th ale lunii următoare.
                    </p>

                    <p className="offer-section-title">
                      9. PROGRAM DE LUCRU
                    </p>
                    <p>
                      {resolved.hoursPerDay} ore pe zi, {resolved.daysPerWeek}{" "}
                      zile pe săptămână.
                    </p>

                    <p className="offer-section-title">
                      10. REGULAMENT INTERN
                    </p>
                    <p>
                      Regulamentul intern va fi comunicat Angajatului la
                      sosire.
                    </p>

                    <p className="offer-section-title">
                      11. PERIOADA DE PROBĂ
                    </p>
                    <p>180 zile calendaristice.</p>

                    <p className="offer-section-title">12. PREAVIZ</p>
                    <p>
                      Termenul de preaviz este de {resolved.noticeDays} zile
                      lucrătoare.
                    </p>

                    <p>
                      Prezenta ofertă este valabilă până la{" "}
                      {resolved.validUntil}.
                    </p>

                    <div className="signature-block">
                      <div>{resolved.companyName}</div>
                      <div className="signature-label">
                        Semnătura __________________
                      </div>

                      {/* STAMP ON ROMANIAN SIGNATURE */}
                      {stampPreview && (
                        <img
                          src={stampPreview}
                          alt="Stamp"
                          className="stamp-on-sign"
                        />
                      )}
                    </div>
                  </td>

                  <td>
                    <p className="offer-section-title">5. START DATE</p>
                    <p>
                      The activity starts immediately after obtaining the visa
                      and arrival on Romanian territory.
                    </p>

                    <p className="offer-section-title">
                      6. CONTRACT DURATION
                    </p>
                    <p>
                      The employment contract is of indefinite duration.
                    </p>

                    <p className="offer-section-title">7. REST LEAVE</p>
                    <p>  The term of the rest leave is 20 working days.</p>

                    <p className="offer-section-title">8. SALARY</p>
                    <p>
                      Gross salary: <b>{resolved.salary} </b>USD, payment is made on
                      the 15th of the following month.
                    </p>

                    <p className="offer-section-title">
                      9. WORKING SCHEDULE
                    </p>
                    <p>
                      {resolved.hoursPerDay} hours per day,{" "}
                      {resolved.daysPerWeek} days per week.
                    </p>

                    <p className="offer-section-title">
                      10. INTERNAL REGULATIONS
                    </p>
                    <p>
                      The internal regulations will be communicated to the
                      Employee upon arrival.
                    </p>

                    <p className="offer-section-title">
                      11. PROBATION PERIOD
                    </p>
                    <p>180 calendar days.</p>

                    <p className="offer-section-title">12. NOTICE PERIOD</p>
                    <p>
                      The notice period is {resolved.noticeDays} working days.
                    </p>

                    <p>This offer is valid until {resolved.validUntil}.</p>

                    <div className="signature-block">
                      <div>{resolved.applicantName}</div>
                      <div className="signature-label">Angajat/Employee:</div>
                      <div className="signature-label">
                        Signature __________________
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default GenerateOffer;
