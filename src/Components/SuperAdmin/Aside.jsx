import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo2 from '../Images/logo2.png';
import axios from 'axios';
import { API } from '../../config';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import note from '../Images/note.png';
import logo from '../Images/logo-png.png';
import { signout } from '../Auth/CheckAuth';
function Aside() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    signout(() => {
      navigate("/");
    });
  };


  return (
    <>
      <div className="aside">
        <div className="aside-logo">
          <i className="fa-solid fa-shield-halved"></i>
          <h4>{window.localStorage.getItem("fullName") || "Super Admin"}</h4>
          <p className="text-muted small mt-1">{window.localStorage.getItem("degree") || "System Administrator"}</p>
        </div>

        <nav className="aside-menu">
          <ul className="mb-4">
            <li>
              <Link to="/superadmin/dashboard" className={location.pathname.startsWith("/superadmin/dashboard") ? "active" : ""}>
                <i className="fa-solid fa-gauge-high"></i>
                <span>Xavfsizlik</span>
              </Link>
            </li>
            <li>
              <Link to="/superadmin/complex" className={location.pathname.startsWith("/superadmin/complex") ? "active" : ""}>
                <i className="fa-solid fa-layer-group"></i>
                <span>Komplekslar</span>
              </Link>
            </li>
            <li>
              <Link to="/superadmin/departments" className={location.pathname.startsWith("/superadmin/departments") ? "active" : ""}>
                <i className="fa-solid fa-building-user"></i>
                <span>Xizmatlar</span>
              </Link>
            </li>
            <li>
              <Link to="/superadmin/sections" className={location.pathname.startsWith("/superadmin/sections") ? "active" : ""}>
                <i className="fa-solid fa-puzzle-piece"></i>
                <span>Bo`limlar</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname === "/superadmin/schedule/history" ? "active" : ""} to="/superadmin/schedule/history">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>Tarix</span>
              </Link>
            </li>
          </ul>

          <div className="menu-divider px-4 mb-3"><hr className="m-0 opacity-10" /></div>

          <ul className="mb-4">
            <li>
              <Link to="/superadmin/employees/adduser" className={location.pathname.startsWith("/superadmin/employees/adduser") ? "active" : ""}>
                <i className="fa-solid fa-user-plus"></i>
                <span>Xodim qo`shish</span>
              </Link>
            </li>
            <li>
              <Link to="/superadmin/employees/allusers" className={location.pathname.startsWith("/superadmin/employees/allusers") ? "active" : ""}>
                <i className="fa-solid fa-users-gear"></i>
                <span>Barcha xodimlar</span>
              </Link>
            </li>
          </ul>

          <div className="menu-divider px-4 mb-3"><hr className="m-0 opacity-10" /></div>

          <ul>
            {/* <li>
              <Link to="/superadmin/report" className={location.pathname.startsWith("/superadmin/report") ? "active" : ""}>
                <i className="fa-solid fa-file-contract"></i>
                <span>Davriy hisobot</span>
              </Link>
            </li> */}
            <li>
              <Link to="/superadmin/report/global" className={location.pathname.startsWith("/superadmin/report/global") ? "active" : ""}>
                <i className="fa-solid fa-globe"></i>
                <span>Ma'lumotnoma</span>
              </Link>
            </li>
            <li>
              <Link to="/superadmin/report/holidays" className={location.pathname.startsWith("/superadmin/report/holidays") ? "active" : ""}>
                <i className="fa-solid fa-calendar-check"></i>
                <span>Bayramlar</span>
              </Link>
            </li>
            <li>
              <Link to="/superadmin/profile" className={location.pathname.startsWith("/superadmin/profile") ? "active" : ""}>
                <i className="fa-solid fa-user-shield"></i>
                <span>Profil sozlamalari</span>
              </Link>
            </li>
            <li className="mt-4">
              <Link onClick={handleShow} className="text-danger opacity-75">
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Tizimdan chiqish</span>
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