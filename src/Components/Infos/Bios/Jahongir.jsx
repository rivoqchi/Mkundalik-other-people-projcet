import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Usmonov from '../../Images/Usmonov.png';
import Navbarr from '../../Navbar';

const Jahongir = () => {
    const navigate = useNavigate();

    return (
        <>
        <Navbarr />
        <div className="premium-bio-page pt-5">
            <div className="bio-container">
                <button className="bio-back-btn" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i> Orqaga
                </button>

                <Helmet>
                    <title>Usmanov Raxmonbek - «Toshkent metropoliteni» DUK boshlig‘i | mkundalik.uz</title>
                    <meta name="description" content="Usmanov Raxmonbek Djaxongirovich - Toshkent metropoliteni DUK boshlig'i, davlat va jamoat arbobi." />
                    <meta name="keywords" content="Raxmonbek Usmanov, Toshkent metropoliteni boshlig'i, metropoliten hokimi, mkundalik" />
                    <link rel="canonical" href="https://mkundalik.uz/about/jahongir" />
                </Helmet>

                <div className="bio-header">
                    <div className="bio-avatar-wrapper">
                        <img src={Usmonov} alt="Usmanov R. J." />
                        <div className="bio-avatar-glow"></div>
                    </div>
                    <h1>Usmanov Raxmonbek Djaxongirovich</h1>
                    <p className="bio-role">«Toshkent metropoliteni» DUK boshlig‘i</p>
                </div>

                <div className="bio-content-grid">
                    <div className="bio-card main-info">
                        <h3><i className="fa-solid fa-user"></i> Shaxsiy ma'lumotlar</h3>
                        <ul>
                            <li><strong>Tug'ilgan yili:</strong> 1960-yil 24-aprel</li>
                            <li><strong>Millati:</strong> O'zbek</li>
                            <li><strong>Telefon:</strong> +998 71-241-65-14</li>
                            <li><strong>E-mail:</strong> metro@tashmetro.uz</li>
                        </ul>
                    </div>

                    <div className="bio-card education">
                        <h3><i className="fa-solid fa-graduation-cap"></i> Ma'lumot</h3>
                        <p>Davlat va jamoat arbobi. Ko'p yillik boshqaruv tajribasiga ega yetuk mutaxassis.</p>
                        <p style={{ marginTop: '10px' }}><strong>Mukofotlari:</strong> 2024-yilda "Fidokorona xizmatlari uchun" ordeni bilan taqdirlangan.</p>
                    </div>

                    <div className="bio-card experience">
                        <h3><i className="fa-solid fa-briefcase"></i> Ish faoliyati</h3>
                        <ul>
                            <li><strong>2011–2018:</strong> Toshkent shahar hokimi</li>
                            <li><strong>2021:</strong> Oʻzbekiston Respublikasi transport vazirining oʻrinbosari</li>
                            <li><strong>2021-h.v.:</strong> “Toshkent metropoliteni” unitar korxonasi boshligʻi</li>
                        </ul>
                        <p style={{ marginTop: '15px' }}>Xodimlarning ish faoliyatini raqamlashtirish va samaradorlikni oshirish bo'yicha "mkundalik" loyihasi tashabbuskori.</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Jahongir;
