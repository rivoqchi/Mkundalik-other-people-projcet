import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../config";
import Alert from "./Additional/Alert";
import DatePicker from "react-datepicker";
import { motion, AnimatePresence } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import "./Fill.scss";
import logo from './Images/logo2.png';

function Fill() {
  const [alert, setAlert] = useState({ show: false, type: "", message: "", trigger: 0 });
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
          }else if(data.user.role === "lang"){
            navigate("/lang")
          }else if(data.user.role === "boss"){
            navigate("/boss")
          }else if(data.user.role === "commission"){
            navigate("/commission")
          }else if(data.user.role === "staff"){
            navigate("/staff")
          }else if(data.user.role === "at"){
            navigate("/at")
          }else if(data.user.role === "sport"){
            navigate("/sport")
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
        trigger: alert.trigger + 1
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
      setAlert({ show: true, type: "success", message: "Xodim muvaffaqiyatli qo'shildi!", trigger: alert.trigger + 1 });
      navigate(`/${myRole}`);
      window.localStorage.setItem("permission", true);
    } catch (error) {
      setAlert({ show: true, type: "error", message: error.response?.data?.message || "Xatolik yuz berdi!", trigger: alert.trigger + 1 });
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 15, stiffness: 100 } }
  };

  return (
    <div className="fill-page-premium">
      <div className="ambient-glows">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>

      <motion.div 
        className="fill-card-premium"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="fill-header" variants={itemVariants}>
          <div className="logo-container">
            <img src={logo} alt="Logo" />
          </div>
          <h1>Ma'lumotlarni to'ldirish</h1>
          <p className="subtitle">Davom etish uchun shaxsiy ma'lumotlaringizni kiriting</p>
          <div className="mt-3">
            <span className="user-name-highlight">
              <i className="fa-solid fa-user-circle me-2"></i>
              {window.localStorage.getItem('fullName')}
            </span>
          </div>
        </motion.div>

        <form className="fill-form-premium" onSubmit={handleSubmit}>
          
          <motion.div className="input-wrapper-cyber form-group-full" variants={itemVariants}>
            <label className="cyber-label">Tug‘ilgan sana</label>
            <div className="field-icon"><i className="fa-regular fa-calendar-alt"></i></div>
            <DatePicker
              selected={values.dateOfBirth}
              onChange={(date) => setValues({ ...values, dateOfBirth: date })}
              dateFormat="dd.MM.yyyy"
              placeholderText="Sanani tanlang"
              className="input-field"
              wrapperClassName="w-100"
            />
          </motion.div>

          <motion.div className="input-wrapper-cyber form-group-full" variants={itemVariants}>
            <label className="cyber-label">Tug‘ilgan joy</label>
            <div className="field-icon"><i className="fa-solid fa-map-marker-alt"></i></div>
            <input
              type="text"
              className="input-field"
              value={values.placeOfBirth}
              onChange={handleChange("placeOfBirth")}
              placeholder="Tug‘ilgan joyingizни kiriting"
            />
          </motion.div>

          <motion.div className="input-wrapper-cyber" variants={itemVariants}>
            <label className="cyber-label">Millati</label>
            <div className="field-icon"><i className="fa-solid fa-globe"></i></div>
            <select value={values.nationality} onChange={handleChange("nationality")}>
              <option value="">Tanlang</option>
              <option value="O‘zbek">O‘zbek</option>
              <option value="Rus">Rus</option>
              <option value="Boshqa">Boshqa</option>
            </select>
          </motion.div>

          <motion.div className="input-wrapper-cyber" variants={itemVariants}>
            <label className="cyber-label">Ta'lim</label>
            <div className="field-icon"><i className="fa-solid fa-user-graduate"></i></div>
            <select value={values.education} onChange={handleChange("education")}>
              <option value="">Tanlang</option>
              <option value="O‘rta-maxsus">O‘rta-maxsus</option>
              <option value="Tugallanmagan Oliy">Tugallanmagan Oliy</option>
              <option value="Oliy (Bakalavr)">Oliy (Bakalavr)</option>
              <option value="Oliy (Magistr)">Oliy (Magistr)</option>
              <option value="Boshqa">Boshqa</option>
            </select>
          </motion.div>

          <motion.div className="input-wrapper-cyber form-group-full" variants={itemVariants}>
            <label className="cyber-label">Mutaxassislik</label>
            <div className="field-icon"><i className="fa-solid fa-briefcase"></i></div>
            <input
              type="text"
              className="input-field"
              value={values.speciality}
              onChange={handleChange("speciality")}
              placeholder="Mutaxassislikни kiriting"
            />
          </motion.div>

          <motion.div className="input-wrapper-cyber form-group-full" variants={itemVariants}>
            <label className="cyber-label">Yashash Manzili</label>
            <div className="field-icon"><i className="fa-solid fa-house-chimney"></i></div>
            <input
              type="text"
              className="input-field"
              value={values.address}
              onChange={handleChange("address")}
              placeholder="To'liq manzilни kiriting"
            />
          </motion.div>

          <motion.button 
            type="submit" 
            className="btn-cyber-submit"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="shimmer"></div>
            <span>SAQLASH</span>
            <i className="fa-solid fa-check"></i>
          </motion.button>
        </form>
      </motion.div>

      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="alert-fixed-container"
          >
            <Alert
              type={alert.type}
              message={alert.message}
              trigger={alert.trigger}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Fill;