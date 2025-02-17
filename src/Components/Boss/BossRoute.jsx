import { Route, Routes } from 'react-router-dom';
import NotFound404 from '../Additional/NotFound404';
import Dashboard from './Dashboard';
import Boss from '../Redirects/Boss';
import Profile from '../Admin/Profile';
import Aside from './Aside';
import RatingMyAdmins from './RatingMyAdmins';
import Xodimlar from './Tuzilma';
import LookSchedule from '../Admin/LookSchedule';
import ScheduleRate from '../Admin/ScheduleRate';
import PleaseInstruction from '../Asking/PleaseInstruction';
import SeeSelectedSchedules from '../Admin/SeeSelectedSchedules';
function BossRoute() {
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
              <Route path="/" exact element={<Boss />} />
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/profile" exact element={<Profile />} />
              <Route path="/rating/complexes" exact element={<RatingMyAdmins />} />
              <Route path="/structure" exact element={<Xodimlar />} />
              <Route path="/schedule/history/:id" exact element={<SeeSelectedSchedules />} />
              <Route path="/archive/schedule/:id" exact element={<LookSchedule />} />
              <Route path="/*" exact element={<NotFound404 />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BossRoute;