import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { API } from '../../config';
import {Link} from 'react-router-dom'
function Tuzilma() {
    const [allEmployees, setAllEmployees] = useState([]);
    const [allComplexes, setAllComplexes] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [myType, setMyType] = useState(null); // Foydalanuvchi ma'lumoti
    const myId = window.localStorage.getItem("user_id");
  
    const getMyData = async () => {
      try {
        const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
        setMyType(data.user.forNG);        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
      useEffect(() => {
        getMyData();
      }, []);
    // Xodimlarni olish
    const getAllEmployees = async (role = "") => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`${API}/auth/getallemployeeswithfilter`, {
                params: { role },
            });
            setAllEmployees(data.employees);
            setFilteredEmployees(data.employees);
        } catch (err) {
            setError("Xodimlarni yuklashda xatolik yuz berdi.");
        } finally {
            setLoading(false);
        }
    };

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
    const handleFilter = async (filterType, value) => {
      setLoading(true);
      setError(null);
  
      try {
          if (filterType === "role") {
              if (value === "complex") {
                  const { data } = await axios.get(`${API}/auth/getallemployeeswithfilter`, {
                      params: { role: "complex" },
                  });
  
                  const filtered = data.employees.filter(emp => {
                      if (myType === true) {
                          return emp.forNG === true;
                      } else {
                          return emp.forNG === false || emp.forNG === undefined;
                      }
                  });
  
                  setFilteredEmployees(filtered);
              } else {
                  const { data } = await axios.get(`${API}/auth/getallemployeeswithfilter`, {
                      params: { role: value },
                  });
                  setFilteredEmployees(data.employees);
              }
          } else if (filterType === "complex") {
              const filtered = allEmployees.filter(emp => emp.complex === value);
              setFilteredEmployees(filtered);
          }
      } catch (err) {
          setError("Filtrlashda xatolik yuz berdi.");
      } finally {
        setShowModal(false);
        setLoading(false);
      }
  };

    return (
        <div>
            <div className="text-center d-flex justify-content-between xodimlarbuttons">

                <Button variant="primary" className="mt-3" onClick={() => setShowModal(true)}>
                    Filter
                </Button>
            </div>

            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xodimlarni filtrlash</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Rol bo‘yicha filtr</h5>
                    <Button className='m-1' variant="success" onClick={() => handleFilter("role", "complex")}>
                        Metropoliten o`rinbosarlari
                    </Button>
                    <Button className='m-1' variant="success" onClick={() => handleFilter("role", "department")}>
                        Xizmat boshliqlari
                    </Button>
                    <Button className='m-1' variant="success" onClick={() => handleFilter("role", "admin")}>
                        Bo`lim boshliqlari
                    </Button>
                    <Button className='m-1' variant="success" onClick={() => handleFilter("role", "employee")}>
                        Oddiy xodimlar
                    </Button>
                    <Button className='m-1' variant="primary" onClick={() => handleFilter("role", "")}>
                        Hammasi
                    </Button>
                </Modal.Body>

                <Modal.Body>
                    <h5>Kompleks bo‘yicha filtr</h5>
                    {allComplexes.length > 0 ? (
                        allComplexes.map((complex) => (
                            <Button key={complex._id} variant="info" className="m-1" onClick={() => handleFilter("complex", complex.name)}>
                                {complex.name}
                            </Button>
                        ))
                    ) : (
                        <p>Komplekslar yo‘q</p>
                    )}
                </Modal.Body>
            </Modal>

            <div className="table-responsive">
                {loading && <Spinner animation="border" className="d-block mx-auto mt-3" />}
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                
                {!loading && !error && (
                    <table className="table table-striped mt-3">
                        <thead>
                            <tr>
                                <th>N</th>
                                <th>F.I.Sh</th>
                                <th>Telefon</th>
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
                                    <td><Link to={`/boss/schedule/history/${employee._id}`}>{employee.name}</Link></td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.complex}</td>
                                    <td>{employee.department}</td>
                                    <td>{employee.section}</td>
                                    <td>{employee.degree}</td>
                                    <td>{employee.nationality}</td>
                                    <td>{employee.dateOfBirth}</td>
                                    <td>{employee.placeOfBirth}</td>
                                    <td>{employee.address}</td>
                                    <td>{employee.education}</td>
                                    <td>{employee.speciality}</td>
                                    <td>{employee.firstAct}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Tuzilma;