import React, { useEffect, useState } from "react";
import { API } from "../../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../Additional/LoadingScreen";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import * as echarts from "echarts";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";

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

// Info Tooltip Component
const InfoIcon = ({ text }) => (
  <OverlayTrigger
    placement="top"
    overlay={<Tooltip className="stat-tooltip">{text}</Tooltip>}
  >
    <i className="fa-solid fa-circle-info info-icon"></i>
  </OverlayTrigger>
);

const Card = () => {
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const [showAllWriters, setShowAllWriters] = useState(false);
  const hasRole = localStorage.getItem("role");
  const [stats, setStats] = useState({
    employeesCount: 0,
    employeesWithTelegramCount: 0,
    schedulesCount: 0,
    todaySchedulesCount: 0,
    sectionsCount: 0,
    sectorsCount: 0,
    complexesCount: 0,
    normativCount: 0,
    top10Departments: [],
    top10RatedDepartments: [],
    departmentActivityRate: [],
    educationStats: {
      "O'rta-maxsus": 0,
      "Tugallanmagan Oliy": 0,
      "Oliy (Bakalavr)": 0,
      "Oliy (Magistr)": 0,
      Boshqa: 0,
    },
    ageGroupStats: {
      "18-25": 0,
      "26-40": 0,
      "41-60": 0,
      "61+": 0,
      "Noma'lum": 0,
    },
    top10ScheduleWriters: [],
    top10ReportWriters: [],
    lengthData: [],
    ratedData: [],
  });

  const getAllStatistics = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/statistics`);
      setStats({
        employeesCount: data.employeesCount || 0,
        employeesWithTelegramCount: data.employeesWithTelegramCount || 0,
        schedulesCount: data.schedulesCount || 0,
        todaySchedulesCount: data.todaySchedulesCount || 0,
        sectionsCount: data.sectionsCount || 0,
        sectorsCount: data.sectorsCount || 0,
        complexesCount: data.complexesCount || 0,
        normativCount: data.normativCount || 0,
        top10Departments: data.top10Departments || [],
        top10RatedDepartments: data.top10RatedDepartments || [],
        departmentActivityRate: data.departmentActivityRate || [],
        educationStats: data.educationStats || {
          "O'rta-maxsus": 0,
          "Tugallanmagan Oliy": 0,
          "Oliy (Bakalavr)": 0,
          "Oliy (Magistr)": 0,
          Boshqa: 0,
        },
        ageGroupStats: data.ageGroupStats || {
          "18-25": 0,
          "26-40": 0,
          "41-60": 0,
          "61+": 0,
          "Noma'lum": 0,
        },
        top10ScheduleWriters: data.top10ScheduleWriters || [],
        top10ReportWriters: data.top10ReportWriters || [],
        lengthData: (data.top10Departments || []).map((item) => ({
          name: item._id || "Noma'lum",
          miqdor: item.count || 0,
        })),
        ratedData: (data.top10RatedDepartments || []).map((item) => ({
          name: item._id || "Noma'lum",
          miqdor: item.avgRated || 0,
        })),
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllStatistics();
  }, []);

  const statCards = [
    // bu yerda "Jonli statistika" degan h1 ochiladi
    {
      title: "Xodim tizimda",
      value: stats.employeesCount,
      icon: "fa-users",
      color: "#007bff",
    },
    {
      title: "Hisobotlar",
      value: stats.schedulesCount,
      icon: "fa-chart-simple",
      color: "#4caf50",
    },
    {
      title: "Bugungi hisobotlar",
      value: stats.todaySchedulesCount,
      icon: "fa-chart-pie",
      color: "#ff9800",
    },
    // bu yerda bo`linib, tashkiliy tuzilmalar degan h1 ochiladi
    {
      title: "Komplekslar soni",
      value: stats.complexesCount,
      icon: "fa-cogs",
      color: "#fbc02d",
    },
    {
      title: "Xizmatlar soni",
      value: stats.sectorsCount,
      icon: "fa-layer-group",
      color: "#e53935",
    },
    {
      title: "Bo`limlar soni",
      value: stats.sectionsCount,
      icon: "fa-building",
      color: "#9c27b0",
    },
  ];

  // PieChart uchun useEffect
  useEffect(() => {
  if (!Array.isArray(stats?.ageGroupStats)) return;

  const chartDom = document.getElementById("ageGroupPie");
  if (!chartDom) return;

  const myChart = echarts.init(chartDom);

  const ageLabels = {
    18: "18–25 yosh",
    26: "26–40 yosh",
    41: "41–60 yosh",
    61: "61+ yosh",
    "Noma'lum": "Noma'lum"
  };

  const pieData = stats.ageGroupStats.map(item => ({
    value: item.count,
    name: ageLabels[item._id] || item._id
  }));

  const option = {
    tooltip: { trigger: "item" },
    legend: { top: "5%", left: "center" },
    series: [
      {
        name: "Yosh guruhlari",
        type: "pie",
        radius: ["40%", "70%"],
        data: pieData
      }
    ]
  };

  myChart.setOption(option);

  const handleResize = () => myChart.resize();
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    myChart.dispose();
  };
}, [stats]);


  useEffect(() => {
  if (!Array.isArray(stats?.educationStats)) return;

  const chartDom = document.getElementById("educationRose");
  if (!chartDom) return;

  const myChart = echarts.init(chartDom);

  const educationData = stats.educationStats.map(item => ({
    value: item.count,
    name: item._id || "Noma'lum"
  }));

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b} <br/>{c} ({d}%)"
    },
    legend: {
      left: "center",
      top: "bottom",
      textStyle: { fontSize: 12 }
    },
    series: [
      {
        name: "Ta'lim darajasi",
        type: "pie",
        radius: [30, 110],
        center: ["50%", "45%"],
        roseType: "radius",
        itemStyle: { borderRadius: 5 },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14
          }
        },
        data: educationData
      }
    ]
  };

  myChart.setOption(option);

  const handleResize = () => myChart.resize();
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    myChart.dispose();
  };
}, [stats]);


  // Department Activity Rate Chart uchun useEffect
  useEffect(() => {
    if (!stats.departmentActivityRate || stats.departmentActivityRate.length === 0) return;
    
    const chartDom = document.getElementById('activityRateChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b} <br/>{c}'
      },
      xAxis: {
        type: 'category',
        data: stats.departmentActivityRate.map(item => item.department.substring(0, 15)),
        axisLabel: {
          interval: 0,
          rotate: 45,
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '3%',
        top: '10%',
        bottom: '20%',
        containLabel: true
      },
      series: [
        {
          data: stats.departmentActivityRate.map(item => item.activityRate),
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(102, 126, 234, 0.1)'
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ])
          }
        }
      ]
    };
    
    myChart.setOption(option);
    
    const handleResize = () => myChart.resize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [stats.departmentActivityRate]);

  // Top 10 Departments Chart uchun useEffect
  useEffect(() => {
    if (!stats.top10Departments || stats.top10Departments.length === 0) return;
    
    const chartDom = document.getElementById('top10DepartmentsChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b} <br/>{c} hisobot'
      },
      xAxis: {
        type: 'category',
        data: stats.top10Departments.map(item => item._id.substring(0, 12)),
        axisLabel: {
          interval: 0,
          rotate: 45,
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '3%',
        top: '10%',
        bottom: '20%',
        containLabel: true
      },
      series: [
        {
          data: stats.top10Departments.map(item => item.count),
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(102, 126, 234, 0.1)'
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ])
          }
        }
      ]
    };
    
    myChart.setOption(option);
    
    const handleResize = () => myChart.resize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [stats.top10Departments]);

  // Top 10 Rated Departments Chart uchun useEffect
  useEffect(() => {
    if (!stats.top10RatedDepartments || stats.top10RatedDepartments.length === 0) return;
    
    const chartDom = document.getElementById('top10RatedChart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b} <br/>{c} ⭐'
      },
      xAxis: {
        type: 'category',
        data: stats.top10RatedDepartments.map(item => item._id.substring(0, 12)),
        axisLabel: {
          interval: 0,
          rotate: 45,
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '3%',
        top: '10%',
        bottom: '20%',
        containLabel: true
      },
      series: [
        {
          data: stats.top10RatedDepartments.map(item => item.avgRated),
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(102, 126, 234, 0.1)'
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ])
          }
        }
      ]
    };
    
    myChart.setOption(option);
    
    const handleResize = () => myChart.resize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [stats.top10RatedDepartments]);

  return (
    <>
      <div className="row g-4 m-3">
        <div className="col-12 col-md-4">
          <div className="boxx">
            <p className="stat-title">
              <i className="fa-solid fa-caret-right"></i> Tizimdagi xodimlar
              <InfoIcon text="Tizimda ro'yxatdan o'tgan faol xodimlar soni" />
            </p>
            <div className="stat-content">
              <div className="stat-count"><AnimatedNumber value={stats.employeesCount} duration={5000} /></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="boxx">
            <p className="stat-title">
              <i className="fa-solid fa-caret-right"></i> Hisobotlar
              <InfoIcon text="Tizimga joylashtirilgan jami elektron hisobotlar soni" />
            </p>
            <div className="stat-content">
              <div className="stat-count"><AnimatedNumber value={stats.schedulesCount} duration={5000} /></div>
              <br />
              <p>Bugun yozildi:</p>
              <br />
              <div className="stat-todaywroten">
                <AnimatedNumber value={stats.todaySchedulesCount} duration={5000} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4" style={{ position: "relative" }}>
          {!hasRole && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 50
            }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#764ba2";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 24px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#667eea";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
                }}
              >
                Tizimga kiring
              </button>
            </div>
          )}
          <div className="boxx" style={{ filter: !hasRole ? "blur(5px)" : "none", pointerEvents: !hasRole ? "none" : "auto" }}>
            <p className="stat-title">
              <i className="fa-solid fa-caret-right"></i> Yosh guruhlari
              <InfoIcon text="Xodimlarning yosh bo'yicha taqsimoti" />
            </p>
            <div className="stat-content">
              <div
                id="ageGroupPie"
                style={{ width: "100%", height: "350px" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4 m-3">
        <div className="col-12 col-md-4" style={{ position: "relative" }}>
          {!hasRole && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 50
            }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#764ba2";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 24px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#667eea";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
                }}
              >
                Tizimga kiring
              </button>
            </div>
          )}
          <div className="boxx" style={{ filter: !hasRole ? "blur(5px)" : "none", pointerEvents: !hasRole ? "none" : "auto" }}>
            <p className="stat-title">
              <i className="fa-solid fa-caret-right"></i> Eng ishchan xodimlar
              <InfoIcon text="Eng ko'p elektron hisobot yozgan xodimlar" />
            </p>
            <div className="stat-slider-wrapper">
              <div className="stat-slider">
                {[...stats.top10ScheduleWriters, ...stats.top10ScheduleWriters].map((item, index) => (
                  <div key={index} className="stat-slider-item">
                    <div className="slider-item-content">
                      <span className="stat-slider-rank">{(index % stats.top10ScheduleWriters.length) + 1}</span>
                      <span className="stat-slider-name">{item.name}</span>
                    </div>
                    <div className="stat-slider-count">
                      {item.scheduleCount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="view-all-btn" onClick={() => setShowAllWriters(true)}>
              Barchasini ko'rish <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="col-12 col-md-4" style={{ position: "relative" }}>
          {!hasRole && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 50
            }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#764ba2";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 24px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#667eea";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
                }}
              >
                Tizimga kiring
              </button>
            </div>
          )}
          <div className="boxx" style={{ filter: !hasRole ? "blur(5px)" : "none", pointerEvents: !hasRole ? "none" : "auto" }}>
            <p className="stat-title">
              <i className="fa-solid fa-caret-right"></i> Tashkiliy tuzilmalar
              <InfoIcon text="Metropolitenning tashkiliy tuzilmasi: komplekslar, xizmatlar va bo'limlar soni" />
            </p>
            <div className="org-structure">
              <div className="org-item">
                <div className="org-icon"><i className="fa-solid fa-building-columns"></i></div>
                <div className="org-text">
                  <div className="org-label">Komplekslar</div>
                  <div className="org-value"><AnimatedNumber value={stats.complexesCount} duration={5000} /></div>
                </div>
              </div>
              <div className="org-item">
                <div className="org-icon"><i className="fa-solid fa-network-wired"></i></div>
                <div className="org-text">
                  <div className="org-label">Tarkibiy tuzilmalar</div>
                  <div className="org-value"><AnimatedNumber value={stats.sectorsCount} duration={5000} /></div>
                </div>
              </div>
              <div className="org-item">
                <div className="org-icon"><i className="fa-solid fa-sitemap"></i></div>
                <div className="org-text">
                  <div className="org-label">Bo'limlar</div>
                  <div className="org-value"><AnimatedNumber value={stats.sectionsCount} duration={5000} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4" style={{ position: "relative" }}>
          {!hasRole && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 50
            }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#764ba2";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 24px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#667eea";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
                }}
              >
                Tizimga kiring
              </button>
            </div>
          )}
          <div className="boxx" style={{ filter: !hasRole ? "blur(5px)" : "none", pointerEvents: !hasRole ? "none" : "auto" }}>
            <p className="stat-title">
              <i className="fa-solid fa-caret-right"></i> Ta'lim darajasi
              <InfoIcon text="Xodimlarning ta'lim darajasi bo'yicha taqsimoti" />
            </p>
            <div className="stat-content">
              <div
                id="educationRose"
                style={{ width: "100%", height: "350px" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4 m-3">
        <div className="col-12 col-md-4" style={{ position: "relative" }}>
          {!hasRole && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 50
            }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#764ba2";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 24px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#667eea";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
                }}
              >
                Tizimga kiring
              </button>
            </div>
          )}
          <div className="boxx" style={{ filter: !hasRole ? "blur(5px)" : "none", pointerEvents: !hasRole ? "none" : "auto" }}>
            <p className="stat-title">
              <i className="fa-solid fa-caret-right"></i> Xizmatlar kesimida hisobot yozish faolligi
              <InfoIcon text="Xizmatlar bo'yicha xodim sonidan kelib chiqqan holda elektron hisobot yozish intizomi reytinggi" />
            </p>
            <div className="stat-content">
              <div
                id="activityRateChart"
                style={{ width: "100%", height: "350px" }}
              ></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4" style={{ position: "relative" }}>
          {!hasRole && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 50
            }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#764ba2";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 24px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#667eea";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
                }}
              >
                Tizimga kiring
              </button>
            </div>
          )}
          <div className="boxx" style={{ filter: !hasRole ? "blur(5px)" : "none", pointerEvents: !hasRole ? "none" : "auto" }}>
            <p className="stat-title">
              <i className="fa-solid fa-caret-right"></i> Top 10 eng ko`p hisobot qayd etgan tarkiblar
              <InfoIcon text="Eng ko'p elektron hisobot yozilgan xizmatlar" />
            </p>
            <div className="stat-content">
              <div
                id="top10DepartmentsChart"
                style={{ width: "100%", height: "350px" }}
              ></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4" style={{ position: "relative" }}>
          {!hasRole && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 50
            }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "12px 28px",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#764ba2";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 24px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#667eea";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
                }}
              >
                Tizimga kiring
              </button>
            </div>
          )}
          <div className="boxx" style={{ filter: !hasRole ? "blur(5px)" : "none", pointerEvents: !hasRole ? "none" : "auto" }}>
            <p className="stat-title">
              <i className="fa-solid fa-caret-right"></i> O`rtacha qo`yilgan bahosi bo`yicha Top 10 tarkiblar
              <InfoIcon text="Eng yuqori reytingga ega xizmatlar" />
            </p>
            <div className="stat-content">
              <div
                id="top10RatedChart"
                style={{ width: "100%", height: "350px" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal uchun */}
      <Modal show={showAllWriters} onHide={() => setShowAllWriters(false)} size="lg" centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>Eng Ishchan Xodimlar (Top 10)</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <div className="all-writers-list">
            {stats.top10ScheduleWriters.map((item, index) => (
              <div key={index} className="writer-card">
                <div className="writer-rank">{index + 1}</div>
                <div className="writer-info">
                  <h5 className="writer-name">{item.name}</h5>
                  <p className="writer-dept">{item.department}</p>
                </div>
                <div className="writer-stats">
                  <span className="writer-count">{item.scheduleCount}</span>
                  <span className="writer-label">hisobot</span>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Card;
