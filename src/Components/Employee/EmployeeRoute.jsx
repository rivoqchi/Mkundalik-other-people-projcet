import { Route, Routes } from 'react-router-dom';
import NotFound404 from '../Additional/NotFound404';
import Dashboard from './Dashboard';
import Employee from '../Redirects/Employee';
import Profile from '../Admin/Profile';
import ScheduleNew from '../Admin/ScheduleNew';
import ScheduleHistory from '../Admin/ScheduleHistory';
import Aside from './Aside';
import LookSchedule from '../Admin/LookSchedule';
import PleaseInstruction from '../Asking/PleaseInstruction';
import Info from '../Infos/Info';
import News from '../Infos/News';
import UmumiyStat from '../Infos/UmumiyStat';
import Navbarr from '../Navbar';
import About from '../Infos/About';
import Application from '../Infos/Application';
import FAQPage from '../Infos/FAQPage';
import FoydalanishYoriqnomasi from '../FoydalanishYoriqnomasi';
import Footer from '../Footer';
import Languages from '../Admin/Languages';
import LangRu from '../Admin/LangRu';
import LangEn from '../Admin/LangEn';
import { useLocation } from "react-router-dom";
import TestPage from '../Lang/TestPage';
import Security from '../Security/Security';
function EmployeeRoute() {
  const location = useLocation();
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
        <div className={` flex-grow-1 ${location.pathname.includes("statistics") ? "stat-page" : ""}`}>
        <Navbarr /> {/* Har doim ekranning o‘ng yuqori qismida turadi */}
            <Routes>
              
            <Route path="/languages" exact element={<Languages />} />
              <Route path="/lang/ru" exact element={<LangRu />} />
              <Route path="/lang/en" exact element={<LangEn />} />
              
              <Route path="/about" exact element={<Info />} />
              <Route path="/about/news" exact element={<News />} />
              <Route path="/about/statistics" exact element={<UmumiyStat />} />
              <Route path="/about/application" exact element={<Application />} />
              <Route path="/about/faq" exact element={<FAQPage />} />
              
              <Route path="/" exact element={<Employee />} />
              <Route path="/profile" exact element={<Profile />} />
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/schedule/new" exact element={<ScheduleNew />} />
              <Route path="/schedule/history" exact element={<ScheduleHistory />} />
              <Route path="/archive/schedule/:id" exact element={<LookSchedule />} />
              <Route path="/instructions" exact element={<FoydalanishYoriqnomasi />} />
              <Route path="/test/:id" exact element={<TestPage />} />
              <Route path="/profile/security" exact element={<Security />} />
              <Route path="/*" exact element={<NotFound404 />} />
            </Routes>
            <Footer/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeRoute;