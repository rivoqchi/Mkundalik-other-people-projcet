import React from "react";
import { Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const FAQPage = () => {
  return (
    <div className="container mt-5">
      <h2>Ko`p so`raladigan savollar (FAQ)</h2>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Hisobot yozish davomida tugmalar ishlamay qoldi, qanday qilib hisobotni yuborishim mumkin?</Accordion.Header>
          <Accordion.Body>
            Barcha funksiyalar to‘g‘ri ishlaydi. Agar bunday holat yuz bersa, internet aloqa sifatini tekshiring.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Ertalab kundalikka kirsam, bir kun oldingi hisobot yopilib qoldi</Accordion.Header>
          <Accordion.Body>
            Agar A-kunida hisobotni ochsangiz va uni yopmasangiz, soat 23:59 dan keyin hisobotingiz avtomatik ravishda yakunlanadi va uni o‘zgartirib bo‘lmaydi. Yozilgan hisobotlar xavfsiz saqlanadi.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Bir kun oldingi hisobotimni qanday tahrirlashim mumkin?</Accordion.Header>
          <Accordion.Body>
            Yakunlangan hisobotlarni o‘zgartirib bo‘lmaydi, ammo ularni ko‘rib chiqish va PDF yoki Word formatida yuklab olishingiz mumkin.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Agar hisobot yaratib, hech qanday ma'lumot kiritmasam, nima bo‘ladi?</Accordion.Header>
          <Accordion.Body>
            Hisobot yaratilgan, ammo hech qanday vazifa kiritilmagan bo‘lsa, u avtomatik ravishda o‘chiriladi va yuborilmaydi.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Hisobotimni PDF yoki Word formatida yuklay olmayapman</Accordion.Header>
          <Accordion.Body>
            Bunday holatda internet aloqasini tekshiring yoki boshqa brauzerda yuklashni sinab ko‘ring.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>Boshlig‘im hisobotimni past ball bilan baholadi, lekin men vazifalarimni to‘liq bajarganman</Accordion.Header>
          <Accordion.Body>
            Bunday hollarda "Kundalik Ish Faoliyatim" bo‘limidan hisobotingizni tanlab, qo‘yilgan ball oldida joylashgan qizil belgini bosib, vaziyatni batafsil yozib yuboring. Murojaatingiz maxsus komissiya tomonidan ko‘rib chiqiladi.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>"Mening Xodimlarim" bo‘limida begonalar bor yoki barcha xodimlarim ko‘rinmayapti</Accordion.Header>
          <Accordion.Body>
            "NIB" xizmati xodimlariga yoki <a href="mailto:mkundalik@tashmetro.uz">mkundalik@tashmetro.uz</a> elektron pochtasiga ariza yozib qoldiring.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="7">
          <Accordion.Header>Parolni qayerdan o‘zgartirsam bo‘ladi?</Accordion.Header>
          <Accordion.Body>
            "Mening Ma'lumotlarim" bo‘limida parolingizni o‘zgartirishingiz mumkin. Agar profilingizga kira olmasangiz, "NIB" xizmati xodimlariga yoki <a href="mailto:mkundalik@tashmetro.uz">mkundalik@tashmetro.uz</a> elektron pochtasiga ariza yozib qoldiring.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FAQPage;