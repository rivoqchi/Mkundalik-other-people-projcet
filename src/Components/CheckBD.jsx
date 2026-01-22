import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import logo from "./Images/logo-png.png";

const monthNamesUz = [
  "Yanvar","Fevral","Mart","Aprel","May","Iyun",
  "Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"
];

const weekDays = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

function CheckBD() {
  // ✅ HOOKLAR HAR DOIM ENG TEPADA
  const [show, setShow] = useState(false);
  const modalRef = useRef(null);

  const bd = localStorage.getItem("bd");

  // 🎂 Tug‘ilgan kunni tekshirish
  useEffect(() => {
    if (!bd) return;

    const now = new Date();
    const today =
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");

    if (bd === today) {
      setShow(true);
    }
  }, [bd]);

  // 🎉 Confetti faqat modal ochilganda
  useEffect(() => {
    if (!show) return;

const colors = [
    "linear-gradient(135deg,#ff7a7a,#ffd36e)",
    "linear-gradient(135deg,#7afcff,#4cc9f0)",
    "linear-gradient(135deg,#c77dff,#5e60ce)",
    "linear-gradient(135deg,#80ffdb,#48bfe3)",
    "linear-gradient(135deg,#ffd166,#ef476f)"
  ];

  setInterval(() => {
    for (let i = 0; i < 4; i++) { // 🔹 siyrak (har safar 4 ta)
      const el = document.createElement("div");
      el.className = "cb-confetti";
      el.style.left = Math.random() * 100 + "%";
      el.style.animationDuration = 6 + Math.random() * 6 + "s"; // 🔹 sekinroq
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(el);

      setTimeout(() => el.remove(), 15000); // DOM tozalash
    }
  }, 1200); // 🔹 har 1.2 soniyada
  }, [show]);

  // 🎨 Style inject (1 marta)
  useEffect(() => {
    if (document.getElementById("checkbd-liquid")) return;

    const style = document.createElement("style");
    style.id = "checkbd-liquid";
    style.innerHTML = `
.cb-overlay{
  position:fixed;inset:0;
  backdrop-filter: blur(18px);
  background:rgba(0,0,0,.35);
  display:flex;align-items:center;justify-content:center;
  z-index:9999999;
}
.cb-week{
  display:grid;
  grid-template-columns:repeat(7,1fr);
  gap:6px;
  margin-bottom:6px;
}
.cb-week-day{
  text-align:center;
  font-size:11px;
  opacity:.6;
  font-weight:600;
}
.cb-confetti{
  position:fixed;
  top:-30px;
  width:8px;
  height:14px;
  border-radius:6px;
  z-index:9999999;
  opacity:.85;
  animation:confetti-fall linear infinite;
}

@keyframes confetti-fall{
  from{
    transform:translateY(-30px) rotate(0deg);
  }
  to{
    transform:translateY(110vh) rotate(540deg);
  }
}

.cb-modal{
  width:min(860px,94%);
  display:grid;
  grid-template-columns:280px 1fr;
  background:rgba(255,255,255,.65);
  backdrop-filter: blur(30px) saturate(180%);
  border-radius:26px;
  box-shadow:0 40px 120px rgba(0,0,0,.45);
  overflow:hidden;
}
.cb-calendar{
  background:rgba(255,255,255,.45);
  backdrop-filter: blur(18px);
  padding:20px;
}
.cb-cal-title{font-weight:700;font-size:16px;margin-bottom:12px}
.cb-days{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.cb-day{
  background:#fff;
  height:34px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  font-size:13px;
}
.cb-today{background:#0b79f7;color:#fff;font-weight:700}
.cb-content{padding:26px}
.cb-big-date{font-size:72px;font-weight:800}
.cb-month{font-size:20px;opacity:.8;margin-bottom:12px}
.cb-text{font-size:15px;line-height:1.5}
.cb-actions{display:flex;gap:12px;margin-top:20px}
.cb-btn{padding:12px 18px;border-radius:14px;border:0;font-weight:600;cursor:pointer}
.cb-share{background:#0b79f7;color:#fff}
.cb-close{background:#e5e7eb}
@media(max-width:720px){
  .cb-modal{grid-template-columns:1fr}
  .cb-calendar{display:none}
  .cb-big-date{font-size:56px}
}
    `;
    document.head.appendChild(style);
  }, []);

  // ❗ Hooklardan keyin return qilish mumkin
  if (!show || !bd) return null;

  const month = Number(bd.split("-")[0]) - 1;
  const day = Number(bd.split("-")[1]);
  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDayJS = new Date(year, month, 1).getDay();
  const firstDayMonday = (firstDayJS + 6) % 7;

  async function shareImage() {
    const canvas = await html2canvas(modalRef.current);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "birthday.png", { type: "image/png" });
      if (navigator.share) {
        await navigator.share({ files: [file], title: "Tug‘ilgan kunim 🎉" });
      }
    });
  }

  return (
    <div className="cb-overlay">
      <div className="cb-modal" ref={modalRef}>

        {/* LEFT CALENDAR */}
        <div className="cb-calendar">
          <div className="cb-cal-title">{monthNamesUz[month]}</div>

          <div className="cb-week">
            {weekDays.map(d => (
              <div key={d} className="cb-week-day">{d}</div>
            ))}
          </div>

          <div className="cb-days">
            {[...Array(firstDayMonday)].map((_, i) => (
              <div key={"e"+i}></div>
            ))}

            {[...Array(daysInMonth)].map((_, i) => (
              <div
                key={i}
                className={`cb-day ${i + 1 === day ? "cb-today" : ""}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="cb-content">
          <div className="cb-big-date">{day}</div>
          <div className="cb-month">{monthNamesUz[month]}</div>

          <p className="cb-text">
            Hurmatli <b>{localStorage.getItem("fullName")}</b>,  
            <b> mkundalik.uz</b> jamoasi sizni tug‘ilgan kuningiz bilan samimiy tabriklaydi!  
            Sizga sog‘lik, omad va katta yutuqlar tilaymiz <i class="fa-solid fa-ribbon"></i>
          </p>

          <img src={logo} alt="" style={{ width:220, marginTop:10 }} />

          <div className="cb-actions">
            <button className="cb-btn cb-share" onClick={shareImage}>
              Bo‘lishish
            </button>
            <button
              className="cb-btn cb-close"
              onClick={() => {
                setShow(false);
                setTimeout(() => localStorage.removeItem("bd"), 200);
              }}
            >
              Yopish
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CheckBD;
