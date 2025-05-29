import React, {useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo2 from '../Images/logo2.png';
import axios from 'axios';
import { API } from '../../config';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import note from '../Images/note.png';
import logo from '../Images/logo-png.png';
function Aside() {  
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const location = useLocation(); // Hozirgi yo'lni olish
  let token = window.localStorage.getItem("token");

  const logout = async () => {
    try {
      const response = await axios.get(`${API}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      window.localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Chiqishda xatolik yuz berdi:', error);
    }
  };

  return (
    <>
    <div className="aside">
      <div className="aside-logo">
        <div className="d-flex align-items-center justify-content-center">
        <img className='noteimg' src={note} alt="" />
        <Link to='/superadmin/dashboard'><img className='asidelogo' src={logo} alt="" /></Link>
        </div>
        <h5>{window.localStorage.getItem("fullName")}</h5>
        <p>{window.localStorage.getItem("degree")}</p>
      </div>
      <nav className="aside-menu">
          <ul className='ggfgf'>
          <li className={location.pathname === '/superadmin/complex' ? 'active' : ''}>
            <Link to="/superadmin/complex">
            <i className="fa-solid fa-code-fork"></i>
              <span>Komplekslar</span>
            </Link>
          </li>
          <li className={location.pathname === '/superadmin/departments' ? 'active' : ''}>
            <Link to="/superadmin/departments">
            <i className="fa-solid fa-building-user"></i>
              <span>Xizmatlar</span>
            </Link>
          </li>
          <li className={location.pathname === '/superadmin/sections' ? 'active' : ''}>
            <Link to="/superadmin/sections">
            <i className="fa-solid fa-puzzle-piece"></i>
              <span>Bo`limlar</span>
            </Link>
          </li>
          </ul>
<hr />
          <ul className='ggfgf'>
          <li className={location.pathname === '/superadmin/employees/adduser' ? 'active' : ''}>
            <Link to="/superadmin/employees/adduser">
              <i className="fa-solid fa-sitemap"></i>
              <span>Yangi xodim qo`shish</span>
            </Link>
          </li>
          <li className={location.pathname === '/superadmin/employees/allusers' ? 'active' : ''}>
            <Link to="/superadmin/employees/allusers">
              <i className="fa-solid fa-sitemap"></i>
              <span>Barcha xodimlar</span>
            </Link>
          </li>
          </ul>
          <hr />
        <ul>
          <li className={location.pathname === '/superadmin/report' ? 'active' : ''}>
            <Link to="/superadmin/report">
            <i className="fa-solid fa-receipt"></i>
              <span>Davriy hisobot</span>
            </Link>
          </li>
          <li className={location.pathname === '/superadmin/report/global' ? 'active' : ''}>
            <Link to="/superadmin/report/global">
            <i className="fa-solid fa-receipt"></i>
              <span>Ma'lumotnoma</span>
            </Link>
          </li>



          <li className={location.pathname === '/superadmin/about' ? 'active' : ''}>
            <Link to="/superadmin/about">
              <i className="fa-solid fa-info"></i>
              <span>Dastur haqida</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
            <Modal centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Chiqish</Modal.Title>
            </Modal.Header>
            <Modal.Body>Profildan chiqmoqchimisiz?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Bekor qilish
              </Button>
              <Button variant="danger" onClick={logout}>
                Chiqish
              </Button>
            </Modal.Footer>
          </Modal>
    </>
  );
}

export default Aside;