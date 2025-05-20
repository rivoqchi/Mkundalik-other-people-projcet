import React, { useState } from "react";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import QRCode from "qrcode";
import ImageModule from "docxtemplater-image-module-free";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";
import Department from "../Redirects/Department";

const DownloadObject = ({ employee }) => {
  const [qrBase64, setQrBase64] = useState("");
  
  const { t } = useTranslation();
  // QR kod yaratish va uni Base64 formatga o‘tkazish
  const generateQRCode = async (text) => {
    try {
      return await QRCode.toDataURL(text);
    } catch (error) {
      console.error("QR kod yaratishda xatolik yuz berdi:", error);
      return "";
    }
  };

  const generateDocx = async () => {
    try {
      // QR kodni generatsiya qilish
      const qrCodeBase64 = await generateQRCode(employee._id);
      setQrBase64(qrCodeBase64);

      // Word shablon faylini yuklash
      const response = await fetch("/templates/object.docx");
      const templateArrayBuffer = await response.arrayBuffer();

      const zip = new PizZip(templateArrayBuffer);
      const imageModule = new ImageModule({
        getImage: async (tag) => {
          const response = await fetch(tag);
          const blob = await response.blob();
          return blob;
        },
        getSize: () => [150, 150], // QR kodning o‘lchami
      });

      const doc = new Docxtemplater(zip, { modules: [imageModule] });
console.log(employee);

      doc.setData({
        name: employee.name,
        complex: employee.complex,
        department: employee.department,
        section: employee.section,
        degree: employee.degree,
        phone: employee.phone,
        nationality: employee.nationality,
        education: employee.education,
        speciality: employee.speciality,
        dateOfBirth: employee.dateOfBirth,
        placeOfBirth: employee.placeOfBirth,
        role: employee.role,
        address: employee.address,
        acceptedBy: employee.acceptedBy || "Topilmadi",
        firstAct: employee.firstAct

      });

      doc.render();

      const updatedDoc = doc.getZip().generate({ type: "blob" });
      saveAs(updatedDoc, `Obyektivka_${employee.name}.docx`);
    } catch (error) {
      console.error("Hujjatni yaratishda xatolik yuz berdi:", error);
    }
  };
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Bu hisobotning PDF versiyasidir", 10, 10);
    doc.save(`Obyektivka_${employee.name}.pdf`);
  };
  return (
    <div>
      <button onClick={generateDocx} title="mkundalik data" className="hisobotkorish2">
      <i className="fa-solid fa-download"></i>
      </button>
    </div> 
  );
};

export default DownloadObject;
