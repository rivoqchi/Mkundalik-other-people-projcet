import React, { useState, useEffect } from "react";
import { API } from "../../config";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingScreen from "../Additional/LoadingScreen";
import ProgressBar from "react-bootstrap/ProgressBar";

function RatingMyAdmins() {
  const myId = window.localStorage.getItem("user_id");
  const [mySectionSchedules, setMySectionSchedules] = useState([]);
  const [myData, setMyData] = useState([]);
  const [isNZS, setIsNZS] = useState([]);
  const [myRole, setMyRole] = useState([]);
  const id = window.localStorage.getItem("user_id");
  const [loading, setLoading] = useState(false);

  const getMySectionSchedules = async () => {
    setLoading(true);
    try {
      let url = ``;
      let body = {};
  
      if (myRole === "department") {
        url = `${API}/schedules/getmysection/admin/${myId}`;
      } else if (myRole === "admin") {
        url = `${API}/schedules/getmysection/${myId}`;
      } else if (myRole === "complex") {
        url = `${API}/schedules/getmysection/department/${myId}`;
        if (isNZS === true) {
          body.nzs = true;
        }
      }
  
      const { data } = await axios.post(url, body);
      setMySectionSchedules(data.schedules || []); // Agar schedules yo‘q bo‘lsa, bo‘sh massiv qo‘shish
    } catch (error) {
      console.error("Error fetching data:", error);
      setMySectionSchedules([]); // Xatolik bo‘lsa, bo‘sh massiv
    }
    setLoading(false);
  };

  useEffect(() => {
    if (myRole && myId) {
      getMySectionSchedules();
    }
  }, [myRole, myId]); // Faqat myRole va myId mavjud bo‘lganda ishlaydi

  const getMyData = async () => {
    const { data } = await axios.get(`${API}/auth/mydata/${id}`);

    setMyData(data.user);
    if (
      data.user.role === `complex` &&
      data.user.complex === `Kompleks  NZS (Qurilish bo'yicha)`
    ) {
      setIsNZS(true);
    }
    if (data.user.role === "employee") {
      setMyRole("user");
    } else if (data.user.role === "admin") {
      setMyRole("admin");
    } else if (data.user.role === "superadmin") {
      setMyRole("superadmin");
    } else if (data.user.role === "complex") {
      setMyRole("complex");
    } else if (data.user.role === "hr") {
      setMyRole("hr");
    } else if (data.user.role === "department") {
      setMyRole("department");
    } else if (data.user.role === "boss") {
      setMyRole("boss");
    } else if (data.user.role === "commission") {
      setMyRole("commission");
    }
  };
  useEffect(() => {
    getMyData();
  }, []);
  const [greenPercentage, setGreenPercentage] = useState(0);
  const [redPercentage, setRedPercentage] = useState(0);

  useEffect(() => {
    if (Array.isArray(mySectionSchedules)) {
      let green = mySectionSchedules.filter((item) => item.rated).length;
      let red = mySectionSchedules.filter((item) => !item.rated).length;
      let total = green + red;
  
      if (total > 0) {
        let greenPercent = Math.round((green / total) * 100);
        let redPercent = 100 - greenPercent;
        setGreenPercentage(greenPercent);
        setRedPercentage(redPercent);
      } else {
        setGreenPercentage(0);
        setRedPercentage(0);
      }
    }
  }, [mySectionSchedules]);

  return (
    <>
      {loading && <LoadingScreen loading={true} />}
      <h1 className="text-center">Xodimlarim ko`rsatkichlari</h1>
      <div className="stataboutrating">
        <h3 className="text-center blueword">
          Barchasi: <b>{mySectionSchedules.length}</b> ta
        </h3>
        <div className="d-flex justify-content-between">
          <h5 className="successword">
            Baholangan:{" "}
            {mySectionSchedules?.filter((item) => item.rated)?.length || 0}
          </h5>
          <h5 className="redword">
            Baholash kerak:{" "}
            {mySectionSchedules?.filter((item) => !item.rated)?.length || 0}
          </h5>
        </div>
        <ProgressBar style={{ height: "30px" }}>
          <ProgressBar
            label={`${greenPercentage}%`}
            animated
            striped
            variant="success"
            now={greenPercentage}
            key={1}
          />
          <ProgressBar
            label={`${redPercentage}%`}
            animated
            variant="danger"
            now={redPercentage}
            key={2}
          />
        </ProgressBar>
      </div>
      <hr />
      <div className="scheduleshistory">
        {mySectionSchedules.map((i) => (
          <>
            <Link
              className="text-decoration-none"
              to={`/${myRole}/rate/schedule/${i._id}`}
              key={i._id}
            >
              <button
                className={`schedulehistorybtn ${
                  !i.rated ? "unrated" : "rated"
                }`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* Chap tomon: User icon + Beginner Name */}
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="fa-solid fa-user"></i>
                  <span className="bold">{i.beginnerName}</span>
                </span>

                {/* O'ng tomon: StartedAt + Calendar icon + Yulduzcha */}
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>{i.startedAt.slice(0, 10)}</span>
                  {i.rated && (
                    <span
                      className="yulduzcha"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <i className="fa-regular fa-star"></i> {i.rated}
                    </span>
                  )}
                  <i className="fa-solid fa-calendar-days"></i>
                </span>
              </button>
            </Link>
          </>
        ))}
      </div>
    </>
  );
}

export default RatingMyAdmins;
