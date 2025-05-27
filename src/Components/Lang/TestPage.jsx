import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../../config';
import { useParams, useNavigate } from 'react-router-dom';

function TestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [route, setRoute] = useState("");

  
    useEffect(() => {
          const role = window.localStorage.getItem("role");
          if (role === "admin") {
            setRoute("/admin");
          } else if (role === "employee") {
            setRoute("/user");
          } else if (role === "superadmin") {
            setRoute("/superadmin");
          } else if (role === "complex") {
            setRoute("/complex");
          } else if (role === "department") {
            setRoute("/department");
          } else if (role === "hr") {
            setRoute("/hr");
          } else if (role === "lang") {
            setRoute("/lang");
          } else if (role === "boss") {
            setRoute("/boss");
          } else if (role === "commission") {
            setRoute("/commission");
          } else if (role === "staff") {
            setRoute("/staff");
          } else if (role === "at") {
            setRoute("/at");
          } else if (role === "sport") {
            setRoute("/sport");
          } else{
            setRoute("/null");
          }
        }, []);

  useEffect(() => {
    const getTestData = async () => {
      try {
        const { data } = await axios.get(`${API}/auth/test/send/${id}`);
        const userId = window.localStorage.getItem("user_id");

        if (!data.sent.includes(userId)) {
          navigate('/not-allowed');
          return;
        }

        setTestData(data);
        setAnswers(new Array(data.questions.length).fill(null));
        setTimeLeft(data.questions.length * 60); // 1 daqiqa har savolga
      } catch (error) {
        console.error("Test ma'lumotlarini olishda xatolik:", error);
      }
    };

    getTestData();
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (questionIndex, optionIndex) => {
    if (submitted) return;
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    const total = testData.questions.length;
    let correct = 0;
    testData.questions.forEach((q, idx) => {
      if (q.options[answers[idx]]?.isCorrect) correct++;
    });
    const percentage = Math.round((correct / total) * 100);

    try {
      await axios.put(`${API}/auth/test/end/${window.localStorage.getItem("user_id")}`, {
        ball: percentage,
        norm: "Test",
        language: testData.language,
        testId: id
      });
      setSubmitted(true);
      alert(`Sizning natijangiz: ${percentage}%`);
      window.location.replace(`${route}`);
    } catch (err) {
      console.error("Natijani yuborishda xatolik:", err);
    }
  };

  if (!testData) return <div className="mytest-loading">Yuklanmoqda...</div>;

  return (
    <div className="mytest-container">
      <div className="mytest-timer">Vaqt: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
      {testData.questions.map((q, qIdx) => (
        <div key={qIdx} className="mytest-question">
          <h3>{qIdx + 1}. {q.questionText}</h3>
          <div className="mytest-options">
            {q.options.map((opt, oIdx) => (
              <button
                key={oIdx}
                className={`mytest-option-btn ${answers[qIdx] === oIdx ? 'active' : ''}`}
                onClick={() => handleAnswer(qIdx, oIdx)}>
                {opt.optionText}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        className="mytest-submit-btn"
        onClick={handleSubmit}
        disabled={submitted || timeLeft <= 0}
      >
        Yuborish
      </button>
    </div>
  );
}

export default TestPage;