import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './Additional/ThemeContext';
import { useWeather } from './Additional/WeatherContext';

const WeatherMoreInfo = () => {
  const { theme } = useTheme();
  const { weatherData, loading } = useWeather();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const getWeatherMapping = (code) => {
    if (code === 0) return { icon: 'fa-sun', color: '#FFB800', label: 'Musaffo osmon', accent: '#FF9933' };
    if (code >= 1 && code <= 3) return { icon: 'fa-cloud-sun', color: '#FFD600', label: 'Qisman bulutli', accent: '#5D9FFF' };
    if (code >= 45 && code <= 48) return { icon: 'fa-smog', color: '#A0AEC0', label: 'Tumanli', accent: '#757F9A' };
    if (code >= 51 && code <= 67) return { icon: 'fa-cloud-showers-heavy', color: '#4299E1', label: 'Yomg\'irli', accent: '#2a5298' };
    if (code >= 71 && code <= 77) return { icon: 'fa-snowflake', color: '#E2E8F0', label: 'Qor yog\'ishi', accent: '#83a4d4' };
    if (code >= 80 && code <= 82) return { icon: 'fa-cloud-rain', color: '#3182CE', label: 'Kuchli yomg\'ir', accent: '#4b6cb7' };
    if (code >= 95) return { icon: 'fa-bolt-lightning', color: '#ED8936', label: 'Momaqaldiroq', accent: '#2c5364' };
    return { icon: 'fa-cloud', color: '#718096', label: 'Bulutli', accent: '#3E5151' };
  };

  const current = weatherData?.current;
  
  const mapping = getWeatherMapping(current?.weather_code);

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    const names = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    return names[date.getDay()];
  };

  if (loading || !weatherData) {
    return (
      <div className="weather-loader-container" style={{ background: isDark ? '#0F172A' : '#F8FAFC' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <i className="fa-solid fa-sun text-warning" style={{ fontSize: '4rem' }}></i>
        </motion.div>
        <p className={`mt-4 font-weight-bold ${isDark ? 'text-white' : 'text-dark'}`}>Yuklanmoqda...</p>
      </div>
    );
  }

  const textColor = isDark ? '#FFFFFF' : '#1E293B';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.5)';
  const glassBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)';

  return (
    <div className={`weather-detailed-page ${theme}-mode`}>
      {/* Liquid Background Blobs */}
      <div className="liquid-container">
        <motion.div 
          className="blob blob-1" 
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }} 
          transition={{ duration: 15, repeat: Infinity }}
          style={{ background: mapping.accent }}
        />
        <motion.div 
          className="blob blob-2" 
          animate={{ x: [0, -120, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }} 
          transition={{ duration: 18, repeat: Infinity }}
          style={{ background: isDark ? '#4F46E5' : '#818CF8' }}
        />
        <motion.div 
          className="blob blob-3" 
          animate={{ x: [0, 50, 0], y: [0, 100, 0], scale: [1, 1.1, 1] }} 
          transition={{ duration: 20, repeat: Infinity }}
          style={{ background: isDark ? '#7C3AED' : '#A78BFA' }}
        />
      </div>

      <div className="content-wrapper">
        <motion.button 
          className="back-btn-ios"
          onClick={() => navigate(-1)}
          whileHover={{ x: -10 }}
          style={{ background: cardBg, color: textColor, border: `1px solid ${glassBorder}` }}
        >
          <i className="fa-solid fa-chevron-left me-2"></i> Orqaga
        </motion.button>

        <div className="weather-header-ios">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="main-info-card"
            style={{ background: cardBg, borderColor: glassBorder }}
          >
            <div className="info-left">
              <motion.i 
                className={`fa-solid ${mapping.icon} condition-icon`}
                style={{ color: mapping.color }}
                animate={mapping.icon === 'fa-sun' ? { rotate: 360 } : { y: [0, -15, 0] }}
                transition={{ duration: mapping.icon === 'fa-sun' ? 25 : 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="temp-hero" style={{ color: textColor }}>
                {Math.round(current?.temperature_2m)}°
              </div>
            </div>
            <div className="info-right">
              <h1 style={{ color: textColor }}>Toshkent</h1>
              <p className="condition-txt" style={{ color: mapping.color }}>{mapping.label}</p>
              <p className="date-txt" style={{ color: textColor, opacity: 0.7 }}>
                {new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="stats-grid-ios">
          <DetailTile icon="fa-droplet" label="Namlik" value={`${current?.relative_humidity_2m}%`} theme={theme} color="#0EA5E9" />
          <DetailTile icon="fa-wind" label="Shamol" value={`${current?.wind_speed_10m} km/s`} theme={theme} color="#10B981" />
          <DetailTile icon="fa-temperature-half" label="His etiladi" value={`${Math.round(current?.apparent_temperature)}°`} theme={theme} color="#F59E0B" />
          <DetailTile icon="fa-cloud-rain" label="Yog'ingarchilik" value={`${current?.precipitation} mm`} theme={theme} color="#6366F1" />
        </div>

        <div className="forecast-container-ios">
          <h3 style={{ color: textColor }}>7 kunlik prognoz</h3>
          <div className="forecast-list">
            {weatherData?.daily?.time.map((time, idx) => {
              const dayMapping = getWeatherMapping(weatherData.daily.weather_code[idx]);
              return (
                <motion.div 
                  key={time}
                  className="forecast-item-ios"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ background: cardBg, borderColor: glassBorder }}
                >
                  <p className="day-label" style={{ color: textColor }}>{idx === 0 ? 'Bugun' : getDayName(time)}</p>
                  <i className={`fa-solid ${dayMapping.icon} day-icon`} style={{ color: dayMapping.color }}></i>
                  <div className="day-temps">
                    <span className="max" style={{ color: textColor }}>{Math.round(weatherData.daily.temperature_2m_max[idx])}°</span>
                    <span className="min" style={{ color: textColor, opacity: 0.5 }}>{Math.round(weatherData.daily.temperature_2m_min[idx])}°</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .weather-detailed-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;
          background: ${isDark ? '#020617' : '#F1F5F9'};
          padding: 60px 20px;
          font-family: 'Outfit', 'Inter', sans-serif;
        }
        .liquid-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          filter: blur(80px);
          opacity: ${isDark ? 0.4 : 0.3};
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          width: 500px;
          height: 500px;
        }
        .blob-1 { top: -100px; right: -100px; }
        .blob-2 { bottom: -100px; left: -100px; }
        .blob-3 { top: 40%; left: 30%; width: 300px; height: 300px; }
        
        .content-wrapper {
          position: relative;
          z-index: 10;
          max-width: 900px;
          margin: 0 auto;
        }
        .back-btn-ios {
          display: flex;
          align-items: center;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 600;
          margin-bottom: 30px;
          backdrop-filter: blur(20px);
          transition: all 0.3s;
        }
        .main-info-card {
          display: flex;
          align-items: center;
          gap: 50px;
          padding: 50px;
          border-radius: 40px;
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid;
          margin-bottom: 40px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }
        .info-left {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .condition-icon {
          font-size: 8rem;
          margin-bottom: 10px;
          filter: drop-shadow(0 0 30px rgba(255,255,255,0.2));
        }
        .temp-hero {
          font-size: 6rem;
          font-weight: 800;
          line-height: 1;
        }
        .info-right h1 {
          font-size: 3.5rem;
          font-weight: 900;
          margin: 0;
          letter-spacing: -1px;
        }
        .condition-txt {
          font-size: 2rem;
          font-weight: 700;
          margin: 10px 0;
        }
        .date-txt {
          font-size: 1.2rem;
          font-weight: 500;
        }
        .stats-grid-ios {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 50px;
        }
        .tile-ios {
          padding: 24px;
          border-radius: 30px;
          backdrop-filter: blur(30px);
          border: 1px solid;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: transform 0.3s ease;
        }
        .tile-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }
        .tile-data label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          opacity: 0.6;
        }
        .tile-data span {
          font-size: 1.3rem;
          font-weight: 800;
        }
        .forecast-container-ios h3 {
          font-weight: 800;
          margin-bottom: 25px;
          padding-left: 10px;
        }
        .forecast-list {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 12px;
          margin-top: 10px;
        }
        .forecast-item-ios {
          padding: 15px 5px;
          border-radius: 20px;
          text-align: center;
          backdrop-filter: blur(25px);
          border: 1px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          min-height: 150px;
        }
        .day-label {
          font-weight: 700;
          font-size: 0.8rem;
          margin-bottom: 10px;
          white-space: nowrap;
        }
        .day-icon {
          font-size: 1.8rem;
          margin-bottom: 10px;
        }
        .day-temps {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-weight: 800;
          font-size: 1rem;
        }
        .weather-loader-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 900px) {
          .forecast-list {
            display: flex;
            overflow-x: auto;
            gap: 15px;
            padding-bottom: 20px;
          }
          .forecast-item-ios {
            min-width: 110px;
          }
        }
        @media (max-width: 768px) {
          .main-info-card {
            flex-direction: column;
            gap: 20px;
            padding: 30px;
            text-align: center;
          }
          .condition-icon { font-size: 5rem; }
          .temp-hero { font-size: 4rem; }
          .info-right h1 { font-size: 2.5rem; }
          .condition-txt { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

const DetailTile = ({ icon, label, value, theme, color }) => {
  const isDark = theme === 'dark';
  return (
    <motion.div 
      className="tile-ios" 
      whileHover={{ y: -5, scale: 1.02 }}
      style={{ 
        background: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.4)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)'
      }}
    >
      <div className="tile-icon-box" style={{ background: `${color}20`, color: color }}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="tile-data">
        <label style={{ color: isDark ? '#FFF' : '#000' }}>{label}</label>
        <span style={{ color: isDark ? '#FFF' : '#000' }}>{value}</span>
      </div>
    </motion.div>
  );
};

export default WeatherMoreInfo;
