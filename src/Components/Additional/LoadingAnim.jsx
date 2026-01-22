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
    <div className={`liquid-overlay ${loading ? "fade-in" : "fade-out"}`}>
      <div className="liquid-card">
        <img src={logo} alt="Logo" className="liquid-logo" />

        {!timeoutReached ? (
          <>
            <Spinner animation="border" className="liquid-spinner" />
            <p className="liquid-text">{currentMessage}</p>
          </>
        ) : (
          <>
            <p className="timeout-text">
              ⏳ {t("waiting_time_expired")}
            </p>
            <button className="liquid-btn" onClick={handleBackHome}>
              {t("go_home")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;