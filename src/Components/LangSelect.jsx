import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import uzFlag from "./Images/Flags/uz.png";
import ruFlag from "./Images/Flags/ru.png";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Default tilni o‘rnatish (localStorage bo‘sh bo‘lsa)
  useEffect(() => {
    const savedLang = localStorage.getItem("lng") || "uz"; 
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const languages = [
    { code: "uz", name: "O‘zbek", flag: uzFlag },
    { code: "uz_cyr", name: "Ўзбек", flag: uzFlag },
    { code: "ru", name: "Русский", flag: ruFlag },
  ];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lng", lang);
    setIsOpen(false);
  };

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div className="language-selector">
      <button className="lang-btn" onClick={() => setIsOpen(!isOpen)}>
        <img src={currentLang.flag} alt="Flag" />
        <span>{currentLang.name}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && (
        <ul className="lang-dropdown">
          {languages.map((lang, index) => (
            <li key={lang.code} onClick={() => changeLanguage(lang.code)} style={{ animationDelay: `${index * 0.1}s` }}>
              <img src={lang.flag} alt={lang.name} />
              {lang.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;