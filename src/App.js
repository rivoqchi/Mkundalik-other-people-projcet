import axios from "axios";
import { API } from "./config";


import "./App.scss";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Main from "./Components/Main";
import Login from "./Components/Auth/Login";
import SignUp from "./Components/Auth/SignUp";
import Test from "./Components/Test";
import ProtectedRoute from "./Components/Security/ProtectedRoute";
import EmployeeRoute from "./Components/Employee/EmployeeRoute";
import AdminRoute from "./Components/Admin/AdminRoute";
import KomissiyaRoute from "./Components/Komissiya/KomissiyaRoute";
import SuperAdminRoute from "./Components/SuperAdmin/SuperAdminRoute";
import ComplexRoute from "./Components/Complex/ComplexRoute";
import BossRoute from "./Components/Boss/BossRoute";
import DepartmentRoute from "./Components/Department/DepartmentRoute";
import StaffRoute from "./Components/Staff/StaffRoute";
import HrRoute from "./Components/Hr/HrRoute";
import LangRoute from "./Components/Lang/LangRoute";
import LookSchedule from "./Components/Admin/LookSchedule";
import AllowNotification from "./Components/Additional/AllowNotification";
import ScrollToTop from "./Components/Additional/ScrollToTop";
import LoginAgainAlert from "./Components/LoginAgainAlert";
import XatolikXabar from "./Components/XatolikXabar";
import IamNew from "./Components/Additional/IamNew";
import NotAllowed from "./Components/Additional/NotAllowed";
import NotFound404 from "./Components/Additional/NotFound404";
import Fill from "./Components/Fill";
import ClearCache from "./Components/Additional/ClearCache";
import LinkTelegram from "./Components/Auth/LinkTelegram";
import LoginWithTelegram from "./Components/Auth/LoginWithTelegram";
import AllUsers from './Components/SuperAdmin/AllUsers';
import Sorry from "./Components/Additional/Sorry";
import LangSelect from "./Components/LangSelect";
import SportRoute from "./Components/Sport/SportRoute";
import ATRoute from "./Components/AT/ATRoute";
import "./i18n";
import { useTranslation } from "react-i18next";
import CtrlEnter from './Components/CtrlEnter';
import UmumiyStat from "./Components/Infos/UmumiyStat";
import CheckIsTest from "./Components/CheckIsTest";
import Info from "./Components/Infos/Info";
import Jahongir from "./Components/Infos/Bios/Jahongir";
import Feruz from "./Components/Infos/Bios/Feruz";
import Behruz from "./Components/Infos/Bios/Behruz";
import CheckBD from "./Components/CheckBD";
import Snowing from "./Components/Snowing";
import CelebrationModal from "./Components/Celebration";
import { LoadingProvider } from "./Components/Additional/LoadingScreen";
import { ThemeProvider, useTheme } from "./Components/Additional/ThemeContext";
import { Toaster } from "sonner";
import Inactive from "./Components/Auth/Inactive";
import { HelmetProvider, Helmet } from "react-helmet-async";


import { signout } from "./Components/Auth/CheckAuth";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session expired or revoked
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/logina') {
        signout(() => {
          window.location.replace("/login");
        });
      }
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LoadingProvider>
          <Router>
            <ScrollToTop />
            <DynamicSEO />
            <AppContent />
          </Router>
        </LoadingProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

