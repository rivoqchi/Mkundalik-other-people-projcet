import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createEmployee } from "../Auth/CheckAuth";
import Alert from "../Additional/Alert";
import axios from "axios";
import { API } from "../../config";
import { useTheme } from "../Additional/ThemeContext";
import { Spinner } from "react-bootstrap";

const AddNewUser = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [allSections, setAllSections] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [allComplexes, setAllComplexes] = useState([]);
  const [myData, setMyData] = useState([]);
  const [myRole, setMyRole] = useState([]);
  const [myName, setMyName] = useState([]);

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [autoDownload, setAutoDownload] = useState(false); // Switch holati
  const [values, setValues] = useState({
    name: "",
    phone: "+998",
    password: "",
    complex: "",
    department: "",
    section: "",
    degree: "",
    status: "",
    error: "",
    success: false,
  });

  let myId = window.localStorage.getItem("user_id");
  const getMyData = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
      setMyData(data.user);
      setMyName(data.user.name);
      if (data.user.role === "admin") {
        setMyRole("admin");
      } else if (data.user.role === "employee") {
        setMyRole("user");
      } else if (data.user.role === "superadmin") {
        setMyRole("superadmin");
      } else if (data.user.role === "complex") {
        setMyRole("complex");
      } else if (data.user.role === "department") {
        setMyRole("department");
      } else if (data.user.role === "hr") {
        setMyRole("hr");
      } else if (data.user.role === "boss") {
        setMyRole("boss");
      } else if (data.user.role === "commission") {
        setMyRole("commission");
      } else if (data.user.role === "staff") {
        setMyRole("staff");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getMyData();
  }, []);

  const getAllSections = async () => {
    try {
      const { data } = await axios.get(`${API}/sections/getall`);
      setAllSections(data.sections);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllDepartments = async () => {
    try {
      const { data } = await axios.get(`${API}/sectors/getall`);
      setAllDepartments(data.sections);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllComplexes = async () => {
    try {
      const { data } = await axios.get(`${API}/complexes/getall`);
      setAllComplexes(data.complexes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getAllSections();
    getAllDepartments();
    getAllComplexes();
  }, []);

  const {
    name,
    phone,
    password,
    complex,
    department,
    section,
    degree,
    status,
    error,
    success,
    key,
  } = values;

  const [loading, setLoading] = useState(false);
  const acceptedBy = myName;

  const handleSwitchChange = () => {
    setAutoDownload(!autoDownload);
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value, error: false });
  };

  const clickSubmit = async (event) => {
    event.preventDefault();
    if (phone.split("").length !== 13) {
      return setValues({
        ...values,
        error: "Telefon raqamni tekshirib qaytadan kiriting!",
      });
    }
    if (phone.slice(0, 4) !== "+998") {
      return setValues({
        ...values,
        error: "Faqat O'zbekiston raqamini kiriting!",
      });
    }

    try {
      setLoading(true);
      const employee = {
        name,
        phone,
        password,
        section,
        department,
        complex,
        key,
        degree,
        status,
        acceptedBy,
      };
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
        });
        if (autoDownload) {
          saveToFile();
        }
        setAlert({
          show: true,
          type: "success",
          message: "Xodim muvaffaqiyatli qo'shildi!",
        });
      }
    } catch (err) {
      console.error("Server bilan ulanishda xatolik:", err);
      setValues({
        ...values,
        error: "Server bilan ulanishda xatolik yuz berdi!",
      });
      setAlert({
        show: true,
        type: "error",
        message: "Server bilan ulanishda xatolik yuz berdi!",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const phoneDigits = values.phone.replace(/\D/g, ""); // faqat raqamlar
    if (phoneDigits.length >= 4) {
      const last4 = phoneDigits.slice(-4);
      setValues((prev) => ({ ...prev, password: last4 }));
    } else {
      setValues((prev) => ({ ...prev, password: "" }));
    }
  }, [values.phone]);
  const saveToFile = () => {
    const data = `Avtorizatsiya mkundalik.uz: \n\nTelefon: ${phone} \nParol: ${password} \n\nIsm: ${name} \nKompleks: ${complex}  \nDepartament: ${department}  \nBo'lim: ${section} \nLavozim: ${degree}\nStatus: ${status} \nTasdiqlagan shaxs: Tizim administratori \n\nmkundalik.uz -> Kirish`;
    const blob = new Blob([data], { type: "text/plain" });
    const link = document.createElement("a");
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
    <div className={`p-4 ${isDark ? "bg-slate-900" : "bg-light"}`} style={{ minHeight: '100vh', transition: 'all 0.3s ease' }}>
      {alert.show && <Alert type={alert.type} message={alert.message} />}

      <div className="d-flex align-items-center mb-4 gap-3">
        <Link to={`/${myRole}/employees`}>
          <button className={`btn rounded-circle d-flex align-items-center justify-content-center ${isDark ? 'btn-outline-light' : 'btn-outline-dark'}`} style={{ width: '40px', height: '40px', padding: 0 }}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </Link>
        <h4 className={`m-0 fw-bold ${isDark ? 'text-white' : 'text-dark'}`}>
          <i className="fa-solid fa-user-plus text-primary me-2"></i> Yangi xodim qo'shish
        </h4>
      </div>

      <div className="glass-card p-4 p-md-5 mb-4 mx-auto" style={{ maxWidth: '900px', background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, borderRadius: '16px', boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)' }}>

        <div className="row g-4">
          <div className="col-12 col-md-6 d-flex flex-column gap-3">
            <div className="form-group">
              <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`} htmlFor="name">F.I.Sh</label>
              <div className="premium-input-wrapper">
                <i className="fa-solid fa-user input-icon"></i>
                <input
                  id="name"
                  type="text"
                  className="premium-input-field w-100"
                  onChange={handleChange("name")}
                  placeholder="Xodimnig F.I.Sh"
                  value={name}
                />
              </div>
            </div>

            <div className="form-group">
              <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`} htmlFor="phone">Telefon raqami</label>
              <div className="premium-input-wrapper">
                <i className="fa-solid fa-phone input-icon"></i>
                <input
                  id="phone"
                  type="text"
                  className="premium-input-field w-100"
                  onChange={handleChange("phone")}
                  placeholder="Telefon raqami"
                  value={phone}
                />
              </div>
            </div>

            <div className="form-group">
              <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`} htmlFor="password">Parol (avtomatik yaratiladi)</label>
              <div className={`premium-input-wrapper ${isDark ? 'opacity-75' : ''}`} style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#e2e8f0' }}>
                <i className="fa-solid fa-lock input-icon"></i>
                <input
                  id="password"
                  type="text"
                  className="premium-input-field w-100 placeholder-muted"
                  value={password || 'Raqamning oxirgi 4 belgisi...'}
                  disabled
                  readOnly
                  style={{ background: 'transparent' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`} htmlFor="degree">Lavozimi</label>
              <div className="premium-input-wrapper">
                <i className="fa-solid fa-user-tag input-icon"></i>
                <input
                  id="degree"
                  type="text"
                  className="premium-input-field w-100"
                  onChange={handleChange("degree")}
                  placeholder="Masalan, bosh mutaxassis"
                  value={degree}
                />
              </div>
            </div>

            <div className="form-group">
              <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`} htmlFor="acceptedBy">Tasdiqlaydigan shaxs</label>
              <div className={`premium-input-wrapper ${isDark ? 'opacity-75' : ''}`} style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#e2e8f0' }}>
                <i className="fa-solid fa-file-signature input-icon"></i>
                <input id="acceptedBy" className="premium-input-field w-100" type="text" disabled value={acceptedBy} style={{ background: 'transparent' }} />
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 d-flex flex-column gap-3">
            <div className="form-group">
              <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`} htmlFor="status">Tizimdagi Roli (Status)</label>
              <div className="premium-input-wrapper" style={{ background: myData.role === "admin" && isDark ? 'rgba(0,0,0,0.2)' : '' }}>
                <i className="fa-solid fa-id-badge input-icon z-index-1"></i>
                <select
                  className="premium-input-field w-100"
                  value={myData.role === "admin" ? "employee" : status}
                  name="status"
                  id="status"
                  onChange={handleChange("status")}
                  disabled={myData.role === "admin"}
                  style={{ appearance: 'none', background: 'transparent' }}
                >
                  <option disabled value="">Taqdim etiladigan huquqni tanlang</option>
                  <option value="employee" className={isDark ? "bg-dark text-white" : ""}>Xodim (Standart)</option>
                  <option value="admin" className={isDark ? "bg-dark text-white" : ""}>Bo'lim boshlig'i (Admin)</option>
                  <option value="department" className={isDark ? "bg-dark text-white" : ""}>Xizmat boshlig'i (Department)</option>
                  <option value="complex" className={isDark ? "bg-dark text-white" : ""}>Boshliq o'rinbosari (Complex)</option>
                  <option value="superadmin" className={isDark ? "bg-dark text-white" : ""}>Super Admin</option>
                  <option value="boss" className={isDark ? "bg-dark text-white" : ""}>Boshliq / Bosh muhandis</option>
                  <option value="commission" className={isDark ? "bg-dark text-white" : ""}>Nazorat komissiyasi</option>
                  <option value="hr" className={isDark ? "bg-dark text-white" : ""}>Kadrlar bo'limi (HR)</option>
                  <option value="sport" className={isDark ? "bg-dark text-white" : ""}>Sport murabbiysi</option>
                  <option value="at" className={isDark ? "bg-dark text-white" : ""}>AKT Mutaxassisi</option>
                  <option value="lang" className={isDark ? "bg-dark text-white" : ""}>Chet tillari nazoratchisi</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`} htmlFor="complex">Kompleks / Korxona</label>
              <div className="premium-input-wrapper" style={{ background: myData.role === "admin" && isDark ? 'rgba(0,0,0,0.2)' : '' }}>
                <i className="fa-solid fa-building input-icon z-index-1"></i>
                <select
                  className="premium-input-field w-100"
                  name="complex"
                  id="complex"
                  onChange={handleChange("complex")}
                  value={complex}
                  disabled={myData.role === "admin"}
                >
                  {myData.role === "admin" ? (
                    <option disabled value={myData.complex}>{myData.complex}</option>
                  ) : (
                    <>
                      <option disabled value="">Tashkilotni tanlang</option>
                      {allComplexes.map((i) => (
                        <option key={i._id} value={i.name} className={isDark ? "bg-dark text-white" : ""}>{i.name}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`} htmlFor="department">Departament / Xizmat</label>
              <div className="premium-input-wrapper" style={{ background: myData.role === "admin" && isDark ? 'rgba(0,0,0,0.2)' : '' }}>
                <i className="fa-solid fa-sitemap input-icon z-index-1"></i>
                <select
                  className="premium-input-field w-100"
                  name="department"
                  id="department"
                  onChange={handleChange("department")}
                  value={department}
                  disabled={myData.role === "admin"}
                >
                  {myData.role === "admin" ? (
                    <option disabled value={myData.department}>{myData.department}</option>
                  ) : (
                    <>
                      <option disabled value="">Xizmatni tanlang</option>
                      {allDepartments.map((i) => (
                        <option key={i._id} value={i.name} className={isDark ? "bg-dark text-white" : ""}>{i.name}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`} htmlFor="sections">Bo'lim / Bekat</label>
              <div className="premium-input-wrapper" style={{ background: myData.role === "admin" && isDark ? 'rgba(0,0,0,0.2)' : '' }}>
                <i className="fa-solid fa-layer-group input-icon z-index-1"></i>
                <select
                  className="premium-input-field w-100"
                  name="sections"
                  id="sections"
                  onChange={handleChange("section")}
                  value={section}
                  disabled={myData.role === "admin"}
                >
                  {myData.role === "admin" ? (
                    <option disabled value={myData.section}>{myData.section}</option>
                  ) : (
                    <>
                      <option disabled value="">Bo'limni tanlang</option>
                      {allSections.map((i) => (
                        <option key={i._id} value={i.name} className={isDark ? "bg-dark text-white" : ""}>{i.name}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`} htmlFor="key">
                Kalit so'z <span className="text-secondary opacity-75 fw-normal">(Faqat rahbariyat o'rinbosarlari uchun)</span>
              </label>
              <div className="premium-input-wrapper">
                <i className="fa-solid fa-key input-icon z-index-1"></i>
                <input
                  id="key"
                  type="text"
                  className="premium-input-field w-100"
                  onChange={handleChange("key")}
                  placeholder="Kalit kodi (Majburiy emas)"
                  value={key}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className={`my-4 opacity-10 ${isDark ? 'border-light' : 'border-dark'}`} />

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="form-check form-switch d-flex align-items-center gap-2 m-0 p-0">
            <label className="switch mb-0" style={{ transform: 'scale(0.8)' }}>
              <input
                type="checkbox"
                id="autoDownload"
                checked={autoDownload}
                onChange={handleSwitchChange}
              />
              <span className="slider round"></span>
            </label>
            <label htmlFor="autoDownload" className={`fw-bold m-0 ${isDark ? 'text-white-50' : 'text-muted'}`} style={{ cursor: 'pointer' }}>
              <i className="fa-solid fa-file-arrow-down me-1"></i> Maxfiy kalitlarni TXT fayl sifatida avto yuklab olish
            </label>
          </div>

          <button
            className="btn btn-primary px-5 py-2 fw-bold d-flex align-items-center gap-2"
            style={{ borderRadius: '12px', minWidth: '180px', justifyContent: 'center' }}
            onClick={clickSubmit}
            disabled={loading}
          >
            {loading ? (
              <><Spinner animation="border" size="sm" /> Yuborilmoqda...</>
            ) : (
              <><i className="fa-solid fa-paper-plane"></i> Tizimga qo'shish</>
            )}
          </button>
        </div>

      </div>
    </div>
  );

  return <>{addNewUserForm()}</>;
};

export default AddNewUser;
