import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./Images/logo-png.png";
import noting from "./Images/noting.png";
import avatar from "./Images/avatar.png";
import img1 from "./Images/Pinterest/image.png";
import img2 from "./Images/Pinterest/image2.png";
import img3 from "./Images/Pinterest/image3.png";
import img4 from "./Images/Pinterest/image4.png";
import LangSelect from "./LangSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Main.scss";
import Navbarr from "./Navbar";
import { useTranslation } from "react-i18next";
function Main() {
  const [isOpen, setIsOpen] = useState(false);
  let isSignedIn = window.localStorage.getItem("token") ? true : false;
  const [route, setRoute] = useState("");

  const { t } = useTranslation();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
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
    }
  }, []);


  return (
    <div className="navvv mainpg ">


      <nav className="nav">
        <div className="logo2">
          <img src={logo} alt="logo" />
        </div>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <a onClick={() => setIsOpen(false)} href="#">
            <li>{t("main")}</li>
          </a>
          <a onClick={() => setIsOpen(false)} href="#statistika">
            <li>{t("statistika")}</li>
          </a>
          <a
            onClick={() => setIsOpen(false)}
            href="/templates/instructions.pdf"
          >
            <li>{t("instruction")}</li>
          </a>
          <LangSelect />
          
          <Link onClick={() => setIsOpen(false)} to="/login">
                <button className="login-btn">{t("privatecab")}</button>
              </Link>
          {/* {isSignedIn ? (
            <Link onClick={() => setIsOpen(false)} to={`${route}/dashboard`}>
                <button className="login-btn">{t("privatecab")}</button>
                </Link>
          ) : (
            <Link onClick={() => setIsOpen(false)} to="/login">
              <button className="login-btn">{t("privatecab")}</button>
            </Link>
          )} */}
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </div>
      </nav>
      <div className="row mt-5 mb-5 align-items-center">
        <div className="col-12 col-md-6 text-center">
          <header className="hero">
            <h1>MKUNDALIK.UZ</h1>
            <p>{t("axtizim")}
            </p>
              <Link onClick={() => setIsOpen(false)} to="/login">
                <button className="login-btn">{t("privatecab")}</button>
              </Link>
            {/* {isSignedIn ? (
              <Link onClick={() => setIsOpen(false)} to={`${route}/dashboard`}>
                <button className="login-btn">{t("privatecab")}</button>
              </Link>
            ) : (
              <Link onClick={() => setIsOpen(false)} to="/login">
                <button className="login-btn">{t("privatecab")}h</button>
              </Link>
            )} */}
          </header>
        </div>
        <div className="col-12 col-md-6 text-center w100">
          <img src={noting} alt="Noting" className="noting" />
        </div>
      </div>

      <div className="bu-qanday-ishlaydi hero">
        <h1>{t("howdoesitwork")}?</h1>
        <p>
          {t("howdoesitworkdesc")}:
        </p>

        <div className="row howdoesitwork align-items-center">
          <div className="col-12 col-md-6 align-items-center">
            <h2 className="how22">
              <i class="fa-solid fa-1"></i> {t("howdoesitworkdesc2")}
            </h2>
            <p>
            {t("howdoesitworkdesc3")}.
            </p>
          </div>
          <div className="col-12 col-md-6 align-items-center">
            <img className="noting2" src={img2} alt="" />
          </div>
        </div>

        <div className="row howdoesitwork align-items-center">
          <div className="col-12 col-md-6 align-items-center">
            <img className="noting2" src={img3} alt="" />
          </div>
          <div className="col-12 col-md-6 align-items-center">
            <h2 className="how22">
              <i class="fa-solid fa-2"></i> {t("howdoesitworkdesc4")}
            </h2>
            <p>
            {t("howdoesitworkdesc5")}.
            </p>
          </div>
        </div>

        <div className="row howdoesitwork align-items-center">
          <div className="col-12 col-md-6 align-items-center">
            <h2 className="how22">
              <i class="fa-solid fa-3"></i> {t("howdoesitworkdesc6")}
            </h2>
            <p>
            {t("howdoesitworkdesc7")}.
            </p>
          </div>
          <div className="col-12 col-md-6 align-items-center">
            <img className="noting2" src={img4} alt="" />
          </div>
        </div>

        <div className="row howdoesitwork align-items-center">
          <div className="col-12 col-md-6 align-items-center">
            <img className="noting2" src={img1} alt="" />
          </div>
          <div className="col-12 col-md-6 align-items-center">
            <h2 className="how22">
              <i class="fa-solid fa-4"></i> {t("howdoesitworkdesc8")}
            </h2>
            <p>
            {t("howdoesitworkdesc9")}.
            </p>
          </div>
        </div>
      </div>

      <div id="statistika" className="statistics hero">
        <h1>{t("statistika")}</h1>
        <p>{t("tashmetroduk")}</p>
        <div className="statistics-main text-center">
          <div className="statistics-main2">
            <h1 className="son">650+</h1> <p>{t("xodimlar")}</p>
          </div>
          <div className="statistics-main2">
            <h1 className="son">22000+</h1> <p>{t("wroten")}</p>
          </div>
        </div>
        {/* <div className="row">
          <div className="eng-faollar col-12 col-md-4 text-start justify-content-center align-items-center">
            <div className="eng-faol d-flex justify-content-center align-items-center">
              <img src={avatar} className="avatar" alt="avatar" />
              <div className="infooo">
                <span>Behruz Abdurakhimov</span>
                <br />
                <span>
                  <i>Tizim administratori</i>
                </span>
                <br />
                <span className="yellowword">45 ta hisobot</span>
              </div>
            </div>
          </div>
          <div className="eng-faollar col-12 col-md-4 text-start justify-content-center align-items-center">
            <div className="eng-faol d-flex justify-content-center align-items-center">
              <img src={avatar} className="avatar" alt="avatar" />
              <div className="infooo">
                <span>Feruz Topshpo`latov</span>
                <br />
                <span>
                  <i>Xizmat boshlig`i</i>
                </span>
                <br />
                <span className="yellowword">40 ta hisobot</span>
              </div>
            </div>
          </div>
          <div className="eng-faollar col-12 col-md-4 text-start justify-content-center align-items-center">
            <div className="eng-faol d-flex justify-content-center align-items-center">
              <img src={avatar} className="avatar" alt="avatar" />
              <div className="infooo">
                <span>John Doe</span>
                <br />
                <span>
                  <i>Muhandis</i>
                </span>
                <br />
                <span className="yellowword">39 ta hisobot</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <footer className="footer row mb-4">
        <div className="col-12 col-md-4 text-start">
          <img src={logo} className="footer-logo" alt="logo" />
          <p>
          {t("aboutfooter")}
          </p>
        </div>
        <div className="col-12 col-md-4">
          <ul className="list-unstyled bbg text-start">
            <li>
              <Link to="/statistika">
                <i class="fa-solid fa-chart-simple"></i> {t("statistika")}
              </Link>
            </li>
            <li>
              <Link to="/templates/instructions.pdf">
                <i class="fa-solid fa-book"></i> {t("dasfoyyoriq")}
              </Link>
            </li>
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
    </div>
  );
}

export default Main;
