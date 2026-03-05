import React from "react";
import { Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const FAQPage = () => {
  const navigate = useNavigate();

  return (
    <div className="info-redesign">
      <div className="faq-premium-container">
        <button className="premium-back-btn" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i> Orqaga
        </button>

        <div className="faq-header">
          <h2>Ko‘p so‘raladigan savollar (FAQ)</h2>
          <p>Tizimdan foydalanish bo'yicha eng ommabop savollarga javoblar</p>
        </div>

        <Accordion defaultActiveKey="0">
          {/* 1. Umumiy va Kirish */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>Tizim qanday ishlaydi?</Accordion.Header>
            <Accordion.Body>
              Elektron hisobot tizimi xodimlarning kundalik ish faoliyatini qayd etish uchun yaratilgan. Xodimlar "Ishni boshlash" va "Yakunlash" orasidagi ishlarini kundalik hisobotlar orqali hisobga oladilar.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Parolni qanday o‘zgartirish mumkin?</Accordion.Header>
            <Accordion.Body>
              "Mening Ma'lumotlarim" bo‘limida parolingizni o‘zgartirishingiz mumkin. Agar profilingizga kira olmasangiz, "NIB" xizmatiga yoki <a href="mailto:mkundalik@tashmetro.uz">mkundalik@tashmetro.uz</a> elektron pochtasiga murojaat qiling.
            </Accordion.Body>
          </Accordion.Item>

          {/* 2. Ish jarayoni */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>"Ishni boshlash" tugmasini bosish ish vaqtiga bog‘liqmi?</Accordion.Header>
            <Accordion.Body>
              Yo‘q, "Ishni boshlash" tugmasini bosish ish vaqtiga bog‘liq emas. Asosiy maqsad shu kundagi ish faoliyatini qayd etishdir.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Kecha hisobot yozish esimdan chiqibdi, endi nima bo`ladi?</Accordion.Header>
            <Accordion.Body>
              Har bir elektron hisobot faqat o`sha kun ichida yozilishi mumkin. Agar hisobot yozish esdan chiqib ketsa, uni qayta tiklash yoki o`zgartirish imkoni yo`q. Hisobotni yozish vaqti esa ish boshlash tugmasi bosilgan kun hisoblanadi.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header>Ertalab kundalikka kirganimda bir kun oldingi hisobot yopilib qolgan bo‘lsa, nima qilish kerak?</Accordion.Header>
            <Accordion.Body>
              Agar A-kunida hisobotni ochsangiz va uni yopmasangiz, soat 23:59 dan keyin hisobotingiz avtomatik ravishda yakunlanadi va uni o‘zgartirib bo‘lmaydi. Yozilgan hisobotlar xavfsiz saqlanadi.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="5">
            <Accordion.Header>Ma'lum sabablarga ko`ra ishda bo`lmagan kunlarimda nima qilishim kerak?</Accordion.Header>
            <Accordion.Body>
              Qandaydir sabab bilan ishda bo`lmagan kunlaringiz uchun hisobot yozish shart emas. Bunday kunlar hisobotlarda ko`rsatilmaydi va baholash jarayoniga ta'sir qilmaydi, agarda bu kunlarni profilingizdan sababini belgilab qo'ysangiz.
            </Accordion.Body>
          </Accordion.Item>

          {/* 3. Texnik muammolar */}
          <Accordion.Item eventKey="6">
            <Accordion.Header>Men elektron hisobot yozgan edim, lekin "Kundalik ish faoliyatim" bo`limida ko`rinmayapti.</Accordion.Header>
            <Accordion.Body>
              Bunday hollarda siz boshqa kishining login ma'lumotlari bilan tizimga kirgan bo`lishingiz mumkin. Elektron hisobot yozish jarayonida u aynan tizimga kirib turgan shaxsning hisobida saqlanadi.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="7">
            <Accordion.Header>Tizim ishlamay qolsa nima qilishimiz kerak?</Accordion.Header>
            <Accordion.Body>
              Tizimda texnik profilaktika ishlari olib borilayotgan bo`lsa, bu haqda oldindan xabar beriladi. Agar tizim kutilmaganda ishlamay qolsa, iltimos, texnik yordam xizmatiga murojaat qiling, ichki raqam: 50-55
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="8">
            <Accordion.Header>Hisobot yozish jarayonida tugmalar ishlamay qoldi, nima qilish kerak?</Accordion.Header>
            <Accordion.Body>
              Agar bunday holat yuz bersa, internet aloqasi sifatini tekshiring va sahifani yangilab ko‘ring.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="9">
            <Accordion.Header>Kundalik hisobot mazmuni o‘zgarib ketishi mumkinmi?</Accordion.Header>
            <Accordion.Body>
              Kundalik hisobot mazmuniga faqatgina profil egasi javobgar hisoblanadi. Agar brauzeringizda "Google Translate" yoki boshqa avtomatik tarjima xizmatlari yoqilgan bo‘lsa, matn mazmuni noto'g'ri ko'rinishi mumkin.
            </Accordion.Body>
          </Accordion.Item>

          {/* 4. Baholash va Yuklab olish */}
          <Accordion.Item eventKey="10">
            <Accordion.Header>Baholash jarayoni qancha vaqt davom etadi?</Accordion.Header>
            <Accordion.Body>
              Kundalik hisobot yakunlangan kundan boshlab 3 ish kuni ichida mas'ullar tomonidan ko‘rib chiqiladi.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="11">
            <Accordion.Header>Bahoga nisbatan e'tirozlarni ko`rib chiqish jarayoni qanday?</Accordion.Header>
            <Accordion.Body>
              Boshlig`ingiz tomonidan qo`yilgan bahoga nisbatan e'tirozingiz bo`lsa, kundalik hisobotning pastki qismidagi "<i className="fa-solid fa-triangle-exclamation"></i>" belgisi ustiga bosing. E'tirozingizni batafsil bayon qilganingizdan so`ng, murojaatingiz maxsus komissiya tomonidan ko`rib chiqiladi.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="12">
            <Accordion.Header>Bir kun oldingi hisobotni qanday tahrirlash yoki yuklab olish mumkin?</Accordion.Header>
            <Accordion.Body>
              Yakunlangan hisobotlarni o‘zgartirib bo‘lmaydi, ammo ularni ko‘rib chiqish va PDF yoki Word formatida yuklab olish imkoniyati mavjud. Agar yuklab olishda muammo bo‘lsa, boshqa brauzer orqali urinib ko'ring.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQPage;
