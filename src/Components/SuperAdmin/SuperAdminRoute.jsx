import { Route, Routes } from 'react-router-dom';
import NotFound404 from '../Additional/NotFound404';
import Dashboard from './Dashboard';
import SuperAdmin from '../Redirects/SuperAdmin';
import Profile from '../Admin/Profile';
import FilterNewUsers from '../Admin/FilterNewUsers';
import Confirm from '../Admin/Confirm';
import AddNewUser from '../Admin/AddNewUser';
import Sections from '../Admin/Sections';
import NewSection from '../Admin/NewSection';
import EditSection from '../Admin/EditSection';
import Departamentlar from './Departamentlar';
import NewDepartment from '../Admin/NewDepartment';
import EditComplex from '../Admin/EditComplex';
import Complexes from './Complexes';
import NewComplex from '../Admin/NewComplex';
import EditDepartment from '../Admin/EditDepartment';
import Aside from './Aside';
import ScheduleNew from '../Admin/ScheduleNew';
import ScheduleHistory from '../Admin/ScheduleHistory';
import ScheduleSectionRating from '../Admin/ScheduleSectionRating';
import Xodimlar from './Xodimlar';
import LookSchedule from '../Admin/LookSchedule';
import ScheduleRate from '../Admin/ScheduleRate';
import AllUsers from './AllUsers';
import PleaseInstruction from '../Asking/PleaseInstruction';
import SeeSelectedSchedules from '../Admin/SeeSelectedSchedules';
import Info from '../Infos/Info';
import News from '../Infos/News';
import UmumiyStat from '../Infos/UmumiyStat';
import About from '../Infos/About';
import Application from '../Infos/Application';
import FAQPage from '../Infos/FAQPage';
function SuperAdminRoute() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3 p-0">
          <Aside />
          {/* <PleaseInstruction/> */}
        </div>
        <div className=" col-12 navv col-md-9">
          <div className="p-3">
            <Routes>
              <Route path="/" exact element={<SuperAdmin />} />
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/about" exact element={<Info />} />
              <Route path="/about/news" exact element={<News />} />
              <Route path="/about/statistics" exact element={<UmumiyStat />} />
              <Route path="/about/application" exact element={<Application />} />
              <Route path="/about/faq" exact element={<FAQPage />} />
              <Route path="/schedule/new" exact element={<ScheduleNew />} />
              <Route path="/schedule/history" exact element={<ScheduleHistory />} />
              <Route path="/schedule/history/:id" exact element={<SeeSelectedSchedules />} />
              <Route path="/archive/schedule/:id" exact element={<LookSchedule />} />
              <Route path="/rate/schedule/:id" exact element={<ScheduleRate />} />
              <Route path="/rating/ours" exact element={<ScheduleSectionRating />} />
              <Route path="/sections" exact element={<Sections />} />
              <Route path="/sections/add" exact element={<NewSection />} />
              <Route path="/sections/edit/:id" exact element={<EditSection />} />
              <Route path="/departments" exact element={<Departamentlar />} />
              <Route path="/departments/add" exact element={<NewDepartment />} />
              <Route path="/departments/edit/:id" exact element={<EditDepartment />} />
              <Route path="/complex" exact element={<Complexes />} />
              <Route path="/complex/add" exact element={<NewComplex />} />
              <Route path="/complex/edit/:id" exact element={<EditComplex />} />
              <Route path="/profile" exact element={<Profile />} />
              <Route path="/employees" exact element={<Xodimlar />} />
              <Route path="/employees/allusers" exact element={<AllUsers />} />
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

export default SuperAdminRoute;