import React from 'react';

const News = () => {
    return (
        <div className="news-container">
                <div className="news-card">
                    <img className="newsimg" src="https://static.vecteezy.com/system/resources/thumbnails/046/861/646/small_2x/gemini-icon-on-a-transparent-background-free-png.png" />
                    <h2 className="news-title">Sun'iy intellekt</h2>
                    <p className="news-description">Tez orada tizimga sun'iy intellekt qo`shilishini ma'lum qilamiz. U kundalik hisobotlarni yozishda imloviy xatolarni to`g`irlashda va matnni mukammallashtirishda hamda hisobotlarni mazmun jihatdan qisqartirib berish imkoniyatlarini ta'minlaydi.</p>
                </div>

                <div className="news-card">
                    <img className="newsimg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1200px-Telegram_logo.svg.png" />
                    <h2 className="news-title">Bildirishnoma</h2>
                    <p className="news-description">Bildirishnomalarni rasmiy telegram bot orqali olish imkoniyati. U o`z ichiga hisobot baholangan zahoti telegram bot orqali axborotlarni yuborishni oladi.</p>
                </div>


        </div>
    );
};

export default News;