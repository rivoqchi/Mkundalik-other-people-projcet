import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import { signIn } from './CheckAuth';
import logomk from '../Images/logo-png.png';
import { useLoading } from "../Additional/LoadingScreen";
import Alert from '../Additional/Alert';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useTranslation } from "react-i18next";
import { Button, Form, InputGroup } from "react-bootstrap";

const Login = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [values, setValues] = useState({ phone: '+998', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 🔑 Hozirgi URL

  const { phone, password } = values;
const from = location.state?.from; // faqat string

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') clickSubmit(event);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    signIn({ phone, password })
      .then((data) => {
        if (data.error) {
          setLoading(false);
          setAlert({ show: true, type: "error", message: data.error });
        } else if (data.employee.role !== "new") {

          // Token va user info saqlash
          window.localStorage.setItem("token", data.token);
          window.localStorage.setItem("jwt", JSON.stringify({ token: data.token }));
          window.localStorage.setItem("fullName", data.employee.name);
          window.localStorage.setItem("degree", data.employee.degree);
          window.localStorage.setItem("phone", data.employee.phone);
          window.localStorage.setItem("role", data.employee.role);
          window.localStorage.setItem("user_id", data.employee._id);
          window.localStorage.setItem("bd", data.employee?.dateOfBirth?.slice(-5) ?? "11-19");
          setValues({ phone: '', password: '' });

          setLoading(false);

          // 🔑 Agar state.from bo'lsa, shu URL ga yo'naltirish
if (from) {
  navigate(from, { replace: true });
  return;
}

          // Aks holda o‘z role ga mos dashboard
          const dashboardRoutes = {
            employee: "/user/dashboard",
            admin: "/admin/dashboard",
            superadmin: "/superadmin/dashboard",
            complex: "/complex/dashboard",
            department: "/department/dashboard",
            hr: "/hr/dashboard",
            lang: "/lang/dashboard",
            commission: "/commission/dashboard",
            sport: "/sport/dashboard",
            at: "/at/dashboard",
            boss: "/boss/dashboard"
          };
          navigate(dashboardRoutes[data.employee.role], { replace: true });

        } else {
          // Yangi foydalanuvchi
          navigate('/iamnew', { replace: true });
        }
      })
      .catch(() => {
        setLoading(false);
        setAlert({ show: true, type: "error", message: "Serverda xatolik yuz berdi!" });
      });
  };

  return (
    <>
      <Navbar />
      <MDBContainer fluid className='loginpg background-radial-gradient overflow-hidden'>
        <MDBRow>
          <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
            <h1 className="my-5 display-3 fw-bold ls-tight px-3 text-white">
              {t("tizimga")} <br />
              <span style={{ color: 'hsl(218, 81%, 75%)' }}>{t("login")}</span>
            </h1>
            <p className='px-3' style={{ color: 'hsl(218, 81%, 85%)' }}>
              {t("xizfoytizkir")}<br />
            </p>
          </MDBCol>

          <MDBCol md='6' className='position-relative'>
            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

            <MDBCard className='my-5 bg-glass'>
              <MDBCardBody className='p-5'>
                {alert.show && <Alert type={alert.type} message={alert.message} />}
                <img src={logomk} alt="Logo" className="w-50 mx-auto d-block mb-4" />

                <div className="new-input-group mb-4">
                  <InputGroup>
                    <InputGroup.Text className='inpgr'>+998</InputGroup.Text>
                    <Form.Control
                      type="number"
                      className='inpgr shadow-none'
                      placeholder="XXXXXXXXX"
                      value={phone.slice(4)}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => setValues({ ...values, phone: '+998' + e.target.value })}
                    />
                  </InputGroup>
                </div>

                <div className="new-input-group mb-4">
                  <Form.Group controlId="formPassword">
                    <Form.Label>{t("parol")}</Form.Label>
                    <InputGroup>
                      <Form.Control
                        className='inpgr shadow-none'
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Parolingiz"
                        value={password}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange('password')}
                      />
                      <Button variant="outline-secondary" className='inpgr' onClick={togglePasswordVisibility}>
                        {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </div>

                <button className='w-100 login-btn mb-4' size='md' onClick={clickSubmit}>{t("login")}</button>
                <p className="text-center mt-3">
                  {t("parolunut")}? <Link to='/signup'>{t("tiklash")}</Link>
                </p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <Footer />
    </>
  );
};

export default Login;