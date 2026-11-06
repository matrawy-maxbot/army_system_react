/**
 * RestoreBackupModal Component
 * نافذة استرجاع نسخة احتياطية
 */

import React, { useState } from 'react';
import ModalPortal from '../common/ModalPortal';
import './backupModals.css';

function RestoreBackupModal({ backup, onClose, onStart }) {
    const [password, setPassword] = useState('');
    const [createCurrentBackup, setCreateCurrentBackup] = useState(true);
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
            setError('الرجاء التأكيد على فهم عواقب عملية الاسترجاع');
            return;
        }

        // بدء عملية الاسترجاع
        onStart(password);
    };

    return (
        <ModalPortal>
            <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content backup-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: '-0.2em' }}>
                            <path d="M9 14l-4 -4l4 -4"/>
                            <path d="M5 10h11a4 4 0 1 1 0 8h-1"/>
                        </svg>
                        استرجاع نسخة احتياطية
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
                        <div className="restore-backup-icon">
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

                    {/* تحذير مهم */}
                    <div className="backup-danger-box">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1.67a2.914 2.914 0 0 0 -2.492 1.403l-8.11 13.537a2.914 2.914 0 0 0 2.484 4.385h16.225a2.914 2.914 0 0 0 2.503 -4.371l-8.116 -13.546a2.917 2.917 0 0 0 -2.494 -1.408m.01 3.834a1 1 0 0 1 .993 .883l.007 .117v4l-.007 .117a1 1 0 0 1 -1.986 0l-.007 -.117v-4l.007 -.117a1 1 0 0 1 .993 -.883m-.01 8a1 1 0 0 1 .117 1.993l-.127 .007a1 1 0 0 1 -.117 -1.993l.127 -.007" />
                        </svg>
                        <div>
                            <strong>تحذير مهم!</strong>
                            <p>استرجاع هذه النسخة سيؤدي إلى:</p>
                            <ul>
                                <li>استبدال جميع البيانات الحالية ببيانات النسخة المحددة</li>
                                <li>فقدان أي تغييرات تمت بعد إنشاء هذه النسخة</li>
                                <li>لا يمكن التراجع عن هذه العملية بعد اكتمالها</li>
                            </ul>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* نسخ احتياطي تلقائي */}
                        <div className="form-group">
                            <div className="backup-checkbox-option">
                                <input
                                    type="checkbox"
                                    id="autoBackup"
                                    checked={createCurrentBackup}
                                    onChange={(e) => setCreateCurrentBackup(e.target.checked)}
                                />
                                <label htmlFor="autoBackup">
                                    <strong>إنشاء نسخة احتياطية للبيانات الحالية أولاً</strong>
                                    <span>يُنصح بشدة بإنشاء نسخة احتياطية قبل الاسترجاع للحفاظ على البيانات الحالية</span>
                                </label>
                            </div>
                        </div>

                        {/* كلمة المرور */}
                        <div className="form-group">
                            <label>كلمة مرور النسخة الاحتياطية</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="أدخل كلمة المرور"
                                className="backup-input"
                                autoFocus
                            />
                            <small>الكلمة التي تم إدخالها عند إنشاء هذه النسخة</small>
                        </div>

                        {/* تأكيد الفهم */}
                        <div className="form-group">
                            <div className="backup-checkbox-option">
                                <input
                                    type="checkbox"
                                    id="confirmRestore"
                                    checked={confirmed}
                                    onChange={(e) => setConfirmed(e.target.checked)}
                                />
                                <label htmlFor="confirmRestore">
                                    <strong>أفهم عواقب هذه العملية وأرغب في المتابعة</strong>
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
                            <span>⚠️ هذه واجهة تجريبية. لن يتم استرجاع أي بيانات فعلية حتى التكامل مع النظام.</span>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                إلغاء
                            </button>
                            <button type="submit" className="btn-danger">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 14l-4 -4l4 -4"/>
                                    <path d="M5 10h11a4 4 0 1 1 0 8h-1"/>
                                </svg>
                                استرجاع النسخة
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </ModalPortal>
    );
}

export default RestoreBackupModal;
