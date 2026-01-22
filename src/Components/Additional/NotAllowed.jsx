import React from "react";
import { useTranslation } from "react-i18next";

function NotAllowed() {
  const { t } = useTranslation();

  const handleLogout = () => {
    // 🔴 HAMMASINI TOZALAYMIZ
    localStorage.clear();

    // 🔁 HARD REDIRECT
    window.location.replace("/");
  };

  return (
    <div className="page404 align-items-center text-center">
      <h1 className="h1404 pt-5">
        <b>403</b>
      </h1>

      <h3>
        <i className="fa-solid fa-triangle-exclamation i404"></i>{" "}
        {t("taqiqtopildi")}!
      </h3>

      <p>{t("tokenexpired")}...</p>

      <button className="defaultbutton" onClick={handleLogout}>
        {t("login")}
      </button>

      <br />
      <br />
    </div>
  );
}

export default NotAllowed;
