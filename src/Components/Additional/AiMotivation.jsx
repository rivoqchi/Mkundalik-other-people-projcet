import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config";

const AiMotivation = () => {
  const [motivation, setMotivation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMotivation = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${API}/ai/imloviy-ishlov`, {
          message: "Menga ishchanlik kayfiyatini oshiradigan bitta qisqa motivator gap yozib ber (O'zbek tilida). Faqat gapning o'zini qaytar."
        }, { withCredentials: true });
        setMotivation(res.data.response);
      } catch (e) {
        setMotivation("Bugungi kuningiz unumli o'tsin!");
      } finally {
        setLoading(false);
      }
    };
    fetchMotivation();
  }, []);

  if (!motivation && !loading) return null;

  return (
    <div className="ai-motivation-box mb-4 animate__animated animate__fadeIn">
      <div className="motivation-glass-effect"></div>
      <i className="fa-solid fa-quote-left mb-2"></i>
      <p className="motivation-text mb-0 italic">
        {loading ? "AI motivatsiya tayyorlamoqda..." : motivation}
      </p>
      <div className="ai-tag mt-2">
        <i className="fa-solid fa-wand-magic-sparkles me-1"></i>
        <span>AI Motive</span>
      </div>
    </div>
  );
};

export default AiMotivation;
