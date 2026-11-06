/**
 * BackupPage Component
 * صفحة إدارة النسخ الاحتياطية
 */

import React, { useState } from 'react';
import CreateBackupModal from '../components/backup/CreateBackupModal';
import RestoreBackupModal from '../components/backup/RestoreBackupModal';
import DeleteBackupModal from '../components/backup/DeleteBackupModal';
import './BackupPage.css';

function BackupPage() {
    const [backups, setBackups] = useState([
        { id: 1, name: 'نسخة احتياطية - 01-11-2026', date: '1 نوفمبر 2026', size: '25.4 MB' },
        { id: 2, name: 'نسخة احتياطية - 25-10-2026', date: '25 أكتوبر 2026', size: '23.8 MB' },
        { id: 3, name: 'نسخة احتياطية - 15-10-2026', date: '15 أكتوبر 2026', size: '22.1 MB' }
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState(null);

    const filteredBackups = backups.filter(backup => {
        const query = searchQuery.toLowerCase();
        return (backup.name + ' ' + backup.date).toLowerCase().includes(query);
    });

    const handleCreateBackup = () => {
        if (backups.length >= 10) return;
        setShowCreateModal(true);
    };

    const handleStartCreateBackup = (backupName) => {
        setShowCreateModal(false);
        const now = new Date();
        const newBackup = {
            id: Date.now(),
            name: backupName || `نسخة احتياطية - ${now.toLocaleDateString('en-GB')}`,
            date: now.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }),
            size: '24.0 MB'
        };
        setBackups([newBackup, ...backups]);
    };

    const handleRestoreBackup = (backup) => {
        // تحديث الـ state معاً في نفس الدفعة
        setSelectedBackup(backup);
        // استخدام setTimeout لضمان تحديث الـ DOM
        setTimeout(() => {
            setShowRestoreModal(true);
        }, 0);
    };

    const handleStartRestore = () => {
        setShowRestoreModal(false);
        setTimeout(() => {
            setSelectedBackup(null);
        }, 300);
    };

    const handleDeleteBackup = (backup) => {
        // تحديث الـ state معاً في نفس الدفعة
        setSelectedBackup(backup);
        // استخدام setTimeout لضمان تحديث الـ DOM
        setTimeout(() => {
            setShowDeleteModal(true);
        }, 0);
    };

    const handleConfirmDelete = () => {
        if (selectedBackup) {
            setBackups(backups.filter(b => b.id !== selectedBackup.id));
        }
        setShowDeleteModal(false);
        setTimeout(() => {
            setSelectedBackup(null);
        }, 300);
    };

    return (
        <div className="backup-page-wrapper">
            <main className="page">
                <header className="backup-header">
                    <div className="backup-header-content">
                        <h1 className="backup-title">النسخ الاحتياطية</h1>
                        <p className="backup-subtitle">إدارة النسخ الاحتياطية للبيانات والملفات</p>
                    </div>
                    <button 
                        className="btn-create-backup"
                        onClick={handleCreateBackup}
                        disabled={backups.length >= 10}
                        style={{ opacity: backups.length >= 10 ? 0.5 : 1 }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        إنشاء نسخة احتياطية
                    </button>
                </header>

                <section className="list-panel">
                    <div className="list-head">
                        <div className="list-heading">
                            النسخ <span className="count">({backups.length})</span>
                        </div>
                        <input 
                            className="search" 
                            type="search" 
                            placeholder="بحث..." 
                            aria-label="بحث"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div id="backupList">
                        {filteredBackups.length > 0 ? (
                            filteredBackups.map(backup => (
                                <article key={backup.id} className="row">
                                    <div className="file-info">
                                        <div className="file-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M6 18a4 4 0 0 1-.5-8A6.5 6.5 0 0 1 18 8a5 5 0 0 1 0 10H6Z"/>
                                            </svg>
                                        </div>
                                        <div className="file-copy">
                                            <div className="name">{backup.name}</div>
                                            <div className="meta">
                                                <span>{backup.date}</span>
                                                <span>{backup.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="actions">
                                        <button 
                                            className="action restore"
                                            onClick={() => handleRestoreBackup(backup)}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 10a8 8 0 1 1 2 7"/>
                                                <path d="M4 4v6h6"/>
                                            </svg>
                                            استعادة
                                        </button>
                                        <button 
                                            className="action delete"
                                            onClick={() => handleDeleteBackup(backup)}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18M8 6V4h8v2m3 0-.9 14H5.9L5 6m4 4v6m6-6v6"/>
                                            </svg>
                                            حذف
                                        </button>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="empty">لا توجد نتائج</div>
                        )}
                    </div>
                    
                    <div className="list-footer" id="capacity">
                        {backups.length} من 10 نسخ
                    </div>
                </section>
            </main>

            {/* Modals */}
            {showCreateModal && (
                <CreateBackupModal
                    onClose={() => setShowCreateModal(false)}
                    onStart={handleStartCreateBackup}
                    maxBackups={10}
                    currentBackupsCount={backups.length}
                />
            )}

            {showRestoreModal && selectedBackup && (
                <RestoreBackupModal
                    backup={selectedBackup}
                    onClose={() => {
                        setShowRestoreModal(false);
                        setTimeout(() => {
                            setSelectedBackup(null);
                        }, 300);
                    }}
                    onStart={handleStartRestore}
                />
            )}

            {showDeleteModal && selectedBackup && (
                <DeleteBackupModal
                    backup={selectedBackup}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setTimeout(() => {
                            setSelectedBackup(null);
                        }, 300);
                    }}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}

export default BackupPage;
