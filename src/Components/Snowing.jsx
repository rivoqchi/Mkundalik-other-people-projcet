import React, { useEffect } from "react";

export default function Snowing() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .snow-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 99999;
        overflow: hidden;
      }

      .snow {
        position: absolute;
        top: -10px;
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
        opacity: 0.8;
        animation-name: fall;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }

      @keyframes fall {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(110vh);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const stopSnow = localStorage.getItem("stop-snow") === "true";
  const snowflakes = stopSnow ? [] : Array.from({ length: 80 });

  return (
    <div className="snow-container">
      {snowflakes.map((_, i) => (
        <span
          key={i}
          className="snow"
          style={{
            left: Math.random() * 100 + "vw",
            animationDuration: 5 + Math.random() * 10 + "s",
            animationDelay: Math.random() * 5 + "s",
            opacity: Math.random(),
            width: 3 + Math.random() * 5 + "px",
            height: 3 + Math.random() * 5 + "px",
          }}
        />
      ))}
    </div>
  );
}