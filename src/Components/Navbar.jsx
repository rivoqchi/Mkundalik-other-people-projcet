import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "./Images/logo-png.png";
import { Link } from "react-router-dom";
import { fetchRole } from "../Components/Auth/CheckAuth";
import LanguageSelector from "./LangSelect";
import LangSelect from "./LangSelect";
import logo2 from "./Images/logo-png.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API } from "../config";
import { useTranslation } from "react-i18next";

function Navbarr() {
  let token = window.localStorage.getItem("token");
  const [role, setRole] = useState(null);
  const { t } = useTranslation();
  const [route, setRoute] = useState("");
  let isSignedIn = window.localStorage.getItem("token") ? true : false;
  const logout = async () => {
    try {
      const response = await axios.get(`${API}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      window.localStorage.clear();
      window.location.replace('/');
    } catch (error) {
      console.error("Chiqishda xatolik yuz berdi:", error);
    }
  };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const role = window.localStorage.getItem("role");
    if (role === "admin") {
      setRoute("/admin");
    } else if (role === "employee") {
      setRoute("/user");
    } else if (role === "superadmin") {
      setRoute("/superadmin");
    } else if (role === "complex") {
      setRoute("/complex");
    } else if (role === "department") {
      setRoute("/department");
    } else if (role === "hr") {
      setRoute("/hr");
    } else if (role === "lang") {
      setRoute("/lang");
    } else if (role === "boss") {
      setRoute("/boss");
    } else if (role === "commission") {
      setRoute("/commission");
    } else if (role === "staff") {
      setRoute("/staff");
    } else if (role === "at") {
      setRoute("/at");
    } else if (role === "sport") {
      setRoute("/sport");
    } else {
      setRoute("/null");
    }
  }, []);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const fetchUserRole = async () => {
      const userRole = await fetchRole();
      setRole(userRole);
    };
    fetchUserRole();
  }, []);

  const getProfileLink = () => {
    const rolePaths = {
      employee: "/user",
      admin: "/admin",
      superadmin: "/superadmin",
      complex: "/complex",
      boss: "/boss",
      commission: "/at",
      commission: "/sport",
      commission: "/commission",
      department: "/department",
      staff: "/staff",
      sport: "/sport",
      hr: "/hr",
      lang: "/lang",
      new: "/iamnew",
    };
    return rolePaths[role] || "/login";
  };

  return (
    <>
    <Navbar collapseOnSelect expand="lg" className="navbarrr">
      <Container>
        <nav className="nav">
          <div className="logo2">
            <Link to={"/"}>
              <img src={logo} alt="logo" />
            </Link>
          </div>

          <div className={`nav-links ${isOpen ? "open" : ""}`}>
            <a onClick={() => setIsOpen(false)} href="/">
              <li>{t("main")}</li>
            </a>
            <Link onClick={() => setIsOpen(false)} to={`${route}/about/statistics`}>
              <li>{t("statistika")}</li>
            </Link>
            <a
              onClick={() => setIsOpen(false)}
              href="/templates/instructions.pdf"
            >
              <li>{t("instruction")}</li>
            </a>
            <LangSelect />
            {isSignedIn ? (
              <a className="signedin">
                {window.localStorage.getItem("fullName")}
              </a>
            ) : (
              <Link onClick={() => setIsOpen(false)} to="/login">
                <button className="login-btn">{t("entertocabinet")}</button>
              </Link>
            )}
          {token && (
  <Button className="btn-danger borderrad50" onClick={handleShow}>
    <i className="fa-solid fa-arrow-right-from-bracket"></i>
  </Button>
)}
          </div>
          <div className="hamburger" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </div>
        </nav>
      </Container>
    </Navbar>
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

export default Navbarr;