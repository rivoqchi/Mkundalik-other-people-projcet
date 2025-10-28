import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../config';
import logo from '../Images/logo2.png';

function Dashboard() {
  const [reportCount, setReportCount] = useState(0);
  const user_id = localStorage.getItem('user_id');
  const fullName = localStorage.getItem('fullName') || '';

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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img src={logo} alt="Logo" />
        <h1>Salom, {fullName} <i class="fa-solid fa-bolt"></i></h1>
        <p>Bugungi kungacha jami <b>{reportCount}</b> ta hisobot yozgansiz.  Statistikangiz doimiy o‘sishda!</p>
        <Link to="/admin/schedule/new">
          <button className="defaultbtn p-3">
            Yangi hisobotga o‘tish
          </button>
        </Link>
      </div>
      <div className="default-box text-center">
        <p>Ajoyib ish, shunday davom eting! <i class="fa-solid fa-rocket"></i></p>
        <p>Sizning faoliyatingiz boshqalarga ilhom bag‘ishlaydi <i class="fa-solid fa-tower-broadcast"></i></p>
      </div>
    </div>
  );
}

export default Dashboard;