import React, { useState, useEffect, useRef } from "react";
import { API } from "../../config";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logo from "../Images/logo2.png";
import { format } from "date-fns";

function ScheduleRate() {
  const [thisScheduleHistory, setThisScheduleHistory] = useState([]);
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
    const canvas = await html2canvas(input, { scale: 2 }); // Kattaroq ko‘rinish uchun ko‘lam
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

  const currentUrl = `https://mkundalik.uz/admin/archive/schedule/${thisScheduleHistory._id}`;
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
      navigate('/admin/rating/ours')
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <>
      <div ref={componentRef} className="p-3 hisobot">
        <div className="scheduletepa">
          <div className="align-items-center pt-3 justify-content-between d-flex">
            <img className="schedulelogo" src={logo} alt="logo" />
            <h3 className="px-2">"TOSHKENT METROPOLITENI" DUK</h3>
          </div>
        </div>
        <div className="scheduleshistory">
          <div className="schedulebajaruvchilar">
            <i className="fa-regular fa-user"></i> Hisobotni bajargan xodim:{" "}
            <span>{thisScheduleHistory.beginnerName}</span>
          </div>
          <div className="schedulebajaruvchilar">
            <i className="fa-solid fa-users"></i> Bo`lim:{" "}
            <span>{thisScheduleHistory.section}</span>
          </div>
          <div className="schedulebajaruvchilar">
            <i className="fa-solid fa-circle-play"></i> Ishni boshladi:{" "}
            <span>{thisScheduleHistory.startedAt}</span>
          </div>
          <div className="schedulebajaruvchilar">
            <i className="fa-regular fa-circle-stop"></i> Ishni yakunladi:{" "}
            <span>{thisScheduleHistory.closed}</span>
          </div>
          <br />
          <br />

          <div className="scheduletasks">
            <h5>Bajargan vazifalar:</h5>
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
          <div className="scheduleconfirms text-end m-3">
            Tasdiqlaydi: <span>{thisScheduleHistory.beginnerName}</span>
          </div>

            <div className="schedulerated">
              <h5>Baholang: </h5>
              <div className="rating-container">
      <div className="stars">
        {[...Array(10)].map((_, index) => (
          <i
            key={index}
            className={`fastar ${index < selectedStars ? "selected animate" : ""}`}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => !isFinalized && setSelectedStars(index + 1)}
            onMouseLeave={() => !isFinalized && setSelectedStars(0)}
          >
            ★
          </i>
        ))}
      </div>
      <div className="ratedcount">{thisScheduleHistory.rated || (selectedStars*10)}</div>
      <button onClick={handleSubmit} className="submit-btn">
        Yuborish
      </button>
    </div>
            </div>
          </div>
          <div className="pdfqr">
            <div className="exclamationqr">
              Hujjatning haqiqiyligi admin statusiga ega bo`lgan xodimlar ushbu
              QR kod yordamida tekshirishlari mumkin. <br />
              Hujjat faqatgina{" "}
              <a
                href="http://mkundalik.uz"
                target="_blank"
                rel="noopener noreferrer"
              >
                mkundalik.uz
              </a>{" "}
              saytida taqdim etiladi.
              <div className="current-datetime text-end mt-2">
                {currentDateTime}
              </div>
            </div>
            <div
              className="qr-container"
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              <QRCodeSVG value={currentUrl} size={128} />
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={generatePDF}
        className="pdf-download-btn"
        style={{ margin: "20px 0" }}
      >
        <i className="fa-solid fa-download"></i> PDF yuklab olish
      </button>
    </>
  );
}

export default ScheduleRate;