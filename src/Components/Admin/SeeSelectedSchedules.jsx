import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const getStartDayOfWeek = (month, year) => {
  const day = new Date(year, month, 1).getDay();
  return (day === 0 ? 6 : day - 1); // Yakshanba 0 bo'ladi, uni oxiriga o'tkazamiz
};

const monthsList = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

const weekDays = ['Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sh', 'Ya'];

const CalendarComponent = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

  const maxYear = currentDate.getFullYear();
  const maxMonth = currentDate.getMonth();
  const maxDay = currentDate.getDate();

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (month === maxMonth && year === maxYear) return;
    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };
let name = "Abdurakhimov B. G."
  const daysInMonth = getDaysInMonth(month + 1, year);
  const startDay = getStartDayOfWeek(month, year);

  const days = Array.from({ length: startDay + daysInMonth }, (_, i) => {
    if (i < startDay) return null;
    return i - startDay + 1;
  });

  const isFutureDay = (day) => {
    return (
      year > maxYear ||
      (year === maxYear && month > maxMonth) ||
      (year === maxYear && month === maxMonth && day > maxDay)
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-controls">
        <button onClick={handlePrev} className="calendar-btn">⬅️</button>

        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="calendar-select">
          {Array.from({ length: 10 }).map((_, i) => {
            const y = maxYear - i;
            return (
              <option key={y} value={y}>{y}</option>
            );
          })}
        </select>

        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="calendar-select">
          {monthsList.map((m, i) => (
            <option key={i} value={i} disabled={year === maxYear && i > maxMonth}>
              {m}
            </option>
          ))}
        </select>

        <button
          onClick={handleNext}
          className={`calendar-btn ${year === maxYear && month === maxMonth ? 'calendar-btn-disabled' : ''}`}
        >
          ➡️
        </button>
      </div>

      <div className="calendar-grid calendar-weekdays">
        {weekDays.map((day, index) => (
          <div key={index} className="calendar-weekday-label">{day}</div>
        ))}
      </div>

      <motion.div layout className="calendar-grid calendar-grid-7">
        {days.map((day, index) => (
          <motion.div
            key={index}
            whileHover={day && !isFutureDay(day) ? { scale: 1.1, rotate: 1 } : {}}
            className={`calendar-day ${!day ? 'calendar-day-empty' : ''} ${day && isFutureDay(day) ? 'calendar-day-disabled' : ''}`}
          >
            {day || ''}
            
            <div className="calendar-rated"><i class="fa-solid calendar-likedby fa-thumbs-up"></i> {name?.length > 6
                    ? name.slice(0, 6) + "..."
                    : name}<span>90</span></div>
            <div className="calendar-green"></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CalendarComponent;
