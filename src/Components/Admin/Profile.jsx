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
function Profile() {
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
          <h1>Xodim profili</h1>
        </div>
        <div className="text-end">
        <Button className="text-end" variant="primary" onClick={handleShow}>
        <i class="fa-solid fa-user-pen"></i> Tahrirlash
      </Button>
        </div>
        <h5>Umumiy ma'lumotlar</h5>

        <div className="profiledatum">
          <div className="datum">
            <p className="ours">F.I.Sh</p>
            <p className="theirs">{myData.name}</p>
          </div>

          <div className="datum">
            <p className="ours">Telefon raqam</p>
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

          <div className="datum">
            <p className="ours">Kompleks</p>
            <p className="theirs">{myData.complex}</p>
          </div>

          <div className="datum">
            <p className="ours">Xizmat</p>
            <p className="theirs">{myData.department}</p>
          </div>

          <div className="datum">
            <p className="ours">Bo`lim</p>
            <p className="theirs">{myData.section}</p>
          </div>

          <div className="datum">
            <p className="ours">Lavozim</p>
            <p className="theirs">{myData.degree}</p>
          </div>

          <div className="datum">
            <p className="ours">Ro`yxatdan o`tgan sana</p>
            <p className="theirs">{myData.firstAct}</p>
          </div>

          <h5>Shaxsiy ma'lumotlar</h5>

          <div className="datum">
            <p className="ours">Millati</p>
            <p className="theirs">{myData.nationality}</p>
          </div>

          <div className="datum">
            <p className="ours">Ma'lumot</p>
            <p className="theirs">{myData.education}</p>
          </div>

          <div className="datum">
            <p className="ours">Yo`nalish</p>
            <p className="theirs">{myData.speciality}</p>
          </div>

          <div className="datum">
            <p className="ours">Tug`ilgan sana</p>
            <p className="theirs">{myData.dateOfBirth}</p>
          </div>

          <div className="datum">
            <p className="ours">Tug`ilgan manzil</p>
            <p className="theirs">{myData.placeOfBirth}</p>
          </div>

          <div className="datum">
            <p className="ours">Yashash manzil</p>
            <p className="theirs">{myData.address}</p>
          </div>

          {/* <div className="datum align-items-center">
            <p className="ours align-items-center">Lavozim yo`riqnomasi:</p>
            <LavozimYoriqnomasi />
          </div> */}
        </div>

        <h5>Parolni yangilash</h5>
        <div className="changepass">
          <input
            type="password"
            placeholder="Eski parolni kiriting:"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Yangi parol yarating:"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handlePasswordChange}>Parolni Yangilash</button>
          {message && <p>{message}</p>}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ma'lumotlarni o`zgartirish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditProfile/>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Profile;
