import { Route, Routes } from 'react-router-dom';
import NotFound404 from '../Additional/NotFound404';
import Dashboard from './Dashboard';
import Hr from '../Redirects/Hr';
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
import Xodimlar from './Xodimlar';
import Instructions from './Instructions';
import Navbarr from '../Navbar';
import LookSchedule from '../Admin/LookSchedule';
import ScheduleRate from '../Admin/ScheduleRate';
import AllUsers from '../SuperAdmin/AllUsers';
import PleaseInstruction from '../Asking/PleaseInstruction'
import SeeSelectedSchedules from '../Admin/SeeSelectedSchedules';
import Footer from '../Footer';
function DepartmentRoute() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Chap taraf: Aside */}
        <div className="col-2 asidefixed p-0">
          <Aside />
        </div>
        <div className="col-2 p-0">
          
        </div>

        {/* O'ng taraf: Navbar va asosiy content */}
        <div className="col-10 overflow-y-auto h-100vh navv d-flex flex-column p-0">
          <div className="bg-always pt-5 flex-grow-1">
          <Navbarr /> {/* Har doim ekranning o‘ng yuqori qismida turadi */}
            <Routes>
              <Route path="/" exact element={<Hr />} />
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
              <Route path="/employees" exact element={<AllUsers />} />
              <Route path="/employees/allusers" exact element={<AllUsers />} />
              <Route path="/instructions" exact element={<Instructions />} />
              <Route path="/employees/registered-users" exact element={<FilterNewUsers />} />
              <Route path="/employees/confirm/:id" exact element={<Confirm />} />
              <Route path="/employees/adduser" exact element={<AddNewUser />} />
              <Route path="/*" exact element={<NotFound404 />} />
            </Routes>
            <Footer/>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentRoute;