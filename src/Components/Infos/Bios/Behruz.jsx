import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BehruzImg from '../../Images/Behruz.jpg';

const Behruz = () => {
    const navigate = useNavigate();

    return (
        <div className="premium-bio-page">
            <div className="bio-container">
                <button className="bio-back-btn" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i> Orqaga
                </button>

                <Helmet>
                    <title>Abdurakhimov Behruz - Full-stack dasturchi | mkundalik.uz</title>
                    <meta name="description" content="Abdurakhimov Behruz G'ofur o`g`li - Toshkent Metropoliteni bosh mutaxassisi, Full-stack dasturchi. mkundalik loyihasi asoschisi." />
                    <meta name="keywords" content="Behruz Abdurakhimov, behruzed, mkundalik, full-stack developer, Toshkent metropoliteni, dasturchi" />
                    <link rel="canonical" href="https://mkundalik.uz/about/behruz" />
                </Helmet>

                <div className="bio-header">
                    <div className="bio-avatar-wrapper">
                        <img src={BehruzImg} alt="Abdurakhimov B. G`." />
                        <div className="bio-avatar-glow"></div>
                    </div>
                    <h1>Abdurakhimov Behruz G`ofur o`g`li</h1>
                    <p className="bio-role">Full-stack Dasturchi</p>
                </div>

                <div className="bio-content-grid">
                    <div className="bio-card main-info">
                        <h3><i className="fa-solid fa-user"></i> Shaxsiy ma'lumotlar</h3>
                        <ul>
                            <li><strong>Tug'ilgan yili:</strong> 2005-yil 19-noyabr</li>
                            <li><strong>Millati:</strong> O'zbek</li>
                            <li><strong>Telefon:</strong> +998 (90) 811-11-23</li>
                            <li><strong>Email:</strong> behruzed@uzmetro.uz | behruzed@mail.ru</li>
                        </ul>
                    </div>


                    

                    <div className="bio-card education">
                        <h3><i className="fa-solid fa-graduation-cap"></i> Ta'lim</h3>
                        <p><strong>2023-yildan hozirgacha:</strong> Islom Karimov nomidagi Toshkent davlat texnika universiteti (TDTU) talabasi.</p>
                        <p>Full-stack dasturlash yo'nalishida zamonaviy texnologiyalar (MERN stack) bo'yicha mutaxassis.</p>
                    </div>

                    <div className="bio-card experience">
                        <h3><i className="fa-solid fa-briefcase"></i> Ish faoliyati</h3>
                        <p><strong>2025-yil fevral oyidan hozirgacha:</strong> "Toshkent metropoliteni" DUK Axborot xavfsizligini ta'minlash va axborot kommunikatsiyalarini rivojlantirish xizmati.</p>
                        <p>Dasturiy tizimlar arxitekturasi va kiberxavfsizlik masalalari bo'yicha bosh mutaxassis.</p>
                    </div>

<div className="bio-card main-info">

<p><b>Behruz Abdurakhimov</b> — <b>Full-Stack dasturchi</b> bo‘lib, u <b>mkundalik.uz</b> axborot tizimini <i>loyihalash, ishlab chiqish va texnik jihatdan shakllantirish</i> jarayonlarini to‘liq amalga oshirgan.</p>

<p>Loyiha doirasida u <b>tizim arxitekturasi</b>ni ishlab chiqish, <b>backend va frontend</b> qismlarini yaratish, <b>ma’lumotlar bazasi tuzilmasi</b>ni loyihalash hamda <b>API xizmatlari</b>ni ishlab chiqish kabi asosiy texnik vazifalarni bajargan.</p>

<p>Shuningdek, tizimda <b>autentifikatsiya va avtorizatsiya</b> mexanizmlarini joriy etish, <b>token asosidagi xavfsizlik</b>, <b>cookie siyosatlari</b> hamda <b>OAuth integratsiyasi</b> kabi zamonaviy <u>kiberxavfsizlik yechimlari</u>ni tatbiq etgan.</p>

<p>U platformaning <b>foydalanuvchi interfeysi (UI)</b> va <b>foydalanuvchi tajribasi (UX)</b>ni ham mustaqil ravishda ishlab chiqib, tizimni <b>MERN stack</b> (<i>MongoDB, Express.js, React.js, Node.js</i>) asosida yaratgan.</p>

<p>Bundan tashqari, loyiha doirasida <b>mobil qurilmalar uchun moslashuvchan (responsive)</b> veb platforma ishlab chiqilgan hamda <b>Android va iOS</b> qurilmalari uchun mobil ilovalar integratsiyasi amalga oshirilgan.</p>

</div>

                    <div className="bio-card social-links">
                        <h3><i className="fa-solid fa-share-nodes"></i> Ijtimoiy tarmoqlar</h3>
                        <div className="social-grid">
                            <a href="https://instagram.com/behruzed" target="_blank" rel="noreferrer" className="social-item ig">
                                <i className="fa-brands fa-instagram"></i> Instagram
                            </a>
                            <a href="https://t.me/behruzed" target="_blank" rel="noreferrer" className="social-item tg">
                                <i className="fa-brands fa-telegram"></i> Telegram
                            </a>
                            <a href="https://behruzed.uz" target="_blank" rel="noreferrer" className="social-item web">
                                <i className="fa-solid fa-globe"></i> Websayt
                            </a>
                        </div>
                    </div>

                    <div className="bio-card full-width">
                        <h3><i className="fa-brands fa-instagram"></i> Instagram</h3>
                        <div className="instagram-container">
                            {/* Instagram profiles often block direct iframes, so we use a link/preview style or a specialized embed if available */}
                            <iframe
                                src="https://www.instagram.com/behruzed/embed"
                                width="100%"
                                height="600"
                                frameBorder="0"
                                scrolling="no"
                                allowTransparency="true"
                                title="Behruzed Instagram"
                                style={{ borderRadius: '20px', border: 'none' }}
                            ></iframe>
                        </div>
                    </div>
                    <span className="text-center text-danger mt-4 fw-bold">* Ma'lumotlar 2026-yil mart oyi holatiga ko'ra</span>
                </div>
            </div>
        </div>
    );
};

export default Behruz;
