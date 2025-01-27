import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../config";
import Alert from "../Additional/Alert";

function ScheduleNew() {
    const myId = window.localStorage.getItem("user_id")
    const [myName, setMyName] = useState([])
    const [mySection, setMySection] = useState([])
    const [myDepartment, setMyDepartment] = useState([])
    const [myComplex, setMyComplex] = useState([])
    const [myRole, setMyRole] = useState([])

    const getMyData = async () => {
      try {
        const { data } = await axios.get(`${API}/auth/mydata/${myId}`);        
        setMyName(data.user.name);
        setMyRole(data.user.role);
        setMySection(data.user.section);
        setMyDepartment(data.user.department);
        setMyComplex(data.user.complex);
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

  // Modal holatlari
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showStart, setShowStart] = useState(false);

  const [currentTaskIndex, setCurrentTaskIndex] = useState(null); // Edit va Delete uchun
  const [taskData, setTaskData] = useState(""); // Yangi yoki o'zgartirilgan vazifa uchun  const [taskData, setTaskData] = useState(""); // Yangi yoki o'zgartirilgan vazifa uchun

  // Modalni yopish funksiyalari
  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleCloseCreate = () => setShowCreate(false);
  const handleCloseEnd = () => setShowEnd(false);
  const handleCloseStart = () => setShowStart(false);

  const handleShowEdit = (index, title) => {
    setCurrentTaskIndex(index);
    setTaskData(title);
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
        } else {
          setOnWork(true);
          const fetchedWorkingOn = res.data.workingOn || {};
          setWorkingOn(fetchedWorkingOn); // workingOnni o'rnatish
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
      const response = await axios.put(
        `${API}/schedules/addtask/${workingOn._id}`,
        { title: taskData }
      );
      setTasks(response.data.updatedSchedule.tasks);
      handleCloseCreate();
      setAlert({ show: true, type: "success", message: "Qo`shildi!" });
    } catch (error) {
      console.error("Taskni qo'shishda xatolik:", error);
      setAlert({ show: true, type: "error", message: "Xatolik!" });
    }
  };

  // Vazifani o'zgartirish
  const handleEditTask = async () => {
    try {
      const response = await axios.put(
        `${API}/schedules/edittask/${workingOn._id}`,
        {
          index: currentTaskIndex,
          title: taskData,
        }
      );
      setTasks(response.data.updatedSchedule.tasks);
      handleCloseEdit();
      setAlert({ show: true, type: "success", message: "Yangilandi!" });
    } catch (error) {
      console.error("Taskni o'zgartirishda xatolik:", error);
      setAlert({ show: true, type: "error", message: "Xatolik!" });
    }
  };

  // Vazifani o'chirish
  const handleDeleteTask = async () => {
    try {
      const response = await axios.delete(
        `${API}/schedules/deletetask/${workingOn._id}/${currentTaskIndex}`
      );
      setTasks(response.data.updatedSchedule.tasks);
      setAlert({ show: true, type: "success", message: "O`chirildi!" });
      handleCloseDelete();
    } catch (error) {
      console.error("Taskni o'chirishda xatolik:", error);
      setAlert({ show: true, type: "error", message: "Xatolik!" });
    }
  };

  const handleEndTask = async () => {
    await axios.put(`${API}/schedules/end/${workingOn._id}`, {
      myId,
    });
    if(myRole === "admin"){
      navigate("/admin/schedule/history");
    }else if(myRole === "employee"){
      navigate("/user/schedule/history");
    }else if(myRole === "hr"){
      navigate("/hr/schedule/history");
    }else if(myRole === "superadmin"){
      navigate("/superadmin/schedule/history");
    }else if(myRole === "complex"){
      navigate("/complex/schedule/history");
    }else if(myRole === "department"){
      navigate("/department/schedule/history");
    }else if(myRole === "hr"){
      navigate("/hr/schedule/history");
    }
  };

  const handleStartWork = () => {
    if(handleShowStart){
        handleCloseStart()
    }
    const payload = {
      beginnerName: myName,
      beginnerId: window.localStorage.getItem("user_id"),
      section: mySection,
      department: myDepartment,
      complex: myComplex
    };

    axios.post(`${API}/schedules/create`, payload).then((res) => {
      setOnWork(true);
      setWorkingOn(res.data.newSchedule);
      setAlert({ show: true, type: "success", message: "Boshlandi!" });
    });
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} message={alert.message} />}
      <div className="schedule-container">
        {/* Sana */}
        <div className="date">
          <i className="fa-solid fa-calendar-days"></i> {date}
        </div>

        {!onWork && (
          <button className="start-button" onClick={handleShowStart}>
            Ishni boshlash
          </button>
        )}

        {/* Tasks */}
        <div>
          {onWork && (
            <>
              <div className="taskk">
                <span className="blueword">{startedAt}</span> da boshladingiz.
              </div>
              <div className="timer">
                {Math.floor(timer / 3600)
                  .toString()
                  .padStart(2, "0")}
                :{(Math.floor(timer / 60) % 60).toString().padStart(2, "0")}:
                {(timer % 60).toString().padStart(2, "0")} ishdasiz
              </div>
            </>
          )}
          {tasks.map((task, index) => (
            <div key={index} className="taskk">
              <div className="task">
                <span>{task.title}</span>
              </div>
              <div className="task-btns d-flex justify-content-between">
                <div className=""></div>
                <div className="task-actions">
                  <button
                    onClick={() => handleShowEdit(index, task.title)}
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
              <button
                onClick={handleShowCreate}
                className="taskin align-items-center"
              >
                <i className="fa-solid fa-plus"></i> Yangi vazifa kiritish
              </button>
              <button
                onClick={handleShowEnd}
                className="taskin2 align-items-center"
              >
                <i className="fa-regular fa-circle-stop"></i> Yakunlash
              </button>
            </>
          )}
        </div>

        {/* Modal oynalar */}
        <Modal centered show={showCreate} onHide={handleCloseCreate}>
          <Modal.Header closeButton>
            <Modal.Title><i className="fa-solid fa-plus"></i> Yangi vazifa kiritish</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
            className="kghgv"
            value={taskData}
            onChange={(e) => setTaskData(e.target.value)}
            rows="6"
            />
            <div className="uploadif">
            <h5>Xujjatni yuklang (agar bo`lsa)</h5>
            (hozir ishlamayapti)
              <i className="fa-solid fa-paperclip"></i>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleCreateTask}>
              Saqlash
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal centered show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
            <Modal.Title><i className="fa-solid fa-pen"></i> Vazifani o'zgartirish</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
            className="kghgv"
              value={taskData}
              onChange={(e) => setTaskData(e.target.value)}
              rows="6"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleEditTask}>
              Saqlash
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal centered show={showDelete} onHide={handleCloseDelete}>
          <Modal.Header closeButton>
            <Modal.Title><i className="fa-solid fa-trash"></i> O'chirish</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Ushbu vazifani o'chirishga ishonchingiz komilmi?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDeleteTask}>
              O'chirish
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal centered show={showEnd} onHide={handleCloseEnd}>
          <Modal.Header closeButton>
            <Modal.Title><i className="fa-regular fa-circle-stop"></i> Yakunlash</Modal.Title>
          </Modal.Header>
          <Modal.Body>Ishni tugatishga aminmisiz?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleEndTask}>
              Yakunlash
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal centered show={showStart} onHide={handleCloseStart}>
          <Modal.Header closeButton>
            <Modal.Title>Boshlash</Modal.Title>
          </Modal.Header>
          <Modal.Body>Ishni boshlaysizmi?</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleStartWork}>
              Boshlash
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default ScheduleNew;
