import React, { useState } from 'react';
import { Modal, Button, Form, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaComment } from 'react-icons/fa';
import {API} from '../config';
function XatolikXabar() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

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
          <Modal.Title>Xatolik haqida xabar berish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <a className='pointer' href="mailto:tashmetroweb@mail.ru">
              <Form.Label>tashmetroweb@mail.ru</Form.Label>
              </a>
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
          background-color: rgba(255, 0, 0, 0.7);
        }
      `}</style>
    </>
  );
}

export default XatolikXabar;