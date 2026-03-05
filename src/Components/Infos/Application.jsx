import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const Application = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="app-redesign-container">
            <button className="premium-back-btn" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left"></i> {t("back")}
            </button>

            <div className="app-premium-card">
                <div className="app-icon-header">
                    <i className="fa-solid fa-headset"></i>
                </div>

                <h3>{t("murojaat_tit")}</h3>

                <div className="app-description">
                    <p>
                        <strong>mkundalik.uz</strong> ma'muriyati foydalanuvchilar bilan doimiy aloqada bo'lishdan mamnun.
                        Agar sizda har qanday takliflar, shikoyatlar yoki texnik nosozliklar yuzaga kelsa, bizga murojaat qiling.
                    </p>
                    <p>
                        Iltimos, murojaatingizni <a href="mailto:mkundalik@tashmetro.uz">mkundalik@tashmetro.uz</a> elektron
                        pochta manziliga yuboring. Xabaringizda muammoning batafsil tavsifini va o'zingiz haqingizdagi
                        ma'lumotlarni (ism, familiya, aloqa raqami) ilova qilishingizni tavsiya etamiz.
                    </p>
                    <p>
                        Barcha murojaatlar Dushanbadan Juma kunigacha, ish tartibiga muvofiq ko'rib chiqiladi.
                        Biz har bir xabarga imkon qadar tezroq javob berishga harakat qilamiz.
                    </p>
                </div>

                <div className="app-footer-info">
                    {t("hurmat_bilan")}, <br />
                    <strong>mkundalik.uz ma'muriyati</strong>
                </div>
            </div>
        </div>
    );
};

export default Application;