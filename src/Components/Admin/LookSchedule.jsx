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
import { useLoading } from "../Additional/LoadingScreen";
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
  const { setLoading } = useLoading();

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
      setLoading(true);
      const { data } = await axios.get(
        `${API}/schedules/getschedulebyid/${id}`
      );
      setThisScheduleHistory(data.thehistory);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getThisScheduleHistory();
  }, []);

  // PDF yaratish funksiyasi
  const generatePDF = async () => {
    setLoading(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pages = document.querySelectorAll(".a4-page");

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2, // 2-3 is enough for crisp A4, reduces MB significantly
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.85);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, 'FAST');
      }

      pdf.save(
        `${thisScheduleHistory.beginnerName || "hisobot"}_${thisScheduleHistory.startedAt?.slice(0, 10) || "sana"}_mkundalik.uz.pdf`
      );
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic: chunk tasks into pages
  const TASKS_PER_PAGE_FIRST = 8; // Fewer on first page due to header
  const TASKS_PER_PAGE_REST = 15; // More on subsequent pages

  const chunkTasks = (tasks) => {
    if (!tasks || tasks.length === 0) return [[]];
    const chunks = [];
    chunks.push(tasks.slice(0, TASKS_PER_PAGE_FIRST));

    let remaining = tasks.slice(TASKS_PER_PAGE_FIRST);
    while (remaining.length > 0) {
      chunks.push(remaining.slice(0, TASKS_PER_PAGE_REST));
      remaining = remaining.slice(TASKS_PER_PAGE_REST);
    }
    return chunks;
  };

  const taskPages = chunkTasks(thisScheduleHistory.tasks || []);

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

      <div ref={componentRef} className="a4-container">
        {taskPages.map((pageTasks, pageIdx) => (
          <div key={pageIdx} className="a4-page shadow-lg">
            {/* Header: Only on first page */}
            {pageIdx === 0 && (
              <>
                <div className="scheduletepa">
                  <div className="row align-items-center">
                    <div className="col-3 d-flex text-center">
                      <div className="d-block">
                        <img className="schedulelogo" src={logo} alt="logo" />
                        <img className="schedulelogo2" src={logomk} alt="logo" />
                      </div>
                      <img className="schedulelogo3" src={flag} alt="logo" />
                    </div>
                    <div className="col-9 bolddd fw-bold text-center" style={{ fontSize: '10pt', lineHeight: '1.2' }}>
                      "Toshkent metropoliteni" DUK kundalik hisobotlarni elektron shakllantirish platformasi
                      <hr className="bolded my-1" />
                      ГУП "Тошкент метрополитени" создание ежедневных отчетов электронная платформа
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-1">
                  <img src={smalllogo} className="smalllogo" alt="logo" style={{ width: '40px' }} />
                  <div className="blankedd text-center" style={{ fontSize: '8pt', opacity: 0.8 }}>
                    mkundalik.uz tizimi bo‘yicha taklif va murojaatlar uchun pochta manzili: mkundalik@tashmetro.uz | telefon: (71) 227-44-13.
Quyida shakllantirilgan elektron hisobot mazmuniga hisobot egasi mas'ul hisoblanadi.
                  </div>
                </div>
                <hr className="hrnone mb-3" />

                <div className="scheduleinfo mb-3">
                  <table style={{ fontSize: '10pt', width: '100%' }}>
                    <tbody>
                      <tr>
                        <td className="fw-bold" style={{ width: '100px' }}>Kompleks:</td>
                        <td>{thisScheduleHistory.complex}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Xizmat:</td>
                        <td>{thisScheduleHistory.department}</td>
                      </tr>
                      {thisScheduleHistory.section && thisScheduleHistory.section !== "Yuqori turuvchi" && (
                        <tr>
                          <td className="fw-bold">Bo`lim:</td>
                          <td>{thisScheduleHistory.section}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="ochilgan text-center mb-1">
                  <b>{thisScheduleHistory?.startedAt?.slice(0, 10) || "N/A"}</b>
                </p>
                <h5 className="text-center fw-bold mb-3">{t("kunhisoboti")}</h5>
              </>
            )}

            {/* If not first page, add a small header */}
            {pageIdx > 0 && (
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <span className="fw-bold" style={{ fontSize: '10pt' }}>{thisScheduleHistory.beginnerName} - Kun hisoboti</span>
                <span style={{ fontSize: '9pt', color: '#666' }}>Sana: {thisScheduleHistory?.startedAt?.slice(0, 10)}</span>
              </div>
            )}

            {/* Task Items */}
            <div className="scheduletasks flex-grow-1">
              {pageTasks.map((task, index) => {
                const globalIndex = pageIdx === 0 ? index : TASKS_PER_PAGE_FIRST + (pageIdx - 1) * TASKS_PER_PAGE_REST + index;
                return (
                  <div key={index} className="task-item mb-2 pb-1 border-bottom border-light">
                    <div style={{ fontSize: '11pt', lineHeight: '1.4' }}>
                      <b className="me-2">{globalIndex + 1}.</b> <span>{task.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer / Meta: Only on last page */}
            {pageIdx === taskPages.length - 1 && (
              <div className="mt-4 border-top pt-3">
                <div className="d-flex justify-content-between">
                  <div style={{ fontSize: '10pt' }}>
                    {thisScheduleHistory?.rated && (
                      <div className="mb-2">
                        <b>{thisScheduleHistory.ratedName || t("rahbar")}</b> {t("ratedBy")}:
                        <span className="ms-2 badge bg-success bg-opacity-10 text-success border border-success-subtle px-3">
                          {thisScheduleHistory.rated}/100
                        </span>
                      </div>
                    )}
                    {thisScheduleHistory.comment && (
                      <div className="mb-2 text-muted" style={{ fontSize: '9pt', fontStyle: 'italic' }}>
                        <b>{t("comment")}:</b> {thisScheduleHistory.comment}
                      </div>
                    )}
                  </div>
                </div>

                {thisScheduleHistory.modified && (
                  <div className="mt-3 text-danger fw-bold" style={{ fontSize: '9pt' }}>
                    * Ushbu hisobot belgilangan muddatda topshirilmagan. Ma’lum sabablarga ko‘ra administrator tomonidan kirish (dostup) huquqi qayta taqdim etildi. {thisScheduleHistory.startedAt?.slice(0, 10)} kuni topshirilishi lozim bo‘lgan hisobot amalda {thisScheduleHistory.modified?.slice(0, 10)} kuni topshirildi
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-end mt-3">
                  <div style={{ fontSize: '10pt' }}>
                    <div className="fw-bold mb-1">{thisScheduleHistory.degree || "Xodim"}</div>
                    <div className="border-top pt-1 mt-2" style={{ width: '150px', fontSize: '8pt', color: '#999' }}>Imzo: ________________</div>
                    <div className="mt-2">{thisScheduleHistory.beginnerName}</div>
                  </div>
                  <div className="qr-box text-center">
                    <QRCodeSVG value={currentUrl} size={70} />
                    <div style={{ fontSize: '7pt', marginTop: '5px', color: '#999' }}>QR-kod orqali tekshirish</div>
                  </div>
                </div>
              </div>
            )}

            {/* Page Numbering Footer */}
            <div className="page-footer-meta">
              <span style={{ fontSize: '8pt' }}>mkundalik.uz - Elektron hisobot tizimi</span>
              <span className="fw-bold">{pageIdx + 1} / {taskPages.length}</span>
              <span style={{ fontSize: '8pt' }}>Hujjat ID: {thisScheduleHistory._id?.slice(-8).toUpperCase()}</span>
            </div>
          </div>
        ))}
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
