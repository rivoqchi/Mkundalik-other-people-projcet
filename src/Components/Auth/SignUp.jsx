import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from './CheckAuth';
import Alert from '../Additional/Alert';
import Navbar from '../Navbar';
import Footer from '../Footer';
import axios from 'axios';
import { API } from '../../config'
const Signup = () => {

    const checkStatus = async () => {
        try {
          let res = await axios.get(`${API}/auth`, {
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
          });
          
          const status = res.data.data.status;
      
          if (!status || status === "" || status === "none") {
          } else if (status === "user") {
          }
        } catch (error) {
          console.error("Statusni tekshirishda xatolik:", error);
        }
      };
      useEffect(() => {
        checkStatus();
      }, []);



    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const navigate = useNavigate();
    const [values, setValues] = useState({
        name: '', phone: '', password: '', error: '', success: false
    });

    const { name, phone, password, success, error } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const handlePasswordShow = () => {
        const icon = document.getElementById("password-icon");
        icon.className === "fa-solid fa-eye" ? icon.className = "fa-solid fa-eye-slash" : icon.className = "fa-solid fa-eye";
        const passwordInput = document.getElementById("password-input");
        passwordInput.type === "password" ? passwordInput.type = "text" : passwordInput.type = "password";
    };

    const clickSubmit = event => {
        event.preventDefault();
        if (phone.split('').length !== 13) {
            return setValues({ ...values, error: 'Telefon raqamni tekshirib qaytadan kiriting!' });
        }
        if (phone.slice(0, 4) !== '+998') {
            return setValues({ ...values, error: `Faqat O'zbekiston raqamini kiriting!` });
        }
        setValues({ ...values, error: false });
        signup({ name, phone, password }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                navigate('/iamnew')
                setValues({
                    ...values, name: '', phone: '', password: '', error: '', success: true
                });
            }
        });
    };

    useEffect(() => {
        if (success) {
            setAlert({ show: true, type: "success", message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!" });
        } else if (error) {
            setAlert({ show: true, type: "error", message: error });
        } else {
            setAlert({ show: false, type: "", message: "" });
        }
    }, [success, error]);

    const signUpForm = () => (
        <>
        <h1>403</h1>
        <div className="text-center">
            Faqatgina tizim administratori tizimga qo`shishi mumkin. <br />
            tizim administratoriga murojaat qiling.
            </div><br />
            <a href="mailto:mkundalik@tashmetro.uz">mkundalik@tashmetro.uz</a><br /><br /><br />
        <Link to="/login"><button className="defaultbtn">Kirish</button></Link>
            {/* {alert.show && <Alert type={alert.type} message={alert.message} />}
            <div className='text-center Auth__body-form'>
                <h2 className='text-center'><i className="fa-solid fa-link"></i> Ro'yxatdan o'tish</h2>
                <div className="login-inputs">
                    <input type="text" onChange={handleChange('name')} placeholder="F.I.Sh" value={name} />
                    <input type="text" onChange={handleChange('phone')} placeholder="Telefon raqami" value={phone} />
                    <div className="password-wrap">
                        <input
                            id="password-input"
                            type="password"
                            onChange={handleChange('password')}
                            placeholder="Parol"
                            value={password}
                        />
                        <button className='eye' onClick={handlePasswordShow}>
                            <i id="password-icon" className="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>
                <button className='signuplogin' onClick={clickSubmit}>Ro'yxatdan o'tish</button>
                <p className="mt-3 dontacc">
                Hisob bormi? <Link to='/login'>Kirish</Link>
                </p>
                <h2><i className="fa-brands fa-telegram"></i> orqali kirish</h2>
            </div> */}
        </>
    );

    return (
        <div className='signuup'>
            {signUpForm()}
        </div>
    );
};

export default Signup;