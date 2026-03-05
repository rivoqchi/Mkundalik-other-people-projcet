import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../config";
import Alert from "./Additional/Alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from "./Images/logo-png.png";

function EditProfile() {
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [values, setValues] = useState({
    dateOfBirth: null,
    name: "",
    degree: "",
    placeOfBirth: "",
    firstAct: new Date(),
    nationality: "",
    education: "",
    speciality: "",
    address: "",
  });

  const navigate = useNavigate();
  const [myData, setMyData] = useState(null);
  const myId = window.localStorage.getItem("user_id");

  useEffect(() => {
    const getMyData = async () => {
      try {
        const { data } = await axios.get(`${API}/auth/mydata/${myId}`, { withCredentials: true });
        setMyData(data.user);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getMyData();
  }, [myId]);

  useEffect(() => {
    if (myData) {
      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split(".");
        if (parts.length === 3) {
          const [day, month, year] = parts.map(Number);
          return new Date(year, month - 1, day);
        }
        return new Date(dateStr);
      };

      setValues({
        dateOfBirth: parseDate(myData.dateOfBirth),
        firstAct: parseDate(myData.firstAct) || new Date(),
        placeOfBirth: myData.placeOfBirth || "",
        name: myData.name || "",
        degree: myData.degree || "",
        nationality: myData.nationality || "",
        education: myData.education || "",
        speciality: myData.speciality || "",
        address: myData.address || "",
      });
    }
  }, [myData]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      dateOfBirth,
      name,
      degree,
      placeOfBirth,
      nationality,
      education,
      speciality,
      address,
    } = values;

    if (!dateOfBirth || !name || !placeOfBirth || !nationality || !degree || !education || !speciality || !address) {
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
        name,
        degree,
        education,
        speciality,
        address,
      };
      await axios.put(`${API}/auth/editprofile/${myId}`, data, { withCredentials: true });

      setAlert({
        show: true,
        type: "success",
        message: "Ma'lumotlar muvaffaqiyatli yangilandi!",
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Xatolik yuz berdi!",
      });
    }
  };

  return (
    <div className="premium-edit-container">
      <div className="edit-header">
        <div className="edit-logo-wrapper">
          <img src={logo} alt="Logo" />
        </div>
        <h3>Profilni tahrirlash</h3>
        <p className="edit-subtitle">Ma'lumotlaringizni yangilab boring</p>
      </div>

      {alert.show && <Alert type={alert.type} message={alert.message} />}

      <form className="premium-edit-form" onSubmit={handleSubmit}>
        <div className="edit-form-grid">
          {/* Ism familiya */}
          <div className="premium-input-group full-width">
            <label htmlFor="name"><i className="fa-solid fa-user"></i> F.I.Sh</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="name"
                value={values.name}
                onChange={handleChange("name")}
                placeholder="To'liq ismingizni kiriting"
              />
            </div>
          </div>

          {/* Lavozim */}
          <div className="premium-input-group full-width">
            <label htmlFor="degree"><i className="fa-solid fa-briefcase"></i> Lavozim</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="degree"
                value={values.degree}
                onChange={handleChange("degree")}
                placeholder="Lavozimingizni kiriting"
              />
            </div>
          </div>

          {/* Tug'ilgan sana */}
          <div className="premium-input-group">
            <label htmlFor="dateOfBirth"><i className="fa-solid fa-calendar-alt"></i> Tug‘ilgan sana</label>
            <div className="datepicker-wrapper">
              <DatePicker
                selected={values.dateOfBirth}
                onChange={(date) => setValues({ ...values, dateOfBirth: date })}
                dateFormat="dd.MM.yyyy"
                placeholderText="Sanani tanlang"
                className="premium-datepicker"
              />
            </div>
          </div>

          {/* Tug'ilgan joy */}
          <div className="premium-input-group">
            <label htmlFor="placeOfBirth"><i className="fa-solid fa-location-dot"></i> Tug‘ilgan joy</label>
            <input
              type="text"
              id="placeOfBirth"
              value={values.placeOfBirth}
              onChange={handleChange("placeOfBirth")}
              placeholder="Tug‘ilgan joyingiz"
            />
          </div>

          {/* Millati */}
          <div className="premium-input-group">
            <label htmlFor="nationality"><i className="fa-solid fa-earth-asia"></i> Millati</label>
            <select
              id="nationality"
              value={values.nationality}
              onChange={handleChange("nationality")}
            >
              <option value="">Tanlang</option>
              <option value="O‘zbek">O‘zbek</option>
              <option value="Rus">Rus</option>
              <option value="Boshqa">Boshqa</option>
            </select>
          </div>

          {/* Ta'lim */}
          <div className="premium-input-group">
            <label htmlFor="education"><i className="fa-solid fa-graduation-cap"></i> Ta'lim</label>
            <select
              id="education"
              value={values.education}
              onChange={handleChange("education")}
            >
              <option value="">Tanlang</option>
              <option value="O‘rta-maxsus">O‘rta-maxsus</option>
              <option value="Tugallanmagan Oliy">Tugallanmagan Oliy</option>
              <option value="Oliy (Bakalavr)">Oliy (Bakalavr)</option>
              <option value="Oliy (Magistr)">Oliy (Magistr)</option>
              <option value="Boshqa">Boshqa</option>
            </select>
          </div>

          {/* Mutaxassislik */}
          <div className="premium-input-group">
            <label htmlFor="speciality"><i className="fa-solid fa-certificate"></i> Mutaxassislik</label>
            <input
              type="text"
              id="speciality"
              value={values.speciality}
              onChange={handleChange("speciality")}
              placeholder="Mutaxassisligingiz"
            />
          </div>

          {/* Manzil */}
          <div className="premium-input-group">
            <label htmlFor="address"><i className="fa-solid fa-house-user"></i> Manzil</label>
            <input
              type="text"
              id="address"
              value={values.address}
              onChange={handleChange("address")}
              placeholder="Yashash manzilingiz"
            />
          </div>
        </div>

        <button type="submit" className="btn-premium-save">
          <i className="fa-solid fa-cloud-arrow-up"></i>
          <span>O'zgarishlarni saqlash</span>
          <div className="btn-glow"></div>
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
