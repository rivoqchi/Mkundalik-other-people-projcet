import React, { useState, useEffect } from "react";
import { API } from "../../config";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
function RatingMyAdmins() {
  const { t } = useTranslation();
  const myId = window.localStorage.getItem("user_id");
  const [mySectionSchedules, setMySectionSchedules] = useState([]);
  const [myData, setMyData] = useState([]);
  const [myRole, setMyRole] = useState([]);
  const id = window.localStorage.getItem("user_id")

  const getMySectionSchedules = async () => {
    try {
      const { data } = await axios.get(`${API}/schedules/getmysection/complex/${myId}`);
      setMySectionSchedules(data.schedules);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getMySectionSchedules();
  }, []);
  const getMyData = async () =>{
    const {data} = await axios.get(`${API}/auth/mydata/${id}`)
    setMyData(data.user)
    if (data.user.role === 'employee') {
    setMyRole("user")
    }else if (data.user.role === 'admin') {
        setMyRole("admin")
    }else if (data.user.role === 'superadmin') {
      setMyRole("superadmin")
    }else if (data.user.role === 'complex') {
    setMyRole("complex")
    }else if (data.user.role === 'boss') {
      setMyRole("boss")
    }else if (data.user.role === 'commission') {
      setMyRole("commission")
    }
  }
  useEffect(() =>{
    getMyData()
  }, [])
  return (
    <>
      <h1 className="text-center">{t("menbolimkor")}</h1>
      <div className="ratedschedulescount d-flex mx-3 justify-content-between">
        <p>{t("all")}: {mySectionSchedules.length}</p>
        <span>{t("baholangan")}: {mySectionSchedules.filter((item) => item.rated).length}</span>
      </div>

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
              >
                <span className="bold">{i.beginnerName}</span>ning {i.startedAt.slice(0, 10)} {t("dabajarilgan")}
                {i.rated && <span className="yulduzcha"><i className="fa-regular fa-star"></i> {i.rated}</span>}
              </button>
            </Link>
          </>
        ))}
      </div>
    </>
  );
}

export default RatingMyAdmins;
