import React, { useEffect, useState, useRef } from "react";
import { API } from "../../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../Additional/LoadingScreen";
import * as echarts from "echarts";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTheme } from "../../Additional/ThemeContext";
import { useTranslation } from "react-i18next";

const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = (timestamp - startTimestamp) / duration;
      const easedProgress = 1 - Math.pow(1 - Math.min(progress, 1), 3);
      if (progress < 1) {
        setCount(Math.floor(value * easedProgress));
        requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <span>{count.toLocaleString()}</span>;
};

const InfoIcon = ({ text }) => (
  <OverlayTrigger
    placement="top"
    overlay={<Tooltip className="stat-tooltip-premium">{text}</Tooltip>}
  >
    <i className="fa-solid fa-circle-info info-icon-premium"></i>
  </OverlayTrigger>
);

const Card = () => {
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    employeesCount: 0,
    schedulesCount: 0,
    todaySchedulesCount: 0,
    sectionsCount: 0,
    sectorsCount: 0,
    complexesCount: 0,
    ageGroupStats: [],
    educationStats: [],
    departmentActivityRate: [],
    top10Departments: [],
    top10RatedDepartments: [],
    top10ScheduleWriters: []
  });

  const chartRefs = {
    age: useRef(null),
    education: useRef(null),
    activity: useRef(null),
    topDepts: useRef(null),
    topRated: useRef(null)
  };

  const getStats = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/statistics`);
      setStats({
        employeesCount: data.employeesCount || 0,
        schedulesCount: data.schedulesCount || 0,
        todaySchedulesCount: data.todaySchedulesCount || 0,
        sectionsCount: data.sectionsCount || 0,
        sectorsCount: data.sectorsCount || 0,
        complexesCount: data.complexesCount || 0,
        ageGroupStats: data.ageGroupStats || [],
        educationStats: data.educationStats || [],
        departmentActivityRate: data.departmentActivityRate || [],
        top10Departments: data.top10Departments || [],
        top10RatedDepartments: data.top10RatedDepartments || [],
        top10ScheduleWriters: data.top10ScheduleWriters || []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  const initChart = (ref, option) => {
    if (!ref.current) return;
    const isDark = theme === 'dark';
    const chart = echarts.init(ref.current, isDark ? 'dark' : null);
    chart.setOption({
      ...option,
      backgroundColor: 'transparent',
      textStyle: {
        color: isDark ? '#cbd5e1' : '#334155',
        fontFamily: 'Inter, system-ui, sans-serif'
      }
    });
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      chart.dispose();
    };
  };

  useEffect(() => {
    if (stats.ageGroupStats.length > 0) {
      const ageLabels = { 18: "18–25", 26: "26–40", 41: "41–60", 61: "61+", "Noma'lum": "Noma'lum" };
      const option = {
        tooltip: { trigger: 'item' },
        legend: { bottom: '5%', left: 'center', textStyle: { color: 'inherit' } },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: 'transparent', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
          data: stats.ageGroupStats.map(d => ({ value: d.count, name: ageLabels[d._id] || d._id }))
        }]
      };
      return initChart(chartRefs.age, option);
    }
  }, [stats.ageGroupStats, theme]);

  useEffect(() => {
    if (stats.educationStats.length > 0) {
      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: [20, 100],
          roseType: 'area',
          itemStyle: { borderRadius: 8 },
          data: stats.educationStats.map(d => ({ value: d.count, name: d._id || "Noma'lum" }))
        }]
      };
      return initChart(chartRefs.education, option);
    }
  }, [stats.educationStats, theme]);

  useEffect(() => {
    if (stats.departmentActivityRate.length > 0) {
      const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
        xAxis: { type: 'category', data: stats.departmentActivityRate.map(d => d.department.substring(0, 10) + '...'), axisLabel: { rotate: 45 } },
        yAxis: { type: 'value' },
        series: [{
          data: stats.departmentActivityRate.map(d => d.activityRate),
          type: 'bar',
          itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#3b82f6' }, { offset: 1, color: '#6366f1' }]) }
        }]
      };
      return initChart(chartRefs.activity, option);
    }
  }, [stats.departmentActivityRate, theme]);

  return (
    <div className="stats-premium-redesign">
      <div className="container-fluid">
        <button className="premium-back-btn" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i> {t("back")}
        </button>

        <div className="stats-top-grid">
          <div className="stat-main-card">
            <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
            <div className="stat-info">
              <span className="label">Jami xodimlar <InfoIcon text="Tizimda ro'yxatdan o'tgan faol xodimlar" /></span>
              <h2 className="value"><AnimatedNumber value={stats.employeesCount} /></h2>
            </div>
            <div className="stat-progress" style={{ width: '65%' }}></div>
          </div>

          <div className="stat-main-card">
            <div className="stat-icon purple"><i className="fa-solid fa-file-invoice"></i></div>
            <div className="stat-info">
              <span className="label">Jami hisobotlar <InfoIcon text="Barcha davrlar uchun jami hisobotlar" /></span>
              <h2 className="value"><AnimatedNumber value={stats.schedulesCount} /></h2>
            </div>
            <div className="stat-footer-meta">Bugun: <strong>{stats.todaySchedulesCount}</strong></div>
          </div>

          <div className="stat-main-card">
            <div className="stat-icon orange"><i className="fa-solid fa-sitemap"></i></div>
            <div className="stat-info">
              <span className="label">Tashkiliy tuzilmalar <InfoIcon text="Komplekslar, Xizmatlar, Bo'limlar" /></span>
              <h2 className="value">
                <span className="sub-val" title="Komplekslar">{stats.complexesCount}</span> /
                <span className="sub-val" title="Xizmatlar">{stats.sectorsCount}</span> /
                <span className="sub-val" title="Bo'limlar">{stats.sectionsCount}</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="stats-charts-grid">
          <div className="premium-chart-card">
            <h3><i className="fa-solid fa-pie-chart"></i> Yosh guruhlari</h3>
            <div className="chart-container" ref={chartRefs.age}></div>
          </div>

          <div className="premium-chart-card">
            <h3><i className="fa-solid fa-graduation-cap"></i> Ta'lim darajasi</h3>
            <div className="chart-container" ref={chartRefs.education}></div>
          </div>

          <div className="premium-chart-card wide">
            <h3><i className="fa-solid fa-chart-line"></i> Xizmatlar faolligi</h3>
            <div className="chart-container" ref={chartRefs.activity}></div>
          </div>
        </div>

        <div className="stats-tables-grid">
          <div className="premium-table-card">
            <h3><i className="fa-solid fa-trophy"></i> Eng faol xodimlar</h3>
            <div className="active-writers-list">
              {stats.top10ScheduleWriters.slice(0, 5).map((w, i) => (
                <div key={i} className="writer-item">
                  <div className="writer-rank">{i + 1}</div>
                  <div className="writer-name">{w.name}</div>
                  <div className="writer-count">{w.scheduleCount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
