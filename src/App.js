import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Components/Main";
import Login from "./Components/Auth/Login";
import SignUp from "./Components/Auth/SignUp";
import Test from "./Components/Test";

import ProtectedRoute from "./Components/Security/ProtectedRoute";
import EmployeeRoute from "./Components/Employee/EmployeeRoute";
import AdminRoute from "./Components/Admin/AdminRoute";
import SuperAdminRoute from "./Components/SuperAdmin/SuperAdminRoute";

import IamNew from "./Components/Additional/IamNew";
import NotAllowed from "./Components/Additional/NotAllowed";
import NotFound404 from "./Components/Additional/NotFound404";
import Fill from "./Components/Fill";
function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" exact element={<Main />} />
            <Route path="/fill" exact element={<Fill />} />

            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<SignUp />} />

            <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
              <Route path="/user/*" element={<EmployeeRoute />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
              <Route path="/admin/*" element={<AdminRoute />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
              <Route path="/superadmin/*" element={<SuperAdminRoute />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["new"]} />}>
              <Route path="/iamnew/*" element={<IamNew />} />
            </Route>

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
