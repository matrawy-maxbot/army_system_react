/**
 * Modal Stack Context
 * نظام لإدارة z-index للمودالات المتداخلة
 * 
 * يوفر:
 * - تتبع المودالات المفتوحة
 * - حساب z-index تلقائيًا لكل مودال
 * - ضمان ظهور المودال الأخير فوق البقية
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalStackContext = createContext();

// z-index أساسي للمودال الأول
const BASE_MODAL_ZINDEX = 1040;
const ZINDEX_INCREMENT = 10;

export function ModalStackProvider({ children }) {
    const [modalStack, setModalStack] = useState([]);

    /**
     * تسجيل مودال جديد في الستاك
     * @param {string} modalId - معرف فريد للمودال
     * @returns {number} - z-index المخصص للمودال
     */
    const registerModal = useCallback((modalId) => {
        let newIndex = 0;
        setModalStack(prev => {
            // تحقق إذا كان المودال مسجل بالفعل
            if (prev.includes(modalId)) {
                newIndex = prev.indexOf(modalId);
                return prev;
            }
            newIndex = prev.length;
            const newStack = [...prev, modalId];
            return newStack;
        });

        // احسب z-index بناءً على الموقع الجديد
        const zIndex = BASE_MODAL_ZINDEX + (newIndex * ZINDEX_INCREMENT);
        return zIndex;
    }, []);

    /**
     * إلغاء تسجيل مودال من الستاك
     * @param {string} modalId - معرف المودال المراد إلغاء تسجيله
     */
    const unregisterModal = useCallback((modalId) => {
        setModalStack(prev => {
            const filtered = prev.filter(id => id !== modalId);
            return filtered;
        });
    }, []);

    /**
     * الحصول على z-index لمودال معين
     * @param {string} modalId - معرف المودال
     * @returns {number} - z-index المحسوب
     */
    const getModalZIndex = useCallback((modalId) => {
        const index = modalStack.indexOf(modalId);
        if (index === -1) {
            return BASE_MODAL_ZINDEX;
        }
        return BASE_MODAL_ZINDEX + (index * ZINDEX_INCREMENT);
    }, [modalStack]);

    /**
     * الحصول على عدد المودالات المفتوحة حاليًا
     */
    const getModalCount = useCallback(() => {
        return modalStack.length;
    }, [modalStack.length]);

    const value = {
        registerModal,
        unregisterModal,
        getModalZIndex,
        getModalCount,
        modalStack
    };

    return (
        <ModalStackContext.Provider value={value}>
            {children}
        </ModalStackContext.Provider>
    );
}

/**
 * Hook لاستخدام نظام إدارة المودالات
 */
export function useModalStack() {
    const context = useContext(ModalStackContext);
    if (!context) {
        throw new Error('useModalStack must be used within a ModalStackProvider');
    }
    return context;
}

/**
 * Hook مخصص لمودال فردي
 * يسجل المودال عند الفتح ويلغي التسجيل عند الإغلاق
 * 
 * @param {string} modalId - معرف فريد للمودال
 * @param {boolean} isOpen - حالة المودال (مفتوح/مغلق)
 * @returns {number} - z-index المحسوب للمودال
 */
export function useModalZIndex(modalId, isOpen) {
    const { registerModal, unregisterModal, getModalZIndex } = useModalStack();
    const [zIndex, setZIndex] = React.useState(BASE_MODAL_ZINDEX);

    React.useEffect(() => {
        if (isOpen) {
            registerModal(modalId);
        } else {
            unregisterModal(modalId);
        }
    }, [isOpen, modalId, registerModal, unregisterModal]);

    React.useEffect(() => {
        if (isOpen) {
            const currentZIndex = getModalZIndex(modalId);
            setZIndex(currentZIndex);
        }
    }, [isOpen, modalId, getModalZIndex]);

    return zIndex;
}
