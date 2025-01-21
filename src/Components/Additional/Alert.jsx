import React, { useEffect, useState } from "react";

function Alert({ type = "success", message }) {
  const [alert, setAlert] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => setAlert(false), 5000);
    const interval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 2 : 0));
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {alert && (
        <div
          className={`alert alert-${type}`}
          style={{ position: "relative", overflow: "hidden" }}
        >
          <div
            onClick={() => setAlert(false)}
            className="alert-close"
            style={{ position: "absolute", top: "5px", right: "10px", cursor: "pointer" }}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
          {message || "Success!!"}
          <div
            style={{
              height: "5px",
              background: "#fff",
              position: "absolute",
              bottom: "0",
              left: "0",
              width: `${progress}%`,
              transition: "width 0.1s linear",
            }}
          ></div>
        </div>
      )}
    </>
  );
}

export default Alert;