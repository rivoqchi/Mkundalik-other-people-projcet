import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo2 from "../Images/logo2.png";
import axios from "axios";
import { API } from "../../config";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import note from "../Images/note.png";
import logo from "../Images/logo-png.png";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import { useTranslation } from "react-i18next";
import { signout } from "../Auth/CheckAuth";
import WeatherAside from "../WeatherAside";
function Aside() {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    signout(() => {
      navigate("/");
    });
  };

  const myId = window.localStorage.getItem("user_id");
  const [notificationLength, setNotificationLength] = useState([]);
  const getMySectionSchedules = async () => {
    if (window.localStorage.getItem("section") === "Yuqori turuvchi" && window.localStorage.getItem("role") === 'admin') {
      setNotificationLength(0);
      return;
    }
    try {
      const { data } = await axios.get(
        `${API}/schedules/notification/length/${myId}`
      );
      setNotificationLength(data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getMySectionSchedules();
  }, []);
  return (
    <>
      <div className="aside">
        <div className="aside-logo">
          <div className="d-flex align-items-center justify-content-center">
            <img className="noteimg" src={note} alt="" />
            <Link to="/admin/dashboard">
              <img className="asidelogo" src={logo} alt="" />
            </Link>
          </div>
          <h5>{window.localStorage.getItem("fullName")}</h5>
          <p>{window.localStorage.getItem("degree")}</p>
        </div>
        <nav className="aside-menu">
          <ul>
            <li>
              <Link className={location.pathname.startsWith("/admin/schedule/new") ? "active" : ""} to="/admin/schedule/new">
                <i className="fa-solid fa-list-check"></i>
                <span>{t("qaydEtish")}</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname === "/admin/schedule/history" ? "active" : ""} to="/admin/schedule/history">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>{t("faoliyatim")}</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname.startsWith("/admin/rating/ours") ? "active" : ""} to="/admin/rating/ours">
                <i className="fa-solid fa-medal"></i>
                <span>{t("xodimlarimkorsatkichlari")}</span>
                {notificationLength > 0 && ( // Agar `notificationLength` bo‘lsa, chiqadi
                  <Stack
                    className="mx-1 lengthchi"
                    direction="horizontal"
                    gap={2}
                  >
                    <Badge bg="danger">{notificationLength}</Badge>
                  </Stack>
                )}
              </Link>
            </li>

            <li>
              <Link className={location.pathname.startsWith("/admin/employees") ? "active" : ""} to="/admin/employees">
                <i className="fa-solid fa-sitemap"></i>
                <span>{t("xodimlar")}</span>
              </Link>
            </li>



            {/* <li>
              <Link className={location.pathname.startsWith("/admin/languages") ? "active" : ""} to="/admin/languages">
                <i className="fa-solid fa-language"></i>
                <span>{t("foreign")}</span>
              </Link>
            </li> */}

            <li>
              <Link className={location.pathname.startsWith("/admin/profile") ? "active" : ""} to="/admin/profile">
                <i className="fa-solid fa-user"></i>
                <span className="">{t("myInfo")}</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname.startsWith("/admin/about") ? "active" : ""} to="/admin/about">
                <i className="fa-solid fa-circle-info"></i>
                <span>{t("dasturhaqida")}</span>
              </Link>
            </li>

            {/* <li>
              <Link className={location.pathname.startsWith("/admin/ict") ? "active" : ""} to="/admin/ict">
              <i className="fa-solid fa-computer"></i>
                <span>
                  Improve ICT 
                </span>
              </Link>
            </li> */}
          </ul>
        </nav>
        <div className="d-none d-md-block mb-5">
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
