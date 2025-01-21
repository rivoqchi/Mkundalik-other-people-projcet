import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo2 from '../Images/logo2.png';
import axios from 'axios';
import { API } from '../../config';

function Aside() {
  const navigate = useNavigate();
  const location = useLocation(); // Hozirgi yo'lni olish
  let token = window.localStorage.getItem("token");

  const logout = async () => {
    try {
      const response = await axios.get(`${API}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Chiqishda xatolik yuz berdi:', error);
    }
  };

  return (
    <div className="aside">
      <div className="aside-logo">
        <img src={logo2} alt="Admin Panel" />
        <h4>User Panel</h4>
      </div>
      <nav className="aside-menu">
        <ul>
          <li className={location.pathname === '/user/schedule/new' ? 'active' : ''}>
            <Link to="/user/schedule/new">
              <i className="fa-solid fa-list-check"></i>
              <span>Kundalik ishlarni qayd etish</span>
            </Link>
          </li>
          <li className={location.pathname === '/user/schedule/history' ? 'active' : ''}>
            <Link to="/user/schedule/history">
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span>Kundalik ish faoliyatlarim</span>
            </Link>
          </li>
          <li className={location.pathname === '/user/profile' ? 'active' : ''}>
            <Link to="/user/profile">
              <i className="fa-regular fa-user"></i>
              <span>Mening ma'lumotlarim</span>
            </Link>
          </li>
          <li>
            <Link onClick={logout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Chiqish</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Aside;