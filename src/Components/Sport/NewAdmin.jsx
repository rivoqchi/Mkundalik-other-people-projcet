import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newAdmin } from '../Auth/CheckAuth';
import Alert from '../Additional/Alert';

const NewAdmin = () => {
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [values, setValues] = useState({
        name: '', phone: '', password: '', section:'', degree:'', error: '', success: false
    });

    const { name, phone, password, section, degree, success, error } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
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
        newAdmin({ name, phone, password, section, degree }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                setValues({
                    ...values, name: '', phone: '', password: '', section: '', degree: '', error: '', success: true
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
            {alert.show && <Alert type={alert.type} message={alert.message} />}
            <div className='text-center'>
                <h2 className='text-center'><i className="fa-solid fa-user-plus"></i> Bo`lim boshlig`i qo`shish</h2>
                    <div className="row w-100 mt-5 text-center d-flex justify-content-center align-items-center">
                        <div className="col-12 col-md-6 ert">
                            <div className="login-inputs2">
                                <label className='text-start authlabel' htmlFor="name">F.I.Sh.</label>
                                <input id='name' type="text" onChange={handleChange('name')} placeholder="F.I.Sh" value={name} />
                                <label className='text-start authlabel' htmlFor="phone">Telefon raqami</label>
                                <input id='phone' type="text" onChange={handleChange('phone')} placeholder="Telefon raqami" value={phone} />
                                <label className='text-start authlabel' htmlFor="password">Parol</label>
                                <input id='password' type="text" onChange={handleChange('password')} placeholder="Parol" value={password} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6 ert">
                            <div className="login-inputs2">
                            <label className='text-start authlabel' htmlFor="section">Bo`lim nomi</label>
                                <input id='section' type="text" onChange={handleChange('section')} placeholder="Bo`lim nomi" value={section} />
                            <label className='text-start authlabel' htmlFor="degree">Parol</label>
                                <input id='degree' type="text" onChange={handleChange('degree')} placeholder="Lavozimi" value={degree} />
                            <label className='text-start authlabel' htmlFor="by">Tasdiqlaydi</label>
                                <input id='by' type="text" disabled  value={window.localStorage.getItem("fullName")} />
                            </div>
                        </div>
                    </div>
                <button className='signuplogin' onClick={clickSubmit}>Qo`shish</button>
            </div>
        </>
    );

    return (
        <div className='Auth2'>
            {signUpForm()}
        </div>
    );
};

export default NewAdmin;