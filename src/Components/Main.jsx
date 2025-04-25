import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./Images/logo-png.png";
import noting from "./Images/noting.png";
import avatar from "./Images/avatar.png";
import img1 from "./Images/Pinterest/image.png";
import img2 from "./Images/Pinterest/image2.png";
import img3 from "./Images/Pinterest/image3.png";
import img4 from "./Images/Pinterest/image4.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Main.scss";

function Main() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navv">
      <nav className="nav">
        <div className="logo2"><img src={logo} alt="logo" /></div>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link to={'/'}><li>Bosh sahifa</li></Link>
          <Link to={'/'}><li>Statistika</li></Link>
          <Link to={'/'}><li>Nizom</li></Link>
          <Link to={'/'}><li>Yo'riqnoma</li></Link>
          <Link to={'/login'}><button className="login-btn">Kabinetga o`tish</button></Link>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </div>
      </nav>

      <div className="row mt-5 mb-5 align-items-center">
        <div className="col-12 col-md-6 text-center">
        <header className="hero">
        <h1>MKUNDALIK.UZ</h1>
        <p>Xodimlarning ish faoliyatini elektron qayd etish axborot tizimi</p>
        <Link to={'/login'}><button className="login-btn">Kabinetga kirish</button></Link>
      </header>
        </div>
        <div className="col-12 col-md-6 text-center w100">
          <img src={noting} alt="Noting" className="noting" />
        </div>
      </div>

      <div className="bu-qanday-ishlaydi hero">
        <h1>Bu qanday ishlaydi?</h1>
        <p>Xodimlarning ish jarayonini nazorat qilish va ularning faoliyatini raqamlashtirish maqsadida yaratilgan ushbu platforma quyidagi bosqichlarda ishlaydi:</p>
        
        <div className="row howdoesitwork align-items-center">
          <div className="col-12 col-md-6 align-items-center">
            <h2 className="how22"><i class="fa-solid fa-1"></i> Xodim tizimga biriktiriladi</h2>
            <p>Har bir xodim uchun shaxsiy profil yaratiladi va u ish joyiga hamda rahbariga biriktiriladi. Xodim ushbu profil orqali o`z ma'lumotlarini to`ldiradi va ish jadvalini kuzatib borishi mumkin.</p>
          </div>
          <div className="col-12 col-md-6 align-items-center">
            <img className="noting2" src={img2} alt="" />
          </div>
        </div>
                
        <div className="row howdoesitwork align-items-center">
          <div className="col-12 col-md-6 align-items-center">
            <img className="noting2" src={img3} alt="" />
          </div>
          <div className="col-12 col-md-6 align-items-center">
            <h2 className="how22"><i class="fa-solid fa-2"></i> Kunlik hisobotlarni kiritadi</h2>
            <p>Xodim o`zining ish faoliyati bo`yicha har kunlik hisobotni tizimga kiritadi. Hisobotlar belgilangan me'yor va shaklda taqdim etiladi hamda tizimda saqlanadi.</p>
          </div>
        </div>

        <div className="row howdoesitwork align-items-center">
          <div className="col-12 col-md-6 align-items-center">
            <h2 className="how22"><i class="fa-solid fa-3"></i> Rahbar uni baholaydi</h2>
            <p>Rahbarlar kunlik hisobotlarni ko‘rib chiqib, har bir faoliyat uchun ball va izoh beradi. Baholash tizimi shaffof va ochiq tarzda amalga oshiriladi.</p>
          </div>
          <div className="col-12 col-md-6 align-items-center">
            <img className="noting2" src={img4} alt="" />
          </div>
        </div>

        <div className="row howdoesitwork align-items-center">
          <div className="col-12 col-md-6 align-items-center">
            <img className="noting2" src={img1} alt="" />
          </div>
          <div className="col-12 col-md-6 align-items-center">
            <h2 className="how22"><i class="fa-solid fa-4"></i> Reyting natijalari taqdim etiladi</h2>
            <p>Kun, hafta va oy yakunlari bo`yicha barcha xodimlarning reyting natijalari shakllantiriladi. Bu natijalar rahbariyat va xodimlar uchun ochiq bo`lib, mukofot va rag`batlantirish jarayonlariga asos bo`lib xizmat qiladi.</p>
          </div>
        </div>
      </div>


      <div className="statistics hero">
        <h1>Statistika</h1>
        <p>"Toshkent metropoliteni" DUK</p>
        <div className="statistics-main text-center">
          <div className="statistics-main2">
            <h1 className="son">650+</h1> <p>xodimlar</p>
          </div>
          <div className="statistics-main2">
            <h1 className="son">22000+</h1> <p>yozilgan hisobotlar</p>
          </div>
        </div>
        <div className="eng-faollar d-flex text-center justify-content-center align-items-center">
          <div className="eng-faol d-flex justify-content-center align-items-center">
            <img src={avatar} className="avatar" alt="avatar" />
            <div className="infooo">
              <span>Behruz Abdurakhimov</span><br />
              <span><i>Tizim administratori</i></span><br />
              <span className="yellowword">45 ta hisobot</span>
            </div>
          </div>
        </div>
        <div className="eng-faollar d-flex text-center justify-content-center align-items-center">
          <div className="eng-faol d-flex justify-content-center align-items-center">
            <img src={avatar} className="avatar" alt="avatar" />
            <div className="infooo">
              <span>Feruz Topshpo`latov</span><br />
              <span><i>Xizmat boshlig`i</i></span><br />
              <span className="yellowword">40 ta hisobot</span>
            </div>
          </div>
        </div>
      </div>

      

      <footer className="footer row">
        <div className="col-12 col-md-4 text-start">
        <p>&copy; 2025 © mkundalik.uz — “Toshkent metropoliteni” DUK'da ishga tushirilgan.</p>
        Barcha huquqlar himoyalangan.
            <p>Kundalik hisobotlarni elektron qayd etish onlayn platformasi</p>
            <span>Diqqat! Agar tizimdan xatolik topsangiz Ctrl + Enter tugmalarini bosing</span>
        </div>
        <div className="col-12 col-md-4">
          <ul className="list-unstyled text-start">
            <Link to={'/'}><li>Statistika</li></Link>
            <Link to={'/'}><li>Nizom</li></Link>
            <Link to={'/'}><li>Dasturdan foydalanish yo`riqnomasi</li></Link>
            <Link to={'/'}><li>Maxfiylik siyosati</li></Link>
          </ul>
        </div>

        <div className="col-12 col-md-4">
          <ul className="list-unstyled text-start">
            <a href="tel:5389">53-89</a>
            <a href="mailto:support@mkundalik.uz">support@mkundalik.uz</a>
          </ul>
        </div>
      </footer>

    </div>
  );
}

export default Main;
