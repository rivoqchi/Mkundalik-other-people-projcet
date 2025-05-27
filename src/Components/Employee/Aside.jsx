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

  const navigate = useNavigate();
  const location = useLocation(); // Hozirgi yo'lni olish
  let token = window.localStorage.getItem("token");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        <Link to='/user/dashboard'><img className='asidelogo' src={logo} alt="" /></Link>
        </div>
        <h5>{window.localStorage.getItem("fullName")}</h5>
        <p>{window.localStorage.getItem("degree")}</p>
      </div>
      <nav className="aside-menu">
        <ul>
          <li className={location.pathname === '/user/schedule/new' ? 'active' : ''}>
            <Link to="/user/schedule/new">
              <i className="fa-solid fa-list-check"></i>
              <span>{t("qaydEtish")}</span>
            </Link>
          </li>
          <li className={location.pathname === '/user/schedule/history' ? 'active' : ''}>
            <Link to="/user/schedule/history">
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span>{t("faoliyatim")}</span>
            </Link>
          </li>
                      <li
                        className={
                          location.pathname === "/user/languages" ? "active" : ""
                        }
                      >
                        <Link to="/user/languages">
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