import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import logo from './Images/logo-png.png';
import { useTranslation } from "react-i18next";
function Footer() {
    const [route, setRoute] = useState("");
    const { t } = useTranslation();
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
      } else{
        setRoute("/null");
      }
    }, []);

    return ( 
        <>
        <footer className="footer m-0 row white">
        <div className="col-12 col-md-4 text-start">
          <img src={logo} className="footer-logo" alt="logo" />
          <p>{t("aboutfooter")}
          </p>
          <p>v1.0.0</p>
        </div>
        <div className="col-12 col-md-4">
          <ul className="list-unstyled bbg text-start">
            <li>
              <Link to={`${route}/about/statistics`}>
                <i class="fa-solid fa-chart-simple"></i> {t("statistika")}
              </Link>
            </li>
            <li>
              <Link to="/templates/instructions.pdf">
                <i class="fa-solid fa-book"></i> {t("dasfoyyoriq")}
              </Link>
            </li>
            {/* <li>
              <Link disabled to="/documents/privacy-policy">
                <i class="fa-solid fa-shield-halved"></i> Maxfiylik siyosati
              </Link>
            </li> */}
          </ul>
        </div>

        <div className="col-12 col-md-4">
          <ul className="list-unstyled bbg text-start">
            <li>
              <a href="tel:+998712413140">
                <i class="fa-solid fa-phone-volume"></i> +998 (71) 241-31-40
              </a>
            </li>
            <li>
              <div className="ctrl-enter">
                <i class="fa-solid fa-phone-volume"></i> {t("ichkiraqam")}: 53-89
              </div>
            </li>
            <li>
              <a href="mailto:mkundalik@tashmetro.uz">
                <i class="fa-solid fa-envelope"></i> mkundalik@tashmetro.uz
              </a>
            </li>
            <br />
            <span className="ctrl-enter">
            {t("ctrlenter")}
            </span>
            <br />
            <span className="ctrl-enter">{t("allrightsreserved")}.</span>
            <p className="ctrl-enter">Toshkent - 2025</p>
          </ul>
        </div>
      </footer>
        </>
     );
}

export default Footer;