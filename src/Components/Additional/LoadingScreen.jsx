import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import logo from "../Images/logo2.png";
import { useTranslation } from "react-i18next";

const LoadingScreen = ({ loading }) => {
  const { t } = useTranslation();
  const messages = [t("please_wait"), t("loading"), t("one_second")];
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => {
        const nextIndex = (messages.indexOf(prev) + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [messages]);

  return (
    loading && (
      <div className="spinner-container">
        <div className="content">
          <img src={logo} alt="Logo" className="logo" />
          <Spinner animation="border" variant="primary" className="spinner" />
          <p className="loading-text">{currentMessage}</p>
        </div>
      </div>
    )
  );
};

export default LoadingScreen;
