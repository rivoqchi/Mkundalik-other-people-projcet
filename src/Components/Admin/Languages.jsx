import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Langages() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [route, setRoute] = useState("");

  const handleSelect = (language) => {
    if (language === "Rus") {
      navigate(`${route}/lang/ru`);
    } else if (language === "Ingliz") {
      navigate(`${route}/lang/en`);

    }
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
    <div className="language-selector-container">
      <h2 className="language-selector-title">{t("chooselang")}</h2>
      <div className="language-button-group">
        <button
          className="language-button rus-lang-button"
          onClick={() => handleSelect("Rus")}
        >
          🇷🇺 Rus tili
        </button>
        <button
          className="language-button eng-lang-button"
          onClick={() => handleSelect("Ingliz")}
        >
          🇬🇧 English
        </button>
      </div>
    </div>
  );
}

export default Langages;
