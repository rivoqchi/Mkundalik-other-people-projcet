import React, { useState, useEffect } from "react";
import { API } from "../../config";
import axios from "axios";
import { Link } from "react-router-dom";
function SchduleHistory() {
  const myId = window.localStorage.getItem("user_id");
  const [myScheduleHistory, setMyScheduleHistory] = useState([]);
  console.log(myScheduleHistory);
    const [myRole, setMyRole] = useState([])
    const getMyData = async () => {
      try {
        const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
        console.log(data);
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
  }
  return (
    <>
      <h1 className="text-center">Kundalik ish faoliyatlarim tarixi</h1>
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
                {i.startedAt.slice(0, 10)} da bajarilgan ishlar hisoboti
                {i.rated && <span className="yulduzcha"><i class="fa-regular fa-star"></i> {i.rated}</span>}
              </button>
            </Link>
          </>
        ))}
      </div>
    </>
  );
}

export default SchduleHistory;
