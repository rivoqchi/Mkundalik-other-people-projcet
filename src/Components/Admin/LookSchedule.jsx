import React, { useState, useEffect, useRef } from "react";
import { API } from "../../config";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logo from "../Images/logo2.png";
import logomk from "../Images/logo-png.png";
import smalllogo from "../Images/metroblanklogo.png";
import flag from "../Images/half-flag.JPG";
import { format } from "date-fns";
import LoadingScreen from "../Additional/LoadingScreen";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "../Additional/Alert";
import DownloadDocx from "./DownloadDocx";
import { useTranslation } from "react-i18next";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { useLocation } from "react-router-dom"; // URL parametrlarini olish uchun

function ScheduleRate() {
  const location = useLocation();
  const { t } = useTranslation();
  const myId = window.localStorage.getItem("user_id");
  const myFullName = window.localStorage.getItem("fullName");
  const [myData, setMyData] = useState([]);
  const [myRole, setMyRole] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [show, setShow] = useState(false);
  const [thisScheduleHistory, setThisScheduleHistory] = useState([]);
  const [checking, setChecking] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
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
  const [reportData, setReportData] = useState("");

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
    } else if (data.user.role === "hr") {
      setMyRole("hr");
    } else if (data.user.role === "boss") {
      setMyRole("boss");
    } else if (data.user.role === "commission") {
      setMyRole("commission");
    }
  };

  useEffect(() => {
    getMyData();
  }, []);

  const { id } = useParams();
  const componentRef = useRef();
  const navigate = useNavigate();
  const getThisScheduleHistory = async () => {
    try {
      const { data } = await axios.get(
        `${API}/schedules/getschedulebyid/${id}`
      );
      setThisScheduleHistory(data.thehistory);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getThisScheduleHistory();
  }, []);

  // PDF yaratish funksiyasi
  const generatePDF = async () => {
    const input = componentRef.current;
    input.style.padding = "20px"; // Padding qo'shish

    const canvas = await html2canvas(input, {
      scale: 10,
      useCORS: true,
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.8); // 0.8 = sifatni pasaytirib hajmni kamaytirish

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    let imgHeight = (canvas.height * pdfWidth) / canvas.width; // Rasm o'lchovini muvofiqlashtirish
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(
      `${
        thisScheduleHistory.beginnerName
      }_${thisScheduleHistory.startedAt.slice(0, 10)}_mkundalik.uz.pdf`
    );
  };

  const currentUrl = `https://mkundalik.uz/documents/archive/schedule/${thisScheduleHistory._id}`;
  const currentDateTime = format(new Date(), "dd.MM.yyyy HH:mm");

  const [selectedStars, setSelectedStars] = useState(0); // Tanlangan yulduzlar
  const [isFinalized, setIsFinalized] = useState(false); // Hover ni bloklash uchun

  const handleStarClick = (index) => {
    setSelectedStars(index + 1);
    setIsFinalized(true); // Hoverni bloklash
  };

  const handleSubmit = async () => {
    const rated = selectedStars * 10; // Bahoni hisoblash
    try {
      await axios.put(`${API}/schedules/ratebyid/${id}`, { rated });
      navigate(`/${myRole}/rating/ours`);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (reportData.length === 0) {
      setAlert({
        show: true,
        type: "error",
        message: "Iltimos, murojaat matnini kiriting!",
      });
    } else {
      try {
        await axios.post(`${API}/reports/new`, {
          message: reportData,
          reporterName: myFullName,
          reporterId: myId,
          schedule: thisScheduleHistory,
        });
        setAlert({
          show: true,
          type: "success",
          message: "Muvaffaqiyatli yuborildi!",
        });
        thisScheduleHistory.reported = true;
        handleClose();
      } catch (error) {
        setAlert({ show: true, type: "error", message: "Xatolik yuz berdi!" });
      }
    }
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
  };

  let lavozimegasi = thisScheduleHistory.beginnerId;
  const renderTooltip = (props, source) => (
    <Tooltip id="button-tooltip" {...props}>
      {source}
    </Tooltip>
  );
  // URL parametrlarini tekshirish va generatePDF funksiyasini chaqirish
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("download") === "true" && thisScheduleHistory._id) {
      generatePDF(); // PDF-ni avtomatik yuklab olish
    }
  }, [location.search, thisScheduleHistory]); // `thisScheduleHistory` o'zgarganda qayta ishlaydi

  return (
    <>
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      {loading && <LoadingScreen loading={true} />}

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
              <div className="col-9 bolddd fw-bold text-center">
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
    {thisScheduleHistory.section !== "Yuqori turuvchi" && (
    <tr>
      <td className="fw-bold"><i class="fa-solid fa-users"></i> Bo`lim:</td>
      <td>{thisScheduleHistory.section}</td>
    </tr>
    
    )
    }
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
        {/* <DownloadDocx
          thisScheduleHistory={thisScheduleHistory}
          currentDateTime={currentDateTime}
          degree={thisScheduleHistory.degree}
        /> */}
      </div>

      <Modal size="lg" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("etiroz")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>{thisScheduleHistory.ratedName}</b>{" "}
          {t("batafsilbayonforcommission")}:
        </Modal.Body>
        <div className="text-center">
          <textarea
            className="kghgva"
            value={reportData}
            onChange={(e) => setReportData(e.target.value)}
            rows="5"
          />
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("close")}
          </Button>
          <Button variant="danger" onClick={(e) => handleReport(e)}>
            {t("report")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ScheduleRate;
