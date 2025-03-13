import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import axios from "axios";
import { API } from "../../config";
const Info = () => {

  const [myData, setMyData] = useState(null);
  const [myRole, setMyRole] = useState(null);
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
            <h3 className='abouth1'>Dastur haqida</h3>
            <div className="version">Versiya: <b>0.7.8</b></div>
            <p className='aboutp'>
            <a href="http://mkundalik.uz" target="_blank" rel="noopener noreferrer">mkundalik.uz</a> - bu <b>“TOSHKENT METROPOLITENI” DUK</b> tarkibiy tuzilmasida faoliyat yurituvchi xodimlarning ish jarayonlarini yanada samarali boshqarish, ularning kundalik faoliyati bo`yicha hisobotlarni elektron shaklda shakllantirish, ularni tizimli ravishda baholash hamda monitoring qilish imkonini beruvchi zamonaviy axborot tizimidir. <br/><br/>Mazkur dastur xodimlar tomonidan kiritiladigan ma'lumotlarni avtomatlashtirilgan holda qayta ishlash, ularning natijalarini tahlil qilish va rahbariyatga operativ tarzda yetkazish uchun mo`ljallangan bo`lib, ish samaradorligini oshirish va jarayonlarni shaffoflashtirishga xizmat qiladi.
            </p>
                <h4>Foydali havolalar:</h4>
            <div className="aboutmenu">
                <Link to={`/${myRole}/about/statistics`} className='abouttap'><div><i class="fa-solid fa-chart-simple"></i> Umumiy statistika</div></Link>
                <Link to={`/${myRole}/about/news`} className='abouttap'><div><i class="fa-solid fa-envelope"></i> Yangiliklar</div></Link>
                <Link to={`/${myRole}/about/faq`} className='abouttap'><div><i class="fa-solid fa-question"></i> FAQ</div></Link>
                <Link to={`/${myRole}/about/application`} className='abouttap'><div><i class="fa-solid fa-blender-phone"></i> Taklif va shikoyatlar</div></Link>
            </div>
        </div>
    );
};

export default Info;