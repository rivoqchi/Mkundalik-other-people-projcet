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
import {Link} from "react-router-dom";
import * as XLSX from "xlsx";

import { API } from "../../config";
import { saveAs } from "file-saver";
import { FaPen } from "react-icons/fa";
import Alert2 from "../Additional/Alert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "../Additional/LoadingScreen";
function Xodimlar() {
  const [newPassword, setNewPassword] = useState("");
  const [schedules, setSchedules] = useState(false);

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
    setShowModal2(false);
      setUserInfo(null);
  };

  const handleShow4 = () => {
    setShow4(true);
    setShowModal2(false);
      setUserInfo(null);
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
      setShowModal2(false);
      setUserInfo(null);
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
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
      setShowModal2(false);
      setUserInfo(null);
      setLoading(false);
    } catch (error) {
      console.error("Xodimni yangilashda xatolik:", error);
      setAlert({ show: true, type: "error", message: "Xatolik yuz berdi!" });
      setLoading(false);
    }
  };

  // Faqat local state ni yangilaydi, backendga so‘rov yubormaydi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  

  return (
    <div>
      {alert.show && <Alert2 type={alert.type} message={alert.message} />}

      <div className="text-center d-flex justify-content-between xodimlarbuttons">
              <Button variant="success" className="mt-3" onClick={exportToExcel}>
                Excel formatida yuklab olish <i className="fa-solid fa-table"></i>
              </Button>
              <Form.Control
                type="text"
                className="mt-3"
                placeholder="Qidirish"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                variant="secondary"
                className="mt-3"
                onClick={() => setSearchTerm("")}
              >
                Reset <i className="fa-solid fa-rotate-right"></i>
              </Button>
              <Button
                variant="primary"
                className="mt-3"
                onClick={() => setShowModal(true)}
              >
                Filter <i className="fa-solid fa-filter"></i>
              </Button>
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

      <div className="table-responsive tretre mt-3">
        <table className="table ozimizaniki">
          <thead>
            <tr>
              <th>N</th>
              <th>F.I.Sh</th>
              <th>Hisobotlari</th>
              <th>Telefon</th>
              <th>Rol</th>
              <th>Kompleks</th>
              <th>Department</th>
              <th>Bo'lim</th>
              <th>Lavozim</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, index) => (
              <tr
                key={emp._id}
                onClick={() => handleEmployeeClick(emp)}
                style={{ cursor: "pointer" }}
              >
                <td>{index + 1}</td>
                <td title={emp.name} style={{ color: "blue" }}>
                  {emp.name?.length > 20
                    ? emp.name.slice(0, 20) + "..."
                    : emp.name}
                </td>
                
                                    <td>
                                      <Link to={`/superadmin/schedule/history/${emp._id}`}>
                                        <button className="hisobotkorish">
                                          Ko`rish{" "}
                                          <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                        </button>
                                      </Link>
                                    </td>
                <td title={emp.phone}>{emp.phone}</td>
                <td title={emp.role}>{emp.role}</td>
                <td title={emp.complex}>
                  {emp.complex?.length > 20
                    ? emp.complex.slice(0, 20) + "..."
                    : emp.complex}
                </td>
                <td title={emp.department}>
                  {emp.department?.length > 20
                    ? emp.department.slice(0, 20) + "..."
                    : emp.department}
                </td>
                <td title={emp.section}>
                  {emp.section?.length > 20
                    ? emp.section.slice(0, 20) + "..."
                    : emp.section}
                </td>
                <td title={emp.degree}>
                  {emp.degree?.length > 20
                    ? emp.degree.slice(0, 20) + "..."
                    : emp.degree}
                </td>
                <td>{emp.nationality}</td>
                <td>{emp.dateOfBirth}</td>
                <td title={emp.placeOfBirth}>
                  {emp.placeOfBirth?.length > 20
                    ? emp.placeOfBirth.slice(0, 20) + "..."
                    : emp.placeOfBirth}
                </td>
                <td title={emp.address}>
                  {emp.address?.length > 20
                    ? emp.address.slice(0, 20) + "..."
                    : emp.address}
                </td>
                <td title={emp.education}>
                  {emp.education?.length > 20
                    ? emp.education.slice(0, 20) + "..."
                    : emp.education}
                </td>
                <td title={emp.speciality}>
                  {emp.speciality?.length > 20
                    ? emp.speciality.slice(0, 20) + "..."
                    : emp.speciality}
                </td>
                <td>{emp.firstAct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <Modal show={showModal2} onHide={() => setShowModal2(false)}>
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
                <Form.Label>Xizmat</Form.Label>
                <Form.Control
                  as="select"
                  name="department"
                  value={selectedEmployee?.department || ""}
                  onChange={handleChange}
                  disabled={!editing}
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
                <Form.Label>Bo'lim</Form.Label>
                <Form.Control
                  as="select"
                  name="section"
                  value={selectedEmployee?.section || ""}
                  onChange={handleChange}
                  disabled={!editing}
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
    </div>
  );
}

export default Xodimlar;
