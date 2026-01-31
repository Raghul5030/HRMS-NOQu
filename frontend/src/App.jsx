import "./App.css";
import { Routes, Route } from "react-router-dom";

/* AUTH */
import { LoginPage } from "./auth/AdminLogin.jsx";
import { EnterEmailPage } from "./auth/email.jsx";
import { EmailVerificationPage } from "./auth/emialVerification.jsx";
import { ForgetPassword } from "./auth/ForgetPassword.jsx";
import Itsupportdashboard from "./layout/ITsupportDashboard.jsx";



/* LAYOUT */
import AdminLayout from "./layout/AdminLayout.jsx";
import PrivateRoute from "./layout/Private.jsx";

/* PAGES */
import { Dashboard } from "./pages/dashboard/dashboard.jsx";
import { Onboarding } from "./pages/onboarding/onboarding.jsx";
import { Employees } from "./pages/employe/employe.jsx";
import { Documents } from "./pages/documents/documents.jsx";
import { Asset } from "./pages/assets-page/assets.jsx";
import { Interview } from "./pages/interview/intervies.jsx";
import Unauthorized from "./pages/unauthorized/Unauthorized.jsx";

/* PUBLIC INTERVIEW */
import { InterviewForm } from "./pages/interview_form/interview_form.jsx";
import { InterviewSuccess } from "./pages/interview_form/interviewFormSccess.jsx";

/* ROLE CONSTANTS */
const HR = "hr";
const EMPLOYEE = "employee";
const IT_SUPPORT = "it_support";

function App() {
  return (
    <Routes>
      {/* -------- PUBLIC ROUTES -------- */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/Email" element={<EnterEmailPage />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route path="/verification" element={<EmailVerificationPage />} />
      <Route path="/interviewForm" element={<InterviewForm />} />
      <Route path="/interview-success" element={<InterviewSuccess />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/it-dashboard" element={<Itsupportdashboard />} />

      {/* -------- ALL LOGGED-IN USERS -------- */}
      <Route
        element={<PrivateRoute allowedRoles={[HR, EMPLOYEE, IT_SUPPORT]} />}
      >
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/asset" element={<Asset />} />
        </Route>
      </Route>

      {/* -------- HR ONLY -------- */}
      <Route element={<PrivateRoute allowedRoles={[HR]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/interview" element={<Interview />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/documents" element={<Documents />} />
        </Route>
      </Route>

      {/* -------- EMPLOYEE ONLY -------- */}
      <Route element={<PrivateRoute allowedRoles={[EMPLOYEE]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/employees" element={<Employees />} />
        </Route>
      </Route>
    </Routes>

  );
}

export default App;
