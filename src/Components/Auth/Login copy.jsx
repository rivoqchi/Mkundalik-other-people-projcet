import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from './CheckAuth';
import { API } from '../../config';
import Alert from '../Additional/Alert';
import Navbar from '../Navbar';
import Footer from '../Footer';
import LoginWithTelegram from './LoginWithTelegram';
import LoadingScreen from '../Additional/LoadingScreen';
import logomk from '../Images/logo-png.png';
import logomet from '../Images/logo2.png';
const Login = () => {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [values, setValues] = useState({ phone: '+998', password: '' });
    const [showPassword, setShowPassword] = useState(false); // Parolni ko'rsatish yoki yashirish uchun
    const navigate = useNavigate();
    const { phone, password } = values;

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            clickSubmit(event);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const clickSubmit = (event) => {
        setLoading(true);
        event.preventDefault();
        setAlert({ show: false, type: "", message: "" });

        signIn({ phone, password }).then((data) => {
            if (data.error) {
                setLoading(false);
                setAlert({ show: true, type: "error", message: data.error });
            } else if(data.employee.role !== "new"){
                window.localStorage.setItem("token", data.token);
                window.localStorage.setItem("fullName", data.employee.name);
                window.localStorage.setItem("degree", data.employee.degree);
                window.localStorage.setItem("phone", data.employee.phone);
                window.localStorage.setItem("user_id", data.employee._id);
                setValues({ phone: '', password: '' });
                if(data.employee.employee){
                    if (data.employee.role) {
                        const routes = {
                            employee: "/user",
                            admin: "/admin",
                            superadmin: "/superadmin",
                            complex: "/complex",
                            department: "/department",
                            hr: "/hr",
                            commission: "/commission",
                            sport: "/sport",
                            at: "/at",
                            boss: "/boss"
                        };
                        navigate(routes[data.employee.role]);
                        navigate(routes[data.employee.role] || "/fill");
                    }
                } 
                else {
                    const routes = {
                        employee: "/user/dashboard",
                        admin: "/admin/dashboard",
                        superadmin: "/superadmin/dashboard",
                        complex: "/complex/dashboard",
                        department: "/department/dashboard",
                        hr: "/hr/dashboard",
                        commission: "/commission/dashboard",
                        commission: "/sport/dashboard",
                        commission: "/at/dashboard",
                        boss: "/boss/dashboard"
                    };
                    navigate(routes[data.employee.role]);
                    navigate('/fill');
                }
            } else {
                navigate('/iamnew');
            }
        }).catch(() => {
            setAlert({ show: true, type: "error", message: "Serverda xatolik yuz berdi!" });
        });
    };

    return (
        <>
      {loading && <LoadingScreen loading={true} />}

        <Navbar/>
        <div className="Auth row d-flex justify-content-center align-items-center">
    {alert.show && <Alert type={alert.type} message={alert.message} />}
    <div className="col-12 text-start align-items-center justify-content-between col-md-6">
        <div className="Auth__body">
            <div className="Auth__body-form">
                <img className='loginlogo' src={logomk} alt="" />
                <h1 className='text-center'>Tizimga kirish</h1>
                <input
                    type="text"
                    onChange={handleChange('phone')}
                    placeholder="Telefon raqamingiz:"
                    value={phone}
                    onKeyDown={handleKeyDown}
                />
                <div style={{ position: "relative" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        onChange={handleChange('password')}
                        placeholder="Parol:"
                        value={password}
                        onKeyDown={handleKeyDown}
                        style={{ width: "100%", paddingRight: "40px" }}
                    />
                    <i
                        className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                        onClick={togglePasswordVisibility}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#777"
                        }}
                    ></i>
                </div>
                <button className='signuplogin' onClick={clickSubmit}>Kirish</button>

                <p className="dontacc mt-3">Parolni unutdingizmi? <Link to='/signup'>Parolni tiklash</Link></p>
                <br /><br />
            </div>
        </div>
    </div>
    <div className="col-12 text-center col-md-6 d-flex justify-content-center align-items-center">
        <img src={logomk} alt="" />
    </div>
</div>
        <Footer/>
        </>
    );
};

export default Login;