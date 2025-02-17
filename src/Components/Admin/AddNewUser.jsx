import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createEmployee } from "../Auth/CheckAuth";
import Alert from "../Additional/Alert";
import axios from "axios";
import { API } from "../../config";

const AddNewUser = () => {
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

  const { name, phone, password, complex, department, section, degree, status, error, success } =
    values;

  const acceptedBy = myName;
  const handleSwitchChange = () => {
    setAutoDownload(!autoDownload); // Switchni qayta almashtirish
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
      const employee = {
        name,
        phone,
        password,
        section,
        department,
        complex,
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
          complex: "",
          department: "",
          section: "",
          degree: "",
          status: "",
          success: true,
          error: "",
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
    }
  };

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
    <>
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      <Link to={`/${myRole}/employees`}>
        <button className="defaultbtn m-3">
          <i className="fa-solid fa-arrow-left"></i> Orqaga qaytish
        </button>
      </Link>
      <div className="text-center">
        <h2 className="text-center m-3">Yangi xodim qo'shish</h2>
        <div className="login-inputss row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label className="lab" htmlFor="name">
                F.I.Sh
              </label>
              <input
                id="name"
                type="text"
                onChange={handleChange("name")}
                placeholder="F.I.Sh"
                value={name}
              />
            </div>
            <div className="form-group">
              <label className="lab" htmlFor="phone">
                Telefon raqami
              </label>
              <input
                id="phone"
                type="text"
                onChange={handleChange("phone")}
                placeholder="Telefon raqami"
                value={phone}
              />
            </div>

            <div className="form-group">
              <label className="lab" htmlFor="password">
                Parol
              </label>
              <input
                id="password"
                type="text"
                onChange={handleChange("password")}
                placeholder="Parol yarating"
                value={password}
              />
            </div>
            <div className="form-group">
              <label className="lab" htmlFor="degree">
                Lavozimi
              </label>
              <input
                id="degree"
                type="text"
                onChange={handleChange("degree")}
                placeholder="Lavozimi"
                value={degree}
              />
            </div>
            

          </div>

          <div className="col-12 col-md-6">
            <div className="form-group selectstatus">
              <label className="lab" htmlFor="status">
                Status
              </label>
              <select
                value={myData.role === "admin" ? "employee" : status} // Admin bo'lsa doim employee bo'ladi
                name="status"
                id="status"
                onChange={handleChange("status")}
                disabled={myData.role === "admin"} // Admin bo'lsa disable qilish
              >
                <option selected disabled value="">
                  Tanlang:
                </option>
                <option value="employee">Xodim (Employee)</option>
                <option value="admin">Bo`lim boshlig`i (Admin)</option>
                <option value="department">Xizmat boshlig`i (Department)</option>
                <option value="complex">Metropoliten boshlig`i o`rinbosari (Complex)</option>
                <option value="superadmin">Super Admin (Barcha imkoniyatlar)</option>
                <option value="boss">Boshliq / Bosh muhandis (Boss)</option>
                <option value="hr">Kadrlar bo`limi (HR)</option>
              </select>
            </div>
            <div className="form-group selectstatus">
              <label className="lab" htmlFor="section">
                Kompleks
              </label>
              <div className="select">
                <select
                  name="complex"
                  id="complex"
                  onChange={handleChange("complex")}
                  value={complex}
                  disabled={myData.role === "admin"}
                >
                  {myData.role === "admin" ? (
                    <option selected disabled value={myData.complex}>
                      {myData.complex}
                    </option>
                  ) : (
                    <>
                      <option disabled selected value="">
                        Tanlang:
                      </option>
                      {allComplexes.map((i) => (
                        <option key={i._id} value={i.name}>
                          {i.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="form-group selectstatus">
              <label className="lab" htmlFor="section">
                Departament
              </label>
              <div className="select">
                <select
                  name="department"
                  id="department"
                  onChange={handleChange("department")}
                  value={department}
                  disabled={myData.role === "admin"} // Admin bo'lsa disable qilish
                >
                  {myData.role === "admin" ? (
                    <option selected disabled value={myData.department}>
                      {myData.department}
                    </option>
                  ) : (
                    <>
                      <option disabled selected value="">
                        Tanlang:
                      </option>
                      {allDepartments.map((i) => (
                        <option key={i._id} value={i.name}>
                          {i.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="form-group selectstatus">
              <label className="lab" htmlFor="section">
                Bo‘lim
              </label>
              <div className="select">
                <select
                  name="sections"
                  id="sections"
                  onChange={handleChange("section")}
                  value={section}
                  disabled={myData.role === "admin"} // Admin bo'lsa disable qilish
                >
                  {myData.role === "admin" ? (
                    <option selected disabled value={myData.section}>
                      {myData.section}
                    </option>
                  ) : (
                    <>
                      <option disabled selected value="">
                        Tanlang:
                      </option>
                      {allSections.map((i) => (
                        <option key={i._id} value={i.name}>
                          {i.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>
            
          </div>
          <div className="form-group">
            <label className="lab" htmlFor="acceptedBy">
              Tasdiqlaydi
            </label>
            <input id="acceptedBy" type="text" disabled value={acceptedBy} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="autoDownload">
            <i className="fa-solid fa-download"></i> Formani to`ldirgandan keyin
            yuklab olish
          </label>
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
