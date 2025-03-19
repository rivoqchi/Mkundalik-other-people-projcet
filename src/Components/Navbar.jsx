import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { fetchRole } from "../Components/Auth/CheckAuth";
import LanguageSelector from "./LangSelect";
import logo2 from "./Images/logo-png.png";
import { useTranslation } from "react-i18next";
function Navbarr() {
  const [role, setRole] = useState(null);
    const { t } = useTranslation();

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
      commission: "/commission",
      department: "/department",
      staff: "/staff",
      hr: "/hr",
      new: "/iamnew",
    };
    return rolePaths[role] || "/login";
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="navbarrr">
      <Container>
        <Link className="text-decoration-none" to="/">
          <img className="logo5" src={logo2} alt="Logo" />
        </Link>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>

          {/* Tillar tanlash dropdowni */}

          <Nav>
          <Link title={t("dasfoyyoriq")} to={`/templates/instructions.pdf`} className="nav-link">
          {t("dasfoyyoriq")}
          </Link>
          <Link title={t("faq")} to={`${getProfileLink()}/about/faq`} className="nav-link">
          {t("faq")}
          </Link>
          <Link title={t("statistika")} to={`${getProfileLink()}/about/statistics`} className="nav-link">
          {t("statistika")}
          </Link>


          <LanguageSelector />
            {!role && (
              <Link title={t("login")} to="/login" className="nav-link navprofile">
                {t("login")}
              </Link>
            )}
            {role && (
              <Link title={t("profil")} to={`${getProfileLink()}/profile`} className="nav-link navprofile">
                {t("profil")}
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbarr;
