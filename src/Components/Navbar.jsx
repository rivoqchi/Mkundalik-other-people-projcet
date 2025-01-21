import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo2 from './Images/logo2.png';
import { Link } from 'react-router-dom';
import { fetchRole } from '../Components/Auth/CheckAuth';

function Navbarr() {
  const [role, setRole] = useState(null);
  
  // Foydalanuvchi rolini aniqlash
  useEffect(() => {
    const fetchUserRole = async () => {
      const userRole = await fetchRole();
      setRole(userRole);
    };
    fetchUserRole();
  }, []);

  // Profil linki uchun rol asosida yo'nalish
  const getProfileLink = () => {
    
    if (role === 'employee'){
      return '/user';
    } else if (role === 'admin'){
      return '/admin';
    } else if (role === 'superadmin'){
      return '/superadmin';
    } else if (role === 'new'){
      return '/iamnew';
    }else{
      return '/login'; // Default link (avtorizatsiya qilinmaganlar uchun)
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="navbarrr">
      <Container>
        <Link className="text-decoration-none" to="/">
          <img className="logo2" src={logo2} alt="" /> Toshkent metropoliteni
        </Link>

        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {/* Default Login link */}
            {role === null || role === undefined && (
              <Link title="Profilga kirish" to="/login">
                <i className="fa-solid fa-user profilgakirish"></i>Login
              </Link>
            )}
            {/* Profil link */}
            {role && (
              <Link title="Profil" to={getProfileLink()}>
                <i className="fa-solid fa-user profilgakirish"></i>Dashboard
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbarr;