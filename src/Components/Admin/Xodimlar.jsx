import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link} from 'react-router-dom';
import { API } from "../../config";

function Xodimlar() {
  const [employees, setEmployees] = useState([]); // Xodimlar ro‘yxati
  const [myData, setMyData] = useState(null);
  const [mySection, setMySection] = useState(null);
  const [myDepartment, setMyDepartment] = useState(null);
  const [myComplex, setMyComplex] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const myId = window.localStorage.getItem("user_id");

  // Foydalanuvchi ma'lumotlarini olish
  const getMyData = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
      setMyData(data.user);
      setMySection(data.user.section);
      setMyDepartment(data.user.department);
      setMyComplex(data.user.complex);
      if(data.user.role === 'employee'){
        setMyRole("user")
      } else if(data.user.role === 'admin'){
        setMyRole("admin")
      } else if(data.user.role === 'department'){
        setMyRole("department")
      } else if(data.user.role === 'complex'){
        setMyRole("complex")
      } else if(data.user.role === 'superadmin'){
        setMyRole("superadmin")
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Xodimlar ro‘yxatini olish
  const getMyEmployees = async (role) => {
    try {
      const { data } = await axios.get(`${API}/auth/getmyemployees`, {
        params: { role, section: mySection, department: myDepartment, complex: myComplex }, // Role query orqali yuboriladi
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

  let dataa = null;
  if (myRole === "admin") {
    dataa = mySection
  } else if (myRole === "department") {
    dataa = myDepartment
  } else if (myRole === "complex") {
    dataa = myComplex
  }
  return (
    <div>
        <div className="d-flex justify-content-between">
        <h3>{dataa} a'zolari</h3>
        {/* <Link to={`/${myRole}/instructions`}><button className="defaultbtn"><i class="fa-solid fa-book-journal-whills"></i> Lavozim yo`riqnomasi</button></Link> */}
        </div>
      <table className="table overflow-x-auto table-striped mt-3">
        <thead>
          <tr>
            <th>N</th>
            <th>F.I.Sh</th>
            <th>Telefon</th>
            <th>Bo'lim</th>
            <th>Lavozim</th>
            <th>Millati</th>
            <th>Tug'ilgan kuni</th>
            <th>Tug'ilgan joyi</th>
            <th>Yashash manzili</th>
            <th>Ma'lumoti</th>
            <th>Mutaxassisligi</th>
            <th>Tizimga qo'shildi</th>
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