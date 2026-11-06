/**
 * DeleteBackupModal Component
 * نافذة تأكيد حذف نسخة احتياطية
 */

import React, { useState } from 'react';
import ModalPortal from '../common/ModalPortal';
import './backupModals.css';

function DeleteBackupModal({ backup, onClose, onConfirm }) {
    const [password, setPassword] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // التحقق من كلمة المرور
        if (!password) {
            setError('الرجاء إدخال كلمة مرور النسخة الاحتياطية');
            return;
        }

        if (password.length < 4) {
            setError('كلمة المرور يجب أن تكون 4 أحرف على الأقل');
            return;
        }

        // التحقق من التأكيد
        if (!confirmed) {
            setError('الرجاء التأكيد على رغبتك في حذف النسخة');
            return;
        }

        // تأكيد الحذف
        onConfirm(password);
    };

    return (
        <ModalPortal>
            <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content backup-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: '-0.2em', color: '#ef4444' }}>
                            <path d="M4 7h16"/>
                            <path d="M10 11v6"/>
                            <path d="M14 11v6"/>
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
                            <path d="M9 7V4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>
                        </svg>
                        حذف نسخة احتياطية
                    </h2>
                    <button className="btn-close" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {/* معلومات النسخة */}
                    <div className="restore-backup-info">
                        <div className="restore-backup-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 18a4 4 0 0 1-.5-8A6.5 6.5 0 0 1 18 8a5 5 0 0 1 0 10H6Z"/>
                            </svg>
                        </div>
                        <div className="restore-backup-details">
                            <h3>{backup.name}</h3>
                            <div className="restore-backup-meta">
                                <span>📅 {formatDate(backup.date)}</span>
                                <span>💾 {backup.size}</span>
                            </div>
                        </div>
                    </div>

                    {/* تحذير الحذف */}
                    <div className="backup-danger-box">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1.67a2.914 2.914 0 0 0 -2.492 1.403l-8.11 13.537a2.914 2.914 0 0 0 2.484 4.385h16.225a2.914 2.914 0 0 0 2.503 -4.371l-8.116 -13.546a2.917 2.917 0 0 0 -2.494 -1.408m.01 3.834a1 1 0 0 1 .993 .883l.007 .117v4l-.007 .117a1 1 0 0 1 -1.986 0l-.007 -.117v-4l.007 -.117a1 1 0 0 1 .993 -.883m-.01 8a1 1 0 0 1 .117 1.993l-.127 .007a1 1 0 0 1 -.117 -1.993l.127 -.007" />
                        </svg>
                        <div>
                            <strong>تحذير: هذا الإجراء لا يمكن التراجع عنه!</strong>
                            <p>حذف هذه النسخة الاحتياطية يعني:</p>
                            <ul>
                                <li>فقدان جميع البيانات المحفوظة في هذه النسخة نهائيًا</li>
                                <li>عدم القدرة على استرجاع هذه النسخة مستقبلاً</li>
                                <li>لن يمكن التراجع عن هذا القرار بعد الحذف</li>
                            </ul>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* كلمة المرور */}
                        <div className="form-group">
                            <label>كلمة مرور النسخة الاحتياطية</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="أدخل كلمة المرور للتأكيد"
                                className="backup-input"
                                autoFocus
                            />
                            <small>للتحقق من هويتك، أدخل كلمة مرور هذه النسخة</small>
                        </div>

                        {/* تأكيد الحذف */}
                        <div className="form-group">
                            <div className="backup-checkbox-option">
                                <input
                                    type="checkbox"
                                    id="confirmDelete"
                                    checked={confirmed}
                                    onChange={(e) => setConfirmed(e.target.checked)}
                                />
                                <label htmlFor="confirmDelete">
                                    <strong>نعم، أرغب في حذف هذه النسخة الاحتياطية نهائيًا</strong>
                                </label>
                            </div>
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
                            <span>⚠️ هذه واجهة تجريبية. لن يتم حذف ملفات فعلية حتى التكامل مع النظام.</span>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                إلغاء
                            </button>
                            <button type="submit" className="btn-danger">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 7h16"/>
                                    <path d="M10 11v6"/>
                                    <path d="M14 11v6"/>
                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
                                    <path d="M9 7V4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>
                                </svg>
                                تأكيد الحذف
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </ModalPortal>
    );
}

export default DeleteBackupModal;
