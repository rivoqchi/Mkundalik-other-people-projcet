import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "../../config";
import logo from "../Images/logo2.png";
import noting from "../Images/noting.png";
import CheckBD from "../CheckBD";
import AiMotivation from "../Additional/AiMotivation";
function Dashboard() {
  const fullName = localStorage.getItem("fullName") || "";

  return (
    <>
      <div className="dashboard-container def-page row align-items-center">
        <div className="col-12 col-md-6 text-center">
          <header className="hero">
            <h1>MKUNDALIK.UZ</h1>
            <p>
              Xodimlar potensiali monitoringgi bo`yicha O`zbekistondagi birinchi
              kundalik hisobotlarni elektron qayd etish platformasi
            </p>
            <AiMotivation />
            <Link to="/superadmin/employees/allusers">
              <button className="defaultbtn p-3">Barcha xodimlar</button>
            </Link>
          </header>
        </div>
        <div className="col-12 col-md-6 text-center">
          <img src={noting} alt="Noting" className="noting" />
          <h4 className="dashboard-header">{fullName}</h4>
          <p>
            Super qobiliyatlar paneli
          </p>
        </div>
      </div>
      <CheckBD />
    </>
  );
}

export default Dashboard;
