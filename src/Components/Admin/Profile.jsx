import axios from "axios";
import { API } from "../../config";
import { signout } from '../Auth/CheckAuth';
import React, { useState, useEffect } from "react";
import logo from "../Images/logo-png.png";
import year1 from "../Images/1year.png";
import yosh1 from "../Images/1yosh.jpg";
import banner from "../Images/banner.png";
import Button from "react-bootstrap/Button";
import { useLoading } from "../Additional/LoadingScreen";
import Modal from "react-bootstrap/Modal";
import FileView from "../FileView";
import LinkTelegram from "../Auth/LinkTelegram";
import LavozimYoriqnomasi from "./LavozimYoriqnomasi";
import EditProfile from "../EditProfile";
import { useTranslation } from "react-i18next";
import Accordion from "react-bootstrap/Accordion";
import CelebrationModal from "../Celebration";
import avatarr from "../Images/avatarr.png";
import { Link } from "react-router-dom";
import { requestNotificationPermission } from "../Additional/NotificationManager";
function Profile() {
  const [showCelebration, setShowCelebration] = useState(false);
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const id = window.localStorage.getItem("user_id");
  const { setLoading } = useLoading();
  const [myData, setMyData] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [mySection, setMySection] = useState(null);
  const [myDepartment, setMyDepartment] = useState(null);
  const [myComplex, setMyComplex] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]); // List of uploaded files
  const [viewingFileId, setViewingFileId] = useState(null); // File ID for viewing
  let myId = window.localStorage.getItem("user_id");
  const [isOn, setIsOn] = useState(false);
  useEffect(() => {
    const stopSnow = localStorage.getItem("stop-snow") === "true";
    setIsOn(stopSnow);
  }, []);
  const [isChecked, setIsChecked] = useState(() => {
    const snow = localStorage.getItem("snow");
    return snow === null ? true : snow === "false";
  });


  const [reportCount, setReportCount] = useState(0);
  const user_id = localStorage.getItem("user_id");
  const fullName = localStorage.getItem("fullName") || "";

  useEffect(() => {
    async function fetchReportCount() {
      try {
        const { data } = await axios.get(`${API}/auth/counthisobot?_id=${user_id}`);
        setReportCount(data.count || 0);
      } catch (error) {
        setReportCount(0);
      }
    }
    if (user_id) {
      fetchReportCount();
    }
  }, [user_id]);

  const handleChange = () => {
    const newValue = !isOn;
    setIsOn(newValue);

    // true bo‘lsa qor o‘chadi, false bo‘lsa yoqiladi
    localStorage.setItem("stop-snow", newValue.toString());

    // agar xohlasangiz darhol effekt ko‘rish uchun
    window.location.reload();
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleBS = () => setBS(true);

  const [show2, setShow2] = useState(false);
  const [BS, setBS] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleCloseBS = () => setBS(false);
  const handleShow2 = () => setShow2(true);

  const [bsStartDate, setBsStartDate] = useState("");
  const [bsEndDate, setBsEndDate] = useState("");
  const [sabab, setSabab] = useState("");
  const [ogoh, setOgoh] = useState(false);
  const [ogoh2, setOgoh2] = useState(false);

  const [activeKey, setActiveKey] = useState("1");

  // Achievement Modal states
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Handle achievement box click
  const handleAchievementClick = (num) => {
    setSelectedAchievement(num);
    setShowAchievementModal(true);
  };

  // Handle anniversary achievement click
  const handleAnniversaryClick = () => {
    setSelectedAchievement("anniversary");
    setShowAchievementModal(true);
  };

  const handleViewFile = (fileId) => {
    setViewingFileId(fileId);
  };

  const logout = () => {
    signout(() => {
      window.location.replace("/");
    });
  };

  const getMyData = async () => {
    setLoading(true);
    const { data } = await axios.get(`${API}/auth/mydata/${id}`, { withCredentials: true });

    setMyData(data.user);
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
    setMySection(data.user.section);
    setMyDepartment(data.user.department);
    setMyComplex(data.user.complex);
    setLoading(false);
  };
  useEffect(() => {
    getMyData();
  }, []);

  const sendBS = async () => {
    if (!sabab || !bsStartDate || !bsEndDate || !ogoh || !ogoh2) {
      alert(
        "Iltimos, barcha maydonlarni to‘ldiring va kadrlar bo‘limini ogohlantiring."
      );
      return;
    }
    try {
      await axios.post(`${API}/auth/bs`, {
        userId: myData._id,
        sabab,
        startDate: bsStartDate,
        endDate: bsEndDate,
      }, { withCredentials: true });

      alert("Ma’lumot muvaffaqiyatli yuborildi!");
      setBS(false);
      setBsStartDate("");
      setBsEndDate("");
      setSabab("");
      setOgoh(false);
      setOgoh2(false);
    } catch (error) {
      alert("Xatolik yuz berdi");
      console.error(error);
    }
  };

  return (
    <>
      <div className="profile-wrapper-premium">
        <div className="profile-header-banner">
          <div className="banner-overlay"></div>
          <Link to={`/${myRole}/profile/security`} className="security-banner-btn" title={t("Xavfsizlik")}>
            <i className="fa-solid fa-shield-halved"></i>
            <span className="d-none d-md-inline ms-1">{t("Xavfsizlik")}</span>
          </Link>
          <div className="profile-user-info">
            <div className="profile-avatar-wrapper" onClick={() => setShowCelebration(true)}>
              <img src={avatarr} alt="Avatar" className="profile-avatar-main" />
              <div className="avatar-pulse"></div>
            </div>
            <div className="profile-names">
              <h2 className="user-title-name">{myData.name}</h2>
              <div className="user-meta-info">
                <span className="meta-item"><i className="fa-solid fa-coins"></i> {reportCount} {t("tangacha")}</span>
                <span className="meta-divider">|</span>
                <span className="meta-item"><i className="fa-solid fa-building"></i> {myData.department}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-grid-layout">
          <div className="profile-main-content">
            <Accordion defaultActiveKey="0" onSelect={(k) => setActiveKey(k)} flush className="premium-accordion">
              <Accordion.Item eventKey="0" className="glass-accordion-item">
                <Accordion.Header>
                  <div className="header-content">
                    <i className="fa-solid fa-user-gear"></i>
                    <span>{t("personalInfo")}</span>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="premium-info-grid">
                    <div className="info-card-mini">
                      <span className="label">{t("tel")}</span>
                      <span className="value">{myData.phone}</span>
                    </div>
                    <div className="info-card-mini">
                      <span className="label">{t("dateOfBirth")}</span>
                      <span className="value">{myData.dateOfBirth}</span>
                    </div>
                    <div className="info-card-mini">
                      <span className="label">{t("address")}</span>
                      <span className="value">{myData.address}</span>
                    </div>
                    <div className="info-card-mini">
                      <span className="label">{t("complex")}</span>
                      <span className="value">{myData.complex}</span>
                    </div>
                    <div className="info-card-mini">
                      <span className="label">{t("department")}</span>
                      <span className="value">{myData.department}</span>
                    </div>
                    <div className="info-card-mini">
                      <span className="label">{t("section")}</span>
                      <span className="value">{myData.section}</span>
                    </div>
                    <div className="info-card-mini">
                      <span className="label">{t("degree")}</span>
                      <span className="value">{myData.degree}</span>
                    </div>
                    <div className="info-card-mini">
                      <span className="label">{t("nationality")}</span>
                      <span className="value">{myData.nationality}</span>
                    </div>
                    <div className="info-card-mini">
                      <span className="label">{t("education")}</span>
                      <span className="value">{myData.education}</span>
                    </div>
                    <div className="info-card-mini">
                      <span className="label">{t("speciality")}</span>
                      <span className="value">{myData.speciality}</span>
                    </div>
                    <div className="info-card-mini">
                      <span className="label">{t("placeOfBirth")}</span>
                      <span className="value">{myData.placeOfBirth}</span>
                    </div>
                    <div className="info-card-mini">
                      <span className="label">{t("firstAct")}</span>
                      <span className="value">{myData.firstAct}</span>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>


              <Accordion.Item eventKey="1" className="glass-accordion-item">
                <Accordion.Header>
                  <div className="header-content">
                    <i className="fa-solid fa-trophy"></i>
                    <span>{t("korsatkichlarim")}</span>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="achievements-container-premium">
                    {/* Yuqori qatordagi active boxlar */}
                    <div className="achi-grid-premium">
                      {[500, 400, 300, 200, 150, 100, 75, 50, 10, 3, 1].map(
                        (num, idx) =>
                          num <= reportCount ? (
                            <div
                              key={idx}
                              className="achi-badge-premium active"
                              onClick={() => handleAchievementClick(num)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleAchievementClick(num)
                              }
                            >
                              <div className="badge-icon"><i className="fa-solid fa-award"></i></div>
                              <span className="badge-number">{num}</span>
                            </div>
                          ) : null
                      )}
                      <div
                        className="achi-badge-premium active anniversary-special"
                        onClick={handleAnniversaryClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAnniversaryClick()
                        }
                      >
                        <img
                          src={year1}
                          alt="1 year"
                          className="anniversary-img-tiny"
                        />
                      </div>
                    </div>

                    {/* Jarayonda qismi */}
                    {reportCount < 1000 && (
                      <div className="progress-milestones-section">
                        <h6 className="section-subtitle">{t("inProgress")}</h6>
                        <div className="achi-grid-premium">
                          {[1, 3, 10, 50, 75, 100, 150, 200, 300, 400, 500]
                            .filter((num) => num > reportCount)
                            .map((num, idx) => {
                              const percent = Math.min(
                                (reportCount / num) * 100,
                                100
                              ).toFixed(0);
                              return (
                                <div key={idx} className="achi-badge-premium locked">
                                  <span className="badge-number">{num}</span>
                                  <div className="milestone-progress">
                                    <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                                  </div>
                                  <span className="percent-label">{percent}%</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              {/* <Accordion.Item eventKey="2" className="glass-accordion-item">
                <Accordion.Header>
                  <div className="header-content">
                    <i className="fa-solid fa-file-shield"></i>
                    <span>{t("hujjatlarim")}</span>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="premium-doc-row">
                    <div className="doc-info">
                      <i className="fa-solid fa-file-pdf doc-icon"></i>
                      <div>
                        <span className="doc-label">{t("lavozimyoriqnomasi")}</span>
                        <p className="doc-desc">Sizning rasmiy majburiyatlaringiz ro'yxati</p>
                      </div>
                    </div>
                    <LavozimYoriqnomasi />
                  </div>
                </Accordion.Body>
              </Accordion.Item> */}

              <Accordion.Item eventKey="3" className="glass-accordion-item">
                <Accordion.Header>
                  <div className="header-content">
                    <i className="fa-solid fa-calendar-minus"></i>
                    <span>{t("ishdabolmagankun")}</span>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="premium-form-container">
                    <div className="form-grid-premium">
                      <div className="form-group-premium">
                        <label>{t("sabab")}</label>
                        <div className="premium-select-wrapper">
                          <select
                            name="sabab"
                            className="premium-select"
                            id="sabab"
                            value={sabab}
                            onChange={(e) => setSabab(e.target.value)}
                          >
                            <option value="" disabled>{t("sababnitanlang")}</option>
                            <option value="У">{t("oquvtatilida")}</option>
                            <option value="БС">{t("administrativruxsat")}</option>
                            <option value="БЛ">{t("mehnatgalayoqatsiz")}</option>
                            <option value="ОТ">{t("mehnattatilida")}</option>
                            <option value="УВ">{t("mehnatyakunlangan")}</option>
                            <option value="К">{t("ishsafarida")}</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group-premium">
                        <label>{t("startDate")}</label>
                        <div className="premium-input-wrapper">
                          <i className="fa-solid fa-calendar-day input-icon"></i>
                          <input
                            type="date"
                            className="premium-input-field date-field"
                            value={bsStartDate}
                            onChange={(e) => setBsStartDate(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group-premium">
                        <label>{t("endDate")}</label>
                        <div className="premium-input-wrapper">
                          <i className="fa-solid fa-calendar-check input-icon"></i>
                          <input
                            className="premium-input-field date-field"
                            type="date"
                            value={bsEndDate}
                            onChange={(e) => setBsEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="warning-box-premium mt-3">
                      <p><i className="fa-solid fa-circle-exclamation"></i> {t("tatildavrida")}</p>
                    </div>

                    <div className="checkbox-group-premium mt-3">
                      <label className="checkbox-container-premium">
                        <input
                          type="checkbox"
                          checked={ogoh}
                          onChange={(e) => setOgoh(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <span className="cb-text">{t("kadrlarboliminiogoh")}</span>
                      </label>
                      <label className="checkbox-container-premium">
                        <input
                          type="checkbox"
                          checked={ogoh2}
                          onChange={(e) => setOgoh2(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <span className="cb-text">{t("asoskadrda")}</span>
                      </label>
                    </div>

                    <div className="form-footer-premium">
                      <p className="footer-note">⚠️ {t("diqqatqilingg")}</p>
                      <Button variant="primary" className="btn-send-premium" onClick={sendBS}>
                        <i className="fa-solid fa-paper-plane"></i> {t("send")}
                      </Button>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>


            </Accordion>

            <div className="profile-actions-area">
              <div className="status-indicator-card glass-card">
                <div className="indicator-content">
                  <div className={`indicator-dot ${myData.telegramChatId ? 'active' : 'inactive'}`}></div>
                  <div className="indicator-text">
                    <span className="label">Telegram Bildirishnomasi</span>
                    <span className={`status-text ${myData.telegramChatId ? 'text-success' : 'text-danger'}`}>
                      {myData.telegramChatId ? 'Ulangan ✅' : 'Ulanmagan ❌'}
                    </span>
                  </div>
                </div>
                <a href="https://t.me/mkundalik_hisobot" target="_blank" rel="noopener noreferrer" className="no-decor">
                  <Button className="btn-telegram-link">
                    <i className="fa-brands fa-telegram"></i> {t("linkTelegram")}
                  </Button>
                </a>
              </div>

              <div className="status-indicator-card glass-card">
                <div className="indicator-content">
                  <div className={`indicator-dot ${("Notification" in window) ? (Notification.permission === 'granted' ? 'active' : (Notification.permission === 'denied' ? 'inactive' : 'pending')) : 'inactive'}`}></div>
                  <div className="indicator-text">
                    <span className="label">Brauzer Bildirishnomasi</span>
                    <span className={`status-text ${("Notification" in window) ? (Notification.permission === 'granted' ? 'text-success' : (Notification.permission === 'denied' ? 'text-danger' : 'text-warning')) : 'text-secondary'}`}>
                      {!("Notification" in window) 
                        ? 'Qurilmangizda qo‘llab-quvvatlanmaydi ❌' 
                        : (Notification.permission === 'granted' ? 'Ruxsat berilgan ✅' : (Notification.permission === 'denied' ? 'Bloklangan ❌' : 'Ruxsat so‘ralmagan ⚠️'))}
                    </span>
                  </div>
                </div>
                {("Notification" in window) ? (
                  <Button 
                    className="btn-browser-notif" 
                    variant={Notification.permission === 'granted' ? "success" : "primary"}
                    onClick={async () => { 
                      await requestNotificationPermission(); 
                      window.location.reload(); 
                    }} 
                    disabled={Notification.permission === 'granted'}
                    style={{ background: Notification.permission === 'granted' ? '#10b981' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', border: 'none' }}
                  >
                    <i className="fa-solid fa-bell"></i> {Notification.permission === 'granted' ? 'Yoqilgan' : 'Yoqish'}
                  </Button>
                ) : (
                  <p className="small text-muted mt-2" style={{fontSize: '11px'}}>
                    iPhone'da bildirishnoma olish uchun saytni "Home Screen"ga qo'shing.
                  </p>
                )}
              </div>

              <div className="settings-controls glass-card">
                <div className="snow-toggle-area">
                  <label className="premium-switch">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const snowValue = !checked;
                        setIsChecked(checked);
                        localStorage.setItem("snow", snowValue.toString());
                        window.location.reload();
                      }}
                    />
                    <span className="slider round"></span>
                    <span className="switch-label">Sahifa animatsiyasi</span>
                  </label>
                </div>

                <div className="action-buttons-group">
                  <Button className="btn-edit-premium" onClick={handleShow2}>
                    <i className="fa-solid fa-pen-nib"></i> {t("edit")}
                  </Button>
                  <Button className="btn-logout-premium" onClick={handleShow}>
                    <i className="fa-solid fa-power-off"></i> {t("logOut")}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-sidebar-premium">
            <div className="sidebar-image-card glass-card">
              <img src={banner} alt="Banner" className="sidebar-banner-img" />
              <div className="banner-overlay-text">
              </div>
            </div>

            <div className="quick-stats-card glass-card">
              <h5>{t("statistika")}</h5>
              <div className="mini-stat-row">
                <span>Hisobotlar</span>
                <span className="stat-val">{reportCount}</span>
              </div>
              <div className="mini-stat-progress">
                <div className="progress-bar-inner" style={{ width: `${Math.min((reportCount / 500) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <Modal centered show={show} onHide={handleClose} className="premium-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa-solid fa-right-from-bracket"></i>
            {t("logOut")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("profildanchiqmoqchimisiz")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("bekorqilish")}
          </Button>
          <Button variant="danger" onClick={logout}>
            {t("logOut")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal centered show={show2} onHide={handleClose2} className="premium-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa-solid fa-user-pen"></i>
            {t("edit")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditProfile />
        </Modal.Body>
      </Modal>

      {/* Achievement Congratulations Modal */}
      <Modal
        centered
        show={showAchievementModal}
        onHide={() => setShowAchievementModal(false)}
        className="premium-modal celebration-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa-solid fa-trophy"></i>
            Tabriklaymiz!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="celebration-content">
            {selectedAchievement === "anniversary" ? (
              <>
                <img src={yosh1} alt="Anniversary" className="anniversary-img-large" />
                <h5>Hurmatli {fullName}!</h5>
                <p>
                  Siz <strong>mkundalik</strong> platformasida <strong>1 yil</strong> davomida faoliyat ko'rsatayotganingizdan xursandmiz! 🎉
                </p>
                <p className="small-note">
                  Sizning mehnatingiz va sodiqligingiz uchun rahmat. Birgalikda yangi marralarni zabt etamiz!
                </p>
              </>
            ) : (
              <>
                <div className="trophy-display">
                  <i className="fa-solid fa-award"></i>
                </div>
                <h3>{selectedAchievement}</h3>
                <h5>Hurmatli {fullName}!</h5>
                <p>
                  Siz bugungi kunga qadar <strong>{selectedAchievement} ta hisobot</strong> yozdingiz! 📊
                </p>
                <p className="small-note">
                  Bunday yuqori samaradorlikni davom ettiring! Sizning hissangiz biz uchun juda muhim. 💪
                </p>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            onClick={() => setShowAchievementModal(false)}
          >
            Yopish
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <div style={{ width: "100%", height: "100%", border: "1px solid #ddd" }}>
        <iframe
          src="https://mkundalik.uz/about"
          style={{ width: "100%", height: "100%", border: 0 }}
          title="Tashmetro Schedule"
        ></iframe>
      </div> */}
    </>
  );
}

export default Profile;
