import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Announcements } from "./pages/Announcements";
import { ForgotPassword } from "./pages/ForgotPassword";
import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Login";
import { PartnershipAndEvents } from "./pages/PartnershipAndEvents";
import { Register } from "./pages/Register";

import { ContactUs } from "./pages/sub-pages/ContactUs";
import { History } from "./pages/sub-pages/History";
import { OrginizationalChart } from "./pages/sub-pages/OrginizationalChart";
import { SchoolCalendar } from "./pages/sub-pages/SchoolCalendar";
import { Transparency } from "./pages/sub-pages/Transparency";
import { VisionAndMission } from "./pages/sub-pages/VisionAndMission";
import { ManageSection } from "./pages/admin-pages/ManageSection";

import { usePageTitle } from "./hooks/usePageTitle";
import "./styles/index.css";

const App = () => {
  usePageTitle();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/partnership&events" element={<PartnershipAndEvents />} />

      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/history" element={<History />} />
      <Route path="/orginizationalchart" element={<OrginizationalChart />} />
      <Route path="/schoolcalendar" element={<SchoolCalendar />} />
      <Route path="/transparency" element={<Transparency />} />
      <Route path="/visionandmission" element={<VisionAndMission />} />

      <Route path="/managesections" element={<ManageSection />} />
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
