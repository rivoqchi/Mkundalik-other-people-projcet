import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../config";
import Alert from "./Additional/Alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from "./Images/logo2.png";

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
  const [myRole, setMyRole] = useState("");
  const [myData, setMyData] = useState(null);

  const myId = window.localStorage.getItem("user_id");

  useEffect(() => {
    const getMyData = async () => {
      try {
        const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
        setMyData(data.user);
        setMyRole(data.user.role);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getMyData();
  }, [myId]);

  useEffect(() => {
    if (myData) {
      const parseDate = (dateStr) => {
        if (!dateStr) return null; // Agar sana bo'sh bo'lsa, null qaytar
        const parts = dateStr.split(".");
        if (parts.length === 3) {
          const [day, month, year] = parts.map(Number);
          return new Date(year, month - 1, day); // Yil, oy (0-based), kun
        }
        return new Date(dateStr); // Agar format noto‘g‘ri bo‘lsa, to‘g‘ridan-to‘g‘ri `Date` obyektiga o'tkazishga urinish
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
    if (
      !dateOfBirth ||
      !name ||
      !placeOfBirth ||
      !nationality ||
      !degree ||
      !education ||
      !speciality ||
      !address
    ) {
      setAlert({
        show: true,
        type: "error",
        message: "Barcha maydonlarni to‘ldiring!",
      });
      return;
    }
    try {
      const formattedDateOfBirth = dateOfBirth
        .toLocaleDateString("uz-UZ")
        .replace(/\//g, ".");
      const formattedFirstAct = values.firstAct
        .toLocaleDateString("uz-UZ")
        .replace(/\//g, ".");

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
      await axios.put(`${API}/auth/editprofile/${myId}`, data);
      setAlert({
        show: true,
        type: "success",
        message: "Xodim muvaffaqiyatli yangilandi!",
      });
      window.location.reload();
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Xatolik yuz berdi!",
      });
    }
  };

  return (
    <div className="fill-container">
      <div className="text-center">
        <img className="logoonform" src={logo} alt="Logo" />
      </div>
      <h3 className="text-center">Ma'lumotlarni o`zgartirish:</h3>
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      <form className="fill-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">F.I.Sh</label>
          <input
            type="text"
            id="name"
            value={values.name} // defaultValue o‘rniga value ishlatilmoqda
            onChange={handleChange("name")}
            placeholder="Ismingizni kiriting"
          />
        </div>
        <div className="form-group">
          <label htmlFor="degree">Lavozim</label>
          <input
            type="text"
            id="degree"
            value={values.degree} // defaultValue o‘rniga value ishlatilmoqda
            onChange={handleChange("degree")}
            placeholder="Lavozimingizni kiriting"
          />
        </div>
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
            defaultValue={values.placeOfBirth}
            onChange={handleChange("placeOfBirth")}
            placeholder="Tug‘ilgan joyingizni kiriting"
          />
        </div>
        <div className="form-group d-none">
          <label htmlFor="firstAct">Tizimga qo`shildi</label>
          <input
            type="text"
            id="firstAct"
            defaultValue={values.firstAct
              .toLocaleDateString("uz-UZ")
              .replace(/\//g, ":")}
            readOnly
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="nationality">Millati</label>
          <select
            id="nationality"
            defaultValue={values.nationality}
            onChange={handleChange("nationality")}
          >
            <option value="">Tanlang</option>
            <option value="O‘zbek">O‘zbek</option>
            <option value="Rus">Rus</option>
            <option value="Boshqa">Boshqa</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="education">Ta'lim</label>
          <select
            id="education"
            defaultValue={values.education}
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
        <div className="form-group">
          <label htmlFor="speciality">Mutaxassislik</label>
          <input
            type="text"
            id="speciality"
            defaultValue={values.speciality}
            onChange={handleChange("speciality")}
            placeholder="Mutaxassislikni kiriting"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Manzil</label>
          <input
            type="text"
            id="address"
            defaultValue={values.address}
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

export default EditProfile;
