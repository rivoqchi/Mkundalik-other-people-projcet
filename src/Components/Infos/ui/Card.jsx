import React, { useEffect, useState } from "react";
import { API } from "../../../config";
import axios from "axios";
import LoadingScreen from "../../Additional/LoadingScreen";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

const AnimatedNumber = ({ value, duration = 3000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = (timestamp - startTimestamp) / duration;
      const easedProgress = 1 - Math.pow(1 - Math.min(progress, 1), 3); // ease-out
      if (progress < 1) {
        setCount(Math.floor(value * easedProgress));
        requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <span>{count}</span>;
};

const Card = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    employeesCount: 0,
    schedulesCount: 0,
    todaySchedulesCount: 0,
    sectionsCount: 0,
    sectorsCount: 0,
    complexesCount: 0,
    reportsCount: 0,
    normativCount: 0,
    lengthData: [],
    ratedData: [],
  });

  const getAllStatistics = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/statistics`);
      setStats({
        employeesCount: data.employeesCount,
        schedulesCount: data.schedulesCount,
        todaySchedulesCount: data.todaySchedulesCount,
        sectionsCount: data.sectionsCount,
        sectorsCount: data.sectorsCount,
        complexesCount: data.complexesCount,
        reportsCount: data.reportsCount,
        normativCount: data.normativCount,
        lengthData: data.top10Departments.map((item) => ({
          name: item._id || "Noma'lum",
          miqdor: item.count || 0,
        })),
        ratedData: data.top10RatedDepartments.map((item) => ({
          name: item._id || "Noma'lum",
          miqdor: item.avgRated || 0,
        })),
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllStatistics();
  }, []);

  const statCards = [
    // bu yerda "Jonli statistika" degan h1 ochiladi
    { title: "Xodim tizimda", value: stats.employeesCount, icon: "fa-users", color: "#007bff" },
    { title: "Hisobotlar", value: stats.schedulesCount, icon: "fa-chart-simple", color: "#4caf50" },
    { title: "Bugungi hisobotlar", value: stats.todaySchedulesCount, icon: "fa-chart-pie", color: "#ff9800" },
    // bu yerda bo`linib, tashkiliy tuzilmalar degan h1 ochiladi
    { title: "Komplekslar soni", value: stats.complexesCount, icon: "fa-cogs", color: "#fbc02d" },
    { title: "Xizmatlar soni", value: stats.sectorsCount, icon: "fa-layer-group", color: "#e53935" },
    { title: "Bo`limlar soni", value: stats.sectionsCount, icon: "fa-building", color: "#9c27b0" }
  ];

  return (
    <>
      {loading && <LoadingScreen loading={true} />}
      <div className="modern-stats-container">
        <h1 className="modern-stats-title">Jonli statistika</h1>
        <div className="modern-stats-grid">
          {statCards.slice(0,3).map((item, index) => (
            <div
              key={index}
              className="modern-stats-card"
              style={{ background: `linear-gradient(135deg, ${item.color}90, ${item.color})` }}
            >
              <div className="modern-stats-icon">
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <div className="modern-stats-info">
                <h1><AnimatedNumber value={item.value} /></h1>
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        <h1 className="modern-stats-title">Tashkiliy tuzilmalar</h1>
        <div className="modern-stats-grid">
          {statCards.slice(3).map((item, index) => (
            <div
              key={index}
              className="modern-stats-card"
              style={{ background: `linear-gradient(135deg, ${item.color}90, ${item.color})` }}
            >
              <div className="modern-stats-icon">
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <div className="modern-stats-info">
                <h1><AnimatedNumber value={item.value} /></h1>
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="modern-stats-charts">
          <div className="modern-stats-chart">
            <h4>Top 10 eng ko`p hisobot qayd etgan tarkiblar</h4>
            <BarChart
              dataset={stats.lengthData}
              xAxis={[{ scaleType: "band", dataKey: "name" }]}
              yAxis={[{ label: "Jami hisobotlar" }]}
              series={[{ dataKey: "miqdor", label: "Hisobotlar" }]}
              height={320}
              sx={{
                [`& .${axisClasses.root}`]: { color: "#fff" },
                background: "rgba(255,255,255,0.05)",
                borderRadius: "10px",
                p: 2,
              }}
            />
          </div>

          <div className="modern-stats-chart">
            <h4>O`rtacha bahosi bo`yicha top 10 tarkiblar</h4>
            <BarChart
              dataset={stats.ratedData}
              xAxis={[{ scaleType: "band", dataKey: "name" }]}
              yAxis={[{ label: "O`rtacha ball" }]}
              series={[{ dataKey: "miqdor", label: "Ball" }]}
              height={320}
              sx={{
                [`& .${axisClasses.root}`]: { color: "#fff" },
                background: "rgba(255,255,255,0.05)",
                borderRadius: "10px",
                p: 2,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
