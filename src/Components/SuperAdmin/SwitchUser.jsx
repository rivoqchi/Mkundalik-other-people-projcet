import React, { useState, useEffect } from "react";
import axios from "axios";
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
import LoadingScreen from "../Additional/LoadingScreen";
function Xodimlar() {
  const [newPassword, setNewPassword] = useState("");
  const [schedules, setSchedules] = useState(false);
console.log(schedules);

  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const handleClose3 = () => {
    setShow3(false);
    setShowModal2(true);
  };

  const handleClose4 = () => {
    setShow4(false);
    setShowModal2(true);
  };

  const handleShow3 = () => {
    setShow3(true);
    setShowModal2(false);
  };

  const handleShow4 = () => {
    setShow4(true);
    setShowModal2(false);
  };
  const [allSections, setAllSections] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [allComplexes, setAllComplexes] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editing, setEditing] = useState(true);
  const [editData, setEditData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

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
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setEditData({ ...employee }); // Tahrir uchun alohida nusxa
    setShowModal2(true);
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

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${API}/auth/deletethisuser/${selectedEmployee._id}`
      );
      if (response.status === 200) {
        setAlert({
          show: true,
          type: "success",
          message: "Xodim muvaffaqiyatli o`chirildi!",
        });
        getAllEmployees();
        setShow3(false);
        setShowModal2(false);
      }
    } catch (error) {
      setAlert({ show: true, type: "success", message: "Xatolik!" });

      console.error(error);
    }
  };

  return (
    <div>
      {alert.show && <Alert2 type={alert.type} message={alert.message} />}
      {loading && <LoadingScreen loading={true} />}

      <div className="text-center d-flex justify-content-between xodimlarbuttons">
              <Button variant="success" className="mt-3" onClick={exportToExcel}>
                Excel formatida yuklab olish <i class="fa-solid fa-table"></i>
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
                Reset <i class="fa-solid fa-rotate-right"></i>
              </Button>
              <Button
                variant="primary"
                className="mt-3"
                onClick={() => setShowModal(true)}
              >
                Filter <i class="fa-solid fa-filter"></i>
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

      {loading && <Spinner animation="border" className="mt-3" />}
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
                                          <i class="fa-solid fa-arrow-up-right-from-square"></i>
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
                <Button onClick={handleShow3} variant="danger">
                  Tizimdan o‘chirish
                </Button>
                <div className="d-flex align-items-center gap-2">
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
            Rostan ham xodimni o`chirish kerakmi? O`chirilgan xodimning
            ma'lumotlarini tiklab bo`lmasligini yodingizda saqlang!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>
            Qaytish
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            O`chirib yuborish
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
