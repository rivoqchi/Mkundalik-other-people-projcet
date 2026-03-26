import React, { useState, useEffect } from "react";
import axios from "axios";
import Accordion from 'react-bootstrap/Accordion';
import {
  Modal,
  Button,
  Spinner,
  Alert,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import ReCAPTCHA from "react-google-recaptcha";

import { API } from "../../config";
import { saveAs } from "file-saver";
import { FaPen } from "react-icons/fa";
import Alert2 from "../Additional/Alert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "../Additional/LoadingScreen";
import { useTheme } from "../Additional/ThemeContext";

function Xodimlar() {
  const [newPassword, setNewPassword] = useState("");
  const [schedules, setSchedules] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const handleClose3 = () => {
    setShow3(false);
    setShowModal2(true);
    setUserInfo(null);
  };

  const handleClose4 = () => {
    setShow4(false);
    setShowModal2(true);
    setUserInfo(null);
  };

  const handleShow3 = () => {
    setShow3(true);
    handleCloseModal2();
  };

  const handleShow4 = () => {
    setShow4(true);
    handleCloseModal2();
  };
  const [allSections, setAllSections] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [allComplexes, setAllComplexes] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const { setLoading } = useLoading();
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  console.log(selectedEmployee);

  const [editing, setEditing] = useState(true);
  const [editData, setEditData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [userInfo, setUserInfo] = useState(null);

  // Manager Assign State
  const [managerPhone, setManagerPhone] = useState("+998");
  const [managerInfo, setManagerInfo] = useState(null);
  const [isLoadingManager, setIsLoadingManager] = useState(false);
  const [assignedFromManager, setAssignedFromManager] = useState(false);

  const getUserById = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/getuser/${selectedEmployee._id}`);
      setUserInfo(data.user);
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error("Xodim haqida ma'lumotni yuklashda xatolik yuz berdi.");
    }
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEmployees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Xodimlar");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "Xodimlar.xlsx");
  };

  const getAllEmployees = async (role = "") => {
    setLoading(true);
    setAlert({ show: true, type: "danger", message: "Xatolik!" });

    try {
      const { data } = await axios.get(
        `${API}/auth/getallemployeesonlytochange`,
        { params: { role } }
      );

      setAllEmployees(data.employees);
      setFilteredEmployees(data.employees);
    } catch (err) {
      setAlert({ show: true, type: "danger", message: "Xatolik!" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const response = await axios.put(`${API}/auth/changepassofthisuser`, {
        id: selectedEmployee._id,
        password: newPassword,
      });
      setAlert({
        show: true,
        type: "success",
        message: "Xodim muvaffaqiyatli yangilandi!",
      });
      handleClose4();
      handleCloseModal2();
    } catch (error) {
      console.error("Xato yuz berdi: ", error);
      setAlert({ show: true, type: "danger", message: "Xatolik!" });
    }
  };

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
    } catch (err) {
      console.error("Error fetching complexes:", err);
    }
  };

  useEffect(() => {
    getAllEmployees();
    getAllComplexes();
    getAllSections();
    getAllDepartments();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmployees(allEmployees);
    } else {
      const filtered = allEmployees.filter((emp) =>
        Object.values(emp).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, allEmployees]);

  const handleFilter = (filterType, value) => {
    if (filterType === "role") getAllEmployees(value);
    else if (filterType === "complex") {
      setFilteredEmployees(allEmployees.filter((emp) => emp.complex === value));
    } else if (filterType === "status") {
      const isActive = value === "active";
      setFilteredEmployees(
        allEmployees.filter((emp) => emp.employee === isActive)
      );
    }
    setShowModal(false);
    setUserInfo(null);
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setEditData({ ...employee }); // Tahrir uchun alohida nusxa
    setShowModal2(true);
    setUserInfo(null);
    setManagerPhone('+998');
    setManagerInfo(null);
    setIsLoadingManager(false);
    setAssignedFromManager(false);
  };

  const handleCloseModal2 = () => {
    setShowModal2(false);
    setUserInfo(null);
    setManagerPhone('+998');
    setManagerInfo(null);
    setIsLoadingManager(false);
    setAssignedFromManager(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const getManagerByPhone = async () => {
    if (managerPhone.length < 13) {
      toast.warning("Iltimos, telefon raqamni to'liq kiriting.");
      return;
    }
    setIsLoadingManager(true);
    setManagerInfo(null);
    try {
      const { data } = await axios.get(`${API}/auth/getuserbyphone/${managerPhone.replace('+', '%2B')}`);
      setManagerInfo(data.user);
    } catch (error) {
      console.error("Error fetching manager by phone:", error);
      setManagerInfo({ notFound: true });
    } finally {
      setIsLoadingManager(false);
    }
  };

  const handleAssignManager = () => {
    if (!managerInfo || managerInfo.notFound) return;

    // Calculate role based on manager's role
    let newRole = "employee";
    switch (managerInfo.role) {
      case "complex":
        newRole = "department";
        break;
      case "department":
        newRole = "admin";
        break;
      case "admin":
        newRole = "employee";
        break;
      default:
        newRole = "employee";
    }

    // Apply the extracted data to the current editing employee
    setSelectedEmployee((prev) => ({
      ...prev,
      complex: managerInfo.complex || prev.complex,
      department: managerInfo.department || prev.department,
      section: managerInfo.section || prev.section,
      role: newRole,
    }));
    
    setAssignedFromManager(true);
    toast.success("Xodim ma'lumotlari rahbariga moslashtirildi. Lavozimni qo'lda kiriting.");
  };

  // Faqat Saqlash bosilganda ishlaydi
  const handleSave = async () => {
    setLoading(true);

    // switch yoqilgan bo‘lsa, schedules ni qo‘shamiz
    const dataToSend = schedules
      ? { ...selectedEmployee, schedules: true }
      : selectedEmployee;

    try {
      await axios.put(
        `${API}/auth/editauser/${selectedEmployee._id}`,
        dataToSend
      );
      setAlert({
        show: true,
        type: "success",
        message: "Xodim muvaffaqiyatli yangilandi!",
      });
      getAllEmployees();
      handleCloseModal2();
      setLoading(false);
    } catch (error) {
      console.error("Xodimni yangilashda xatolik:", error);
      setAlert({ show: true, type: "error", message: "Xatolik yuz berdi!" });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [showImpersonateModal, setShowImpersonateModal] = useState(false);
  const [impersonatePassword, setImpersonatePassword] = useState("");
  const [impersonateCaptcha, setImpersonateCaptcha] = useState("");
  const [showImpersonateCaptcha, setShowImpersonateCaptcha] = useState(false);
  const [showModifiedDatesModal, setShowModifiedDatesModal] = useState(false);
  const [newModifiedDate, setNewModifiedDate] = useState("");
  const [tempModifiedDates, setTempModifiedDates] = useState([]);

  const openModifiedDatesModal = (emp) => {
    setSelectedEmployee(emp);
    setTempModifiedDates(emp.modifiedDates || []);
    setShowModifiedDatesModal(true);
  };

  const handleAddModifiedDate = () => {
    if (!newModifiedDate) return;
    const date = new Date(newModifiedDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    if (tempModifiedDates.includes(formattedDate)) {
      toast.warning("Ushbu kun allaqachon ro'yxatda bor!");
      return;
    }

    setTempModifiedDates([...tempModifiedDates, formattedDate]);
    setNewModifiedDate("");
  };

  const handleDeleteModifiedDate = (dateToDelete) => {
    setTempModifiedDates(tempModifiedDates.filter((d) => d !== dateToDelete));
  };

  const handleSaveModifiedDates = async () => {
    setLoading(true);
    try {
      // Create a fresh object to send to the backend
      const updatedUser = {
        ...selectedEmployee,
        modifiedDates: tempModifiedDates
      };
      
      await axios.put(`${API}/auth/editauser/${selectedEmployee._id}`, updatedUser);
      toast.success("Sababli kunlar muvaffaqiyatli saqlandi!");
      getAllEmployees();
      setShowModifiedDatesModal(false);
    } catch (error) {
      console.error("Error saving modified dates:", error);
      toast.error("Xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  const handleImpersonate = async () => {
    if (!impersonatePassword) {
      toast.info("Parolni kiriting!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/impersonate`, {
        targetUserId: selectedEmployee._id,
        password: impersonatePassword,
        captchaToken: impersonateCaptcha,
      }, { withCredentials: true });

      if (data.captchaRequired) {
        setShowImpersonateCaptcha(true);
        toast.warning("Xavfsizlik tekshiruvidan o'ting.");
      } else if (data.locked) {
        toast.error(data.error);
      } else {
        // Success
        localStorage.setItem("fullName", data.employee.name);
        localStorage.setItem("degree", data.employee.degree);
        localStorage.setItem("phone", data.employee.phone);
        localStorage.setItem("role", data.employee.role);
        localStorage.setItem("user_id", data.employee._id);
        localStorage.setItem("token", data.token);
        localStorage.setItem("isSignedIn", "true");

        toast.success(`${data.employee.name} profili bilan tizimga kirildi!`);

        const dashboardRoutes = {
          employee: "/user/dashboard",
          admin: "/admin/dashboard",
          superadmin: "/superadmin/dashboard",
          complex: "/complex/dashboard",
          department: "/department/dashboard",
          hr: "/hr/dashboard",
          lang: "/lang/dashboard",
          commission: "/commission/dashboard",
          sport: "/sport/dashboard",
          at: "/at/dashboard",
          boss: "/boss/dashboard"
        };

        setTimeout(() => {
          window.location.href = dashboardRoutes[data.employee.role] || "/";
        }, 1500);
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.captchaRequired) {
        setShowImpersonateCaptcha(true);
        toast.warning("Xavfsizlik tekshiruvidan o'ting.");
      } else if (data?.locked) {
        toast.error(data.error);
      } else {
        toast.error(data?.error || "Xatolik yuz berdi!");
      }
    } finally {
      setLoading(false);
    }
  };

  const openImpersonateModal = (emp) => {
    setSelectedEmployee(emp);
    setImpersonatePassword("");
    setImpersonateCaptcha("");
    setShowImpersonateCaptcha(false);
    setShowImpersonateModal(true);
  };



  return (
    <div className={`p-4 ${isDark ? "bg-slate-900" : "bg-light"}`} style={{ minHeight: '100vh', transition: 'all 0.3s ease' }}>
      {alert.show && <Alert2 type={alert.type} message={alert.message} />}

      <div className="glass-card p-4 mb-4" style={{ background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, borderRadius: '16px' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <h4 className={`m-0 fw-bold ${isDark ? 'text-white' : 'text-dark'}`}>
            <i className="fa-solid fa-users-gear text-primary me-2"></i> Xodimlar boshqaruvi
          </h4>
          <div className="d-flex flex-wrap gap-2">
            <div className="premium-input-wrapper" style={{ minWidth: '250px', background: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}` }}>
              <i className="fa-solid fa-search input-icon" style={{ color: isDark ? '#94a3b8' : '#64748b' }}></i>
              <input
                type="text"
                className="premium-input-field w-100"
                placeholder="Xodimlarni qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', color: isDark ? 'white' : 'black', border: 'none', paddingLeft: '40px' }}
              />
            </div>
            <Button variant={isDark ? "outline-light" : "outline-dark"} onClick={() => setSearchTerm("")} title="Tozalash" className="d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', padding: 0, borderRadius: '10px' }}>
              <i className="fa-solid fa-rotate-right"></i>
            </Button>
            <Button variant="primary" onClick={() => setShowModal(true)} className="d-flex align-items-center gap-2" style={{ height: '45px', borderRadius: '10px' }}>
              <i className="fa-solid fa-filter"></i> Filtrlash
            </Button>
            <Button variant="success" onClick={exportToExcel} className="d-flex align-items-center gap-2" style={{ height: '45px', borderRadius: '10px' }}>
              <i className="fa-solid fa-file-excel"></i> Excel
            </Button>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xodimlarni filtrlash</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Role bo‘yicha filtr</h5>
          <Button onClick={() => handleFilter("role", "admin")}>
            Adminlar
          </Button>
          <Button
            className="mx-2"
            onClick={() => handleFilter("role", "employee")}
          >
            Userlar
          </Button>
          <Button onClick={() => handleFilter("role", "")}>Hammasi</Button>
          <hr />
          <h5>Tizimda</h5>
          <Button onClick={() => handleFilter("status", "active")}>
            Aktiv
          </Button>
          <Button
            className="mx-2"
            onClick={() => handleFilter("status", "inactive")}
          >
            Noaktiv
          </Button>
          <hr />
          <h5>Kompleks</h5>
          {allComplexes.map((c) => (
            <Button
              key={c._id}
              className="m-1"
              onClick={() => handleFilter("complex", c.name)}
            >
              {c.name}
            </Button>
          ))}
        </Modal.Body>
      </Modal>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="glass-card overflow-hidden" style={{ background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, borderRadius: '16px' }}>
        <div className="table-responsive" style={{ maxHeight: '70vh' }}>
          <table className={`table table-hover mb-0 ${isDark ? 'table-dark' : ''}`} style={{ background: 'transparent' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>
                <th className={`border-0 py-3 ${isDark ? 'text-secondary' : 'text-muted'}`}>#</th>
                <th className={`border-0 py-3 ${isDark ? 'text-secondary' : 'text-muted'}`}>F.I.Sh</th>
                <th className={`border-0 py-3 ${isDark ? 'text-secondary' : 'text-muted'}`}>Rol</th>
                <th className={`border-0 py-3 ${isDark ? 'text-secondary' : 'text-muted'}`}>Bo'lim</th>
                <th className={`border-0 py-3 ${isDark ? 'text-secondary' : 'text-muted'}`}>Lavozimi</th>
                <th className={`border-0 py-3 ${isDark ? 'text-secondary' : 'text-muted'}`}>Telefon</th>
                <th className={`border-0 py-3 text-center ${isDark ? 'text-secondary' : 'text-muted'}`}>Amallar</th>
                <th className={`border-0 py-3 text-center ${isDark ? 'text-secondary' : 'text-muted'}`}>Impersonatizatsiya</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? filteredEmployees.map((emp, index) => (
                <tr
                  key={emp._id}
                  onClick={() => handleEmployeeClick(emp)}
                  style={{ cursor: "pointer", transition: 'background-color 0.2s ease', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
                  className="align-middle"
                >
                  <td className={`py-3 ${isDark ? 'text-white-50' : 'text-muted'}`}>{index + 1}</td>
                  <td className="py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        {emp.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className={`fw-bold ${isDark ? 'text-white' : 'text-dark'}`}>{emp.name?.length > 25 ? emp.name.slice(0, 25) + "..." : emp.name || "Noma'lum Xodim"}</div>
                        <div className={isDark ? "text-white-50" : "text-muted"} style={{ fontSize: "0.80rem" }}>{emp.complex?.length > 30 ? emp.complex.slice(0, 30) + "..." : emp.complex || "Biriktirilmagan"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`badge px-3 py-2 rounded-pill ${emp.role === 'admin' || emp.role === 'superadmin' ? 'bg-danger bg-opacity-10 text-danger border border-danger-subtle' :
                      emp.role === 'department' || emp.role === 'complex' || emp.role === 'boss' ? 'bg-warning bg-opacity-10 text-warning border border-warning-subtle' :
                        emp.role === 'inactive' ? 'bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle' :
                          'bg-primary bg-opacity-10 text-primary border border-primary-subtle'
                      }`}>
                      {emp.role?.toUpperCase() || "EMPLOYEE"}
                    </span>
                  </td>
                  <td className={`py-3 ${isDark ? 'text-light' : 'text-dark'}`} style={{ maxWidth: '200px' }}>
                    <div className="text-truncate" title={emp.department || emp.section}>
                      {emp.department || emp.section || "-"}
                    </div>
                  </td>
                  <td className={`py-3 ${isDark ? 'text-light' : 'text-dark'}`} style={{ maxWidth: '150px' }}>
                    <div className="text-truncate" title={emp.degree}>
                      {emp.degree || "-"}
                    </div>
                  </td>
                  <td className={`py-3 ${isDark ? 'text-light' : 'text-dark'}`}>{emp.phone || "-"}</td>
                  <td className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/superadmin/schedule/history/${emp._id}`}>
                      <Button variant={isDark ? "outline-light" : "outline-primary"} size="sm" className="rounded-pill px-3" title="Hisobotlarini ko'rish">
                        <i className="fa-solid fa-chart-line me-1"></i> Hisobot
                      </Button>
                    </Link>
                  </td>
                  <td className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => openImpersonateModal(emp)}
                    >
                      <i className="fa-solid fa-user-secret me-1"></i> Kirish
                    </Button>
                    <Button
                      variant={isDark ? "outline-info" : "outline-primary"}
                      size="sm"
                      className="rounded-pill px-3 ms-2"
                      onClick={() => openModifiedDatesModal(emp)}
                      title="Sababli kun qo'shish"
                    >
                      S / K
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className={`text-center py-5 ${isDark ? 'text-white-50' : 'text-muted'}`}>
                    <i className="fa-solid fa-folder-open fs-1 mb-3 d-block opacity-50"></i>
                    Xodimlar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editing && (
        <Modal show={showModal2} onHide={handleCloseModal2}>
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center justify-content-between">
              <div className="">Lavozimni ko`chirish</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>F.I.Sh</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedEmployee?.name || ""}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Telefon</Form.Label>
                <InputGroup>
                  <InputGroup.Text>+998</InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="phone"
                    value={selectedEmployee?.phone?.slice(4) || ""} // faqat +998 dan keyingi qismini ko‘rsatadi
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "phone",
                          value: "+998" + e.target.value,
                        },
                      })
                    }
                    disabled={!editing}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={selectedEmployee?.role || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className={assignedFromManager ? "border border-primary bg-primary bg-opacity-10" : ""}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                  <option value="department">Department</option>
                  <option value="complex">Complex</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="boss">Boss</option>
                  <option value="commission">E'tiroz komissiyasi</option>
                  <option value="hr">HR</option>
                  <option value="sport">Sport murabbiysi</option>
                  <option value="at">AKT nazoratchisi</option>
                  <option value="lang">Til nazoratchisi</option>
                  <option value="inactive">Nofaol (ishdan bo`shatildi)</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Kompleks</Form.Label>
                <Form.Control
                  as="select"
                  name="complex"
                  value={selectedEmployee?.complex || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className={assignedFromManager ? "border border-primary bg-primary bg-opacity-10" : ""}
                >
                  <option disabled value="">
                    Tanlang:
                  </option>
                  {allComplexes.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Xizmat/Departament</Form.Label>
                <Form.Control
                  as="select"
                  name="department"
                  value={selectedEmployee?.department || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className={assignedFromManager ? "border border-primary bg-primary bg-opacity-10" : ""}
                >
                  <option disabled value="">
                    Tanlang:
                  </option>
                  {allDepartments.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Bo'lim/Qism</Form.Label>
                <Form.Control
                  as="select"
                  name="section"
                  value={selectedEmployee?.section || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className={assignedFromManager ? "border border-primary bg-primary bg-opacity-10" : ""}
                >
                  <option disabled value="">
                    Tanlang:
                  </option>
                  {allSections.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Lavozimi</Form.Label>
                <Form.Control
                  type="text"
                  name="degree"
                  value={selectedEmployee?.degree || ""}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Form.Group>
            </Form>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="1">
                <Accordion.Header>Umumiy ma'lumot</Accordion.Header>
                <Accordion.Body>
                  <button onClick={getUserById} className="defaultbtn">
                    Qidirish...
                  </button>

                  {userInfo && (
                    <div className="terminal">
                      <div className="terminal-header">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                        <span className="terminal-title">user_info.json</span>
                      </div>

                      <pre className="terminal-body">
                        <code>
                          {JSON.stringify(userInfo, null, 2)}
                        </code>
                      </pre>
                    </div>
                  )}
                </Accordion.Body>

              </Accordion.Item>
            </Accordion>

            <Accordion defaultActiveKey="0" className="mt-3">
              <Accordion.Item eventKey="1">
                <Accordion.Header>Rahbarga biriktirish</Accordion.Header>
                <Accordion.Body>
                  <p className="text-muted small mb-2">Rahbarga biriktirish uchun qidiring. Topilgandan so'ng "Biriktirish" tugmasini bossangiz, struktura avtomatik to'ldiriladi.</p>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Rahbarning telefon raqami"
                      value={managerPhone}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val.startsWith('+998')) {
                          setManagerPhone('+998' + val.replace(/[^0-9]/g, '').slice(3));
                        } else {
                          setManagerPhone('+' + val.replace(/[^0-9]/g, ''));
                        }
                      }}
                      maxLength={13} // +998XXXXXXXXX
                    />
                    <Button variant="outline-primary" onClick={getManagerByPhone} disabled={isLoadingManager}>
                      {isLoadingManager ? <span className="spinner-border spinner-border-sm"></span> : "Qidirish"}
                    </Button>
                  </InputGroup>

                  {managerInfo && !managerInfo.notFound && (
                    <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light border-primary mb-3">
                      <div>
                        <div className="fw-bold fs-6">{managerInfo.name}</div>
                        <div className="text-muted small text-uppercase">Rol: {managerInfo.role}</div>
                        <div className="text-muted small">{managerInfo.degree || "Lavozim kiritilmagan"}</div>
                      </div>
                      <Button variant="primary" size="sm" onClick={handleAssignManager} className="rounded-pill px-3 shadow-sm">
                        Biriktirish
                      </Button>
                    </div>
                  )}

                  {managerInfo && managerInfo.notFound && (
                    <Alert2 type="danger" message="Bunday telefon raqamli rahbar topilmadi." />
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            {/* <div className="redword">Hech kim o`zgartirmasin! Hali tayyor emas.</div> */}
            <div className="row m-2 align-items-center">
              <div className="col-6 text-start">
                <Button onClick={handleShow4} variant="primary">
                  Parolni o‘zgartirish
                </Button>
              </div>
              <div className="col-6 text-end d-flex justify-content-end align-items-center gap-2">
                <p className="rem08 mb-0">+ hisobotlarini ko‘chirish</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={schedules}
                    onChange={(e) => setSchedules(e.target.checked)}
                  />{" "}
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </Modal.Body>
          {editing && (
            <Modal.Footer>
              <div className="d-flex justify-content-between w-100">
                <div className="d-flex align-items-center gap-2">
                  <div>Ishdan bo`shatish uchun "ROL"ga "Nofaol" tanlanadi.</div>
                  <Button onClick={handleSave} variant="success">
                    Saqlash
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          )}
        </Modal>
      )}

      <Modal show={show3} onHide={handleClose3}>
        <Modal.Header closeButton>
          <Modal.Title>Diqqat!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="redword">
            Rostan ham xodim ishdan bo`shatildimi?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>
            Qaytish
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show4} onHide={handleClose4}>
        <Modal.Header closeButton>
          <Modal.Title>Parolni o`zgartirish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            <b>{selectedEmployee?.name}</b> ning tizimga kirish parolini
            o`zgartiryapsiz:
          </h5>
          <br />
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Yangi parolni kiriting"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose4}>
            Yopish
          </Button>
          <Button
            variant="primary"
            disabled={!newPassword}
            onClick={handlePasswordChange}
          >
            O`zgartirish
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImpersonateModal} onHide={() => setShowImpersonateModal(false)} centered>
        <Modal.Header closeButton className={isDark ? "bg-slate-800 text-white border-slate-700" : "bg-white text-dark border-bottom"}>
          <Modal.Title className="fw-bold">
            <i className="fa-solid fa-user-shield text-danger me-2"></i> Impersonatizatsiya
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-slate-800 text-white" : "bg-white text-dark"}>
          <div className="mb-4">
            <p className="mb-1 text-secondary" style={{ fontSize: '0.9rem' }}>Target User:</p>
            <h5 className="fw-bold mb-0">{selectedEmployee?.name}</h5>
            <small className="text-secondary">{selectedEmployee?.degree}</small>
          </div>

          <Alert variant="warning" className="border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#856404' }}>
            <i className="fa-solid fa-circle-exclamation me-2"></i>
            Ushbu profilga 15 daqiqa davomida kirish huquqini olasiz. Tasdiqlash uchun <b>o'z parolingizni</b> kiritishingiz kerak.
          </Alert>

          <Form.Group className="mb-3">
            <Form.Label className="fw-medium">Superadmin Paroli</Form.Label>
            <div className="premium-input-wrapper w-100" style={{ background: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}` }}>
              <i className="fa-solid fa-shield-keyhole input-icon" style={{ color: isDark ? '#94a3b8' : '#64748b' }}></i>
              <input
                type="password"
                className="premium-input-field w-100"
                placeholder="Parolingizni kiriting"
                value={impersonatePassword}
                onChange={(e) => setImpersonatePassword(e.target.value)}
                style={{ background: 'transparent', color: isDark ? 'white' : 'black', border: 'none', paddingLeft: '40px' }}
              />
            </div>
          </Form.Group>

          {showImpersonateCaptcha && (
            <div className="d-flex justify-content-center my-3">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={(token) => setImpersonateCaptcha(token)}
                theme={isDark ? "dark" : "light"}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-top"}>
          <Button variant="secondary" onClick={() => setShowImpersonateModal(false)} className="px-4">
            Bekor qilish
          </Button>
          <Button
            variant="danger"
            onClick={handleImpersonate}
            className="px-4 d-flex align-items-center gap-2"
            disabled={showImpersonateCaptcha && !impersonateCaptcha}
          >
            <i className="fa-solid fa-bolt"></i> Kirish
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModifiedDatesModal} onHide={() => setShowModifiedDatesModal(false)} centered>
        <Modal.Header closeButton className={isDark ? "bg-slate-800 text-white border-slate-700" : "bg-white text-dark border-bottom"}>
          <Modal.Title className="fw-bold">
            <i className="fa-solid fa-calendar-plus text-primary me-2"></i> Sababli kunlar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-slate-800 text-white" : "bg-white text-dark"}>
          <div className="mb-4">
            <p className="mb-1 text-secondary" style={{ fontSize: '0.9rem' }}>Xodim:</p>
            <h5 className="fw-bold mb-0">{selectedEmployee?.name}</h5>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-medium">Yangi kun qo'shish (DD/MM/YYYY 00:00)</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="datetime-local"
                value={newModifiedDate}
                onChange={(e) => setNewModifiedDate(e.target.value)}
                className={isDark ? "bg-slate-700 text-white border-slate-600" : ""}
              />
              <Button variant="primary" onClick={handleAddModifiedDate}>
                Qo'shish
              </Button>
            </div>
          </Form.Group>

          <hr className={isDark ? "border-slate-700" : ""} />

          <Form.Label className="fw-medium mb-2">Kunlar ro'yxati</Form.Label>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {tempModifiedDates.length > 0 ? (
              <ul className="list-group list-group-flush border-top border-bottom">
                {tempModifiedDates.map((date, idx) => (
                  <li key={idx} className={`list-group-item d-flex justify-content-between align-items-center ${isDark ? "bg-slate-800 text-white border-slate-700" : ""}`}>
                    <span>{date}</span>
                    <Button variant="link" className="text-danger p-0" onClick={() => handleDeleteModifiedDate(date)}>
                      <i className="fa-solid fa-trash-can"></i>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-secondary my-3 italic">Hozircha kunlar yo'q</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className={isDark ? "bg-slate-800 border-slate-700" : "bg-white border-top"}>
          <Button variant="secondary" onClick={() => setShowModifiedDatesModal(false)}>
            Bekor qilish
          </Button>
          <Button variant="success" onClick={handleSaveModifiedDates} disabled={!selectedEmployee}>
            Saqlash
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Xodimlar;
