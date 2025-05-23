import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { API } from '../../config';
import { useTranslation } from "react-i18next";

function Xodimlar() {
    const { t } = useTranslation();
    const [allEmployees, setAllEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const getAllEmployees = async (role = "") => {
        try {
            const { data } = await axios.get(`${API}/auth/getallemployeeswithfilter`, {
                params: { role },
            });
            setAllEmployees(data.employees);
            setFilteredEmployees(data.employees);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    useEffect(() => {
        getAllEmployees();
    }, []);

    const handleFilter = (role) => {
        getAllEmployees(role);
        setShowModal(false);
    };

    return (
        <div>
            <div className="text-center xodimlarbuttons">
                <Button variant="primary" className="mt-3" onClick={() => setShowModal(true)}>
                {t("filter")}
                </Button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("xodimfilter")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="primary" onClick={() => handleFilter("admin")}>
                    {t("admins")}
                    </Button>
                    <Button variant="secondary" className="mx-2" onClick={() => handleFilter("employee")}>
                    {t("users")}
                    </Button>
                    <Button variant="success" onClick={() => handleFilter("")}>
                    {t("all")}
                    </Button>
                </Modal.Body>
            </Modal>

            <div className="table-responsive">
                <table className="table table-striped mt-3">
                    <thead>
                        <tr>
                            <th>N</th>
                            <th>F.I.Sh</th>
                            <th>Telefon</th>
                            <th>Bo'lim</th>
                            <th>Lavozim</th>
                            <th>Millati</th>
                            <th>Tug`ilgan kuni</th>
                            <th>Tug`ilgan joyi</th>
                            <th>Yashash manzili</th>
                            <th>Ma'lumoti</th>
                            <th>Mutaxassisligi</th>
                            <th>Tizimga qo`shildi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee, index) => (
                            <tr key={employee._id}>
                                <td>{index + 1}</td>
                                <td>{employee.name}</td>
                                <td>{employee.phone}</td>
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
            </div>
        </div>
    );
}

export default Xodimlar;