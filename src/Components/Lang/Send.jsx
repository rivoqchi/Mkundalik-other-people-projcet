import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config";

function Xodimlar({testId}) {

  const [selectedUsers, setSelectedUsers] = useState([]); // Tanlangan userlarni saqlash uchun
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Tanlangan userlarni saqlash uchun
  const [error, setError] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);

  const [loading, setLoading] = useState(false);
  const handleCheckboxChange = (employee) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.some((user) => user._id === employee._id)) {
        // Agar user allaqachon tanlangan bo'lsa, uni o'chirib tashlaymiz
        return prevSelected.filter((user) => user._id !== employee._id);
      } else {
        // Aks holda, userni qo'shamiz
        return [...prevSelected, { _id: employee._id, name: employee.name }];
      }
    });
  };

  const handleSend = () => {
    console.log("Tanlangan userlar:", selectedUsers);
    axios
      .put(`${API}/lang/sendusers/${testId}`, {
        selectedUsers: selectedUsers,
      })
      .then((response) => {
        console.log("Yuborish muvaffaqiyatli:", response.data);
        setSelectedUsers([]); // Yuborilgandan so'ng tanlangan userlarni tozalash
      })
      .catch((error) => {
        console.error("Xatolik:", error);
      });
  };
  const getAllEmployees = async (role = "") => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${API}/auth/getallemployeeswithfilter`,
        {
          params: { role },
        }
      );
      console.log(111);
      setAllEmployees(data.employees);
      setFilteredEmployees(data.employees);
    } catch (err) {
      setError("Xodimlarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
      getAllEmployees();
    }, []);
  return (
    <>
    
    <div className="text-center mt-3">
        <button className="btn btn-success" onClick={handleSend}>
          Yuborish
        </button>
      </div>
      <div className="table-responsive alluserss">
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>
                <i className="fa-solid fa-check"></i>
              </th>
              <th>N</th>
              <th>F.I.Sh</th>
              <th>Telefon</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={employee._id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(employee)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>
                  {employee.name?.length > 20
                    ? employee.name.slice(0, 20) + "..."
                    : employee.name}
                </td>
                <td>{employee.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Xodimlar;