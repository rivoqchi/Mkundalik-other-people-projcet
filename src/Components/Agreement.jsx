import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from './Additional/ThemeContext';

const Agreement = ({ show, onAccept, onCancel, viewMode = false }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [accepted, setAccepted] = useState(false);

    return (
        <AnimatePresence>
            {show && (
                <Modal
                    show={show}
                    onHide={onCancel}
                    centered
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                    className="agreement-cyber-modal"
                >
                    <style>{`
                        .agreement-cyber-modal .modal-content {
                            background: ${theme === 'dark' ? '#0f172a' : '#ffffff'};
                            color: ${theme === 'dark' ? '#f1f5f9' : '#1e293b'};
                            border-radius: 28px;
                            border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
                            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                            overflow: hidden;
                        }
                        .agreement-header {
                            padding: 25px 30px;
                            border-bottom: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
                            display: flex;
                            align-items: center;
                            gap: 15px;
                        }
                        .agreement-header i {
                            font-size: 24px;
                            color: #3b82f6;
                        }
                        .agreement-header h5 {
                            margin: 0;
                            font-weight: 700;
                            letter-spacing: -0.5px;
                        }
                        .agreement-body {
                            padding: 0;
                            max-height: 60vh;
                            overflow-y: auto;
                        }
                        .terms-content {
                            padding: 30px;
                            font-size: 0.95rem;
                            line-height: 1.7;
                        }
                        .terms-section {
                            margin-bottom: 25px;
                        }
                        .terms-section h6 {
                            color: #3b82f6;
                            font-weight: 700;
                            margin-bottom: 12px;
                            text-transform: uppercase;
                            font-size: 0.85rem;
                            letter-spacing: 1px;
                        }
                        .agreement-footer {
                            padding: 20px 30px;
                            background: ${theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'};
                            border-top: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
                        }
                        .agreement-checkbox-wrapper {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            margin-bottom: 20px;
                            cursor: pointer;
                            user-select: none;
                        }
                        .agreement-checkbox {
                            width: 22px;
                            height: 22px;
                            border-radius: 6px;
                            border: 2px solid ${theme === 'dark' ? '#334155' : '#cbd5e1'};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.2s;
                        }
                        .agreement-checkbox.checked {
                            background: #3b82f6;
                            border-color: #3b82f6;
                        }
                        .agreement-checkbox i {
                            color: white;
                            font-size: 12px;
                            display: none;
                        }
                        .agreement-checkbox.checked i {
                            display: block;
                        }
                        .btn-agreement-submit {
                            width: 100%;
                            padding: 14px;
                            border-radius: 14px;
                            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                            border: none;
                            color: white;
                            font-weight: 600;
                            letter-spacing: 0.5px;
                            transition: all 0.3s;
                            opacity: 0.5;
                            cursor: not-allowed;
                        }
                        .btn-agreement-submit.active {
                            opacity: 1;
                            cursor: pointer;
                            box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
                        }
                        .btn-agreement-submit.active:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 15px 25px -5px rgba(59, 130, 246, 0.5);
                        }
                    `}</style>
                    <div className="agreement-header">
                        <i className="fa-solid fa-file-contract"></i>
                        <h5>MKUNDALIK.UZ AXBOROT TIZIMIDAN FOYDALANISH SHARTLARI</h5>
                    </div>
                    <div className="agreement-body">
                        <div className="terms-content">
                            <div className="terms-section">
                                <h6>1. Umumiy qoidalar</h6>
                                <p>1.1. Ushbu Foydalanish shartlari (keyingi o‘rinlarda — Shartlar) mkundalik.uz axborot tizimidan (keyingi o‘rinlarda — Tizim) foydalanish tartibini belgilaydi.</p>
                                <p>1.2. Tizimdan foydalanish orqali foydalanuvchi ushbu Shartlarning barcha bandlariga so‘zsiz va to‘liq rozilik bildirgan hisoblanadi.</p>
                                <p>1.3. Agar foydalanuvchi ushbu Shartlarning istalgan bandiga rozi bo‘lmasa, Tizimdan foydalanishni darhol to‘xtatishi shart.</p>
                                <p>1.4. Tizim metropoliten va unga aloqador tashkilotlar xodimlarining elektron kundalik hisobotlarini yuritish, baholash, monitoring qilish va tahlil qilish uchun mo‘ljallangan.</p>
                            </div>

                            <div className="terms-section">
                                <h6>2. Ro‘yxatdan o‘tish va foydalanuvchi hisoblari</h6>
                                <p>2.1. Tizimda ochiq ro‘yxatdan o‘tish (Sign Up) funksiyasi mavjud emas.</p>
                                <p>2.2. Foydalanuvchi hisobini yaratish faqat Administrator tomonidan amalga oshiriladi.</p>
                                <p>2.3. Administrator tomonidan yaratilgan foydalanuvchi login ma’lumotlari foydalanuvchining shaxsiy javobgarligi ostida hisoblanadi.</p>
                                <p>2.4. Foydalanuvchi o‘z login va parolini uchinchi shaxslarga oshkor qilmasligi shart.</p>
                                <p>2.5. Tizimda yaratilgan barcha parollar bcrypt shifrlash algoritmi asosida himoyalanadi.</p>
                                <p>2.6. Parollarni: Administrator, tizim texnik xodimlari, uchinchi shaxslar bilishi texnik jihatdan imkonsiz.</p>
                                <p>2.7. Parol faqat parol egasiga ma’lum bo‘ladi.</p>
                            </div>

                            <div className="terms-section">
                                <h6>3. Administrator huquqlari</h6>
                                <p>3.1. Administrator Tizimni boshqarish, texnik xizmat ko‘rsatish, audit va xavfsizlikni ta’minlash maqsadida foydalanuvchi profillariga kirish huquqiga ega.</p>
                                <p>3.2. Administrator foydalanuvchi parolini ko‘ra olmaydi va tiklay olmaydi, faqatgina zarur holatlarda parolni yangilash (reset) imkoniyatiga ega.</p>
                                <p>3.3. Administrator Tizimdagi ma’lumotlar ustidan monitoring olib borish huquqiga ega.</p>
                            </div>

                            <div className="terms-section">
                                <h6>4. Elektron kundalik hisobotlar</h6>
                                <p>4.1. Foydalanuvchi yangi elektron kundalik hisobotni boshlagan aniq vaqt va sana Tizim tomonidan avtomatik qayd etiladi.</p>
                                <p>4.2. Hisobotni kiritish muddati: hisobot boshlangan kundan boshlab shu kunning 23:59 vaqtigacha amal qiladi.</p>
                                <p>4.3. Belgilangan vaqt tugagach: hisobot avtomatik yopiladi; keyingi kalendar kun uchun yangi hisobot ochiladi.</p>
                                <p>4.4. Hisobot yopilgandan so‘ng: tahrirlash (edit), o‘chirish, o‘zgartirish imkoniyati to‘liq bloklanadi.</p>
                                <p>4.5. Kiritilgan barcha elektron hisobotlar Tizim ma’lumotlar bazasida doimiy saqlanadi.</p>
                            </div>

                            <div className="terms-section">
                                <h6>5. Ma’lumotlarning saqlanishi va xavfsizligi</h6>
                                <p>5.1. Tizimda saqlanadigan barcha ma’lumotlar (shaxsiy ma’lumotlar, ish hisobotlari, baholar) Tizimning ichki ma’lumotlar bazasida saqlanadi.</p>
                                <p>5.2. Foydalanuvchi barcha amallarni faqat o‘z shaxsiy login va paroli orqali amalga oshirishi shart.</p>
                                <p>5.3. Bir login ostida bir nechta shaxs foydalanishi qat’iyan man etiladi.</p>
                            </div>

                            <div className="terms-section">
                                <h6>6. PDF hujjatlar va QR-kodlar</h6>
                                <p>6.1. Tizimda jamlangan barcha elektron hisobotlarni PDF formatida yuklab olish imkoniyati mavjud.</p>
                                <p>6.2. Har bir PDF hujjatga: maxsus, noyob, tekshiriladigan QR-kod biriktiriladi.</p>
                                <p>6.3. QR-kodni: Tizimda ro‘yxatdan o‘tmagan foydalanuvchilar ham skanerlash orqali hujjatning elektron nusxasini ko‘rishlari mumkin.</p>
                            </div>

                            <div className="terms-section">
                                <h6>7. Baholash tizimi</h6>
                                <p>7.1. Biriktirilgan xodimlarni baholash 1 dan 100 ballgacha bo‘lgan oraliqda amalga oshiriladi.</p>
                                <p>7.2. Har bir baholash jarayonida: bahoga nisbatan izoh qoldirish majburiy hisoblanadi.</p>
                                <p>7.3. Izohsiz baholash tizim tomonidan qabul qilinmaydi.</p>
                                <p>7.4. Xodim berilgan baholar ustidan e’tiroz (shikoyat) bildirish huquqiga ega.</p>
                                <p>7.5. Ushbu e’tirozlar avtomatik tarzda E’tirozlarni ko‘rib chiqish komissiyasiga yo‘naltiriladi.</p>
                            </div>

                            <div className="terms-section">
                                <h6>8. Shaxsiy ma’lumotlar va integratsiya</h6>
                                <p>8.1. Tizimda saqlanadigan shaxsiy ma’lumotlar kelajakda boshqa axborot tizimlari bilan integratsiya qilish maqsadida ko‘chirilishi mumkin.</p>
                                <p>8.2. Ushbu holat foydalanuvchi tomonidan oldindan qabul qilingan deb hisoblanadi.</p>
                                <p>8.3. Xodimlar ma’lumotlari himoyasi uchun zarur texnik va tashkiliy xavfsizlik choralar ko‘rilgan bo‘lib, tizim "Kiberxavfsizlik markazi" DUK tomonidan ekspertiziyadan o‘tkazilgan. Shunga qaramay, fors-major holatlar yoki nazoratdan tashqari yuzaga keladigan favqulodda vaziyatlar oqibatida ma’lumotlarning yo‘qolishi, buzilishi yoki sizib chiqishi holatlarida hech kim javobgar hisoblanmaydi.</p>
                            </div>

                            <div className="terms-section">
                                <h6>9. Ishda bo‘lmagan kunlar va sozlamalar</h6>
                                <p>9.1. Foydalanuvchi ishda bo‘lmagan kunlarini sababini ko‘rsatgan holda, Tizim kalendarida belgilashi va yopib qo‘yishi mumkin.</p>
                                <p>9.2. Foydalanuvchi istalgan vaqtda o‘z parolini mustaqil ravishda almashtirish huquqiga ega.</p>
                            </div>

                            <div className="terms-section">
                                <h6>10. Telegram botdan foydalanish</h6>
                                <p>10.1. Tizim Telegram bot bilan integratsiya qilingan bo‘lishi mumkin.</p>
                                <p>10.2. Telegram bot orqali bildirishnomalar qabul qilish va boshqa xizmatlardan foydalanish imkoniyati mavjud.</p>
                            </div>

                            <div className="terms-section">
                                <h6>11. Yangilanishlar va javobgarlik</h6>
                                <p>11.1. Ushbu Foydalanish shartlari va Tizim funksiyalariga oid barcha yangilanishlar “Foydalanish shartlari” bo‘limida e’lon qilinadi.</p>
                                <p>11.2. Tizim foydalanuvchilari ushbu bo‘limni muntazam kuzatib borish uchun shaxsan mas’ul hisoblanadi.</p>
                            </div>

                            <div className="terms-section">
                                <h6>12. Yakuniy qoidalar</h6>
                                <p>12.1. Tizimdan foydalanish foydalanuvchining ushbu Shartlarni to‘liq tushunganini va qabul qilganini anglatadi.</p>
                                <p>12.2. Ushbu Shartlar bilan tanishib chiqmasdan foydalanish javobgarlikdan ozod etmaydi.</p>
                            </div>
                        </div>
                    </div>
                    <div className="agreement-footer">
                        {!viewMode ? (
                            <>
                                <div 
                                    className="agreement-checkbox-wrapper" 
                                    onClick={() => setAccepted(!accepted)}
                                >
                                    <div className={`agreement-checkbox ${accepted ? 'checked' : ''}`}>
                                        <i className="fa-solid fa-check"></i>
                                    </div>
                                    <span className="small fw-medium">
                                        Men foydalanish shartlari bilan tanishdim va ularga roziman
                                    </span>
                                </div>
                                <button 
                                    className={`btn-agreement-submit ${accepted ? 'active' : ''}`}
                                    disabled={!accepted}
                                    onClick={onAccept}
                                >
                                    KIRISH
                                </button>
                            </>
                        ) : (
                            <button 
                                className="btn-agreement-submit active"
                                onClick={onCancel}
                            >
                                YOPISH
                            </button>
                        )}
                    </div>
                </Modal>
            )}
        </AnimatePresence>
    );
};

export default Agreement;
