import React from "react";
import { saveAs } from "file-saver";
import { API } from "../../config";

const DownloadObject = ({ employee }) => {

  // Schedule ma'lumotlarini olish
  const getSchedules = async () => {
    const response = await fetch(`${API}/auth/getschedules?_id=${employee}`);
    if (!response.ok) {
      throw new Error("Ma'lumot olishda xatolik yuz berdi");
    }
    const data = await response.json();
    return data.schedules;
  };

  // Ma'lumotni odamlar uchun o'qiladigan formatga aylantirish
  const convertToReadableText = (schedules) => {
    return schedules.map((item, index) => {
      let text = `📋 Hisobot #${index + 1}\n`;
      text += `Boshlanish vaqti: ${item.startedAt}\n`;
      text += `Yakunlanish vaqti: ${item.closed}\n`;
      text += `Boshlovchi nomi: ${item.beginnerName}\n`;
      text += `Bo'lim: ${item.section}\n`;
      text += `Kompleks: ${item.complex}\n`;
      text += `Lavozimi: ${item.degree}\n`;
      text += `Bahosi: ${item.rated !== undefined ? item.rated : "Yo'q"}\n`;
      text += `Vazifalar:\n`;

      item.tasks.forEach((task, i) => {
        text += `   ${i + 1}. ${task.title}\n`;
      });

      text += `----------------------------------------\n`;
      return text;
    }).join("\n");
  };

  // Ma'lumotni txt faylga saqlash
  const saveSchedulesAsTxt = async () => {
    try {
      const schedules = await getSchedules();

      if (schedules.length === 0) {
        alert("Hisobot topilmadi.");
        return;
      }

      // Foydalanuvchiga qulay ko'rinishga keltiramiz
      const textContent = convertToReadableText(schedules);

      // Fayl nomi uchun oxirgi hisobotning boshlovchi nomini olamiz
      const beginnerName = schedules[schedules.length - 1].beginnerName.replace(/ /g, "_");

      // Blob yaratamiz
      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });

      // Faylni yuklab olish
      saveAs(blob, `Hisobotlar_${beginnerName}.txt`);

    } catch (error) {
      console.error("Faylni yaratishda xatolik:", error);
    }
  };

  return (
    <div>
      <button onClick={saveSchedulesAsTxt} title="Hisobotlarni yuklab olish" className="hisobotkorish2">
        <i className="fa-solid fa-file-lines"></i>
      </button>
    </div>
  );
};

export default DownloadObject;