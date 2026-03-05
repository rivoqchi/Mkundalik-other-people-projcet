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
            <img className="noteimg" src={note} alt="" />
            <Link to="/hr/dashboard">
              <img className="asidelogo" src={logo} alt="" />
            </Link>
          </div>
          <h4>HR Panel</h4>
        </div>
        <nav className="aside-menu">
          <ul>
            <li>
              <Link className={location.pathname.startsWith("/hr/schedule/new") ? "active" : ""} to="/hr/schedule/new">
                <i className="fa-solid fa-list-check"></i>
                <span>{t("qaydEtish")}</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname === "/hr/schedule/history" ? "active" : ""} to="/hr/schedule/history">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>{t("faoliyatim")}</span>
              </Link>
            </li>
            <li>
              <Link to="/hr/employees">
                <i className="fa-solid fa-sitemap"></i>
                <span>{t("xodimlar")}</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname.startsWith("/hr/languages") ? "active" : ""} to="/hr/languages">
                <i className="fa-solid fa-language"></i>
                <span>{t("foreign")}</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname.startsWith("/hr/report/global") ? "active" : ""} to="/hr/report/global">
                <i className="fa-solid fa-receipt"></i>
                <span>Ma'lumotnoma</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname.startsWith("/hr/report/holidays") ? "active" : ""} to="/hr/report/holidays">
                <i className="fa-solid fa-gift"></i>
                <span>Bayram kunlari</span>
              </Link>
            </li>

            <li>
              <Link className={location.pathname.startsWith("/hr/profile") ? "active" : ""} to="/hr/profile">
                <i className="fa-solid fa-user"></i>
                <span>{t("myInfo")}</span>
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
