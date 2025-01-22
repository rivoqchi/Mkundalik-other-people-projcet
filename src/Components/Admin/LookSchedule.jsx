import React, { useState, useEffect, useRef } from "react";
import { API } from "../../config";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logo from "../Images/logo2.png";
import { format } from "date-fns";

function LookSchedule() {
  const [thisScheduleHistory, setThisScheduleHistory] = useState([]);
  const { id } = useParams();
  const componentRef = useRef();

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

  return (
    <>
      <div ref={componentRef} className="p-3 hisobot">
        <div className="scheduletepa">
          <div className="align-items-center pt-3 d-flex">
            <img className="schedulelogo" src={logo} alt="logo" />
            <h5 className="px-2 bluecolor">"TOSHKENT <br/>METROPOLITENI" DUK</h5>
          </div>
        </div>
        <h4 className="text-center m-3">Xodimning kundalik ishlarni qayd etganligi haqida hisobot</h4>
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
            <div className="schedulerated d-flex justify-content-between">
              <h5>Baholangan: </h5>
              <span>
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

export default LookSchedule;