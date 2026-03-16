import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
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

  return (
    <>
      <footer className="footer-cyber m-0 row py-5">
        <div className="container">
          <div className="row">
            {/* Brand Section */}
            <div className="col-12 col-lg-4 text-start footer-col">
              <img src={logo} className="footer-logo mb-3" alt="logo" />
              <p className="footer-description">
                {t("aboutfooter")}
              </p>
              {/* <div className="social-links mt-4">
                <a href="#" className="social-icon"><i className="fa-brands fa-telegram"></i></a>
                <a href="#" className="social-icon"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" className="social-icon"><i className="fa-brands fa-facebook"></i></a>
                <a href="#" className="social-icon"><i className="fa-brands fa-youtube"></i></a>
              </div> */}
            </div>

            {/* Navigation Section */}
            <div className="col-12 col-md-4 col-lg-2 footer-col">
              <h5 className="footer-title">{t("statistika")}</h5>
              <ul className="list-unstyled footer-links text-start">
                <li>
                  <Link to={`${route}/about/statistics`}>
                    <i className="fa-solid fa-chart-line"></i> {t("statistika")}
                  </Link>
                </li>
                {/* <li>
                  <Link to={`${route}/about/news`}>
                    <i className="fa-solid fa-newspaper"></i> {t("news")}
                  </Link>
                </li> */}
                <li>
                  <Link to="/templates/instructions.pdf">
                    <i className="fa-solid fa-file-pdf"></i> {t("dasfoyyoriq")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="col-12 col-md-4 col-lg-2 footer-col">
              <h5 className="footer-title">{t("aboutus")}</h5>
              <ul className="list-unstyled footer-links text-start">
                <li>
                  <Link to={`${route}/about`}>
                    <i className="fa-solid fa-circle-info"></i> {t("aboutus")}
                  </Link>
                </li>
                <li>
                  <Link to={`${route}/about/faq`}>
                    <i className="fa-solid fa-question-circle"></i> FAQ
                  </Link>
                </li>
                <li>
                  <a target="blank" href="https://t.me/mkundalikuz">
                    <i className="fa-brands fa-telegram"></i> Yangiliklar
                  </a>
                </li>
              </ul>
            </div>

            {/* App Section */}
            <div className="col-12 col-md-4 col-lg-2 footer-col">
              <h5 className="footer-title">{t("ilova") || "Ilova"}</h5>
              <ul className="list-unstyled footer-links text-start">
                <li>
                  <a href="https://mdata.uz/download/mkundalik-android.apk" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-android"></i> Android APK
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => alert("iOS ilova hozircha mavjud emas, vaqtinchalik brauzerdan foydalaning.")}
                    className="btn-link text-decoration-none p-0 border-0 bg-transparent text-start"
                    style={{color: 'inherit', fontSize: 'inherit'}}
                  >
                    <i className="fa-brands fa-apple"></i> iOS App
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="col-12 col-md-4 col-lg-2 footer-col">
              <h5 className="footer-title">{t("contacts")}</h5>
              <ul className="list-unstyled footer-contact text-start">
                <li>
                  <a href="tel:+998712413140">
                    <i className="fa-solid fa-phone-volume"></i> +998 (71) 241-31-40
                  </a>
                </li>
                <li>
                  <a href="mailto:mkundalik@tashmetro.uz">
                    <i className="fa-solid fa-envelope-open-text"></i> mkundalik@tashmetro.uz
                  </a>
                </li>
                <li className="mt-3">
                  <span className="ctrl-enter-tip">
                    <i className="fa-solid fa-keyboard me-2"></i> {t("ctrlenter")}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-copyright mt-5 pt-3 border-top">
            <div className="row align-items-center">
              <div className="col-md-6 text-md-start">
                <span className="opacity-75">© 2025 "Toshkent Metropoliteni" DUK. {t("allrightsreserved")}.</span>
              </div>
              <div className="col-md-6 text-md-end d-flex align-items-center justify-content-md-end gap-3 mt-2 mt-md-0">
                <div className="version-info mb-5 d-flex align-items-center gap-2">
                  <span className="badge bg-secondary-subtle text-secondary border px-2 py-1" style={{fontSize: '11px'}}>
                    v{localStorage.getItem('app_version') || '2.0.7'}
                  </span>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('check-app-version'))}
                    className="btn btn-sm btn-outline-secondary py-0 px-2"
                    style={{fontSize: '11px'}}
                  >
                    <i className="fa-solid fa-sync fa-xs me-1"></i> {t("checkupdate") || "Yangilanishni tekshirish"}
                  </button>
                </div>
                {/* <p className="m-0 small opacity-75">Developed by A. Behruz</p> */}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;