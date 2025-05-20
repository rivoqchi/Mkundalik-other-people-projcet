import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config";
import FileView from "../FileView";
import Loading from "../Loading";
import Alert from "../Additional/Alert";
import { Modal, Button } from "react-bootstrap"; // Importing react-bootstrap components

function Instructions() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]); // List of uploaded files
    const [viewingFileId, setViewingFileId] = useState(null); // File ID for viewing
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [loading, setLoading] = useState(false); // For showing the loading spinner
    const [showModal, setShowModal] = useState(false); // For controlling the upload modal visibility
    const [showDeleteModal, setShowDeleteModal] = useState(false); // For controlling the delete modal visibility
    const [fileToDelete, setFileToDelete] = useState(null); // ID of file to delete    
    const [myRole, setMyRole] = useState(null);
    const [mySection, setMySection] = useState(null);
    const [myDepartment, setMyDepartment] = useState(null);
    const [myComplex, setMyComplex] = useState(null);
    const [myName, setMyName] = useState(null);
    const myId = window.localStorage.getItem("user_id");

    const getMyData = async () => {
        try {
            const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
            setMySection(data.user.section);
            setMyDepartment(data.user.department);
            setMyComplex(data.user.complex);
            setMyRole(data.user.role);
            setMyName(data.user.name);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    useEffect(() => {
        getMyData();
    }, []);

    const handleViewFile = (fileId) => {
        setViewingFileId(fileId);
        
    };

    useEffect(() => {
        if (myRole) { // Faqat `myRole` mavjud bo'lsa ishga tushadi
            const fetchFiles = async () => {
                try {
                    let endpoint = "";
    
                    // Role ga qarab endpointni tanlaymiz
                    if (myRole === "admin") {
                        endpoint = `${API}/cloud/getdocsforuser/${myRole}/${mySection}`;
                    } else if (myRole === "department") {
                        endpoint = `${API}/cloud/getdocsforadmin/${myRole}/${myDepartment}`;
                    } else if (myRole === "complex") {
                        endpoint = `${API}/cloud/getdocsfordepartment/${myRole}/${myComplex}`;
                    } else {
                        setAlert({
                            show: true,
                            type: "danger",
                            message: "Role not recognized!"
                        });
                        return;
                    }
    
                    // Endpointga so'rov yuboramiz
                    const { data } = await axios.get(endpoint);
                    setUploadedFiles(data);
                } catch (error) {
                    console.error("Error fetching files:", error);
                    setAlert({
                        show: true,
                        type: "danger",
                        message: "Error fetching files!"
                    });
                }
            };
    
            fetchFiles();
        }
    }, [myRole, mySection, myDepartment, myComplex]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            setSelectedFile(file);
        } else {
            setAlert({ show: true, type: "danger", message: "File size should be less than 5MB!" });
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return setAlert({ show: true, type: "danger", message: "No file selected!" });

        setLoading(true); // Start loading spinner
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("role", myRole);
        formData.append("section", mySection);
        formData.append("department", myDepartment);
        formData.append("complex", myComplex);
        formData.append("name", myName);

        try {
            const { data } = await axios.post(`${API}/cloud/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUploadedFiles([...uploadedFiles, { fileUrl: data.fileUrl }]);
            setShowModal(false);
            setAlert({ show: true, type: "success", message: "Fayl muvaffaqiyatli yuklandi!" });
            setLoading(false); // Stop loading spinner

        } catch (error) {
            console.error("Error uploading file:", error);
            setAlert({ show: true, type: "error", message: "Yuklashda xatolik yuz berdi. Qayta urinib ko`ring." });
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    const handleDeleteConfirmation = (fileId) => {        
        setFileToDelete(fileId);
        setShowDeleteModal(true);
    };

    const handleDeleteFile = async () => {
        setLoading(true);
        try {
            await axios.delete(`${API}/cloud/delete/${fileToDelete}`);
            setUploadedFiles(uploadedFiles.filter((file) => file._id !== fileToDelete));
            setAlert({ show: true, type: "success", message: "Fayl muvaffaqiyatli o`chirildi!" });
        } catch (error) {
            console.error("Error deleting file:", error);
            setAlert({ show: true, type: "danger", message: "Faylni o`chirishda xatolik, qaytadan urinib ko`ring." });
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };
    return (
        <>
            {alert.show && <Alert type={alert.type} message={alert.message} />}
            {loading && <Loading />}

            <div className="instructions-container">
            <div className="d-flex justify-content-between mb-3">
            <h2>Lavozim yo`riqnomasi</h2>

<Button variant="primary" disabled={uploadedFiles.length>0} onClick={() => setShowModal(true)}>
    + Yuklash
</Button>
            </div>

                {/* Modal for file upload */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Yuklash</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Yopish</Button>
                        <Button variant="primary" onClick={handleFileUpload}>
                            {loading ? "Yuklanmoqda..." : "Yuklash"}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal for delete confirmation */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tasdiqlang</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Ushbu faylni o`chirmoqchimisiz?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDeleteFile}>Delete</Button>
                    </Modal.Footer>
                </Modal>

                <h3>Yuklangan lavozim yo`riqnomalari:</h3>
                <ul>
                    {uploadedFiles.length > 0 ? (
                        uploadedFiles.map((file, index) => (
                            <li className="d-flex justify-content-between instt" key={index}>
                                    {file.fileName}
                                <div className="">
                                <button className="viewins" onClick={() => handleViewFile(file._id)}><i className="fa-solid fa-eye"></i></button>
                                <button className="deleteins" onClick={() => handleDeleteConfirmation(file._id)}><i className="fa-solid fa-trash"></i></button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>Hali hech nima yuklanmadi.</p>
                    )}
                </ul>

                {viewingFileId && <FileView fileId={viewingFileId} />}
            </div>
        </>
    );
}

export default Instructions;