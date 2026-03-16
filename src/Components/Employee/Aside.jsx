import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo2 from "../Images/logo2.png";
import axios from "axios";
import { API } from "../../config";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import note from "../Images/note.png";
import logo from "../Images/logo-png.png";
import { useTranslation } from "react-i18next";
import { signout } from "../Auth/CheckAuth";
function Aside() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation(); // Hozirgi yo'lni olish
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
            <img className="noteimg" src={note} alt="" />
            <Link to="/user/dashboard">
              <img className="asidelogo" src={logo} alt="" />
            </Link>
          </div>
          <h5>{window.localStorage.getItem("fullName")}</h5>
          <p>{window.localStorage.getItem("degree")}</p>
        </div>
        <nav className="aside-menu">
          <ul>
            <li>
              <Link className={location.pathname.startsWith("/user/schedule/new") ? "active" : ""} to="/user/schedule/new">
                <i className="fa-solid fa-list-check"></i>
                <span>{t("qaydEtish")}</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname === "/user/schedule/history" ? "active" : ""} to="/user/schedule/history">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>{t("faoliyatim")}</span>
              </Link>
            </li>
            {/* <li>
              <Link className={location.pathname.startsWith("/user/languages") ? "active" : ""} to="/user/languages">
                <i className="fa-solid fa-language"></i>
                <span>{t("foreign")}</span>
              </Link>
            </li> */}
            <li>
              <Link className={location.pathname.startsWith("/user/profile") ? "active" : ""} to="/user/profile">
                <i className="fa-solid fa-user"></i>
                <span>{t("myInfo")}</span>
              </Link>
            </li>

            <li>
              <Link className={location.pathname.startsWith("/user/about") ? "active" : ""} to="/user/about">
                <i className="fa-solid fa-circle-info"></i>
                <span>{t("dasturhaqida")}</span>
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
