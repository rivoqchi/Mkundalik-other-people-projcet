import React, { useEffect, useState } from "react";
import logo from "./Images/logo-png.png"
function CheckBD() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!document.getElementById("checkbd-styles")) {
      const style = document.createElement("style");
      style.id = "checkbd-styles";
      style.innerHTML = `
.cb-overlay{
  position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(rgba(0,0,0,0.28),rgba(0,0,0,0.6));
  z-index:1100;
}
.cb-modal{z-index:1100;
  width:min(760px,92%);background:#fff;border-radius:18px;padding:26px 20px;
  box-shadow:0 20px 60px rgba(0,0,0,0.45);position:relative;overflow:hidden;
  font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial;
  transform: scale(0.8);
  opacity: 0;
  animation: cb-fade-in 0.4s forwards;
}
.cb-header{display:flex;align-items:center;gap:14px;}
.cb-greetings{font-size:14px;margin-bottom:6px;opacity:0.9;}
.cb-title{font-size:26px;font-weight:700;margin:0 0 6px;}
.cb-sub{font-size:15px;margin:0;color:#333;line-height:1.3;}
.cb-confetti-piece{z-index:1110;
  position:absolute;width:10px;height:16px;border-radius:2px;opacity:0.95;
  top:-10%;animation:cb-fall linear forwards;
}
@keyframes cb-fall{
  0%{transform:translateY(-20vh) rotate(0)}
  100%{transform:translateY(120vh) rotate(720deg)}
}
.cb-burst{
  position:absolute;right:-60px;top:-60px;width:300px;height:300px;border-radius:50%;
  background:conic-gradient(rgba(255,200,50,0.12), rgba(60, 122, 255, 0.08), rgba(120,200,255,0.06));
  animation:cb-rotate 12s linear infinite;filter:blur(10px);
}
@keyframes cb-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
.cb-actions{display:flex;gap:10px;margin-top:18px;}
.cb-btn{padding:10px 14px;border-radius:10px;border:0;cursor:pointer;font-weight:600}
.cb-btn--close{background:#f3f4f6;color:#111}
.cb-btn--share{background:#0b79f7;color:white}
.cb-card{display:flex;gap:12px;align-items:center;margin-top:12px}
.cb-avatar{
  width:56px;height:56px;border-radius:12px;background:linear-gradient(135deg,#ffd27a,#ff8ba7);
  display:flex;align-items:center;justify-content:center;font-weight:700;color:#3a1f00
}
.cb-msg{font-size:14px;color:#222}
@media (max-width:520px){ .cb-title{font-size:20px} .cb-sub{font-size:13px} }

@keyframes cb-fade-in {
  to {
    transform: scale(1);
    opacity: 1;
  }
}
      `;
      document.head.appendChild(style);
    }

    const bd = window.localStorage.getItem("bd");
    if (!bd) return;

    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const today = `${mm}-${dd}`;

    if (bd === today) {
      setTimeout(() => setShow(true), 400);
      createConfetti();
    }
  }, []);

  function createConfetti() {
    if (document.querySelectorAll(".cb-confetti-piece").length > 0) return;
    const colors = ["#FF5C7C", "#FFD166", "#06D6A0", "#4CC9F0", "#5e60c2ff", "#FF9F1C"];
    for (let i = 0; i < 36; i++) {
      const el = document.createElement("div");
      el.className = "cb-confetti-piece";
      el.style.left = Math.random() * 100 + "%";
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = 3 + Math.random() * 4 + "s";
      el.style.width = 6 + Math.random() * 12 + "px";
      el.style.height = 14 + Math.random() * 10 + "px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 9000);
    }
  }

  function closeAndRemoveBD() {
    window.localStorage.removeItem("bd");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="cb-overlay">
      <div className="cb-modal">
        <div className="cb-burst"></div>

        <div className="cb-header">
          <div style={{flex:1}}>
            <h2 className="cb-title">Tug'ilgan kuningiz muborak! 🎉</h2>
            <p className="cb-sub">
              Hurmatli <b>{window.localStorage.getItem("fullName")}</b>, <i><b>mkundalik.uz</b></i> jamoasi sizni bugungi bayramingiz bilan tabriklaydi!
              Sizga sog‘lik, baxt va omad tilaymiz.
            </p>
          </div>
          {/* <button className="cb-btn cb-btn--close" onClick={() => setShow(false)}>✕</button> */}
        </div>

        <div className="cb-card">
          <div className="cb-avatar">M</div>
          <div className="cb-msg">
                <img className="bd-logo" src={logo} alt="" />
            <div style={{marginTop:6,fontSize:13,color:"#555"}}>
              Sizga yangi marralar tilaymiz! 🚆💻
            </div>
          </div>
        </div>

        <div className="cb-actions">
          <button
            className="cb-btn cb-btn--share"
            onClick={() => {
              try {
                navigator.share({ title: "Tug'ilgan kunim!", text: "Bugun mening tug'ilgan kunim! 🎉" });
              } catch {
                navigator.clipboard.writeText("Bugun mening tug'ilgan kunim! 🎉");
                alert("Matn nusxalandi!");
              }
            }}
          >
            Bo‘lishish
          </button>
          <button className="cb-btn cb-btn--close" onClick={closeAndRemoveBD}>Yopish</button>
        </div>
      </div>
    </div>
  );
}

export default CheckBD;