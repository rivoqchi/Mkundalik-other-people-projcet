import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { API } from "../../config";
import axios from "axios";
import Alert from "../Additional/Alert";

function FilterNewUsers() {
  const [allData, setAllData] = useState([]);
  
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleClose = () => {
    setShow(false);
    setSelectedUser(null);
  };

  const handleShow = (user) => {
    setSelectedUser(user);
    setShow(true);
  };

  const getAllData = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/getallusers`);
      setAllData(data.employees);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteThis = async (id) => {
    try {
      await axios.delete(`${API}/auth/deletethisuser/${id}`);
      setAlert({ show: true, type: "success", message: "Muvaffaqiyatli o`chirildi!" });
      getAllData(); // Ma'lumotni yangilash
      handleClose(); // Modalni yopish
    } catch (error) {
      setAlert({ show: true, type: "error", message: "Xatolik!" });
      handleClose(); // Modalni yopish
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <>
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      <div className="tepa d-flex mt-3 mx-5 justify-content-between">
      <h3 className="m-3">Jami: {allData.length}</h3>
      <Link to="/admin/employees/adduser"><button className="defaultbutton">+ Yangi xodim</button></Link>
      </div>
      <div className="container-sm m-5">
        {allData.map((i) => (
          <Card key={i._id} className={`m-3 filtercard ${i.employee === true ? "filtergreen" : "filterred"}`}>
            <Card.Body>
              <Card.Title>{i.name}</Card.Title>
              <Card.Text>{i.phone}</Card.Text>
              <div className="d-flex justify-content-between">
                <div>
                  <Link to={`/admin/employee/confirm/${i._id}`}>
                    <Button variant="primary">{ i.employee===true ? "O`zgartirish" : "Tasdiqlash"}</Button>
                  </Link>
                </div>
                <div>
                  <Button className="mx-3" variant="danger" onClick={() => handleShow(i)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Diqqat!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {selectedUser ? (<><strong>{selectedUser.name}</strong>ni o'chirib yubormoqchimisiz?</>) : ""}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Yopish
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteThis(selectedUser._id)}
          >
            O`chirish
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FilterNewUsers;