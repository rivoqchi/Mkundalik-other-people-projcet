import React, { useState } from "react";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import QRCode from "qrcode";
import ImageModule from "docxtemplater-image-module-free";
import jsPDF from "jspdf";

const DownloadDocx = ({ thisScheduleHistory, degree, currentDateTime }) => {
  const [qrBase64, setQrBase64] = useState("");

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
      const qrCodeBase64 = await generateQRCode(thisScheduleHistory._id);
      setQrBase64(qrCodeBase64);

      // Word shablon faylini yuklash
      const response = await fetch("/templates/template.docx");
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

      const formattedTasks = thisScheduleHistory.tasks
        ?.slice(0, 30)
        .filter(task => task && task.title)
        .map((task, index) => `${index + 1}. ${task.title}`);

      doc.setData({
        name: thisScheduleHistory.beginnerName,
        complex: thisScheduleHistory.complex,
        department: thisScheduleHistory.department,
        section: thisScheduleHistory.section,
        degree: degree || "Маълумот топилмади",
        date: thisScheduleHistory?.startedAt?.slice(0, 10) || "N/A",
        rated: thisScheduleHistory?.rated ? `${thisScheduleHistory.rated}/100` : "--",
        ratedName: thisScheduleHistory?.ratedName ? `${thisScheduleHistory.ratedName}` : "--",
        comment: thisScheduleHistory?.comment ? `${thisScheduleHistory.comment}` : "--",
        tasks: formattedTasks.length ? formattedTasks : [],
        qrCode: qrCodeBase64, // QR kodning Base64 shakli
        currentDateTime
      });

      doc.render();

      const updatedDoc = doc.getZip().generate({ type: "blob" });
      saveAs(updatedDoc, "Hisobot.docx");
    } catch (error) {
      console.error("Hujjatni yaratishda xatolik yuz berdi:", error);
    }
  };
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Bu hisobotning PDF versiyasidir", 10, 10);
    doc.save("Hisobot.pdf");
  };
  return (
    <div>
      <button onClick={generateDocx} className="pdf-download-btn">
        .DOCX юклаб олиш
      </button>
      {/* <button onClick={generatePDF}>.pdf юклаб олиш</button> */}
    </div>
  );
};

export default DownloadDocx;
