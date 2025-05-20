import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";
import { API } from "../../config";
import loadinggif from "../Images/loading.gif";
function Xodimlar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
  const [allComplexes, setAllComplexes] = useState([]);
  const [allNormatives, setAllNormatives] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [limitedNorm, setLimitedNorm] = useState(null);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedNorm, setSelectedNorm] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [ball, setBall] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setSelectedEmployee(null);
    setInputValue("");
    setBall(null);
    setSelectedNorm(null);
    setShow(false);
    setLimitedNorm(false);
  };
  const handleShow = async (employee) => {
    setShow(true);
    setLoading2(true);
    try {
      const { data } = await axios.get(`${API}/auth/getuser/${employee?._id}`);
      setSelectedEmployee(data.user);
      setLoading2(false);

      // Agar sport.length >= 2 bo‘lsa, setLimitedNorm(true), aks holda false
      setLimitedNorm(data.user.lang && data.user.lang.length >= 2);
    } catch (err) {
      setError("Xodimlarni yuklashda xatolik yuz berdi.");
      setLoading2(false);
    }
  };
  const handleSelectChange = (e) => {
    const norm = allNormatives.find((n) => n._id === e.target.value);
    setSelectedNorm(norm);
  };

  const handleInputChange = (e) => {
    setInputValue(Number(e.target.value));
  };

  const handleSave = async () => {
    if (!selectedNorm || !inputValue) {
      alert("Barcha maydonlarni to‘ldirish talab qilinadi!");
      return;
    }

    if (inputValue > selectedNorm.limit) {
      alert(
        `Kiritilgan qiymat normativ limitidan oshib ketdi! Limit: ${selectedNorm.limit}`
      );
      return;
    }

    let calculatedBall = null;
    if (inputValue >= selectedNorm.for5) calculatedBall = 5;
    else if (inputValue >= selectedNorm.for4) calculatedBall = 4;
    else if (inputValue >= selectedNorm.for3) calculatedBall = 3;
    else if (inputValue >= selectedNorm.for2) calculatedBall = 2;

    if (!calculatedBall) {
      alert("Kiritilgan qiymat baholash mezonlariga to‘g‘ri kelmadi!");
      return;
    }

    setBall(calculatedBall);

    try {
      await axios.put(`${API}/auth/score/lang/${selectedEmployee?._id}`, {
        ball: calculatedBall,
        norm: selectedNorm.name,
        language: selectedNorm.language,
      });
      alert("Baholash muvaffaqiyatli amalga oshirildi!");
      handleClose();
      setSelectedEmployee();
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      alert("Xatolik yuz berdi, qayta urinib ko‘ring.");
    }
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
  const handleDeleteLanguage = async (norm) => {
    try {
      setLoading2(true)
      await axios.delete(`${API}/auth/score/lang/delete/${selectedEmployee._id}`, {
        data: { norm },
      });
      const { data } = await axios.get(`${API}/auth/getuser/${selectedEmployee._id}`);
      setLimitedNorm(data.user.lang && data.user.lang.length >= 2);
      setSelectedEmployee(data.user); // Yangilash
      setLoading2(false)
    } catch (error) {
      console.error("Xatolik yuz berdi!", error);
    }
  };
  const getAllNormatives = async (req, res) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API}/lang/getall`);
      setAllNormatives(data.tests);
    } catch (err) {
      setError("Xodimlarni yuklashda xatolik yuz berdi.");
    } finally {
    }
  };

  // Sahifa yuklanganda API chaqiriladi
  useEffect(() => {
    getAllEmployees();
    getAllComplexes();
    getAllNormatives();
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
            Reset <i className="fa-solid fa-rotate-right"></i>
          </Button>
          <Button
            variant="primary"
            className="mt-3 mx-1"
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
          {loading2 ? (
            <div className="text-center">
              <img
                src={loadinggif}
                className="loadinggiff"
                alt="Yuklanmoqda..."
              />
            </div>
          ) : selectedEmployee ? (
            <>
              <p>
                <strong>{selectedEmployee.degree}</strong>
              </p>
              <p>
                <strong>Telefon:</strong> {selectedEmployee.phone}
              </p>
              <p>
                <strong>Tashkiliy tuzilma:</strong>{" "}
                {selectedEmployee.department}
              </p>
              <hr />
              {selectedEmployee.lang && selectedEmployee.lang.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#333", color: "white" }}>
                      <th style={thStyle}>#</th>
                      <th style={thStyle}>Norm</th>
                      <th style={thStyle}>Ball</th>
                      <th style={thStyle}>O'chirish</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEmployee.lang.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#f2f2f2" : "white",
                        }}
                      >
                        <td style={tdStyle}>{index + 1}</td>
                        <td style={tdStyle}>{item.norm}</td>
                        <td style={tdStyle}>{item.ball}</td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => handleDeleteLanguage(item.norm)}
                            style={{
                              background: "red",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              padding: "5px",
                              cursor: "pointer",
                            }}
                          >
                            <div className="dele">
                              O`chirish{" "}
                              <i className="fa-solid fa-trash dele"></i>
                            </div>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Normativ topshirmagan</p>
              )}
            </>
          ) : (
            "Ma'lumot topilmadi"
          )}
        </Modal.Body>
        <Modal.Body>
          <div className="text-center">
            {/* Agar limitedNorm true bo‘lsa, disable qilamiz */}
            <select
              name="normatives"
              id="normatives"
              onChange={handleSelectChange}
              disabled={limitedNorm}
            >
              <option disabled selected value="">
                Normativ tanlang:
              </option>
              {allNormatives.map((norm) => (
                <option key={norm._id} value={norm._id}>
                  {norm.name}
                </option>
              ))}
            </select>

            <div>
              <br />
              <input
                type="number"
                placeholder="Qiymat kiriting"
                value={inputValue}
                onChange={handleInputChange}
                disabled={limitedNorm} // Agar limitedNorm true bo‘lsa, input ham disabled bo‘ladi
              />
            </div>

            {/* Faqat limitedNorm true bo‘lsa, p elementi chiqadi */}
            {limitedNorm && (
              <p style={{ color: "red", marginTop: "10px" }}>
                Yangi normativ kiritish uchun yuqoridagilardan birini o‘chiring
              </p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Yopish
          </Button>
          <Button variant="success" onClick={handleSave}>
            O‘zgarishlarni saqlash
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const thStyle = {
  padding: "10px",
  border: "1px solid black",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid black",
};

export default Xodimlar;
