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
import DownloadDocx from "./DownloadDocx";
import { useTranslation } from "react-i18next";
import logomk from "../Images/logo-png.png";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import flag from "../Images/half-flag.JPG";
import smalllogo from "../Images/metroblanklogo.png";
function ScheduleRate() {
  const { t } = useTranslation();

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [show, setShow] = useState(false);
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
    const handleShow = () => {
    if (thisScheduleHistory.reported) {
      setAlert({
        show: true,
        type: "error",
        message: "Siz e'tiroz bildirib bo`lgansiz!",
      });
    } else {
      setShow(true);
    }
  };
  const [thisScheduleHistory, setThisScheduleHistory] = useState([]);
  const [comment, setComment] = useState(thisScheduleHistory.comment || "");
  const [isCommentEmpty, setIsCommentEmpty] = useState(false);
  const [checking, setChecking] = useState([]);
  const [manualRating, setManualRating] = useState("");
  const [tasdiq, setTasdiq] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [setAI, setSetAi] = useState(false);
  useEffect(() => {
    if (showModal) {
      setSetAi(false);

      let summarizedBall = 0;
      let tasks = thisScheduleHistory.tasks || [];
      tasks.forEach((task) => {
        if (task.source === "majburiyat") {
          summarizedBall += 5; // majburiyat uchun 5ga ko'paytirish
        } else if (task.source === "qoshimcha") {
          summarizedBall += 7; // qoshimcha uchun 7ga ko'paytirish
        } else if (task.source === "tashabbus") {
          summarizedBall += 10; // tashabbus uchun 10ga ko'paytirish
        }
        if (summarizedBall > 100) {
          summarizedBall = 100; // maksimal ball 100 ga teng
        }
        setManualRating(summarizedBall);
      });
    } else {
      setSetAi(false);
    }
  }, [showModal]);

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
      // setManualRating(data.thehistory.rated || 0);
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
  const renderTooltip = (props, source) => (
    <Tooltip id="button-tooltip" {...props}>
      {source}
    </Tooltip>
  );
  return (
    <>
      <div ref={componentRef} className="hisobot">
        <div className="scheduleshistory">
          <div className="scheduletepa">
            <div className="row align-items-center">
              <div className="col-3 d-flex text-center">
                <div className="d-block">
                  <img className="schedulelogo" src={logo} alt="logo" />
                  <img className="schedulelogo2" src={logomk} alt="logo" />
                </div>
                <img className="schedulelogo3" src={flag} alt="logo" />
              </div>
              <div className="col-9 fw-bold text-center">
                "Toshkent metropoliteni" DUK kundalik hisobotlarni elektron shakllantirish platformasi
                <hr className="bolded" />
                ГУП "Тошкент метрополитени" создание ежедневных отчетов
                электронная платформа
              </div>
              {/* <div className="col-4 fw-bold text-center">
              </div> */}
            </div>
          </div>
          <br />
          <hr className="hrnone" />
          <div className="justify-content-between d-flex">
            <img src={smalllogo} className="smalllogo" alt="logo" />
            <div className="blankedd text-center">
              <a href="https://mkundalik.uz">mkundalik.uz</a> tizimi bo‘yicha
              taklif va murojaatlar uchun pochta manzili:{" "}
              <a href="mailto:mkundalik@tashmetro.uz">mkundalik@tashmetro.uz</a>{" "}
              | telefon: (71) 227-44-13. <br />

              Quyida shakllantirilgan elektron hisobot mazmuniga hisobot egasi
              mas'ul hisoblanadi.
            </div>
          </div>
          <hr className="hrnone mb-2" />
          <div className="scheduleinfo">
            <div className="schedulebajaruvchilar">
<table className=" text-start">
  <tbody>
    <tr>
      <td className="fw-bold"><i class="fa-solid fa-users-between-lines"></i> Kompleks:</td>
      <td className="border-none">{thisScheduleHistory.complex}</td>
    </tr>
    <tr>
      <td className="fw-bold"><i class="fa-solid fa-people-line"></i> Xizmat:</td>
      <td>{thisScheduleHistory.department}</td>
    </tr>
    <tr>
      <td className="fw-bold"><i class="fa-solid fa-users"></i> Bo`lim:</td>
      <td>{thisScheduleHistory.section}</td>
    </tr>
  </tbody>
</table>
            </div>
          </div>
          <br />
          <p className="ochilgan text-center">
            <b>{thisScheduleHistory?.startedAt?.slice(0, 10) || "N/A"}</b>
          </p>
          <h5 className="text-center">{t("kunhisoboti")}</h5>
          <div className="scheduletasks">
            {thisScheduleHistory.tasks?.map((task, index) => (
              <div key={index} className="task-item">
                <div className="">
                  {/* {task.source === "majburiyat" && (
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 0, hide: 0 }}
                      overlay={(props) =>
                        renderTooltip(props, t("lavozimmajburiyati"))
                      }
                    >
                      <i
                        title={t("lavozimmajburiyati")}
                        className="fa-solid sources majburiyat fa-square"
                      ></i>
                    </OverlayTrigger>
                  )} */}
                  {/* {task.source === "qoshimcha" && (
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 0, hide: 0 }}
                      overlay={(props) =>
                        renderTooltip(props, t("rahbartomonidanqoshimcha"))
                      }
                    >
                      <i
                        title={t("rahbartomonidanqoshimcha")}
                        className="fa-solid sources qoshimcha fa-square"
                      ></i>
                    </OverlayTrigger>
                  )} */}
                  {/* {task.source === "tashabbus" && (
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 0, hide: 0 }}
                      overlay={(props) =>
                        renderTooltip(props, t("xodimtashabbusi"))
                      }
                    >
                      <i
                        title={t("xodimtashabbusi")}
                        className="fa-solid sources tashabbus fa-square"
                      ></i>
                    </OverlayTrigger>
                  )} */}
                  <b>{index + 1}.</b> <span>{task.title}</span>
                </div>
                <hr className="hrnone2" />
              </div>
            ))}
            <div className="schedulerated">
              <div className="justify-content-between d-flex">
                <p>
                  {thisScheduleHistory?.rated ? (
                    thisScheduleHistory.ratedName ? (
                      <>
                        <b>{thisScheduleHistory.ratedName}</b> {t("ratedBy")}:
                      </>
                    ) : (
                      t("rated")
                    )
                  ) : (
                    t("nonrated")
                  )}
                </p>
                <span className="rateschhh">
                  {thisScheduleHistory.rated ? (
                    <div className="align-items-center justify-content-center">
                      <i className="fa-regular fa-star"></i>
                      {thisScheduleHistory.rated}
                      {"/100"}
                    </div>
                  ) : (
                    t("-")
                  )}
                </span>
              </div>
            </div>
            {thisScheduleHistory.comment && (
              <div className="commentsch align-items-center justify-content-between d-flex">
                <div className="">
                  <b>{t("comment")}:</b> {thisScheduleHistory.comment}
                </div>
                <i
                  disabled={thisScheduleHistory.reported}
                  onClick={handleShow}
                  className="fa-solid excla fa-triangle-exclamation"
                ></i>
              </div>
            )}
            <div className="schedulebajaruvchilar mt-3 d-flex justify-content-between align-items-center">
              <span>{thisScheduleHistory.degree || t("infonotfound")}</span>
              <div
                className="qr-container text-center"
                // style={{ marginLeft: "20px" }}
              >
                <QRCodeSVG value={currentUrl} size={80} />
              </div>
              <span>{thisScheduleHistory.beginnerName}</span>
            </div>
          </div>
          <div>
            {/* <div className="scheduleconfirms text-end mb-1">
              {t("infotasdiqlaydi")}:{" "}
              <span>{thisScheduleHistory.beginnerName}</span>
            </div> */}
            {/* <div className="warningtext">
{t("ushbustikerlar")}
  <ul className="list-unstyled">
    <li><i className="fa-solid sources majburiyat fa-square"></i> - {t("lavozimmajburiyati")}</li>
    <li><i className="fa-solid sources qoshimcha fa-square"></i> - {t("rahbartomonidanqoshimcha")}</li>
    <li><i className="fa-solid sources tashabbus fa-square"></i> - {t("xodimtashabbusi")}</li>
  </ul>
</div> */}
            {/* checkpoint */}

            {/* checkpoint */}

            {/* <div className="current-datetime text-end mx-5">
              {currentDateTime}
            </div> */}
          </div>

          {/* checkpoint */}
          {/* <div className="d-flex align-items-center justify-content-between">
            <div className="pdfqr">
              <div className="exclamationqr">
                {t("checkwithqr")}. <br />
                {t("doconly")}{" "}
                <a
                  href="http://mkundalik.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  mkundalik.uz
                </a>{" "}
                {t("onsite")}
                <br />
                {t("egasijavobgar")}.
                <div className="current-datetime text-end mx-5">
                  {currentDateTime}
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <div className="d-flex justify-content-evenly align-items-center">
        <button
          onClick={generatePDF}
          className="defaultbtn"
          style={{ margin: "20px 0" }}
        >
          <i className="fa-solid fa-download"></i> {t("pdf")}
        </button>
        <DownloadDocx
          thisScheduleHistory={thisScheduleHistory}
          currentDateTime={currentDateTime}
          degree={thisScheduleHistory.degree}
        />
      </div>

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
            {/* <div className="">
            <i className="fa-solid ourai fa-robot"></i>
    {setAI && (
      <Spinner animation="border" size="sm" className="input-spinner" />
    )}
            </div> */}
            <div className="redword">Tizim taklif qilayotgan ball:</div>{" "}
            <div className="">* o`zgartirish mumkin.</div>
            <input
              type="number"
              value={manualRating}
              onChange={handleInputChange}
              min="1"
              max="100"
              // className={setAI ? '' : 'no-ai'}
              // disabled={setAI}
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
            rows="3"
          />
          {/* <div className="row">
            <div className="col-6 text-center">
              <button className="w-100"onClick={() => setTasdiq(true)}>Bahoni tasdiqlash</button>
            </div>
          </div> */}
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
      <div className="schedulerated">
                    <div className="text-center">
                      <Button
                        className="baholash-wave-btn"
                        variant="primary"
                        onClick={() => setShowModal(true)}
                      >
                        {t("baholash")} <i className="fa-solid fa-star"></i>
                      </Button>
                    </div>
                    
                    {thisScheduleHistory.comment && (
                      <div className="commentsch align-items-center justify-content-between d-flex">
                        <div className="">
                          <b>{t("comment")}:</b> {thisScheduleHistory.comment}
                        </div>
                        <i
                          disabled={thisScheduleHistory.reported}
                          className="fa-solid excla fa-triangle-exclamation"
                          ></i>
                      </div>
                    )}
                  </div>
    </>
  );
}

export default ScheduleRate;
