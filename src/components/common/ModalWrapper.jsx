/**
 * Modal Wrapper Component
 * مكون wrapper للمودالات مع إدارة z-index تلقائيًا
 * 
 * الاستخدام:
 * <ModalWrapper 
 *   modalId="unique-modal-id"
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   className="modal-overlay"
 * >
 *   {children}
 * </ModalWrapper>
 */

import React, { useRef, useEffect } from 'react';
import { useModalZIndex } from '../../context/ModalStackContext';

function ModalWrapper({ 
    modalId, 
    isOpen, 
    onClose, 
    children, 
    className = 'modal-overlay',
    onClick,
    ...props 
}) {
    const zIndex = useModalZIndex(modalId, isOpen);
    const wrapperRef = useRef(null);

    // تطبيق z-index مع !important
    useEffect(() => {
        if (wrapperRef.current && isOpen) {
            wrapperRef.current.style.cssText = `z-index: ${zIndex} !important`;
        }
    }, [zIndex, isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        // إغلاق المودال عند النقر على الخلفية فقط
        if (e.target === e.currentTarget) {
            onClose?.();
        }
        onClick?.(e);
    };

    return (
        <div 
            ref={wrapperRef}
            className={className}
            onClick={handleBackdropClick}
            {...props}
        >
            {children}
        </div>
    );
}

export default ModalWrapper;
