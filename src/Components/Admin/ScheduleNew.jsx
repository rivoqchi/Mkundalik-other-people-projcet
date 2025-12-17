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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
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
const [selectedDate, setSelectedDate] = useState(null);

const [showPicker, setShowPicker] = useState(false);
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "D") {
      e.preventDefault();
      setShowPicker(true);
    }

    if (e.key === "Escape") {
      setShowPicker(false);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
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
  const [madeEasier, setMadeEasier] = useState("");

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
              axios
                .put(`${API}/schedules/terminate/${fetchedWorkingOn._id}`, {
                  myId,
                })
                .then(
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
    } else if (myRole === "lang") {
      navigate("/lang/schedule/history");
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
  ...(madeEasier && { madeEasier: madeEasier }),
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
      {/* <div className="oqrang text-center m-3 ushbustikerlar mb-4">
          <h5>{t("ushbustikerlar")}</h5>
          <ul className="list-unstyled">
            <li>
              <i className="fa-solid sources majburiyat fa-square"></i> -{" "}
              {t("lavozimmajburiyati")}
            </li>
            <li>
              <i className="fa-solid sources qoshimcha fa-square"></i> -{" "}
              {t("rahbartomonidanqoshimcha")}
            </li>
            <li>
              <i className="fa-solid sources tashabbus fa-square"></i> -{" "}
              {t("xodimtashabbusi")}
            </li>
          </ul>
        </div> */}
      <div className="schedule-container align-items-center m-0 justify-content-center row">
        <div className="date col-12 col-md-6 text-center">
          <img className="startcal" src={calendar} alt="" />
        </div>
        <div
          className="date col-12 col-md-6 text-center"
          style={{ position: "relative" }}
        >
          {date}
          <br />
          {!onWork && (
            <div className="text-center cen">
              <button
                className="cssbuttons-io-button"
                onClick={handleShowStart}
              >
                {t("ishniboshlash")}
                <div className="icon">
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </button>
            </div>
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
              <span className="u-box">
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
                  <button
                    onClick={handleShowCreate}
                    class="continue-application"
                  >
                    <div>
                      <div class="pencil"></div>
                      <div class="folder">
                        <div class="top">
                          <svg viewBox="0 0 24 27">
                            <path d="M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z"></path>
                          </svg>
                        </div>
                        <div class="paper"></div>
                      </div>
                    </div>
                    {t("qoshish")}
                  </button>
                  <button onClick={handleShowEnd} class="Documents-btn align-items-center">
                    <span class="folderContainer">
                      <svg
                        class="fileBack"
                        width="146"
                        height="113"
                        viewBox="0 0 146 113"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 4C0 1.79086 1.79086 0 4 0H50.3802C51.8285 0 53.2056 0.627965 54.1553 1.72142L64.3303 13.4371C65.2799 14.5306 66.657 15.1585 68.1053 15.1585H141.509C143.718 15.1585 145.509 16.9494 145.509 19.1585V109C145.509 111.209 143.718 113 141.509 113H3.99999C1.79085 113 0 111.209 0 109V4Z"
                          fill="url(#paint0_linear_117_4)"
                        ></path>
                        <defs>
                          <linearGradient
                            id="paint0_linear_117_4"
                            x1="0"
                            y1="0"
                            x2="72.93"
                            y2="95.4804"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#8F88C2"></stop>
                            <stop offset="1" stop-color="#5C52A2"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      <svg
                        class="filePage"
                        width="88"
                        height="99"
                        viewBox="0 0 88 99"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="88"
                          height="99"
                          fill="url(#paint0_linear_117_6)"
                        ></rect>
                        <defs>
                          <linearGradient
                            id="paint0_linear_117_6"
                            x1="0"
                            y1="0"
                            x2="81"
                            y2="160.5"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="white"></stop>
                            <stop offset="1" stop-color="#686868"></stop>
                          </linearGradient>
                        </defs>
                      </svg>

                      <svg
                        class="fileFront"
                        width="160"
                        height="79"
                        viewBox="0 0 160 79"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.29306 12.2478C0.133905 9.38186 2.41499 6.97059 5.28537 6.97059H30.419H58.1902C59.5751 6.97059 60.9288 6.55982 62.0802 5.79025L68.977 1.18034C70.1283 0.410771 71.482 0 72.8669 0H77H155.462C157.87 0 159.733 2.1129 159.43 4.50232L150.443 75.5023C150.19 77.5013 148.489 79 146.474 79H7.78403C5.66106 79 3.9079 77.3415 3.79019 75.2218L0.29306 12.2478Z"
                          fill="url(#paint0_linear_117_5)"
                        ></path>
                        <defs>
                          <linearGradient
                            id="paint0_linear_117_5"
                            x1="38.7619"
                            y1="8.71323"
                            x2="66.9106"
                            y2="82.8317"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#C3BBFF"></stop>
                            <stop offset="1" stop-color="#51469A"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    <p class="text">{t("yakunlash")}</p>
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
              <div className="boshlovchi">
                <i class="fa-solid newuser fa-user-check"></i> {window.localStorage.getItem("fullName")}
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="task-modal-body">
  <textarea
    className="task-textarea"
    value={taskData}
    onChange={(e) => setTaskData(e.target.value)}
    rows="6"
    placeholder={t("tafsilotlarnikiriting")}
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

              <div className="radio-wrapper">
  <label className="radio-option">
    <input
      type="radio"
      name="taskType"
      value="qoshimcha"
      checked={type === "qoshimcha"}
      onChange={(e) => setType(e.target.value)}
      className="radio-input"
    />
    <span className="radio-custom"></span>
    {t("rahbartomonidanqoshimcha")}
  </label>

  <label className="radio-option">
    <input
      type="radio"
      name="taskType"
      value="tashabbus"
      checked={type === "tashabbus"}
      onChange={(e) => setType(e.target.value)}
      className="radio-input"
    />
    <span className="radio-custom"></span>
    {t("xodimtashabbusi")}
  </label>
</div>
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
                    className="mb-4"
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
                    className="mb-4"
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
          <Modal.Body>
  {t("areyousuretostart")}

  {showPicker && (
    <div className="mt-3">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          setMadeEasier(dayjs(date).format("DD/MM/YYYY HH:mm"));
          // setShowPicker(false); // tanlangach yopiladi
        }}
        showTimeSelect
        dateFormat="dd/MM/yyyy HH:mm"
        className="form-control"
        autoFocus
      />
    </div>
  )}
</Modal.Body>
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
