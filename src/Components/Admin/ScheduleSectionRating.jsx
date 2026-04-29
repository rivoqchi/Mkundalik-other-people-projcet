import React, { useState, useEffect, useCallback } from "react";
import { API } from "../../config";
import axios from "axios";
import { useLoading } from "../Additional/LoadingScreen";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Button, Spinner } from "react-bootstrap";
import FormattedTypewriter from "../Additional/FormattedTypewriter";

const PAGE_SIZES = [10, 20, 50, 100, "all"];

function RatingMyAdmins() {
  const { t } = useTranslation();
  const myId = window.localStorage.getItem("user_id");
  const [schedules, setSchedules] = useState([]);
  const [myData, setMyData] = useState(null);
  const [isNZS, setIsNZS] = useState(false);
  const [myRole, setMyRole] = useState("");
  const [superiors, setSuperiors] = useState([]);

  // Stats (always full totals)
  const [totalAll, setTotalAll] = useState(0);
  const [totalRated, setTotalRated] = useState(0);
  const [totalUnrated, setTotalUnrated] = useState(0);

  // Pagination & filter
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [unratedOnly, setUnratedOnly] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // AI Summary State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const buildUrl = useCallback(() => {
    if (!myRole || !myId) return null;
    if (myRole === "department") return `${API}/schedules/getmysection/admin/${myId}`;
    if (myRole === "admin") return `${API}/schedules/getmysection/${myId}`;
    if (myRole === "boss") return `${API}/schedules/getmysection/complex/${myId}`;
    if (myRole === "complex") return `${API}/schedules/getmysection/department/${myId}`;
    return null;
  }, [myRole, myId]);
  const mySection = window.localStorage.getItem("section");
  const fetchSchedules = useCallback(async () => {
    if (mySection === "Yuqori turuvchi" && myRole === 'admin') {
      setSchedules([]);
      setTotalCount(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }
    const url = buildUrl();
    if (!url) return;
    setLoading(true);
    try {
      const body = {
        page,
        limit: limit === "all" ? "all" : Number(limit),
        unratedOnly,
        myRole, // Send role for verification
      };
      if (myRole === "complex" && isNZS) body.nzs = true;

      const { data } = await axios.post(url, body);
      setSchedules(data.schedules || []);
      setTotalCount(data.totalCount ?? data.schedules?.length ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setSchedules([]);
      setTotalCount(0);
    }
    setLoading(false);
  }, [buildUrl, page, limit, unratedOnly, myRole, isNZS, setLoading]);

  // Fetch global stats (always without filter/pagination)
  const fetchStats = useCallback(async () => {
    if (window.localStorage.getItem("section") === "Yuqori turuvchi") {
      setTotalAll(0);
      setTotalRated(0);
      setTotalUnrated(0);
      return;
    }
    const url = buildUrl();
    if (!url) return;
    try {
      const { data } = await axios.post(url, {
        page: 1,
        limit: "all",
        unratedOnly: false,
        myRole, // Send role for verification
        ...(myRole === "complex" && isNZS ? { nzs: true } : {}),
      });
      const all = data.schedules || [];
      setTotalAll(all.length);
      setTotalRated(all.filter((s) => s.rated).length);
      setTotalUnrated(all.filter((s) => !s.rated).length);
    } catch {
      setTotalAll(0); setTotalRated(0); setTotalUnrated(0);
    }
  }, [buildUrl, myRole, isNZS]);

  useEffect(() => {
    if (myRole && myId) {
      fetchSchedules();
    }
  }, [myRole, myId, page, limit, unratedOnly]);

  useEffect(() => {
    if (myRole && myId) fetchStats();
  }, [myRole, myId]);

  const fetchSuperiors = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/auth/mysuperiors/${myId}`);
      if (data && data.superiors) {
        setSuperiors(data.superiors);
      }
    } catch (e) {
      console.error(e);
    }
  }, [myId]);

  useEffect(() => {
    if (myId) fetchSuperiors();
  }, [myId]);

  const getMyData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
      setMyData(data.user);
      if (data.user.role === "complex" && data.user.complex === "Kompleks  NZS (Qurilish bo'yicha)") {
        setIsNZS(true);
      }
      const roleMap = {
        employee: "user", admin: "admin", superadmin: "superadmin",
        complex: "complex", hr: "hr", department: "department",
        boss: "boss", commission: "commission",
      };
      setMyRole(roleMap[data.user.role] || "");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => { getMyData(); }, []);

  const greenPct = totalAll > 0 ? Math.round((totalRated / totalAll) * 100) : 0;
  const redPct = 100 - greenPct;

  const handlePageSizeChange = (val) => {
    setLimit(val === "all" ? "all" : Number(val));
    setPage(1);
  };

  const handleFilterChange = (val) => {
    setUnratedOnly(val === "unrated");
    setPage(1);
  };

  const handleAiSectionSummarize = async () => {
    setIsSummarizing(true);
    setShowAiModal(true);
    const url = buildUrl();
    if (!url) return;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    try {
      // 1. Fetch ALL reports for the section for CURRENT MONTH ONLY
      const { data } = await axios.post(url, {
        page: 1,
        limit: "all",
        unratedOnly: false,
        myRole,
        month: currentMonth,
        year: currentYear,
        ...(myRole === "complex" && isNZS ? { nzs: true } : {}),
      });

      const allReports = data.schedules || [];
      if (allReports.length === 0) {
        setAiSummary(t("malumotyoq"));
        setIsSummarizing(false);
        return;
      }

      // 2. Recursive function to handle errors (413, 400)
      const getSummary = async (reportsToProcess, retryCount = 0) => {
        if (!reportsToProcess || reportsToProcess.length === 0) {
          throw new Error("No reports to process");
        }

        try {
          const { data: aiResponse } = await axios.post(`${API}/ai/summarize`, { 
            reports: reportsToProcess,
            language: localStorage.getItem("i18nextLng") || "uz"
          }, { withCredentials: true });
          
          if (aiResponse && aiResponse.response) {
            return aiResponse.response;
          } else {
            throw new Error("Empty AI response");
          }
        } catch (error) {
          const status = error.response?.status;
          // If content too large or bad request (often length related) or generic error that might be load related
          if ((status === 413 || status === 400 || status === 500) && retryCount < 10) {
            console.warn(`AI Summary attempt ${retryCount + 1} failed (Status: ${status}). Reducing dataset by 50%...`);
            
            // Fisher-Yates shuffle for true randomness before slicing
            const shuffled = [...reportsToProcess].sort(() => Math.random() - 0.5);
            const halfSize = Math.max(1, Math.floor(shuffled.length / 2));
            const reducedReports = shuffled.slice(0, halfSize);
            
            return await getSummary(reducedReports, retryCount + 1);
          }
          throw error;
        }
      };

      const summary = await getSummary(allReports);
      setAiSummary(summary);
    } catch (error) {
      console.error("AI Section Summary Error:", error);
      setAiSummary("Tahlil jarayonida xatolik yuz berdi. Iltimos keyinroq qayta urinib ko'ring.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const visiblePages = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <motion.div
      className="rating-page-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ─── Page Title ─── */}
      <div className="rating-page-header">
        <div className="rating-title-block">
          <i className="fa-solid fa-chart-bar rating-title-icon"></i>
          <div>
            <h2 className="rating-title">{t("xodimlarimkorsatkichlari")}</h2>
            <p className="rating-subtitle">{myData?.section || myData?.department || myData?.complex || ""}</p>
          </div>
        </div>
      </div>

      {/* ─── Superiors Block ─── */}
      {superiors.length > 0 && (
        <motion.div className="superiors-container mb-5" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h3 className="section-title-sm mb-4" style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--m-text)" }}>
            <i className="fa-solid fa-user-tie me-2" style={{ color: "var(--m-accent)" }}></i>Sizni baholashi mumkin bo'lgan rahbarlar
          </h3>
          <div className="superiors-grid">
            <AnimatePresence>
              {superiors.map((sup, idx) => (
                <motion.div 
                  key={sup._id} 
                  className={`superior-card role-card-${sup.role}`}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -8, boxShadow: "0 15px 35px rgba(37,99,235,0.2)" }}
                >
                  <div className={`superior-avatar avatar-${sup.role}`}>
                     {sup.name.charAt(0)}
                  </div>
                  <div className="superior-info">
                    <h5>{sup.name}</h5>
                    <p className="superior-role">
                      {sup.role === 'boss' ? 'Rahbariyat' : sup.role === 'complex' ? sup.complex : sup.role === 'department' ? sup.department : sup.section}
                    </p>
                    <span className={`badge-role bg-${sup.role}`}>{sup.role}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* ─── Stats Cards ─── */}
      <div className="rating-stats-row">
        <motion.div className="rating-stat-card rating-stat-all" whileHover={{ scale: 1.03 }}>
          <i className="fa-solid fa-layer-group"></i>
          <div>
            <span className="stat-label">{t("all")}</span>
            <span className="stat-value">{totalAll}</span>
          </div>
        </motion.div>
        <motion.div className="rating-stat-card rating-stat-rated" whileHover={{ scale: 1.03 }}>
          <i className="fa-solid fa-star"></i>
          <div>
            <span className="stat-label">{t("baholangan")}</span>
            <span className="stat-value">{totalRated}</span>
          </div>
        </motion.div>
        <motion.div className="rating-stat-card rating-stat-unrated" whileHover={{ scale: 1.03 }}>
          <i className="fa-regular fa-clock"></i>
          <div>
            <span className="stat-label">{t("baholashkk")}</span>
            <span className="stat-value">{totalUnrated}</span>
          </div>
        </motion.div>
      </div>

      {/* ─── Progress Bar ─── */}
      <div className="rating-progress-block">
        <ProgressBar style={{ height: "14px", borderRadius: "8px" }}>
          <ProgressBar animated striped variant="success" now={greenPct} label={`${greenPct}%`} key={1} />
          <ProgressBar animated variant="danger" now={redPct} label={`${redPct}%`} key={2} />
        </ProgressBar>
      </div>

      {/* ─── NEW CENTRAL AI ACTION ─── */}
      <div className="rating-central-ai-block text-center my-4 py-3">
        <Button 
          className="btn-premium-ai btn-lg d-inline-flex align-items-center px-5 py-3 shadow-lg rounded-pill"
          onClick={handleAiSectionSummarize}
          disabled={isSummarizing || totalAll === 0}
          style={{ fontSize: '1.2rem', fontWeight: '700' }}
        >
          {isSummarizing ? (
            <><Spinner animation="border" size="sm" className="me-2" /> Tahlil qilinmoqda...</>
          ) : (
            <><i className="fa-solid fa-wand-magic-sparkles me-2 fa-lg"></i> Xodimlarning bu oygi natijalari (AI)</>
          )}
        </Button>
        <div className="mt-2 text-muted small">
          <i className="fa-solid fa-circle-info me-1"></i>
          Ushbu bo'limdagi barcha xodimlarning ko'rsatkichlari bo'yicha umumiy AI tahlilini olish
        </div>
      </div>

      {/* ─── Controls Bar ─── */}
      <div className="rating-controls-bar">
        {/* Page size selector */}
        <div className="rating-control-group">
          <label className="rating-control-label">
            <i className="fa-solid fa-list-ol me-1"></i>
            {t("satrSoni")}:
          </label>
          <div className="rating-btn-group">
            {PAGE_SIZES.map((s) => (
              <button
                key={s}
                className={`rating-size-btn ${limit === s || (s === "all" && limit === "all") ? "active" : ""}`}
                onClick={() => handlePageSizeChange(s)}
              >
                {s === "all" ? t("barchasi") : s}
              </button>
            ))}
          </div>
        </div>

        {/* Filter selector */}
        <div className="rating-control-group">
          <label className="rating-control-label">
            <i className="fa-solid fa-filter me-1"></i>
            {t("filtrlash")}:
          </label>
          <div className="rating-btn-group">
            <button
              className={`rating-size-btn ${!unratedOnly ? "active" : ""}`}
              onClick={() => handleFilterChange("all")}
            >
              <i className="fa-solid fa-th-list me-1"></i>
              {t("barchasi")}
            </button>
            <button
              className={`rating-size-btn ${unratedOnly ? "active danger" : ""}`}
              onClick={() => handleFilterChange("unrated")}
            >
              <i className="fa-regular fa-clock me-1"></i>
              {t("baholanmaganlar")}
            </button>
          </div>
        </div>

        {/* Result count */}
        <div className="rating-result-info">
          <span>{totalCount} {t("jami_tartib")}</span>
        </div>
      </div>

      {/* ─── Table ─── */}
      <div className="rating-table-wrapper">
        <table className="rating-table">
          <thead>
            <tr>
              <th className="col-num">#</th>
              <th className="col-name">
                <i className="fa-solid fa-user me-2"></i>{t("fish")}
              </th>
              <th className="col-date">
                <i className="fa-solid fa-calendar-days me-2"></i>{t("bajargansana")}
              </th>
              <th className="col-status">
                <i className="fa-solid fa-star me-2"></i>{t("baholangan")}
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="rating-empty">
                      <i className="fa-solid fa-inbox"></i>
                      <p>{t("malumotyoq")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                schedules.map((item, idx) => {
                  const rowNum = limit === "all" ? idx + 1 : (page - 1) * Number(limit) + idx + 1;
                  return (
                    <motion.tr
                      key={item._id}
                      className={`rating-row ${item.rated ? "is-rated" : "is-unrated"}`}
                      onClick={() => navigate(`/${myRole}/rate/schedule/${item._id}`)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.02, duration: 0.2 }}
                      whileHover={{ scale: 1.005 }}
                    >
                      <td className="col-num">
                        <span className="row-num">{rowNum}</span>
                      </td>
                      <td className="col-name">
                        <span className="name-text">{item.beginnerName}</span>
                      </td>
                      <td className="col-date">
                        <span className="date-badge">
                          {item.startedAt ? item.startedAt.slice(0, 10) : "—"}
                        </span>
                      </td>
                      <td className="col-status">
                        {item.rated ? (
                          <span className="status-badge rated-badge">
                            <i className="fa-solid fa-star me-1"></i>
                            {item.rated}
                          </span>
                        ) : (
                          <span className="status-badge unrated-badge">
                            <i className="fa-regular fa-clock me-1"></i>
                            {t("baholashkk")}
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ─── Pagination ─── */}
      {limit !== "all" && totalPages > 1 && (
        <div className="rating-pagination">
          <button
            className="pag-btn pag-prev"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <i className="fa-solid fa-chevron-left"></i>
            <span>{t("oldingi")}</span>
          </button>

          <div className="pag-pages">
            {page > 3 && (
              <>
                <button className="pag-page-btn" onClick={() => setPage(1)}>1</button>
                {page > 4 && <span className="pag-ellipsis">…</span>}
              </>
            )}
            {visiblePages().map((p) => (
              <button
                key={p}
                className={`pag-page-btn ${p === page ? "active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            {page < totalPages - 2 && (
              <>
                {page < totalPages - 3 && <span className="pag-ellipsis">…</span>}
                <button className="pag-page-btn" onClick={() => setPage(totalPages)}>{totalPages}</button>
              </>
            )}
          </div>

          <button
            className="pag-btn pag-next"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <span>{t("keyingi")}</span>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* ─── AI Summary Modal ─── */}
      <Modal 
        show={showAiModal} 
        onHide={() => setShowAiModal(false)} 
        centered 
        size="lg"
        dialogClassName="ai-summary-modal"
        className="ai-summary-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
            Xodimlarning bu oygi natijalari (AI)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="ai-summary-body">
          {isSummarizing ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p>AI ma'lumotlarni tahlil qilmoqda...</p>
            </div>
          ) : (
            <div className="ai-content-reveal p-3">
              <FormattedTypewriter text={aiSummary} speed={5} />
              <div className="text-end text-danger danger redword mt-3">
                <small className="text-muted">
                  <i className="fa-solid fa-wand-magic-sparkles me-1"></i>
                  * AI tomonidan yaratilgan
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAiModal(false)}>
            Yopish
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
}

export default RatingMyAdmins;
