import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useLoading } from '../Additional/LoadingScreen';
import { useTheme } from '../Additional/ThemeContext';

const SecurityDashboard = () => {
    const { theme } = useTheme();
    const { setLoading: setGlobalLoading } = useLoading();

    const canvasRef = useRef(null);
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [blockedIPs, setBlockedIPs] = useState([]);
    const [lockouts, setLockouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [manualBlock, setManualBlock] = useState({ ip: '', reason: '' });

    // Matrix Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*()";
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        const draw = () => {
            ctx.fillStyle = theme === 'dark' ? "rgba(10, 15, 30, 0.05)" : "rgba(241, 245, 249, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = theme === 'dark' ? "#0f0" : "#3b82f6";
            ctx.font = fontSize + "px monospace";


            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        draw();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchLogs();
            fetchLockouts();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, logsRes, blockedRes, lockoutsRes] = await Promise.all([
                axios.get(`${API}/security/stats`),
                axios.get(`${API}/security/logs`),
                axios.get(`${API}/security/blocked-ips`),
                axios.get(`${API}/security/lockouts`)
            ]);
            setStats(statsRes.data);
            setLogs(logsRes.data.logs);
            setBlockedIPs(blockedRes.data);
            setLockouts(lockoutsRes.data);
        } catch (err) {
            toast.error('Ma\'lumotlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await axios.get(`${API}/security/logs`);
            setLogs(res.data.logs);
        } catch (err) {
            console.error('Logs refresh failed');
        }
    };

    const fetchLockouts = async () => {
        try {
            const res = await axios.get(`${API}/security/lockouts`);
            setLockouts(res.data);
        } catch (err) {
            console.error('Lockouts refresh failed');
        }
    };

    const handleUnblock = async (id) => {
        setGlobalLoading(true);
        try {
            await axios.delete(`${API}/security/unblock-ip/${id}`);
            toast.success('IP blokdan chiqarildi');
            fetchData();
        } catch (err) {
            toast.error('Xatolik yuz berdi');
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleResetLockout = async (id) => {
        setGlobalLoading(true);
        try {
            await axios.delete(`${API}/security/lockouts/${id}`);
            toast.success('Blokirovka yechildi');
            fetchData();
        } catch (err) {
            toast.error('Xatolik yuz berdi');
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleManualBlock = async (e) => {
        e.preventDefault();
        if (!manualBlock.ip) return toast.error('IP manzilni kiriting');
        setGlobalLoading(true);
        try {
            await axios.post(`${API}/security/block-ip`, {
                ipAddress: manualBlock.ip,
                reason: manualBlock.reason || 'Manual block by SuperAdmin',
                isPermanent: true
            });
            toast.success('IP muvaffaqiyatli bloklandi');
            setManualBlock({ ip: '', reason: '' });
            fetchData();
        } catch (err) {
            toast.error('Bloklashda xatolik: ' + (err.response?.data?.error || 'Serverda xatolik'));
        } finally {
            setGlobalLoading(false);
        }
    };

    if (loading && !stats) return (
        <div className="security-loader" style={{ height: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-primary text-center"
            >
                <i className="fa-solid fa-shield-halved fa-4x mb-3 text-primary"></i>
                <div className="h5 font-monospace text-primary">XAVFSIZLIK TIZIMI YUKLANMOQDA...</div>
            </motion.div>
        </div>
    );


    return (
        <div className="security-dashboard-ultra">
            <canvas ref={canvasRef} className="matrix-bg" />

            <div className="content-overlay p-4">
                <style>{`
                    .security-dashboard-ultra {
                        position: relative;
                        min-height: 100vh;
                        background: var(--bg-primary);
                        color: var(--text-primary);
                        font-family: 'Space Grotesk', 'Outfit', sans-serif;
                        overflow-x: hidden;
                        transition: background-color 0.4s;
                    }
                    .matrix-bg {
                        position: fixed;
                        top: 0; left: 0;
                        z-index: 0;
                        opacity: ${theme === 'dark' ? '0.15' : '0.08'};
                    }
                    .content-overlay {
                        position: relative;
                        z-index: 1;
                    }
                    .cyber-card {
                        background: var(--bg-card);
                        backdrop-filter: blur(15px);
                        border: 1px solid var(--border-cyber);
                        border-radius: 24px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                        position: relative;
                        overflow: hidden;
                    }
                    .cyber-card::before {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0; height: 1px;
                        background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
                    }
                    .live-glow {
                        width: 10px;
                        height: 10px;
                        background: #10b981;
                        border-radius: 50%;
                        display: inline-block;
                        box-shadow: 0 0 15px #10b981;
                        animation: pulse-glow 2s infinite;
                    }
                    @keyframes pulse-glow {
                        0% { transform: scale(1); opacity: 0.6; }
                        50% { transform: scale(1.3); opacity: 1; }
                        100% { transform: scale(1); opacity: 0.6; }
                    }
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                        gap: 20px;
                    }
                    .cyber-nav {
                        background: var(--bg-surface);
                        border-radius: 12px;
                        padding: 5px;
                        display: flex;
                        gap: 10px;
                    }
                    .cyber-nav-btn {
                        padding: 8px 24px;
                        border-radius: 10px;
                        border: none;
                        background: transparent;
                        color: var(--text-secondary);
                        font-weight: 600;
                        transition: all 0.3s;
                    }
                    .cyber-nav-btn.active {
                        background: var(--accent-glow);
                        color: var(--accent-primary);
                        box-shadow: inset 0 0 10px var(--accent-glow);
                        border: 1px solid var(--border-cyber);
                    }
                    .cyber-table {
                        width: 100%;
                        border-collapse: separate;
                        border-spacing: 0 8px;
                    }
                    .cyber-table tr {
                        background: var(--bg-surface);
                        transition: all 0.2s;
                    }
                    .cyber-table tr:hover {
                        background: var(--bg-card);
                        transform: scale(1.005);
                    }
                    .cyber-table th {
                        padding: 15px 20px;
                        font-size: 11px;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        color: var(--text-secondary);
                    }
                    .cyber-table td {
                        padding: 15px 20px;
                        border-bottom: 1px solid rgba(255,255,255,0.02);
                    }
                    .cyber-input {
                        background: var(--bg-surface);
                        border: 1px solid var(--border-cyber);
                        border-radius: 12px;
                        color: var(--text-primary);
                        padding: 12px 18px;
                        transition: all 0.3s;
                    }
                    .cyber-input:focus {
                        border-color: var(--accent-primary);
                        outline: none;
                        box-shadow: 0 0 15px var(--accent-glow);
                    }
                    .cyber-badge {
                        padding: 4px 12px;
                        border-radius: 100px;
                        font-family: 'Space Grotesk', monospace;
                        font-size: 10px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .badge-info { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
                    .badge-warning { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
                    .badge-critical { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
                `}</style>


                <motion.header
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="d-flex justify-content-between align-items-center mb-5"
                >
                    <div className="d-flex align-items-center">
                        <div className="cyber-logo-container me-4">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                className="logo-ring"
                            ></motion.div>
                            <i className="fa-solid fa-shield-halved fa-3x text-primary" style={{ position: 'relative', zIndex: 1 }}></i>
                        </div>
                        <div>
                            <h1 className="fw-black mb-1 letter-spacing-tight">KIBERXAVFSIZLIK PANELI</h1>
                            <div className="d-flex align-items-center gap-3">
                                <span className="small text-secondary font-monospace">STATUS: <span className="text-success">HIMOYA_FAOL</span></span>
                                <div className="divider-sm"></div>
                                <span className="small text-secondary font-monospace d-flex align-items-center gap-2">
                                    <div className="live-glow"></div> JONLI_KUZATUV
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.header>

                <div className="stats-grid mb-5">
                    <StatBox label="JAMI_AUDIT_LOG" value={stats?.totalLogs} icon="fa-terminal" color="blue" />
                    <StatBox label="OXIRGI_24H_FAOLIYAT" value={stats?.logs24h} icon="fa-radiation" color="amber" />
                    <StatBox label="IP_BAN_LIST" value={stats?.blockedIPs} icon="fa-user-lock" color="rose" />
                    <StatBox label="VAQTINCHA_BLOKDA" value={stats?.tempLockouts} icon="fa-hourglass-half" color="cyan" />
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-lg-8">
                        <div className="cyber-card p-0">
                            <div className="p-4 border-bottom border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
                                <div className="cyber-nav">
                                    <button
                                        className={`cyber-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('overview')}
                                    >HARAKATLAR</button>
                                    <button
                                        className={`cyber-nav-btn ${activeTab === 'blocked' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('blocked')}
                                    >IP_BAN_LIST</button>
                                    <button
                                        className={`cyber-nav-btn ${activeTab === 'temp_locks' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('temp_locks')}
                                    >VAQTINCHA_BLOKDA</button>
                                </div>
                                <button onClick={fetchData} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                                    <i className="fa-solid fa-sync"></i>
                                </button>
                            </div>

                            <div className="p-4 overflow-auto" style={{ maxHeight: '600px' }}>
                                <AnimatePresence mode="wait">
                                    {activeTab === 'overview' && (
                                        <motion.table key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cyber-table">
                                            <thead>
                                                <tr>
                                                    <th>VAQTI</th>
                                                    <th>FAOLIYAT_TURI</th>
                                                    <th>STATUS</th>
                                                    <th>IP_ADDRESS</th>
                                                    <th>PROFIL</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {logs.map(log => (
                                                    <tr key={log._id}>
                                                        <td className="small font-monospace">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                                        <td><span className="font-monospace fw-bold">{log.event}</span></td>
                                                        <td><SeverityTag level={log.level} /></td>
                                                        <td className="text-primary font-monospace">{log.ipAddress}</td>
                                                        <td className="small">{log.userId?.name || log.phone || "ANONYMOUS"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </motion.table>
                                    )}

                                    {activeTab === 'temp_locks' && (
                                        <motion.div key="locks" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            {lockouts.length === 0 ? (
                                                <EmptyState message="VAQTINCHALIK_BLOKLAR_TOPILMADI" />
                                            ) : (
                                                <div className="row g-3">
                                                    {lockouts.map(lock => (
                                                        <div key={lock._id} className="col-md-6">
                                                            <div className="p-3 bg-secondary bg-opacity-10 border border-secondary border-opacity-20 rounded-4">
                                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                                    <div>
                                                                        <div className="small text-secondary mb-1">IDENTIFIER</div>
                                                                        <div className="h5 font-monospace mb-0 text-primary">{lock.phone || lock.ipAddress}</div>
                                                                    </div>
                                                                    <button onClick={() => handleResetLockout(lock._id)} className="btn btn-sm btn-outline-success">
                                                                        BLOKDAN_CHIQARISH <i className="fa-solid fa-key ms-1"></i>
                                                                    </button>
                                                                </div>
                                                                <div className="d-flex justify-content-between small">
                                                                    <div className="text-danger">HARAKATLAR_SONI: {lock.attempts}</div>
                                                                    <div className="text-warning">GACHA_BLOKLANGAN: {new Date(lock.lockUntil).toLocaleTimeString()}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {activeTab === 'blocked' && (
                                        <motion.div key="blocked" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            {blockedIPs.length === 0 ? (
                                                <EmptyState message="BLOKLANGAN_IP_MANZILLAR_TOPILMADI" />
                                            ) : (
                                                <div className="row g-3">
                                                    {blockedIPs.map(ip => (
                                                        <div key={ip._id} className="col-md-6">
                                                            <div className="p-3 bg-danger bg-opacity-5 border border-danger border-opacity-20 rounded-4">
                                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                                    <h5 className="font-monospace text-danger mb-0">{ip.ipAddress}</h5>
                                                                    <button onClick={() => handleUnblock(ip._id)} className="btn btn-sm btn-outline-danger">
                                                                        OLIB_TASHLASH <i className="fa-solid fa-trash-can ms-1"></i>
                                                                    </button>
                                                                </div>
                                                                <div className="small text-secondary">{ip.reason}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="cyber-card p-4 h-100">
                            <h5 className="fw-bold mb-4 font-monospace"><i className="fa-solid fa-user-shield me-2 text-primary"></i> XAVFSIZLIK_TIZIMI</h5>

                            <div className="mb-5">
                                <label className="small text-secondary mb-2">MANUAL_IP_BAN</label>
                                <form onSubmit={handleManualBlock}>
                                    <input
                                        type="text"
                                        className="cyber-input w-100 mb-3"
                                        placeholder="IP"
                                        value={manualBlock.ip}
                                        onChange={e => setManualBlock({ ...manualBlock, ip: e.target.value })}
                                    />
                                    <textarea
                                        className="cyber-input w-100 mb-3"
                                        rows="2"
                                        placeholder="BLOK_SABABI"
                                        value={manualBlock.reason}
                                        onChange={e => setManualBlock({ ...manualBlock, reason: e.target.value })}
                                    ></textarea>
                                    <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3">
                                        BLOKLASH <i className="fa-solid fa-gavel ms-2"></i>
                                    </button>
                                </form>
                            </div>

                            <div className="threat-analytics">
                                <h6 className="small text-secondary mb-3 font-monospace">TOP_YUBORILGAN_SO`ROVLAR</h6>
                                {stats?.topAttackedEndpoints.map((item, idx) => (
                                    <div key={idx} className="mb-3">
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span className="text-secondary font-monospace">{item._id.substring(0, 20)}...</span>
                                            <span className="text-primary fw-bold">{item.count}</span>
                                        </div>
                                        <div className="progress rounded-pill bg-dark" style={{ height: '6px' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.count / (stats.logs24h || 1)) * 100}%` }}
                                                className="progress-bar bg-primary shadow-lg"
                                            ></motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, icon, color }) => {
    const colors = {
        blue: '#3b82f6',
        amber: '#f59e0b',
        rose: '#ef4444',
        cyan: '#06b6d4'
    };
    const c = colors[color];
    return (
        <div className="cyber-card p-4">
            <div className="d-flex align-items-center gap-3 mb-2">
                <i className={`fa-solid ${icon} text-secondary`}></i>
                <span className="small font-monospace text-secondary">{label}</span>
            </div>
            <h2 className="mb-0 fw-black" style={{ color: c }}>{value || 0}</h2>
        </div>
    );
};

const SeverityTag = ({ level }) => {
    const className = `cyber-badge badge-${level === 'critical' ? 'critical' : level === 'warning' ? 'warning' : 'info'}`;
    return <span className={className}>{level}</span>;
}

const EmptyState = ({ message }) => (
    <div className="text-center py-5">
        <i className="fa-solid fa-shield-check fa-4x text-success opacity-10 mb-4"></i>
        <p className="font-monospace text-secondary letter-spacing-widest">{message}</p>
    </div>
);

export default SecurityDashboard;
