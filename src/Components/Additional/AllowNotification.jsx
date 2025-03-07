import React, { useState, useEffect } from 'react';

function AllowNotification() {
    const [isGranted, setIsGranted] = useState(Notification.permission === "granted");

    useEffect(() => {
        setIsGranted(Notification.permission === "granted");
    }, []);

    const requestNotificationPermission = () => {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                setIsGranted(true);
                alert("Bildirishnomalarga ruxsat berildi!");
            } else {
                alert("Siz bildirishnomalarga ruxsat bermadingiz.");
            }
        });
    };

    return (
        <>
            {!isGranted && (
                <button onClick={requestNotificationPermission}>
                    Bildirishnomalarga ruxsat berish
                </button>
            )}
        </>
    );
}

export default AllowNotification;