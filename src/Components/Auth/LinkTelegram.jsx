import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { API } from '../../config';
function LinkTelegram() {
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

    // Telegram auth function
    window.onTelegramAuth = (user) => {
      // console.log('User authorized:', user);
      verifyAndSaveUserData(user);
    };

    return () => {
      if (telegramContainerRef.current) {
        telegramContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  const verifyAndSaveUserData = async (user) => {
    try {
      let id = window.localStorage.getItem('user_id');
      const response = await axios.put(`${API}/auth/linktelegram/${id}`, user);

      if (response.status === 200) {
        alert('Telegram ulandi!');
        window.location.reload()
      }
    } catch (error) {
      alert('Avtorizatsiyada xatolik!');
    }
  };

  return <div ref={telegramContainerRef} id="telegram-login-container" className="telegram-fixed"></div>;
}

export default LinkTelegram;