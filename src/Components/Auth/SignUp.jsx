import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";
import logomk from '../Images/logo-png.png';
import './Login.scss';

const Signup = () => {
    const { t } = useTranslation();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 12, stiffness: 100 } }
    };

    return (
        <div className="login-page-premium">
            <div className="ambient-glows">
                <div className="glow glow-1"></div>
                <div className="glow glow-2"></div>
                <div className="glow glow-3"></div>
            </div>

            <div className="split-layout" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>

                <div className="form-side" style={{ maxWidth: '600px', width: '100%' }}>
                    <motion.div
                        className="login-card-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ textAlign: 'center', padding: '40px' }}
                    >
                        <motion.div className="login-header-premium" variants={itemVariants}>
                            <div className="logo-badge" style={{ margin: '0 auto 20px' }}>
                                <img src={logomk} alt="Logo" />
                            </div>
                            <h1 className='text-center' style={{ fontSize: '2rem', color: '#ff4d4f' }}>Ro'yxatdan o'tish yopiq</h1>
                            <p className="subtitle" style={{ fontSize: '1.1rem', marginTop: '10px' }}>
                                Tizim xavfsizligi va maxfiyligi sababli ochiq ro'yxatdan o'tish imkoniyati bloklangan.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} style={{ margin: '30px 0', padding: '20px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <i className="fa-solid fa-circle-info" style={{ fontSize: '2rem', color: '#6366f1', marginBottom: '15px' }}></i>
                            <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
                                Parolni tiklash uchun NIB xodimlariga murojaat qiling yoki quyidagi elektron pochtaga ariza qoldiring:
                            </p>
                            <a href="mailto:mkundalik@tashmetro.uz" style={{ display: 'inline-block', marginTop: '15px', color: '#6366f1', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none' }}>
                                mkundalik@tashmetro.uz
                            </a>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    className="btn-cyber-submit"
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ background: 'linear-gradient(45deg, #10b981, #059669)', border: 'none' }}
                                >
                                    <div className="shimmer"></div>
                                    <div className="text-center">
                                        <span>KIRISH SAHIFASIGA QAYTISH</span>
                                    </div>
                                    <i className="fa-solid fa-arrow-right-to-bracket" style={{ marginLeft: '10px' }}></i>
                                </motion.button>
                            </Link>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;