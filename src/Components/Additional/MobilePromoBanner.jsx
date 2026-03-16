import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import './MobilePromoBanner.scss';

const PROMO_DISMISSED_KEY = 'mobile_promo_dismissed';

const MobilePromoBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isDismissed = localStorage.getItem(PROMO_DISMISSED_KEY);
        const platform = Capacitor.getPlatform();
        
        // Only show on mobile web (not in the app itself)
        const isMobileWeb = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (!isDismissed && platform === 'web' && isMobileWeb) {
            // Delay showing the banner for better UX
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismissBanner = () => {
        localStorage.setItem(PROMO_DISMISSED_KEY, 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="mobile-promo-card">
            <div className="promo-container">
                <button className="close-promo" onClick={dismissBanner}>
                    <X size={18} />
                </button>
                <div className="promo-icon">
                    <Smartphone size={32} />
                </div>
                <div className="promo-content">
                    <h3>mkundalik mobil dasturi!</h3>
                    <p>Ish faoliyatingizni yanada qulayroq boshqarish uchun mobil ilovani yuklab oling.</p>
                    <div className="promo-buttons">
                        <a href="https://mdata.uz/download/mkundalik-android.apk" target="_blank" download rel="noopener noreferrer" className="promo-btn android">
                            <i className="fa-brands fa-android"></i> Android
                        </a>
                        <button className="promo-btn ios" onClick={() => alert("iOS ilova hozircha mavjud emas, vaqtinchalik brauzerdan foydalaning.")}>
                            <i className="fa-brands fa-apple"></i> iOS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobilePromoBanner;
