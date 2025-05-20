import React, { useState, useEffect, useRef } from "react";
import { API } from "../../config";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logo from "../Images/logo2.png";
import { format } from "date-fns";
import LoadingScreen from "../Additional/LoadingScreen";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "../Additional/Alert";
function ScheduleRate() {
  const myId = window.localStorage.getItem("user_id");
  const myFullName = window.localStorage.getItem("fullName");
  const [myData, setMyData] = useState([]);
  const [myRole, setMyRole] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [thisScheduleHistory, setReportSchedule] = useState([]);
  const [report, setReport] = useState([]);
  const [checking, setChecking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [degree, setMyDegree] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (thisScheduleHistory.reported) {
        setAlert({ show: true, type: "error", message: "Siz e'tiroz bildirib bo`lgansiz!", });
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
        `${API}/commission/getbyid/${id}`
      );
      setReport(data.report);
      setReportSchedule(data.report.schedule);
      
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

    pdf.save("hisobot.pdf");
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
        handleClose()
      } catch (error) {
        setAlert({ show: true, type: "error", message: "Xatolik yuz berdi!" });
      }
    }
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
  };

  let lavozimegasi = thisScheduleHistory.beginnerId;
  useEffect(() => {
    if (thisScheduleHistory?.beginnerId) {
      getMyDegree(thisScheduleHistory.beginnerId);
    }
  }, [thisScheduleHistory]);

  const getMyDegree = async (beginnerId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/auth/getlavozim/${beginnerId}`);
      setMyDegree(data.degree);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching degree:", error);
    }
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      {loading && <LoadingScreen loading={true} />}

      <div ref={componentRef} className="hisobot">
        <div className="scheduleshistory">
          <div className="scheduletepa">
          </div>
          <div className="scheduleinfo">
            <div className="schedulebajaruvchilar">
              <i className="fa-regular fa-user"></i> Ҳисоботни бажарган ходим:{" "}
              <span>{thisScheduleHistory.beginnerName}</span>
            </div>
            <div className="schedulebajaruvchilar">
              <i className="fa-regular fa-user"></i> Ҳисоботни текширган ходим:{" "}
              <span>{thisScheduleHistory.ratedName}</span>
            </div>
            <div className="schedulebajaruvchilar">
              <i className="fa-solid fa-building-ngo"></i> Комплекс:{" "}
              <span>{thisScheduleHistory.complex}</span>
            </div>
            <div className="schedulebajaruvchilar">
              <i className="fa-solid fa-users-viewfinder"></i> Ташкилий тузилма:{" "}
              <span>{thisScheduleHistory.department}</span>
            </div>
            <div className="schedulebajaruvchilar">
              <i className="fa-solid fa-users"></i> Бўлим:{" "}
              <span>{thisScheduleHistory.section}</span>
            </div>
            <div className="schedulebajaruvchilar">
              <i className="fa-solid fa-file-contract"></i> Лавозими:{" "}
              <span>{degree || "Ma'lumot topilmadi"}</span>
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
            <h3 className="text-center redword px-2">E'tiroz tafsilotlari</h3>

            {/* checkpoint */}
            <div className="schedulerated">
              <div className="justify-content-between d-flex">
                <h5>
                  {thisScheduleHistory?.rated ? (
                    thisScheduleHistory.ratedName ? (
                      <>
                        <b>{thisScheduleHistory.ratedName}</b> томонидан
                        баҳоланди:
                      </>
                    ) : (
                      "Баҳоланган"
                    )
                  ) : (
                    "Баҳоланмаган"
                  )}
                </h5>
                <span className="rateschhh">
                  {thisScheduleHistory.rated ? (
                    <div className="align-items-center redback justify-content-center">
                      <i className="fa-regular fa-star"></i>
                      {thisScheduleHistory.rated}
                      {"/100"}
                    </div>
                  ) : (
                    "Ma'lumot topilmadi"
                  )}
                </span>
              </div>
            </div>

            {/* checkpoint */}
            {thisScheduleHistory.comment && (
              <div className="commentsch align-items-center justify-content-between d-flex">
                <div className="">
                  <b>Baholovchi fikri:</b> {thisScheduleHistory.comment}
                </div>
              </div>
            )}
            {report.message && (
              <div className="commentsch redback align-items-center justify-content-between d-flex">
                <div className="redback p-3 text-light">
                  <b>E'tiroz matni:</b> {report.message}
                </div>
              </div>
            )}
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

      <Modal size="lg" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Baholash natijalariga e'tiroz bildirish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>{thisScheduleHistory.ratedName}</b> tomonidan qo`yilgan bahoga
          e'tiroz bildiryapsiz. Ushbu masala tegishli komissiya a'zolariga
          yetkazilishi uchun holatni batafsil bayon qiling:
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
            Yopish
          </Button>
          <Button variant="danger" onClick={(e) => handleReport(e)}>
            E’tiroz Bildirish
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ScheduleRate;
