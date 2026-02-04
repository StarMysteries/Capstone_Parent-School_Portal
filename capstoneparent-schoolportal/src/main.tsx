import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

{/*General Pages */}
import { Announcements } from "./pages/Announcements";
import { ForgotPassword } from "./pages/ForgotPassword";
import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Login";
import { PartnershipAndEvents } from "./pages/PartnershipAndEvents";
import { Register } from "./pages/Register";

{/*General Sub Pages */}
import { ContactUs } from "./pages/sub-pages/ContactUs";
import { History } from "./pages/sub-pages/History";
import { OrginizationalChart } from "./pages/sub-pages/OrginizationalChart";
import { SchoolCalendar } from "./pages/sub-pages/SchoolCalendar";
import { Transparency } from "./pages/sub-pages/Transparency";
import { VisionAndMission } from "./pages/sub-pages/VisionAndMission";

{/*Admin Sub Pages */}
import { AdminView } from "./pages/admin-pages/AdminView";
import { ManageParentVerification } from "./pages/admin-pages/ManageParentVerification";
import { ManageSection } from "./pages/admin-pages/ManageSection";
import { ManageStaffAccounts } from "./pages/admin-pages/ManageStaffAccounts";
import { ManageStudents } from "./pages/admin-pages/ManageStudents";

{/*Teacher Sub Pages */}
import { TeacherView } from "./Pages/teacher-pages/TeacherView";

import { usePageTitle } from "./hooks/usePageTitle";
import "./styles/index.css";


const App = () => {
  usePageTitle();
  
  return (
    <Routes>
      {/*General Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/partnership&events" element={<PartnershipAndEvents />} />

      {/*General Sub Pages */}
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/history" element={<History />} />
      <Route path="/orginizationalchart" element={<OrginizationalChart />} />
      <Route path="/schoolcalendar" element={<SchoolCalendar />} />
      <Route path="/transparency" element={<Transparency />} />
      <Route path="/visionandmission" element={<VisionAndMission />} />

      {/*Admin Sub Pages */}
      <Route path="/adminview" element={<AdminView />} />
      <Route path="/manageparentverification" element={<ManageParentVerification />} />
      <Route path="/managestudents" element={<ManageStudents />} />
      <Route path="/managesections" element={<ManageSection />} />
      <Route path="/managestaffaccounts" element={<ManageStaffAccounts />} />

      {/*Teacher Sub Pages (Some routes are in admin)*/}
      <Route path="/teacherview" element={<TeacherView/>}/>
    </Routes>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
