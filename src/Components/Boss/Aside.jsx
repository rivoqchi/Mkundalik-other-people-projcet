import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo2 from '../Images/logo2.png';
import axios from 'axios';
import { API } from '../../config';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import note from '../Images/note.png';
import logo from '../Images/logo-png.png';
import { useTranslation } from "react-i18next";
import { signout } from "../Auth/CheckAuth";
import WeatherAside from "../WeatherAside";
function Aside() {

  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const location = useLocation(); // Hozirgi yo'lni olish
  const logout = () => {
    signout(() => {
      navigate("/");
    });
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
            <li>
              <Link disabled className={location.pathname.startsWith("/boss/rating/ours") ? "active" : ""} to="/boss/rating/ours">
                <i className="fa-solid fa-chart-pie"></i>
                <span>{t("raxbarnazoratidagilar")}</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname.startsWith("/boss/structure") ? "active" : ""} to="/boss/structure">
                <i className="fa-solid fa-sitemap"></i>
                <span>{t("tashkiliytuzilma")}</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname.startsWith("/boss/about/statistics") ? "active" : ""} to="/boss/about/statistics">
                <i className="fa-solid fa-info"></i>
                <span>{t("statistika")}</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname.startsWith("/boss/profile") ? "active" : ""} to="/boss/profile">
                <i className="fa-regular fa-user"></i>
                <span>{t("myInfo")}</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname.startsWith("/boss/about") ? "active" : ""} to="/boss/about">
                <i className="fa-solid fa-circle-info"></i>
                <span>{t("dasturhaqida")}</span>
              </Link>
            </li>

            <li>
              <Link onClick={handleShow}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>{t("logOut")}</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="d-none d-md-block mb-3">
          <WeatherAside />
        </div>
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