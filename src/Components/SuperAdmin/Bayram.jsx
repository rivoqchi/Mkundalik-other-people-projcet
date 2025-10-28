import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config";
import { Modal, Button, Form } from "react-bootstrap";

function Bayram() {
  const [holidays, setHolidays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [holiday, setHoliday] = useState(null);
  const [sabab, setSabab] = useState("");

  const getHolidays = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/holiday/get`);
      if (data.message === "Found") {
        setHolidays(data.holidays);
      } else {
        setHolidays([]);
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  const sendBS = async () => {
    if (!sabab || !holiday) {
      alert("Iltimos, barcha maydonlarni to‘ldiring.");
      return;
    }
    try {
      await axios.post(`${API}/auth/holiday/create`, {
        holiday,
        sabab,
      });
      alert("Ma’lumot muvaffaqiyatli yuborildi!");
      setShowModal(false);
      setSabab("");
      setHoliday(null);
      getHolidays();
    } catch (error) {
      alert("Xatolik yuz berdi");
      console.error(error);
    }
  };

  useEffect(() => {
    getHolidays();
    const interval = setInterval(getHolidays, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bayram-container">
      <div className="bayram-header">
        <h2>Bayram kunlari</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          ＋
        </button>
      </div>

      <div className="bayram-list">
        {holidays.length > 0 ? (
          holidays.map((item) => (
            <div className="bayram-item" key={item._id}>
              <span className="bayram-date">📅 {item.holiday}</span>
              <span className="bayram-sabab">📝 {item.sabab}</span>
            </div>
          ))
        ) : (
          <p className="no-holidays">Hozircha bayram kunlari mavjud emas</p>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Yangi bayram qo‘shish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Bayram kuni</Form.Label>
              <Form.Control
                type="date"
                value={holiday || ""}
                onChange={(e) => setHoliday(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sabab</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sababni kiriting"
                value={sabab}
                onChange={(e) => setSabab(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Bekor qilish
          </Button>
          <Button variant="primary" onClick={sendBS}>
            Yuborish
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Bayram;
