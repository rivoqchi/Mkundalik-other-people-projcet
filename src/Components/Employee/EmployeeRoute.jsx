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

function EmployeeRoute() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Chap taraf: Aside */}
        <div className="col-2 p-0">
          <Aside /> {/* Chap panel */}
        </div>

        {/* O'ng taraf: Navbar va asosiy content */}
        <div className="col-10 d-flex navv flex-column p-0">
          <Navbarr /> {/* Har doim ekranning o‘ng yuqori qismida turadi */}
          <div className="p-3 flex-grow-1">
            <Routes>
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
              <Route path="/*" exact element={<NotFound404 />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeRoute;