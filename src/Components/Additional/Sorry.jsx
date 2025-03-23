import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Sorry() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("tas-ix")) {
      setShow(true);
      localStorage.setItem("tas-ix", "true");
    }
  }, []);

  const handleClose = () => setShow(false);

  return (
    <>
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><b>Ҳурматли фойдаланувчилар!</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <b>22-23 март</b> кунлари серверларимиз Ўзбекистон Республикаси <b>TAS-IX</b> тармоғига уланиш жараёни <span className="greenword">МУВАФФАҚИЯТЛИ ЯКУНЛАНДИ</span>! <br />

        Шу муносабат билан сайтимизда техник профилактика ишлари олиб борилди.
        <br /><br />
        Эндиликда серверлар аввалгидан тезроқ ва барқарор ишлайди. Янги имкониятлардан фойдаланиб, янада қулай хизматдан баҳраманд бўлишингиз мумкин!
        <br /><br />
        <b>Тушунганингиз учун раҳмат!</b>
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