function DynamicSEO() {
  const location = useLocation();

  // Route based SEO logic
  const getSEO = () => {
    const path = location.pathname;
    if (path === "/") return { title: "mkundalik.uz - Asosiy sahifa", desc: "Toshkent Metropoliteni xodimlarining ish faoliyatini raqamlashtirish tizimi." };
    if (path === "/about") return { title: "Dastur haqida - mkundalik.uz", desc: "mkundalik loyihasi va uning imkoniyatlari haqida ma'lumotlar." };
    if (path === "/about/behruz") return { title: "Abdurakhimov Behruz - Full-stack dasturchi | mkundalik.uz", desc: "Toshkent Metropoliteni DUK axborot xavfsizligini ta'minlash va axborot kommunikatsiya texnologiyalarini rivojlantirish xizmati bosh mutaxassisi, Full-stack dasturchi. mkundalik tizimi dasturchisi." };
    if (path === "/about/jahongir") return { title: "Usmanov Raxmonbek - Toshkent metropoliteni boshlig'i | mkundalik.uz", desc: "Usmanov Raxmonbek Djaxongirovich - Toshkent metropoliteni DUK boshlig'i, loyiha homiysi." };
    if (path === "/about/feruz") return { title: "Toshpo`latov Feruz - Loyiha rahbari | mkundalik.uz", desc: "Toshpo`latov Feruz G'. - mkundalik loyihasi rahbari, texnik nazorat mutaxassisi." };
    if (path === "/user/schedule/new") return { title: "Yangi hisobot", desc: "Yozilgan hisobot toifasiga ko`ra sun'iy intellekt orqali baho taklif qilinadi, bahoni esa rahbar belgilaydi." };
    if (path.includes("/user")) return { title: "Xodim profili - mkundalik.uz", desc: "Toshkent Metropoliteni xodimi shaxsiy ish sahifasi va ko'rsatkichlari." };
    return { title: "mkundalik.uz", desc: "Ish faoliyatini boshqarish tizimi" };
  };

  const { title, desc } = getSEO();

  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={`app-wrapper ${theme}-mode`}>
      <Toaster position="bottom-right" richColors closeButton />
      <CheckBD />
        <CheckIsTest />
        <CtrlEnter />
        <XatolikXabar />
        <Snowing />
        <LoginAgainAlert />
        <Routes>
          <Route path="/" exact element={<Main />} />
          <Route path="/fill" exact element={<Fill />} />
          <Route path="/statistika" exact element={<UmumiyStat />} />
          <Route path="/about" exact element={<Info />} />
          <Route path="/about/jahongir" exact element={<Jahongir />} />
          <Route path="/about/feruz" exact element={<Feruz />} />
          <Route path="/about/behruz" exact element={<Behruz />} />
          <Route path="/inactive" exact element={<Inactive />} />
          <Route path="/clear" exact element={<ClearCache />} />

          <Route path="/login" exact element={<Login />} />
          <Route path="/logina" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />

          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
            <Route path="/user/*" element={<EmployeeRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
            <Route path="/staff/*" element={<StaffRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
            <Route path="/admin/*" element={<AdminRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["department"]} />}>
            <Route path="/department/*" element={<DepartmentRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["complex"]} />}>
            <Route path="/complex/*" element={<ComplexRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["sport"]} />}>
            <Route path="/sport/*" element={<SportRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["lang"]} />}>
            <Route path="/lang/*" element={<LangRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["at"]} />}>
            <Route path="/at/*" element={<ATRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["commission"]} />}>
            <Route path="/commission/*" element={<KomissiyaRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["boss"]} />}>
            <Route path="/boss/*" element={<BossRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["hr"]} />}>
            <Route path="/hr/*" element={<HrRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
            <Route path="/superadmin/*" element={<SuperAdminRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["new"]} />}>
            <Route path="/iamnew/*" element={<IamNew />} />
          </Route>

          <Route path="documents/archive/schedule/:id" exact element={<LookSchedule />} />
          <Route path="/statistics/nfjkengkfjrnejknbfjkbeskhjfb" exact element={<AllUsers />} />

          <Route path="/tg" exact element={<LoginWithTelegram />} />
          <Route path="/tglink" exact element={<LinkTelegram />} />
          <Route path="/test" exact element={<Test />} />
          <Route path="/not-allowed" exact element={<NotAllowed />} />
          <Route path="/*" exact element={<NotFound404 />} />
        </Routes>
    </div>
  );
}


export default App;