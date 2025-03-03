import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../config";
import Alert from "./Additional/Alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from './Images/logo2.png';
function Fill() {
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [values, setValues] = useState({
    dateOfBirth: null,
    placeOfBirth: "",
    firstAct: new Date(),
    nationality: "",
    education: "",
    speciality: "",
    address: "",
  });

  const navigate = useNavigate();
const [myRole, setMyRole] = useState([]);
  const myId = window.localStorage.getItem("user_id");
  const getMyData = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
      if(data.user.employee){
          if(data.user.role === "admin"){
            navigate("/admin")
          }else if(data.user.role === "employee"){
            navigate("/user")
          }else if(data.user.role === "superadmin"){
            navigate("/superadmin")
          }else if(data.user.role === "complex"){
            navigate("/complex")
          }else if(data.user.role === "department"){
            navigate("/department")
          }else if(data.user.role === "hr"){
            navigate("/hr")
          }else if(data.user.role === "boss"){
            navigate("/boss")
          }else if(data.user.role === "commission"){
            navigate("/commission")
          }else if(data.user.role === "staff"){
            navigate("/staff")
          }
      }
      if(data.user.role === 'admin'){
        setMyRole("admin")
      }else if(data.user.role === 'employee'){
        setMyRole("user")
      }else if(data.user.role === 'superadmin'){
        setMyRole("superadmin")
      }else if(data.user.role === 'complex'){
        setMyRole("complex")
      }else if(data.user.role === 'department'){
        setMyRole("department")
      }else if(data.user.role === 'hr'){
        setMyRole("hr")
      }else if(data.user.role === 'boss'){
        setMyRole("boss")
      }else if(data.user.role === 'commission'){
        setMyRole("commission")
      }else if(data.user.role === 'staff'){
        setMyRole("staff")
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };  
  useEffect(() => {
    getMyData();
  }, []);
  
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { dateOfBirth, placeOfBirth, nationality, education, speciality, address } = values;

    if (!dateOfBirth || !placeOfBirth || !nationality || !education || !speciality || !address) {
      setAlert({
        show: true,
        type: "error",
        message: "Barcha maydonlarni to‘ldiring!",
      });
      return;
    }

    try {
      const formattedDateOfBirth = dateOfBirth.toLocaleDateString("uz-UZ").replace(/\//g, ".");
      const formattedFirstAct = values.firstAct.toLocaleDateString("uz-UZ").replace(/\//g, ".");

      const data = {
        dateOfBirth: formattedDateOfBirth,
        placeOfBirth,
        firstAct: formattedFirstAct,
        nationality,
        education,
        speciality,
        address,
      };
      
      await axios.put(`${API}/auth/fill/${myId}`, data);
      setAlert({ show: true, type: "success", message: "Xodim muvaffaqiyatli qo'shildi!" });
      navigate(`/${myRole}`);
    } catch (error) {
      setAlert({ show: true, type: "error", message: error.response?.data?.message || "Xatolik yuz berdi!" });
    }
  };

  return (
    <div className="fill-container">
        <div className="text-center">
        <img className="logoonform" src={logo} alt="" />
        </div>
        <h3 className="text-center">
            Qatorlarni to`ldiring:
        </h3>
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      <form className="fill-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="dateOfBirth">Tug‘ilgan sana</label>
          <DatePicker
            selected={values.dateOfBirth}
            onChange={(date) => setValues({ ...values, dateOfBirth: date })}
            dateFormat="dd.MM.yyyy"
            placeholderText="Sanani tanlang"
          />
        </div>
        <div className="form-group">
          <label htmlFor="placeOfBirth">Tug‘ilgan joy</label>
          <input
            type="text"
            id="placeOfBirth"
            value={values.placeOfBirth}
            onChange={handleChange("placeOfBirth")}
            placeholder="Tug‘ilgan joyingizni kiriting"
          />
        </div>
        <div className="form-group d-none">
          <label htmlFor="firstAct">Tizimga qo`shildi</label>
          <input
            type="text"
            id="firstAct"
            value={values.firstAct.toLocaleDateString("uz-UZ").replace(/\//g, ":")}
            readOnly disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="nationality">Millati</label>
          <select id="nationality" value={values.nationality} onChange={handleChange("nationality")}>
            <option value="">Tanlang</option>
            <option value="O‘zbek">O‘zbek</option>
            <option value="Rus">Rus</option>
            <option value="Boshqa">Boshqa</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="education">Ta'lim</label>
          <select id="education" value={values.education} onChange={handleChange("education")}>
            <option value="">Tanlang</option>
            <option value="O‘rta-maxsus">O‘rta-maxsus</option>
            <option value="Tugallanmagan Oliy">Tugallanmagan Oliy</option>
            <option value="Oliy (Bakalavr)">Oliy (Bakalavr)</option>
            <option value="Oliy (Magistr)">Oliy (Magistr)</option>
            <option value="Boshqa">Boshqa</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="speciality">Mutaxassislik</label>
          <input
            type="text"
            id="speciality"
            value={values.speciality}
            onChange={handleChange("speciality")}
            placeholder="Mutaxassislikni kiriting"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Manzil</label>
          <input
            type="text"
            id="address"
            value={values.address}
            onChange={handleChange("address")}
            placeholder="Manzilingizni kiriting"
          />
        </div>
        <button type="submit" className="submit-button">
          Saqlash
        </button>
      </form>
    </div>
  );
}

export default Fill;