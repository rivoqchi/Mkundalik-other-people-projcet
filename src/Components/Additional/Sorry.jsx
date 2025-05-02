import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Sorry() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("updatev1")) {
      setShow(true);
      localStorage.setItem("updatev1", "true");
    }
  }, []);

  const handleClose = () => setShow(false);

  return (
    <>
      <Modal size="lg" centered show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title><b>Ҳурматли фойдаланувчилар!</b></Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <b>Ҳурматли фойдаланувчилар!</b><br />
    Tizimda bir qator o'zgarishlar amalga oshirildi. <br />
    <b>Jumladan, rangli kalendar menyu, dizayndagi yangilanishlar h.</b><br />
    Bunday hollarda biz bilan bog'lanishingizni so'raymiz. <br />
    <b>mkundalik.uz</b>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="success" onClick={handleClose}>
      Тушундим
    </Button>
  </Modal.Footer>
</Modal>
    </>
  );
}

export default Sorry;