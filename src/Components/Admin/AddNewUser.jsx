import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createEmployee } from "../Auth/CheckAuth";
import Alert from "../Additional/Alert";
import axios from "axios";
import { API } from "../../config";

const AddNewUser = () => {
    const [allSections, setAllSections] = useState([])
    
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [autoDownload, setAutoDownload] = useState(false); // Switch holati
    const [values, setValues] = useState({
        name: "",
        phone: "+998",
        password: "",
        section: "",
        degree: "",
        status: "",
        error: "",
        success: false,
    });

    const getAllSections = async () => {
        try {
          const { data } = await axios.get(`${API}/sections/getall`);
          setAllSections(data.sections)
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };  
      useEffect(() => {
        getAllSections();
      }, []);

    const { name, phone, password, section, degree, status, error, success } = values;

    const acceptedBy = window.localStorage.getItem("fullName");
    const handleSwitchChange = () => {
        setAutoDownload(!autoDownload); // Switchni qayta almashtirish
    };

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value, error: false });
    };

    const clickSubmit = async (event) => {
        event.preventDefault();
        if (phone.split("").length !== 13) {
            return setValues({ ...values, error: "Telefon raqamni tekshirib qaytadan kiriting!" });
        }
        if (phone.slice(0, 4) !== "+998") {
            return setValues({ ...values, error: "Faqat O'zbekiston raqamini kiriting!" });
        }

        try {
            const employee = { name, phone, password, section, degree, status, acceptedBy };
            const data = await createEmployee(employee);
            

            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
                setAlert({ show: true, type: "error", message: data.error });
            } else {
                setValues({
                    ...values,
                    name: "",
                    phone: "+998",
                    password: "",
                    section: "",
                    degree: "",
                    status: "",
                    success: true,
                    error: "",
                });
                if (autoDownload) {
                    saveToFile();
                }
                setAlert({ show: true, type: "success", message: "Xodim muvaffaqiyatli qo'shildi!" });
            }
        } catch (err) {
            console.error("Server bilan ulanishda xatolik:", err);
            setValues({ ...values, error: "Server bilan ulanishda xatolik yuz berdi!" });
            setAlert({ show: true, type: "error", message: "Server bilan ulanishda xatolik yuz berdi!" });
        }
    };

    const saveToFile = () => {
        const data = `Ism: ${name} \nTelefon: ${phone} \nParol: ${password} \nBo'lim: ${section} \nLavozim: ${degree}\nStatus: ${status} \nTasdiqlagan shaxs: ${acceptedBy}`;
        const blob = new Blob([data], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${name}.txt`; // Fayl nomi userning ismiga teng bo'ladi
        link.click();
    };

    useEffect(() => {
        if (success || error) {
            setAlert({
                show: true,
                type: success ? "success" : "error",
                message: success ? "Xodim muvaffaqiyatli qo'shildi!" : error,
            });
        } else {
            setAlert({ show: false, type: "", message: "" });
        }
    }, [success, error]); // success va error o'zgarganda alertni yangilaydi

    const addNewUserForm = () => (
        <>
            {alert.show && <Alert type={alert.type} message={alert.message} />}
                <Link to="/admin/employees"><button className="defaultbtn m-3"><i className="fa-solid fa-arrow-left"></i> Orqaga qaytish</button></Link>
            <div className="text-center">
                <h2 className="text-center m-3">Yangi xodim qo'shish</h2>
                <div className="login-inputss row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label className="lab" htmlFor="name">F.I.Sh</label>
                            <input id="name" type="text" onChange={handleChange("name")} placeholder="F.I.Sh" value={name} />
                        </div>
                        <div className="form-group">
                            <label className="lab" htmlFor="phone">Telefon raqami</label>
                            <input id="phone" type="text" onChange={handleChange("phone")} placeholder="Telefon raqami" value={phone} />
                        </div>
                            
                        <div className="form-group selectstatus">
                            <label className="lab" htmlFor="section">Bo`lim</label>
                            <div className="selecrt">
                            <select 
                                name="sections" 
                                id="sections" 
                                onChange={handleChange("section")} // onChange <select>da bo'lishi kerak
                                value={section} // selectning qiymatini bog'lash
                            >
                                <option disabled selected value="">Tanlang:</option>
                                {allSections.map(i => (
                                    <option key={i._id} value={i.name}>
                                        {i.name}
                                    </option>
                                ))}
                            </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label className="lab" htmlFor="degree">Lavozimi</label>
                            <input id="degree" type="text" onChange={handleChange("degree")} placeholder="Lavozimi" value={degree} />
                        </div>
                        <div className="form-group">
                            <label className="lab" htmlFor="password">Parol</label>
                            <input id="password" type="text" onChange={handleChange("password")} placeholder="Parol yarating" value={password} />
                        </div>
                    <div className="form-group selectstatus">
                        <label className="lab" htmlFor="status">Status</label>
                        <select 
                            value={status} 
                            name="status" 
                            id="status" 
                            onChange={handleChange("status")} // Value o'zgarganda handleChange chaqiriladi
                        >
                            <option selected disabled value="">Tanlang:</option>
                            <option value="employee">Xodim</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">Super admin</option>
                        </select>
                    </div>
                </div>
                    <div className="form-group">
                            <label className="lab" htmlFor="acceptedBy">Tasdiqlaydi</label>
                            <input id="acceptedBy" type="text" disabled value={acceptedBy} />
                        </div>
                    </div>
                <div className="form-group">
                    <label htmlFor="autoDownload"><i className="fa-solid fa-download"></i> Formani to`ldirgandan keyin yuklab olish</label>
                    <input
                        type="checkbox"
                        id="autoDownload"
                        checked={autoDownload}
                        onChange={handleSwitchChange}
                    />
                </div>
                <button className="signuplogin" onClick={clickSubmit}>
                    Yuborish
                </button>
            </div>
        </>
    );

    return <div className="">{addNewUserForm()}</div>;
};

export default AddNewUser;