import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import { useLoading } from "../Additional/LoadingScreen";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../Additional/ThemeContext";

function Security() {
    const { t } = useTranslation();
    const { setLoading } = useLoading();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();
    const location = useLocation();
    const id = window.localStorage.getItem("user_id");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [activeSessions, setActiveSessions] = useState([]);

    // Base path calculation for back navigation based on the current URL
    // e.g., /admin/profile/security -> /admin/profile
    const currentPath = location.pathname;
    const backPath = currentPath.substring(0, currentPath.lastIndexOf('/'));

    const getActiveSessions = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API}/security/sessions`, { withCredentials: true });
            setActiveSessions(data);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getActiveSessions();
    }, []);

    const revokeSession = async (sessionId) => {
        try {
            setLoading(true);
            await axios.delete(`${API}/security/sessions/${sessionId}`, { withCredentials: true });
            getActiveSessions();
            alert("Tanlangan qurilma tizimdan chiqarib yuborildi");
        } catch (error) {
            alert("Qurilmani chiqarishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!oldPassword || !newPassword) {
            setMessage("Iltimos, barcha maydonlarni to‘ldiring");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(`${API}/auth/changepass/${id}`, {
                oldPassword,
                newPassword,
            }, { withCredentials: true });

            setMessage(response.data.message);
            setOldPassword("");
            setNewPassword("");
        } catch (error) {
            setMessage(error.response?.data?.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-wrapper-premium" style={{ minHeight: '100vh', padding: '20px' }}>
            <div className="d-flex align-items-center mb-4 gap-3">
                <Button variant={isDark ? "outline-light" : "outline-dark"} onClick={() => navigate(backPath)} className="rounded-circle" style={{ width: '40px', height: '40px', padding: 0 }}>
                    <i className="fa-solid fa-arrow-left"></i>
                </Button>
                <h3 className={`${isDark ? "text-light" : "text-dark"} m-0`}><i className="fa-solid fa-shield-halved text-primary"></i> Tizim Xavfsizligi</h3>
            </div>

            <div className="profile-grid-layout" style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="profile-main-content" style={{ maxWidth: '800px', width: '100%' }}>

                    <div className="glass-card p-4 mb-4">
                        <h5 className={`${isDark ? "text-light" : "text-dark"} mb-4`}><i className="fa-solid fa-laptop text-info"></i> Faol Qurilmalar</h5>
                        <div className="active-sessions-wrapper">
                            {activeSessions.map((session, idx) => (
                                <div key={idx} className="session-card glass-card d-flex justify-content-between align-items-center mb-3 p-3" style={{ borderRadius: '12px', background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}>
                                    <div className="device-info d-flex align-items-center gap-3">
                                        <i className="fa-solid fa-mobile-screen-button fs-2 text-primary"></i>
                                        <div>
                                            <div className={`${isDark ? "text-light" : "text-dark"} fw-bold`} style={{ fontSize: "1.1rem" }}>
                                                {session.device ? session.device.substring(0, 40) + '...' : "Noma'lum qurilma"}
                                            </div>
                                            <div className={`${isDark ? "text-white-50" : "text-muted"} mt-1`} style={{ fontSize: "0.9rem" }}>
                                                <i className="fa-solid fa-network-wired me-1"></i> {session.ipAddress} <br />
                                                <i className="fa-regular fa-clock me-1"></i> {new Date(session.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline-danger"
                                        className="btn-revoke-session px-4"
                                        onClick={() => revokeSession(session.sessionId)}
                                    >
                                        <i className="fa-solid fa-power-off me-2"></i> Chiqarish
                                    </Button>
                                </div>
                            ))}
                            {activeSessions.length === 0 && (
                                <div className={`${isDark ? "text-white-50" : "text-muted"} text-center py-4`}>
                                    <i className="fa-solid fa-shield-check fs-1 mb-2 d-block text-success"></i>
                                    Boshqa qurilmalar mavjud emas
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-card p-4">
                        <h5 className={`${isDark ? "text-light" : "text-dark"} mb-4`}><i className="fa-solid fa-key text-warning"></i> {t("updatePass")}</h5>
                        <div className="premium-password-form">
                            <div className="premium-input-wrapper mb-3">
                                <i className="fa-solid fa-lock input-icon"></i>
                                <input
                                    type="password"
                                    className="premium-input-field"
                                    placeholder={t("oldPass")}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>
                            <div className="premium-input-wrapper mb-4">
                                <i className="fa-solid fa-key input-icon"></i>
                                <input
                                    type="password"
                                    className="premium-input-field"
                                    placeholder={t("newPass")}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            {message && <div className={`form-message mb-3 ${message.includes("muvaffaqiyatli") ? "text-success" : "text-danger"}`}>{message}</div>}
                            <Button className="btn-update-pass-premium w-100 py-2 fs-5" onClick={handlePasswordChange}>
                                <i className="fa-solid fa-shield-check me-2"></i> {t("updatePass")}
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Security;
