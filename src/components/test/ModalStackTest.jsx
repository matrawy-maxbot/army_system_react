/**
 * Modal Stack Test Component
 * مكون اختبار لنظام z-index المودالات المتداخلة
 */

import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

function ModalStackTest() {
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);

    return (
        <div style={{ padding: '40px' }}>
            <h1>اختبار نظام المودالات المتداخلة</h1>
            <p>افتح المودالات بالترتيب لترى كيف يعمل نظام z-index التلقائي</p>
            
            <Button onClick={() => setShowModal1(true)}>
                فتح المودال الأول
            </Button>

            {/* المودال الأول */}
            <Modal
                isOpen={showModal1}
                onClose={() => setShowModal1(false)}
                title="المودال الأول"
                modalId="test-modal-1"
                size="medium"
            >
                <div style={{ padding: '20px' }}>
                    <p>هذا هو المودال الأول (z-index: 1040)</p>
                    <Button onClick={() => setShowModal2(true)}>
                        فتح المودال الثاني
                    </Button>
                </div>
            </Modal>

            {/* المودال الثاني */}
            <Modal
                isOpen={showModal2}
                onClose={() => setShowModal2(false)}
                title="المودال الثاني"
                modalId="test-modal-2"
                size="medium"
            >
                <div style={{ padding: '20px' }}>
                    <p>هذا هو المودال الثاني (z-index: 1050)</p>
                    <p>لاحظ أنه يظهر فوق المودال الأول</p>
                    <Button onClick={() => setShowModal3(true)}>
                        فتح المودال الثالث
                    </Button>
                </div>
            </Modal>

            {/* المودال الثالث */}
            <Modal
                isOpen={showModal3}
                onClose={() => setShowModal3(false)}
                title="المودال الثالث"
                modalId="test-modal-3"
                size="small"
            >
                <div style={{ padding: '20px' }}>
                    <p>هذا هو المودال الثالث (z-index: 1060)</p>
                    <p>يظهر فوق جميع المودالات الأخرى!</p>
                    <Button variant="secondary" onClick={() => {
                        setShowModal3(false);
                        setShowModal2(false);
                        setShowModal1(false);
                    }}>
                        إغلاق الكل
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default ModalStackTest;
