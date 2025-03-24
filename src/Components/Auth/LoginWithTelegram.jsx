import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { API } from '../../config';

function LoginWithTelegram() {
  const telegramContainerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'mkundalikbot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');

    if (telegramContainerRef.current) {
      telegramContainerRef.current.appendChild(script);
    }

    window.onTelegramAuth = (user) => {
      verifyAndSaveUserData(user);
    };

    return () => {
      if (telegramContainerRef.current) {
        telegramContainerRef.current.innerHTML = ''; // Vidjetni tozalash
      }
    };
  }, []);

  const verifyAndSaveUserData = async (user) => {
    try {
      const response = await axios.post(`${API}/auth/loginwithtelegram`, user);
      if (response.status === 200) {
        window.localStorage.setItem("token", response.data.token);
        window.localStorage.setItem("fullName", response.data.employee.name);
        window.localStorage.setItem("phone", response.data.employee.phone);
        window.localStorage.setItem("user_id", response.data.employee._id);
        
        const roleRedirects = {
          employee: '/user',
          admin: '/admin',
          department: '/department',
          complex: '/complex',
          superadmin: '/superadmin',
          commission: '/commission',
          commission: '/sport',
          commission: '/at',
          boss: '/boss'
        };

        window.location.replace(roleRedirects[response.data.employee.role] || '/');
      }
    } catch (error) {
      alert('Ushbu akkauntingiz ro`yxatdan o`tmagan!');
    }
  };

  return (
    <div ref={telegramContainerRef} id="telegram-login-container" className="telegram-fixed"></div>
  );
}

export default LoginWithTelegram;