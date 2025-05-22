import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config";
import { useTranslation } from "react-i18next";

function Xodimlar() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]); // Xodimlar ro‘yxati
  const [mySection, setMySection] = useState(null); // Foydalanuvchi ma'lumoti
  const [myData, setMyData] = useState(null); // Foydalanuvchi ma'lumoti
  const myId = window.localStorage.getItem("user_id");

  const getMyData = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
      setMyData(data.user);
      setMySection(data.user.section);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Xodimlar ro‘yxatini olish
  const getMyEmployees = async (role) => {
    try {
      const { data } = await axios.get(`${API}/auth/getmyemployees`, {
        params: { role, section: mySection }, // Role query orqali yuboriladi
      });
      setEmployees(data.employees); // Xodimlar ro‘yxatini saqlash
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Ma'lumotlarni yuklash
  useEffect(() => {
    getMyData();
  }, []);

  useEffect(() => {
    if (myData?.role) {
      getMyEmployees(myData.role); // Role asosida xodimlarni olish
    }
  }, [myData]);

  return (
    <div>
        <div className="d-flex justify-content-between">
        <h3>{mySection}</h3>
        <button className="defaultbtn">Yo`riqnoma</button>
        </div>
      <table className="table overflow-x-auto table-striped mt-3">
        <thead>
          <tr>
            <th>N</th>
            <th>{t("fish")}</th>
            <th>{t("tel")}</th>
            <th>{t("section")}</th>
            <th>{t("degree")}</th>
            <th>{t("nationality")}</th>
            <th>{t("dateOfBirth")}</th>
            <th>{t("placeOfBirth")}</th>
            <th>{t("address")}</th>
            <th>{t("education")}</th>
            <th>{t("speciality")}</th>
            <th>{t("tizimgaqoshildi")}</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee._id}>
              <td>{index + 1}</td>
              <td>{employee.name}</td>
              <td>{employee.phone}</td>
              <td>{employee.section}</td>
              <td>{employee.degree}</td>
              <td>{employee.nationality}</td>
              <td>{employee.dateOfBirth}</td>
              <td>{employee.placeOfBirth}</td>
              <td>{employee.address}</td>
              <td>{employee.education}</td>
              <td>{employee.speciality}</td>
              <td>{employee.firstAct}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Xodimlar;