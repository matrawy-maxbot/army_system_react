import React, { useState, useEffect, useRef } from 'react';
import { windowAPI } from '../../services/electronAPI';
import '../../styles/titlebar.css';

function TitleBar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // إغلاق القائمة عند النقر خارجها
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMinimize = () => {
        windowAPI.minimizeWindow();
    };

    const handleMaximize = () => {
        windowAPI.maximizeWindow();
    };

    const handleClose = () => {
        windowAPI.closeWindow();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleShortcut = (action) => {
        setIsDropdownOpen(false);
        
        switch (action) {
            case 'reload':
                window.location.reload();
                break;
            case 'force-reload':
                window.location.reload(true);
                break;
            case 'devtools':
                // Note: toggleDevTools is not wrapped yet - keeping original implementation
                window.electronAPI && window.electronAPI.toggleDevTools?.();
                break;
            case 'zoom-reset':
                // Note: resetZoom is not wrapped yet - keeping original implementation
                window.electronAPI && window.electronAPI.resetZoom?.();
                break;
            case 'zoom-in':
                // Note: zoomIn is not wrapped yet - keeping original implementation
                window.electronAPI && window.electronAPI.zoomIn?.();
                break;
            case 'zoom-out':
                // Note: zoomOut is not wrapped yet - keeping original implementation
                window.electronAPI && window.electronAPI.zoomOut?.();
                break;
            case 'fullscreen':
                // Note: toggleFullscreen is not wrapped yet - keeping original implementation
                window.electronAPI && window.electronAPI.toggleFullscreen?.();
                break;
            default:
                break;
        }
    };

    return (
        <div className="custom-titlebar">
            <div className="titlebar-drag-region">
                <div className="titlebar-title">
                    <span>إدارة الفاكسات</span>
                    <button 
                        className="titlebar-shortcuts-btn" 
                        onClick={toggleDropdown}
                        title="الاختصارات"
                    >
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                            <path d="M0 0L5 6L10 0H0Z"/>
                        </svg>
                    </button>
                </div>

                {/* قائمة الاختصارات المنسدلة */}
                <div 
                    ref={dropdownRef}
                    className={`shortcuts-dropdown ${isDropdownOpen ? 'active' : ''}`}
                >
                    <div className="shortcuts-header">اختصارات لوحة المفاتيح</div>
                    <div className="shortcuts-list">
                        <div className="shortcut-item" onClick={() => handleShortcut('reload')}>
                            <span className="shortcut-label">Reload</span>
                            <span className="shortcut-keys">Ctrl+R</span>
                        </div>
                        <div className="shortcut-item" onClick={() => handleShortcut('force-reload')}>
                            <span className="shortcut-label">Force Reload</span>
                            <span className="shortcut-keys">Ctrl+Shift+R</span>
                        </div>
                        <div className="shortcut-item" onClick={() => handleShortcut('devtools')}>
                            <span className="shortcut-label">Toggle Developer Tools</span>
                            <span className="shortcut-keys">Ctrl+Shift+I</span>
                        </div>
                        <div className="shortcut-item" onClick={() => handleShortcut('zoom-reset')}>
                            <span className="shortcut-label">Actual Size</span>
                            <span className="shortcut-keys">Ctrl+0</span>
                        </div>
                        <div className="shortcut-item" onClick={() => handleShortcut('zoom-in')}>
                            <span className="shortcut-label">Zoom In</span>
                            <span className="shortcut-keys">++Ctrl</span>
                        </div>
                        <div className="shortcut-item" onClick={() => handleShortcut('zoom-out')}>
                            <span className="shortcut-label">Zoom Out</span>
                            <span className="shortcut-keys">-+Ctrl</span>
                        </div>
                        <div className="shortcut-item" onClick={() => handleShortcut('fullscreen')}>
                            <span className="shortcut-label">Toggle Full Screen</span>
                            <span className="shortcut-keys">F11</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="titlebar-controls">
                <button 
                    className="titlebar-btn" 
                    onClick={handleMinimize}
                    title="تصغير"
                    aria-label="تصغير"
                >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                        <rect x="0" y="5" width="12" height="2" fill="currentColor"/>
                    </svg>
                </button>
                <button 
                    className="titlebar-btn" 
                    onClick={handleMaximize}
                    title="تكبير/استعادة"
                    aria-label="تكبير"
                >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                        <rect x="1" y="1" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                </button>
                <button 
                    className="titlebar-btn close-btn" 
                    onClick={handleClose}
                    title="إغلاق"
                    aria-label="إغلاق"
                >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                        <path d="M1,1 L11,11 M11,1 L1,11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default TitleBar;
