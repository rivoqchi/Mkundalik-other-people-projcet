import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./Images/logo-png.png";
import noting from "./Images/noting.png";
import img1 from "./Images/Pinterest/image.png";
import img2 from "./Images/Pinterest/image2.png";
import img3 from "./Images/Pinterest/image3.png";
import img4 from "./Images/Pinterest/image4.png";
import LangSelect from "./LangSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faChartSimple, faBook, faCircleInfo, faPhoneVolume, faEnvelope, faGlobe } from "@fortawesome/free-solid-svg-icons";
import "./Main.scss";
import { useTranslation } from "react-i18next";

function Main() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isSignedIn = window.localStorage.getItem("isSignedIn") === "true";
  const [route, setRoute] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const role = window.localStorage.getItem("role");
    const roleMap = {
      admin: "/admin",
      employee: "/user",
      superadmin: "/superadmin",
      complex: "/complex",
      department: "/department",
      hr: "/hr",
      lang: "/lang",
      boss: "/boss",
      commission: "/commission",
      staff: "/staff",
      at: "/at",
      sport: "/sport"
    };
    if (role && roleMap[role]) {
      setRoute(roleMap[role]);
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="mainpg">
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="logo2"
        >
          <img src={logo} alt="logo" />
        </motion.div>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <a onClick={() => setIsOpen(false)} href="#">
            <li>{t("main")}</li>
          </a>
          <a onClick={() => setIsOpen(false)} href="#statistika">
            <li>{t("statistika")}</li>
          </a>
          <a onClick={() => setIsOpen(false)} href="/templates/instructions.pdf">
            <li>{t("instruction")}</li>
          </a>
          <LangSelect />

          {isSignedIn ? (
            <Link onClick={() => setIsOpen(false)} to={`${route}/dashboard`}>
              <button className="login-btn">{t("privatecab")}</button>
            </Link>
          ) : (
            <Link onClick={() => setIsOpen(false)} to="/login">
              <button className="login-btn">{t("privatecab")}</button>
            </Link>
          )}
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </div>
      </nav>

      <section className="hero container">
        <div className="row align-items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="col-lg-7"
          >
            <h1>MKUNDALIK.UZ</h1>
            <p>{t("axtizim")}</p>
            <div className="hero-btns">
              {isSignedIn ? (
                <Link to={`${route}/dashboard`}>
                  <button className="login-btn">{t("privatecab")}</button>
                </Link>
              ) : (
                <Link to="/login">
                  <button className="login-btn">{t("privatecab")}</button>
                </Link>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="col-lg-5 text-center mt-5 mt-lg-0"
          >
            <img src={noting} alt="Hero illustration" className="noting" />
          </motion.div>
        </div>
      </section>

      <section className="how-it-works container">
        <motion.div {...fadeInUp} className="section-title">
          <h2>{t("howdoesitwork")}?</h2>
          <p>{t("howdoesitworkdesc")}</p>
        </motion.div>

        <div className="how-it-works-grid">
          {[
            { img: img2, title: t("howdoesitworkdesc2"), desc: t("howdoesitworkdesc3"), icon: "1", reverse: false },
            { img: img3, title: t("howdoesitworkdesc4"), desc: t("howdoesitworkdesc5"), icon: "2", reverse: true },
            { img: img4, title: t("howdoesitworkdesc6"), desc: t("howdoesitworkdesc7"), icon: "3", reverse: false },
            { img: img1, title: t("howdoesitworkdesc8"), desc: t("howdoesitworkdesc9"), icon: "4", reverse: true }
          ].map((step, idx) => (
            <motion.div
              key={idx}
              {...fadeInUp}
              className={`work-step ${step.reverse ? 'reverse' : ''}`}
            >
              <div className="step-content">
                <span className="step-num">{idx + 1}</span>
                <h3>
                  <i>{step.icon}</i> {step.title}
                </h3>
                <p>{step.desc}</p>
              </div>
              <div className="step-image">
                <img src={step.img} alt={step.title} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="statistika" className="statistics container">
        <motion.div {...fadeInUp} className="section-title">
          <h2>{t("statistika")}</h2>
          <p>{t("tashmetroduk")}</p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="stats-container"
        >
          <motion.div variants={fadeInUp} className="stat-card">
            <h2>600+</h2>
            <p>{t("xodimlar")}</p>
          </motion.div>
          <motion.div variants={fadeInUp} className="stat-card">
            <h2>100k+</h2>
            <p>{t("wroten")}</p>
          </motion.div>
        </motion.div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src={logo} className="footer-logo" alt="logo" />
              <p>{t("aboutfooter")}</p>
            </div>

            <div className="footer-links">
              <h4>{t("links")}</h4>
              <ul>
                <li><Link to="/statistika"><FontAwesomeIcon icon={faChartSimple} /> {t("statistika")}</Link></li>
                <li><a href="/templates/instructions.pdf"><FontAwesomeIcon icon={faBook} /> {t("instruction")}</a></li>
                <li><Link to="/about"><FontAwesomeIcon icon={faCircleInfo} /> {t("dasturhaqida")}</Link></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>{t("contact")}</h4>
              <ul>
                <li><a href="tel:+998712413140"><FontAwesomeIcon icon={faPhoneVolume} /> +998 (71) 241-31-40</a></li>
                <li><a href="mailto:mkundalik@tashmetro.uz"><FontAwesomeIcon icon={faEnvelope} /> mkundalik@tashmetro.uz</a></li>
                <li style={{ color: 'var(--text-muted)' }}><FontAwesomeIcon icon={faGlobe} /> Toshkent - 2025</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>{t("allrightsreserved")}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Main;
