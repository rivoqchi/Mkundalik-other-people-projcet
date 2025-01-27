import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../config";

function FileView({ fileId }) {
    const [fileUrl, setFileUrl] = useState("");

    useEffect(() => {
        const fetchFileUrl = async () => {
            try {
                const { data } = await axios.get(`${API}/cloud/file/${fileId}`);
                setFileUrl(data.fileUrl); // Fayl URL sini o'rnatish
            } catch (error) {
                console.error("Fayl URL olishda xatolik:", error);
            }
        };

        fetchFileUrl(); // Fayl URL ni olish
    }, [fileId]);

    return (
        <div>
            {fileUrl ? (
                // Faylni faqat ko'rsatish uchun iframe, yuklab olish imkoniyatisiz
                <iframe 
                    src={fileUrl} 
                    width="100%" 
                    height="500px" 
                    title="Faylni ko'rish" 
                    style={{border: "none"}} 
                />
            ) : (
                <p>Faylni ko'rish uchun URL olinmoqda...</p>
            )}
        </div>
    );
}

export default FileView;