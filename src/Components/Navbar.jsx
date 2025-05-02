import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
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
import { useTranslation } from "react-i18next";
function Navbarr() {
  const [role, setRole] = useState(null);
  const { t } = useTranslation();
  const [route, setRoute] = useState("");
  let isSignedIn = window.localStorage.getItem("token") ? true : false;

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
      new: "/iamnew",
    };
    return rolePaths[role] || "/login";
  };

  return (
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
              <li>Bosh sahifa</li>
            </a>
            <Link onClick={() => setIsOpen(false)} to={`${route}/about/statistics`}>
              <li>Statistika</li>
            </Link>
            <a
              onClick={() => setIsOpen(false)}
              href="/templates/instructions.pdf"
            >
              <li>Yo'riqnoma</li>
            </a>
            <LangSelect />
            {isSignedIn ? (
              <Link onClick={() => setIsOpen(false)} to={`${route}/profile`}>
                <button className="login-btn">
                  {window.localStorage.getItem("fullName")}
                </button>
              </Link>
            ) : (
              <Link onClick={() => setIsOpen(false)} to="/login">
                <button className="login-btn">Kabinetga kirish</button>
              </Link>
            )}
          </div>

          <div className="hamburger" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </div>
        </nav>
      </Container>
    </Navbar>
  );
}

export default Navbarr;
