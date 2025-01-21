import { Route, Routes } from 'react-router-dom';
import NotFound404 from '../Additional/NotFound404';
import Dashboard from './Dashboard';
import SuperAdmin from '../Redirects/SuperAdmin';
import NewAdmin from './NewAdmin';
function AdminRoute() {
  return (
    <>
          <Routes>
            <Route path="/" exact element={<SuperAdmin />} />
            <Route path="/dashboard" exact element={<Dashboard />} />
            <Route path="/manage/new" exact element={<NewAdmin />} />
            <Route path="/*" exact element={<NotFound404 />} />
          </Routes>
    </>
  );
}

export default AdminRoute;