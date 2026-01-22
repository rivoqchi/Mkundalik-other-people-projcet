import React, { useMemo } from "react";
import snow from "./Images/snow.png";

const Snowfall = () => {
  // Qor donachalari miqdori (Rasm bo'lgani uchun miqdorini biroz kamaytirsangiz ham chiroyli chiqadi)
  const counts = { sm: 100, md: 40, lg: 20 };

  const snowflakes = useMemo(() => {
    const allSnow = [];
    const createFlakes = (count, sizeClass) => {
      for (let i = 0; i < count; i++) {
        allSnow.push({
          id: `${sizeClass}-${i}`,
          className: `snowflake ${sizeClass}`,
          left: Math.random() * 120 - 20 + "vw",
          blur: Math.random() > 0.8 ? "1px" : "0px", // Ba'zilarida chuqurlik effekti
          flickrDuration: (Math.random() * 20 + 20) / 10 + "s",
          flickrDelay: (Math.random() * 20 / -10) + "s",
          fallDuration: (Math.random() * 100 + 50) / 6 + "s", // Biroz sekinlashtirildi
          fallDelay: (Math.random() * 100 / -5) + "s",
        });
      }
    };

    createFlakes(counts.sm, "_sm");
    createFlakes(counts.md, "_md");
    createFlakes(counts.lg, "_lg");

    return allSnow;
  }, []);

  return (
    <>
      <style>{`
        .snowflake-area {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: 999999;
          pointer-events: none;
        }

        .snowflake {
          position: absolute;
          top: -10vh; /* Ekrandan teparoqdan boshlanadi */
          user-select: none;
          will-change: transform;
        }

        /* Rasm o'lchamlarini boshqarish */
        .snowflake img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* O'lchamlar guruhlari */
        ._sm { width: 10px; opacity: 0.5; }
        ._md { width: 15px; opacity: 0.8; }
        ._lg { width: 30px; opacity: 1; }

        @keyframes flickr {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes fall {
          0% { 
            transform: translate(0, 0) rotate(0deg); 
          }
          100% { 
            /* 20vw shamol effekti beradi */
            transform: translate(15vw, 110vh) rotate(360deg); 
          }
        }
      `}</style>

      <div className="snowflake-area">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className={flake.className}
            style={{
              left: flake.left,
              filter: `blur(${flake.blur})`,
              animation: `
                flickr ${flake.flickrDuration} ${flake.flickrDelay} infinite,
                fall ${flake.fallDuration} ${flake.fallDelay} linear infinite
              `,
            }}
          >
            <img src={snow} alt="snow" />
          </div>
        ))}
      </div>
    </>
  );
};

export default Snowfall;