import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchWeather = useCallback(async () => {
    try {
      // Fetch current and daily forecast for Tashkent
      const response = await axios.get(
        'https://api.open-meteo.com/v1/forecast?latitude=41.2995&longitude=69.2401&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto',
        { withCredentials: false }
      );
      
      // TEST UCHUN: Quyidagi qatorni izohdan (comment) chiqaring va xohlagan kodni yozing:
      // 61 = Yomg'ir, 71 = Qor, 95 = Momaqaldiroq
      // response.data.current.weather_code = 95; 

      setWeatherData(response.data);
      setError(null);
    } catch (err) {
      console.error('Weather Context Fetch Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    // Update weather every 15 minutes
    const interval = setInterval(fetchWeather, 900000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const value = {
    weatherData,
    loading,
    error,
    refreshWeather: fetchWeather
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export default WeatherContext;
