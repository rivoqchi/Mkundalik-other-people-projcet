import React, { useState, useEffect } from "react";
import { API } from "../../config";
import axios from "axios";
import { Link } from "react-router-dom";
function ScheduleSectionRating() {
  const myId = window.localStorage.getItem("user_id");
  const [mySectionSchedules, setMySectionSchedules] = useState([]);
  console.log(mySectionSchedules);

  const getMySectionSchedules = async () => {
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
  return (
    <>
      <h1 className="text-center">Mening bo`limim ko`rsatgichlari</h1>
      <div className="scheduleshistory">
        {mySectionSchedules.map((i) => (
          <>
            <Link
              className="text-decoration-none"
              to={`/admin/rate/schedule/${i._id}`}
              key={i._id}
            >
              <button
                className={`schedulehistorybtn ${
                  !i.rated ? "unrated" : "rated"
                }`}
              >
                <span className="bold">{i.beginnerName}</span>ning {i.startedAt.slice(0, 10)} da bajargan ishlar hisoboti
                {i.rated && <span className="yulduzcha"><i class="fa-regular fa-star"></i> {i.rated}</span>}
              </button>
            </Link>
          </>
        ))}
      </div>
    </>
  );
}

export default ScheduleSectionRating;
