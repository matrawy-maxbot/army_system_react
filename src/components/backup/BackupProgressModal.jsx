/**
 * BackupProgressModal Component
 * نافذة عرض تقدم عملية النسخ الاحتياطي أو الاسترجاع
 */

import React, { useState, useEffect } from 'react';
import './backupModals.css';

function BackupProgressModal({ data, onComplete, onCancel }) {
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState('');
    const [stageDetails, setStageDetails] = useState('');
    const [status, setStatus] = useState('running'); // running, success, error
    const [canCancel, setCanCancel] = useState(true);

    useEffect(() => {
        simulateProgress();
    }, []);

    const simulateProgress = async () => {
        const stages = data.type === 'create' ? [
            { name: 'جاري التحضير', detail: 'تهيئة البيئة لعملية النسخ', duration: 1000 },
            { name: 'جمع البيانات', detail: 'قراءة جميع البيانات من قاعدة البيانات', duration: 1500 },
            { name: 'نسخ الملفات', detail: 'نسخ الملفات والمجلدات', duration: 2000 },
            { name: 'تشفير البيانات', detail: 'حماية النسخة بكلمة المرور', duration: 1000 },
            { name: 'التحقق', detail: 'التحقق من سلامة النسخة المنشأة', duration: 1000 },
            { name: 'الإنهاء', detail: 'حفظ معلومات النسخة الاحتياطية', duration: 500 }
        ] : [
            { name: 'جاري التحضير', detail: 'تهيئة البيئة لعملية الاسترجاع', duration: 1000 },
            { name: 'التحقق من النسخة', detail: 'التحقق من سلامة النسخة الاحتياطية', duration: 1000 },
            { name: 'نسخ احتياطي للبيانات الحالية', detail: 'إنشاء نسخة احتياطية تلقائية', duration: 1500 },
            { name: 'فك التشفير', detail: 'فك تشفير النسخة المحددة', duration: 1000 },
            { name: 'استرجاع البيانات', detail: 'استبدال البيانات الحالية', duration: 2000 },
            { name: 'استرجاع الملفات', detail: 'استرجاع الملفات والمجلدات', duration: 2000 },
            { name: 'التنظيف', detail: 'تنظيف الملفات المؤقتة', duration: 800 },
            { name: 'الإنهاء', detail: 'اكتمال عملية الاسترجاع', duration: 500 }
        ];

        const totalStages = stages.length;
        
        for (let i = 0; i < stages.length; i++) {
            const currentStage = stages[i];
            setStage(currentStage.name);
            setStageDetails(currentStage.detail);
            
            // منع الإلغاء في المراحل الحساسة
            if (i >= totalStages - 2) {
                setCanCancel(false);
            }
            
            // تحديث التقدم تدريجيًا في كل مرحلة
            const stageProgressStart = (i / totalStages) * 100;
            const stageProgressEnd = ((i + 1) / totalStages) * 100;
            const steps = 20;
            const stepDuration = currentStage.duration / steps;
            
            for (let j = 0; j <= steps; j++) {
                const stageProgress = stageProgressStart + ((stageProgressEnd - stageProgressStart) * (j / steps));
                setProgress(Math.round(stageProgress));
                await sleep(stepDuration);
            }
        }

        // اكتمال العملية
        setStatus('success');
        setProgress(100);
        
        // انتظار قليلاً قبل الإنهاء
        await sleep(1000);
        
        // إنشاء كائن النسخة الجديدة في حالة الإنشاء
        if (data.type === 'create') {
            const newBackup = {
                id: Date.now(),
                name: data.backupName,
                date: new Date().toISOString(),
                size: `${(Math.random() * 10 + 20).toFixed(1)} MB`,
                status: 'مكتملة',
                isProtected: true
            };
            onComplete(newBackup);
        } else {
            onComplete();
        }
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleCancel = () => {
        if (canCancel && window.confirm('هل تريد حقًا إلغاء العملية؟\n\nقد يؤدي الإلغاء إلى نسخة غير مكتملة.')) {
            setStatus('error');
            setStage('تم الإلغاء');
            setStageDetails('تم إلغاء العملية من قبل المستخدم');
            onCancel();
        }
    };

    return (
        <div className="modal active">
            <div className="modal-content backup-modal progress-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-0.2em' }}>
                            <path d="M6 18a4 4 0 0 1-.5-8A6.5 6.5 0 0 1 18 8a5 5 0 0 1 0 10H6Z"/>
                        </svg>
                        {data.title}
                    </h2>
                </div>

                <div className="modal-body">
                    {/* Progress Circle */}
                    <div className="progress-circle-container">
                        <svg className="progress-circle" viewBox="0 0 200 200">
                            {/* Background Circle */}
                            <circle
                                cx="100"
                                cy="100"
                                r="85"
                                fill="none"
                                stroke="#e8eaed"
                                strokeWidth="12"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="100"
                                cy="100"
                                r="85"
                                fill="none"
                                stroke={status === 'error' ? '#ef4444' : status === 'success' ? '#10b981' : '#3b82f6'}
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 85}`}
                                strokeDashoffset={`${2 * Math.PI * 85 * (1 - progress / 100)}`}
                                transform="rotate(-90 100 100)"
                                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                            />
                        </svg>
                        <div className="progress-percentage">
                            {status === 'success' ? (
                                <svg className="success-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0 -20m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0 -16m-1 5.5a1 1 0 0 1 1 1v4a1 1 0 0 1 -2 0v-4a1 1 0 0 1 1 -1m0 8a1 1 0 1 1 0 2a1 1 0 0 1 0 -2" />
                                </svg>
                            ) : status === 'error' ? (
                                <svg className="error-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0 -20m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0 -16m.01 11l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993m-.01 -8a1 1 0 0 1 .993 .883l.007 .117v4l-.007 .117a1 1 0 0 1 -1.986 0l-.007 -.117v-4l.007 -.117a1 1 0 0 1 .993 -.883" />
                                </svg>
                            ) : (
                                <span className="percentage-text">{progress}%</span>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar (alternative) */}
                    <div className="progress-bar-container">
                        <div 
                            className="progress-bar-fill"
                            style={{ 
                                width: `${progress}%`,
                                backgroundColor: status === 'error' ? '#ef4444' : status === 'success' ? '#10b981' : '#3b82f6'
                            }}
                        ></div>
                    </div>

                    {/* Stage Information */}
                    <div className="progress-stage-info">
                        <div className="stage-header">
                            <div className="stage-icon">
                                {status === 'running' ? (
                                    <div className="spinner"></div>
                                ) : status === 'success' ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12l5 5l10 -10"/>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18 6l-12 12M6 6l12 12"/>
                                    </svg>
                                )}
                            </div>
                            <div className="stage-text">
                                <h3 className="stage-name">{stage}</h3>
                                <p className="stage-details">{stageDetails}</p>
                            </div>
                        </div>

                        {status === 'running' && (
                            <div className="stage-progress-text">
                                <span className="progress-label">التقدم:</span>
                                <span className="progress-value">{progress}% مكتمل</span>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="success-message">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0 -20m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0 -16m-1 5.5a1 1 0 0 1 1 1v4a1 1 0 0 1 -2 0v-4a1 1 0 0 1 1 -1m0 8a1 1 0 1 1 0 2a1 1 0 0 1 0 -2" />
                                </svg>
                                <strong>تمت العملية بنجاح!</strong>
                            </div>
                        )}
                    </div>

                    {/* Warning */}
                    {status === 'running' && !canCancel && (
                        <div className="progress-warning">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 1.67a10 10 0 1 0 0 20a10 10 0 0 0 0 -20m0 2a8 8 0 1 1 0 16a8 8 0 0 1 0 -16m-1 5.5a1 1 0 0 1 1 1v4a1 1 0 0 1 -2 0v-4a1 1 0 0 1 1 -1m0 8a1 1 0 1 1 0 2a1 1 0 0 1 0 -2" />
                            </svg>
                            <span>الرجاء عدم إغلاق النافذة. العملية في مرحلة حساسة.</span>
                        </div>
                    )}

                    {status === 'running' && (
                        <div className="backup-warning-box">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 1.67a10 10 0 1 0 0 20a10 10 0 0 0 0 -20m0 2a8 8 0 1 1 0 16a8 8 0 0 1 0 -16m-1 5.5a1 1 0 0 1 1 1v4a1 1 0 0 1 -2 0v-4a1 1 0 0 1 1 -1m0 8a1 1 0 1 1 0 2a1 1 0 0 1 0 -2" />
                            </svg>
                            <span>⚠️ هذه محاكاة لعملية {data.type === 'create' ? 'النسخ الاحتياطي' : 'الاسترجاع'}. لن يتم تنفيذ عمليات فعلية.</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="modal-actions">
                        {status === 'running' && canCancel && (
                            <button 
                                type="button" 
                                className="btn-cancel"
                                onClick={handleCancel}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6l-12 12M6 6l12 12"/>
                                </svg>
                                إلغاء
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BackupProgressModal;
