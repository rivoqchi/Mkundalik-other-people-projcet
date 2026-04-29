import React, { useMemo } from "react";
import snowImg from "./Images/snow.png";
import { useWeather } from "./Additional/WeatherContext";

const Atmosphere = () => {
  const { weatherData, loading } = useWeather();
  const snowSetting = window.localStorage.getItem("snow");

  // If animations are turned off in settings, return null
  // Note: snowSetting is stored as "true"/"false" string
  // If null (first time), we assume it's true (ON)
  if (snowSetting === "false") return null;
  if (loading || !weatherData) return null;

  const weatherCode = weatherData.current.weather_code;

  // Determine atmospheric condition
  const isSnowing = (weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86);
  const isRaining = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82) || (weatherCode >= 95);

  if (!isSnowing && !isRaining) return null;

  return (
    <>
      <style>{`
        .atmosphere-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: 9999;
          pointer-events: none;
        }

        /* --- SNOW STYLES --- */
        .snowflake {
          position: absolute;
          top: -10vh;
          user-select: none;
          will-change: transform;
        }
        .snowflake img { width: 100%; height: auto; display: block; }
        ._sm { width: 10px; opacity: 0.5; }
        ._md { width: 15px; opacity: 0.8; }
        ._lg { width: 30px; opacity: 1; }

        @keyframes flickr {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fall_snow {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(15vw, 110vh) rotate(360deg); }
        }

        /* --- RAIN STYLES --- */
        .rain-drop {
          position: absolute;
          background-color: rgba(174, 194, 224, 0.5);
          width: 1.5px;
          height: 60px;
          top: -80px;
          will-change: transform;
        }
        @keyframes fall_rain {
          to { transform: translateY(120vh); }
        }
        
        /* Thunder screen flash */
        @keyframes thunder_flash {
          0% { background: transparent; }
          1% { background: rgba(255, 255, 255, 0.1); }
          2% { background: transparent; }
          10% { background: rgba(255, 255, 255, 0.05); }
          12% { background: transparent; }
        }
        .thunder-active {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          animation: thunder_flash 8s infinite;
          z-index: 9998;
          pointer-events: none;
        }
      `}</style>

      <div className="atmosphere-container">
        {isSnowing && <Snowfall />}
        {isRaining && <Rainfall intensity={weatherCode >= 80 ? 'heavy' : 'light'} />}
      </div>
      {weatherCode >= 95 && <div className="thunder-active" />}
    </>
  );
};

const Snowfall = () => {
  const counts = { sm: 80, md: 30, lg: 15 };
  const snowflakes = useMemo(() => {
    const allSnow = [];
    const createFlakes = (count, sizeClass) => {
      for (let i = 0; i < count; i++) {
        allSnow.push({
          id: `${sizeClass}-${i}`,
          className: `snowflake ${sizeClass}`,
          left: Math.random() * 120 - 20 + "vw",
          blur: Math.random() > 0.8 ? "1px" : "0px",
          flickrDuration: (Math.random() * 20 + 20) / 10 + "s",
          flickrDelay: (Math.random() * 20 / -10) + "s",
          fallDuration: (Math.random() * 100 + 50) / 6 + "s",
          fallDelay: (Math.random() * 100 / -5) + "s",
        });
      }
    };
    createFlakes(counts.sm, "_sm");
    createFlakes(counts.md, "_md");
    createFlakes(counts.lg, "_lg");
    return allSnow;
  }, []);

  return snowflakes.map((flake) => (
    <div
      key={flake.id}
      className={flake.className}
      style={{
        left: flake.left,
        filter: `blur(${flake.blur})`,
        animation: `
          flickr ${flake.flickrDuration} ${flake.flickrDelay} infinite,
          fall_snow ${flake.fallDuration} ${flake.fallDelay} linear infinite
        `,
      }}
    >
      <img src={snowImg} alt="snow" />
    </div>
  ));
};

const Rainfall = ({ intensity = 'light' }) => {
  const dropCount = intensity === 'heavy' ? 120 : 60;
  const drops = useMemo(() => {
    const allDrops = [];
    for (let i = 0; i < dropCount; i++) {
      allDrops.push({
        id: i,
        left: Math.random() * 100 + "vw",
        fallDuration: (0.5 + Math.random() * 0.3) + "s",
        fallDelay: Math.random() * 2 + "s",
        opacity: 0.2 + Math.random() * 0.3
      });
    }
    return allDrops;
  }, [intensity]);

  return drops.map((drop) => (
    <div
      key={drop.id}
      className="rain-drop"
      style={{
        left: drop.left,
        opacity: drop.opacity,
        animation: `fall_rain ${drop.fallDuration} ${drop.fallDelay} linear infinite`
      }}
    />
  ));
};

export default Atmosphere;
