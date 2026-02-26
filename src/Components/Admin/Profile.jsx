import axios from "axios";
import { API } from "../../config";
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

function Profile() {
    const [showCelebration, setShowCelebration] = useState(false);
  let token = window.localStorage.getItem("token");
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
        const res = await fetch(`${API}/auth/counthisobot?_id=${user_id}`);
        if (res.ok) {
          const data = await res.json();
          setReportCount(data.count || 0);
        } else {
          setReportCount(0);
        }
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
  const logout = async () => {
    try {
      const response = await axios.get(`${API}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      window.localStorage.clear();
      window.location.replace("/");
    } catch (error) {
      console.error("Chiqishda xatolik yuz berdi:", error);
    }
  };
  const getMyData = async () => {
    setLoading(true);
    const { data } = await axios.get(`${API}/auth/mydata/${id}`);
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

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      setMessage("Iltimos, barcha maydonlarni to‘ldiring");
      return;
    }

    try {
      const response = await axios.put(`${API}/auth/changepass/${id}`, {
        oldPassword,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Xatolik yuz berdi");
    }
  };

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
      });
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
      <div className="profile-container">
        <div className="profile-left">
          <h5 className="tit d-flex">{myData.name} - <div className="tangacha"><i class="fa-solid fa-coins"></i> {reportCount}</div></h5>
          <Accordion defaultActiveKey="1" onSelect={(k) => setActiveKey(k)} flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <i class="fa-solid fa-user passs"></i> {t("personalInfo")}
              </Accordion.Header>
              <Accordion.Body>
                <div className="datum">
                  <p className="ours">{t("tel")}</p>
                  <p className="theirs">{myData.phone}</p>
                </div>
                <div className="datum">
                  <p className="ours">{t("dateOfBirth")}</p>
                  <p className="theirs">{myData.dateOfBirth}</p>
                </div>
                <div className="datum">
                  <p className="ours">{t("address")}</p>
                  <p className="theirs">{myData.address}</p>
                </div>
                <div className="datum">
                  <p className="ours">{t("complex")}</p>
                  <p className="theirs">{myData.complex}</p>
                </div>
                <div className="datum">
                  <p className="ours">{t("department")}</p>
                  <p className="theirs">{myData.department}</p>
                </div>
                <div className="datum">
                  <p className="ours">{t("section")}</p>
                  <p className="theirs">{myData.section}</p>
                </div>
                <div className="datum">
                  <p className="ours">{t("degree")}</p>
                  <p className="theirs">{myData.degree}</p>
                </div>
                <div className="datum">
                  <p className="ours">{t("nationality")}</p>
                  <p className="theirs">{myData.nationality}</p>
                </div>
                <div className="datum">
                  <p className="ours">{t("education")}</p>
                  <p className="theirs">{myData.education}</p>
                </div>
                <div className="datum">
                  <p className="ours">{t("speciality")}</p>
                  <p className="theirs">{myData.speciality}</p>
                </div>
                <div className="datum">
                  <p className="ours">{t("placeOfBirth")}</p>
                  <p className="theirs">{myData.placeOfBirth}</p>
                </div>
                <div className="datum">
                  <p className="ours">{t("firstAct")}</p>
                  <p className="theirs">{myData.firstAct}</p>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <i class="fa-solid fa-trophy passs"></i> {t("korsatkichlarim")}
              </Accordion.Header>
              <Accordion.Body>
                <div className="datum">
                  {/* Yuqori qatordagi active boxlar */}
                  <div className="achi-boxes">
                    {[500, 400, 300, 200, 150, 100, 75, 50, 10, 3, 1].map(
                      (num, idx) =>
                        num <= reportCount ? (
                          <div
                            key={idx}
                            className="achi-box active"
                            onClick={() => handleAchievementClick(num)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleAchievementClick(num)
                            }
                          >
                            {num}
                          </div>
                        ) : null
                    )}
                    <div
                      className="achi-box active anniversary-badge"
                      onClick={handleAnniversaryClick}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAnniversaryClick()
                      }
                    >
                      <img
                        src={year1}
                        alt="1 year anniversary"
                        className="anniversary-image"
                      />
                    </div>
                  </div>

                  {/* Jarayonda qismi */}
                  {reportCount < 1000 && (
                    <div className="in-progress-section">
                      <p className="in-progress-title">Jarayonda</p>
                      <div className="achi-boxes">
                        {[1, 3, 10, 50, 75, 100, 150, 200, 300, 400, 500]
                          .filter((num) => num > reportCount)
                          .map((num, idx) => {
                            const percent = Math.min(
                              (reportCount / num) * 100,
                              100
                            ).toFixed(0);
                            return (
                              <div key={idx} className="achi-box inactive">
                                {num}
                                <span className="percent">{percent}%</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <i class="fa-solid fa-file passs"></i> {t("hujjatlarim")}
              </Accordion.Header>
              <Accordion.Body>
                <div className="datum align-items-center">
                  <p className="ours align-items-center">
                    {t("lavozimyoriqnomasi")}:
                  </p>
                  <LavozimYoriqnomasi />
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>
                <i class="fa-solid fa-person-circle-check passs"></i>{" "}
                {t("ishdabolmagankun")}
              </Accordion.Header>
              <Accordion.Body>
                <select
                  name="sabab"
                  className="rrr"
                  id="sabab"
                  value={sabab}
                  onChange={(e) => setSabab(e.target.value)}
                >
                  <option value="" disabled>
                    {t("sababnitanlang")}
                  </option>
                  <option value="У">{t("oquvtatilida")}</option>
                  <option value="БС">{t("administrativruxsat")}</option>
                  <option value="БЛ">{t("mehnatgalayoqatsiz")}</option>
                  <option value="ОТ">{t("mehnattatilida")}</option>
                  <option value="УВ">{t("mehnatyakunlangan")}</option>
                  <option value="К">{t("ishsafarida")}</option>
                </select>
                <div className="d-flex row flex-column gap-2 mb-3">
                  <input
                    type="date"
                    className="rrr col-6"
                    value={bsStartDate}
                    onChange={(e) => setBsStartDate(e.target.value)}
                  />
                  <input
                    className="rrr col-6"
                    type="date"
                    value={bsEndDate}
                    onChange={(e) => setBsEndDate(e.target.value)}
                  />
                  <p className="danger">{t("tatildavrida")}</p>
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="mx-2"
                      name="ogoh"
                      id="ogoh"
                      checked={ogoh}
                      onChange={(e) => setOgoh(e.target.checked)}
                    />
                    {t("kadrlarboliminiogoh")}
                  </div>
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="mx-2"
                      name="ogoh"
                      id="ogoh2"
                      checked={ogoh2}
                      onChange={(e) => setOgoh2(e.target.checked)}
                    />
                    {t("asoskadrda")}
                  </div>
                  <p className="redword">⚠️ {t("diqqatqilingg")}</p>
                  <Button variant="primary" onClick={sendBS}>
                    {t("send")}
                  </Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>
                <i class="fa-solid fa-lock passs"></i> {t("updatePass")}
              </Accordion.Header>
              <Accordion.Body>
                <div className="changepass d-flex flex-column gap-3">
                  <input
                    type="password"
                    placeholder={t("oldPass")}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder={t("newPass")}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {message && <p>{message}</p>}
                  <div className="d-flex justify-content-start gap-3">
                    <Button
                      className="btn-primary"
                      onClick={handlePasswordChange}
                    >
                      {t("updatePass")}
                    </Button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <div className="justify-content-between d-flex align-items-center mt-4">
            {myData.telegramChatId ? (
              <h5 className="text-success">
                Telegram bildirishnomasi: ulangan ✅
              </h5>
            ) : (
              <h5 className="text-danger">
                {t("Telegram bildirishnomasi: ulanmagan❌")}
              </h5>
            )}
            <Button className="btn-primary" onClick={handleShow2}>
              {t("edit")} <i className="fa-solid fa-pen"></i>
            </Button>
            <Button className="btn-danger" onClick={handleShow}>
              {t("logOut")}{" "}
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </Button>
          </div>
          <div className="qor">
<label style={{ cursor: "pointer" }}>
  <input
    type="checkbox"
    checked={isChecked}
    onChange={(e) => {
      const checked = e.target.checked;

      // checkbox ON → snow = false
      const snowValue = !checked;

      setIsChecked(checked);
      localStorage.setItem("snow", snowValue.toString());

      window.location.reload();
    }}
  />{" "}
  Qor animatsiyasini o`chirish
</label>


          </div>
        </div>
        <div className="profile-right">
          <img
        className="mt-5"
        src={yosh1}
        alt=""
        style={{ cursor: "pointer" }}
        onClick={() => setShowCelebration(true)}
      />

      <CelebrationModal
        show={showCelebration}
        setShow={setShowCelebration}
      />
          <a
            href="https://t.me/mkundalik_hisobot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="m-5 defaultbutton">
              <i class="fa-brands fa-telegram"></i> Telegram orqali
              bildirishnomalarni qabul qilish
            </Button>
          </a>
          <img src={banner} alt="banner" />
        </div>
        {/* <div className="profile-right2">
          <button>sad</button>
          <img src={banner} alt="banner" />
        </div> */}
      </div>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("logOut")}</Modal.Title>
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

      <Modal centered show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>{t("edit")}</Modal.Title>
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
      >
        <Modal.Header closeButton style={{ borderBottom: "2px solid #ffc107" }}>
          <Modal.Title>
            <i
              className="fa-solid fa-star"
              style={{ color: "#ffc107", marginRight: "8px" }}
            ></i>
            Tabriklaymiz!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center", padding: "30px 20px" }}>
          {selectedAchievement === "anniversary" ? (
            <>
              <div style={{ marginBottom: "20px" }}>
                <img
                  src={yosh1}
                  alt="1 year anniversary"
                  style={{
                    maxHeight: "120px",
                    height: "auto",
                    borderRadius: "20px",
                    marginBottom: "15px",
                  }}
                />
              </div>
              <h5
                style={{
                  fontSize: "20px",
                  marginBottom: "15px",
                  fontWeight: "600",
                }}
              >
                Hurmatli {fullName}!
              </h5>
              <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
                Siz <strong>mkundalik</strong> platformasida{" "}
                <strong>1 yil</strong> davomida faoliyat ko'rsatayotganingizdan
                xursandmiz! 🎉
              </p>
              <p style={{ fontSize: "14px", fontStyle: "italic" }}>
                Sizning mehnatingu va dedikatsiyangiz uchun rahmat. Keling,
                yangi maqsadlarga erishib, birga rivojlanib boramiz!
              </p>
            </>
          ) : (
            <>
              <h3
                style={{
                  fontSize: "48px",
                  color: "#ffc107",
                  marginBottom: "15px",
                  fontWeight: "700",
                }}
              >
                {selectedAchievement}
              </h3>
              <h5
                style={{
                  fontSize: "18px",
                  marginBottom: "15px",
                  fontWeight: "600",
                }}
              >
                Hurmatli {fullName}!
              </h5>
              <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
                Siz bugun qadar{" "}
                <strong>{selectedAchievement} ta hisobot</strong> yozgansiz! 📊
              </p>
              <p style={{ fontSize: "14px", fontStyle: "italic" }}>
                Bunday yuqori samaradorlik va mehnatni davom ettiring! Sizning
                kotribusiyangiz juda muhim! 💪
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "2px solid #ffc107" }}>
          <Button
            variant="warning"
            onClick={() => setShowAchievementModal(false)}
            style={{ fontWeight: "600" }}
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
