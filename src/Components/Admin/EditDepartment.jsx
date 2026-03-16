import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {useParams} from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { API } from "../../config";
import Alert from "../Additional/Alert";
import axios from "axios";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function EditStructure() {
  const {id} = useParams()
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [allUsers, setAllUsers] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [updateType, setUpdateType] = useState(null);
  const acceptedBy = window.localStorage.getItem("fullName");


  const getAllData = async () => {
    try {
      const { data } = await axios.get(`${API}/sections/getall`);
      setAllUsers(data.sections);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() =>{
    getAllData()
  }, [])


  const getData = async () =>{
    const {data} = await axios.get(`${API}/sectors/getsectorbyid/${id}`)
    setSectionName(data.section.name)
    
    setSelectedSections(data.section.sections)
  }
  useEffect(() =>{
    getData()
  }, [])



  const handleSectionSelect = (section) => {
    const isAlreadySelected = selectedSections.some(
      (item) => item.ObjectID === section._id
    );
    if (!isAlreadySelected) {
      setSelectedSections((prev) => [
        ...prev,
        { name: section.name, ObjectID: section._id },
      ]);
    }
  };

  // Adminlarni o‘chirish
  const removeSection = (id) => {
    setSelectedSections((prev) => prev.filter((section) => section.ObjectID !== id));
  };

  // Formani yuborish
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!updateType) {
      setAlert({
        show: true,
        type: "danger",
        message: "Iltimos, o'zgartirish turidan birini tanlang!",
      });
      return;
    }

    const payload = {
      name: sectionName,
      acceptedBy,
      sections: selectedSections,
      updateType,
    };

    try {
      
      await axios.put(`${API}/sectors/update/${id}`, payload);
      setAlert({
        show: true,
        type: "success",
        message: "Bo`lim muvaffaqiyatli yangilandi!",
      });
      setSectionName("");
      setSelectedSections([]);
    } catch (error) {
      console.error("Error updating section:", error);
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

      <h1 className="m-5">Bo`limni tahrirlash</h1>
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
  <Form.Label>Bo`limlar</Form.Label>
  <div className="d-flex flex-wrap">
    {allUsers.map((user) => (
      <OverlayTrigger
        key={user._id}
        placement="top"
        overlay={
          user.law ? (
            <Tooltip id={`tooltip-${user._id}`}>
              Allaqachon <b>{user.sector}</b> da tanlangan!
            </Tooltip>
          ) : <></>
        }
      >
        <span className="d-inline-block">
          <Button
            variant="outline-primary"
            className="m-1"
            onClick={() => handleSectionSelect(user)}
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
          <Form.Label>Biriktirilgan bo`limlar:</Form.Label>
          <div>
            {selectedSections.map((section) => (
              <Button
                key={section.ObjectID}
                variant="outline-danger"
                className="m-1"
                onClick={() => removeSection(section.ObjectID)}
              >
                {section.name} &times;
              </Button>
            ))}
          </div>
        </Form.Group>

        {/* Majburiy o'zgartirish turi */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold text-danger">* O'zgartirish turi:</Form.Label>
          <div className="border border-danger border-opacity-50 p-3 rounded bg-danger bg-opacity-10">
            <Form.Check
              type="radio"
              id="update-all"
              name="updateType"
              label="1. Lavozim nomini barcha joydan o'zgartirish (butun tarix ma'lumotlari ham o`zgaradi. complex, employees, va barcha o'tgan jadvallarda)"
              value="1"
              onChange={(e) => setUpdateType(Number(e.target.value))}
              checked={updateType === 1}
              required
              className="mb-3 fw-medium"
            />
            <Form.Check
              type="radio"
              id="update-today"
              name="updateType"
              label="2. Buyruq asosida lavozim nomini bugungi kundan boshlab o'zgartirish (faqat complex va employees'da yangilanadi, jadvallar tarixi eski nom bilan saqlanadi)"
              value="2"
              onChange={(e) => setUpdateType(Number(e.target.value))}
              checked={updateType === 2}
              required
              className="fw-medium"
            />
          </div>
        </Form.Group>

        <Button variant="success" type="submit">
          Yangilash
        </Button>
      </Form>
    </>
  );
}

export default EditStructure;