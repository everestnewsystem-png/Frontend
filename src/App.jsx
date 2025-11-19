import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/Login";
import Protected from "./components/auth/Protected";
import AdminOnly from "./components/auth/AdminOnly";

// Main Pages
import HomePage from "./pages/HomePage";

// Country
import Countries from "./pages/Countries";
import AddCountry from "./pages/AddCountry";
import EditCountry from "./pages/EditCountry";
import ViewCountry from "./pages/ViewCountry";

// Agents
import Agents from "./pages/Agents";
import AddAgent from "./pages/AddAgent";
import EditAgent from "./pages/EditAgent";
import ViewAgent from "./pages/ViewAgent";

// Applicants
import Applicants from "./pages/Applicants";
import AddApplicant from "./pages/AddApplicant";
import EditApplicant from "./pages/EditApplicant";
import ViewApplicant from "./pages/ViewApplicant";

// Other Core pages
import Passport from "./pages/Passport";
import Police from "./pages/Police";
import Tasks from "./pages/Tasks";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import UserSetup from "./pages/UserSetup";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";

// Admin Task Setup Pages
import TaskSetup from "./pages/TaskSetup";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";

// Payments
import Payments from "./pages/Payments";
import AddPayment from "./pages/AddPayment";
import EditPayment from "./pages/EditPayment";
import ViewPayment from "./pages/ViewPayment";

// Tools
import Tools from "./pages/Tools";
import SearchTool from "./pages/SearchTool";
import ProgressChangeTool from "./pages/ProgressChangeTool";
import AppointmentSetTool from "./pages/AppointmentSetTool";
import PrintTool from "./pages/PrintTool";
import SearchPermits from "./pages/search-permits";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Login />} />

        {/* PROTECTED ROUTES (User must be logged in) */}
        <Route element={<Protected />}>
          <Route path="/" element={<HomePage />} />
          {/* Home */}
          <Route path="/home" element={<HomePage />} />

          {/* Countries */}
          <Route path="/countries" element={<Countries />} />
          <Route path="/add-country" element={<AddCountry />} />
          <Route path="/edit-country/:id" element={<EditCountry />} />
          <Route path="/view-country/:id" element={<ViewCountry />} />

          {/* Agents */}
          <Route path="/agents" element={<Agents />} />
          <Route path="/add-agent" element={<AddAgent />} />
          <Route path="/edit-agent/:id" element={<EditAgent />} />
          <Route path="/view-agent/:id" element={<ViewAgent />} />

          {/* Applicants */}
          <Route path="/applicants" element={<Applicants />} />
          <Route path="/add-applicant" element={<AddApplicant />} />
          <Route path="/edit-applicant/:id" element={<EditApplicant />} />
          <Route path="/view-applicant/:id" element={<ViewApplicant />} />

          {/* Passport / Police / Tasks */}
          <Route path="/passport" element={<Passport />} />
          <Route path="/police" element={<Police />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/search-tool" element={<SearchTool />} />
          {/* ADMIN ONLY ROUTES */}
          <Route element={<AdminOnly />}>
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* User Setup */}
            <Route path="/users" element={<UserSetup />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/edit-user/:id" element={<EditUser />} />

            {/* Task Setup */}
            <Route path="/task-setup" element={<TaskSetup />} />
            <Route path="/add-task" element={<AddTask />} />
            <Route path="/edit-task/:id" element={<EditTask />} />

            {/* Payments */}
            <Route path="/payments" element={<Payments />} />
            <Route path="/add-payment" element={<AddPayment />} />
            <Route path="/edit-payment/:id" element={<EditPayment />} />
            <Route path="/view-payment/:id" element={<ViewPayment />} />

            {/* Tools */}

            <Route
              path="/progress-change-tool"
              element={<ProgressChangeTool />}
            />
            <Route
              path="/appointment-set-tool"
              element={<AppointmentSetTool />}
            />
            <Route path="/print-tool" element={<PrintTool />} />
            <Route path="/search-permits" element={<SearchPermits />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
