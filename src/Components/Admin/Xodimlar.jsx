import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API } from "../../config";
import LoadingScreen from "../Additional/LoadingScreen";
import { useTranslation } from "react-i18next";

function Xodimlar() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]); // Xodimlar ro‘yxati
  const [myData, setMyData] = useState(null);
  const [mySection, setMySection] = useState(null);
  const [myDepartment, setMyDepartment] = useState(null);
  const [myComplex, setMyComplex] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const myId = window.localStorage.getItem("user_id");
  const [loading, setLoading] = useState(false);

  // Foydalanuvchi ma'lumotlarini olish
  const getMyData = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
      setMyData(data.user);
      setMySection(data.user.section);
      setMyDepartment(data.user.department);
      setMyComplex(data.user.complex);
      if (data.user.role === "employee") {
        setMyRole("user");
      } else if (data.user.role === "admin") {
        setMyRole("admin");
      } else if (data.user.role === "department") {
        setMyRole("department");
      } else if (data.user.role === "complex") {
        setMyRole("complex");
      } else if (data.user.role === "superadmin") {
        setMyRole("superadmin");
      } else if (data.user.role === "hr") {
        setMyRole("hr");
      } else if (data.user.role === "boss") {
        setMyRole("boss");
      } else if (data.user.role === "commission") {
        setMyRole("commission");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Xodimlar ro‘yxatini olish
  const getMyEmployees = async (role) => {
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
        params,
      });

      // Mana shu yerda sort qilamiz:
      const roleOrder = ["complex", "department", "admin", "employee"];
      const sorted = [...data.employees].sort((a, b) => {
        const aRoleIndex =
          roleOrder.indexOf(a.role) !== -1 ? roleOrder.indexOf(a.role) : 999;
        const bRoleIndex =
          roleOrder.indexOf(b.role) !== -1 ? roleOrder.indexOf(b.role) : 999;

        if (aRoleIndex !== bRoleIndex) {
          return aRoleIndex - bRoleIndex;
        }
        if (a.role === "department" && b.role === "department") {
          return a.department.localeCompare(b.department);
        }
        if (a.department === b.department) {
          const aSubRoleIndex = roleOrder.indexOf(a.role);
          const bSubRoleIndex = roleOrder.indexOf(b.role);
          return aSubRoleIndex - bSubRoleIndex;
        }
        return a.department.localeCompare(b.department);
      });

      setEmployees(sorted);
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

  let dataa = null;
  if (myRole === "admin") {
    dataa = mySection;
  } else if (myRole === "department") {
    dataa = myDepartment;
  } else if (myRole === "complex") {
    dataa = myComplex;
  } else if (myRole === "boss") {
    dataa = myComplex;
  } else if (myRole === "commission") {
    dataa = myComplex;
  }

  return (
    <>
      {loading && <LoadingScreen loading={true} />}

      <div className="mh100">
        <div>
          {/* <div className="newcitata">
      Endilikda xodimlarning barcha kundaliklarini ko`rish uchun xodimning
      ismi ustiga bosing.
    </div> */}
          <div className="justify-content-between">
            <div className="azolar defaultbox">
              <h3>{dataa} a'zolari</h3>
              <div>
                {employees.length > 0
                  ? `${employees.length} ${t("taxodimroyxatgaolingan")}`
                  : t("connectednotfound")}
              </div>
            </div>
          </div>
          <div className="xodimlartable">
            <table
              className="table table-custom-bg mt-3"
              style={{ backgroundColor: "#f4f7ff" }}
            >
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
                  <th>{t("firstAct")}</th>
                  <th>{t("status")}</th>
                </tr>
              </thead>
              <tbody className="tbbbbg">
                {employees.map((employee, index) => (
                  <tr className="llka" key={employee._id}>
                    <td>{index + 1}</td>
                    <td
                      className="text-start"
                      title={t("taptoknowallinfoaboutemployee")}
                    >
                      <Link
                        className="odammm text-decoration-none"
                        to={`/${myRole}/schedule/history/${employee._id}`}
                      >
                        {employee.name}
                      </Link>
                    </td>
                    <td title={t("taptoknowphone")}>
                      <a href={`tel:${employee.phone}`}>{employee.phone}</a>
                    </td>
                    <td>{employee.section}</td>
                    <td>{employee.degree}</td>
                    <td>{employee.nationality}</td>
                    <td>{employee.dateOfBirth}</td>
                    <td>{employee.placeOfBirth}</td>
                    <td>{employee.address}</td>
                    <td>{employee.education}</td>
                    <td>{employee.speciality}</td>
                    <td>{employee.firstAct}</td>
                    <td>{employee.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Xodimlar;
