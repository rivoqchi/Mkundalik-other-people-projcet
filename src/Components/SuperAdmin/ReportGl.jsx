import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Spinner } from "react-bootstrap";
import { API } from "../../config";
import * as XLSX from "xlsx";
import logo from "../Images/logo-png.png";
import { useTheme } from "../Additional/ThemeContext";

function Report() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
      } else {
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
    <div className={`p-4 ${isDark ? "bg-slate-900" : "bg-light"}`} style={{ minHeight: "100vh", transition: "all 0.3s ease" }}>
      <div className="glass-card p-4 mx-auto mt-4" style={{ maxWidth: "800px", background: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.9)", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
        <div className="report-header text-center mb-4">
          <div className="d-inline-block rounded-circle bg-white p-2 mb-3 shadow-sm" style={{ width: "80px", height: "80px" }}>
            <img className="w-100 h-100 object-fit-contain" src={logo} alt="logo" />
          </div>
          <h5 className={`fw-bold lh-base ${isDark ? "text-white" : "text-dark"}`}>
            Metropoliten xizmat va elektrodepolari xodimlarining elektron kundalik yuritish va baholash to`g`risida MA'LUMOTNOMA
          </h5>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4 mt-5">
          {/* Xizmat Category */}
          <div className="form-group">
            <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`}>Xizmatni tanlang</label>
            <div className="premium-input-wrapper">
              <i className="fa-regular fa-building input-icon text-primary"></i>
              <select
                className="premium-input-field w-100 ps-5"
                value={filterByDepartment.name || ""}
                onChange={(e) => setFilterByDepartment(e.target.value ? { name: e.target.value } : {})}
                style={{ background: 'transparent', appearance: 'none' }}
              >
                <option value="" className={isDark ? "bg-dark text-white" : ""}>Barcha xizmatlar (Umumiy)</option>
                {departments.map((item) => (
                  <option key={item._id} value={item.name} className={isDark ? "bg-dark text-white" : ""}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6 form-group">
              <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`}>Boshlanish sanasi</label>
              <div className="premium-input-wrapper">
                <i className="fa-regular fa-calendar-days input-icon text-primary"></i>
                <input
                  type="date"
                  className="premium-input-field w-100 ps-5"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ background: 'transparent' }}
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6 form-group">
              <label className={`fw-bold mb-2 ${isDark ? 'text-light' : 'text-dark'}`}>Tugash sanasi</label>
              <div className="premium-input-wrapper">
                <i className="fa-regular fa-calendar-check input-icon text-primary"></i>
                <input
                  type="date"
                  className="premium-input-field w-100 ps-5"
                  value={endDate || startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ background: 'transparent' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-3 mb-2">
            <Button
              type="submit"
              variant="primary"
              className="px-5 py-2 fw-bold d-flex align-items-center gap-2"
              style={{ borderRadius: "12px", minWidth: "220px", justifyContent: "center", fontSize: "1.1rem" }}
              disabled={loading}
            >
              {loading ? (
                <><Spinner animation="border" size="sm" /> Yuklanmoqda...</>
              ) : (
                <><i className="fa-solid fa-file-excel"></i> Excel.xlsx Yuklab Olish</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Report;
