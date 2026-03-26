import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useTheme } from "../Additional/ThemeContext";

function Bayram() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [holidays, setHolidays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [holiday, setHoliday] = useState("");
  const [sabab, setSabab] = useState("");
  const [loading, setLoading] = useState(false);

  const getHolidays = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/holiday/get`, { withCredentials: true });
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

    setLoading(true);
    try {
      await axios.post(`${API}/auth/holiday/create`, {
        holiday,
        sabab,
      }, { withCredentials: true });
      setShowModal(false);
      setSabab("");
      setHoliday("");
      getHolidays();
    } catch (error) {
      alert(error.response?.data?.error || "Xatolik yuz berdi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHoliday = async (id) => {
    if (window.confirm("Rostdan ham bu bayramni o'chirishni xohlaysizmi?")) {
      try {
        await axios.delete(`${API}/auth/holiday/delete/${id}`, { withCredentials: true });
        getHolidays();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || err.response?.data?.message || err.message || "O'chirishda xatolik yuz berdi");
      }
    }
  };

  useEffect(() => {
    getHolidays();
  }, []);

  return (
    <div className={`p-4 ${isDark ? "bg-slate-900" : "bg-light"}`} style={{ minHeight: "100vh", transition: "all 0.3s ease" }}>
      <div className="glass-card p-4 mx-auto" style={{ maxWidth: "800px", background: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.9)", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <h3 className={`m-0 fw-bold ${isDark ? "text-white" : "text-dark"}`}>
            <i className="fa-solid fa-gift text-primary me-2"></i> Bayram kunlari
          </h3>
          <Button variant="primary" className="rounded-pill px-4" onClick={() => setShowModal(true)}>
            <i className="fa-solid fa-plus me-1"></i> Qo'shish
          </Button>
        </div>

        <div className="d-flex flex-column gap-3">
          {holidays.length > 0 ? (
            holidays.map((item) => (
              <div
                key={item._id}
                className={`p-3 d-flex justify-content-between align-items-center rounded-3 ${isDark ? "bg-dark shadow-sm" : "bg-white shadow-sm"}`}
                style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, transition: "transform 0.2s" }}
              >
                <div className="d-flex flex-column">
                  <span className={`fw-bold mb-1 fs-5 ${isDark ? 'text-light' : 'text-dark'}`}>
                    <i className="fa-regular fa-calendar-check text-success me-2"></i>
                    {item.holiday}
                  </span>
                  <span className={`small ${isDark ? 'text-white-50' : 'text-muted'}`}>
                    <i className="fa-solid fa-note-sticky text-warning me-2"></i>
                    {item.sabab}
                  </span>
                </div>
                <Button variant="outline-danger" className="rounded-circle px-2 py-1" title="O'chirish" onClick={() => deleteHoliday(item._id)}>
                  <i className="fa-solid fa-trash"></i>
                </Button>
              </div>
            ))
          ) : (
            <div className={`text-center py-5 ${isDark ? 'text-white-50' : 'text-muted'}`}>
              <i className="fa-solid fa-calendar-xmark mb-3 text-secondary opacity-50" style={{ fontSize: "3rem" }}></i>
              <h5>Hozircha bayram kunlari kiritilmagan</h5>
            </div>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={isDark ? "bg-dark text-white border-secondary" : "bg-white text-dark border-bottom"}>
          <Modal.Title><i className="fa-solid fa-calendar-plus text-primary me-2"></i> Yangi bayram qo‘shish</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-white" : "bg-white text-dark"}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className={`fw-bold ${isDark ? "text-light" : "text-dark"}`}>Belgilangan Sana</Form.Label>
              <div className="premium-input-wrapper">
                <i className="fa-regular fa-calendar input-icon text-primary"></i>
                <Form.Control
                  type="date"
                  className="premium-input-field ps-5"
                  value={holiday}
                  onChange={(e) => setHoliday(e.target.value)}
                  style={{ background: 'transparent' }}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className={`fw-bold ${isDark ? "text-light" : "text-dark"}`}>Sabab (Bayram Nomi)</Form.Label>
              <div className="premium-input-wrapper">
                <i className="fa-solid fa-typewriter input-icon text-primary"></i>
                <Form.Control
                  type="text"
                  className="premium-input-field ps-5"
                  placeholder="Masalan: Mustaqillik kuni"
                  value={sabab}
                  onChange={(e) => setSabab(e.target.value)}
                  style={{ background: 'transparent' }}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={isDark ? "bg-dark text-white border-secondary" : "bg-white text-dark border-top"}>
          <Button variant={isDark ? "outline-light" : "secondary"} onClick={() => setShowModal(false)}>
            Bekor qilish
          </Button>
          <Button variant="primary" onClick={sendBS} disabled={loading}>
            {loading ? <Spinner size="sm" /> : <><i className="fa-solid fa-check"></i> Saqlash</>}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Bayram;
