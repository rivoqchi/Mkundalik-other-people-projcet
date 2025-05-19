import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config";
import { Modal, Button, Table, Form } from "react-bootstrap";
import notfound from "../Images/notfound.png";
import LoadingScreen from "../Additional/LoadingScreen";
function Normativ() {
  const [allNormatives, setAllNormatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [limit, setLimit] = useState("");
  const [for5, setFor5] = useState("");
  const [for4, setFor4] = useState("");
  const [for3, setFor3] = useState("");
  const [for2, setFor2] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [selectedNormativeId, setSelectedNormativeId] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getAllNormatives = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/sport/getall`);
      setAllNormatives(data.normatives || []);
      setLoading(false);
    } catch (err) {
      console.log("Normativlarni yuklashda xatolik yuz berdi.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllNormatives();
  }, []);

  const addNormative = async () => {
    setLoading(true);
    if (!name || !type) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
      setLoading(false);
    }
    try {
      setLoading(true);
      await axios.post(`${API}/sport/add`, {
        name,
        type,
        limit,
        for5,
        for4,
        for3,
        for2,
      });
      setName("");
      setType("");
      setLimit("");
      setFor5("");
      setFor4("");
      setFor3("");
      setFor2("");
      setShowModal(false);
      getAllNormatives();
      setLoading(false);
    } catch (err) {
      console.log("Normativ qo'shishda xatolik yuz berdi.");
      setLoading(false);
    }
  };

  const deleteNormative = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API}/sport/delete/${id}`);
      getAllNormatives();
      setLoading(false);
    } catch (err) {
      console.log("Normativni o'chirishda xatolik yuz berdi.");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (limit) {
      const limitValue = parseInt(limit, 10);
      setFor5(Math.round(limitValue * 0.86)); // 86%
      setFor4(Math.round(limitValue * 0.71)); // 71%
      setFor3(Math.round(limitValue * 0.56)); // 56%
      setFor2(Math.round(limitValue * 0)); // %
    }
  }, [limit]); // limit o'zgarsa, avtomatik hisoblanadi

  return (
    <>
      {loading && <LoadingScreen loading={true} />}

    <div className="normative-container m100">
      <div className="header">
        <h2>Normativlar</h2>
        <Button
          variant="success"
          className="defaultbtn"
          onClick={() => setShowModal(true)}
        >
          +
        </Button>
      </div>

      {/* Normativlar Jadvali */}
      <div className="table-responsive">
        <Table striped bordered hover className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nomi</th>
              <th>Turi</th>
              <th>Limit</th>
              <th>5 Baho</th>
              <th>4 Baho</th>
              <th>3 Baho</th>
              <th>2 Baho</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {allNormatives.length > 0 ? (
              allNormatives.map((norm, index) => (
                <tr key={norm._id}>
                  <td>{index + 1}</td>
                  <td>{norm.name}</td>
                  <td>{norm.type}</td>
                  <td>{norm.limit}</td>
                  <td>{norm.for5 || "-"}</td>
                  <td>{norm.for4 || "-"}</td>
                  <td>{norm.for3 || "-"}</td>
                  <td>{norm.for2 || "-"}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedNormativeId(norm._id); // O'chirish uchun ID saqlash
                        handleShow(); // Modalni ochish
                      }}
                    >
                      O‘chirish
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  <img className="notfoundpng" src={notfound} alt="" />
                  <h5>Hozircha normativlar yo'q</h5>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* React-Bootstrap Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Yangi Normativ Qo'shish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-center">
                <h5>Normativ nomi</h5>
              </Form.Label>

              <Form.Control
                type="text"
                placeholder="3km yugurish [Erkaklar]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-center">
                <h5>Turi</h5>
              </Form.Label>
              <div className="d-flex justify-content-evenly">
                <Form.Check
                  type="radio"
                  label="Vaqt"
                  name="normativeType"
                  value="Vaqt"
                  checked={type === "Vaqt"}
                  onChange={(e) => setType(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="Miqdor"
                  name="normativeType"
                  value="Miqdor"
                  checked={type === "Miqdor"}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="">
                <Form.Label>
                  <h5>Limit</h5>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="20"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                />
              </div>
              <Form.Label className="text-center">
                <h5>Baho uchun minimal qiymatlar</h5>
              </Form.Label>
              <div className="row">
                <div className="col">
                  <Form.Label>5 baho</Form.Label>
                  <Form.Control
                    type="number"
                    value={for5}
                    onChange={(e) => setFor5(e.target.value)}
                  />
                </div>
                <div className="col">
                  <Form.Label>4 baho</Form.Label>
                  <Form.Control
                    type="number"
                    value={for4}
                    onChange={(e) => setFor4(e.target.value)}
                  />
                </div>
                <div className="col">
                  <Form.Label>3 baho</Form.Label>
                  <Form.Control
                    type="number"
                    value={for3}
                    onChange={(e) => setFor3(e.target.value)}
                  />
                </div>
                <div className="col">
                  <Form.Label>2 baho</Form.Label>
                  <Form.Control
                    type="number"
                    value={for2}
                    onChange={(e) => setFor2(e.target.value)}
                  />
                </div>
              </div>
              <div className="text-center">sekund / miqdor</div>
            </Form.Group>
          </Form>
          <div className="warningtext">
            Diqqat! mazkur normativni yaratganingizdan keyin uni o`zgartira
            olmaysiz.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Bekor qilish
          </Button>
          <Button variant="success" onClick={addNormative}>
            Tasdiqlash
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Normativni o‘chirish</Modal.Title>
        </Modal.Header>
        <Modal.Body>Ushbu normativni o‘chirmoqchimisiz?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Yopish
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteNormative(selectedNormativeId); // O‘chirish
              handleClose(); // Modalni yopish
            }}
          >
            O‘chirish
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
}

export default Normativ;
