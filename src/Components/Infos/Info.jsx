import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
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
  const hasToken = Boolean(window.localStorage.getItem("token"));
    const myId = window.localStorage.getItem("user_id");
    useEffect(() => {
        const getMyData = async () => {
          try {
            const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
            setMyData(data.user);
            if(data.user.role === 'admin'){
              setMyRole("admin")
            }else if(data.user.role === 'employee'){
              setMyRole("user")
            }else if(data.user.role === 'superadmin'){
              setMyRole("superadmin")
            }else if(data.user.role === 'complex'){
              setMyRole("complex")
            }else if(data.user.role === 'department'){
              setMyRole("department")
            }else if(data.user.role === 'hr'){
              setMyRole("hr")
            }else if(data.user.role === 'boss'){
              setMyRole("boss")
            }else if(data.user.role === 'commission'){
              setMyRole("commission")
            }else if(data.user.role === 'staff'){
              setMyRole("staff")
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        getMyData();
      }, [myId]);
    return (
        <div className="tap-page">
            <section className="info-header">
                <h5 className="tit">{t("dasturhaqida")}</h5>
                <p className='aboutp'>
                mkundalik.uz {t("dasyarat")}<br/><br/>
                {t("dasyarat2")}
                </p>
            </section>
            <section className="info-links">
                <Link to={`/${myRole}/about/statistics`} className='abouttap'><div><i className="fa-solid fa-chart-simple"></i> {t("umstat")}</div></Link>
                <Link to={`/${myRole}/about/faq`} className='abouttap'><div><i className="fa-solid fa-question"></i> FAQ</div></Link>
                <Link to={`/${myRole}/about/application`} className='abouttap'><div><i className="fa-solid fa-blender-phone"></i> {t("takshik")}</div></Link>
            </section>
            <section className="info-creators" aria-label="Dastur yaratuvchilari">
                <h5 className="tit">{t("dasyaratuvchi")}</h5>
                <div className="creator-list">
                    <div className="creator-card">
                        <img src={Usmonov} alt="Usmonov R. J." />
                        <h5>Usmanov R. J.</h5>
                        <span>{t("jahlav")}</span>
                    </div>
                    <div className="creator-card">
                        <img src={Feruz} alt="Toshpo`latov F. G`." />
                        <h5>Toshpo`latov F. G`.</h5>
                        <span>{t("ferlav")}</span>
                    </div>
                    <div className="creator-card">
                        <img src={Behruz} alt="Abdurakhimov B. G`." />
                        <h5>Abdurakhimov B. G`.</h5>
                        <span>{t("behlav")}</span>
                    </div>
                </div>
            </section><br /><br />
                <h5 className="tit">{t("zamtex")}:</h5>
            <section className="info-techs" aria-label="Texnologiyalar karuseli">
  <div className="tech-scroll" aria-hidden="true">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="ExpressJS" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="NodeJS" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" alt="Vite" />
  </div>
  <div className="tech-scroll" aria-hidden="true">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="ExpressJS" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="NodeJS" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" alt="Vite" />
  </div>
</section>
{hasToken && (
  <div className="video-player-container">
    <ReactPlayer 
      url={rolik} 
      controls={true} 
      width="100%" 
      height="500px"
      playing={false}
      volume={0.8}
    />
  </div>
)}
        </div>
    );
};

export default Info;