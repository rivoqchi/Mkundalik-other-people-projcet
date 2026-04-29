import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { API } from "../../config";
import Alert from "../Additional/Alert";
import axios from "axios";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function NewSection() {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [sectionName, setSectionName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const acceptedBy = window.localStorage.getItem("fullName");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const getAllData = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/getalladmins`);
      setAllUsers(data.employees);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getDepartments = async () => {
    try {
      const { data } = await axios.get(`${API}/sectors/getall`);
      setAllDepartments(data.sections || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    getAllData();
    getDepartments();
  }, []);

  // Adminlarni tanlash
  const handleAdminSelect = (admin) => {
    const isAlreadySelected = selectedAdmins.some(
      (item) => item.ObjectID === admin._id
    );
    if (!isAlreadySelected) {
      setSelectedAdmins((prev) => [
        ...prev,
        { name: admin.name, ObjectID: admin._id },
      ]);
    }
  };

  // Adminlarni o‘chirish
  const removeAdmin = (id) => {
    setSelectedAdmins((prev) => prev.filter((admin) => admin.ObjectID !== id));
  };

  // Formani yuborish
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDepartment) {
      setAlert({
        show: true,
        type: "danger",
        message: "Iltimos, bo'lim biriktiriladigan xizmat/departamentni tanlang!",
      });
      return;
    }

    const payload = {
      name: sectionName,
      acceptedBy,
      admins: selectedAdmins,
      sector: selectedDepartment,
    };

    try {
      await axios.post(`${API}/sections/new`, payload);
      setAlert({
        show: true,
        type: "success",
        message: "Yangi bo‘lim muvaffaqiyatli yaratildi!",
      });
      setSectionName("");
      setSelectedAdmins([]);
    } catch (error) {
      console.error("Error creating section:", error);
      setAlert({
        show: true,
        type: "danger",
        message: "Xatolik yuz berdi, qayta urinib ko‘ring.",
      });
    }
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} message={alert.message} />}

      <h1 className="m-5">Yangi bo‘lim yaratish</h1>
      <Form className="m-5" onSubmit={handleSubmit}>
        {/* Bo‘lim nomi */}
        <Form.Group className="mb-3">
          <Form.Label>Bo‘lim nomi</Form.Label>
          <Form.Control
            type="text"
            placeholder="Bo‘lim nomini kiriting"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Departament/Xizmatni tanlang</Form.Label>
          <Form.Select 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            required
          >
            <option value="" disabled>Departament tanlang...</option>
            {allDepartments.map((d) => (
              <option key={d._id} value={d.name}>{d.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
  <Form.Label>Adminlar</Form.Label>
  <div className="d-flex flex-wrap">
    {allUsers.map((user) => (
      <OverlayTrigger
        key={user._id}
        placement="top"
        overlay={
          user.law ? (
            <Tooltip id={`tooltip-${user._id}`}>
              Allaqachon <b>{user.section}</b> da tanlangan!
            </Tooltip>
          ) : <></>
        }
      >
        <span className="d-inline-block">
          <Button
            variant="outline-primary"
            className="m-1"
            onClick={() => handleAdminSelect(user)}
            disabled={user.law} // Agar user.law true bo'lsa, button disabled bo'ladi
            style={user.law ? { pointerEvents: "none" } : null} // Tooltip hoverda ishlashi uchun
          >
            {user.name}
          </Button>
        </span>
      </OverlayTrigger>
    ))}
  </div>
</Form.Group>

        {/* Tanlangan adminlar */}
        <Form.Group className="mb-3">
          <Form.Label>Tanlangan adminlar:</Form.Label>
          <div>
            {selectedAdmins.map((admin) => (
              <Button
                key={admin.ObjectID}
                variant="outline-danger"
                className="m-1"
                onClick={() => removeAdmin(admin.ObjectID)}
              >
                {admin.name} &times;
              </Button>
            ))}
          </div>
        </Form.Group>

        <Button variant="success" type="submit">
          Yaratish
        </Button>
      </Form>
    </>
  );
}

export default NewSection;