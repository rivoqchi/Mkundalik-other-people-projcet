import React from "react";
import { Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const FAQPage = () => {
  return (
    <div className="container mt-5">
      <h2>Ko‘p so‘raladigan savollar (FAQ)</h2>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Tizim qanday ishlaydi?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Elektron hisobot tizimi xodimlarning kundalik ish faoliyatini qayd etish uchun yaratilgan. Xodimlar "Ishni boshlash" va "Yakunlash" orasidagi ishlarini kundalik hisobotlar orqali hisobga oladilar.
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="1">
          <Accordion.Header>"Ishni boshlash" tugmasini bosish ish vaqtiga bog‘liqmi?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Yo‘q, "Ishni boshlash" tugmasini bosish ish vaqtiga bog‘liq emas. Asosiy maqsad shu kundagi ish faoliyatini qayd etishdir.
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="2">
          <Accordion.Header>Kundalik hisobot mazmuni o‘zgarib ketishi mumkinmi?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Kundalik hisobot mazmuniga faqatgina profil egasi javobgar hisoblanadi. Agar "Google Translate" yoki boshqa avtomatik tarjima xizmatlari yoqilgan bo‘lsa, sahifa avtomatik o‘zgarishi mumkin.
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="3">
          <Accordion.Header>Ertalab kundalikka kirganimda bir kun oldingi hisobot yopilib qolgan bo‘lsa, nima qilish kerak?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Agar A-kunida hisobotni ochsangiz va uni yopmasangiz, soat 23:59 dan keyin hisobotingiz avtomatik ravishda yakunlanadi va uni o‘zgartirib bo‘lmaydi. Yozilgan hisobotlar xavfsiz saqlanadi.
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="4">
          <Accordion.Header>Hisobot yozish jarayonida tugmalar ishlamay qoldi, nima qilish kerak?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Agar bunday holat yuz bersa, internet aloqasi sifatini tekshiring va sahifani yangilab ko‘ring.
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="5">
          <Accordion.Header>Bir kun oldingi hisobotni qanday tahrirlash mumkin?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Yakunlangan hisobotlarni o‘zgartirib bo‘lmaydi, ammo ularni ko‘rib chiqish va PDF yoki Word formatida yuklab olish mumkin.
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="6">
          <Accordion.Header>Hisobotni PDF yoki Word formatida yuklab olishda muammo bo‘lsa, nima qilish kerak?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Internet aloqasini tekshiring yoki boshqa brauzer orqali yuklab ko‘ring.
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="7">
          <Accordion.Header>Baholash jarayoni qancha vaqt davom etadi?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Kundalik hisobot yakunlangan kundan boshlab 3 ish kuni ichida ko‘rib chiqiladi.
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="8">
          <Accordion.Header>Parolni qanday o‘zgartirish mumkin?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            "Mening Ma'lumotlarim" bo‘limida parolingizni o‘zgartirishingiz mumkin. Agar profilingizga kira olmasangiz, "NIB" xizmatiga yoki <a href="mailto:mkundalik@tashmetro.uz">mkundalik@tashmetro.uz</a> elektron pochtasiga murojaat qiling.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="9">
          <Accordion.Header>Bahoga nisbatan e'tirozlarni ko`rib chiqish jarayoni qanday?</Accordion.Header>
          <Accordion.Body className='faqbody'>
          Boshlig`ingiz tomonidan qo`yilgan bahoga nisbatan e'tirozingiz bo`lsa kundalik hisobotning pastki qismida "<i class="fa-solid fa-triangle-exclamation"></i>" belgisi ustiga bosish kerak. E'tirozingizni batafsil bayon qilganingizdan so`ng, murojaatingiz maxsus komissiya tomonidan ko`rib chiqiladi.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="10">
          <Accordion.Header>Parolni qanday o‘zgartirish mumkin?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            "Mening Ma'lumotlarim" bo‘limida parolingizni o‘zgartirishingiz mumkin. Agar profilingizga kira olmasangiz, "NIB" xizmatiga yoki <a href="mailto:mkundalik@tashmetro.uz">mkundalik@tashmetro.uz</a> elektron pochtasiga murojaat qiling.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FAQPage;
