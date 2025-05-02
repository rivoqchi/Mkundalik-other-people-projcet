import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../config";
import Alert from "../Additional/Alert";
import LoadingScreen from "../Additional/LoadingScreen";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import calendar from "../Images/calendar.png";
function ScheduleNew() {
  const { t } = useTranslation();

  const myId = window.localStorage.getItem("user_id");
  const [myName, setMyName] = useState([]);
  const [mySection, setMySection] = useState([]);
  const [myDepartment, setMyDepartment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myComplex, setMyComplex] = useState([]);
  const [myPosition, setMyPosition] = useState([]);
  const [myDegree, setMyDegree] = useState([]);
  const [myRole, setMyRole] = useState([]);

  const getMyData = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
      setMyName(data.user.name);
      setMyRole(data.user.role);
      setMySection(data.user.section);
      setMyDepartment(data.user.department);
      setMyComplex(data.user.complex);
      setMyDegree(data.user.degree);
      setMyPosition(data.user.employee);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getMyData();
  }, []);

  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [date, setDate] = useState("");
  const [onWork, setOnWork] = useState(false);
  const [workingOn, setWorkingOn] = useState(null);
  const [timer, setTimer] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [startedAt, setStartedAt] = useState("");

  const [countdown, setCountdown] = useState(5);

  // Modal holatlari
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [terminate, setTerminate] = useState("");
  const [type, setType] = useState("");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null); // Edit va Delete uchun
  const [taskData, setTaskData] = useState(""); // Yangi yoki o'zgartirilgan vazifa uchun  const [taskData, setTaskData] = useState(""); // Yangi yoki o'zgartirilgan vazifa uchun
  // Modalni yopish funksiyalari
  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleCloseCreate = () => setShowCreate(false);
  const handleCloseEnd = () => setShowEnd(false);
  const handleCloseStart = () => setShowStart(false);

  const handleShowEdit = (index, title, source) => {
    setCurrentTaskIndex(index);
    setTaskData(title);
    setType(source);
    setShowEdit(true);
  };
  const handleShowStart = () => {
    setShowStart(true);
  };
  // Delete funksiyasi
  const handleShowDelete = (index) => {
    setCurrentTaskIndex(index);
    setShowDelete(true);
  };

  const handleShowCreate = () => {
    setTaskData("");
    setShowCreate(true);
  };

  const handleShowEnd = () => {
    setShowEnd(true);
  };
  if (myPosition === false) {
    navigate("/fill");
  }
  // Sana va ish holatini olish
  useEffect(() => {
    const currentDate = new Date()
      .toLocaleDateString("en-GB")
      .replace(/[/]/g, ".");
    setDate(currentDate);
    console.log(currentDate);

    axios
      .get(`${API}/schedules/checktoday/${myId}`)
      .then((res) => {
        if (res.data.message === "notOnWork") {
          setOnWork(false);
          setLoading(false);
        } else {
          const fetchedWorkingOn = res.data.workingOn || {};
          const today = new Date().toLocaleDateString("en-GB");
          const startedDate = fetchedWorkingOn.startedAt?.split(" ")[0];
          setOnWork(true);
          setLoading(false);

          if (startedDate !== today) {
            if (fetchedWorkingOn.tasks && fetchedWorkingOn.tasks.length > 0) {
              console.log(`Avto yakunlash, ${myId}, ${fetchedWorkingOn._id}`);
              axios
                .put(`${API}/schedules/terminate/${fetchedWorkingOn._id}`, {
                  myId,
                })
                .then(
                  (response) => console.log("Avto yakunlandi:", response.data),
                  setTerminate("Auto terminated"),
                  setOnWork(false),
                  setTasks([])
                )
                .catch((error) =>
                  console.error("Avto yakunlashda xatolik:", error)
                );
            } else {
              axios
                .delete(
                  `${API}/schedules/deletethis/${fetchedWorkingOn._id}?myId=${myId}`
                )
                .then(
                  (response) => console.log("O'chirildi:", response.data),
                  setTerminate("Auto deleted"),
                  setOnWork(false),
                  setTasks([])
                )
                .catch((error) => console.error("O‘chirishda xatolik:", error));
            }
          } else {
            console.log("Davom eting...");
          }

          setWorkingOn(fetchedWorkingOn);
          setTasks(fetchedWorkingOn.tasks || []);

          // Sekundomer boshlanish vaqtini sozlash
          if (fetchedWorkingOn.startedAt) {
            const start = new Date(
              fetchedWorkingOn.startedAt.replace(
                /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/,
                "$3-$2-$1T$4:$5"
              )
            ).getTime();
            setStartedAt(fetchedWorkingOn.startedAt); // Global qiymatga saqlash
            setTimer(Math.floor((Date.now() - start) / 1000));
          }
        }
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Sekundomer
  useEffect(() => {
    let interval = null;
    if (onWork) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [onWork]);

  // Vazifa qo'shish
  const handleCreateTask = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${API}/schedules/addtask/${workingOn._id}`,
        { title: taskData, source: type }
      );
      setTasks(response.data.updatedSchedule.tasks);
      handleCloseCreate();
      setAlert({ show: true, type: "success", message: "Qo‘shildi!" });
      setLoading(false);
      resetType();
    } catch (error) {
      setLoading(false);
      console.error("Taskni qo‘shishda xatolik:", error);
      setAlert({ show: true, type: "error", message: "Xatolik!" });
    }
  };
  const resetType = () => setType("");

  // Vazifani o'zgartirish
  const handleEditTask = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${API}/schedules/edittask/${workingOn._id}`,
        {
          index: currentTaskIndex,
          title: taskData,
          source: type,
        }
      );
      setTasks(response.data.updatedSchedule.tasks);
      handleCloseEdit();
      setAlert({ show: true, type: "success", message: "Yangilandi!" });
      setLoading(false);
    } catch (error) {
      console.error("Taskni o'zgartirishda xatolik:", error);
      setAlert({ show: true, type: "error", message: "Xatolik!" });
      setLoading(false);
    }
  };

  // Vazifani o'chirish
  const handleDeleteTask = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${API}/schedules/deletetask/${workingOn._id}/${currentTaskIndex}`
      );
      setTasks(response.data.updatedSchedule.tasks);
      setAlert({ show: true, type: "success", message: "O`chirildi!" });
      handleCloseDelete();
      setLoading(false);
    } catch (error) {
      console.error("Taskni o'chirishda xatolik:", error);
      setAlert({ show: true, type: "error", message: "Xatolik!" });
      setLoading(false);
    }
  };

  const handleEndTask = async () => {
    await axios.put(`${API}/schedules/end/${workingOn._id}`, {
      myId,
    });
    if (myRole === "admin") {
      navigate("/admin/schedule/history");
    } else if (myRole === "employee") {
      navigate("/user/schedule/history");
    } else if (myRole === "hr") {
      navigate("/hr/schedule/history");
    } else if (myRole === "superadmin") {
      navigate("/superadmin/schedule/history");
    } else if (myRole === "complex") {
      navigate("/complex/schedule/history");
    } else if (myRole === "department") {
      navigate("/department/schedule/history");
    } else if (myRole === "hr") {
      navigate("/hr/schedule/history");
    }
  };

  useEffect(() => {
    if (terminate) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            window.location.reload(); // Sahifani yangilash
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup
    }
  }, [terminate]);
  const handleStartWork = () => {
    setLoading(true);
    if (handleShowStart) {
      handleCloseStart();
    }
    const payload = {
      beginnerName: myName,
      beginnerId: window.localStorage.getItem("user_id"),
      section: mySection,
      department: myDepartment,
      complex: myComplex,
      role: myRole,
      degree: myDegree,
    };

    axios.post(`${API}/schedules/create`, payload).then((res) => {
      setOnWork(true);
      setWorkingOn(res.data.newSchedule);
      setLoading(false);
      setAlert({ show: true, type: "success", message: "Boshlandi!" });
    });
  };
  const renderTooltip = (props, source) => (
    <Tooltip id="button-tooltip" {...props}>
      {source}
    </Tooltip>
  );
  return (
    <>
      {loading && <LoadingScreen loading={true} />}

      {alert.show && <Alert type={alert.type} message={alert.message} />}
      <div className="oqrang text-center m-3 ushbustikerlar mb-4">
          <h5>{t("ushbustikerlar")}</h5>
          <ul className="list-unstyled">
            <li>
              <i class="fa-solid sources majburiyat fa-square"></i> -{" "}
              {t("lavozimmajburiyati")}
            </li>
            <li>
              <i class="fa-solid sources qoshimcha fa-square"></i> -{" "}
              {t("rahbartomonidanqoshimcha")}
            </li>
            <li>
              <i class="fa-solid sources tashabbus fa-square"></i> -{" "}
              {t("xodimtashabbusi")}
            </li>
          </ul>
          {/* <p className="redword container">{t("dastlabkibaholashmezoni2")} <br />
  {t("dastlabkibaholashmezoni3")}
  </p> */}
        </div>
      <div className="schedule-container align-items-center m-0 justify-content-center row">
        {/* Sana */}
        

        
        <div className="date col-12 col-md-6 text-center">
          <img className="startcal" src={calendar} alt="" />
</div>
<div className="date col-12 col-md-6 text-center">
          {date}<br/>
        {!onWork && (
          <button className="start-button" onClick={handleShowStart}>
            <i class="fa-solid fa-play"></i> {t("ishniboshlash")}
          </button>
        )}
</div>
        {terminate && (
          <div className="terminate-container">
            <p className="terminate-message">
              {terminate === "Auto terminated"
                ? t("auto_terminated")
                : terminate === "Auto deleted"
                ? t("auto_deleted")
                : t("session_terminated")}
            </p>
            <div className="countdown">
              <span className="countdown-number">{countdown}</span>
              <p className="countdown-text">
                {t("sekunddansongavtomatikyangilanadi")}
              </p>
            </div>
          </div>
        )}

        {/* Tasks */}
        <div>
          {onWork && (
            <>
              <span className="timer">
                {Math.floor(timer / 3600)
                  .toString()
                  .padStart(2, "0")}
                :{(Math.floor(timer / 60) % 60).toString().padStart(2, "0")}:
                {(timer % 60).toString().padStart(2, "0")} {t("ishdasiz")}
              </span>
            </>
          )}
          {tasks.map((task, index) => (
            <div key={index} className="taskk">
              <div className="task">
                {task.source === "majburiyat" && (
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 0, hide: 0 }}
                    overlay={(props) =>
                      renderTooltip(props, t("lavozimmajburiyati"))
                    }
                  >
                    <i
                      title={t("lavozimmajburiyati")}
                      className="fa-solid sources majburiyat fa-square"
                    ></i>
                  </OverlayTrigger>
                )}
                {task.source === "qoshimcha" && (
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 0, hide: 0 }}
                    overlay={(props) =>
                      renderTooltip(props, t("rahbartomonidanqoshimcha"))
                    }
                  >
                    <i
                      title={t("rahbartomonidanqoshimcha")}
                      className="fa-solid sources qoshimcha fa-square"
                    ></i>
                  </OverlayTrigger>
                )}
                {task.source === "tashabbus" && (
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 0, hide: 0 }}
                    overlay={(props) =>
                      renderTooltip(props, t("xodimtashabbusi"))
                    }
                  >
                    <i
                      title={t("xodimtashabbusi")}
                      className="fa-solid sources tashabbus fa-square"
                    ></i>
                  </OverlayTrigger>
                )}
                <b>{index + 1}. </b>
                <span className="asdqweh">{task.title}</span>
              </div>
              <div className="task-btns d-flex justify-content-between">
                <div className="task-actions">
                  <button
                    onClick={() =>
                      handleShowEdit(index, task.title, task.source)
                    }
                    className="text-end editbtn"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    onClick={() => handleShowDelete(index)}
                    className="text-end deletebtn"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {onWork && (
            <>
              <div className="mb-5">
                <div className="button-container mt-5">
                  <button onClick={handleShowCreate} className="taskin">
                    <i className="fa-solid fa-plus"></i> {t("qoshish")}
                  </button>
                  <button onClick={handleShowEnd} className="taskin2">
                    <i className="fa-regular fa-circle-stop"></i>{" "}
                    {t("yakunlash")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        {/* Modal oynalar */}
        <Modal size="lg" centered show={showCreate} onHide={handleCloseCreate}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fa-solid fa-plus"></i> {t("yangivazifaqoshish")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="forbeg">
            <textarea
              className="kghgv"
              value={taskData}
              onChange={(e) => setTaskData(e.target.value)}
              rows="6"
            />
            {/* <div className="uploadif">
            <h5>Xujjatni yuklang (agar bo`lsa)</h5>
            (hozir ishlamayapti)
              <i className="fa-solid fa-paperclip"></i>
            </div> */}
          </Modal.Body>
          <div>
            <div className="tanlovv row">
              <label>
                <input
                  type="radio"
                  name="taskType"
                  value="majburiyat"
                  checked={type === "majburiyat"}
                  onChange={(e) => setType(e.target.value)}
                />
                {t("lavozimmajburiyati")}
              </label>

              <label>
                <input
                  type="radio"
                  name="taskType"
                  value="qoshimcha"
                  checked={type === "qoshimcha"}
                  onChange={(e) => setType(e.target.value)}
                />
                {t("rahbartomonidanqoshimcha")}
              </label>

              <label>
                <input
                  type="radio"
                  name="taskType"
                  value="tashabbus"
                  checked={type === "tashabbus"}
                  onChange={(e) => setType(e.target.value)}
                />
                {t("xodimtashabbusi")}
              </label>
            </div>

            <Modal.Footer>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="button-tooltip">{t("turinitanlang")}</Tooltip>
                }
                show={!type}
              >
                <span>
                  <Button
                    variant="success"
                    onClick={handleCreateTask}
                    disabled={!type}
                  >
                    {t("saqlash")}
                  </Button>
                </span>
              </OverlayTrigger>
            </Modal.Footer>
          </div>
        </Modal>

        <Modal centered size="lg" show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fa-solid fa-pen"></i> {t("vazifaniozgartirish")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="forbeg">
            <textarea
              className="kghgv"
              value={taskData}
              onChange={(e) => setTaskData(e.target.value)}
              rows="6"
            />
          </Modal.Body>
          <div>
            <div className="tanlovv row">
              <label>
                <input
                  type="radio"
                  name="taskType"
                  value="majburiyat"
                  checked={type === "majburiyat"}
                  onChange={(e) => setType(e.target.value)}
                />
                {t("lavozimmajburiyati")}
              </label>

              <label>
                <input
                  type="radio"
                  name="taskType"
                  value="qoshimcha"
                  checked={type === "qoshimcha"}
                  onChange={(e) => setType(e.target.value)}
                />
                {t("rahbartomonidanqoshimcha")}
              </label>

              <label>
                <input
                  type="radio"
                  name="taskType"
                  value="tashabbus"
                  checked={type === "tashabbus"}
                  onChange={(e) => setType(e.target.value)}
                />
                {t("xodimtashabbusi")}
              </label>
            </div>

            <Modal.Footer>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="button-tooltip">{t("turinitanlang")}</Tooltip>
                }
                show={!type}
              >
                <span>
                  <Button
                    variant="success"
                    onClick={handleEditTask}
                    disabled={!type}
                  >
                    {t("saqlash")}
                  </Button>
                </span>
              </OverlayTrigger>
            </Modal.Footer>
          </div>
        </Modal>

        <Modal centered show={showDelete} onHide={handleCloseDelete}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fa-solid fa-trash"></i> {t("ochirish")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{t("areyousuretodelete")}</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDeleteTask}>
              {t("ochirish")}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal centered show={showEnd} onHide={handleCloseEnd}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fa-regular fa-circle-stop"></i> {t("yakunlash")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{t("areyousuretoend")}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleEndTask}>
              {t("yakunlash")}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal centered show={showStart} onHide={handleCloseStart}>
          <Modal.Header closeButton>
            <Modal.Title>{t("boshlash")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{t("areyousuretostart")}</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleStartWork}>
              {t("boshlash")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default ScheduleNew;
