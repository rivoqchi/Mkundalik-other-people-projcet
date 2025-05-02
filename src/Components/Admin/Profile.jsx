import axios from "axios";
import { API } from "../../config";
import React, { useState, useEffect } from "react";
import logo from "../Images/logo2.png";
import Button from 'react-bootstrap/Button';
import LoadingScreen from "../Additional/LoadingScreen";
import Modal from 'react-bootstrap/Modal';
import FileView from "../FileView";
import LinkTelegram from "../Auth/LinkTelegram";
import LavozimYoriqnomasi from "./LavozimYoriqnomasi";
import EditProfile from "../EditProfile";
import { useTranslation } from "react-i18next";
import Accordion from 'react-bootstrap/Accordion';

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
      window.location.replace('/');
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
  return (
    <>
      {loading && <LoadingScreen loading={true} />}

      <div className="profil">
        <div className="d-flex justify-content-center align-items-center">
          <img className="profiledagilogo" src={logo} alt="logo" />
          <h1>{t("kundaliktarixim")}</h1>
        </div>
        <div className="text-end">
        <Button className="text-end" variant="primary" onClick={handleShow}>
        <i class="fa-solid fa-user-pen"></i> {t("edit")}
      </Button>
        </div>
        <h5>{t("umumiyinfo")}</h5>

        <div className="profiledatum">
        <div className="datum align-items-center">
        <p className="ours">{t("fish")}</p>
            <p className="theirs">{myData.name}</p>
          </div>

          <div className="datum align-items-center">
            <p className="ours">{t("tel")}</p>
            <p className="theirs">{myData.phone}</p>
          </div>

          {/* <div className="datum">
            <p className="ours">Telegram</p>
            <p className="theirs">
              {myData.TelegramAuth ? (
                <div className="d-flex align-items-center">
                  <img
                    className="tgprofile me-2"
                    src={myData.TelegramAuth.profile_url}
                    alt="profile photo"
                  />

                  <div className="d-flex flex-column">
                    <p className="mb-0">{myData.TelegramAuth.full_name}</p>
                    <a
                      href={`http://t.me/${myData.TelegramAuth.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none text-primary"
                    >
                      @{myData.TelegramAuth.username}
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <span className="redword">Telegram ulanmagan</span>
                  <LinkTelegram />
                </>
              )}
            </p>
          </div> */}

<div className="datum align-items-center">
<p className="ours">{t("complex")}</p>
            <p className="theirs">{myData.complex}</p>
          </div>

          <div className="datum align-items-center">
            <p className="ours">{t("department")}</p>
            <p className="theirs">{myData.department}</p>
          </div>

          <div className="datum align-items-center">
            <p className="ours">{t("section")}</p>
            <p className="theirs">{myData.section}</p>
          </div>

          <div className="datum align-items-center">
            <p className="ours">{t("degree")}</p>
            <p className="theirs">{myData.degree}</p>
          </div>

          <div className="datum align-items-center">
            <p className="ours">{t("firstAct")}</p>
            <p className="theirs">{myData.firstAct}</p>
          </div>

          <h5>{t("shaxsiymalumotlar")}</h5>

          <div className="datum align-items-center">
            <p className="ours">{t("nationality")}</p>
            <p className="theirs">{myData.nationality}</p>
          </div>

          <div className="datum align-items-center">
            <p className="ours">{t("education")}</p>
            <p className="theirs">{myData.education}</p>
          </div>

          <div className="datum align-items-center">
            <p className="ours">{t("speciality")}</p>
            <p className="theirs">{myData.speciality}</p>
          </div>

          <div className="datum align-items-center">
            <p className="ours">{t("dateOfBirth")}</p>
            <p className="theirs">{myData.dateOfBirth}</p>
          </div>

          <div className="datum align-items-center">
            <p className="ours">{t("placeOfBirth")}</p>
            <p className="theirs">{myData.placeOfBirth}</p>
          </div>

          <div className="datum align-items-center">
            <p className="ours">{t("address")}</p>
            <p className="theirs">{myData.address}</p>
          </div>

          <div className="datum align-items-center">
            <p className="ours align-items-center">{t("lavozimyoriqnomasi")}:</p>
            <LavozimYoriqnomasi />
          </div>

          <div className="datum align-items-center">
  <p className="ours">{t("sportnatijam")}</p>
  <div className="theirs">
  {myData.sport && myData.sport.length > 0 ? (
    <>
      {myData.sport.map((item, index) => (
        <p key={index} className="theirs warningtext">
          {item.norm}: {item.ball} ball
        </p>
      ))}
      <hr />
        <strong>Jami:</strong> {myData.sport.reduce((sum, item) => sum + item.ball, 0)} ball
    </>
  ) : (
    <p className="theirs">Ma'lumot yo'q</p>
  )}
  </div>
</div>
        </div>
        <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="1">
        <Accordion.Header>{t("updatePass")}</Accordion.Header>
        <Accordion.Body>
        <div className="changepass">
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
        </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <hr />
          {message && <p>{message}</p>}
    <div className="d-flex justify-content-between w-100">
            <Button className="btn-primary" onClick={handlePasswordChange}>{t("updatePass")}</Button>
            <Button className="btn-danger" onClick={handleShow}>{t("logOut")} <i className="fa-solid fa-arrow-right-from-bracket"></i></Button>
          </div>
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
    </>
  );
}

export default Profile;
