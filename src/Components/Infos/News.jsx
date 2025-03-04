import React from "react";
import logo from "../Images/logo-png.png";

const newsData = [
  {
    id: 1,
    title: "Sun'iy intellekt",
    description:
      "Tez orada tizimga sun'iy intellekt qo`shilishini ma'lum qilamiz. U kundalik hisobotlarni yozishda imloviy xatolarni to`g`irlashda va matnni mukammallashtirishda hamda hisobotlarni mazmun jihatdan qisqartirib berish imkoniyatlarini ta'minlaydi.",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/046/861/646/small_2x/gemini-icon-on-a-transparent-background-free-png.png",
  },
  {
    id: 2,
    title: "Bildirishnoma",
    description:
      "Bildirishnomalarni rasmiy telegram bot orqali olish imkoniyati. U o`z ichiga hisobot baholangan zahoti telegram bot orqali axborotlarni yuborishni oladi.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1200px-Telegram_logo.svg.png",
  },
];

const News = () => {
  return (
    <div className="newspage">
      <div className="news-container">
        {newsData.map((news) => (
          <div key={news.id} className="news-item">
            <div className="newsprofileimg">
              <img src={logo} alt="Profile Logo" />
            </div>
            <div className="news-card">
              <img className="newsimg" src={news.image} alt={news.title} />
              <h2 className="news-title">{news.title}</h2>
              <p className="news-description">{news.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;