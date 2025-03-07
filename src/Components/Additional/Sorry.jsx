import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Sorry() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("show")) {
      setShow(true);
      localStorage.setItem("show", "true");
    }
  }, []);

  const handleClose = () => setShow(false);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Xatoliklar tuzatildi.</Modal.Title>
        </Modal.Header>
        <Modal.Body>Ayni paytda serverlar soz holatda ishlamoqda!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Tushundim
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Sorry;