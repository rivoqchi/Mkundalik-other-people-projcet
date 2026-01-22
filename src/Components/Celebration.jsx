import React, { useState, useRef, useEffect } from "react";
import exampleImg from "./Images/1yosh.jpg";
import logo from "./Images/logo-png.png";
import { useNavigate } from "react-router-dom";

function CelebrationModal({ show, setShow }) {
  const [cong, setCong] = useState(false);
  const navigate = useNavigate();
useEffect(() => {
  const celebration = localStorage.getItem("celebration1y");

  if (celebration === "yes") {
    setCong(false);
  } else {
    localStorage.setItem("celebration1y", "no");
    setCong(true);
  }
}, []);
  useEffect(() => {
    if (!show) return;

    const colors = [
      "linear-gradient(135deg,#ff7a7a,#ffd36e)",
      "linear-gradient(135deg,#7afcff,#4cc9f0)",
      "linear-gradient(135deg,#c77dff,#5e60ce)",
      "linear-gradient(135deg,#80ffdb,#48bfe3)",
      "linear-gradient(135deg,#ffd166,#ef476f)"
    ];

    const interval = setInterval(() => {
      for (let i = 0; i < 4; i++) {
        const el = document.createElement("div");
        el.className = "cb-confetti";
        el.style.left = Math.random() * 100 + "%";
        el.style.animationDuration = 6 + Math.random() * 6 + "s";
        el.style.background =
          colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 15000);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [show]);
  // STYLE INJECTION
  useEffect(() => {
    if (document.getElementById("celebration-style")) return;
    const style = document.createElement("style");
    style.id = "celebration-style";
    style.innerHTML = `

      .cb-overlay{
        position:fixed; inset:0;
        backdrop-filter: blur(18px);
        background:rgba(0,0,0,.35);
        display:flex; align-items:center; justify-content:center;
        z-index:9999999;
      }
      .cb-confetti{
        position:fixed; top:-30px;
        width:8px; height:14px;
        border-radius:6px; opacity:.85;
        animation:confetti-fall linear infinite;
      }
      @keyframes confetti-fall{
        from{transform:translateY(-30px) rotate(0deg)}
        to{transform:translateY(110vh) rotate(540deg)}
      }
      .cb-modal{
  width:min(720px,94%);
  background:rgba(255,255,255,.65);
  backdrop-filter: blur(30px) saturate(180%);
  border-radius:26px;
  box-shadow:0 40px 120px rgba(0,0,0,.45);
  overflow:hidden;
}

      .cb-left{
        background:rgba(255,255,255,.45);
        backdrop-filter: blur(18px);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
      }
      .cb-left img{
        max-width:100%;
        border-radius:18px;
      }
      .cb-content{padding:0px}
      .cb-content2{padding:20px}
      .cb-header{font-size:28px;font-weight:800;margin-bottom:10px}
      .cb-title{font-size:16px;opacity:.85;margin-bottom:16px}
      .cb-100k{font-size:36px;font-weight:900;margin:8px 0;color:red;animation:cb-pulse 1.5s ease-out 4s 1 forwards}
      @keyframes cb-pulse{0%{transform:scale(1);}50%{transform:scale(1.1);}100%{transform:scale(1);}}
      .cb-text{font-size:15px;line-height:1.6}
      .cb-footer{margin-top:24px;display:flex;justify-content:space-between;align-items:center}
      .cb-close{padding:12px 20px;border-radius:14px;border:0;font-weight:600;cursor:pointer;background:#e5e7eb}
      @media(max-width:720px){.cb-modal{grid-template-columns:1fr}.cb-left{display:none}}
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <>
      {cong && (
        <div className="yosh1">
                  <img
          src={exampleImg}
          alt="1 yoshda"
          className="cb-trigger-img"
          onClick={() => setShow(true)}
        /><i
  className="fa-solid fa-xmark"
  onClick={() => {
    localStorage.setItem("celebration1y", "yes");
    setCong(false);
  }}
></i>

        </div>
      )}

      {show && (
        <div className="cb-overlay">
          <div className="cb-modal">
            <div className="cb-content">
              {/* <div className="cb-header">
                Hurmatli hamkasblar! <i className="fa-solid fa-ribbon"></i>
              </div> */}
                <img className="w-100" src={exampleImg} alt="100k" />
              <div className="cb-content2">
                <div className="cb-title">
                Mazkur tizim 2025-yil 21-yanvardan boshlab
                <b> “Axborot xavfsizligini ta’minlash va AKTni rivojlantirish xizmati”</b>da
                sinov tariqasida ishga tushirilgan.
              </div>
              <p className="cb-text">
                Hurmatli <b>{localStorage.getItem("fullName") || "foydalanuvchi"}</b>,
                ushbu natija tizimdan samarali foydalanish natijasidir.
              </p>
              <div className="cb-footer">
                <img src={logo} alt="logo" style={{ width:120 }} />
                <button
                  className="cb-close"
                  onClick={() => {
                    localStorage.setItem("celebration1y", "yes");
                    setShow(false);
                    setCong(false);
                    // setTimeout(handleNavigateDetails, 300);
                  }}
                >
                  Yopish
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CelebrationModal;