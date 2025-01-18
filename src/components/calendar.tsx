import { useState } from 'react';
import './styles/calendar.scss';






const Calendar = () => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const days = ["M", "T", "W", "T", "F", "S", "S"];

    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    const currentYear = new Date().getFullYear();

    
    const [actualMonth, setActualMonth] = useState(new Date().getMonth());


    return (
        <div className="year">
            {months.map((month, monthIndex) => {
                if (month == months[actualMonth]) {
                    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
                    const firstDayOfMonth = new Date(currentYear, monthIndex, 1).getDay();
                    const adjustedFirstDay = (firstDayOfMonth + 6) % 7; 
                    const daysLeftThisYear = Math.ceil((new Date(currentYear, 11, 31).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                    return (
                        <div key={monthIndex} className="month">
                            <div className="month-header">
                                <div className={`month-name ${currentMonth === monthIndex ? 'current' : ''}`}>
                                    {month}
                                </div>
                                <div className="subtitle">
                                    {daysLeftThisYear} day{daysLeftThisYear > 1 ? 's' : ''} left in the year
                                </div>
                            </div>
                            <div className="days-list">
                                {days.map((day, dayIndex) => (
                                    <div key={`${monthIndex}-${dayIndex}`} className="day-name">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="days">
                                {Array.from({ length: adjustedFirstDay }).map((_, emptyIndex) => (
                                    <div key={`empty-${monthIndex}-${emptyIndex}`} className="day placeholder"></div>
                                ))}
                                {Array.from({ length: daysInMonth }, (_, dayIndex) => {
                                    const isPast = new Date(currentYear, monthIndex, dayIndex + 1) < new Date(currentYear, currentMonth, currentDay);
                                    return (
                                        <div
                                            key={`day-${monthIndex}-${dayIndex}`}
                                            id={`day-${monthIndex + 1}-${dayIndex + 1}`}
                                            className={`day ${currentDay === dayIndex + 1 && currentMonth === monthIndex ? 'current' : ''} ${isPast ? 'past' : ''}`}
                                        >
                                            {dayIndex + 1}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }
            })}
            <div className="arrows">
                <div className="arrow" onClick={() => {
                    setActualMonth((actualMonth - 1 + 12) % 12);
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z"/></svg>
                </div>
                <div className="arrow" onClick={() => {
                    setActualMonth((actualMonth + 1) % 12);
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"/></svg>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
