import { Route, Routes } from 'react-router-dom';
import NotFound404 from '../Additional/NotFound404';
import Dashboard from './Dashboard';
import Complex from '../Redirects/Complex';
import Profile from '../Admin/Profile';
import FilterNewUsers from '../Admin/FilterNewUsers';
import Confirm from '../Admin/Confirm';
import AddNewUser from '../Admin/AddNewUser';
import Sections from '../Admin/Sections';
import NewSection from '../Admin/NewSection';
import EditSection from '../Admin/EditSection';
import Aside from './Aside';
import ScheduleNew from '../Admin/ScheduleNew';
import ScheduleHistory from '../Admin/ScheduleHistory';
import RatingMyAdmins from './RatingMyAdmins';
import Xodimlar from '../Admin/Xodimlar';
import LookSchedule from '../Admin/LookSchedule';
import ScheduleRate from '../Admin/ScheduleRate';
import PleaseInstruction from '../Asking/PleaseInstruction'
import SeeSelectedSchedules from '../Admin/SeeSelectedSchedules';
function ComplexRoute() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3 p-0">
          <Aside />
          {/* <PleaseInstruction/> */}
        </div>
        <div className=" col-12 col-md-9">
          <div className="p-3">
            <Routes>
              <Route path="/" exact element={<Complex />} />
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/schedule/new" exact element={<ScheduleNew />} />
              <Route path="/schedule/history" exact element={<ScheduleHistory />} />
              <Route path="/schedule/history/:id" exact element={<SeeSelectedSchedules />} />
              <Route path="/archive/schedule/:id" exact element={<LookSchedule />} />
              <Route path="/rate/schedule/:id" exact element={<ScheduleRate />} />
              <Route path="/rating/ours" exact element={<RatingMyAdmins />} />
              <Route path="/sections" exact element={<Sections />} />
              <Route path="/sections/edit/:id" exact element={<EditSection />} />
              <Route path="/sections/add" exact element={<NewSection />} />
              <Route path="/profile" exact element={<Profile />} />
              <Route path="/employees" exact element={<Xodimlar />} />
              <Route path="/employees/registered-users" exact element={<FilterNewUsers />} />
              <Route path="/employees/confirm/:id" exact element={<Confirm />} />
              <Route path="/employees/adduser" exact element={<AddNewUser />} />
              <Route path="/*" exact element={<NotFound404 />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplexRoute;