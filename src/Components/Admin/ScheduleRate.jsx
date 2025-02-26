import React, { useState, useEffect, useRef } from "react";
import { API } from "../../config";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logo from "../Images/logo2.png";
import { format } from "date-fns";
import { Modal, Button, Form } from "react-bootstrap";

function ScheduleRate() {
  const myId = window.localStorage.getItem("user_id");
  const fullName = window.localStorage.getItem("fullName");
  const [myData, setMyData] = useState([]);
  const [myRole, setMyRole] = useState([]);
  const getMyData = async () => {
    const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
    setMyData(data.user);
    if (data.user.role === "employee") {
      setMyRole("user");
    } else if (data.user.role === "admin") {
      setMyRole("admin");
    } else if (data.user.role === "superadmin") {
      setMyRole("superadmin");
    } else if (data.user.role === "complex") {
      setMyRole("complex");
    } else if (data.user.role === "department") {
      setMyRole("department");
    } else if (data.user.role === "boss") {
      setMyRole("boss");
    } else if (data.user.role === "hr") {
      setMyRole("hr");
    } else if (data.user.role === "commission") {
      setMyRole("commission");
    }
  };
  useEffect(() => {
    getMyData();
  }, []);

  const [thisScheduleHistory, setThisScheduleHistory] = useState([]);
  const [comment, setComment] = useState(thisScheduleHistory.comment || "");
  const [isCommentEmpty, setIsCommentEmpty] = useState(false);
  const [checking, setChecking] = useState([]);
  const [manualRating, setManualRating] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { id } = useParams();
  const componentRef = useRef();
  const navigate = useNavigate();
  const getThisScheduleHistory = async () => {
    try {
      const { data } = await axios.get(
        `${API}/schedules/getschedulebyid/${id}`
      );
      setThisScheduleHistory(data.thehistory);
      setChecking(data.thehistory.beginnerId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getThisScheduleHistory();
  }, []);

  useEffect(() => {
    const check = async () => {
      if (checking === myId) {
        navigate("/");
      }
    };
    check(); // Asinxron funksiyani shu yerda chaqiramiz.
  }, [checking, myId, navigate]);

  // PDF yaratish funksiyasi
  const generatePDF = async () => {
    const input = componentRef.current;
    const canvas = await html2canvas(input, { scale: 10 }); // Kattaroq ko‘rinish uchun ko‘lam
    const imgData = canvas.toDataURL("image/jpeg", 1); // Buni 0.8 qilsa ham bo`ladi

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width / 2; // Tasvirni siqish
    const imgHeight = canvas.height / 2;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth * ratio, imgHeight * ratio);
    pdf.save("hisobot.pdf");
  };

  const currentUrl = `https://mkundalik.uz/documents/archive/schedule/${thisScheduleHistory._id}`;
  const currentDateTime = format(new Date(), "dd.MM.yyyy HH:mm");

  const [selectedStars, setSelectedStars] = useState(0); // Tanlangan yulduzlar
  const [isFinalized, setIsFinalized] = useState(false); // Hover ni bloklash uchun

  const handleStarClick = (index) => {
    const rating = (index + 1) * 10;
    setSelectedStars(index + 1);
    setManualRating(rating);
  };

  const handleInputChange = (event) => {
    const value = Number(event.target.value);
    if (value < 1) {
      alert("Eng kamida 1 ball qo`ya olasiz");
      setManualRating(1);
    } else if (value > 100) {
      setManualRating(100);
    } else {
      setManualRating(value);
    }
  };

  const handleSubmit = async () => {
    if (!manualRating || !comment.trim()) {
      alert("Barcha maydonlarni to‘ldiring");
      setIsCommentEmpty(true); // commentquacke klassini qo‘shish uchun
      return;
    }

    try {
      await axios.put(`${API}/schedules/ratebyid/${id}`, {
        rated: manualRating,
        ratedId: myId,
        ratedName: fullName,
        comment: comment,
      });
      navigate(`/${myRole}/rating/ours`);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <>
      <div ref={componentRef} className="hisobot">
        <div className="scheduleshistory">
          <div className="scheduletepa">
            <div className="align-items-center justify-content-between d-flex">
              <img className="schedulelogo" src={logo} alt="logo" />
              <h3 className="px-2">"ТОШКEНТ МEТРОПОЛИТEНИ" ДУК</h3>
            </div>
          </div>
          <div className="scheduleinfo">
            <div className="schedulebajaruvchilar">
              <i className="fa-regular fa-user"></i> Ҳисоботни бажарган ходим:{" "}
              <span>{thisScheduleHistory.beginnerName}</span>
            </div>
            <div className="schedulebajaruvchilar">
              <i class="fa-solid fa-building-ngo"></i> Комплекс:{" "}
              <span>{thisScheduleHistory.complex}</span>
            </div>
            <div className="schedulebajaruvchilar">
              <i class="fa-solid fa-users-viewfinder"></i> Ташкилий тузилма:{" "}
              <span>{thisScheduleHistory.department}</span>
            </div>
            <div className="schedulebajaruvchilar">
              <i className="fa-solid fa-users"></i> Бўлим:{" "}
              <span>{thisScheduleHistory.section}</span>
            </div>
            <div className="schedulebajaruvchilar">
              <i class="fa-solid fa-file-contract"></i> Лавозими:{" "}
              <span>{thisScheduleHistory?.degree || "Ma'lumot topilmadi"}</span>
            </div>
          </div>
          <br />
          <p className="ochilgan text-center">
            <b>{thisScheduleHistory?.startedAt?.slice(0, 10) || "N/A"}</b>
          </p>
          <h5 className="text-center">Кундалик бажарилган ишлар ҲИСОБОТИ:</h5>
          <div className="scheduletasks">
            {thisScheduleHistory.tasks?.map((task, index) => (
              <div key={index} className="task-item">
                <div className="">
                  {index + 1}. <span>{task.title}</span>
                </div>
                <div className="">
                  <Link>
                    <span>{task.source}</span>
                  </Link>
                </div>
                <hr />
              </div>
            ))}
          </div>
          <br />
          <div>
            <div className="scheduleconfirms text-end mb-1">
              Маълумотлар тўғрилигини тасдиқлайди:{" "}
              <span>{thisScheduleHistory.beginnerName}</span>
            </div>

            <div className="schedulerated">
              <div className="text-center">
                <Button
                  className="baholashbbb"
                  variant="primary"
                  onClick={() => setShowModal(true)}
                >
                  Баҳолаш <i class="fa-solid fa-star"></i>
                </Button>
              </div>
              <div className="schedulerated">
                <div className="justify-content-between d-flex">
                  <h5>Баҳоланган: </h5>
                  <span className="rateschhh">
                    {thisScheduleHistory.rated ? (
                      <div className="align-items-center justify-content-center">
                        <i className="fa-regular fa-star"></i>
                        {thisScheduleHistory.rated}
                        {"/100"}
                      </div>
                    ) : (
                      "Yo'q"
                    )}
                  </span>
                </div>
              </div>

              {thisScheduleHistory.comment && (
              <div className="commentsch">
                <b>Baholovchi fikri:</b> {thisScheduleHistory.comment}
              </div>
            )}
            <div className="scheduleconfirms text-end mb-1">
            Баҳолади:{" "}
              <span>{thisScheduleHistory.ratedName}</span>
            </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="pdfqr">
              <div className="exclamationqr">
                Ҳужжатнининг ҳақиқийлигини текшириш учун ушбу QR кодни
                сканерланг. <br />
                Ҳужжат фақатгина{" "}
                <a
                  href="http://mkundalik.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  mkundalik.uz
                </a>{" "}
                сайтида тақдим этилади.
                <br />
                Ушбу ҳисоботда келтирилган барча ишлар мазмунига ҳисоботни
                шакллантирган ходим масъул ҳисобланади.
                <div className="current-datetime text-end mx-5">
                  {currentDateTime}
                </div>
              </div>
            </div>
            <div
              className="qr-container text-center"
              style={{ marginLeft: "20px" }}
            >
              <QRCodeSVG value={currentUrl} size={80} />
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={generatePDF}
        className="pdf-download-btn"
        style={{ margin: "20px 0" }}
      >
        <i className="fa-solid fa-download"></i> PDF юклаб олиш
      </button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Баҳолаш</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="stars">
            {[...Array(10)].map((_, index) => (
              <i
                key={index}
                className={`fastar ${index < selectedStars ? "selected" : ""}`}
                onClick={() => handleStarClick(index)}
              >
                ★
              </i>
            ))}
          </div>
          <div className="bahoinput text-center">
            <input
              type="number"
              value={manualRating}
              onChange={handleInputChange}
              min="1"
              max="100"
            />
          </div>
          <textarea
            className={`kghgv ${isCommentEmpty ? "commentquacke" : ""}`}
            value={comment}
            placeholder="Баҳолаш бўйича изоҳ қолдириш зарур:"
            onChange={(e) => {
              setComment(e.target.value);
              setIsCommentEmpty(false); // Foydalanuvchi yozishni boshlasa, class o‘chadi
            }}
            rows="5"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Бекор қилиш
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Юбориш
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ScheduleRate;
