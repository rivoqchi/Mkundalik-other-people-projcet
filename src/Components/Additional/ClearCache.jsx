import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { API } from '../../config';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useTheme } from './ThemeContext';

function ClearCache() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [clearing, setClearing] = useState(false);
    const [cleared, setCleared] = useState(false);

    const performClear = async () => {
        setClearing(true);

        try {
            // 1. Clear LocalStorage & SessionStorage
            window.localStorage.clear();
            window.sessionStorage.clear();

            // 2. Clear Cache Storage API (Service Workers / Dynamic caching)
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }

            // 3. Clear Backend Session (Implicit logout ignoring local state)
            // We pass withCredentials to ensure cookies are sent back to be cleared
            try {
                await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
            } catch (err) {
                console.warn("Backend logout failed or already cleared.", err);
            }

            // Small delay for UI feedback
            setTimeout(() => {
                setClearing(false);
                setCleared(true);

                // 4. Force hard reload from server, clearing current memory state and navigating to login
                setTimeout(() => {
                    window.location.replace('/login');
                }, 1500);

            }, 1000);

        } catch (error) {
            console.error("Keshlarni tozalashda xatolik:", error);
            setClearing(false);
            alert("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
        }
    };

    return (
        <div className={`d-flex align-items-center justify-content-center p-4`} style={{ minHeight: '100vh', background: isDark ? '#020617' : '#f8fafc' }}>
            <Helmet>
                <title>Tizim ma'lumotlarini tozalash - mkundalik.uz</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div
                className="p-5 text-center shadow-lg"
                style={{
                    maxWidth: '500px',
                    width: '100%',
                    borderRadius: '20px',
                    background: isDark ? 'linear-gradient(145deg, #0f172a, #1e293b)' : '#ffffff',
                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
                }}
            >
                <div className="mb-4">
                    <i className={`fa-solid ${cleared ? 'fa-circle-check text-success' : 'fa-broom text-primary'} ${clearing ? 'fa-flip' : ''}`} style={{ fontSize: '4rem' }}></i>
                </div>

                <h2 className={`mb-3 fw-bold ${isDark ? 'text-white' : 'text-dark'}`}>
                    {cleared ? "Tozalandi!" : "Tizimni tozalash"}
                </h2>

                <p className={`mb-4 ${isDark ? 'text-secondary' : 'text-muted'}`} style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
                    Agar tizimda muammolar kuzatilayotgan bo'lsa (ma'lumotlar yangilanmasligi, qayta-qayta login so'ralishi kabi), ushbu tugmani bosish orqali barcha saqlangan sozlamalar, keshlar va avtorizatsiya ma'lumotlarini tozalashingiz mumkin.
                </p>

                <div className="p-3 mb-4 text-start rounded" style={{ background: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #ef4444' }}>
                    <p className={`m-0 ${isDark ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.9rem' }}>
                        <strong className="text-danger"><i className="fa-solid fa-triangle-exclamation me-1"></i> Diqqat:</strong> Bu jarayon sizni tizimdan chiqarib yuboradi va qaytadan tizimga kirishingiz talab etiladi.
                    </p>
                </div>

                {!cleared && (
                    <div className="d-flex flex-column gap-3">
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-100 fw-bold py-3 d-flex align-items-center justify-content-center gap-2"
                            onClick={performClear}
                            disabled={clearing}
                            style={{ borderRadius: '12px' }}
                        >
                            {clearing ? (
                                <>
                                    <Spinner animation="border" size="sm" /> Tozalanmoqda...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-trash-can"></i> Barchasini tozalash
                                </>
                            )}
                        </Button>

                        <Button
                            variant="link"
                            className={`text-decoration-none ${isDark ? 'text-secondary' : 'text-muted'}`}
                            onClick={() => navigate(-1)}
                            disabled={clearing}
                        >
                            Orqaga qaytish
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClearCache;
