import React from "react";

function LangEn() {
  const openPage = (link) => {
    window.open(link, "_blank");
  };

  return (
    <div className="enpage-container">
      <h2 className="enpage-title">Bo‘limni tanlang</h2>
      <div className="enpage-button-group">
        <button
          className="enpage-button listening-button"
          onClick={() => openPage("https://learnenglish.britishcouncil.org/skills/listening")}
        >
          🎧 Listening
        </button>
        <button
          className="enpage-button reading-button"
          onClick={() => openPage("https://learnenglish.britishcouncil.org/skills/reading")}
        >
          📖 Reading
        </button>
        <button
          className="enpage-button speaking-button"
          onClick={() => openPage("https://ailearna.com/onboarding-x5j8n9p2k7m4?utm_source=google&utm_medium=wpay&utm_campaign=learna_wpay_go_wo_generic_best_aitutor_240225&utm_content=learna_wpay_go_wo_generic_best_aitutor_240225&utm_term=speak+with+ai&matchtype=b&device=c&GeoLoc=1028523&placement=&network=g&campaign_id=22282341988&adset_id=179328760950&ad_id=734434868140&gad_source=1&gad_campaignid=22282341988&gbraid=0AAAAA-PowsDqhCA-XhY1N-aMiixePTxUe&gclid=CjwKCAjwravBBhBjEiwAIr30VHtdogTsOcSmHCuVeT5XiBJcy3NJzBzxzFtvFyPlwfKjackLA0xd5hoC0GUQAvD_BwE")}
        >
          🎙️ Speaking
        </button>
        <button
          className="enpage-button writing-button"
          onClick={() => openPage("https://www.scribbr.com/ai-writing/")}
        >
          ✍️ Writing
        </button>
      </div>
    </div>
  );
}

export default LangEn;
