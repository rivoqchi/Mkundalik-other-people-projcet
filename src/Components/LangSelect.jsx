import React from "react";
import { useTranslation } from "react-i18next";
import uzFlag from "./Images/Flags/uz.png";
import uzCyrFlag from "./Images/Flags/uz.png";
import ruFlag from "./Images/Flags/ru.png";

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lng", lang);
  };

  return (
    <>
    <div className="language-selector">
      <button
      title="O`zbek"
        className={`lang-btn ${i18n.language === "uz" ? "active" : ""}`}
        onClick={() => changeLanguage("uz")}
      >
        <img src={uzFlag} alt="O‘zbek" />
      </button>
      <button
        className={`lang-btn ${i18n.language === "uz_cyr" ? "active" : ""}`}
        onClick={() => changeLanguage("uz_cyr")}
      title="Ўзбек"
      >
        <img src={uzCyrFlag} alt="Ўзбек" />
      </button>
      <button
      title="Русский"
        className={`lang-btn ${i18n.language === "ru" ? "active" : ""}`}
        onClick={() => changeLanguage("ru")}
      >
        <img src={ruFlag} alt="Русский" />
      </button>
    Test
    </div>
    </>
  );
}

export default LanguageSelector;
