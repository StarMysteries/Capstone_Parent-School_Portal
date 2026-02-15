import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

{/*General Pages */}
import { Announcements } from "./Pages/Announcements";
import { ForgotPassword } from "./Pages/ForgotPassword";
import { HomePage } from "./Pages/HomePage";
import { Login } from "./Pages/Login";
import { PartnershipAndEvents } from "./Pages/PartnershipAndEvents";
import { Register } from "./Pages/Register";

{/*General Sub Pages */}
import { ContactUs } from "./Pages/sub-pages/ContactUs";
import { History } from "./Pages/sub-pages/History";
import { OrginizationalChart } from "./Pages/sub-pages/OrginizationalChart";
import { SchoolCalendar } from "./Pages/sub-pages/SchoolCalendar";
import { Transparency } from "./Pages/sub-pages/Transparency";
import { VisionAndMission } from "./Pages/sub-pages/VisionAndMission";

{/*Admin Sub Pages */}
import { AdminView } from "./Pages/admin-pages/AdminView";
import { ManageParentVerification } from "./Pages/admin-pages/ManageParentVerification";
import { ManageSection } from "./Pages/admin-pages/ManageSection";
import { ManageStaffAccounts } from "./Pages/admin-pages/ManageStaffAccounts";
import { ManageStudents } from "./Pages/admin-pages/ManageStudents";

{/*Teacher Sub Pages */}
import { TeacherView } from "./Pages/teacher-pages/TeacherView";
import { ClassList } from "./Pages/teacher-pages/ClassList";

{/*Staff Sub Pages */}
import { StaffView } from "./Pages/staff-pages/StaffView";
import { GeneralAnnouncement } from "./Pages/staff-pages/announcement-pages/GeneralAnnouncement";
import { StaffAnnouncement } from "./Pages/staff-pages/announcement-pages/StaffAnnouncement";
import { MemorandumAnnouncement } from "./Pages/staff-pages/announcement-pages/MemorandumAnnouncemnt";

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
      <Route path="/classlist" element={<ClassList/>}/>

      {/*Staff Sub Pages */}
      <Route path="/staffview" element={<StaffView/>}/>
      <Route path="/generalannouncement" element={<GeneralAnnouncement/>}/>
      <Route path="/staffannouncement" element={<StaffAnnouncement/>}/>
      <Route path="/memorandumannouncement" element={<MemorandumAnnouncement/>}/>
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
