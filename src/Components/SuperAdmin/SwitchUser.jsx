import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";
import { API } from "../../config";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaPen } from "react-icons/fa";

function Xodimlar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
  const [allComplexes, setAllComplexes] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
    console.log(showModal2, selectedEmployee);
    
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
    setError(null);
    try {
      const { data } = await axios.get(
        `${API}/auth/getallemployeeswithfilter`,
        { params: { role } }
      );
      setAllEmployees(data.employees);
      setFilteredEmployees(data.employees);
    } catch (err) {
      setError("Xodimlarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
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
  const handleSave = () => {
    console.log("Edited Employee Data:", editData);
    setShowModal2(false);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updatedEmployee = {
      ...selectedEmployee,
      [name]: value,
    };
    setSelectedEmployee(updatedEmployee);
    console.log("Updated State:", updatedEmployee);
  
    try {
      await axios.put(`${API}/auth/editauser/${updatedEmployee._id}`, updatedEmployee);
    //   setAlert({
    //     show: true,
    //     type: "success",
    //     message: "Xodim muvaffaqiyatli yangilandi!",
    //   });
    } catch (error) {
      console.error("Xodimni yangilashda xatolik:", error);
    //   setAlert({
    //     show: true,
    //     type: "danger",
    //     message: "Xodimni yangilashda xatolik yuz berdi!",
    //   });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button variant="success" onClick={exportToExcel}>
          Excel formatida yuklab olish
        </Button>
        <Form.Control
          type="text"
          placeholder="Qidirish"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="secondary" onClick={() => setSearchTerm("")}>
          Reset
        </Button>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Filter
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

      <div className="table-responsive mt-3">
      <table className="table ozimizaniki">
  <thead>
    <tr>
      <th>N</th>
      <th>F.I.Sh</th>
      <th>Telefon</th>
      <th>Rol</th>
      <th>Kompleks</th>
      <th>Department</th>
      <th>Bo'lim</th>
      <th>Lavozim</th>
      <th>Millati</th>
      <th>Tug‘ilgan kuni</th>
      <th>Tug‘ilgan joyi</th>
      <th>Yashash manzili</th>
      <th>Ma'lumoti</th>
      <th>Mutaxassisligi</th>
      <th>Tizimga qo‘shildi</th>
    </tr>
  </thead>
  <tbody>
  {filteredEmployees.map((emp, index) => (
    <tr key={emp._id} onClick={() => handleEmployeeClick(emp)} style={{ cursor: "pointer" }}>
      <td>{index + 1}</td>
      <td title={emp.name} style={{ color: "blue" }}>{emp.name?.length > 20 ? emp.name.slice(0, 20) + "..." : emp.name}</td>
      <td title={emp.phone}>{emp.phone}</td>
      <td title={emp.role}>{emp.role}</td>
      <td title={emp.complex}>
        {emp.complex?.length > 20 ? emp.complex.slice(0, 20) + "..." : emp.complex}
      </td>
      <td title={emp.department}>
        {emp.department?.length > 20 ? emp.department.slice(0, 20) + "..." : emp.department}
      </td>
      <td title={emp.section}>
        {emp.section?.length > 20 ? emp.section.slice(0, 20) + "..." : emp.section}
      </td>
      <td title={emp.degree}>
        {emp.degree?.length > 20 ? emp.degree.slice(0, 20) + "..." : emp.degree}
      </td>
      <td>{emp.nationality}</td>
      <td>{emp.dateOfBirth}</td>
      <td title={emp.placeOfBirth}>
        {emp.placeOfBirth?.length > 20 ? emp.placeOfBirth.slice(0, 20) + "..." : emp.placeOfBirth}
      </td>
      <td title={emp.address}>
        {emp.address?.length > 20 ? emp.address.slice(0, 20) + "..." : emp.address}
      </td>
      <td title={emp.education}>
        {emp.education?.length > 20 ? emp.education.slice(0, 20) + "..." : emp.education}
      </td>
      <td title={emp.speciality}>
        {emp.speciality?.length > 20 ? emp.speciality.slice(0, 20) + "..." : emp.speciality}
      </td>
      <td>{emp.firstAct}</td>
    </tr>
  ))}
</tbody>
</table>
      </div>
      {showModal2 && selectedEmployee && (
  <Modal show={showModal2} onHide={() => setShowModal2(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Ma'lumotlar{" "}
            <FaPen
              onClick={() => setEditing(true)}
              style={{ marginLeft: 10, cursor: "pointer" }}
            />
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
              <Form.Control
                type="text"
                name="phone"
                value={selectedEmployee?.phone || ""}
                onChange={handleChange}
                disabled={!editing}
              />
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
    <option value="1">Kompleks 1</option>
    <option value="2">Kompleks 2</option>
    <option value="3">Kompleks 3</option>
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
    <option value="1">Xizmat 1</option>
    <option value="2">Xizmat 2</option>
    <option value="3">Xizmat 3</option>
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
    <option value="1">Bo'lim 1</option>
    <option value="2">Bo'lim 2</option>
    <option value="3">Bo'lim 3</option>
  </Form.Control>
</Form.Group>
            <Form.Group>
              <Form.Label>Lavozimi</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={selectedEmployee?.degree || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </Form.Group>
          </Form>
          {/* <div className="redword">Hech kim o`zgartirmasin! Hali tayyor emas.</div> */}

        </Modal.Body>
        {editing && (
          <Modal.Footer>
            <Button onClick={() => setEditing(false)} variant="success">
              Saqlash
            </Button>
          </Modal.Footer>
        )}
      </Modal>
      
)}
    </div>
  );
}

export default Xodimlar;
