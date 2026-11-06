/**
 * MainRemindersSection Component
 * قسم التذكيرات في الصفحة الرئيسية
 * 
 * Features:
 * - عرض التذكيرات المرتبطة بالفاكسات المفلترة فقط
 * - إمكانية إضافة تذكير مع ربط فاكس
 * - زر الجرس في الكارت لإيقاف/تفعيل التنبيهات
 * - عرض التذكيرات النشطة والمتوقفة
 */

import React, { useState, useEffect } from 'react';
import { dataAPI } from '../../services/electronAPI';
import { useAppState } from '../../context/AppStateContext';
import AddReminderModal from '../reminders/AddReminderModal';
import ReminderDetailModal from '../reminders/ReminderDetailModal';
import EditReminderModal from '../reminders/EditReminderModal';

const MainRemindersSection = () => {
    const [reminders, setReminders] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewingReminder, setViewingReminder] = useState(null);
    const [editingReminder, setEditingReminder] = useState(null);
    const { appState } = useAppState();

    useEffect(() => {
        loadReminders();
    }, [appState.filteredFaxes]); // إعادة التحميل عند تغيير الفاكسات المفلترة

    const loadReminders = async () => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data && result.data.reminders) {
                // الحصول على IDs الفاكسات المفلترة الحالية
                const filteredFaxIds = appState.filteredFaxes 
                    ? appState.filteredFaxes.map(fax => fax.id)
                    : [];

                // فلترة التذكيرات لتظهر فقط التي لها علاقة بالفاكسات المعروضة
                const relatedReminders = result.data.reminders.filter(reminder => {
                    // إذا كان التذكير مربوط بفاكس
                    if (reminder.linkedFaxId) {
                        return filteredFaxIds.includes(reminder.linkedFaxId);
                    }
                    // إذا لم يكن مربوط بفاكس، لا نعرضه في الصفحة الرئيسية
                    return false;
                });

                // ترتيب التذكيرات (الأحدث أولاً) وأخذ أول 10
                const sortedReminders = relatedReminders
                    .sort((a, b) => new Date(b.id) - new Date(a.id))
                    .slice(0, 10);

                setReminders(sortedReminders);
            }
        } catch (error) {
            console.error('Error loading reminders:', error);
        }
    };

    const handleAddReminder = async (reminderData) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const newReminder = {
                    id: Date.now(),
                    ...reminderData,
                    isExpired: false,
                    isActive: true
                };

                const updatedReminders = [...(result.data.reminders || []), newReminder];
                result.data.reminders = updatedReminders;

                await dataAPI.saveData(result.data);
                loadReminders();
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error adding reminder:', error);
            alert('حدث خطأ أثناء إضافة التذكير');
        }
    };

    const handleEditReminder = async (reminderData) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedReminders = result.data.reminders.map(r =>
                    r.id === editingReminder.id ? { ...r, ...reminderData } : r
                );

                result.data.reminders = updatedReminders;
                await dataAPI.saveData(result.data);
                loadReminders();
                setEditingReminder(null);
            }
        } catch (error) {
            console.error('Error editing reminder:', error);
            alert('حدث خطأ أثناء تعديل التذكير');
        }
    };

    const handleToggleReminder = async (reminderId) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedReminders = result.data.reminders.map(r =>
                    r.id === reminderId ? { ...r, isActive: !r.isActive } : r
                );

                result.data.reminders = updatedReminders;
                await dataAPI.saveData(result.data);
                
                // إعادة تحميل البيانات
                loadReminders();
                
                // إذا كان المودال مفتوحاً، حدّث البيانات فيه
                if (viewingReminder && viewingReminder.id === reminderId) {
                    const updatedReminder = updatedReminders.find(r => r.id === reminderId);
                    setViewingReminder(updatedReminder);
                }
            }
        } catch (error) {
            console.error('Error toggling reminder:', error);
            alert('حدث خطأ أثناء تحديث حالة التذكير');
        }
    };

    const handleDeleteReminder = async (reminderId) => {
        if (!confirm('هل أنت متأكد من حذف هذا التذكير؟')) {
            return;
        }

        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedReminders = result.data.reminders.filter(r => r.id !== reminderId);
                result.data.reminders = updatedReminders;

                await dataAPI.saveData(result.data);
                loadReminders();
                setEditingReminder(null);
                setViewingReminder(null);
            }
        } catch (error) {
            console.error('Error deleting reminder:', error);
            alert('حدث خطأ أثناء حذف التذكير');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            day: 'numeric',
            month: 'long'
        });
    };

    const getDaysRemaining = (endDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'منتهي';
        if (diffDays === 0) return 'اليوم';
        if (diffDays === 1) return 'غداً';
        return `${diffDays} يوم`;
    };

    const getDaysRemainingColor = (endDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return '#dc2626';
        if (diffDays <= 3) return '#ea580c';
        if (diffDays <= 7) return '#f59e0b';
        return '#10b981';
    };

    return (
        <>
            <div className="reminder-head">
                <div className="section-title">
                    <h2>التذكيرات</h2>
                    <span>المتابعة القادمة</span>
                </div>
                <button 
                    className="link"
                    onClick={() => setShowAddModal(true)}
                >
                    + إضافة تذكير
                </button>
            </div>

            {reminders.length === 0 ? (
                <div className="reminder-list">
                    <div className="reminder" style={{ justifyContent: 'center', color: 'var(--muted)' }}>
                        لا توجد تذكيرات مرتبطة بالفاكسات
                    </div>
                </div>
            ) : (
                <div className="reminder-list">
                    {reminders.map((reminder, index) => {
                        const isActive = reminder.isActive !== undefined ? reminder.isActive : true;
                        const date = new Date(reminder.endDate);
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = date.toLocaleDateString('ar-EG', { month: 'long' });
                        
                        // Find linked fax name
                        let linkedFaxName = '';
                        if (reminder.linkedFaxId && appState.filteredFaxes) {
                            const faxIndex = appState.filteredFaxes.findIndex(f => f.id === reminder.linkedFaxId);
                            if (faxIndex !== -1) {
                                linkedFaxName = `فاكس ${faxIndex + 1}`;
                            }
                        }

                        return (
                            <div 
                                key={reminder.id}
                                className="reminder"
                                onClick={() => setViewingReminder(reminder)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="date">
                                    <strong>{day}</strong>
                                    <span>{month}</span>
                                </div>
                                <div className="reminder-copy">
                                    <strong>{reminder.title}</strong>
                                    <span>{reminder.description || 'متابعة الرد على الفاكس'} · {isActive ? 'نشط' : 'متوقف'}</span>
                                </div>
                                {linkedFaxName && (
                                    <span className="fax-pill">{linkedFaxName}</span>
                                )}
                                <span className="chevron">‹</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Reminder Modal */}
            {showAddModal && (
                <AddReminderModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddReminder}
                    showFaxLink={true}
                />
            )}

            {/* View Reminder Details Modal */}
            {viewingReminder && (
                <ReminderDetailModal
                    reminder={viewingReminder}
                    onClose={() => setViewingReminder(null)}
                    onEdit={() => {
                        setEditingReminder(viewingReminder);
                        setViewingReminder(null);
                    }}
                    onDelete={() => handleDeleteReminder(viewingReminder.id)}
                    onToggle={() => handleToggleReminder(viewingReminder.id)}
                />
            )}

            {/* Edit Reminder Modal */}
            {editingReminder && (
                <EditReminderModal
                    reminder={editingReminder}
                    onClose={() => setEditingReminder(null)}
                    onSave={handleEditReminder}
                    onDelete={handleDeleteReminder}
                    showFaxLink={true}
                />
            )}
        </>
    );
};

export default MainRemindersSection;
