import React, { useState, useEffect } from "react";
import { API } from "../../config";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingScreen from "../Additional/LoadingScreen";

function ScheduleSectionRating() {
  const myId = window.localStorage.getItem("user_id");
  const [mySectionSchedules, setMySectionSchedules] = useState([]);
  const [myData, setMyData] = useState([]);
  const [myRole, setMyRole] = useState([]);
  const id = window.localStorage.getItem("user_id");
  const [loading, setLoading] = useState(false);

  const getMySectionSchedules = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/schedules/getmysection/${myId}`);
      setMySectionSchedules(data.schedules);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getMySectionSchedules();
  }, []);
  const getMyData = async () => {
    const { data } = await axios.get(`${API}/auth/mydata/${id}`);
    setMyData(data.user);
    if (data.user.role === "employee") {
      setMyRole("user");
    } else if (data.user.role === "admin") {
      setMyRole("admin");
    } else if (data.user.role === "superadmin") {
      setMyRole("superadmin");
    } else if (data.user.role === "complex") {
      setMyRole("complex");
    } else if (data.user.role === "department") {
      setMyRole("department");
    } else if (data.user.role === "hr") {
      setMyRole("hr");
    } else if (data.user.role === "boss") {
      setMyRole("boss");
    }
    setLoading(false);

  };
  useEffect(() => {
    getMyData();
  }, []);
  
  return (
    <>
      {loading && <LoadingScreen loading={true} />}

      <h1 className="text-center">Mening bo`limim ko`rsatkichlari</h1>
      <div className="ratedschedulescount d-flex mx-3 justify-content-between">
        <p>Jami: {mySectionSchedules.length}</p>
        <span>Baholadingiz: {mySectionSchedules.filter((item) => item.rated).length}</span>
      </div>
      <div className="scheduleshistory">
        {mySectionSchedules.map((i) => (
          <>
            <Link
              className={`text-decoration-none ${
                i.beginnerId === id ? "disabled-link" : ""
              }`}
              to={
                i.beginnerId === id ? "#" : `/${myRole}/rate/schedule/${i._id}`
              }
              key={i._id}
            >
              <button
                className={`schedulehistorybtn ${
                  !i.rated ? "unrated" : "rated"
                } ${i.beginnerId === id ? "dis" : ""}`}
                disabled={i.beginnerId === id}
              >
                <span className="bold">{i.beginnerName}</span>ning{" "}
                {i.startedAt.slice(0, 10)} da bajargan ishlar hisoboti
                {i.rated && (
                  <span className="yulduzcha">
                    <i className="fa-regular fa-star"></i> {i.rated}
                  </span>
                )}
              </button>
            </Link>
          </>
        ))}
      </div>
    </>
  );
}

export default ScheduleSectionRating;
