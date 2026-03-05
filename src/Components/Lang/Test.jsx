import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Modal, Button, Table, Form } from "react-bootstrap";
import axios from "axios";
import notfound from "../Images/notfound.png";
import { useLoading } from "../Additional/LoadingScreen";
import Send from "./Send";
import { API } from "../../config";
function TestCreator() {
  const { setLoading } = useLoading();
  const [selectedNormativeId, setSelectedNormativeId] = useState("");
  const [language, setLanguage] = useState("");
  const [allTests, setAllTests] = useState([]);
  const [selected, setSelected] = useState([]);
  const [passed, setPassed] = useState([]);
  const handleShow = () => setShow2(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [selectedTestId, setSelectedTestId] = useState("");

  const handleShow5 = (testId) => {
    setSelectedTestId(testId); // testId ni state ga saqlash
    setShowModal5(true); // Modalni ochish
  };
  const [show5, setShow5] = useState(false);

  const handleClose5 = () => {
    setShowModal5(false); // Modalni yopish
  };
  const [showModal, setShowModal] = useState(false);
  const [showModal5, setShowModal5] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      questions: [
        {
          questionText: "",
          options: [{ optionText: "", isCorrect: false }],
        },
      ],
      author: window.localStorage.getItem("fullName"),
    },
  });
  let author = window.localStorage.getItem("fullName");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = async (data) => {
    const isValid = await trigger();
    if (!isValid) return;

    // Language tanlanganligini tekshirish
    if (!language) {
      alert("Iltimos, tilni tanlang!");
      return;
    }

    // Validatsiya: Har bir savolda faqat bitta to‘g‘ri javob bo‘lishi kerak
    for (let i = 0; i < data.questions.length; i++) {
      const correctOptions = data.questions[i].options.filter(
        (opt) => opt.isCorrect
      );
      if (correctOptions.length !== 1) {
        alert(
          `Savol ${i + 1} uchun aniq bitta to‘g‘ri javob tanlanishi kerak.`
        );
        return;
      }
    }

    try {
      // localStorage dan author olib, data ichiga qo‘shamiz
      const author = window.localStorage.getItem("fullName");
      const finalData = {
        ...data,
        author,
        language, // Language qiymatini qo'shish
      };
      await axios.post(`${API}/lang/test/add`, finalData);

      alert("Test muvaffaqiyatli saqlandi!");
      setShowModal(false);
    } catch (error) {
      console.error("Testni saqlashda xatolik:", error);
    }
  };
  const getAllTests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/lang/test/getall`);
      setAllTests(data.allTests || []);
      setLoading(false);
    } catch (err) {
      console.log("Testlarni yuklashda xatolik yuz berdi.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTests();
  }, []);

  const deleteNormative = async (id) => {
    try {
      await axios.delete(`${API}/lang/test/delete/${id}`);
      getAllTests();
    } catch (err) {
      console.log("Testni o'chirishda xatolik yuz berdi.");
      setLoading(false);
    }
  };

  return (
    <div className="mh100">

      <div className="text-end">
        <Button className="m-5" variant="primary" onClick={() => setShowModal(true)}>
          + Yangi Test
        </Button>
      </div>
      <div className="table-responsive">
        <Table striped bordered hover className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Muallif</th>
              <th>Til</th>
              <th>Nomi</th>
              <th>Savollar soni</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {allTests.length > 0 ? (
              allTests.map((norm, index) => (
                <tr key={norm._id}>
                  <td>{index + 1}</td>
                  <td>{norm.author}</td>
                  <td>{norm.language}</td>
                  <td>
                    {norm.questions && norm.questions.length > 0
                      ? norm.questions[0].questionText
                      : "-"}
                  </td>
                  <td>{norm.questions.length}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedNormativeId(norm._id);
                        handleShow();
                      }}
                    >
                      O‘chirish
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setShowModal5(true);
                        setSelectedTestId(norm._id);
                        setSelected(norm.sent.map((item) => item));
                        setPassed(norm.pass.map((item) => item));
                      }}

                    >
                      Yuborish
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  <img className="notfoundpng" src={notfound} alt="" />
                  <h5>Hozircha testlar yo'q</h5>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Yangi Test Yaratish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center d-flex align-items-center justify-content-center mb-3">
            <Form.Check
              type="radio"
              label="Rus"
              name="normativeType"
              value="Rus"
              checked={language === "Rus"}
              onChange={(e) => setLanguage(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Ingliz"
              name="normativeType"
              value="Ingliz"
              checked={language === "Ingliz"}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((question, qIndex) => (
              <div key={question.id} className="mb-4 p-3 border rounded">
                <Form.Group className="mb-2">
                  <Form.Label>Savol {qIndex + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Savol matnini kiriting"
                    {...register(`questions.${qIndex}.questionText`, {
                      required: "Savol matni majburiy",
                    })}
                    isInvalid={errors.questions?.[qIndex]?.questionText}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.questions?.[qIndex]?.questionText?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Label>Variantlar</Form.Label>
                <Controller
                  control={control}
                  name={`questions.${qIndex}.options`}
                  render={({ field, fieldState }) => {
                    const options = field.value;
                    const updateOptions = (newOptions) =>
                      field.onChange(newOptions);

                    const handleOptionChange = (index, key, value) => {
                      const updated = options.map((opt, i) =>
                        i === index ? { ...opt, [key]: value } : opt
                      );
                      updateOptions(updated);
                    };

                    const addOption = () => {
                      updateOptions([
                        ...options,
                        { optionText: "", isCorrect: false },
                      ]);
                    };

                    const removeOption = (index) => {
                      const updated = options.filter((_, i) => i !== index);
                      updateOptions(updated);
                    };

                    return (
                      <>
                        {options.map((opt, oIndex) => (
                          <div
                            key={oIndex}
                            className="d-flex align-items-center mb-2"
                          >
                            <Form.Check
                              type="radio"
                              name={`correctOption-${qIndex}`}
                              checked={opt.isCorrect}
                              onChange={() =>
                                updateOptions(
                                  options.map((o, i) => ({
                                    ...o,
                                    isCorrect: i === oIndex,
                                  }))
                                )
                              }
                              className="me-2"
                            />
                            <Form.Control
                              type="text"
                              placeholder={`Variant ${oIndex + 1}`}
                              value={opt.optionText}
                              onChange={(e) =>
                                handleOptionChange(
                                  oIndex,
                                  "optionText",
                                  e.target.value
                                )
                              }
                              className={
                                opt.isCorrect ? "bg-success text-white" : ""
                              }
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => removeOption(oIndex)}
                              className="ms-2"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={addOption}
                        >
                          +
                        </Button>
                      </>
                    );
                  }}
                />
                <div className="text-end">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => remove(qIndex)}
                    className="mt-2"
                  >
                    Savolni o`chirish <i className="fa-solid fa-trash"></i>
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="success"
              onClick={() =>
                append({
                  questionText: "",
                  options: [{ optionText: "", isCorrect: false }],
                })
              }
            >
              + Yangi Savol
            </Button>
            <div className="mt-4 text-end">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Bekor qilish
              </Button>
              <Button variant="primary" type="submit" className="ms-2">
                Saqlash
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal centered show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Testni o‘chirish</Modal.Title>
        </Modal.Header>
        <Modal.Body>Ushbu testni o‘chirmoqchimisiz?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Yopish
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteNormative(selectedNormativeId); // O‘chirish
              handleClose2(); // Modalni yopish
            }}
          >
            O‘chirish
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size="lg" centered show={showModal5} onHide={handleClose5}>
        <Modal.Header closeButton>
          <Modal.Title>Yuborish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Send testId={selectedTestId} passed={passed} selected={selected} setSelected={setSelected} handleClose5={handleClose5} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TestCreator;
