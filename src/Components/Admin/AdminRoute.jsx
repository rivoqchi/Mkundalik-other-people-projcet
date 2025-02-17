import { Route, Routes } from 'react-router-dom';
import NotFound404 from '../Additional/NotFound404';
import Dashboard from './Dashboard';
import Admin from '../Redirects/Admin';
import Profile from './Profile';
import FilterNewUsers from './FilterNewUsers';
import Confirm from './Confirm';
import AddNewUser from './AddNewUser';
import Sections from './Sections';
import NewSection from './NewSection';
import EditSection from './EditSection';
import Aside from './Aside';
import ScheduleNew from './ScheduleNew';
import ScheduleHistory from './ScheduleHistory';
import ScheduleSectionRating from './ScheduleSectionRating';
import Xodimlar from './Xodimlar';
import Instructions from './Instructions';
import LookSchedule from './LookSchedule';
import ScheduleRate from './ScheduleRate';
import PleaseInstruction from '../Asking/PleaseInstruction'
import SeeSelectedSchedules from './SeeSelectedSchedules';
function AdminRoute() {
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
              <Route path="/" exact element={<Admin />} />
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/schedule/new" exact element={<ScheduleNew />} />
              <Route path="/schedule/history" exact element={<ScheduleHistory />} />
              <Route path="/schedule/history/:id" exact element={<SeeSelectedSchedules />} />
              <Route path="/archive/schedule/:id" exact element={<LookSchedule />} />
              <Route path="/rate/schedule/:id" exact element={<ScheduleRate />} />
              <Route path="/rating/ours" exact element={<ScheduleSectionRating />} />
              <Route path="/sections" exact element={<Sections />} />
              <Route path="/sections/edit/:id" exact element={<EditSection />} />
              <Route path="/sections/add" exact element={<NewSection />} />
              <Route path="/profile" exact element={<Profile />} />
              <Route path="/employees" exact element={<Xodimlar />} />
              <Route path="/instructions" exact element={<Instructions />} />
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

export default AdminRoute;