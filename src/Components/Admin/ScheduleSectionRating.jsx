import React, { useState, useEffect } from "react";
import { API } from "../../config";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingScreen from "../Additional/LoadingScreen";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function RatingMyAdmins() {
  const { t } = useTranslation();
  const myId = window.localStorage.getItem("user_id");
  const [mySectionSchedules, setMySectionSchedules] = useState([]);
  const [myData, setMyData] = useState([]);
  const [isNZS, setIsNZS] = useState([]);
  const [myRole, setMyRole] = useState([]);
  const id = window.localStorage.getItem("user_id");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getMySectionSchedules = async () => {
    setLoading(true);
    try {
      let url = ``;
      let body = {};
  
      if (myRole === "department") {
        url = `${API}/schedules/getmysection/admin/${myId}`;
      } else if (myRole === "admin") {
        url = `${API}/schedules/getmysection/${myId}`;
      } else if (myRole === "boss") {
        url = `${API}/schedules/getmysection/complex/${myId}`;
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
    <div className="mh100">
      {loading && <LoadingScreen loading={true} />}
      <h1 className="text-center">{t("xodimlarimkorsatkichlari")}</h1>
      <div className="stataboutrating">
        <h3 className="text-center blueword">
        {t("all")}: <b>{mySectionSchedules.length}</b>
        </h3>
        <div className="d-flex justify-content-between">
          <h5 className="successword">
          {t("baholangan")}:{" "}
            {mySectionSchedules?.filter((item) => item.rated)?.length || 0}
          </h5>
          <h5 className="redword">
          {t("baholashkk")}:{" "}
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
      <table className="schedule-history-table">
  <thead>
    <tr>
      <th>{t("fish")}</th>
      <th>{t("bajargansana")}</th>
      <th>{t("baholangan")}</th>
    </tr>
  </thead>
  <tbody>
    {mySectionSchedules.map((i) => (
      <tr
        key={i._id}
        className={`history-row ${i.rated ? "row-rated" : "row-unrated"}`}
        onClick={() => navigate(`/${myRole}/rate/schedule/${i._id}`)}
        style={{ cursor: "pointer" }}
      >
        <td className="history-name">
          <i className="fa-solid fa-user"></i> {i.beginnerName} - {i?.degree}
        </td>
        <td className="history-date">
          <i className="fa-solid fa-calendar-days"></i> {i.startedAt.slice(0, 10)}
        </td>
        <td className="history-status">
          {i.rated ? (
            <span>
              <i className="fa-regular fa-star"></i> {i.rated}
            </span>
          ) : (
            "Yo‘q"
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}

export default RatingMyAdmins;
