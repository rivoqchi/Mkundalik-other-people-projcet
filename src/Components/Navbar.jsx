import React, { useEffect, useState } from "react";
import { Container, Modal, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API } from "../config";
import { useTranslation } from "react-i18next";
import { useTheme } from "./Additional/ThemeContext";
import logo from "./Images/logo-png.png";
import WeatherAside from "./WeatherAside";

const Navbarr = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const isSignedIn = window.localStorage.getItem("isSignedIn") === "true";
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = async () => {
    try {
      await axios.get(`${API}/auth/logout`, { withCredentials: true });
      window.localStorage.clear();
      window.location.replace('/');
    } catch (error) {
      window.localStorage.clear();
      window.location.replace('/');
    }
  };

  const dashboardLink = () => {
    const role = window.localStorage.getItem("role");
    const paths = {
      admin: "/admin/dashboard",
      superadmin: "/superadmin/dashboard",
      employee: "/user/dashboard",
      hr: "/hr/dashboard",
      complex: "/complex/dashboard",
      department: "/department/dashboard",
      boss: "/boss/dashboard",
      at: "/at/dashboard",
      sport: "/sport/dashboard"
    };
    return paths[role] || "/";
  };

  const languages = [
    { code: 'uz', flag: '🇺🇿', label: 'O‘zbek' },
    { code: 'uz_cyr', flag: '🇺🇿', label: 'Ўзбек' },
    { code: 'ru', flag: '🇷🇺', label: 'Русский' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`premium-nav-modern ${scrolled ? 'scrolled' : ''} ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}
      >
        <div className="nav-container-3col">
          {/* LEFT: LOGO */}
          <div className="nav-left">
            <Link to="/" className="logo-link">
              <img src={logo} alt="Logo" />
            </Link>
          </div>

          {/* CENTER: LINKS */}
          <div className="nav-center d-none d-lg-flex">
            <ul className="nav-links-centered">
              <li><Link to="/">{t("main")}</Link></li>
              <li>
                {isHomePage ? <a href="#statistika">{t("statistika")}</a> : <Link to="/#statistika">{t("statistika")}</Link>}
              </li>
              <li><Link to="/about">{t("aboutus")}</Link></li>
              <li><a href="/templates/instructions.pdf" target="_blank" rel="noopener noreferrer">{t("instruction")}</a></li>
            </ul>
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="nav-right">
            <div className="d-none d-md-block">
              <div className="lang-switcher-v2">
                <button className="lang-toggle-btn" onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}>
                  <span>{languages.find(l => l.code === i18n.language)?.flag || '🇺🇿'}</span>
                  <i className={`fa-solid fa-chevron-down ms-1 ${langOpen ? 'rotate-180' : ''}`}></i>
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="lang-dropdown-v2">
                      {languages.map(l => (
                        <div key={l.code} className="lang-opt" onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); }}>
                          <span className="me-2">{l.flag}</span>
                          <span className="text-uppercase small fw-bold">{l.label}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="theme-toggle-v2" onClick={(e) => { e.stopPropagation(); toggleTheme(); }}>
               <motion.div 
                 className="switch-handle"
                 animate={{ x: theme === 'dark' ? 22 : 0 }}
                 transition={{ type: "spring", stiffness: 500, damping: 30 }}
               >
                  <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
               </motion.div>
            </div>

            <div className="action-group-mobile">
              {isSignedIn && (
                <button className="btn-logout-minimal d-none d-md-flex" onClick={(e) => { e.stopPropagation(); setShowLogout(true); }}>
                   <i className="fa-solid fa-power-off"></i>
                </button>
              )}
              
              {!isSignedIn && (
                <Link to="/login" className="btn-modern-action d-none d-lg-flex" style={{textDecoration: 'none'}}>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  <span className="ms-2">{t("entertocabinet")}</span>
                </Link>
              )}

              {isSignedIn && (
                <Link to={dashboardLink()} className="btn-modern-action d-none d-lg-flex" style={{textDecoration: 'none'}}>
                  <i className="fa-solid fa-user-circle"></i>
                  <span className="ms-2">{window.localStorage.getItem("fullName")?.split(' ')[0]}</span>
                </Link>
              )}
              
              <button className="mobile-burger-v2 d-lg-none" onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}>
                <i className="fa-solid fa-bars-staggered"></i>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE OVERLAY MOVED OUTSIDE FOR FULL-SCREEN SUPPORT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className={`mobile-overlay-v2 ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}
          >
            <div className="mobile-ov-header">
               <img src={logo} alt="logo" />
               <button className="ov-close-btn" onClick={() => setIsOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
               </button>
            </div>



            <motion.div 
              className="mobile-ov-links"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
              }}
            >
               {[
                 { to: "/", label: t("main"), icon: "fa-solid fa-house" },
                 { to: "#statistika", label: t("statistika"), isAnchor: true, icon: "fa-solid fa-chart-pie" },
                 { to: "/about", label: t("aboutus"), icon: "fa-solid fa-circle-info" },
                 { to: "/templates/instructions.pdf", label: t("instruction"), isExternal: true, icon: "fa-solid fa-file-pdf" },
                 isSignedIn ? { to: dashboardLink(), label: "DASHBOARD", icon: "fa-solid fa-chart-line" } : { to: "/login", label: t("entertocabinet"), icon: "fa-solid fa-arrow-right-to-bracket" }
               ].map((link, i) => (
                 <motion.div
                   key={i}
                   variants={{
                     hidden: { opacity: 0, y: 20 },
                     visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
                   }}
                 >
                    <div className="ov-link-card">
                      {link.isAnchor ? (
                        <a href={link.to} onClick={() => setIsOpen(false)}>
                          <i className={link.icon}></i>
                          <span>{link.label}</span>
                        </a>
                      ) : link.isExternal ? (
                        <a href={link.to} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                          <i className={link.icon}></i>
                          <span>{link.label}</span>
                        </a>
                      ) : (
                        <Link to={link.to} onClick={() => setIsOpen(false)}>
                          <i className={link.icon}></i>
                          <span>{link.label}</span>
                        </Link>
                      )}
                    </div>
                 </motion.div>
               ))}
            </motion.div>
            <div className="mx-3 mt-2">
               <WeatherAside onClick={() => setIsOpen(false)} />
            </div>
            <div className="mobile-ov-footer">
               <div className="ov-actions-grid">
                  <div className="ov-action-item">
                     <p>{t("language")}</p>
                     <div className="d-flex gap-2">
                        {languages.map(l => (
                          <button key={l.code} onClick={() => i18n.changeLanguage(l.code)} className={`flag-btn ${i18n.language === l.code ? 'active' : ''}`}>
                             {l.flag}
                          </button>
                        ))}
                     </div>
                  </div>
                  <div className="ov-action-item">
                     <p>{t("theme")}</p>
                     <div className="theme-toggle-v2" onClick={(e) => { e.stopPropagation(); toggleTheme(); }}>
               <motion.div 
                 className="switch-handle"
                 animate={{ x: theme === 'dark' ? 22 : 0 }}
                 transition={{ type: "spring", stiffness: 500, damping: 30 }}
               >
                  <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
               </motion.div>
            </div>
                  </div>
               </div>
               {isSignedIn && (
                 <button className="ov-logout-btn" onClick={() => { setIsOpen(false); setShowLogout(true); }}>
                    <i className="fa-solid fa-power-off me-2"></i> {t("logOut")}
                 </button>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal centered show={showLogout} onHide={() => setShowLogout(false)} className="modern-modal-v2">
        <Modal.Header closeButton>
          <Modal.Title className="fw-900">{t("logOut")}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
           <div className="modal-icon-warn">
              <i className="fa-solid fa-triangle-exclamation"></i>
           </div>
           <h4 className="mt-4 fw-800">{t("profildanchiqmoqchimisiz")}</h4>
        </Modal.Body>
        <Modal.Footer className="justify-content-center gap-3 border-0">
          <Button variant="outline-secondary" className="px-5 rounded-pill fw-bold" onClick={() => setShowLogout(false)}>
            {t("bekorqilish")}
          </Button>
          <Button variant="danger" className="px-5 rounded-pill fw-bold" onClick={logout}>
            {t("logOut")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Navbarr;