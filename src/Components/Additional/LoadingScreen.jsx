import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import logo from "../Images/logo2.png";

const LoadingScreen = ({ loading }) => {
  const messages = ["Iltimos, kuting...", "Yuklanmoqda...", "Bir soniya..."];
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => {
        const nextIndex = (messages.indexOf(prev) + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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