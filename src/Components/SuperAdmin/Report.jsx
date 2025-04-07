import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Spinner, Form } from "react-bootstrap";
import { API } from "../../config";
import * as XLSX from "xlsx"; // xlsx kutubxonasini import qilamiz
import logo from '../Images/logo-png.png'
function Report() {
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      alert("Iltimos, sana tanlang");
      return;
    }
    const formattedDate = formatDate(date);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/getallemployeestoreport`, {
        date: formattedDate,
      });
      setData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    // Excel faylini yaratish uchun ma'lumotni tayyorlash
    const excelData = [];
    const wsData = {}; // Bu o'zgaruvchini formatlash uchun ishlatamiz

    let rowIndex = 0;

    // Tezda eng yuqori satrni qo'shish
    const formattedDate = formatDate(new Date()); // Sana formatlash
    excelData.push(["Ходимларнинг кундалик ишлар ҳисоботларини белгиланган вақт ичида бажарганлиги ёки бажармаганлиги тўғрисида МАЪЛУМОТНОМА", formattedDate]);
    rowIndex++; // Bosh satrni qo'shgandan keyin satrni yangilash

    data.forEach((item) => {
        // Sektor nomini qo'shish va bold qilish
        excelData.push([item.sectorName]);
        const sectorCell = `A${rowIndex + 1}`; // Sektor nomining joylashuvi
        wsData[sectorCell] = { v: item.sectorName, s: { font: { bold: true } } }; // Sektor nomini bold qilish

        // Xodimlar va ularning statuslari
        item.sectorEmployees.forEach((emp, empIndex) => {
            excelData.push([emp.employeeName, emp.employeeStatus ? "БАЖАРГАН" : "БАЖАРМАГАН"]);
            rowIndex++; // Har bir xodimdan keyin satrni yangilash
        });

        // Bo'sh qator qo'shish
        excelData.push([]);
        rowIndex++; // Bo'sh qatorni qo'shgandan keyin satrni yangilash
    });

    // Xlsx faylini yaratish
    const ws = XLSX.utils.aoa_to_sheet(excelData, { origin: "A1" });

    // Sektor nomi uchun formatlarni qo'shish
    Object.assign(ws, wsData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Excel faylini yuklab olish
    XLSX.writeFile(wb, "Employee_Report.xlsx");
};

  return (
    <div className="report-page-container">
        <div className="text-center">
        <img className="formal" src={logo} alt="" />
        <div className="container">
        <h5 className="p-3">Ходимларнинг кундалик ишлар ҳисоботларини белгиланган вақт ичида бажарганлиги ёки бажармаганлиги тўғрисида<br />МАЪЛУМОТНОМА</h5>
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
      <form onSubmit={handleSubmit} className="report-page-form">
        <div className="report-page-date-selector">
          <Form.Label htmlFor="date" className="report-page-form-label">
            Sana tanlang:
          </Form.Label>
          <Form.Control
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="report-page-date-input"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          className="report-page-submit-button"
          disabled={loading}
        >
          {loading ? "Yuklanmoqda..." : "Hisobotni ko'rsatish"}
        </Button>
      </form>

      {date && !loading && (
        <h1 className="report-page-header">{date} dagi hisobotlar</h1>
      )}
      {loading && <Spinner animation="border" variant="primary" />}

      {!loading && data.length > 0 && (
        <div className="report-page-table">
          {data.map((item, index) => (
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
                  {item.sectorEmployees.map((emp, empIndex) => (
                    <tr key={empIndex}>
                      <td className="col-10">{emp.employeeName}</td>
                      <td className="col-2">
                        <span className={emp.employeeStatus ? "text-success" : "text-danger"}>
                          {emp.employeeStatus ? "БАЖАРГАН" : "БАЖАРМАГАН"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Report;