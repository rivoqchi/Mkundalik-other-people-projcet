import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestNotificationPermission } from './NotificationManager';
import './NotificationPrompt.css';

const NotificationPrompt = () => {
    const [isVisible, setIsVisible] = useState(false);
    const isSignedIn = window.localStorage.getItem("isSignedIn") === "true";

    useEffect(() => {
        // Check if user is signed in and has not already granted/denied permission
        if (isSignedIn && "Notification" in window) {
            if (Notification.permission === "default") {
                // Show prompt after a short delay
                const timer = setTimeout(() => {
                    setIsVisible(true);
                }, 4000);
                return () => clearTimeout(timer);
            }
        }
    }, [isSignedIn]);

    const handleAllow = async () => {
        await requestNotificationPermission();
        setIsVisible(false);
    };

    const handleLater = () => {
        setIsVisible(false);
        // Optionally save in session storage to not show again in this session
        sessionStorage.setItem('notif_prompt_later', 'true');
    };

    // Don't show if user clicked later in this session
    if (sessionStorage.getItem('notif_prompt_later') === 'true') {
        return null;
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="notification-prompt-overlay">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="notification-prompt-card"
                    >
                        <div className="notif-icon-wrapper pulse-animation">
                            <i className="fa-solid fa-bell"></i>
                        </div>
                        <h3 className="notif-title">Xabardor bo'ling!</h3>
                        <p className="notif-desc">
                            Bildirishnomalarga ruxsat berish orqali rahbaringiz tomonidan qo'yilgan baholar va muhim yangiliklarni jonli tarzda bilib turasiz.
                        </p>
                        <div className="notif-btn-group">
                            <button className="notif-btn notif-btn-later" onClick={handleLater}>
                                Keyinroq
                            </button>
                            <button className="notif-btn notif-btn-allow" onClick={handleAllow}>
                                Ruxsat berish
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NotificationPrompt;
