import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "../../config";
import logo from "../Images/logo2.png";
import noting from "../Images/noting.png";
import CheckBD from "../CheckBD";
function Dashboard() {
  const [reportCount, setReportCount] = useState(0);
  const user_id = localStorage.getItem("user_id");
  const fullName = localStorage.getItem("fullName") || "";

  useEffect(() => {
    async function fetchReportCount() {
      try {
        const res = await fetch(`${API}/auth/counthisobot?_id=${user_id}`);
        if (res.ok) {
          const data = await res.json();
          setReportCount(data.count || 0);
        } else {
          setReportCount(0);
        }
      } catch (error) {
        setReportCount(0);
      }
    }
    if (user_id) {
      fetchReportCount();
    }
  }, [user_id]);

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
          <Link to="/hr/schedule/new">
            <button className="defaultbtn p-3">Yangi hisobot</button>
          </Link>
        </header>
      </div>
      <div className="col-12 col-md-6 text-center">
        <img src={noting} alt="Noting" className="noting" />
        <h4 className="dashboard-header">{fullName}</h4>
        <p>Bugungi kunga qadar sizga tegishli hisobotlar soni: <b>{reportCount}</b></p>
      </div>
    </div>
      <CheckBD />
    </>
  );
}

export default Dashboard;
