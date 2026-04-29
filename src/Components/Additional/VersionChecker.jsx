import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { X, Download, RefreshCw, AlertCircle } from 'lucide-react';
import './VersionChecker.scss';

const CURRENT_VERSION_KEY = 'app_version';
const DEFAULT_VERSION = '2.0.3';

const VersionChecker = () => {
    const [showUpdate, setShowUpdate] = useState(false);
    const [versionData, setVersionData] = useState(null);
    const [platform, setPlatform] = useState('web');
    const [localVersion, setLocalVersion] = useState(() => {
        return localStorage.getItem(CURRENT_VERSION_KEY) || DEFAULT_VERSION;
    });

    const checkVersion = useCallback(async () => {
        // Diabled per user request to prevent CORS error
        return;
    }, [localVersion]);

    const trackPlatform = useCallback(async (plat) => {
        // Diabled per user request to prevent CORS error
        return;
    }, []);

    useEffect(() => {
        // Detect platform
        const capPlatform = Capacitor.getPlatform();
        setPlatform(capPlatform);

        // Track platform usage on app start
        trackPlatform(capPlatform);

        // Initial check
        checkVersion();

        // Listen for manual check requests
        window.addEventListener('check-app-version', checkVersion);

        // Save default version if not exists
        if (!localStorage.getItem(CURRENT_VERSION_KEY)) {
            localStorage.setItem(CURRENT_VERSION_KEY, DEFAULT_VERSION);
        }

        return () => {
            window.removeEventListener('check-app-version', checkVersion);
        };
    }, [checkVersion]);

    const handleUpdate = () => {
        if (platform === 'android' && versionData?.androidUrl) {
            window.open(versionData.androidUrl, '_blank');
        } else if (platform === 'ios') {
            // iOS usually via TestFlight or App Store
            // For now just show message as requested
        } else {
            // Web: refresh page and update local version
            localStorage.setItem(CURRENT_VERSION_KEY, versionData.version);
            window.location.reload();
        }
    };

    const closeBanner = () => {
        setShowUpdate(false);
    };

    if (!showUpdate) return null;

    return (
        <div className="version-update-banner">
            <div className="banner-content">
                <div className="banner-icon">
                    <AlertCircle size={24} />
                </div>
                <div className="banner-text">
                    <h3>Yangi talqin mavjud! ({versionData?.version})</h3>
                    <p>
                        {platform === 'ios' 
                            ? "Iltimos, TestFlight orqali dasturni yangilang" 
                            : platform === 'android' 
                                ? "Dasturning yangi imkoniyatlaridan foydalanish uchun uni yangilang." 
                                : "Sahifada yangilanish mavjud, iltimos sahifani yangilang."}
                    </p>
                </div>
                <div className="banner-actions">
                    <button className="update-btn" onClick={handleUpdate}>
                        {platform === 'web' ? <RefreshCw size={18} /> : <Download size={18} />}
                        <span>{platform === 'web' ? "Yangilash" : "Yuklab olish"}</span>
                    </button>
                    <button className="close-btn" onClick={closeBanner}>
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VersionChecker;
