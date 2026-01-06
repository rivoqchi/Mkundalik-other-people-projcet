import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../config";
import { Link } from "react-router-dom";

function Xodimlar() {
  const [exists, setExists] = useState(false);
  const [link, setLink] = useState(null);
  const [route, setRoute] = useState("");

  const getTest = async () => {
    const id = window.localStorage.getItem("user_id");

    // 🔴 MUHIM HIMOYA
    if (!id || id === "null" || id === "undefined") {
      console.warn("user_id yo‘q, test tekshirilmaydi");
      return;
    }

    try {
      const { data } = await axios.get(
        `${API}/auth/test/check/${id}`,
        { withCredentials: true } // cookie bo‘lsa kerak
      );

      if (data?.exists) {
        setExists(true);
        setLink(data.link);
      }
    } catch (err) {
      console.error("Testni tekshirishda xatolik:", err?.response?.data || err);
    }
  };

  useEffect(() => {
    getTest();
  }, []);

  useEffect(() => {
    const role = window.localStorage.getItem("role");

    const routes = {
      admin: "/admin",
      employee: "/user",
      superadmin: "/superadmin",
      complex: "/complex",
      department: "/department",
      hr: "/hr",
      lang: "/lang",
      boss: "/boss",
      commission: "/commission",
      staff: "/staff",
      at: "/at",
      sport: "/sport",
    };

    setRoute(routes[role] || "/login"); // ❌ /null emas
  }, []);

  return (
    <div className="test-check-container">
      {exists && link && route && (
        <Link to={`${route}/test/${link}`}>
          <button className="testbor">Test mavjud</button>
        </Link>
      )}
    </div>
  );
}

export default Xodimlar;
