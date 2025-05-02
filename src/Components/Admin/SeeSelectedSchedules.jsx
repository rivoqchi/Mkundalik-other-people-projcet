import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API } from "../../config";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import DownloadDocx from "./DownloadDocx";

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};


const getStartDayOfWeek = (month, year) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};
const currentDateTime = format(new Date(), "dd.MM.yyyy HH:mm");
const monthsList = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
];

const weekDays = ["Du", "Se", "Chor", "Pay", "Ju", "Sh", "Ya"];

const CalendarComponent = () => {
const [route, setRoute] = useState(null);

  const myId = window.localStorage.getItem("user_id");
  const [mySectionSchedules, setMySectionSchedules] = useState([]);
  const [mySectionBeginner, setMySectionBeginner] = useState([]);
  const [myData, setMyData] = useState([]);
  const [myRole, setMyRole] = useState([]);
  const id = window.localStorage.getItem("user_id");
  const thescheduleid = useParams();
  const [showTooltip, setShowTooltip] = useState(false);

  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

  const getMySectionSchedules = async () => {
    try {
      const { data } = await axios.get(
        `${API}/schedules/getallbyuserid/${thescheduleid.id}?month=${
          month + 1
        }&year=${year}`
      );
      setMySectionBeginner(data.beginner);
      setMySectionSchedules(data.history);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getMySectionSchedules();
  }, [month, year]);

  const getMyData = async () => {
    const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
    setMyData(data.user);
    setMyRole(data.user.role);
  };

  useEffect(() => {
    getMyData();
  }, []);

  const maxYear = currentDate.getFullYear();
  const maxMonth = currentDate.getMonth();
  const maxDay = currentDate.getDate();

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (month === maxMonth && year === maxYear) return;
    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const daysInMonth = getDaysInMonth(month + 1, year);
  const startDay = getStartDayOfWeek(month, year);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isFutureDay = (day) => {
    return (
      year > maxYear ||
      (year === maxYear && month > maxMonth) ||
      (year === maxYear && month === maxMonth && day > maxDay)
    );
  };

  const getScheduleForDay = (day) => {
    const dayStr = day.toString().padStart(2, "0");
    const monthStr = (month + 1).toString().padStart(2, "0");
    const dateStr = `${dayStr}/${monthStr}/${year}`;
    return mySectionSchedules.find((schedule) =>
      schedule.startedAt.startsWith(dateStr)
    );
  };

  useEffect(() => {
    const role = window.localStorage.getItem("role");
    if (role === "admin") {
      setRoute("/admin");
    } else if (role === "superadmin") {
      setRoute("/superadmin");
    } else if (role === "complex") {
      setRoute("/complex");
    } else if (role === "department") {
      setRoute("/department");
    } else if (role === "hr") {
      setRoute("/hr");
    } else if (role === "boss") {
      setRoute("/boss");
    } else if (role === "commission") {
      setRoute("/commission");
    } else if (role === "staff") {
      setRoute("/staff");
    } else if (role === "at") {
      setRoute("/at");
    } else if (role === "sport") {
      setRoute("/sport");
    } else{
      setRoute("/null");
    }
  }, []);
  return (
    <div className="calendar-container">
      <p className="redword">Eslatma: Ushbu sahifadagi kalendardagi kunlar ranglar orqali belgilangan. Xodim mazkur kunda kundalik hisobot yozgan bo‘lsa — ko‘k rang, baholangan bo‘lsa — yashil rang, hisobot yozilmagan bo‘lsa — qizil rang bilan ajratib ko‘rsatiladi. Xaftaning dam olish kunlari ajratib ko`rsatilgan, (agar) shu kunlarda hisobot yozilsa ham ma'lumotlar saqlanadi.</p>
      <div className="row w-100 align-items-center justify-content-center">
        <div className="col-12 col-md-6 text-center">

          <div
            className="div-container"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button className="calendar-onhover">
              {mySectionBeginner.name}, <i>{mySectionBeginner.degree}</i>
            </button>
            {showTooltip && (
              <div className="calendar-tooltip userdatadiv">
                <p>
                  <i className="fa-solid fa-user-tie"></i>{" "}
                  {mySectionBeginner.name}
                </p>
                <p>
                  <i className="fa-solid fa-address-card"></i>{" "}
                  {mySectionBeginner.degree}
                </p>
                <p>
                  <i className="fa-solid fa-phone-volume"></i>{" "}
                  {mySectionBeginner.phone?.length > 5
                    ? "+998*****" + mySectionBeginner.phone.slice(9, 13)
                    : mySectionBeginner.phone}
                </p>
                <p>
                  <i className="fa-solid fa-briefcase"></i>{" "}
                  {mySectionBeginner.speciality}
                </p>
                <p>
                  <i className="fa-solid fa-users-rectangle"></i>{" "}
                  {mySectionBeginner.complex}
                </p>
                <p>
                  <i className="fa-solid fa-users-line"></i>{" "}
                  {mySectionBeginner.department}
                </p>
                <p>
                  <i className="fa-solid fa-layer-group"></i>{" "}
                  {mySectionBeginner.section}
                </p>
                <p>
                  <i className="fa-solid fa-house"></i>{" "}
                  {mySectionBeginner.address?.length > 5
                    ? mySectionBeginner.address.slice(0, 20) + "*****"
                    : mySectionBeginner.address}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="col-12 col-md-6 text-center">
          <div className="calendar-controls">
            <button onClick={handlePrev} className="calendar-btn">
              ⬅️
            </button>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="calendar-select"
            >
              {Array.from({ length: 10 }).map((_, i) => {
                const y = maxYear - i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>

            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="calendar-select"
            >
              {monthsList.map((m, i) => (
                <option
                  key={i}
                  value={i}
                  disabled={year === maxYear && i > maxMonth}
                >
                  {m}
                </option>
              ))}
            </select>

            <button
              onClick={handleNext}
              className={`calendar-btn ${
                year === maxYear && month === maxMonth
                  ? "calendar-btn-disabled"
                  : ""
              }`}
            >
              ➡️
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-grid calendar-weekdays">
        {weekDays.map((day, index) => (
          <div key={index} className="calendar-weekday-label">
            {day}
          </div>
        ))}
      </div>

      <motion.div layout className="calendar-grid calendar-grid-7">
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="calendar-day-empty"></div>
        ))}
        {days.map((day, index) => {
  const schedule = getScheduleForDay(day);
  const isDisabled = isFutureDay(day);

  let statusColor = "";
  let showDownloadButton = false;

  if (!schedule) {
    statusColor = "calendar-red"; // schedule yo‘q
  } else if (schedule.rated) {
    statusColor = "calendar-green"; // rated bor
    showDownloadButton = true;
  } else if (!schedule.rated) {
    statusColor = "calendar-blue"; // schedule bor, lekin rated yo‘q
    showDownloadButton = true;
  }

  const isWeekend =
    (index + startDay) % 7 === 5 || (index + startDay) % 7 === 6;

  const cellContent = (
    <motion.div
      whileHover={!isDisabled ? { scale: 1.1, rotate: 1 } : {}}
      className={`calendar-day ${
        isDisabled ? "calendar-day-disabled" : ""
      } ${isWeekend ? "weekend-background" : ""}`}
    >
      {day}

      {!isDisabled && <div className={statusColor}></div>}

      {schedule?.ratedName && (
        <div
          className="calendar-rated"
          title={`${schedule.ratedName} tomonidan ${schedule.rated} ball bilan baholangan`}
        >
          <span>{schedule.rated}</span>
        </div>
      )}

      {/* Yuklab olish tugmasi faqat calendar-green yoki calendar-blue uchun */}
      {showDownloadButton && (
        <>
          <Link to={`${route}/archive/schedule/${schedule._id}?download=true`}>
          <button
          className="download-btn"
          onClick={() => console.log(schedule._id)}
        >
          <i class="fa-solid fa-arrow-down"></i>
        </button>
          </Link>
        </>
      )}
    </motion.div>
  );

  return schedule && !isDisabled ? (
    <Link
      key={index}
      to={`${route}/archive/schedule/${schedule._id}`}
      className="calendar-link"
    >
      {cellContent}
    </Link>
  ) : (
    <React.Fragment key={index}>{cellContent}</React.Fragment>
  );
})}
      </motion.div>
    </div>
  );
};

export default CalendarComponent;