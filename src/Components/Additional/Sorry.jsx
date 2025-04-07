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
    Тизимнинг баҳолаш қисмига қисман ўзгартишлар киритилганини маълум қиламиз. Унга кўра, раҳбарга лавозим мажбуриятлари доирасидаги ишлар учун - 5 балл, раҳбар томонидан берилган қўшимча вазифалар учун - 7 балл, ҳамда ходим ташаббуси билан бажарилган самарадорликни оширишга қаратилган ишлар учун - 10 баллдан тахминан баҳолар таклиф қилинмоқда. <br />
    Якуний қарорни раҳбар тасдиқлаши ёки ўз хоҳишига кўра балл қўйиши мумкин. <br />
    Ҳисоботни ёзишда ва баҳолашда масъулиятли бўлишингизни сўраймиз. <br />
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