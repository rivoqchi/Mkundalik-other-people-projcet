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
function KomissiyaRoute() {
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