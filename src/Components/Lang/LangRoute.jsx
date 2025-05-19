import { Route, Routes } from 'react-router-dom';
import NotFound404 from '../Additional/NotFound404';
import Dashboard from './Dashboard';
import Normativ from './Normativ';
import Lang from '../Redirects/Lang';
import Profile from '../Admin/Profile';
import FilterNewUsers from '../Admin/FilterNewUsers';
import Confirm from '../Admin/Confirm';
import Navbarr from '../Navbar';
import AddNewUser from '../Admin/AddNewUser';
import Sections from '../Admin/Sections';
import NewSection from '../Admin/NewSection';
import EditSection from '../Admin/EditSection';
import Aside from './Aside';
import ScheduleNew from '../Admin/ScheduleNew';
import ScheduleHistory from '../Admin/ScheduleHistory';
import List from './List';
import Xodimlar from '../Admin/Xodimlar';
import LookSchedule from '../Admin/LookSchedule';
import ScheduleRate from '../Admin/ScheduleRate';
import Instructions from '../Admin/Instructions';
import PleaseInstruction from '../Asking/PleaseInstruction';
import SeeSelectedSchedules from '../Admin/SeeSelectedSchedules';
import Info from '../Infos/Info';
import News from '../Infos/News';
import UmumiyStat from '../Infos/UmumiyStat';
import About from '../Infos/About';
import Application from '../Infos/Application';
import FAQPage from '../Infos/FAQPage';
import FoydalanishYoriqnomasi from '../FoydalanishYoriqnomasi';
import Footer from '../Footer';
import Test from './Test';
function LangRoute() {
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
          <Navbarr />
            <Routes>
              <Route path="/about" exact element={<Info />} />
              <Route path="/about/news" exact element={<News />} />
              <Route path="/about/statistics" exact element={<UmumiyStat />} />
              <Route path="/about/application" exact element={<Application />} />
              <Route path="/about/faq" exact element={<FAQPage />} />
              
              <Route path="/" exact element={<Lang />} />
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/standarts" exact element={<Normativ />} />
              <Route path="/schedule/new" exact element={<ScheduleNew />} />
              <Route path="/schedule/history" exact element={<ScheduleHistory />} />
              <Route path="/schedule/history/:id" exact element={<SeeSelectedSchedules />} />
              <Route path="/archive/schedule/:id" exact element={<LookSchedule />} />
              <Route path="/rate/schedule/:id" exact element={<ScheduleRate />} />
              <Route path="/rating/list" exact element={<List />} />
              <Route path="/sections" exact element={<Sections />} />
              <Route path="/instructions" exact element={<FoydalanishYoriqnomasi />} />
              <Route path="/sections/edit/:id" exact element={<EditSection />} />
              <Route path="/sections/add" exact element={<NewSection />} />
              <Route path="/test" exact element={<Test />} />
              <Route path="/profile" exact element={<Profile />} />
              <Route path="/employees" exact element={<Xodimlar />} />
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

export default LangRoute;
