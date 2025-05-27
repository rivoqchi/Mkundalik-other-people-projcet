import React, {useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo2 from '../Images/logo2.png';
import axios from 'axios';
import { API } from '../../config';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import note from '../Images/note.png';
import logo from '../Images/logo-png.png';
import { useTranslation } from "react-i18next";
function Aside() {  
  const { t } = useTranslation();
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
        <Link to='/hr/dashboard'><img className='asidelogo' src={logo} alt="" /></Link>
        </div>
        <h4>HR Panel</h4>
      </div>
      <nav className="aside-menu">
        <ul>
          <li className={location.pathname === '/hr/schedule/new' ? 'active' : ''}>
            <Link to="/hr/schedule/new">
              <i className="fa-solid fa-list-check"></i>
              <span>{t("qaydEtish")}</span>
            </Link>
          </li>
          <li className={location.pathname === '/hr/schedule/history' ? 'active' : ''}>
            <Link to="/hr/schedule/history">
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span>{t("faoliyatim")}</span>
            </Link>
          </li>
          <li className={location.pathname === '/hr/info/employee' ? 'active' : ''}>
            <Link to="/hr/employees">
              <i className="fa-solid fa-sitemap"></i>
              <span>{t("xodimlar")}</span>
            </Link>
          </li>
                                <li
                                  className={
                                    location.pathname === "/hr/languages" ? "active" : ""
                                  }
                                >
                                  <Link to="/hr/languages">
                                    <i class="fa-solid fa-language"></i>
                                    <span>
                                    {t("foreign")}
                                    </span>
                                  </Link>
                                </li>
        </ul>
      </nav>
    </div>
    <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("logOut")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("profildanchiqmoqchimisiz")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
          {t("bekorqilish")}
          </Button>
          <Button variant="danger" onClick={logout}>
          {t("logOut")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Aside;