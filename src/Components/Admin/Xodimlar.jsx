import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API } from "../../config";
import { useLoading } from "../Additional/LoadingScreen";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion"; // <-- Added framer-motion

function Xodimlar() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]); // Xodimlar ro‘yxati
  const [myData, setMyData] = useState(null);
  const [mySection, setMySection] = useState(null);
  const [myDepartment, setMyDepartment] = useState(null);
  const [myComplex, setMyComplex] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const myId = window.localStorage.getItem("user_id");
  const { setLoading } = useLoading();

  // Foydalanuvchi ma'lumotlarini olish
  const getMyData = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
      setMyData(data.user);
      setMySection(data.user.section);
      setMyDepartment(data.user.department);
      setMyComplex(data.user.complex);

      const roleMap = {
        employee: "user", admin: "admin", department: "department",
        complex: "complex", superadmin: "superadmin", hr: "hr",
        boss: "boss", commission: "commission"
      };
      setMyRole(roleMap[data.user.role] || null);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  // Xodimlar ro‘yxatini olish
  const getMyEmployees = async (role) => {
    if (mySection === "Yuqori turuvchi" && myRole === 'admin') {
      setEmployees([]);
      return;
    }
    try {
      const params = {
        role,
        section: mySection,
        department: myDepartment,
        complex: myComplex,
      };
      if (
        myComplex === "Kompleks  NZS (Qurilish bo'yicha)" &&
        myRole === "complex"
      ) {
        params.forNZS = true;
      }

      const { data } = await axios.get(`${API}/auth/getmyemployees`, {
        params: { ...params, myRole },
      });

      // Sort qilish logic
      const roleOrder = ["complex", "department", "admin", "employee"];
      const sorted = [...data.employees].sort((a, b) => {
        const aRoleIndex = roleOrder.indexOf(a.role) !== -1 ? roleOrder.indexOf(a.role) : 999;
        const bRoleIndex = roleOrder.indexOf(b.role) !== -1 ? roleOrder.indexOf(b.role) : 999;

        if (aRoleIndex !== bRoleIndex) return aRoleIndex - bRoleIndex;
        if (a.role === "department" && b.role === "department") {
          return a.department.localeCompare(b.department);
        }
        if (a.department === b.department) {
          return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
        }
        return a.department.localeCompare(b.department);
      });

      setEmployees(sorted);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    getMyData();
  }, []);

  useEffect(() => {
    if (myData?.role) {
      getMyEmployees(myData.role);
    }
  }, [myData, mySection, myDepartment, myComplex]); // dependencies updated to ensure fetching triggers

  let dataa = null;
  if (myRole === "admin") dataa = mySection;
  else if (myRole === "department") dataa = myDepartment;
  else if (["complex", "boss", "commission"].includes(myRole)) dataa = myComplex;

  return (
    <motion.div
      className="xodimlar-page-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ─── Telegram Notification Banner ─── */}
      <a href="https://t.me/mkundalik_hisobot" target="_blank" rel="noreferrer" className="tg-banner-modern">
        <div className="tg-banner-icon">
          <i className="fa-brands fa-telegram"></i>
        </div>
        <div className="tg-banner-text">
          <p className="tg-title">Telegram boti orqali qabul qiling</p>
          <p className="tg-desc">Xodimlarning hisobot yozmaganliklari haqida ma'lumotlarni telegramda bepul va avtomatik oling.</p>
        </div>
        <div className="tg-banner-arrow">
          <i className="fa-solid fa-arrow-right"></i>
        </div>
      </a>

      {/* ─── Page Header ─── */}
      <div className="xodimlar-header">
        <div className="header-title-box">
          <i className="fa-solid fa-users icon-lead"></i>
          <div>
            <h2 className="title-main">{dataa || t("xodimlarim")}</h2>
            <p className="title-sub">
              {employees.length > 0
                ? `${employees.length} ${t("taxodimroyxatgaolingan")}`
                : t("connectednotfound")}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Smart Table ─── */}
      <div className="xodimlar-table-wrapper">
        <table className="xodimlar-table">
          <thead>
            <tr>
              <th className="col-num">#</th>
              <th className="col-name"><i className="fa-solid fa-user me-2"></i>{t("fish")} / {t("education")}</th>
              <th><i className="fa-solid fa-phone me-2"></i>{t("tel")}</th>
              <th><i className="fa-solid fa-briefcase me-2"></i>{t("section")}</th>
              <th><i className="fa-solid fa-location-dot me-2"></i>{t("address")}</th>
              <th><i className="fa-solid fa-calendar-days me-2"></i>{t("dateOfBirth")}</th>
              <th className="col-status"><i className="fa-solid fa-shield-halved me-2"></i>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {employees.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={7}>
                    <div className="xodimlar-empty">
                      <i className="fa-solid fa-ghost"></i>
                      <p>Xodimlar ro'yxati bo'sh</p>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                employees.map((employee, index) => (
                  <motion.tr
                    key={employee._id}
                    className="xodim-row"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <td className="col-num">
                      <span className="row-num-badge">{index + 1}</span>
                    </td>
                    <td className="col-name">
                      <Link
                        className="name-link"
                        to={`/${myRole}/schedule/history/${employee._id}`}
                        title={t("taptoknowallinfoaboutemployee")}
                      >
                        <div className="name-main">{employee.name}</div>
                        <div className="name-sub">{employee.degree}</div>
                      </Link>
                    </td>
                    <td>
                      <a href={`tel:${employee.phone}`} className="phone-badge" title={t("taptoknowphone")}>
                        {employee.phone}
                      </a>
                    </td>
                    <td>
                      <div className="work-dept">{employee.section}</div>
                      <div className="work-spec">{employee.speciality}</div>
                    </td>
                    <td>
                      <div className="address-text">{employee.address}</div>
                    </td>
                    <td>
                      <div className="date-badge">{employee.dateOfBirth}</div>
                    </td>
                    <td className="col-status">
                      <span className={`role-badge role-${employee.role}`}>
                        {employee.role}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default Xodimlar;
