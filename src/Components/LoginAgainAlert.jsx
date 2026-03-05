import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from './Additional/ThemeContext';

const LoginAgainAlert = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = window.localStorage.getItem("token");
    if (token) {
      setShow(true);
    }
  }, []);

  const handleClearAndLogin = () => {
    window.localStorage.clear();
    window.localStorage.setItem("force_security_refresh", "true");
    window.location.replace('/login');
  };

  return (
    <AnimatePresence>
      {show && (
        <Modal
          show={show}
          centered
          backdrop="static"
          keyboard={false}
          className="security-update-modal"
        >
          <style>{`
                        .security-update-modal .modal-content {
                            background: ${theme === 'dark' ? '#0f172a' : '#ffffff'};
                            color: ${theme === 'dark' ? '#f8fafc' : '#1e293b'};
                            border-radius: 24px;
                            border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
                            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                            padding: 20px;
                            overflow: hidden;
                            position: relative;
                        }
                        .security-update-modal .modal-content::before {
                            content: '';
                            position: absolute;
                            top: 0; left: 0; width: 100%; height: 4px;
                            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                        }
                        .security-icon-box {
                            width: 70px;
                            height: 70px;
                            background: rgba(59, 130, 246, 0.1);
                            border-radius: 20px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 20px;
                            color: #3b82f6;
                            font-size: 30px;
                        }
                        .security-update-modal .modal-body {
                            padding: 20px 10px;
                        }
                        .security-update-modal .modal-footer {
                            border: none;
                            justify-content: center;
                            padding-top: 0;
                        }
                        .btn-security-ok {
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                            border: none !important;
                            padding: 12px 40px !important;
                            border-radius: 14px;
                            font-weight: 600;
                            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
                            transition: all 0.3s;
                        }
                        .btn-security-ok:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
                        }
                    `}</style>
          <Modal.Body className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="security-icon-box">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h4 className="fw-bold mb-3">{t("security_update_title")}</h4>
              <p className="opacity-75 mb-0" style={{ lineHeight: '1.6' }}>
                {t("security_update_desc")}
              </p>
            </motion.div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-security-ok" onClick={handleClearAndLogin}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default LoginAgainAlert;
