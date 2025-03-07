import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../config";
import logo from "./Images/logo-png.png";
import LoginWithTelegram from "./Auth/LoginWithTelegram";
import "./Main.scss"; // Stilni alohida faylda boshqarish uchun

function Main() {
  const navigate = useNavigate();
  const myId = window.localStorage.getItem("user_id");

  const getMyData = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
      console.log(data);

      const roleRoutes = {
        admin: "/admin",
        employee: "/user",
        superadmin: "/superadmin",
        complex: "/complex",
        department: "/department",
        hr: "/hr",
        boss: "/boss",
        commission: "/commission",
        staff: "/staff",
      };

      if (data?.user?.role && roleRoutes[data.user.role]) {
        navigate(roleRoutes[data.user.role]);
      } else {
        console.warn("No valid role found");
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
      <header className="main-header">
        <img src={logo} alt="Platform Logo" className="main-logo" />
        <h1 className="main-title">Kundalik Vazifalar Platformasi</h1>
      </header>

      <div className="animated-banner">
        <h2 className="banner-text">Hisobotlarni raqamlashtiring!</h2>
        <p className="banner-subtext">Har kuni hisobotlarni oson topshirish uchun platformaga qo‘shiling.</p>
      </div>

      <div className="action-buttons">
        <Link to="/login">
          <button className="btn primary-btn">Kirish</button>
        </Link>
      </div>

      <footer className="main-footer">
        <p>© 2025 mkundalik.uz | Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}

export default Main;