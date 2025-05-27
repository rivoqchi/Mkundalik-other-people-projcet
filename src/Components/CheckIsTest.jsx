import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../config";
import { Link } from "react-router-dom";

function Xodimlar() {
  const [exists, setExists] = useState(false);
  const [link, setLink] = useState(null);
  const [route, setRoute] = useState("");

  let id = window.localStorage.getItem("user_id");

  const getTest = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/test/check/${id}`);
      if (data.exists) {
        setExists(true);
        setLink(data.link);
      }
    } catch (err) {
      console.error("Testni tekshirishda xatolik yuz berdi.");
    }
  };

  useEffect(() => {
    getTest();
  }, []);

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

  return (
    <div className="test-check-container">
      {exists && (
        <Link to={`${route}/test/${link}`}><button className="testbor">
            Test mavjud
            </button></Link>
      )}
    </div>
  );
}

export default Xodimlar;
