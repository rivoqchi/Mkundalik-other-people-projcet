import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './Additional/ThemeContext';
import { useWeather } from './Additional/WeatherContext';

const WeatherAside = ({ isMobile = false, onClick }) => {
  const { theme } = useTheme();
  const { weatherData, loading: weatherLoading } = useWeather();
  const isDark = theme === 'dark';

  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPathPrefix = () => {
    const role = window.localStorage.getItem("role");
    if (!role) return "admin";
    
    const rolePathMap = {
      'employee': 'user',
      'staff': 'staff',
      'admin': 'admin',
      'superadmin': 'superadmin',
      'department': 'department',
      'complex': 'complex',
      'boss': 'boss',
      'hr': 'hr',
      'at': 'at',
      'commission': 'commission',
      'sport': 'sport',
      'lang': 'lang'
    };
    
    return rolePathMap[role] || role;
  };

  const handleNavigate = () => {
    const prefix = getPathPrefix();
    navigate(`/${prefix}/weather`);
    if (onClick) onClick();
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return { icon: 'fa-sun', color: '#FFB800', label: 'Musaffo' };
    if (code >= 1 && code <= 3) return { icon: 'fa-cloud-sun', color: '#FFD600', label: 'Bulutli' };
    if (code >= 45 && code <= 48) return { icon: 'fa-smog', color: '#A0AEC0', label: 'Tuman' };
    if (code >= 51 && code <= 67) return { icon: 'fa-cloud-showers-heavy', color: '#4299E1', label: 'Yomg\'ir' };
    if (code >= 71 && code <= 77) return { icon: 'fa-snowflake', color: '#E2E8F0', label: 'Qor' };
    if (code >= 80 && code <= 82) return { icon: 'fa-cloud-rain', color: '#3182CE', label: 'Jala' };
    if (code >= 95) return { icon: 'fa-bolt-lightning', color: '#ED8936', label: 'Momaqaldiroq' };
    return { icon: 'fa-cloud', color: '#718096', label: 'Bulutli' };
  };

  const weather = weatherData?.current;
  const weatherInfo = weather ? getWeatherIcon(weather.weather_code) : { icon: 'fa-spinner fa-spin', color: '#A0AEC0', label: '...' };

  const formattedTime = time.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tashkent'
  });

  const textColor = isDark ? '#FFFFFF' : '#1A202C';
  const subTextColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';

  if (isMobile) {
    return (
      <li className="weather-mobile-li" onClick={handleNavigate}>
        <div className="d-flex align-items-center gap-2 px-3 py-2" style={{ color: textColor, cursor: 'pointer' }}>
          <i className={`fa-solid ${weatherInfo.icon}`} style={{ color: weatherInfo.color, fontSize: '1.1rem' }}></i>
          <span style={{ fontWeight: 600 }}>{weather ? `${Math.round(weather.temperature_2m)}°C` : '...'}</span>
          <span className="ms-auto" style={{ fontSize: '0.85rem', color: subTextColor, fontWeight: 500 }}>{formattedTime}</span>
        </div>
      </li>
    );
  }

  return (
    <motion.div 
      className={`weather-aside-widget ${theme}-mode`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -2 }}
      onClick={handleNavigate}
    >
      <div className="weather-glass-card">
        <div className="time-display" style={{ color: textColor }}>{formattedTime}</div>
        <div className="weather-main">
          <motion.div
            animate={weatherInfo.icon === 'fa-sun' ? { rotate: 360 } : { y: [0, -4, 0] }}
            transition={{ duration: weatherInfo.icon === 'fa-sun' ? 12 : 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <i className={`fa-solid ${weatherInfo.icon} weather-icon-main`} style={{ color: weatherInfo.color }} />
          </motion.div>
          <div className="temp-display" style={{ color: textColor }}>
            {weather ? `${Math.round(weather.temperature_2m)}°C` : '--'}
          </div>
        </div>
        <div className="weather-label" style={{ color: subTextColor }}>{weatherInfo.label}</div>
        <div className="location-label" style={{ color: subTextColor }}>TOSHKENT</div>
      </div>

      <style>{`
        .weather-aside-widget {
          margin: 15px;
          cursor: pointer;
          border-radius: 20px;
          overflow: hidden;
          background: ${isDark ? 'rgba(25, 25, 25, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
          backdrop-filter: blur(25px) saturate(200%);
          -webkit-backdrop-filter: blur(25px) saturate(200%);
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'};
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .weather-aside-widget::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)'}, transparent);
        }
        .weather-glass-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .time-display {
          font-family: 'Inter', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .weather-main {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 6px 0;
        }
        .weather-icon-main {
          font-size: 2rem;
          filter: drop-shadow(0 0 12px rgba(0,0,0,0.1));
        }
        .temp-display {
          font-size: 1.6rem;
          font-weight: 800;
        }
        .weather-label {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .location-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 2px;
          opacity: 0.5;
        }
        .weather-mobile-li {
          border-top: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
        }
        @media (max-width: 768px) {
          .weather-aside-widget {
             margin: 10px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default WeatherAside;
