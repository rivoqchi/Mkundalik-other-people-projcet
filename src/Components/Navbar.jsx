import React, { useEffect, useState, useRef } from "react";
import { Container, Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API } from "../config";
import { useTranslation } from "react-i18next";
import cookies from "js-cookie";
import { useTheme } from "./Additional/ThemeContext";
import logo from "./Images/logo-png.png";

const Navbarr = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [role, setRole] = useState(window.localStorage.getItem("role"));
  const [isOpen, setIsOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const isSignedIn = window.localStorage.getItem("isSignedIn") === "true";

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);

      // Update dynamic height variable for Aside/Content sync
      document.documentElement.style.setProperty('--nav-current-height', isScrolled ? '70px' : '85px');
    };

    // Set initial height
    document.documentElement.style.setProperty('--nav-current-height', '85px');

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

  const getDashboardLink = () => {
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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const languages = [
    { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
    { code: 'uz_cyr', name: "Ўзбек", flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`cyber-navbar ${scrolled ? 'scrolled' : ''} theme-${theme}`}
    >
      <style>{`
                .cyber-navbar {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    z-index: 1000;
                    height: 85px;
                    display: flex;
                    align-items: center;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    background: ${theme === 'dark' ? 'rgba(2, 6, 23, 0.85)' : 'rgba(255, 255, 255, 0.8)'};
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-bottom: 1px solid var(--border-cyber);
                }
                
                .cyber-navbar.scrolled {
                    height: 70px;
                    background: var(--nav-bg);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }

                .nav-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    max-width: none !important;
                    padding: 0 40px;
                    width: 100%;
                }
                .logo-section img {
                    height: 40px;
                    filter: drop-shadow(0 0 8px var(--accent-glow));
                    transition: transform 0.3s;
                }
                .logo-section:hover img {
                    transform: scale(1.1) rotate(-5deg);
                }
                .nav-menu {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    flex-grow: 1;
                    justify-content: flex-end;
                }
                .nav-link-cyber {
                    position: relative;
                    color: var(--text-primary);
                    font-weight: 600;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    padding: 5px 0;
                    transition: color 0.3s;
                }
                .nav-link-cyber::after {
                    content: '';
                    position: absolute;
                    bottom: 0; left: 0; width: 0; height: 2px;
                    background: var(--accent-primary);
                    transition: width 0.3s;
                    box-shadow: 0 0 10px var(--accent-glow);
                }
                .nav-link-cyber:hover::after {
                    width: 100%;
                }
                .nav-link-cyber:hover {
                    color: var(--accent-primary);
                }

                /* Theme Toggle */
                .theme-toggle-cyber {
                    width: 50px;
                    height: 26px;
                    background: var(--bg-surface);
                    border-radius: 20px;
                    border: 1px solid var(--border-cyber);
                    position: relative;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 0 4px;
                }
                .toggle-orb {
                    width: 18px;
                    height: 18px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    box-shadow: 0 0 15px var(--accent-glow);
                }

                /* Lang Switcher */
                .lang-switcher-cyber {
                    position: relative;
                }
                .lang-btn {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-cyber);
                    padding: 6px 12px;
                    border-radius: 12px;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .lang-btn:hover {
                    border-color: var(--accent-primary);
                    background: var(--accent-glow);
                }
                .lang-dropdown {
                    position: absolute;
                    top: calc(100% + 10px);
                    right: 0;
                    background: var(--bg-card);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid var(--border-cyber);
                    border-radius: 16px;
                    padding: 8px;
                    min-width: 150px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }
                .lang-item {
                    padding: 8px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .lang-item:hover {
                    background: var(--bg-surface);
                    color: var(--accent-primary);
                }

                .cabinet-btn {
                    background: linear-gradient(90deg, var(--accent-primary), #8b5cf6);
                    color: white !important;
                    padding: 10px 24px;
                    border-radius: 12px;
                    font-weight: 700;
                    border: none;
                    box-shadow: 0 4px 15px var(--accent-glow);
                    transition: all 0.3s;
                }
                .cabinet-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px var(--accent-glow);
                }
                
                @media (max-width: 991px) {
                    .nav-menu { display: none; }
                    .mobile-toggle { display: block; }
                    .nav-container { padding: 0 20px; }
                }
                
                .mobile-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100vh;
                    background: var(--bg-primary);
                    z-index: 2000;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 30px;
                }
                .mobile-link {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    text-transform: uppercase;
                    letter-spacing: 4px;
                }
                .mobile-close {
                    position: absolute;
                    top: 30px; 
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    background: rgba(var(--accent-primary-rgb), 0.1);
                    border: 1px solid var(--border-cyber);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--accent-primary);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 0 15px rgba(var(--accent-primary-rgb), 0.1);
                }
                .mobile-close:hover {
                    transform: rotate(90deg) scale(1.1);
                    background: var(--accent-primary);
                    color: white;
                    box-shadow: 0 0 20px var(--accent-glow);
                }
                .mobile-logout-btn {
                    margin-top: 20px;
                    padding: 12px 30px;
                    border-radius: 50px;
                    background: rgba(220, 38, 38, 0.1);
                    border: 1px solid rgba(220, 38, 38, 0.3);
                    color: #ef4444;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s;
                }
                .mobile-logout-btn:hover {
                    background: #ef4444;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
                }
            `}</style>


      <Container className="nav-container">
        <Link to="/" className="logo-section">
          <img src={logo} alt="Kundalik" />
        </Link>

        <ul className="nav-menu">
          <li><Link to="/" className="nav-link-cyber">{t("main")}</Link></li>
          <li><Link to="/about" className="nav-link-cyber">BIZ_HAQIMIZDA</Link></li>
          <li><a href="/templates/instructions.pdf" className="nav-link-cyber">{t("instruction")}</a></li>

          <div className="d-flex align-items-center gap-3">
            {/* Theme Switcher */}
            <div className="theme-toggle-cyber" onClick={toggleTheme}>
              <motion.div
                className="toggle-orb"
                animate={{ x: theme === 'dark' ? 22 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} text-white`} style={{ fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}></i>
              </motion.div>
            </div>

            {/* Lang Switcher */}
            <div className="lang-switcher-cyber">
              <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
                <span>{languages.find(l => l.code === i18n.language)?.flag || '🇺🇿'}</span>
                <i className={`fa-solid fa-chevron-down ms-1 small ${langOpen ? 'rotate-180' : ''}`}></i>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="lang-dropdown"
                  >
                    {languages.map(lang => (
                      <div key={lang.code} className="lang-item" onClick={() => changeLanguage(lang.code)}>
                        <span>{lang.flag}</span>
                        <span className="small fw-bold">{lang.name}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isSignedIn ? (
              <div className="d-flex align-items-center gap-2">
                <Link to={getDashboardLink()} className="nav-link-cyber me-2" style={{ fontSize: '0.8rem' }}>
                  <i className="fa-solid fa-user-circle me-1"></i>
                  {window.localStorage.getItem("fullName")?.split(' ')[0]}
                </Link>
                <button
                  className="btn btn-sm btn-outline-danger rounded-circle"
                  onClick={() => setShowLogout(true)}
                  style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i className="fa-solid fa-power-off"></i>
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="cabinet-btn">{t("entertocabinet")}</button>
              </Link>
            )}
          </div>
        </ul>

        <div className="mobile-toggle d-lg-none">
          <button className="btn text-primary" onClick={() => setIsOpen(true)}>
            <i className="fa-solid fa-bars-staggered fa-lg"></i>
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mobile-overlay"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mobile-close"
                onClick={() => setIsOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </motion.button>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Link to="/" className="mobile-link" onClick={() => setIsOpen(false)}>{t("main")}</Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Link to="/about" className="mobile-link" onClick={() => setIsOpen(false)}>BIZ_HAQIMIZDA</Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Link to={getDashboardLink()} className="mobile-link" onClick={() => setIsOpen(false)}>DASHBOARD</Link>
              </motion.div>

              <div className="d-flex gap-4 mt-5">
                <div className="theme-toggle-cyber" onClick={toggleTheme}>
                  <motion.div
                    className="toggle-orb"
                    animate={{ x: theme === 'dark' ? 22 : 0 }}
                  >
                    <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} text-white`} style={{ fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}></i>
                  </motion.div>
                </div>
                <div className="d-flex gap-2">
                  {languages.map(l => (
                    <button key={l.code} onClick={() => changeLanguage(l.code)} className="btn btn-sm btn-outline-primary border-0" style={{ fontSize: '1.2rem' }}>
                      {l.flag}
                    </button>
                  ))}
                </div>
              </div>

              {isSignedIn && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mobile-logout-btn"
                  onClick={() => {
                    setIsOpen(false);
                    setShowLogout(true);
                  }}
                >
                  <i className="fa-solid fa-power-off"></i>
                  {t("logOut")}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </Container>

      {/* Logout Modal */}
      <Modal centered show={showLogout} onHide={() => setShowLogout(false)} className="cyber-modal">
        <style>{`
                    .cyber-modal .modal-content {
                        background: var(--bg-card);
                        backdrop-filter: blur(20px);
                        border: 1px solid var(--border-cyber);
                        border-radius: 24px;
                        color: var(--text-primary);
                    }
                    .cyber-modal .modal-header { border-bottom: 1px solid rgba(255,255,255,0.05); }
                    .cyber-modal .modal-footer { border-top: 1px solid rgba(255,255,255,0.05); }
                `}</style>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{t("logOut")}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <i className="fa-solid fa-triangle-exclamation fa-3x text-warning mb-3"></i>
          <p className="h5">{t("profildanchiqmoqchimisiz")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" className="rounded-pill px-4" onClick={() => setShowLogout(false)}>
            {t("bekorqilish")}
          </Button>
          <Button variant="danger" className="rounded-pill px-4" onClick={logout}>
            {t("logOut")}
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.nav>
  );
};

export default Navbarr;