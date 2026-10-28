import React, { useState, useEffect } from 'react';
import '../../styles/header.css';

function Header({ onSettingsClick }) {
    const [dateTime, setDateTime] = useState('');

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            const dateStr = now.toLocaleDateString('ar-EG', options);
            const timeStr = now.toLocaleTimeString('ar-EG', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            setDateTime(`${dateStr} - ${timeStr}`);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-right">
                    <h1>برنامج ادارة نظام مكتب الفاكسات والتدريب</h1>
                </div>
                <div className="header-left">
                    <span className="date-time">{dateTime}</span>
                    <button 
                        className="btn-icon" 
                        id="openSettingsBtn"
                        onClick={onSettingsClick}
                        title="الإعدادات"
                    >
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
