/**
 * ModalPortal Component
 * Portal لرندر المودالات خارج DOM hierarchy لضمان ظهورها فوق كل العناصر
 */

import { createPortal } from 'react-dom';

// إنشاء modal-root مرة واحدة عند تحميل المودول
let modalRoot = document.getElementById('modal-root');

if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
}

function ModalPortal({ children }) {
    return createPortal(children, modalRoot);
}

export default ModalPortal;
