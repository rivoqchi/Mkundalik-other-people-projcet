import { Route, Routes } from 'react-router-dom';
import NotFound404 from '../Additional/NotFound404';
import Dashboard from './Dashboard';
import Komissiya from '../Redirects/Komissiya';
import Profile from '../Admin/Profile';
import Aside from './Aside';
import Etirozlar from './Etirozlar';
import EtirozLook from './EtirozLook';
import PleaseInstruction from '../Asking/PleaseInstruction';
import SeeSelectedSchedules from '../Admin/SeeSelectedSchedules';
import Info from '../Infos/Info';
import Navbarr from '../Navbar';
import News from '../Infos/News';
import UmumiyStat from '../Infos/UmumiyStat';
import About from '../Infos/About';
import Application from '../Infos/Application';
import FAQPage from '../Infos/FAQPage';
function KomissiyaRoute() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3 p-0">
          <Aside />
          {/* <PleaseInstruction/> */}
        </div>
        {/* O'ng taraf: Navbar va asosiy content */}
        <div className="col-9 d-flex flex-column p-0">
          <Navbarr /> {/* Har doim ekranning o‘ng yuqori qismida turadi */}
          <div className="p-3 flex-grow-1">
            <Routes>
              <Route path="/about" exact element={<Info />} />
              <Route path="/about/news" exact element={<News />} />
              <Route path="/about/statistics" exact element={<UmumiyStat />} />
              <Route path="/about/application" exact element={<Application />} />
              <Route path="/about/faq" exact element={<FAQPage />} />
              
              <Route path="/" exact element={<Komissiya />} />
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/profile" exact element={<Profile />} />
              <Route path="/objections" exact element={<Etirozlar />} />
              <Route path="/objection/:id" exact element={<EtirozLook />} />
              <Route path="/*" exact element={<NotFound404 />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KomissiyaRoute;