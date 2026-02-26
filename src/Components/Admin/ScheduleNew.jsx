import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../config";
import Alert from "../Additional/Alert";
import { useLoading } from "../Additional/LoadingScreen";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Tooltip, OverlayTrigger, Dropdown } from "react-bootstrap";
import calendar from "../Images/calendar.png";
import logo from "../Images/logo-png.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
function ScheduleNew() {
  const { t } = useTranslation();

  const myId = window.localStorage.getItem("user_id");
  const [myName, setMyName] = useState([]);
  const [mySection, setMySection] = useState([]);
  const [myDepartment, setMyDepartment] = useState([]);
  const { setLoading } = useLoading();
  const [myComplex, setMyComplex] = useState([]);
  const [myPosition, setMyPosition] = useState([]);
  const [myDegree, setMyDegree] = useState([]);
  const [myRole, setMyRole] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [shart, setShart] = useState(false);
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
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
    trigger: 0
  });

  const handleAi = async () => {
    if (!taskData.trim()) return;

    setAiMode("thinking");
    backupTextRef.current = taskData;
    setDisplayContent(generateSkeleton(taskData));

    try {
      const response = await axios.post(`${API}/ai/imloviy-ishlov`, {
        message: `Imloviy xatolarni to'g'irlab rasmiy uslubda faqat matnni qaytar: "${taskData}"`,
      });

      const newText = response.data.response || taskData;

      // Start reveal animation
      revealTextAnimation(newText);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAiMode("error");
      setAlert({
        show: true,
        type: "error",
        message: "AI xizmati vaqtincha ishlamayapti",
        trigger: Date.now()
      });

      // Revert after animation
      setTimeout(() => {
        setAiMode("idle");
        setTaskData(backupTextRef.current);
      }, 2000);
    }
  };
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
  const [taskData, setTaskData] = useState("");

  // AI Animation States
  const [aiMode, setAiMode] = useState("idle"); // idle, thinking, writing, error
  const [displayContent, setDisplayContent] = useState("");
  const backupTextRef = useRef("");

  // Helper to generate skeleton blocks from text
  const generateSkeleton = (text) => {
    if (!text) return "";
    return text.split(" ").map(word => {
      const width = Math.max(30, word.length * 10);
      return `<span class="ai-word skeleton" style="width: ${width}px; display: inline-block;"></span>`;
    }).join(" ");
  };

  // Helper to reveal text
  const revealTextAnimation = (text) => {
    const words = text.split(" ");
    let currentWords = [];

    // Initial display is empty or partial
    // We will use a recursive timeout loop or interval
    let index = 0;

    // Clear skeleton first? Or morph?
    // Let's just start showing words
    setAiMode("writing");

    const interval = setInterval(() => {
      if (index >= words.length) {
        clearInterval(interval);
        setTimeout(() => {
          setAiMode("idle");
          setTaskData(text); // Ensure final text is set and textarea provided
        }, 500);
        return;
      }

      const word = words[index];
      currentWords.push(`<span class="ai-word reveal">${word}</span>`);
      setDisplayContent(currentWords.join(" "));
      index++;
    }, 50); // Speed of typing
  };
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
        { title: taskData, source: shart ? type : "null" }
      );
      setTasks(response.data.updatedSchedule.tasks);
      handleCloseCreate();
      setAlert(prev => ({
        show: true,
        type: "success",
        message: "Qo‘shildi!",
        trigger: prev.trigger + 1
      }));
      setLoading(false);
      resetType();
      setTaskData("");
    } catch (error) {
      setLoading(false);
      console.error("Taskni qo‘shishda xatolik:", error);
      setAlert(prev => ({
        show: true,
        type: "error",
        message: "Xatolik!",
        trigger: prev.trigger + 1
      }));
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
          source: shart ? type : "null",
        }
      );
      setTasks(response.data.updatedSchedule.tasks);
      handleCloseEdit();
      setAlert(prev => ({
        show: true,
        type: "success",
        message: "Yangilandi!",
        trigger: prev.trigger + 1
      }));
      setLoading(false);
    } catch (error) {
      console.error("Taskni o'zgartirishda xatolik:", error);
      setAlert(prev => ({
        show: true,
        type: "error",
        message: "Xatolik!",
        trigger: prev.trigger + 1
      }));
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
      setAlert(prev => ({
        show: true,
        type: "success",
        message: "O`chirildi!",
        trigger: prev.trigger + 1
      }));
      handleCloseDelete();
      setLoading(false);
    } catch (error) {
      console.error("Taskni o'chirishda xatolik:", error);
      setAlert(prev => ({
        show: true,
        type: "error",
        message: "Xatolik!",
        trigger: prev.trigger + 1
      }));
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
      setAlert(prev => ({
        show: true,
        type: "success",
        message: "Boshlandi!",
        trigger: prev.trigger + 1
      }));
    });
  };
  const renderTooltip = (props, source) => (
    <Tooltip id="button-tooltip" {...props}>
      {source}
    </Tooltip>
  );
  return (
    <>

      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          trigger={alert.trigger}
        />
      )}      {/* <div className="oqrang text-center m-3 ushbustikerlar mb-4">
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
      <div className="hgfd">
        <div className="container sch-container">
          <div className="schedule-container">
            {/* Header Section */}
            <div className="schedule-header">
              <div className="header-title-section">
                <img className="startlogo" src={logo} alt="Logo" />
              </div>
              <div className="header-right-section">
                <div className={`dynamic-status-badge ${onWork ? 'status-jarayonda' : 'status-boshlanmagan'}`}>
                  <i className={`fa-solid ${onWork ? 'fa-spinner fa-spin' : 'fa-clock'}`}></i>
                  {onWork ? "Jarayonda" : "Boshlanmagan"}
                </div>
                <div className="calendar-box-creative">
                  <i className="fa-solid fa-calendar-days"></i>
                  <span>{date}</span>
                </div>
              </div>
            </div>

            {/* Pre-start Layout */}
            {!onWork && !terminate && (
              <div className="prestart-glass-panel">
                <div className="dynamic-status-badge status-boshlanmagan">
                  {t("boshlanmagan")}
                </div>
                <h2 className="mb-4">Salom, {myName}!</h2>
                <p className="text-sub mb-4">Bugungi ish kuningizni boshlashga tayyormisiz?</p>
                <div className="calendar-box-creative mb-5">
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>Bugun: {date}</span>
                </div>
                <div className="text-center">
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
              </div>
            )}
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
            {/* Tasks List */}
            {onWork && (
              <div className="tasks-list-wrapper">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="u-box">
                    <i className="fa-solid fa-stopwatch me-2"></i>
                    {Math.floor(timer / 3600).toString().padStart(2, "0")}
                    :{(Math.floor(timer / 60) % 60).toString().padStart(2, "0")}:
                    {(timer % 60).toString().padStart(2, "0")} {t("ishdasiz")}
                  </span>
                </div>
                {/* Scrollable list content */}
                <div className="tasks-scroll-area">
                  {tasks.map((task, index) => (
                    <div key={index} className="taskk">
                      <div className="justify-content-between pb-2 d-flex">
                        <div className="task-number-badge ">{index + 1} </div>
                        <div className="task-actions align-items-center">
                          <div className="d-none d-md-flex gap-2">
                            <button onClick={() => handleShowEdit(index, task.title, task.source)} className="editbtn" title="Tahrirlash">
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button onClick={() => handleShowDelete(index)} className="deletebtn" title="O'chirish">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>

                          {/* Mobile Dropdown */}
                          <div className="d-md-none mobile-task-dropdown">
                            <Dropdown>
                              <Dropdown.Toggle id={`dropdown-task-${index}`} className="dropdown-dots">
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu align="end">
                                <Dropdown.Item onClick={() => handleShowEdit(index, task.title, task.source)}>
                                  <i className="fa-solid fa-pen me-2"></i> Tahrirlash
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleShowDelete(index)} className="text-danger">
                                  <i className="fa-solid fa-trash me-2"></i> O'chirish
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                      <div className="task-bottom-info">
                        <div className="task-content-top">
                          <div className="task-info">
                            <div className="asdqweh">{task.title}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Persistent Bottom Task Input Box Matching Image */}
            {onWork && (
              <div className="new-task-box mb-5 mx-auto">
                <div className="new-task-head">
                  <div className="new-task-title">
                    <i className="fa-solid fa-plus-circle"></i>
                    <span>Yangi qadam qo'shish</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="new-task-user">
                      <i className="fa-regular fa-user"></i>
                      <span>{myName || "Foydalanuvchi"}</span>
                    </div>
                    <button
                      onClick={handleAi}
                      className={`ai-btn-top ${aiMode !== 'idle' ? 'processing' : ''}`}
                      disabled={aiMode !== 'idle' || !taskData}
                      title="AI Tahrir"
                    >
                      <i className={`fa-solid ${aiMode === 'thinking' ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="new-task-body">
                  <div className="textarea-wrapper">
                    {aiMode === "idle" ? (
                      <textarea
                        className="task-textarea-custom"
                        value={taskData}
                        onChange={(e) => setTaskData(e.target.value)}
                        placeholder="Bugun qanday natijalarga erishdingiz? Batafsil yozing..."
                        rows={4}
                      />
                    ) : (
                      <div
                        className={`ai-animation-container-custom ${aiMode}`}
                        dangerouslySetInnerHTML={{ __html: displayContent }}
                      />
                    )}
                  </div>

                  {shart && (
                    <div className="task-type-selector-new">
                      <label className={`type-badge ${type === 'majburiyat' ? 'selected' : ''}`}>
                        <input type="radio" name="taskTypeBottom" value="majburiyat" checked={type === "majburiyat"} onChange={(e) => setType(e.target.value)} />
                        <i className="fa-solid fa-check-double me-2"></i> {t("lavozimmajburiyati")}
                      </label>
                      <label className={`type-badge ${type === 'qoshimcha' ? 'selected' : ''}`}>
                        <input type="radio" name="taskTypeBottom" value="qoshimcha" checked={type === "qoshimcha"} onChange={(e) => setType(e.target.value)} />
                        <i className="fa-solid fa-plus-circle me-2"></i> {t("rahbartomonidanqoshimcha")}
                      </label>
                      <label className={`type-badge ${type === 'tashabbus' ? 'selected' : ''}`}>
                        <input type="radio" name="taskTypeBottom" value="tashabbus" checked={type === "tashabbus"} onChange={(e) => setType(e.target.value)} />
                        <i className="fa-solid fa-lightbulb me-2"></i> {t("xodimtashabbusi")}
                      </label>
                    </div>
                  )}

                  <div className="new-task-footer">
                    <div className="footer-left-actions d-none text-end d-md-flex">
                      {/* <button className="action-btn"><i className="fa-solid fa-paperclip"></i> Fayl</button>
                      <button className="action-btn"><i className="fa-solid fa-link"></i> Havola</button> */}
                    </div>

                    <div className="footer-right-actions">
                      <button
                        className="btn-save-creative"
                        onClick={handleCreateTask}
                        disabled={!taskData || (shart && !type)}
                      >
                        Saqlash <i className="fa-solid fa-arrow-right"></i>
                      </button>

                      <button
                        className="btn-finish-creative"
                        onClick={handleShowEnd}
                      >
                        Yakunlash
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      {/* Modal oynalar */}
      {/* Create Modal Removed */}

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
          {shart && (
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
          )}

          <Modal.Footer>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="button-tooltip">{t("turinitanlang")}</Tooltip>
              }
              show={shart && !type}
            >
              <span>
                <Button
                  variant="success"
                  className="mb-4"
                  onClick={handleEditTask}
                  disabled={shart && !type}
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

      <Modal centered show={showEnd} onHide={handleCloseEnd} className="creative-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa-solid fa-circle-question me-2 text-warning"></i> {t("yakunlash")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <h5 className="mb-0">Rostan ham yakunlaysizmi?</h5>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="outline-secondary" onClick={handleCloseEnd}>
            Yo'q
          </Button>
          <Button variant="primary" onClick={handleEndTask} className="px-5">
            Ha, yakunlash
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
          <Button className="defaultbtn" onClick={handleStartWork}>
            {t("boshlash")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ScheduleNew;