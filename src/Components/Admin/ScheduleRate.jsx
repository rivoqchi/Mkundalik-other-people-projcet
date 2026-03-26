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
import { useLoading } from "../Additional/LoadingScreen";
import Alert from "../Additional/Alert";
import { motion, AnimatePresence } from "framer-motion";
import FormattedTypewriter from "../Additional/FormattedTypewriter";
function ScheduleRate() {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
    trigger: 0,
  });
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
      setAlert((prev) => ({
        show: true,
        type: "error",
        message: "Siz e'tiroz bildirib bo`lgansiz.",
        trigger: prev.trigger + 1,
      }));
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isAiApplied, setIsAiApplied] = useState(false);
  useEffect(() => {
    if (showModal) {
      setSetAi(false);
      setAiResult(null);
      setIsAiApplied(false);
      
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
  }, [showModal, thisScheduleHistory.tasks]);

  const { id } = useParams();
  const componentRef = useRef();
  const navigate = useNavigate();
  const getThisScheduleHistory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API}/schedules/getschedulebyid/${id}`,
      );
      setThisScheduleHistory(data.thehistory);
      setChecking(data.thehistory.beginnerId);
      setLoading(false);
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
    setLoading(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pages = document.querySelectorAll(".a4-page");

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2,
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
  const TASKS_PER_PAGE_FIRST = 8;
  const TASKS_PER_PAGE_REST = 15;

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
    const rating = (index + 1) * 10;
    setSelectedStars(index + 1);
    setManualRating(rating);
  };

  const handleInputChange = (event) => {
    const value = Number(event.target.value);
    if (value < 1) {
      setAlert((prev) => ({
        show: true,
        type: "error",
        message: "Eng kamida 1 ball qo`ya olasiz",
        trigger: prev.trigger + 1,
      }));
      setManualRating(1);
    } else if (value > 100) {
      setManualRating(100);
    } else {
      setManualRating(value);
    }
  };

  const handleAiRate = async () => {
    if (!thisScheduleHistory.tasks || thisScheduleHistory.tasks.length === 0) return;
    
    setIsAnalyzing(true);
    setAiResult(null);
    try {
      const { data } = await axios.post(`${API}/ai/rate-task`, {
        degree: thisScheduleHistory.degree,
        tasks: thisScheduleHistory.tasks,
        language: localStorage.getItem("i18nextLng") || "uz"
      });
      
      if (data.score) {
        setAiResult(data);
        setManualRating(data.score);
        setIsAiApplied(true);
      }
    } catch (error) {
      console.error("AI Rating Error:", error);
      setAlert((prev) => ({
        show: true,
        type: "error",
        message: "AI tahlilida xatolik yuz berdi",
        trigger: prev.trigger + 1,
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!manualRating || !comment.trim()) {
      setAlert((prev) => ({
        show: true,
        type: "error",
        message: "Baholash bali va izohni kiriting",
        trigger: prev.trigger + 1,
      }));
      setIsCommentEmpty(true);
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
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          trigger={alert.trigger}
        />
      )}
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
                    mkundalik.uz tizimi bo‘yicha taklif va murojaatlar uchun pochta manzili: mkundalik@tashmetro.uz | telefon: (71) 227-44-13. <br />
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
                    <div className="border-top pt-1 mt-2" style={{ width: '150px', fontSize: '8pt', color: '#999' }}>{t("imzo")}: ________________</div>
                    <div className="mt-2">{thisScheduleHistory.beginnerName}</div>
                  </div>
                  <div className="qr-box text-center">
                    <QRCodeSVG value={currentUrl} size={70} />
                    <div style={{ fontSize: '7pt', marginTop: '5px', color: '#999' }}>{t("tekshirish_qr")}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Page Numbering Footer */}
            <div className="page-footer-meta">
              <span style={{ fontSize: '8pt' }}>mkundalik.uz - Elektron hisobot tizimi</span>
              <span className="fw-bold">{pageIdx + 1} / {taskPages.length}</span>
              <span style={{ fontSize: '8pt' }}>{t("hujjat_id")}: {thisScheduleHistory._id?.slice(-8).toUpperCase()}</span>
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
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        className="premium-rating-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold w-100 text-center mt-3">
            <i className="fa-solid fa-star-half-stroke text-warning me-2"></i>
            {t("baholash")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <div className="rating-user-teaser text-center mb-4 p-3 rounded-4 bg-light">
            <div className="text-dark small mb-1">{t("didone")}:</div>
            <div className="fw-bold h5 mb-0 text-primary">{thisScheduleHistory.beginnerName}</div>
          </div>

          <div className="baho-input-wrapper text-center mb-4">
            <div className="d-flex flex-column align-items-center mb-3">
              <Button 
                variant="outline-primary" 
                size="sm" 
                className={`rounded-pill px-3 mb-2 ai-analyze-btn ${isAnalyzing ? 'analyzing' : ''}`}
                onClick={handleAiRate}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <><Spinner animation="border" size="sm" className="me-2" /> Tahlil qilinmoqda...</>
                ) : (
                  <><i className="fa-solid fa-wand-magic-sparkles me-2"></i> AI Tahlil</>
                )}
              </Button>
              <label className="d-block small mb-2">{t("system_suggestion")}</label>
            </div>
            
            <div className="d-flex align-items-center justify-content-center gap-3">
              <input
                type="number"
                value={manualRating}
                onChange={handleInputChange}
                min="1"
                max="100"
                className={`premium-rating-input ${isAiApplied ? "ai-score-applied" : ""}`}
              />
              <span className="h4 mb-0 ">/ 100</span>
            </div>

            <AnimatePresence>
              {aiResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="ai-suggestion-box mt-4 p-3 rounded-4"
                >
                  <div className="d-flex align-items-center mb-2 text-primary">
                    <i className="fa-solid fa-robot me-2"></i>
                    <small className="fw-bold">AI FIKRI:</small>
                  </div>
                  <div className="ai-message-text text-start">
                    <FormattedTypewriter text={aiResult.message} speed={10} />
                  </div>
                  <div className="text-end mt-2">
                    <small className="text-muted" style={{ fontSize: '10px' }}>
                      <i className="fa-solid fa-wand-magic-sparkles me-1"></i>
                      * AI tomonidan xodimning lavozimi va vazifalari tahlil qilindi
                    </small>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="stars-selection text-center mb-4">
            <div className="stars-grid">
              {[...Array(10)].map((_, index) => (
                <motion.i
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`fastar-large ${index < selectedStars ? "selected" : ""}`}
                  onClick={() => handleStarClick(index)}
                >
                  ★
                </motion.i>
              ))}
            </div>
            <div className="small mt-2">{t("quick_rating_hint")}</div>
          </div>

          <div className="comment-section">
            <label className="d-block small mb-2">{t("detailed_comment_label")}</label>
            <textarea
              className={`premium-textarea ${isCommentEmpty ? "shake-error" : ""}`}
              value={comment}
              placeholder={t("comment_placeholder")}
              onChange={(e) => {
                setComment(e.target.value);
                setIsCommentEmpty(false);
              }}
              rows="4"
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4">
          <Button variant="light" className="px-4 py-2 rounded-pill fw-bold" onClick={() => setShowModal(false)}>
            {t("bekorqilish")}
          </Button>
          <Button variant="primary" className="px-5 py-2 rounded-pill fw-bold shadow-sm" onClick={handleSubmit}>
            {t("send")} <i className="fa-solid fa-paper-plane ms-2"></i>
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="schedulerated">
        {!showModal && (
          <div className="text-center">
            <Button
              className="baholash-wave-btn"
              variant="primary"
              onClick={() => setShowModal(true)}
            >
              {t("baholash")} <i className="fa-regular fa-thumbs-up"></i>
            </Button>
          </div>
        )}


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
