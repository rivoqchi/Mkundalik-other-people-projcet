import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../Components/Auth/CheckAuth';
import { API } from '../config';
import Alert from '../Components/Additional/Alert';
const Test = () => {
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [values, setValues] = useState({ phone: '', password: '' });
    const navigate = useNavigate();
    const { phone, password } = values;

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    // const clickSubmit = (event) => {
    //     event.preventDefault();
    //     setAlert({ show: false, type: "", message: "" });
    //     test({ phone, password }).then((data) => {
    //         if (data.error) {
    //             setAlert({ show: true, type: "error", message: data.error });
    //         } else {
    //             localStorage.setItem('token', data.token);
    //             console.log('Foydalanuvchi ma’lumotlari:', data.employee, data.token);
    //         }
    //     }).catch(() => {
    //         setAlert({ show: true, type: "error", message: "Serverda xatolik yuz berdi!" });
    //     });
    // };

    const checkToken = (event) => {
        setAlert({ show: false, type: "", message: "" });
        auth().then((data) => {
            if (data.error) {
                setAlert({ show: true, type: "error", message: data.error });
            } else {
                setAlert({ show: true, type: "success", message: data.token });
                console.log('Foydalanuvchi ma’lumotlari:', data);
            }
        }).catch(() => {
            setAlert({ show: true, type: "error", message: "Serverda xatolik yuz berdi!" });
        });
    };

    return (
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
                    {/* <button className='signuplogin' onClick={clickSubmit}>Login</button> */}
                    <button className='signuplogin' onClick={checkToken}>Check token</button>
                    <p className="dontacc mt-3">
                        Akkauntingiz yo`qmi? <Link to='/signup'>Ro`yxatdan o`tish</Link>
                    </p><br /><br />
                    <h2><i className="fa-brands fa-telegram"></i> orqali kirish</h2>
                </div>
            </div>
        </div>
    );
};

export default Test;