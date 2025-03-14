import React from "react";
import { Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const FAQPage = () => {
  return (
    <div className="container mt-5">
      <h2>Ko`p so`raladigan savollar (FAQ)</h2>
      <Accordion defaultActiveKey="0">

      <Accordion.Item eventKey="0">
          <Accordion.Header>Tizim qanday ishlaydi?</Accordion.Header>
          <Accordion.Body className='faqbody'>
          Elektron hisobot tizimi - xodimlarning kundalik ish faoliyatini qayd etish uchun yaratilgan. Xodimlar "Ishni boshlash" va "Yakunlash" orasidagi ishlarini kundalik hisobotlar orqali hisobga oladilar.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="10">
          <Accordion.Header >"Ishni boshlash" tugmasini bosish ish vaqtiga bog`liqmi?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            "Ishni boshlash" tugmasini bosish ish vaqtiga bog`liq emas. Asosiy maqsad - shu kundagi kundalik ish faoliyatini qayd etishdir.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="10">
           <Accordion.Header >Mening kundalik hisobotimning mazmuni o`zgarib ketyapti!</Accordion.Header>
           <Accordion.Body className='faqbody'>
             Kundalik hisobotning mazmuniga faqatgina profil egasi javobgar hisoblanadi. O`zgarib ketishining sababi - ko`p foydalanuvchilar "Google translate" orqali o`zbek tilidan boshqa tilga sahifani tarjima qilish funksiyasini yoqib qo`yishganlarida sahifani avtomatik o`zgartirib yuboryapti, Bazaga esa yozilgan barcha ma'lumotlar boradi.
           </Accordion.Body>
         </Accordion.Item>




        <Accordion.Item eventKey="1">
          <Accordion.Header>Ertalab kundalikka kirsam, bir kun oldingi hisobot yopilib qoldi</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Agar A-kunida hisobotni ochsangiz va uni yopmasangiz, soat 23:59 dan keyin hisobotingiz avtomatik ravishda yakunlanadi va uni o‘zgartirib bo‘lmaydi. Yozilgan hisobotlar xavfsiz saqlanadi.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="9">
          <Accordion.Header >Hisobot yozish davomida tugmalar ishlamay qoldi, qanday qilib hisobotni yuborishim mumkin?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Barcha funksiyalar to‘g‘ri ishlaydi. Agar bunday holat yuz bersa, internet aloqa sifatini tekshiring.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Bir kun oldingi hisobotimni qanday tahrirlashim mumkin?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Yakunlangan hisobotlarni o‘zgartirib bo‘lmaydi, ammo ularni ko‘rib chiqish va PDF yoki Word formatida yuklab olishingiz mumkin.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Agar hisobot yaratib, hech qanday ma'lumot kiritmasam, nima bo‘ladi?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Hisobot yaratilgan, ammo hech qanday vazifa kiritilmagan bo‘lsa, u avtomatik ravishda o‘chiriladi va yuborilmaydi.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Hisobotimni PDF yoki Word formatida yuklay olmayapman</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Bunday holatda internet aloqasini tekshiring yoki boshqa brauzerda yuklashni sinab ko‘ring.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="14">
           <Accordion.Header>Tizimda rollar ma'nolari?</Accordion.Header>
           <Accordion.Body className='faqbody'>
             Tizimda 7 xil turdagi rollar mavjud: <br />
             1. "employee" - bu xodim uchun, bunday turdagi xodimlar faqatgina hisobot yozishi mumkin. <br />
             2. "admin" - asosan bo`lim boshliqlari foydalanadigan rol hisoblanadi va biriktirilgan xodimlarni baholash hamda kundalik yozish funksiyasi mavjud. <br />
             3. "department" - xizmat boshlig`i profili. Ushbu profilda kundalik hisobot yozish va bo`lim boshliqlarining kundalik hisobotlarini baholash funksiyasi, tashkiliy tuzilmaning barcha xodimlarining yozgan kundaliklarini ko`ra olish imkoniyati mavjud. <br />
             4. "complex" - Kompleks raxbar (Asosan, metropoliten boshlig`i o`rinbosarlari uchun). Ushbu profilda kundalik hisobot yozish va xizmat boshliqlarining kundalik hisobotlarini baholash funksiyasi, kompleksning barcha xodimlarining yozgan kundaliklarini ko`ra olish imkoniyati mavjud. <br />
             5. "boss" - Boshliq profili. Bu turdagi profilda kundalik hisobot yozilmaydi. Monitoring, statistika sahifalari mavjud. Metropolitendagi barcha xodimlarning hisobotlarini ko`ra oladi.<br />
             6. "commission" - E'tirozlarni ko`rib chiqish komissiyasi. Bu turdagi profilda kundalik hisobot yozilmaydi. Kelib tushgan e'tirozlarni hal qilish uchun maxsus sahifa mavjud.<br />
             7. "superadmin" - Barcha funksiya mavjud. Yangi xodim qo`shish, xodimlarning lavozimini o`zgartirish, ma'lum xodimni tizimdan o`chirib yuborish, barcha xodimlarning kundalik hisobotlarini ko`ra olish va boshqa funksiyalar mavjud.<br />
           </Accordion.Body>
         </Accordion.Item>
 
         <Accordion.Item eventKey="13">
           <Accordion.Header>Baholash qancha vaqtda ko`rib chiqilishi kerak?</Accordion.Header>
           <Accordion.Body className='faqbody'>
             Kundalik hisobot yakunlangan kundan boshlab 3 ish kuni ichida ko`rib chiqiladi.
           </Accordion.Body>
         </Accordion.Item>
 
         <Accordion.Item eventKey="12">
           <Accordion.Header>Hisobotga   qo`yilgan ballar nimani anglatadi?</Accordion.Header>
           <Accordion.Body className='faqbody'>
             Biriktirilgan boshliq tomonidan kundalik hisobotlarga qo`yiladigan ballar: 75-100 ball: yaxshi; 50-74 ball: o`rtacha; 1-49 ball: qoniqarsiz.
           </Accordion.Body>
         </Accordion.Item>
 
         <Accordion.Item eventKey="11">
           <Accordion.Header>Bahoga nisbatan e'tirozlarni ko`rib chiqish jarayoni qanday?</Accordion.Header>
           <Accordion.Body className='faqbody'>
             Boshlig`ingiz tomonidan qo`yilgan bahoga nisbatan e'tirozingiz bo`lsa kundalik hisobotning pastki qismida "<i class="fa-solid fa-triangle-exclamation"></i>" belgisi ustiga bosish kerak. E'tirozingizni batafsil bayon qilganingizdan so`ng, murojaatingiz maxsus komissiya tomonidan ko`rib chiqiladi.
           </Accordion.Body>
         </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>Boshlig‘im hisobotimni past ball bilan baholadi, lekin men vazifalarimni to‘liq bajarganman</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Bunday hollarda "Kundalik Ish Faoliyatim" bo‘limidan hisobotingizni tanlab, qo‘yilgan ball oldida joylashgan qizil belgini bosib, vaziyatni batafsil yozib yuboring. Murojaatingiz maxsus komissiya tomonidan ko‘rib chiqiladi.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>"Mening Xodimlarim" bo‘limida begonalar bor yoki barcha xodimlarim ko‘rinmayapti</Accordion.Header>
          <Accordion.Body className='faqbody'>
            "NIB" xizmati xodimlariga yoki <a href="mailto:mkundalik@tashmetro.uz">mkundalik@tashmetro.uz</a> elektron pochtasiga ariza yozib qoldiring.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="7">
          <Accordion.Header>Yozgan hisobotlarim boshlig`imga ko`rinmayapti</Accordion.Header>
          <Accordion.Body className='faqbody'>
            "NIB" xizmati xodimlariga yoki <a href="mailto:mkundalik@tashmetro.uz">mkundalik@tashmetro.uz</a> elektron pochtasiga ariza yozib qoldiring.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="7">
          <Accordion.Header>Nega xizmat raxbarlari faqatgina bo`lim boshliqlarini baholay oladilar?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            Barcha raxbarlarga hisobotlarni tekshirish qiyinchilik tug`dirmasligi uchun faqatgina biriktirilgan xodimlarni baholash imkoniyati mavjud. Misol uchun xizmat boshliqlari bo`lim boshliqlarini, bo`lim boshliqlari esa biriktirilgan xodimlarini baholashi mumkin. Ammo bevosita tekshiruvchi xodimlari, misol uchun kompleks raxbar, hatto department ham kundalik hisobotlarni ko`rib turishi mumkin, ammo baholay olmaydilar.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="8">
          <Accordion.Header>Parolni qayerdan o‘zgartirsam bo‘ladi?</Accordion.Header>
          <Accordion.Body className='faqbody'>
            "Mening Ma'lumotlarim" bo‘limida parolingizni o‘zgartirishingiz mumkin. Agar profilingizga kira olmasangiz, "NIB" xizmati xodimlariga xat bilan, og`zaki yoki <a href="mailto:mkundalik@tashmetro.uz">mkundalik@tashmetro.uz</a> elektron pochtasiga ariza yozish orqali murojaat qiling.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FAQPage;