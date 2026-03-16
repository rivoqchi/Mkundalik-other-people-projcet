import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import { API } from "../../config";
import Alert from "../Additional/Alert";
import axios from "axios";
import { useTheme } from "../Additional/ThemeContext";

function Sections() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [allSections, setAllSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [users, setUsers] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = (section) => {
    setSelectedSection(section);
    setShow(true);
  };

  const handleClose2 = () => setShow2(false);
  const handleCloseUsers = () => setShowUsers(false);
  const handleCloseAdmins = () => setShowAdmins(false);

  const handleShowUsers = async (section) => {
    try {
      const { data } = await axios.get(`${API}/auth/getusersbysection/${section.name}`);
      setUsers(data.users);
      setSelectedSection(section);
      setShowUsers(true);
    } catch (error) {
      console.error("Error fetching users:", error);
      setAlert({
        show: true,
        type: "danger",
        message: "Xodimlarni yuklashda xatolik yuz berdi!",
      });
    }
  };

  const handleShowAdmins = (section) => {
    setSelectedSection(section);
    setShowAdmins(true);
  };

  // Barcha bo‘limlarni olish
  const getAllSections = async () => {
    try {
      const { data } = await axios.get(`${API}/sections/getall`);
      setAllSections(data.sections);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  // Bo‘limni o‘chirish
  const handleDeleteSection = async () => {
    try {
      await axios.delete(`${API}/sections/deletesectionbyid/${selectedSection._id}`);
      setAlert({
        show: true,
        type: "success",
        message: `${selectedSection.name} muvaffaqiyatli o‘chirildi!`,
      });
      setAllSections(allSections.filter((s) => s._id !== selectedSection._id));
      handleClose();
    } catch (error) {
      console.error("Error deleting section:", error);
      setAlert({
        show: true,
        type: "danger",
        message: "Xatolik yuz berdi, qayta urinib ko‘ring!",
      });
    }
  };

  useEffect(() => {
    getAllSections();
  }, []);

  return (
    <div className={`p-4 ${isDark ? "bg-slate-900" : "bg-light"}`} style={{ minHeight: "100vh", transition: "all 0.3s ease" }}>
      {alert.show && <Alert type={alert.type} message={alert.message} />}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 mt-3 px-3">
        <div>
          <h2 className={`fw-bold ${isDark ? "text-white" : "text-dark"}`}>Barcha bo‘limlar</h2>
          <p className={`mb-0 ${isDark ? "text-white-50" : "text-muted"}`}>Jami: {allSections.length} ta bo‘lim mavjud</p>
        </div>
        <Link to="/superadmin/sections/add" className="text-decoration-none mt-3 mt-md-0">
          <Button variant="primary" className="rounded-pill px-4 shadow-sm fw-bold">
            <i className="fa-solid fa-plus me-2"></i> Yangi bo'lim
          </Button>
        </Link>
      </div>

      <div className="px-3">
        <div className="row">
          {allSections.map((section) => (
            <div className="col-12 col-md-6 mb-4" key={section._id}>
              <div
                className={`glass-card h-100 overflow-hidden rounded-4 ${isDark ? 'border-secondary border-opacity-25' : 'border-0 shadow-sm'}`}
                style={{ transition: "transform 0.2s" }}
              >
                <div className={`p-4 d-flex justify-content-between align-items-center border-bottom ${isDark ? 'border-light border-opacity-10' : 'border-dark border-opacity-10'}`}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <i className="fa-regular fa-folder-open text-primary fs-4"></i>
                    </div>
                    <h5 className={`mb-0 fw-bold ${isDark ? 'text-light' : 'text-dark'}`}>{section.name}</h5>
                  </div>
                  <div className="d-flex gap-2">
                    <Link to={`/superadmin/sections/edit/${section._id}`} className="btn btn-outline-primary btn-sm rounded-circle" title="Tahrirlash">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    <button className="btn btn-outline-danger btn-sm rounded-circle" onClick={() => handleShow(section)} title="O'chirish">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div className={`p-3 d-flex flex-wrap gap-2 justify-content-around ${isDark ? 'bg-dark bg-opacity-25' : 'bg-light bg-opacity-50'}`}>
                  <button
                    className={`btn btn-sm ${isDark ? 'btn-outline-light' : 'btn-outline-dark'} rounded-pill px-3 py-1`}
                    onClick={() => handleShowAdmins(section)}
                  >
                    <i className="fa-solid fa-user-tie text-warning me-2"></i>
                    {section.admins.length} Boshliq
                  </button>
                  <button
                    className={`btn btn-sm ${isDark ? 'btn-outline-light' : 'btn-outline-dark'} rounded-pill px-3 py-1`}
                    onClick={() => handleShowUsers(section)}
                  >
                    <i className="fa-solid fa-users text-info me-2"></i>
                    Bo'lim Xodimlari
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      {selectedSection && (
        <Modal show={show} onHide={handleClose} centered className={isDark ? "dark-modal" : ""}>
          <div className={isDark ? "bg-dark text-light rounded" : ""}>
            <Modal.Header closeButton className={isDark ? "border-secondary" : ""}>
              <Modal.Title><i className="fa-solid fa-triangle-exclamation text-danger me-2"></i>O‘chirish</Modal.Title>
            </Modal.Header>
            <Modal.Body className={isDark ? "bg-dark" : ""}>
              Rostdan ham <strong>{selectedSection.name}</strong> bo‘limini o‘chirmoqchimisiz?
            </Modal.Body>
            <Modal.Footer className={isDark ? "border-secondary" : ""}>
              <Button variant={isDark ? "outline-light" : "secondary"} onClick={handleClose}>
                Bekor qilish
              </Button>
              <Button variant="danger" onClick={handleDeleteSection}>
                O‘chirish
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      )}

      {/* Users Modal */}
      {showUsers && (
        <Modal show={showUsers} onHide={handleCloseUsers} centered className={isDark ? "dark-modal" : ""}>
          <div className={isDark ? "bg-dark text-light rounded" : ""}>
            <Modal.Header closeButton className={isDark ? "border-secondary" : ""}>
              <Modal.Title className="fs-5">
                {selectedSection.name} xodimlari: <span className="text-info">{users.length}</span> ta
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className={isDark ? "bg-dark p-2" : "p-2"}>
              <div className="list-group list-group-flush" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {users.map((user) => (
                  <Link
                    key={user._id}
                    to={`/admin/base/user/${user._id}`}
                    className={`list-group-item list-group-item-action border-0 mb-1 rounded d-flex align-items-center gap-3 ${isDark ? 'bg-secondary bg-opacity-25 text-light hover-bg-secondary' : ''}`}
                  >
                    <div className="rounded-circle bg-info bg-opacity-10 p-2 d-flex align-items-center justify-content-center">
                      <i className="fa-solid fa-user text-info"></i>
                    </div>
                    <span className="fw-medium">{user.name}</span>
                  </Link>
                ))}
                {users.length === 0 && (
                  <div className="text-center p-4 text-muted">Hozircha xodimlar yo'q</div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer className={isDark ? "border-secondary" : ""}>
              <Button variant={isDark ? "outline-light" : "secondary"} onClick={handleCloseUsers}>Yopish</Button>
            </Modal.Footer>
          </div>
        </Modal>
      )}

      {/* Admins Modal */}
      {showAdmins && selectedSection && (
        <Modal show={showAdmins} onHide={handleCloseAdmins} centered className={isDark ? "dark-modal" : ""}>
          <div className={isDark ? "bg-dark text-light rounded" : ""}>
            <Modal.Header closeButton className={isDark ? "border-secondary" : ""}>
              <Modal.Title className="fs-5">{selectedSection.name} bo‘limi boshliqlari</Modal.Title>
            </Modal.Header>
            <Modal.Body className={isDark ? "bg-dark p-2" : "p-2"}>
              <div className="list-group list-group-flush" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {selectedSection.admins.map((admin) => (
                  <Link
                    key={admin._id}
                    to={`/admin/base/user/${admin.ObjectID}`}
                    className={`list-group-item list-group-item-action border-0 mb-1 rounded d-flex align-items-center gap-3 ${isDark ? 'bg-warning bg-opacity-10 text-light hover-bg-secondary' : ''}`}
                  >
                    <div className="rounded-circle bg-warning bg-opacity-25 p-2 d-flex align-items-center justify-content-center">
                      <i className="fa-solid fa-user-tie text-warning"></i>
                    </div>
                    <span className="fw-medium">{admin.name}</span>
                  </Link>
                ))}
                {selectedSection.admins.length === 0 && (
                  <div className="text-center p-4 text-muted">Bo'lim boshlig'i biriktirilmagan</div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer className={isDark ? "border-secondary" : ""}>
              <Button variant={isDark ? "outline-light" : "secondary"} onClick={handleCloseAdmins}>Yopish</Button>
            </Modal.Footer>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Sections;