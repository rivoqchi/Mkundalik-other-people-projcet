import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import FeruzImg from '../../Images/Feruz.jpg';

const Feruz = () => {
    const navigate = useNavigate();

    return (
        <div className="premium-bio-page">
            <div className="bio-container">
                <button className="bio-back-btn" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i> Orqaga
                </button>

                <Helmet>
                    <title>Toshpo'lotov Feruz - Loyiha rahbari | mkundalik.uz</title>
                    <meta name="description" content="Toshpo'lotov Feruz G'olib o'g'li - mkundalik loyihasi rahbari." />
                    <meta name="keywords" content="Feruz Toshpo'lotov, mkundalik loyiha rahbari, Toshkent metropoliteni" />
                    <link rel="canonical" href="https://mkundalik.uz/about/feruz" />
                </Helmet>

                <div className="bio-header">
                    <div className="bio-avatar-wrapper">
                        <img src={FeruzImg} alt="Toshpo'latov F. G'." />
                        <div className="bio-avatar-glow"></div>
                    </div>
                    <h1>Toshpo'lotov Feruz G'olib o'g'li</h1>
                    <p className="bio-role">Loyiha rahbari</p>
                </div>

                <div className="bio-content-grid">
                    <div className="bio-card main-info">
                        <h3><i className="fa-solid fa-user"></i> Shaxsiy ma'lumotlar</h3>
                        <ul>
                            <li><strong>Tug'ilgan yili:</strong> 31.07.1996</li>
                            <li><strong>Millati:</strong> O'zbek</li>
                            <li><strong>Telefon:</strong> +998 93 596 07 31</li>
                        </ul>
                    </div>

                    <div className="bio-card education">
                        <h3><i className="fa-solid fa-graduation-cap"></i> Ta'lim</h3>
                        <p>
                            2021-yil Toshkent davlat transport universitetini bakalavr bosqichi.<br />
                            2023-yil Toshkent davlat transport universitetini magistratura bosqichi.
                        </p>
                    </div>

                    <div className="bio-card experience">
                        <h3><i className="fa-solid fa-briefcase"></i> Mehnat faoliyati</h3>
                        <p>
                            <strong>2021-yil dekabr — 2023-yil aprel</strong>: "Toshkent metropoliteni" DUK Axborot xavfsizligini ta'minlash bo'limi muhandis dasturchi.<br />
                            <strong>2023-yil aprel — 2024-yil iyul</strong>: "Toshkent metropoliteni" DUK Axborot xavfsizligini ta'minlash bo'limi boshlig'i.<br />
                            <strong>2024-yil iyul — 2026-yil fevral</strong>: "Toshkent metropoliteni" DUK Axborot xavfsizligini ta'minlash va axborot kommunikatsiya texnologiyalarini rivojlantirish xizmati boshlig'i.
                        </p>
                    </div>
                    <span className="text-center text-danger mt-4 fw-bold">* Ma'lumotlar 2026-yil mart holatiga ko'ra</span>
                </div>
            </div>
        </div>
    );
};

export default Feruz;
