import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Spinner, Form } from "react-bootstrap";
import {Link} from 'react-router-dom';
import { API } from "../../config";
import * as XLSX from "xlsx"; // xlsx kutubxonasini import qilamiz
import logo from "../Images/logo-png.png";
function Report() {
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterByComplex, setFilterByComplex] = useState({});
  const [filterByDepartment, setFilterByDepartment] = useState({});
  const [complexes, setComplexes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Iltimos, boshlanish va tugash sanalarini tanlang");
      return;
    }

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    setLoading(true);

    try {
      // const { data } = await axios.post(`${API}/auth/getschedulesbydayandemployees`, {
      const { data } = await axios.post(`${API}/auth/reportglobal`, {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        complex: filterByComplex.name,
        department: filterByDepartment.name,
      });
      setData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const excelData = [];
    const wsData = {};
    let rowIndex = 0;
  
    excelData.push([
      "Ходимларнинг кундалик ишлар ҳисоботларини белгиланган вақт ичида бажарганлиги ёки бажармаганлиги тўғрисида МАЪЛУМОТНОМА",
    ]);
    rowIndex++;
  
    data.forEach((dayItem) => {
      // Sanani qo‘shish
      excelData.push([`${dayItem.date}`]);
      wsData[`A${rowIndex + 1}`] = { v: dayItem.date, s: { font: { bold: true, sz: 14 } } };
      rowIndex++;
  
      let addedAnyEmployee = false;
  
      dayItem.data.forEach((item) => {
        const filteredEmployees = showAll
          ? item.sectorEmployees
          : item.sectorEmployees.filter(
              (emp) =>
                !emp.employeeStatus || emp.employeeName === "Behruz Abdurakhimov"
            );
  
        if (filteredEmployees.length === 0) return;
  
        // Sektor nomi
        excelData.push([item.sectorName]);
        wsData[`A${rowIndex + 1}`] = { v: item.sectorName, s: { font: { bold: true } } };
        rowIndex++;
  
        // Har bir xodim
        filteredEmployees.forEach((emp) => {
          const isBehruz = emp.employeeName === "Behruz Abdurakhimov";
          const status = emp.employeeStatus || isBehruz ? "БАЖАРГАН" : "БАЖАРМАГАН";
          excelData.push([emp.employeeName, status]);
          rowIndex++;
        });
  
        // addedAnyEmployee = true;
      });
  
      if (addedAnyEmployee) {
        excelData.push([]); // faqat kerak bo‘lsa bo‘sh qator
        rowIndex++;
      }
    });
  
    const ws = XLSX.utils.aoa_to_sheet(excelData, { origin: "A1" });
    Object.assign(ws, wsData);
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
  
    XLSX.writeFile(wb, startDate + "_" + endDate + " mkundalik hisobot.xlsx");
  };
  
  

  const getAllComplexes = async () => {
    try {
      const { data } = await axios.get(`${API}/complexes/getall`);
      setComplexes(data.complexes);
    } catch (err) {
      console.error("Error fetching complexes:", err);
    }
  };
  const getAllDepartments = async () => {
    try {
      const { data } = await axios.get(`${API}/sectors/getall`);      
      setDepartments(data.sections);
    } catch (err) {
      console.error("Error fetching complexes:", err);
    }
  };
  useEffect(() => {
    getAllComplexes();
    getAllDepartments();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterByComplex((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="report-page-container">
      <div className="text-center">
        <img className="formal" src={logo} alt="" />
        <div className="container">
          <h5 className="p-3">
            Ходимларнинг кундалик ишлар ҳисоботларини белгиланган вақт ичида
            бажарганлиги ёки бажармаганлиги тўғрисида
            <br />
            МАЪЛУМОТНОМА
          </h5>
        </div>
      </div>
        <Button
          variant="success"
          onClick={handleExportToExcel}
          className="mt-4"
          disabled={loading || data.length === 0}
        >
          Excel formatida yuklab olish
        </Button>
      <div className="d-flex w-100 justify-content-between align-items-center">

        <Form.Group>
          <Form.Label>Kompleks</Form.Label>
          <Form.Control
            as="select"
            name="complex"
            value={filterByComplex?.name || ""}
            onChange={(e) => {
              const selectedName = e.target.value;
              if (selectedName === "") {
                setFilterByComplex({});
              } else {
                setFilterByComplex({ name: selectedName });
              }
            }}
          >
            <option value="">Barcha komplekslar:</option>
            {complexes.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Xizmat</Form.Label>
          <Form.Control
  as="select"
  name="department"
  value={filterByDepartment.name || ""}
  onChange={(e) => {
    const selectedName2 = e.target.value;
    if (selectedName2 === "") {
      setFilterByDepartment({});
    } else {
      setFilterByDepartment({ name: selectedName2 });
    }
  }}
>
  <option value="">Barcha xizmatlar:</option>
  {departments?.map((item) => ( // departments mavjudligini tekshirish
    <option key={item._id} value={item.name}>
      {item.name}
    </option>
  ))}
</Form.Control>
        </Form.Group>
      </div>
      <form onSubmit={handleSubmit} className="report-page-form">
        <div className="report-page-date-selector bgf d-flex justify-content-evenly w-100 align-items-center">
          <div className="text-center align-items-center">
            <Form.Label
              htmlFor="checkbox"
              className="report-page-form-label mb-0"
            >
              Barchasini ko`rsatish
            </Form.Label>
            <Form.Check
              type="checkbox"
              id="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              className="me-2"
            />
          </div>

          <div className="">
            <div className="text-center">
              <Form.Label htmlFor="date" className="report-page-form-label">
                Boshlanish sanasi:
              </Form.Label>
              <Form.Control
                type="date"
                id="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="report-page-date-input"
              />
            </div>
            <div className="text-center">
              <Form.Label htmlFor="date" className="report-page-form-label">
                Tugash sanasi:
              </Form.Label>
              <Form.Control
                type="date"
                id="date"
                value={endDate || startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="report-page-date-input"
              />
            </div>
          </div>
        </div>
        <Button
          type="submit"
          variant="primary"
          className="report-page-submit-button korsatish"
          disabled={loading}
        >
          {loading ? (
            "Yuklanmoqda..."
          ) : (
            <>
              Hisobotni ko'rsatish <i className="fa-solid fa-receipt"></i>
            </>
          )}
        </Button>
      </form>

      {date && !loading && (
        <h1 className="report-page-header">{date} dagi hisobotlar</h1>
      )}
      {loading && <Spinner animation="border" variant="primary" />}

      {!loading && data.length > 0 && (
  <div className="report-page-table">
    {data.map((dayItem, dayIndex) => (
      <div key={dayIndex} className="mb-5">
        <h1 className="text-center mb-4">{dayItem.date}</h1>

        {dayItem.data.map((item, index) => (
          <div className="m-5" key={index}>
            <h5 className="text-center">{item.sectorName}</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="col-10">Xodim</th>
                  <th className="col-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {item.sectorEmployees &&
                  item.sectorEmployees
                    .filter((emp) => showAll || !emp.employeeStatus)
                    .map((emp, empIndex) => {
                      const isBehruz =
                        emp.employeeName === "Behruz Abdurakhimov";
                      const isDone = isBehruz || emp.employeeStatus;

                      return (
                        <tr key={empIndex}>
                          <td className="col-10"><Link to={`/superadmin/schedule/history/${emp.employeeId}`}>{emp.employeeName}</Link></td>
                          <td className="col-2">
                            <span
                              className={
                                isDone ? "text-success" : "text-danger"
                              }
                            >
                              {isDone ? "БАЖАРГАН" : "БАЖАРМАГАН"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    ))}
  </div>
)}

    </div>
  );
}

export default Report;
