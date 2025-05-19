import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const FeedbackModal = () => {
  const [show, setShow] = useState(false);
  const [currentURL, setCurrentURL] = useState("");
  const [formDetails, setFormDetails] = useState({
    firstName: '',
    phone: '+998',
    message: ''
  });
  const [buttonText, setButtonText] = useState('Yuborish');
  const [status, setStatus] = useState({});
  const [errors, setErrors] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setCurrentURL(window.location.href);
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        handleShow();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formDetails.firstName.trim()) newErrors.firstName = true;
    if (!formDetails.phone.trim() || formDetails.phone === '+998') newErrors.phone = true;
    if (!formDetails.message.trim()) newErrors.message = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setButtonText("Yuborilmoqda...");
    await getData();
  };

  const getData = async () => {
    let apiToken = "8074786762:AAHg-iV6CCsgCumGfURuP1m3WD4xr5AXjeE";
    let chat_id = 7453348856;
    let message = `Xatolik haqida xabar: 
Ismi: ${formDetails.firstName}; 
Telefon: ${formDetails.phone};
Xabar: ${formDetails.message};
Sahifa: ${currentURL}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${apiToken}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(message)}`);
      if (response.status !== 200) {
        throw new Error('Failed to send message');
      }
      setStatus({ success: true, message: 'Xabar yuborildi!' });
      setFormDetails({
        firstName: '',
        phone: '+998',
        message: ''
      });
      handleClose();
    } catch (error) {
      setStatus({ success: false, message: 'Xabar yuborilmadi, qayta urinib ko‘ring.' });
    } finally {
      setButtonText("Yuborish");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Xatolik haqida xabar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Sahifa manzili:</Form.Label>
              <Form.Control type="text" readOnly value={currentURL} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ismingiz:</Form.Label>
              <Form.Control
                type="text"
                value={formDetails.firstName}
                className={errors.firstName ? 'is-invalid' : ''}
                onChange={(e) => onFormUpdate('firstName', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefon:</Form.Label>
              <Form.Control
                type="text"
                value={formDetails.phone}
                className={errors.phone ? 'is-invalid' : ''}
                onChange={(e) => onFormUpdate('phone', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Xatolik tafsiloti:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formDetails.message}
                className={errors.message ? 'is-invalid' : ''}
                onChange={(e) => onFormUpdate('message', e.target.value)}
              />
            </Form.Group>

            <Button variant="secondary" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              {buttonText}
            </Button>
          </Form>
          {status.message && (
            <p className={status.success ? 'text-success mt-2' : 'text-danger mt-2'}>
              {status.message}
            </p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FeedbackModal;