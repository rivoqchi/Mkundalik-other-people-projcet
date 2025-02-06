import React, {useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo2 from '../Images/logo2.png';
import axios from 'axios';
import { API } from '../../config';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Aside() {  
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
    <>
    <div className="aside">
      <div className="aside-logo">
      <i className="fa-solid fa-book"></i>
        <h4>HR Panel</h4>
      </div>
      <nav className="aside-menu">
        <ul>
          <li className={location.pathname === '/hr/schedule/new' ? 'active' : ''}>
            <Link to="/hr/schedule/new">
              <i className="fa-solid fa-list-check"></i>
              <span>Kundalik ishlarni qayd etish</span>
            </Link>
          </li>
          <li className={location.pathname === '/hr/schedule/history' ? 'active' : ''}>
            <Link to="/hr/schedule/history">
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span>Kundalik ish faoliyatim</span>
            </Link>
          </li>
          <li className={location.pathname === '/hr/rating/ours' ? 'active' : ''}>
            <Link to="/hr/rating/ours">
              <i className="fa-solid fa-medal"></i>
              <span>Mening bo`limim ko`rsatkichlari</span>
            </Link>
          </li>
          <li className={location.pathname === '/hr/sections' ? 'active' : ''}>
            <Link to="/hr/sections">
              <i className="fa-regular fa-pen-to-square"></i>
              <span>Bo‘limlarni tahrirlash</span>
            </Link>
          </li>
          <li className={location.pathname === '/hr/info/employee' ? 'active' : ''}>
            <Link to="/hr/employees">
              <i className="fa-solid fa-sitemap"></i>
              <span>Xodimlar</span>
            </Link>
          </li>
          <li className={location.pathname === '/hr/instructions' ? 'active' : ''}>
            <Link to="/hr/instructions">
              <i className="fa-solid fa-book"></i>
              <span>Yo‘riqnomalar nazorati</span>
            </Link>
          </li>
          <li className={location.pathname === '/hr/profile' ? 'active' : ''}>
            <Link to="/hr/profile">
              <i className="fa-regular fa-user"></i>
              <span>Mening ma'lumotlarim</span>
            </Link>
          </li>
          <li>
            <Link onClick={handleShow}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Chiqish</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
            <Modal centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Chiqish</Modal.Title>
            </Modal.Header>
            <Modal.Body>Profildan chiqmoqchimisiz?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Bekor qilish
              </Button>
              <Button variant="danger" onClick={logout}>
                Chiqish
              </Button>
            </Modal.Footer>
          </Modal>
    </>
  );
}

export default Aside;