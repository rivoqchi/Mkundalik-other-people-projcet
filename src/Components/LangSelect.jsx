import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import uzFlag from "./Images/Flags/uz.png";
import ruFlag from "./Images/Flags/ru.png";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="language-selector">
      <button className="lang-btn" onClick={() => setIsOpen(!isOpen)}>
        <img src={languages.find(l => l.code === i18n.language)?.flag} alt="Flag" />
        <span>{languages.find(l => l.code === i18n.language)?.name}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && (
        <ul className="lang-dropdown">
          {languages.map((lang, index) => (
            <li key={lang.code} onClick={() => changeLanguage(lang.code)} style={{ animationDelay: `${0 + index * .1}s` }}>
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
