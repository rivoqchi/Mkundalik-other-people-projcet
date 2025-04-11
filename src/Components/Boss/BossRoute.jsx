import { Route, Routes } from 'react-router-dom';
import NotFound404 from '../Additional/NotFound404';
import Dashboard from './Dashboard';
import Boss from '../Redirects/Boss';
import Profile from '../Admin/Profile';
import Aside from './Aside';
import RatingMyAdmins from './RatingMyAdmins';
import Xodimlar from './Tuzilma';
import ScheduleSectionRating from '../Admin/ScheduleSectionRating';
import LookSchedule from '../Admin/LookSchedule';
import ScheduleRate from '../Admin/ScheduleRate';
import Navbarr from '../Navbar';
import PleaseInstruction from '../Asking/PleaseInstruction';
import SeeSelectedSchedules from '../Admin/SeeSelectedSchedules';
import Info from '../Infos/Info';
import News from '../Infos/News';
import UmumiyStat from '../Infos/UmumiyStat';
import About from '../Infos/About';
import Application from '../Infos/Application';
import FAQPage from '../Infos/FAQPage';
import FoydalanishYoriqnomasi from '../FoydalanishYoriqnomasi';

function BossRoute() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Chapdagi Aside panel */}
        <div className="col-2 p-0">
          <Aside /> {/* Chap panel */}
          {/* <PleaseInstruction/> */}
        </div>

        {/* O‘ng taraf: Navbar va asosiy content */}
        <div className="col-10 navv d-flex flex-column p-0">
          <Navbarr /> {/* Har doim ekranning o‘ng yuqori qismida turadi */}
          <div className="p-3 flex-grow-1">
            <Routes>
              <Route path="/about" exact element={<Info />} />
              <Route path="/about/news" exact element={<News />} />
              <Route path="/about/statistics" exact element={<UmumiyStat />} />
              <Route path="/about/application" exact element={<Application />} />
              <Route path="/about/faq" exact element={<FAQPage />} />

              <Route path="/rate/schedule/:id" exact element={<ScheduleRate />} />
              <Route path="/" exact element={<Boss />} />
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/profile" exact element={<Profile />} />
              <Route path="/rating/ours" exact element={<ScheduleSectionRating />} />
              <Route path="/structure" exact element={<Xodimlar />} />
              <Route path="/schedule/history/:id" exact element={<SeeSelectedSchedules />} />
              <Route path="/archive/schedule/:id" exact element={<LookSchedule />} />
              <Route path="/*" exact element={<NotFound404 />} />
              <Route path="/instructions" exact element={<FoydalanishYoriqnomasi />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BossRoute;
