import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import logo from "../Images/logo2.png";
import { useTranslation } from "react-i18next";

const LoadingScreen = ({ loading = true }) => {
  const { t } = useTranslation();

  const messages = [
    t("please_wait"),
    t("loading"),
    t("one_second"),
  ];

  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [visible, setVisible] = useState(loading);

  // 🔁 Matnlar almashishi
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setCurrentMessage(prev => {
        const nextIndex = (messages.indexOf(prev) + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [loading, messages]);

  // ⏱ 20 soniya timeout
  useEffect(() => {
    if (!loading) return;

    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 40000);

    return () => clearTimeout(timer);
  }, [loading]);

  // 🎬 Fade in / fade out boshqaruvi
  useEffect(() => {
    if (loading) {
      setVisible(true);
    } else {
      // 0.2s animatsiya tugagach yo‘qoladi
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleBackHome = () => {
    window.location.replace("/");
  };

  if (!visible) return null;

  return (
    <div className={`premium-loader-overlay ${loading ? "fade-in" : "fade-out"}`}>
      <div className="loader-ambient-glows">
        <div className="loader-glow g1"></div>
        <div className="loader-glow g2"></div>
      </div>

      <div className="premium-loader-content">
        <div className="loader-visual-container">
          <div className="orbit-rings">
            <div className="ring r1"></div>
            <div className="ring r2"></div>
            <div className="ring r3"></div>
          </div>
          <div className="logo-core">
            <img src={logo} alt="Logo" className="loader-logo-img" />
            <div className="core-shimmer"></div>
          </div>
        </div>

        <div className="loader-info-section">
          {!timeoutReached ? (
            <>
              <div className="loading-bar-container">
                <div className="loading-bar-progress"></div>
              </div>
              <p className="premium-loader-text">{currentMessage}</p>
            </>
          ) : (
            <div className="timeout-container">
              <p className="timeout-text">
                <i className="fa-solid fa-hourglass-end me-2"></i>
                {t("waiting_time_expired")}
              </p>
              <button className="premium-loader-btn" onClick={handleBackHome}>
                <span>{t("go_home")}</span>
                <i className="fa-solid fa-house-chimney ms-2"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;