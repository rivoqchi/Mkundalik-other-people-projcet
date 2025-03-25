import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";
import { API } from "../../config";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
function Xodimlar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
  const [allComplexes, setAllComplexes] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setSelectedEmployee(null);
    setShow(false);
  };  const handleShow = (employee) => {
    setSelectedEmployee(employee);
    setShow(true);
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
    <>
      <div>
        <div className="text-center d-flex xodimlarbuttons">
          <Form.Control
            type="text"
            className="mt-3"
            placeholder="Qidirish"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="secondary"
            className="mt-3 mx-2"
            onClick={() => setSearchTerm("")}
          >
            Reset <i class="fa-solid fa-rotate-right"></i>
          </Button>
          <Button
            variant="primary"
            className="mt-3 mx-1"
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
          <div className="allusers">
            {!loading && !error && (
              <table className="table table-striped mt-3">
                <thead>
                  <tr>
                    <th>N</th>
                    <th>F.I.Sh</th>
                    <th>Telefon</th>
                    <th>
                      <i className="fa-solid fa-user-pen"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee, index) => (
                    <tr key={employee._id}>
                      <td>{index + 1}</td>
                      <td>{employee.name}</td>
                      <td>{employee.phone}</td>
                      <td>
                        <i
                          className="fa-solid fa-pen sporteditbtn"
                          onClick={() => handleShow(employee)}
                          style={{ cursor: "pointer" }}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEmployee ? selectedEmployee.name : "Ma'lumot"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee ? (
            <>
            <p>
              <strong>{selectedEmployee.degree}</strong>
            </p>
              <p>
                <strong>Telefon:</strong> {selectedEmployee.phone}
              </p>
              <p>
                <strong>Tashkiliy tuzilma:</strong> {`${selectedEmployee.complex}`}
              </p>
            </>
          ) : (
            "Ma'lumot topilmadi"
          )}
        </Modal.Body>
        <Modal.Body>
          <input type="number" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Yopish
          </Button>
          <Button variant="success" onClick={handleClose}>
            O'zgarishlarni saqlash
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Xodimlar;