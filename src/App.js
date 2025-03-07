import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import LookSchedule from "./Components/Admin/LookSchedule";
import AllowNotification from "./Components/Additional/AllowNotification";
import XatolikXabar from "./Components/XatolikXabar";
import IamNew from "./Components/Additional/IamNew";
import NotAllowed from "./Components/Additional/NotAllowed";
import NotFound404 from "./Components/Additional/NotFound404";
import Fill from "./Components/Fill";
import LinkTelegram from "./Components/Auth/LinkTelegram";
import LoginWithTelegram from "./Components/Auth/LoginWithTelegram";
import AllUsers from './Components/SuperAdmin/AllUsers';
import Sorry from "./Components/Additional/Sorry";
function App() {
  return (
    <>
      <div>
        <Router>
          <XatolikXabar/>
          {/* <Sorry/> */}
          {/* <AllowNotification/> */}
          <Routes>
            <Route path="/" exact element={<Main />} />
            <Route path="/fill" exact element={<Fill />} />

            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<SignUp />} />

            <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
              <Route path="/user/*" element={<EmployeeRoute />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
              <Route path="/staff/*" element={<StaffRoute />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin", "department"]} />}>
              <Route path="/admin/*" element={<AdminRoute />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["superadmin", "complex", "department", "superadmin"]} />}>
              <Route path="/department/*" element={<DepartmentRoute />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["complex", "hr", "superadmin"]} />}>
              <Route path="/complex/*" element={<ComplexRoute />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["commission", "superadmin"]} />}>
              <Route path="/commission/*" element={<KomissiyaRoute />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["boss", "superadmin"]} />}>
              <Route path="/boss/*" element={<BossRoute />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["hr", "superadmin"]} />}>
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
        </Router>
      </div>
    </>
  );
}

export default App;
