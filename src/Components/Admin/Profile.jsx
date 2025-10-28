import axios from "axios";
import { API } from "../../config";
import React, { useState, useEffect } from "react";
import logo from "../Images/logo-png.png";
import banner from "../Images/banner.png";
import Button from "react-bootstrap/Button";
import LoadingScreen from "../Additional/LoadingScreen";
import Modal from "react-bootstrap/Modal";
import FileView from "../FileView";
import LinkTelegram from "../Auth/LinkTelegram";
import LavozimYoriqnomasi from "./LavozimYoriqnomasi";
import EditProfile from "../EditProfile";
import { useTranslation } from "react-i18next";
import Accordion from "react-bootstrap/Accordion";

function Profile() {
  let token = window.localStorage.getItem("token");
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const id = window.localStorage.getItem("user_id");
  const [loading, setLoading] = useState(false);
  const [myData, setMyData] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [mySection, setMySection] = useState(null);
  const [myDepartment, setMyDepartment] = useState(null);
  const [myComplex, setMyComplex] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]); // List of uploaded files
  const [viewingFileId, setViewingFileId] = useState(null); // File ID for viewing
  let myId = window.localStorage.getItem("user_id");

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

  const [activeKey, setActiveKey] = useState("0");

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
      alert("Iltimos, barcha maydonlarni to‘ldiring va kadrlar bo‘limini ogohlantiring.");
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
      {loading && <LoadingScreen loading={true} />}
      <div className="profile-container">
        <div className="profile-left">
    <h5 className="tit">{t("myInfo")}</h5>
          <Accordion onSelect={(k) => setActiveKey(k)} flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header><i class="fa-solid fa-user passs"></i> {t("personalInfo")}</Accordion.Header>
              <Accordion.Body>
                <div className="datum">
                  <p className="ours">{t("fish")}</p>
                  <p className="theirs">{myData.name}</p>
                </div>
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
              <Accordion.Header><i class="fa-solid fa-trophy passs"></i> {t("korsatkichlarim")}</Accordion.Header>
              <Accordion.Body>
                <div className="datum">
                  <p className="ours">{t("sportnatijam")}</p>
                  <div className="theirs" style={{width: "70%"}}>
                    {myData.sport && myData.sport.length > 0 ? (
                      <>
                        {myData.sport.map((item, index) => (
                          <p key={index} className="theirs warningtext">
                            {item.norm}: {item.ball} {t("ball")}
                          </p>
                        ))}
                        <hr />
                        <strong>{t("jami")}:</strong>{" "}
                        {myData.sport.reduce((sum, item) => sum + item.ball, 0)} ball
                      </>
                    ) : (
                      <p className="theirs">{t("malumotyoq")}</p>
                    )}
                  </div>
                </div>

                <div className="datum">
                  <p className="ours">{t("tilnatijam")}</p>
                  <div className="theirs" style={{width: "70%"}}>
                    {myData.lang && myData.lang.length > 0 ? (
                      <>
                        {myData.lang.map((item, index) => (
                          <p key={index} className="theirs warningtext">
                            {item.language} - {item.norm}: {item.ball} {t("ball")}
                          </p>
                        ))}
                        <hr />
                        <strong>{t("jami")}:</strong>{" "}
                        {myData.lang.reduce((sum, item) => sum + item.ball, 0)} {t("ball")}
                      </>
                    ) : (
                      <p className="theirs">{t("malumotyoq")}</p>
                    )}
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header><i class="fa-solid fa-file passs"></i> {t("hujjatlarim")}</Accordion.Header>
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
              <Accordion.Header><i class="fa-solid fa-person-circle-check passs"></i> {t("ishdabolmagankun")}</Accordion.Header>
              <Accordion.Body>
                <select name="sabab" id="sabab" value={sabab} onChange={(e) => setSabab(e.target.value)}>
                  <option value="" disabled>{t("sababnitanlang")}</option>
                  <option value="У">{t("oquvtatilida")}</option>
                  <option value="БС">{t("administrativruxsat")}</option>
                  <option value="БЛ">{t("mehnatgalayoqatsiz")}</option>
                  <option value="ОТ">{t("mehnattatilida")}</option>
                  <option value="УВ">{t("mehnatyakunlangan")}</option>
                  <option value="К">{t("ishsafarida")}</option>
                </select>
                <div className="d-flex flex-column gap-2 mb-3">
                  <input
                    type="date"
                    value={bsStartDate}
                    onChange={(e) => setBsStartDate(e.target.value)}
                  />
                  <input
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
                  <Button variant="primary" onClick={sendBS}>{t("send")}</Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header><i class="fa-solid fa-lock passs"></i> {t("updatePass")}</Accordion.Header>
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
                    <Button className="btn-primary" onClick={handlePasswordChange}>
                      {t("updatePass")}
                    </Button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        <div className="justify-content-between d-flex align-items-center mt-4">
{myData.telegramChatId ? (
  <h5 className="text-success">Telegram bildirishnomasi: ulangan ✅</h5>
) : (
  <h5 className="text-danger">{t("Telegram bildirishnomasi: ulanmagan❌")}</h5>
)}
          <Button className="btn-danger" onClick={handleShow}>
                      {t("logOut")}{" "}
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </Button>
        </div>
        </div>
        <div className="profile-right">
          <a href="https://t.me/mkundalik_hisobot" target="_blank" rel="noopener noreferrer">
            <Button className="m-5 defaultbutton"><i class="fa-brands fa-telegram"></i> Telegram orqali bildirishnomalarni qabul qilish</Button>
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
    </>
  );
}

export default Profile;
