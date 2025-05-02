import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./Images/logo-png.png";
import noting from "./Images/noting.png";
import avatar from "./Images/avatar.png";
import img1 from "./Images/Pinterest/image.png";
import img2 from "./Images/Pinterest/image2.png";
import img3 from "./Images/Pinterest/image3.png";
import img4 from "./Images/Pinterest/image4.png";
import LangSelect from "./LangSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Main.scss";
import Navbarr from "./Navbar";
function Main() {
  const [isOpen, setIsOpen] = useState(false);
  let isSignedIn = window.localStorage.getItem("token") ? true : false;
  const [route, setRoute] = useState("");

  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
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
    }
  }, []);

  

  let updatedButton = false;

// Agar localStorage da updated yo‘q bo‘lsa — tugma ko‘rsatiladi
if (window.localStorage.getItem("updated") === null || window.localStorage.getItem("updated") === "false") {
  updatedButton = true;
}

function updateFunction() {
  window.localStorage.clear(); // hamma localStorage tozalanadi
  window.localStorage.setItem("updated", "true"); // qaytadan yoziladi
  window.location.reload(); // sahifa yangilanadi
}


  return (
    <div className="navvv mainpg ">


{updatedButton && (
      <button onClick={updateFunction} className="text-center updatebutton">
        Yangilanish mavjud <br /> Bosing
      </button>
    )}


      <nav className="nav">
        <div className="logo2">
          <img src={logo} alt="logo" />
        </div>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <a onClick={() => setIsOpen(false)} href="#">
            <li>Bosh sahifa</li>
          </a>
          <a onClick={() => setIsOpen(false)} href="#statistika">
            <li>Statistika</li>
          </a>
          <a
            onClick={() => setIsOpen(false)}
            href="/templates/instructions.pdf"
          >
            <li>Yo'riqnoma</li>
          </a>
          <LangSelect />
          {isSignedIn ? (
            <Link onClick={() => setIsOpen(false)} to={`${route}/dashboard`}>
                <button className="login-btn">Shaxsiy kabinet</button>
                </Link>
          ) : (
            <Link onClick={() => setIsOpen(false)} to="/login">
              <button className="login-btn">Kabinetga kirish</button>
            </Link>
          )}
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </div>
      </nav>
      <div className="row mt-5 mb-5 align-items-center">
        <div className="col-12 col-md-6 text-center">
          <header className="hero">
            <h1>MKUNDALIK.UZ</h1>
            <p>
              Xodimlarning ish faoliyatini elektron qayd etish axborot tizimi
            </p>
            {isSignedIn ? (
              <Link onClick={() => setIsOpen(false)} to={`${route}/dashboard`}>
                <button className="login-btn">Shaxsiy kabinet</button>
              </Link>
            ) : (
              <Link onClick={() => setIsOpen(false)} to="/login">
                <button className="login-btn">Kabinetga kirish</button>
              </Link>
            )}
          </header>
        </div>
        <div className="col-12 col-md-6 text-center w100">
          <img src={noting} alt="Noting" className="noting" />
        </div>
      </div>

      <div className="bu-qanday-ishlaydi hero">
        <h1>Bu qanday ishlaydi?</h1>
        <p>
          Xodimlarning ish jarayonini nazorat qilish va ularning faoliyatini
          raqamlashtirish maqsadida yaratilgan ushbu platforma quyidagi
          ketma-ketlikda ishlaydi:
        </p>

        <div className="row howdoesitwork align-items-center">
          <div className="col-12 col-md-6 align-items-center">
            <h2 className="how22">
              <i class="fa-solid fa-1"></i> Xodim tizimga biriktiriladi
            </h2>
            <p>
              Har bir xodim uchun shaxsiy profil yaratiladi va u ish joyiga
              hamda rahbariga biriktiriladi. Xodim ushbu profil orqali o`z
              ma'lumotlarini to`ldiradi va ish jadvalini kuzatib borishi mumkin.
            </p>
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
            <h2 className="how22">
              <i class="fa-solid fa-2"></i> Kunlik hisobotlarni kiritadi
            </h2>
            <p>
              Xodim o`zining ish faoliyati bo`yicha har kunlik hisobotni tizimga
              kiritadi. Hisobotlar belgilangan me'yor va shaklda taqdim etiladi
              hamda tizimda saqlanadi.
            </p>
          </div>
        </div>

        <div className="row howdoesitwork align-items-center">
          <div className="col-12 col-md-6 align-items-center">
            <h2 className="how22">
              <i class="fa-solid fa-3"></i> Rahbar uni baholaydi
            </h2>
            <p>
              Rahbarlar kunlik hisobotlarni ko‘rib chiqib, har bir faoliyat
              uchun ball va izoh beradi. Baholash tizimi shaffof va ochiq tarzda
              amalga oshiriladi.
            </p>
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
            <h2 className="how22">
              <i class="fa-solid fa-4"></i> Reyting natijalari taqdim etiladi
            </h2>
            <p>
              Kun, hafta va oy yakunlari bo`yicha barcha xodimlarning reyting
              natijalari shakllantiriladi. Bu natijalar rahbariyat va xodimlar
              uchun ochiq bo`lib, mukofot va rag`batlantirish jarayonlariga asos
              bo`lib xizmat qiladi.
            </p>
          </div>
        </div>
      </div>

      <div id="statistika" className="statistics hero">
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
        {/* <div className="row">
          <div className="eng-faollar col-12 col-md-4 text-start justify-content-center align-items-center">
            <div className="eng-faol d-flex justify-content-center align-items-center">
              <img src={avatar} className="avatar" alt="avatar" />
              <div className="infooo">
                <span>Behruz Abdurakhimov</span>
                <br />
                <span>
                  <i>Tizim administratori</i>
                </span>
                <br />
                <span className="yellowword">45 ta hisobot</span>
              </div>
            </div>
          </div>
          <div className="eng-faollar col-12 col-md-4 text-start justify-content-center align-items-center">
            <div className="eng-faol d-flex justify-content-center align-items-center">
              <img src={avatar} className="avatar" alt="avatar" />
              <div className="infooo">
                <span>Feruz Topshpo`latov</span>
                <br />
                <span>
                  <i>Xizmat boshlig`i</i>
                </span>
                <br />
                <span className="yellowword">40 ta hisobot</span>
              </div>
            </div>
          </div>
          <div className="eng-faollar col-12 col-md-4 text-start justify-content-center align-items-center">
            <div className="eng-faol d-flex justify-content-center align-items-center">
              <img src={avatar} className="avatar" alt="avatar" />
              <div className="infooo">
                <span>John Doe</span>
                <br />
                <span>
                  <i>Muhandis</i>
                </span>
                <br />
                <span className="yellowword">39 ta hisobot</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <footer className="footer row">
        <div className="col-12 col-md-4 text-start">
          <img src={logo} className="footer-logo" alt="logo" />
          <p>
            Xodimlar potensiali monitoringgi bo`yicha O`zbekistondagi birinchi
            kundalik hisobotlarni elektron qayd etish platformasi &copy; —
            2025-yil fevral oyida “Toshkent metropoliteni” DUK'da birinchi marta
            ishga tushirilgan.
          </p>
        </div>
        <div className="col-12 col-md-4">
          <ul className="list-unstyled bbg text-start">
            <li>
              <Link to="/statistika">
                <i class="fa-solid fa-chart-simple"></i> Statistika
              </Link>
            </li>
            <li>
              <Link to="/templates/instructions.pdf">
                <i class="fa-solid fa-book"></i> Dasturdan foydalanish
                yo`riqnomasi
              </Link>
            </li>
            <li>
              <Link to="/documents/privacy-policy">
                <i class="fa-solid fa-shield-halved"></i> Maxfiylik siyosati
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-12 col-md-4">
          <ul className="list-unstyled bbg text-start">
            <li>
              <a href="tel:+998712413140">
                <i class="fa-solid fa-phone-volume"></i> +998 (71) 241-31-40
              </a>
            </li>
            <li>
              <div className="ctrl-enter">
                <i class="fa-solid fa-phone-volume"></i> Ichki raqam: 53-89
              </div>
            </li>
            <li>
              <a href="mailto:support@mkundalik.uz">
                <i class="fa-solid fa-envelope"></i> support@mkundalik.uz
              </a>
            </li>
            <br />
            <span className="ctrl-enter">
              Agar tizimdan xatolik topsangiz Ctrl + Enter tugmalarini bosing
            </span>
            <br />
            <span className="ctrl-enter">Barcha huquqlar himoyalangan.</span>
            <p className="ctrl-enter">Toshkent - 2025</p>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Main;
