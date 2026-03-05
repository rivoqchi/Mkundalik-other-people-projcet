import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { API } from "../../config";
import { useTranslation } from "react-i18next";
import Behruz from '../Images/Behruz.jpg';
import Feruz from '../Images/Feruz.jpg';
import Usmonov from '../Images/Usmonov.png';
import ReactPlayer from "react-player";
import rolik from "../Images/mkundalik.mp4";

const Info = () => {
  const { t } = useTranslation();
  const [myData, setMyData] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const hasToken = window.localStorage.getItem("isSignedIn") === "true";
  const myId = window.localStorage.getItem("user_id");

  useEffect(() => {
    const getMyData = async () => {
      try {
        const { data } = await axios.get(`${API}/auth/mydata/${myId}`, { withCredentials: true });
        setMyData(data.user);
        const roles = {
          admin: "admin",
          employee: "user",
          superadmin: "superadmin",
          complex: "complex",
          department: "department",
          hr: "hr",
          boss: "boss",
          commission: "commission",
          staff: "staff"
        };
        setMyRole(roles[data.user.role] || "user");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (myId) getMyData();
  }, [myId]);

  return (
    <div className="tap-page info-redesign">
      <section className="info-header">
        <h1 className="tit">{t("dasturhaqida")}</h1>
        <p className='aboutp'>
          <strong>mkundalik.uz</strong> {t("dasyarat")}<br /><br />
          {t("dasyarat2")}
        </p>
      </section>

      <section className="info-links">
        <Link to={`/${myRole}/about/statistics`} className='abouttap'>
          <div>
            <i className="fa-solid fa-chart-line"></i>
            <span>{t("umstat")}</span>
          </div>
        </Link>
        <Link to={`/${myRole}/about/faq`} className='abouttap'>
          <div>
            <i className="fa-solid fa-circle-question"></i>
            <span>FAQ</span>
          </div>
        </Link>
        <Link to={`/${myRole}/about/application`} className='abouttap'>
          <div>
            <i className="fa-solid fa-headset"></i>
            <span>{t("takshik")}</span>
          </div>
        </Link>
      </section>

      <section className="info-creators">
        <h2 className="section-subtitle">{t("dasyaratuvchi")}</h2>
        <div className="creator-list">
          <Link to="/about/jahongir" className="premium-creator-card">
            <div className="creator-img-wrapper">
              <img src={Usmonov} alt="Usmonov R. J." />
            </div>
            <h5>Usmanov R. J.</h5>
            <span className="creator-role">{t("jahlav")}</span>
            <div className="creator-btn">
              Bio ko'rish <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

          <Link to="/about/feruz" className="premium-creator-card">
            <div className="creator-img-wrapper">
              <img src={Feruz} alt="Toshpo`latov F. G`." />
            </div>
            <h5>Toshpo`latov F. G`.</h5>
            <span className="creator-role">{t("ferlav")}</span>
            <div className="creator-btn">
              Bio ko'rish <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

          <Link to="/about/behruz" className="premium-creator-card">
            <div className="creator-img-wrapper">
              <img src={Behruz} alt="Abdurakhimov B. G`." />
            </div>
            <h5>Abdurakhimov B. G`.</h5>
            <span className="creator-role">{t("behlav")}</span>
            <div className="creator-btn">
              Bio ko'rish <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>
        </div>
      </section><br /><br />

      <div className="tech-section-wrapper">
        <h2 className="section-subtitle">{t("zamtex")}</h2>
        <section className="info-techs">
          <div className="tech-scroll">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" title="React" alt="React" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" title="JavaScript" alt="JavaScript" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" title="MongoDB" alt="MongoDB" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" title="ExpressJS" alt="ExpressJS" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" title="NodeJS" alt="NodeJS" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" title="HTML" alt="HTML" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" title="CSS" alt="CSS" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" title="Git" alt="Git" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" title="GitHub" alt="GitHub" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" title="Vite" alt="Vite" />

            {/* DUPLICATE FOR INFINITE LOOP */}
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" title="React" alt="React" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" title="JavaScript" alt="JavaScript" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" title="MongoDB" alt="MongoDB" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" title="ExpressJS" alt="ExpressJS" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" title="NodeJS" alt="NodeJS" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" title="HTML" alt="HTML" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" title="CSS" alt="CSS" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" title="Git" alt="Git" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" title="GitHub" alt="GitHub" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" title="Vite" alt="Vite" />
          </div>
        </section>
      </div>

      {hasToken && (
        <section className="video-section-premium">
          <ReactPlayer
            url={rolik}
            controls={true}
            width="100%"
            height="500px"
            playing={false}
            volume={0.8}
          />
        </section>
      )}
    </div>
  );
};

export default Info;