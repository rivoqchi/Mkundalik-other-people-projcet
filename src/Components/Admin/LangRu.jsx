import React from "react";

function LangRu() {
  const openPage = (link) => {
    window.open(link, "_blank");
  };

  return (
    <div className="enpage-container">
      <h2 className="enpage-title">Выберите раздел</h2>
      <div className="enpage-button-group">
        <button
          className="enpage-button listening-button"
          onClick={() => openPage("https://www.russianforfree.com/dialogues.php")}
        >
          🎧 Аудирование
        </button>
        <button
          className="enpage-button reading-button"
          onClick={() => openPage("https://www.russianforfree.com/texts.php")}
        >
          📖 Чтение
        </button>
        <button
          className="enpage-button speaking-button"
          onClick={() => openPage("https://russianschoolrussificate.com/practice/")}
        >
          🎙️ Говорение
        </button>
        <button
          className="enpage-button writing-button"
          onClick={() => openPage("https://www.lingualift.com/blog/russian-cursive-writing-practice-sheet/")}
        >
          ✍️ Письмо
        </button>
      </div>
    </div>
  );
}

export default LangRu;
