import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import { API } from "../../config";
import Alert from "../Additional/Alert";
import axios from "axios";

function Sections() {
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
    <>
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      <div className="justify-content-between d-flex m-5">
        <h1>Barcha bo‘limlar</h1>
        <h3>Jami: {allSections.length} ta bo‘lim mavjud</h3>
        <Link to="/admin/sections/add">
          <button className="defaultbtn">+ Yangi bo`lim</button>
        </Link>
      </div>
      <div className="m-5">
        {allSections.map((section) => (
          <Card key={section._id} className="mb-3 sectionscard">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div className="d-flex">
                <i className="fa-regular flagg fa-font-awesome"></i>
                <h5 className="mb-0 mx-5">{section.name}</h5>
              </div>
              <span>{section.acceptedBy}</span>
            </Card.Body>
            <div className="operations justify-content-between d-flex text-end m-3">
              <div className="infosssss">
                <span className="tabolimboshligi" onClick={() => handleShowAdmins(section)}>
                  {section.admins.length} ta bo‘lim boshlig‘i
                </span>
                <span className="tabolimboshligi xodimmm" onClick={() => handleShowUsers(section)}>
                  Xodimlar
                </span>
              </div>
              <div>
                <Link to={`/admin/sections/edit/${section._id}`}><i className="fa-solid fa-pen-to-square sectionicon sectionedit"></i></Link>
                <i
                  className="fa-solid fa-trash sectionicon sectiondelete"
                  onClick={() => handleShow(section)}
                ></i>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Modal */}
      {selectedSection && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>O‘chirish</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Rostdan ham <strong>{selectedSection.name}</strong> bo‘limini o‘chirmoqchimisiz?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Yopish
            </Button>
            <Button variant="danger" onClick={handleDeleteSection}>
              O‘chirish
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Users Modal */}
      {showUsers && (
  <Modal show={showUsers} onHide={handleCloseUsers}>
    <Modal.Header closeButton>
      <Modal.Title>
        {selectedSection.name} xodimlari: {users.length} ta
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {users.map((user) => (
          <Link className="text-decoration-none" to={`/admin/base/user/${user._id}`}>
        <div key={user._id} className="mb-3 modalichidauser">
          <i className="fa-regular fa-user"></i>
          <span>{user.name}</span>
        </div>
          </Link>
      ))}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseUsers}>
        Yopish
      </Button>
    </Modal.Footer>
  </Modal>
)}

      {/* Admins Modal */}
      {showAdmins && selectedSection && (
        <Modal show={showAdmins} onHide={handleCloseAdmins}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedSection.name} bo‘limi boshliqlari</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedSection.admins.map((admin) => (
              <Link className="text-decoration-none" to={`/admin/base/user/${admin.ObjectID}`}>
                {console.log(admin)}
              <div key={admin._id} className="mb-3 modalichidauser">
                  <i className="fa-regular fa-user"></i>
                <span>{admin.name}</span>
              </div>
                </Link>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAdmins}>
              Yopish
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Sections;