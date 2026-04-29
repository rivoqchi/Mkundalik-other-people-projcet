import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Images & Assets
import noting from "./Images/noting.png";
import img1 from "./Images/Pinterest/image.png";
import img2 from "./Images/Pinterest/image2.png";
import img3 from "./Images/Pinterest/image3.png";
import img4 from "./Images/Pinterest/image4.png";

// Components
import Navbarr from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "./Additional/ThemeContext";
import { useTranslation } from "react-i18next";

// Styles
import "./Main.scss";

function Main() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isSignedIn = window.localStorage.getItem("isSignedIn") === "true";

  useEffect(() => {
    // Initialize AOS with premium settings
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-back",
      offset: 100
    });
  }, []);

  const getDashboardLink = () => {
    const role = window.localStorage.getItem("role");
    const roleRoutes = {
      admin: "/admin/dashboard",
      employee: "/user/dashboard",
      superadmin: "/superadmin/dashboard",
      complex: "/complex/dashboard",
      department: "/department/dashboard",
      hr: "/hr/dashboard",
      lang: "/lang/dashboard",
      boss: "/boss/dashboard",
      commission: "/commission/dashboard",
      staff: "/staff/dashboard",
      at: "/at/dashboard",
      sport: "/sport/dashboard"
    };
    return roleRoutes[role] || "/";
  };

  const route = getDashboardLink();

  const stats = [
    { val: "600+", label: t("xodimlar"), icon: "fa-users-gear" },
    { val: "100k+", label: t("wroten"), icon: "fa-database" },
    { val: "100%", label: t("digitalized"), icon: "fa-microchip" }
  ];

  return (
    <div className={`mainpg ${theme === "dark" ? "dark-mode" : "light-mode"}`}>
      <Navbarr />

      {/* --- HERO: BOLD & CREATIVE --- */}
      <section className="hero-creative">
        <div className="hero-content" data-aos="zoom-out-up">
          <div className="hero-badge">
             <span className="pulse"></span>
            <span>{t("tashmetroduk")}</span>
          </div>
          <h1 className="hero-title">MKUNDALIK<span className="accent-dot">.</span>UZ</h1>
          <p className="hero-subtitle">{t("axtizim")}</p>
          <div className="hero-buttons">
            {isSignedIn ? (
              <Link to={route} className="btn-premium">
                <span>{t("privatecab")}</span>
                <i className="fa-solid fa-arrow-right-long"></i>
              </Link>
            ) : (
              <Link to="/login" className="btn-premium">
                <span>{t("privatecab")}</span>
                <i className="fa-solid fa-arrow-right-long"></i>
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image-wrapper" data-aos="fade-left" data-aos-delay="300">
           <img src={noting} alt="Hero Mockup" />
           <div className="blob-bg"></div>
        </div>
      </section>

      {/* --- DYNAMIC FEATURES SECTION --- */}
      <section id="features" className="features-section">
        <div className="section-title" data-aos="fade-up">
          <span className="sub-title">{t("process")}</span>
          <h2>{t("howdoesitwork")}?</h2>
          <p>{t("howdoesitworkdesc")}</p>
        </div>

        <div className="features-grid">
          <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
            <div className="card-number">01</div>
            <div className="card-icon"><i className="fa-solid fa-user-plus"></i></div>
            <h3>{t("howdoesitworkdesc2")}</h3>
            <p>{t("howdoesitworkdesc3")}</p>
            <div className="img-container">
               <img src={img2} alt="Step 1" className="feature-img" />
            </div>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
            <div className="card-number">02</div>
            <div className="card-icon"><i className="fa-solid fa-pen-to-square"></i></div>
            <h3>{t("howdoesitworkdesc4")}</h3>
            <p>{t("howdoesitworkdesc5")}</p>
            <div className="img-container">
              <img src={img3} alt="Step 2" className="feature-img" />
            </div>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
            <div className="card-number">03</div>
            <div className="card-icon"><i className="fa-solid fa-check-double"></i></div>
            <h3>{t("howdoesitworkdesc6")}</h3>
            <p>{t("howdoesitworkdesc7")}</p>
            <div className="img-container">
              <img src={img4} alt="Step 3" className="feature-img" />
            </div>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="400">
            <div className="card-number">04</div>
            <div className="card-icon"><i className="fa-solid fa-chart-line"></i></div>
            <h3>{t("howdoesitworkdesc8")}</h3>
            <p>{t("howdoesitworkdesc9")}</p>
            <div className="img-container">
              <img src={img1} alt="Step 4" className="feature-img" />
            </div>
          </div>
        </div>
      </section>

      {/* --- IMPACT STATISTICS: CREATIVE REDESIGN --- */}
      <section id="statistika" className="stats-section">
        <div className="section-title" data-aos="fade-up">
           <span className="sub-title">{t("impact")}</span>
           <h2>{t("statistika")}</h2>
        </div>
        <div className="stats-creative">
          {stats.map((item, idx) => (
             <div className="stat-card-tech" key={idx} data-aos="zoom-in-up" data-aos-delay={idx * 150}>
                <div className="stat-glow"></div>
                <div className="stat-icon-wrapper">
                   <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <div className="stat-val">{item.val}</div>
                <div className="stat-label">{item.label}</div>
             </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Main;