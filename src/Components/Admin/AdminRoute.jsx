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
import Info from '../Infos/Info';
import News from '../Infos/News';
import Navbarr from '../Navbar';
import UmumiyStat from '../Infos/UmumiyStat';
import About from '../Infos/About';
import Application from '../Infos/Application';
import FAQPage from '../Infos/FAQPage';
import FoydalanishYoriqnomasi from '../FoydalanishYoriqnomasi';

function AdminRoute() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Chap taraf: Aside */}
        <div className="col-2 p-0">
          <Aside />
        </div>

        {/* O'ng taraf: Navbar va asosiy content */}
        <div className="col-10 overflow-y-scroll h-100vh navv d-flex flex-column p-0">
          <Navbarr /> {/* Har doim ekranning o‘ng yuqori qismida turadi */}
          <div className="p-3 flex-grow-1">
            <Routes>
              <Route path="/about" exact element={<Info />} />
              <Route path="/about/news" exact element={<News />} />
              <Route path="/about/statistics" exact element={<UmumiyStat />} />
              <Route path="/about/application" exact element={<Application />} />
              <Route path="/about/faq" exact element={<FAQPage />} />
              
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
              <Route path="/instructions" exact element={<FoydalanishYoriqnomasi />} />
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