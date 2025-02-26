import React, { useEffect, useState } from "react";
import { API } from "../../../config";
import axios from "axios";
import LoadingScreen from "../../Additional/LoadingScreen";

const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = (timestamp - startTimestamp) / duration;
      if (progress < 1) {
        setCount(Math.floor(value * Math.pow(progress, 0.8))); // `ease-out` effekti
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
  const [todaySchedulesCount, setTodaySchedulesCount] = useState(0);
  const [schedulesCount, setSchedulesCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);

  const getAllStatistics = async () => {
    setLoading(true);
    const { data } = await axios.get(`${API}/statistics/getall`);
    setEmployeesCount(data.employeesCount);
    setSchedulesCount(data.schedulesCount);
    setTodaySchedulesCount(data.todaySchedulesCount);
    setLoading(false);
  };

  useEffect(() => {
    getAllStatistics();
  }, []);

  return (
    <>
      {loading && <LoadingScreen loading={true} />}
      <div className="row">
        <div className="card iconblue statcard p-2 col-12 col-md-3 m-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="iconimiz">
              <i className="fa-solid fa-users"></i>
            </div>
            <div className="card-boddy">
              <h3 className="card-title">
                <AnimatedNumber value={employeesCount} />
              </h3>
              <p className="card-text">Xodim tizimda</p>
            </div>
          </div>
        </div>

        <div className="card iconorange statcard p-2 col-12 col-md-3 m-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="iconimiz">
              <i className="fa-solid fa-chart-pie"></i>
            </div>
            <div className="card-boddy">
              <h3 className="card-title">
                <AnimatedNumber value={todaySchedulesCount} />
              </h3>
              <p className="card-text">Bugun yozilgan hisobotlar</p>
            </div>
          </div>
        </div>

        <div className="card icongreen statcard p-2 col-12 col-md-3 m-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="iconimiz">
              <i className="fa-solid fa-chart-simple"></i>
            </div>
            <div className="card-boddy">
              <h3 className="card-title">
                <AnimatedNumber value={schedulesCount} />
              </h3>
              <p className="card-text">Umumiy hisobotlar</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;