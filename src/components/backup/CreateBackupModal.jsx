/**
 * CreateBackupModal Component
 * نافذة إنشاء نسخة احتياطية جديدة
 */

import React, { useState } from 'react';
import ModalPortal from '../common/ModalPortal';
import './backupModals.css';

function CreateBackupModal({ onClose, onStart, maxBackups, currentBackupsCount }) {
    const [backupName, setBackupName] = useState(generateBackupName());
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    function generateBackupName() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        return `نسخة احتياطية - ${year}-${month}-${day} ${hours}:${minutes}`;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // التحقق من اسم النسخة
        if (!backupName.trim()) {
            setError('الرجاء إدخال اسم للنسخة الاحتياطية');
            return;
        }

        // التحقق من كلمة المرور
        if (!password) {
            setError('الرجاء إدخال كلمة مرور لحماية النسخة');
            return;
        }

        if (password.length < 4) {
            setError('كلمة المرور يجب أن تكون 4 أحرف على الأقل');
            return;
        }

        if (password !== confirmPassword) {
            setError('كلمة المرور وتأكيدها غير متطابقين');
            return;
        }

        // بدء عملية النسخ
        onStart(backupName, password);
    };

    return (
        <ModalPortal>
            <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content backup-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-0.2em' }}>
                            <path d="M6 18a4 4 0 0 1-.5-8A6.5 6.5 0 0 1 18 8a5 5 0 0 1 0 10H6Z"/>
                        </svg>
                        إنشاء نسخة احتياطية
                    </h2>
                    <button className="btn-close" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="backup-info-box">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0 -20m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0 -16m.01 11l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993m-.01 -8a1 1 0 0 1 .993 .883l.007 .117v4l-.007 .117a1 1 0 0 1 -1.986 0l-.007 -.117v-4l.007 -.117a1 1 0 0 1 .993 -.883" />
                        </svg>
                        <div>
                            <strong>معلومات مهمة:</strong>
                            <p>سيتم إنشاء نسخة احتياطية كاملة للبيانات والملفات. ستكون النسخة محمية بكلمة المرور التي ستدخلها.</p>
                            <p className="backup-limit-info">
                                النسخ المتوفرة: {currentBackupsCount} من {maxBackups}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>اسم النسخة الاحتياطية</label>
                            <input
                                type="text"
                                value={backupName}
                                onChange={(e) => setBackupName(e.target.value)}
                                placeholder="أدخل اسمًا للنسخة"
                                className="backup-input"
                                autoFocus
                            />
                            <small>يمكنك تغيير الاسم الافتراضي أو الإبقاء عليه</small>
                        </div>

                        <div className="form-group">
                            <label>كلمة مرور النسخة</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="أدخل كلمة مرور قوية"
                                className="backup-input"
                            />
                            <small>ستحتاج إلى هذه الكلمة لاسترجاع النسخة لاحقًا</small>
                        </div>

                        <div className="form-group">
                            <label>تأكيد كلمة المرور</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="أعد إدخال كلمة المرور"
                                className="backup-input"
                            />
                        </div>

                        {error && (
                            <div className="backup-error-message">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0 -20m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0 -16m.01 11l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993m-.01 -8a1 1 0 0 1 .993 .883l.007 .117v4l-.007 .117a1 1 0 0 1 -1.986 0l-.007 -.117v-4l.007 -.117a1 1 0 0 1 .993 -.883" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="backup-warning-box">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 1.67a10 10 0 1 0 0 20a10 10 0 0 0 0 -20m0 2a8 8 0 1 1 0 16a8 8 0 0 1 0 -16m-1 5.5a1 1 0 0 1 1 1v4a1 1 0 0 1 -2 0v-4a1 1 0 0 1 1 -1m0 8a1 1 0 1 1 0 2a1 1 0 0 1 0 -2" />
                            </svg>
                            <span>⚠️ هذه واجهة تجريبية. لن يتم إنشاء نسخة فعلية حتى التكامل مع النظام.</span>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                إلغاء
                            </button>
                            <button type="submit" className="btn-primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 18a4 4 0 0 1-.5-8A6.5 6.5 0 0 1 18 8a5 5 0 0 1 0 10H6Z"/>
                                </svg>
                                بدء النسخ الاحتياطي
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </ModalPortal>
    );
}

export default CreateBackupModal;
