import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { API } from "../../config";
import lavozimyoriqnomasi from "../Images/Temp/lavozimyoriqnomasi.png";
function PleaseInstruction() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [myRole, setMyRole] = useState([]);
  const myId = window.localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInstructionStatus = async () => {
      try {
        const filesResponse = await axios.get(`${API}/cloud/getdocs/${myId}`);
        if (filesResponse.data.length === 0) {
          setShow(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getMyInstructionStatus();
  }, []);
  const goTo = async () => {
    const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
    if (data.user.role === "employee") {
      setShow(false);
      navigate(`/user/profile`);
    } else if (data.user.role === "admin") {
      setShow(false);
      navigate(`/admin/profile`);
    } else if (data.user.role === "superadmin") {
      setShow(false);
      navigate(`/superadmin/profile`);
    } else if (data.user.role === "complex") {
      setShow(false);
      navigate(`/complex/profile`);
    } else if (data.user.role === "sport") {
      setShow(false);
      navigate(`/sport/profile`);
    } else if (data.user.role === "at") {
      setShow(false);
      navigate(`/at/profile`);
    } else if (data.user.role === "department") {
      setShow(false);
      navigate(`/department/profile`);
    } else if (data.user.role === "boss") {
      setShow(false);
      navigate(`/boss/profile`);
    } else if (data.user.role === "hr") {
      setShow(false);
      navigate(`/hr/profile`);
    } else if (data.user.role === "commission") {
      setShow(false);
      navigate(`/commission/profile`);
    }
  };

  return (
    <>
      <Modal
        size="lg"
        backdrop="static"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i class="fa-solid fa-triangle-exclamation"></i> Lavozim
            yo`riqnomangizni yuklang:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Endilikda o`z lavozim yo`riqnomangizni yuklashingiz mumkin.
          <br />
          <div className="text-center">
            <img
              className="lavozimyoriqnomasiimg"
              src={lavozimyoriqnomasi}
              alt="Lavozim yo`riqnomasi instruksiyasi"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Yopish
          </Button>
          <Button variant="success" onClick={goTo}>
            Yuklash
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PleaseInstruction;
