import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../config";
import logo from "./Images/logo2.png";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  const myId = window.localStorage.getItem("user_id");

  const getMyData = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
      
      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "employee") {
        navigate("/user");
      } else if (data.user.role === "superadmin") {
        navigate("/superadmin");
      } else if (data.user.role === "complex") {
        navigate("/complex");
      } else if (data.user.role === "department") {
        navigate("/department");
      } else if (data.user.role === "hr") {
        navigate("/hr");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getMyData();
  }, []);

  return (
    <div className="main-container">
      {/* Header bilan Logo */}
      <header className="main-header">
        <img src={logo} alt="Platform Logo" className="main-logo" />
        <h1 className="main-title">Kundalik Vazifalar Platformasi</h1>
      </header>

      {/* Markaziy Animatsiya */}
      <div className="animated-banner">
        <h2 className="banner-text">Hisobotlarni raqamlashtiring!</h2>
        <p className="banner-subtext">Har kuni hisobotlarni oson topshirish uchun platformaga qo‘shiling.</p>
      </div>

      {/* Harakat Tugmalari */}
      <div className="action-buttons">
        <Link to="/login">
          <button className="btn primary-btn">Kirish</button>
        </Link>
        {/* <Link to="/register">
          <button className="btn secondary-btn">Ro‘yxatdan O‘tish</button>
        </Link> */}
      </div>

      <footer className="main-footer">
        <p>© 2025 mkundalik.uz | Barcha huquqlar himoyalangan.</p>
        <p>Bizga ulaning: <a href="https://t.me/Toshkent_metropoliteni_rasmiy">@Toshkent_metropoliteni_rasmiy</a></p>
      </footer>
    </div>
  );
}

export default Main;