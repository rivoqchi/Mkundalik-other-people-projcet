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
        <Link to='/boss/dashboard'><img className='asidelogo' src={logo} alt="" /></Link>
        </div>
      <h5>{window.localStorage.getItem("fullName")}</h5>
        <p>{window.localStorage.getItem("degree")}</p>      </div>
      <nav className="aside-menu">
        <ul>
        <li className={location.pathname === '/boss/monitoring' ? 'active' : ''}>
            <Link disabled to="/boss/rating/complexes">
            <i class="fa-solid fa-chart-pie"></i>
            <span>{t("raxbarnazoratidagilar")}</span>
            </Link>
          </li>
          <li className={location.pathname === '/boss/structure' ? 'active' : ''}>
            <Link to="/boss/structure">
              <i className="fa-solid fa-sitemap"></i>
              <span>{t("tashkiliytuzilma")}</span>
            </Link>
          </li>
          <li className={location.pathname === '/boss/statistics' ? 'active' : ''}>
            <Link to="/boss/statistics">
              <i className="fa-solid fa-sitemap"></i>
              <span>{t("statistika")}</span>
            </Link>
          </li>
          <li className={location.pathname === '/boss/profile' ? 'active' : ''}>
            <Link to="/boss/profile">
              <i className="fa-regular fa-user"></i>
              <span>{t("myInfo")}</span>
            </Link>
          </li>
          <li>
            <Link onClick={handleShow}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>{t("logOut")}</span>
            </Link>
          </li>

            <li className={location.pathname === '/boss/about/statistics' ? 'active' : ''}>
            <Link to="/boss/about/statistics">
              <i class="fa-solid fa-info"></i>
              <span>Statistika</span><span className="newtop">NEW</span>
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