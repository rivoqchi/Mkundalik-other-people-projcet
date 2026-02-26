import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { API } from "../../config";
import * as XLSX from "xlsx";
import logo from "../Images/logo-png.png";

function Report() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterByDepartment, setFilterByDepartment] = useState({});
  const [departments, setDepartments] = useState([]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

const exportToExcel = (reportData) => {
  if (!reportData) return;

  const excelData = [];
  excelData.push([
    "Metropoliten xizmat va elektrodepolari xodimlarining elektron kundalik yuritish va baholash to`g`risida MA'LUMOTNOMA (mkundalik.uz)",
  ]);
  excelData.push([`Boshlanish sanasi: ${reportData.startDate}`]);
  excelData.push([`Tugash sanasi: ${reportData.endDate}`]);
  excelData.push([`Umumiy o'rtacha ball: ${reportData.overallAverageRated}`]);
  excelData.push([]);

  const groupedByDepartment = {};
  reportData.employeeReports.forEach((emp) => {
    const dep = emp.department || reportData.department || "Boshqa xizmat";
    if (!groupedByDepartment[dep]) groupedByDepartment[dep] = [];
    groupedByDepartment[dep].push(emp);
  });

  Object.keys(groupedByDepartment).forEach((depName) => {
    excelData.push([`${depName.toUpperCase()}`]);
    // SHU YERDA: Ustun sarlavhasiga "Lavozimi" qo'shildi
    excelData.push(["Xodim ismi", "Lavozimi", "Hisobotlar soni", "O'rtacha baho"]);
    
    groupedByDepartment[depName].forEach((emp) => {
      // SHU YERDA: Qatorga emp.degree qo'shildi
      excelData.push([emp.employeeName, emp.degree, emp.reportCount, emp.averageRated]);
    });
    excelData.push([]);
  });

  excelData.push(["O'zlashtirishi past bo'lgan xodimlar"]);
  // SHU YERDA: Past o'zlashtiruvchilar jadvaliga ham degree qo'shildi
  excelData.push(["Xodim ismi", "Lavozimi", "Hisobotlar soni", "O'rtacha baho"]);
  reportData.lowPerformers.forEach((emp) => {
    excelData.push([emp.employeeName, emp.degree, emp.reportCount, emp.averageRated]);
  });

  const ws = XLSX.utils.aoa_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Hisobot");
  XLSX.writeFile(wb, `${reportData.startDate}_${reportData.endDate}_hisobot.xlsx`);
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!startDate || !endDate) {
    alert("Boshlanish va tugash sanasini kiriting!");
    return;
  }

  setLoading(true);
  try {
    const payload = {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
    // Faqat xizmat tanlangan bo'lsa, payloadga qo'shamiz
    if (filterByDepartment.name) {
      payload.department = filterByDepartment.name;
    }else{
      payload.department = "all";
    }
    const res = await axios.post(`${API}/auth/reportglobal`, payload);

    setData(res.data.data);
    exportToExcel(res.data.data);
  } catch (error) {
    console.error("Xatolik:", error);
  } finally {
    setLoading(false);
  }
};

  const getAllDepartments = async () => {
    try {
      const { data } = await axios.get(`${API}/sectors/getall`);
      setDepartments(data.sections);
    } catch (err) {
      console.error("Bo‘limlar yuklanmadi:", err);
    }
  };

  useEffect(() => {
    getAllDepartments();
  }, []);

  return (
    <div className="report-container">
      <div className="report-header text-center">
        <img className="report-logo" src={logo} alt="logo" />
        <div className="report-title-container">
          <h5 className="report-title">
          Metropoliten xizmat va elektrodepolari xodimlarining elektron kundalik yuritish va baholash to`g`risida MA'LUMOTNOMA
          </h5>
        </div>
      </div>

      <div className="report-filter-section d-flex justify-content-between align-items-center">
        <Form.Group className="report-filter-group">
          <Form.Label className="report-filter-label">Xizmat</Form.Label>
          <Form.Control
            as="select"
            className="report-filter-select"
            value={filterByDepartment.name || ""}
            onChange={(e) =>
              setFilterByDepartment(e.target.value ? { name: e.target.value } : {})
            }
          >
            <option value="">Barcha xizmatlar:</option>
            {departments.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>

      <form onSubmit={handleSubmit} className="report-form">
        <div className="report-date-selector d-flex justify-content-evenly align-items-center">
          <Form.Group className="report-date-group">
            <Form.Label className="report-date-label">Boshlanish sanasi:</Form.Label>
            <Form.Control
              type="date"
              className="report-date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="report-date-group">
            <Form.Label className="report-date-label">Tugash sanasi:</Form.Label>
            <Form.Control
              type="date"
              className="report-date-input"
              value={endDate || startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </div>

        <Button
          type="submit"
          className="report-submit-btn"
          variant="primary"
          disabled={loading}
        >
          {loading ? "Yuklanmoqda..." : "Ko‘rsatish"}
        </Button>
      </form>
    </div>
  );
}

export default Report;
