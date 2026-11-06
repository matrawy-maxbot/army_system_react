/**
 * ToastContainer Component
 * حاوية لإدارة عدة Toast notifications
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';
import './ToastContainer.css';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback(({ message, type = 'success', duration = 4000, title }) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration, title };
        
        setToasts(prev => [...prev, newToast]);
        
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Helper methods
    const success = useCallback((message, title) => {
        return showToast({ message, type: 'success', title });
    }, [showToast]);

    const error = useCallback((message, title) => {
        return showToast({ message, type: 'error', title });
    }, [showToast]);

    const warning = useCallback((message, title) => {
        return showToast({ message, type: 'warning', title });
    }, [showToast]);

    const info = useCallback((message, title) => {
        return showToast({ message, type: 'info', title });
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        title={toast.title}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
