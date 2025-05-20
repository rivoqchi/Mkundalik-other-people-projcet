import React, { useState } from 'react';
import { Modal, Button, Form, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaComment } from 'react-icons/fa';
import {API} from '../config';
import { useTranslation } from "react-i18next";

function XatolikXabar() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-top">Xatolik haqida xabar berish</Tooltip>}
      >
        <div className="xatolikicon" onClick={handleShow}>
          <FaComment />
        </div>
      </OverlayTrigger>
      
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("xatolikxabar")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              
              <Form.Label><a className='pointer' href="mailto:mkundalik@tashmetro.uz">mkundalik@tashmetro.uz</a></Form.Label>
              <br />
              <Form.Label><i className="fa-solid fa-phone-volume"></i> 53-89</Form.Label>
              
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .xatolikicon {
          position: fixed;
          bottom: 20px;
          right: 20px;
          font-size: 1.5rem;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .xatolikicon:hover {
          background-color: red;
        }
      `}</style>
    </>
  );
}

export default XatolikXabar;