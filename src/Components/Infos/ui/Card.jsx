import React, { useEffect, useState } from "react";
import { API } from "../../../config";
import axios from "axios";
import LoadingScreen from "../../Additional/LoadingScreen";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = (timestamp - startTimestamp) / duration;
      if (progress < 1) {
        setCount(Math.floor(value * Math.pow(progress, 0.8)));
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

  return (
    <>
      {loading && <LoadingScreen loading={true} />}
      <div className="row mb-3">
        <div className="col-12 col-md-4">
          <div className="d-flex iconblue statcard align-items-center justify-content-evenly">
            <div className="iconimiz">
              <i className="fa-solid fa-users"></i>
            </div>
            <div className="card-boddy">
              <h1 className="card-title">
                <AnimatedNumber value={stats.employeesCount} />
              </h1>
              <p className="card-text">Xodim tizimda</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="d-flex iconorange statcard align-items-center justify-content-evenly">
            <div className="iconimiz">
              <i className="fa-solid fa-chart-pie"></i>
            </div>
            <div className="card-boddy">
              <h1 className="card-title">
                <AnimatedNumber value={stats.todaySchedulesCount} />
              </h1>
              <p className="card-text">Bugun yozilgan hisobotlar</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="icongreen statcard d-flex align-items-center justify-content-evenly">
            <div className="iconimiz">
              <i className="fa-solid fa-chart-simple"></i>
            </div>
            <div className="card-boddy">
              <h1 className="card-title">
                <AnimatedNumber value={stats.schedulesCount} />
              </h1>
              <p className="card-text">Umumiy hisobotlar</p>
            </div>
          </div>
        </div>
      </div>

    <div className="row">
      <div className="col-6">
        <div className="p-3 statdiv">
          <h5 className="stath1 text-center">Top 10 eng ko`p kundalik hisobotlarni qayd etgan tarkibiy tuzilmalar</h5>
          <BarChart dataset={stats.lengthData} xAxis={[{ scaleType: "band", dataKey: "name", tickPlacement: "middle" }]} yAxis={[{ label: "Jami hisobotlar soni:" }]} series={[{ dataKey: "miqdor", label: "Jami hisobotlar soni:" }]} height={300} sx={{ [`& .${axisClasses.directionY} .${axisClasses.label}`]: { transform: "translateX(-10px)" } }} />
        </div>
      </div>

      <div className="col-6">
      <div className="p-3 statdiv statdiv2">
        <h5 className="stath1 text-center">Kundalik hisobotlarning o`rtacha bahosi bo`yicha top 10 tarkibiy tuzilmalar</h5>
        <BarChart dataset={stats.ratedData} xAxis={[{ scaleType: "band", dataKey: "name", tickPlacement: "middle" }]} yAxis={[{ label: "O`rtacha ball:" }]} series={[{ dataKey: "miqdor", label: "O`rtacha ball:" }]} height={300} sx={{ [`& .${axisClasses.directionY} .${axisClasses.label}`]: { transform: "translateX(-10px)" } }} />
      </div>
      </div>
    </div>

    <div className="row mb-3 mt-3">


        <div className="col-12 col-md-4">
          <div className="d-flex iconyellow statcard align-items-center justify-content-evenly">
            <div className="iconimiz">
              <i className="fa-solid fa-cogs"></i>
            </div>
            <div className="card-boddy">
              <h1 className="card-title">
                <AnimatedNumber value={stats.complexesCount} />
              </h1>
              <p className="card-text">Komplekslar soni</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="d-flex iconred statcard align-items-center justify-content-evenly">
            <div className="iconimiz">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <div className="card-boddy">
              <h1 className="card-title">
                <AnimatedNumber value={stats.sectorsCount} />
              </h1>
              <p className="card-text">Xizmatlar soni</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="d-flex iconpurple statcard align-items-center justify-content-evenly">
            <div className="iconimiz">
              <i className="fa-solid fa-building"></i>
            </div>
            <div className="card-boddy">
              <h1 className="card-title">
                <AnimatedNumber value={stats.sectionsCount} />
              </h1>
              <p className="card-text">Bo`limlar soni</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12 col-md-6">
          <div className="d-flex iconlightblue statcard align-items-center justify-content-evenly">
            <div className="iconimiz">
              <i className="fa-solid redicon fa-file-alt"></i>
            </div>
            <div className="card-boddy">
              <h1 className="card-title">
                <AnimatedNumber value={stats.reportsCount} />
              </h1>
              <p className="card-text">Rahbar bahosiga bo’lgan shikoyatlar</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="d-flex icondarkblue statcard align-items-center justify-content-evenly">
            <div className="iconimiz">
            <i className="fa-solid normativicon fa-volleyball"></i>
            </div>
            <div className="card-boddy">
              <h1 className="card-title">
                <AnimatedNumber value={stats.normativCount} />
              </h1>
              <p className="card-text">Sport normativlari soni</p>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Card;