import React from "react";
import { Link } from "react-router-dom";
import logo from "./Images/logo-png.png";
import "./Main.scss";

function Main() {
  return (
    <div className="navv">
      <nav className="nav align-items-center">
        <div className="logo2"><img src={logo} alt="logo" /></div>
        <ul className="nav-links">
          <Link to={'/'}><li>Bosh sahifa</li></Link>
          <Link to={'/'}><li>Statistika</li></Link>
          <Link to={'/'}><li>Nizom</li></Link>
          <Link to={'/'}><li>Yo'riqnoma</li></Link>
        </ul>
        <Link to={'/login'}><button className="login-btn">Kirish</button></Link>
      </nav>

        {/* <img src={illus} className="illus" alt="" /> */}
      <header className="hero">
        <h1>MKUNDALIK.UZ</h1>
        <p>“TOSHKENT METROPOLITENI” xodimlarining ish faoliyatini raqamlashtirish tizimi</p>
        <Link to={'/login'}><button className="cta-btn">Tizimga kirish</button></Link>
      </header>

      <section className="features">
        <div className="feature-card">
          <h3>Avtomatlashtirilgan hisobot</h3>
          <p>Xodimlarning ish kunlik hisobotlari elektron tarzda yuritiladi.</p>
        </div>
        <div className="feature-card">
          <h3>Operativ monitoring</h3>
          <p>Natijalar rahbariyatga tez yetkaziladi.</p>
        </div>
        <div className="feature-card">
          <h3>Shaffof tizim</h3>
          <p>Jarayonlar ochiq va samarali nazorat qilinadi.</p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 mkundalik.uz. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}

export default Main;