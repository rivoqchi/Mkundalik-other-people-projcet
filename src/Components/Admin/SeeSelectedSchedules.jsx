import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API } from "../../config";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import DownloadDocx from "./DownloadDocx";
import { useTranslation } from "react-i18next";
import { Modal, Button } from "react-bootstrap";
import AllSchedulesDownload from "../SuperAdmin/AllSchedulesDownload";
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
const { t } = useTranslation();

  const [route, setRoute] = useState(null);
  const [holidays, setHolidays] = useState([]);
  console.log(useParams());
  
  const myId = useParams().id;
  const [mySectionSchedules, setMySectionSchedules] = useState([]);
  const [mySectionBeginner, setMySectionBeginner] = useState([]);
  const [myData, setMyData] = useState([]);
  const [myRole, setMyRole] = useState([]);
  const id = window.localStorage.getItem("user_id");
  const thescheduleid = useParams();
  const [showTooltip, setShowTooltip] = useState(false);
  const [bsDates, setBsDates] = useState([]);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalSabab, setModalSabab] = useState("");

  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

const checkBs = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/bs/check/${myId}`);
      console.log("✅ checkBs response:", data);

      if (data.message === "Found") {
        setBsDates(data.bsList);
      } else {
        setBsDates([]);
      }

    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  };

  const getHolidays = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/holiday/get`);
      if (data.message === "Found") {
        setHolidays(data.holidays);
      } else {
        setHolidays([]);
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  // ✅ useEffect ichida muntazam chaqirish
  useEffect(() => {
    if (!myId) return;

    // Dastlab sahifa ochilganda bir marta chaqiriladi
    checkBs();
    getHolidays();

    // So‘ng 30 soniyada bir marta qayta chaqiriladi
    const interval = setInterval(() => {
      checkBs();
      getHolidays();
    }, 30000);

    // Komponent unmount bo‘lganda intervalni to‘xtatamiz
    return () => clearInterval(interval);
  }, [myId]);

  const getMySectionSchedules = async () => {
    // try {
    //   const { data } = await axios.get(`${API}/schedules/getmyhistory/${myId}`);
    //   setMyScheduleHistory(data.history);
    //   console.log(data);
      
    //   setLoading(false);
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }

    try {
      const { data } = await axios.get(
        `${API}/schedules/getallbyuserid/${myId}?month=${
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

  const isBsDay = (day) => {
    const currentDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bsDates.some(bs => {
      const start = new Date(bs.startDate);
      const end = new Date(bs.endDate);
      const current = new Date(currentDateStr);
      return current >= start && current <= end;
    });
  };

  const isHolidayDay = (day) => {
    const currentDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return holidays.some(hol => hol.holiday === currentDateStr);
  };

  useEffect(() => {
    const role = window.localStorage.getItem("role");
    if (role === "admin") {
      setRoute("/admin");
    } else if (role === "employee") {
      setRoute("/user");
    } else if (role === "superadmin") {
      setRoute("/superadmin");
    } else if (role === "complex") {
      setRoute("/complex");
    } else if (role === "department") {
      setRoute("/department");
    } else if (role === "hr") {
      setRoute("/hr");
    } else if (role === "lang") {
      setRoute("/lang");
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

  const handleDayClick = (day) => {
    const currentDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // Check if BS kuni
    const bsMatch = bsDates.find(bs => {
      const start = new Date(bs.startDate);
      const end = new Date(bs.endDate);
      const current = new Date(currentDateStr);
      return current >= start && current <= end;
    });

    // Check if Holiday kuni
    const holidayMatch = holidays.find(hol => hol.holiday === currentDateStr);

    if (bsMatch) {
      setModalSabab(`🕒 ${bsMatch.sabab} (${bsMatch.startDate} — ${bsMatch.endDate})`);
      setShowInfoModal(true);
    } else if (holidayMatch) {
      setModalSabab(`🎉 ${holidayMatch.sabab} (${holidayMatch.holiday})`);
      setShowInfoModal(true);
    }
  };

  return (
    <div className="calendar-container def-page">
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
            <i className="fa-solid fa-arrow-left"></i>
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
              <i className="fa-solid fa-arrow-right"></i>
            </button>
            <AllSchedulesDownload employee={myId} />
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

  if (isBsDay(day)) {
    statusColor = "calendar-black"; // BS oralig‘idagi kunlar uchun qora status
  } else if (isHolidayDay(day)) {
    statusColor = "calendar-black"; // holiday kunlar uchun qora status
  } else if (!schedule) {
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

  const currentBs = bsDates.find(bs => {
    const start = new Date(bs.startDate);
    const end = new Date(bs.endDate);
    const current = new Date(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    return current >= start && current <= end;
  });

  const sababMap = {
    "У": t("oquvtatilida"),
    "БС": t("administrativruxsat"),
    "БЛ": t("mehnatgalayoqatsiz"),
    "ОТ": t("mehnattatilida"),
    "УВ": t("mehnatyakunlangan"),
    "К": t("ishsafarida")
  };

  const cellContent = (
    <motion.div
      whileHover={(isBsDay(day) || isHolidayDay(day)) ? { scale: 1.1, rotate: 1 } : {}}
      onClick={() => {
        if (isBsDay(day) || isHolidayDay(day)) handleDayClick(day);
      }}
      title={
        isBsDay(day) && currentBs
          ? `${sababMap[currentBs.sabab] || currentBs.sabab} (${currentBs.startDate} — ${currentBs.endDate})`
          : ""
      }
      className={`calendar-day 
    ${(!isBsDay(day) && !isHolidayDay(day) && isDisabled) ? "calendar-day-disabled" : ""} 
    ${(isWeekend || isHolidayDay(day)) ? "weekend-background" : ""} 
    ${isBsDay(day) ? "calendar-gray" : ""}`}
    >
      {day}

      {!isDisabled && <div className={statusColor}></div>}

{/* 
                  <option value="У">{t("oquvtatilida")}</option>
                  <option value="БС">{t("administrativruxsat")}</option>
                  <option value="БЛ">{t("mehnatgalayoqatsiz")}</option>
                  <option value="ОТ">{t("mehnattatilida")}</option>
                  <option value="УВ">{t("mehnatyakunlangan")}</option>
                  <option value="К">{t("ishsafarida")}</option>
                   */}
      {isBsDay(day) ? (
        <div className="calendar-bs">
          <span>{bsDates.find(bs => {
            const start = new Date(bs.startDate);
            const end = new Date(bs.endDate);
            const current = new Date(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
            return current >= start && current <= end;
          })?.sabab || ""}</span>
        </div>
      ) : (
        schedule?.ratedName && (
          <div
            className="calendar-rated"
            title={`${schedule.ratedName} tomonidan ${schedule.rated} ball bilan baholangan`}
          >
            <span>{schedule.rated}</span>
          </div>
        )
      )}

      {isHolidayDay(day) && (
        <div
          className="calendar-holiday"
          title={
            holidays.find(
              hol =>
                hol.holiday ===
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            )?.sabab || ""
          }
        >
          <span>🎉</span>
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
          <i className="fa-solid fa-arrow-down"></i>
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

      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("malumot")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: "16px", color: "#333", textAlign: "center" }}>{modalSabab}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInfoModal(false)}>
            Yopish
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarComponent;