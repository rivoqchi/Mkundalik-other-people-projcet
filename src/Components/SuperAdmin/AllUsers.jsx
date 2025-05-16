import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";
import { API } from "../../config";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DownloadObject from "./DownloadObject"
function Xodimlar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
  const [allComplexes, setAllComplexes] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Xodimlarni olish
  const getAllEmployees = async (role = "") => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${API}/auth/getallemployeeswithfilter`,
        {
          params: { role },
        }
      );
      setAllEmployees(data.employees);
      setFilteredEmployees(data.employees);
    } catch (err) {
      setError("Xodimlarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

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

  // Komplekslarni olish
  const getAllComplexes = async () => {
    try {
      const { data } = await axios.get(`${API}/complexes/getall`);
      setAllComplexes(data.complexes);
    } catch (err) {
      console.error("Error fetching complexes:", err);
    }
  };

  // Sahifa yuklanganda API chaqiriladi
  useEffect(() => {
    getAllEmployees();
    getAllComplexes();
  }, []);

  // Filtrlash funksiyasi (role va kompleks bo‘yicha)
  const handleFilter = (filterType, value) => {
    if (filterType === "role") {
      getAllEmployees(value);
    } else if (filterType === "complex") {
      const filtered = allEmployees.filter((emp) => emp.complex === value);
      setFilteredEmployees(filtered);
    } else if (filterType === "status") {
      if (value === "active") {
        setFilteredEmployees(
          allEmployees.filter((emp) => emp.employee === true)
        );
      } else if (value === "inactive") {
        setFilteredEmployees(allEmployees.filter((emp) => !emp.employee));
      }
    }
    setShowModal(false);
  };

  return (
    <div>
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
          <Button
            variant="primary"
            onClick={() => handleFilter("role", "admin")}
          >
            Adminlar
          </Button>
          <Button
            variant="secondary"
            className="mx-2"
            onClick={() => handleFilter("role", "employee")}
          >
            Userlar
          </Button>
          <Button variant="success" onClick={() => handleFilter("role", "")}>
            Hammasi
          </Button>
        </Modal.Body>

        <Modal.Body>
          <h5>Tizimda</h5>
          <Button
            variant="success"
            onClick={() => handleFilter("status", "active")}
          >
            Aktiv xodimlar
          </Button>
          <Button
            onClick={() => handleFilter("status", "inactive")}
            variant="danger"
            className="mx-2"
          >
            Faollashtirilmagan xodimlar
          </Button>
        </Modal.Body>

        <Modal.Body>
          <h5>Kompleks bo‘yicha filtr</h5>
          {allComplexes.length > 0 ? (
            allComplexes.map((complex) => (
              <Button
                key={complex._id}
                variant="info"
                className="m-1"
                onClick={() => handleFilter("complex", complex.name)}
              >
                {complex.name}
              </Button>
            ))
          ) : (
            <p>Komplekslar yo‘q</p>
          )}
        </Modal.Body>
      </Modal>

      <div className="table-responsive alluserss">
        {loading && (
          <Spinner animation="border" className="d-block mx-auto mt-3" />
        )}
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
        <h3 className="text-center m-3">Jami: {filteredEmployees.length} ta xodim</h3>
        <div className="allusers">
          {!loading && !error && (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>N</th>
                  <th>F.I.Sh</th>
                  <th>Hisobotlari</th>
                  <th>Yuklab olish</th>
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
                {filteredEmployees.map((employee, index) => (
                  <tr key={employee._id}>
                    <td>{index + 1}</td>
                    <td title={employee.name}>
                      {employee.name?.length > 20
                        ? employee.name.slice(0, 20) + "..."
                        : employee.name}
                    </td>
                    <td>
                      <Link to={`/${window.localStorage.getItem('role')}/schedule/history/${employee._id}`}>
                        <button className="hisobotkorish">
                          Ko`rish{" "}
                          <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </button>
                      </Link>
                    </td>
                    <td className="d-flex justify-content-center align-items-center">
                        <DownloadObject employee={employee} />
                        <button title="Lavozim yo`riqnomasi"><i class="fa-solid fa-person-chalkboard"></i></button>
                        <button title="Hisobotlarini yuklab olish"><i class="fa-solid fa-file-pen"></i></button>
                    </td>
                    <td>{employee.phone}</td>
                    <td>{employee.role}</td>
                    <td title={employee.complex}>
                      {employee.complex?.length > 20
                        ? employee.complex.slice(0, 20) + "..."
                        : employee.complex}
                    </td>
                    <td title={employee.department}>
                      {employee.department?.length > 20
                        ? employee.department.slice(0, 20) + "..."
                        : employee.department}
                    </td>
                    <td title={employee.section}>
                      {employee.section?.length > 20
                        ? employee.section.slice(0, 20) + "..."
                        : employee.section}
                    </td>
                    <td title={employee.degree}>
                      {employee.degree?.length > 20
                        ? employee.degree.slice(0, 20) + "..."
                        : employee.degree}
                    </td>
                    <td>{employee.nationality}</td>
                    <td>{employee.dateOfBirth}</td>
                    <td title={employee.placeOfBirth}>
                      {employee.placeOfBirth?.length > 20
                        ? employee.placeOfBirth.slice(0, 20) + "..."
                        : employee.placeOfBirth}
                    </td>
                    <td title={employee.address}>
                      {employee.address?.length > 20
                        ? employee.address.slice(0, 20) + "..."
                        : employee.address}
                    </td>
                    <td title={employee.education}>
                      {employee.education?.length > 20
                        ? employee.education.slice(0, 20) + "..."
                        : employee.education}
                    </td>
                    <td title={employee.speciality}>
                      {employee.speciality?.length > 20
                        ? employee.speciality.slice(0, 20) + "..."
                        : employee.speciality}
                    </td>
                    <td>{employee.firstAct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Xodimlar;
