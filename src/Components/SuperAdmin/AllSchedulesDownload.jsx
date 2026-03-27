import React from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { API } from "../../config";

const DownloadObject = ({ employee }) => {

  // Schedule ma'lumotlarini olish
  const getSchedules = async () => {
    const response = await fetch(`${API}/auth/getschedules?_id=${employee}`, {
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error("Ma'lumot olishda xatolik yuz berdi");
    }
    const data = await response.json();
    return data.schedules;
  };

  // Ma'lumotni Word faylga saqlash
  const saveSchedulesAsWord = async () => {
    try {
      const schedules = await getSchedules();

      if (schedules.length === 0) {
        alert("Hisobot topilmadi.");
        return;
      }

      const sections = schedules.map((item, index) => {
        const paragraphs = [];

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: `Hisobot #${index + 1}`, bold: true, size: 28 })
            ]
          })
        );

        paragraphs.push(new Paragraph(`Boshlanish vaqti: ${item.startedAt}`));
        paragraphs.push(
          new Paragraph(`Bahosi: ${item.rated !== undefined ? item.rated : "Yo'q"}`)
        );

        paragraphs.push(new Paragraph("Vazifalar:"));

        item.tasks.forEach((task, i) => {
          paragraphs.push(new Paragraph(`${i + 1}. ${task.title}`));
        });

        paragraphs.push(new Paragraph(" "));
        paragraphs.push(new Paragraph("------------------------------------"));

        return paragraphs;
      }).flat();

      const doc = new Document({
        sections: [
          {
            children: sections
          }
        ]
      });

      const blob = await Packer.toBlob(doc);

      const beginnerName = schedules[schedules.length - 1].beginnerName.replace(/ /g, "_");
      saveAs(blob, `Hisobotlar_${beginnerName}.docx`);
    } catch (error) {
      console.error("Word fayl yaratishda xatolik:", error);
    }
  };

  return (
    <div>
      <button onClick={saveSchedulesAsWord} title="Hisobotlarni yuklab olish" className="hisobotkorish2">
        <i className="fa-solid fa-file-lines"></i>
      </button>
    </div>
  );
};

export default DownloadObject;