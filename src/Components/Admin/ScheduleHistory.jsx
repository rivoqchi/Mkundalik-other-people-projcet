import React, { useState, useEffect } from "react";
import { API } from "../../config";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingScreen from "../Additional/LoadingScreen";
import { useTranslation } from "react-i18next";


function SchduleHistory() {
  const { t } = useTranslation();
  const myId = window.localStorage.getItem("user_id");
  const [myScheduleHistory, setMyScheduleHistory] = useState([]);
    const [myRole, setMyRole] = useState([])
      const [loading, setLoading] = useState(false);
  
    const getMyData = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
        setMyRole(data.user.role);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };  
    useEffect(() => {
      getMyData();
    }, []);

  const getMyScheduleHistory = async () => {
    try {
      const { data } = await axios.get(`${API}/schedules/getmyhistory/${myId}`);
      setMyScheduleHistory(data.history);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getMyScheduleHistory();
  }, []);
  let address = "";
  if(myRole === "admin"){
    address = "admin"
  }else if(myRole === "employee"){
    address = "user"
  }else if(myRole === "hr"){
    address = "hr"
  }else if(myRole === "superadmin"){
    address = "superadmin"
  }else if(myRole === "complex"){
    address = "complex"
  }else if(myRole === "department"){
    address = "department"
  }else if(myRole === "boss"){
    address = "boss"
  }else if(myRole === "commission"){
    address = "commission"
  }else if(myRole === "sport"){
    address = "sport"
  }else if(myRole === "at"){
    address = "at"
  }
  
  return (
    <>
      {loading && <LoadingScreen loading={true} />}

      <h1 className="text-center">{t("kundaliktarixim")}</h1>
      <div className="ratedschedulescount d-flex mx-3 justify-content-between">
        <p>{t("jami")}: {myScheduleHistory.length}</p>
        <span>{t("baholangan")}: {myScheduleHistory.filter((item) => item.rated).length}</span>
      </div>
      <div className="scheduleshistory">
        {myScheduleHistory.map((i) => (
          <>
            {/* Link disabled qilish uchun onClick event ishlatamiz */}
            <Link
              className="text-decoration-none"
              to={`/${address}/archive/schedule/${i._id}`}
              key={i._id}
              onClick={(e) => {
                if (!i.closed) {
                  e.preventDefault();
                }
              }}
            >
              <button
                disabled={!i.closed} // Agar i.closed bo'lmasa, button disabled bo'ladi
                className={`schedulehistorybtn ${
                  !i.closed ? "uncompletedschedule" : "completed"
                }`}
              >
                {i.startedAt.slice(0, 10)} {t("dabajarilgan")}
                {i.rated && <span className="yulduzcha"><i className="fa-regular fa-star"></i> {i.rated}</span>}
              </button>
            </Link>
          </>
        ))}
      </div>
    </>
  );
}

export default SchduleHistory;
