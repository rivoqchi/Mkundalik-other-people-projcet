import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { API } from '../../config';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Xodimlar() {
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
    
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
        saveAs(data, "Xodimlar.xlsx");
    };

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
    const handleFilter = (filterType, value) => {
        if (filterType === "role") {
            getAllEmployees(value);
        } else if (filterType === "complex") {
            const filtered = allEmployees.filter(emp => emp.complex === value);
            setFilteredEmployees(filtered);
        }
        setShowModal(false);
    };

    return (
        <div>
            <div className="text-center d-flex justify-content-between xodimlarbuttons">
            <Button variant="success" className="mt-3" onClick={exportToExcel}>
                Excel formatida yuklab olish
            </Button>

                <Button variant="primary" className="mt-3" onClick={() => setShowModal(true)}>
                    Filter
                </Button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xodimlarni filtrlash</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Role bo‘yicha filtr</h5>
                    <Button variant="primary" onClick={() => handleFilter("role", "admin")}>
                        Adminlar
                    </Button>
                    <Button variant="secondary" className="mx-2" onClick={() => handleFilter("role", "employee")}>
                        Userlar
                    </Button>
                    <Button variant="success" onClick={() => handleFilter("role", "")}>
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
                                    <td>{employee.name}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.complex}</td>
                                    <td>{employee.department}</td>
                                    <td>{employee.section}</td>
                                    <td>{employee.role}</td>
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

export default Xodimlar;