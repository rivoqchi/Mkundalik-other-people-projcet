import { Route, Routes } from 'react-router-dom';
import NotFound404 from '../Additional/NotFound404';
import Dashboard from './Dashboard';
import Employee from '../Redirects/Employee';
import Profile from '../Admin/Profile';
import ScheduleNew from '../Admin/ScheduleNew';
import ScheduleHistory from '../Admin/ScheduleHistory';
import Aside from './Aside';
import LookSchedule from '../Admin/LookSchedule';
function EmployeeRoute() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3 p-0">
          <Aside />
        </div>
        <div className=" col-12 col-md-9">
          <div className="p-3">
            <Routes>
              <Route path="/" exact element={<Employee />} />
              <Route path="/profile" exact element={<Profile />} />
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/schedule/new" exact element={<ScheduleNew />} />
              <Route path="/schedule/history" exact element={<ScheduleHistory />} />
              <Route path="/archive/schedule/:id" exact element={<LookSchedule />} />
              <Route path="/*" exact element={<NotFound404 />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeRoute;