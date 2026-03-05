import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signIn } from './CheckAuth';
import logomk from '../Images/logo-png.png';
import { useLoading } from "../Additional/LoadingScreen";
import Alert from '../Additional/Alert';
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import Agreement from '../Agreement';
import './Login.scss';

const Login = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const canvasRef = useRef(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "", trigger: 0 });
  const [values, setValues] = useState({ phone: '', password: '', captchaToken: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [tempUserData, setTempUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { phone, password, captchaToken } = values;
  const from = location.state?.from;

  useEffect(() => {
    if (window.localStorage.getItem("force_security_refresh")) {
      window.localStorage.removeItem("force_security_refresh");
      window.location.reload();
    }
  }, []);

  // Interactive Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const particleCount = 100;
    const mouse = { x: null, y: null, radius: 150 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.color = `rgba(99, 102, 241, ${Math.random() * 0.5 + 0.2})`;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') clickSubmit(event);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onCaptchaChange = (token) => {
    setValues({ ...values, captchaToken: token });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    if (!phone || !password) {
      setAlert(prev => ({
        show: true,
        type: "info",
        message: "Ma'lumotlarni to'ldiring!",
        trigger: prev.trigger + 1
      }));
      return;
    }

    setLoading(true);
    const fullPhone = phone.startsWith('+998') ? phone : '+998' + phone;
    const isLogina = location.pathname === '/logina';

    signIn({ phone: fullPhone, password, captchaToken, loginType: isLogina ? 'admin' : 'user' })
      .then((data) => {
        if (data.captchaRequired) {
          setLoading(false);
          setShowCaptcha(true);
          setAlert(prev => ({
            show: true,
            type: "warning",
            message: "Xavfsizlik tekshiruvidan o'ting.",
            trigger: prev.trigger + 1
          }));
        } else if (data.locked) {
          setLoading(false);
          setAlert(prev => ({
            show: true,
            type: "error",
            message: data.error,
            trigger: prev.trigger + 1
          }));
        } else if (data.error) {
          setLoading(false);
          setAlert(prev => ({
            show: true,
            type: "error",
            message: data.error,
            trigger: prev.trigger + 1
          }));
        } else {
          // Check for agreement
          if (!data.employee.agree) {
            setTempUserData(data);
            setLoading(false);
            setShowAgreement(true);
            return;
          }

          completeSignIn(data);
        }
      })
      .catch((err) => {
        setLoading(false);
        const errMsg = err.response?.data?.error || "Serverda xatolik yuz berdi!";
        setAlert(prev => ({
          show: true,
          type: "error",
          message: errMsg,
          trigger: prev.trigger + 1
        }));
      });
  };

  const completeSignIn = (data) => {
    window.localStorage.setItem("fullName", data.employee.name);
    window.localStorage.setItem("degree", data.employee.degree);
    window.localStorage.setItem("phone", data.employee.phone);
    window.localStorage.setItem("role", data.employee.role);
    window.localStorage.setItem("user_id", data.employee._id);
    window.localStorage.setItem("isSignedIn", "true");

    if (from) {
      navigate(from, { replace: true });
      return;
    }

    const dashboardRoutes = {
      employee: "/user/dashboard",
      admin: "/admin/dashboard",
      superadmin: "/superadmin/dashboard",
      complex: "/complex/dashboard",
      department: "/department/dashboard",
      hr: "/hr/dashboard",
      lang: "/lang/dashboard",
      commission: "/commission/dashboard",
      sport: "/sport/dashboard",
      at: "/at/dashboard",
      boss: "/boss/dashboard"
    };
    navigate(dashboardRoutes[data.employee.role] || "/", { replace: true });
  }

  const handleAgreementAccept = async () => {
    if (!tempUserData) return;
    setLoading(true);
    try {
      await axios.put(`/auth/accept-agreement/${tempUserData.employee._id}`);
      setShowAgreement(false);
      completeSignIn(tempUserData);
    } catch (error) {
      setLoading(false);
      setAlert(prev => ({
        show: true,
        type: "error",
        message: "Xatolik yuz berdi!",
        trigger: prev.trigger + 1
      }));
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 12, stiffness: 100 } }
  };

  return (
    <div className="login-page-premium">
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="ambient-glows">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
        <div className="glow glow-3"></div>
      </div>

      <div className="split-layout">
        {/* Visual Side */}
        <motion.div
          className="visual-side"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="cyber-core-container">
            <div className="core-rings"></div>
            <div className="core-orb"></div>
          </div>
          <div className="visual-text">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <img src={logomk} alt="Logo" />
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {t("xizfoytizkir")}
            </motion.p>
          </div>
        </motion.div>

        {/* Form Side */}
        <div className="form-side">
          <motion.div
            className="login-card-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="login-header-premium" variants={itemVariants}>
              <div className="logo-badge">
                <img src={logomk} alt="Logo" />
              </div>
              <h1>Kirish</h1>
              <p className="subtitle">Tizimga kirish uchun ma'lumotlarni kiriting</p>
            </motion.div>

            <form onSubmit={clickSubmit} className="auth-form-premium">
              <motion.div className="input-wrapper-cyber" variants={itemVariants}>
                <label className="cyber-label">Telefon raqam</label>
                <div className="field-icon"><i className="fa-solid fa-phone-volume"></i></div>
                <input
                  type="text"
                  className="input-field"
                  placeholder="99 XXX XX XX"
                  value={phone.startsWith('+998') ? phone.slice(4) : phone}
                  onChange={(e) => setValues({ ...values, phone: e.target.value })}
                  onKeyDown={handleKeyDown}
                />
              </motion.div>

              <motion.div className="input-wrapper-cyber" variants={itemVariants}>
                <label className="cyber-label">Parol</label>
                <div className="field-icon"><i className="fa-solid fa-shield-keyhole"></i></div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={handleChange('password')}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={togglePasswordVisibility}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </motion.div>

              {showCaptcha && (
                <motion.div
                  className="captcha-container-premium"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                >
                  <ReCAPTCHA
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    onChange={onCaptchaChange}
                    theme="dark"
                  />
                </motion.div>
              )}

              <motion.button
                className="btn-cyber-submit"
                type="submit"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="shimmer"></div>
                <span>TIZIMGA KIRISH</span>
                <i className="fa-solid fa-bolt-lightning"></i>
              </motion.button>
            </form>

            <motion.div className="login-bottom-info" variants={itemVariants}>
              <div className="divider"></div>
              <div className="security-indicator">
                <div className="status-dot"></div>
                <span>SSL SHIFRLANGAN ULANISH</span>
              </div>
              <p className="signup-prompt">
                <Link to='/signup'>{t("signup")}</Link>
              </p>

              <p className="signup-prompt"><Link to='/'>{t("homega")}</Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="alert-fixed-container"
          >
            <Alert
              type={alert.type}
              message={alert.message}
              trigger={alert.trigger}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Agreement
        show={showAgreement}
        onAccept={handleAgreementAccept}
        onCancel={() => setShowAgreement(false)}
      />
    </div>
  );
};

export default Login;
