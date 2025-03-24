import React, {useState, useEffect} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo2 from '../Images/logo2.png';
import axios from 'axios';
import { API } from '../../config';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import note from '../Images/note.png';
import logo from '../Images/logo-png.png';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import { useTranslation } from "react-i18next";
function Aside() {  
    const { t } = useTranslation();
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
  const myId = window.localStorage.getItem("user_id");
  const [notificationLength, setNotificationLength] = useState([]);
  const getMySectionSchedules = async () => {
    try {
      const { data } = await axios.get(`${API}/schedules/notification/length/${myId}`);
      setNotificationLength(data.length);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getMySectionSchedules();
  }, []);
  return (
    <>
    <div className="aside">
      <div className="aside-logo">
        <div className="d-flex align-items-center justify-content-center">
        <img className='noteimg' src={note} alt="" />
        <Link to='/complex/dashboard'><img className='asidelogo' src={logo} alt="" /></Link>
        </div>
        <h5>{window.localStorage.getItem("fullName")}</h5>
        <p>{window.localStorage.getItem("degree")}</p>
      </div>
      <nav className="aside-menu">
        <ul>
          <li className={location.pathname === '/complex/schedule/new' ? 'active' : ''}>
            <Link to="/complex/schedule/new">
              <i className="fa-solid fa-list-check"></i>
              <span>{t("qaydEtish")}</span>
            </Link>
          </li>
          <li className={location.pathname === '/complex/schedule/history' ? 'active' : ''}>
            <Link to="/complex/schedule/history">
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span>{t("faoliyatim")}</span>
            </Link>
          </li>
          <li className={location.pathname === '/complex/rating/ours' ? 'active' : ''}>
            <Link to="/complex/rating/ours">
              <i className="fa-solid fa-medal"></i>
              <span>{t("xodimlarimkorsatkichlari")}</span>
              {notificationLength > 0 && ( // Agar `notificationLength` bo‘lsa, chiqadi
                  <Stack
                    className="mx-1 lengthchi"
                    direction="horizontal"
                    gap={2}
                  >
                    <Badge bg="danger">{notificationLength}</Badge>
                  </Stack>
                )}
            </Link>
          </li>
          <li className={location.pathname === '/complex/employees' ? 'active' : ''}>
            <Link to="/complex/employees">
              <i className="fa-solid fa-sitemap"></i>
              <span>{t("xodimlar")}</span>
            </Link>
          </li>
          <li className={location.pathname === '/complex/profile' ? 'active' : ''}>
            <Link to="/complex/profile">
              <i className="fa-regular fa-user"></i>
              <span>{t("myInfo")}</span>
            </Link>
          </li>
                    
          <li>
            <Link onClick={handleShow}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>{t("logOut")}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
    <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("logOut")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("profildanchiqmoqchimisiz")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
          {t("bekorqilish")}
          </Button>
          <Button variant="danger" onClick={logout}>
          {t("logOut")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Aside;