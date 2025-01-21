import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from './CheckAuth';
import { API } from '../../config';
import Alert from '../Additional/Alert';
import Navbar from '../Navbar';
import Footer from '../Footer';
const Login = () => {
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [values, setValues] = useState({ phone: '', password: '' });
    const navigate = useNavigate();
    const { phone, password } = values;

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const clickSubmit = (event) => {
        event.preventDefault();
        setAlert({ show: false, type: "", message: "" });

        signIn({ phone, password }).then((data) => {
            if (data.error) {
                setAlert({ show: true, type: "error", message: data.error });
            } else if(data.employee.role != "new"){
                window.localStorage.setItem("token", data.token);
                window.localStorage.setItem("fullName", data.employee.name);
                window.localStorage.setItem("phone", data.employee.phone);
                window.localStorage.setItem("user_id", data.employee._id);
                setValues({ phone: '', password: '' });
                if(data.employee.employee){
                    if(data.employee.role === "employee"){
                        navigate('/user')
                    }else if(data.employee.role === "admin"){
                        navigate('/admin')
                    }else if(data.employee.role === "superadmin"){
                        navigate('/superadmin')
                    }
                }else{
                    navigate('/fill')
                }
        }else{
                navigate('/iamnew')
            };
        }).catch(() => {
            setAlert({ show: true, type: "error", message: "Serverda xatolik yuz berdi!" });
        });
    };

    return (
        <>
        <Navbar/>
        <div className="Auth">
            {alert.show && <Alert type={alert.type} message={alert.message} />}
            <div className="Auth__body">
                <div className="Auth__body-form">
                    <h2 className='text-center'><i className="fa-solid fa-right-to-bracket"></i> Tizimga kirish</h2>
                    <input
                        type="text"
                        onChange={handleChange('phone')}
                        placeholder="Phone"
                        value={phone}
                    />
                    <input
                        type="password"
                        onChange={handleChange('password')}
                        placeholder="Password"
                        value={password}
                    />
                    <button className='signuplogin' onClick={clickSubmit}>Login</button>
                    <p className="dontacc mt-3">
                        Akkauntingiz yo`qmi? <Link to='/signup'>Ro`yxatdan o`tish</Link>
                    </p><br /><br />
                    <h2><i className="fa-brands fa-telegram"></i> orqali kirish</h2>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default Login;