import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config";
import FileView from "../FileView";
import Loading from "../Loading";
import Alert from "../Additional/Alert";
import { Modal, Button } from "react-bootstrap";

import { useTranslation } from "react-i18next";
function LavozimYoriqnomasi() {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [viewingFileId, setViewingFileId] = useState(null);
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // O'chirish uchun modal
    const [fileToDelete, setFileToDelete] = useState(null); // O'chirilishi kerak bo'lgan fayl ID
    const myId = window.localStorage.getItem("user_id");

    useEffect(() => {
        const getMyData = async () => {
            try {
                const filesResponse = await axios.get(`${API}/cloud/getdocs/${myId}`);
                
                if (Array.isArray(filesResponse.data) && filesResponse.data.length > 0) {
                    setUploadedFiles(filesResponse.data);
                } else {
                    setUploadedFiles([]); // Agar fayl yo‘q bo‘lsa, bo‘sh array
                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setAlert({ show: true, type: "danger", message: "Error fetching files!" });
            }
        };
        getMyData();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) setSelectedFile(file);
        else setAlert({ show: true, type: "danger", message: "Fayl hajmi 5MB'dan kam bo`lishi kerak!" });
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return setAlert({ show: true, type: "danger", message: "Fayl tanlanmagan!" });
        setLoading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("myId", myId);

        try {
            const { data } = await axios.post(`${API}/cloud/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                myId
            });
            setUploadedFiles([{ fileUrl: data.fileUrl }]);
            setShowModal(false);
            setAlert({ show: true, type: "success", message: "Fayl muvaffaqiyatli yuklandi!" });
            setLoading(false);
            window.location.reload()
        } catch (error) {
            console.error("Error uploading file:", error);
            setAlert({ show: true, type: "danger", message: "Yuklashda xatolik." });
        } finally {
            setLoading(false); 
        }
    };

    const deleteThis = async (id) => { 
        try {
        setLoading(true);
          await axios.delete(`${API}/cloud/delete/${id}`);
          setUploadedFiles(uploadedFiles.filter(file => file._id !== id)); // Faylni ro‘yxatdan o‘chirish
          setAlert({ show: true, type: "success", message: "Muvaffaqiyatli o`chirildi!" });
        } catch (error) {
          setAlert({ show: true, type: "error", message: "Xatolik!" });
        } finally {
          setShowDeleteModal(false); // Modalni yopish
        }
    };

    const handleDownload = async (fileId) => {
        try {
            const { data } = await axios.get(`${API}/cloud/file/${fileId}`);
            if (!data.fileUrl) {
                throw new Error("Fayl yo‘q yoki noto‘g‘ri URL");
            }
            
            // Foydalanuvchi bilan bevosita interaksiya qilish uchun, window.open faqat tugma bosilganidan so'ng chaqirilishi kerak
            const link = document.createElement('a');
            link.href = data.fileUrl;
            link.download = data.fileUrl.split('/').pop(); // Fayl nomini olish
            link.click(); // Faylni yuklash
            
        } catch (error) {
            console.error("Error downloading file:", error);
            setAlert({ show: true, type: "danger", message: "Faylni yuklab olishda xatolik!" });
        }
    };

    
    return (
        <>
            {alert.show && <Alert type={alert.type} message={alert.message} />}
            {loading && <Loading />}
            
            {/* Agar fayl bo‘lmasa yuklash tugmasi chiqadi */}
            {uploadedFiles.length === 0 && (
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    + {t("upload")}
                </Button>
            )}

            {uploadedFiles.length > 0 && (
                <div>
                    <Button
                        variant="success"
                        onClick={() => handleDownload(uploadedFiles[0]._id)}
                    >
                        {t("download")}
                    </Button>

                    <Button onClick={() => {
                        setFileToDelete(uploadedFiles[0]._id); // O'chirish uchun fayl ID ni saqlash
                        setShowDeleteModal(true); // Modalni ochish
                    }} className="mx-3" variant="danger">
                        <i className="fa-solid fa-trash"></i>
                    </Button>
                </div>
            )}

            {/* Yuklash modal oynasi */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("uploadfile")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.png,.jpg,.xlsx,.xls,.txt" />                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Yopish</Button>
                    <Button variant="primary" onClick={handleFileUpload}>
                        {loading ? "Yuklanmoqda..." : "Yuklash"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* O'chirish modal oynasi */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("doyouwanttodelete")}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{t("doyouwanttodelete")}?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                    {t("close")}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => deleteThis(fileToDelete)}
                    >
                        {loading ? "O`chirilmoqda..." : "O`chirish"}

                    </Button>
                </Modal.Footer>
            </Modal>

            {viewingFileId && <FileView fileId={viewingFileId} />}
        </>
    );
}

export default LavozimYoriqnomasi;