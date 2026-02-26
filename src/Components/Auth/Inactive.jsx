import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import logo from '../Images/logo-png.png';
export default function Inactive() {
  const navigate = useNavigate();

  return (
    <MDBContainer fluid className="inactive-container d-flex align-items-center justify-content-center">
      <div className="background-overlay"></div>
      <MDBRow className="justify-content-center w-100">
        <MDBCol md="6" lg="4" className="text-center">
          <img style={{ width: '250px', marginBottom: '20px', height: 'auto' }} src={logo} alt="Logo" />
          <div className="inactive-card p-5 shadow-5-strong">
            <div className="icon-box mb-4">
              <i className="fa-solid fa-user-slash fa-beat-pulse"></i>
            </div>
            <h2 className="fw-bold mb-3 text-white">Kirish cheklangan</h2>
            <p className="message-text mb-4">
              Siz administrator tomonidan bloklangansiz. Tizimdan foydalanishni davom ettirish uchun 
              <strong> kadrlar bo'limiga</strong> uchrashing.
            </p>
            <button 
              className="home-btn" 
              onClick={() => navigate('/')}
            >
              <i className="fa-solid fa-house me-2"></i>
              Bosh sahifa
            </button>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}