import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config";

function Xodimlar({ testId, selected, passed, setSelected, handleClose5 }) {
  const [allEmployees, setAllEmployees] = useState([]); // Hammasi
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Qidiruv natijalari
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Qidiruv kaliti

  const handleCheckboxChange = (employee) => {
    if (selected.includes(employee._id)) {
      setSelected(selected.filter(id => id !== employee._id));
    } else {
      setSelected([...selected, employee._id]);
    }
  };

  const handleSend = () => {
    axios
      .put(`${API}/lang/sendusers/${testId}`, {
        selectedUsers: selected,
      })
      .then((response) => {
        console.log("Yuborish muvaffaqiyatli:", response.data);
        setSelected([]); 
        handleClose5();
      })
      .catch((error) => {
        console.error("Xatolik:", error);
      });
  };

  const getAllEmployees = async (role = "") => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API}/auth/getallemployeeswithfilter`, {
        params: { role },
      });

      // Alifbo bo'yicha saralash
      const sortedEmployees = data.employees;

      setAllEmployees(sortedEmployees);
      setFilteredEmployees(sortedEmployees);
    } catch (err) {
      setError("Xodimlarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // Qidiruv funksiyasi
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredEmployees(allEmployees);
    } else {
      const filtered = allEmployees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, allEmployees]);

  useEffect(() => {
    getAllEmployees();
  }, []);

  return (
    <>
      <div className="text-center mt-3">
        <input
          type="text"
          placeholder="Xodimlarni qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", width: "300px", marginBottom: "15px" }}
        />
        <br />
        <button className="btn btn-success" onClick={handleSend} disabled={loading}>
          {loading ? "Yuklanmoqda..." : "Yuborish"}
        </button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <div className="table-responsive alluserss mt-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th><i className="fa-solid fa-check"></i></th>
              <th>N</th>
              <th>F.I.Sh</th>
              <th>Telefon</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr><td colSpan="4" className="text-center">Yuklanmoqda...</td></tr>
            ) : (
              filteredEmployees.map((employee, index) => (
                <tr key={employee._id}>
                  <td className={passed.includes(employee._id) ? "bggreen" : ""}>
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(employee)}
                      checked={selected.includes(employee._id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{employee.name?.length > 20 ? employee.name.slice(0, 20) + "..." : employee.name}</td>
                  <td>{employee.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Xodimlar;