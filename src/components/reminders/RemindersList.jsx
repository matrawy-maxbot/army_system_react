import React, { useState, useEffect } from 'react';
import ReminderCard from './ReminderCard';
import AddReminderModal from './AddReminderModal';
import EditReminderModal from './EditReminderModal';
import { dataAPI } from '../../services/electronAPI';

const RemindersList = () => {
    const [reminders, setReminders] = useState([]);
    const [filter, setFilter] = useState('all'); // all, active, expired
    const [sort, setSort] = useState('date-asc'); // date-asc, date-desc, title-asc, title-desc
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingReminder, setEditingReminder] = useState(null);

    useEffect(() => {
        loadReminders();
    }, []);

    const loadReminders = async () => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data && result.data.reminders) {
                setReminders(result.data.reminders);
                checkExpiredReminders(result.data.reminders);
            }
        } catch (error) {
            console.error('Error loading reminders:', error);
        }
    };

    const checkExpiredReminders = (remindersList) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updated = remindersList.map(reminder => {
            const endDate = new Date(reminder.endDate);
            endDate.setHours(0, 0, 0, 0);
            return {
                ...reminder,
                isExpired: endDate < today
            };
        });

        setReminders(updated);
    };

    const handleAddReminder = async (reminderData) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const newReminder = {
                    id: Date.now(),
                    ...reminderData,
                    isExpired: false
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
            }
        } catch (error) {
            console.error('Error deleting reminder:', error);
            alert('حدث خطأ أثناء حذف التذكير');
        }
    };

    const getFilteredAndSortedReminders = () => {
        let filtered = [...reminders];

        // فلترة
        if (filter === 'active') {
            filtered = filtered.filter(r => !r.isExpired);
        } else if (filter === 'expired') {
            filtered = filtered.filter(r => r.isExpired);
        }

        // ترتيب
        filtered.sort((a, b) => {
            switch (sort) {
                case 'date-asc':
                    return new Date(a.endDate) - new Date(b.endDate);
                case 'date-desc':
                    return new Date(b.endDate) - new Date(a.endDate);
                case 'title-asc':
                    return a.title.localeCompare(b.title, 'ar');
                case 'title-desc':
                    return b.title.localeCompare(a.title, 'ar');
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const filteredReminders = getFilteredAndSortedReminders();

    return (
        <div className="reminders-section">
            <div className="reminders-header">
                <h2>
                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                        <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                    </svg>
                    التذكيرات 
                    <span className="files-count">({reminders.length})</span>
                </h2>
                <button className="btn-add-category" onClick={() => setShowAddModal(true)}>
                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5a1 1 0 0 1 1 1v5h5a1 1 0 0 1 0 2h-5v5a1 1 0 0 1 -2 0v-5h-5a1 1 0 0 1 0 -2h5v-5a1 1 0 0 1 1 -1" />
                    </svg>
                    إضافة تذكير
                </button>
            </div>

            <div className="reminders-filters">
                <div className="filter-group">
                    <label>
                        <input
                            type="radio"
                            name="reminderFilter"
                            value="all"
                            checked={filter === 'all'}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <span>الكل</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="reminderFilter"
                            value="active"
                            checked={filter === 'active'}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <span>النشطة</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="reminderFilter"
                            value="expired"
                            checked={filter === 'expired'}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <span>المنتهية</span>
                    </label>
                </div>

                <select
                    className="filter-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="date-asc">التاريخ (الأقرب أولاً)</option>
                    <option value="date-desc">التاريخ (الأبعد أولاً)</option>
                    <option value="title-asc">العنوان (أ-ي)</option>
                    <option value="title-desc">العنوان (ي-أ)</option>
                </select>
            </div>

            {filteredReminders.length === 0 ? (
                <div className="reminders-empty">
                    <div className="empty-icon">
                        <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                            <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                        </svg>
                    </div>
                    <p>لا توجد تذكيرات</p>
                    <span className="empty-hint">أضف تذكيرًا جديدًا لتتبع المواعيد المهمة</span>
                </div>
            ) : (
                <div className="reminders-grid">
                    {filteredReminders.map(reminder => (
                        <ReminderCard
                            key={reminder.id}
                            reminder={reminder}
                            onEdit={() => setEditingReminder(reminder)}
                        />
                    ))}
                </div>
            )}

            {showAddModal && (
                <AddReminderModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddReminder}
                />
            )}

            {editingReminder && (
                <EditReminderModal
                    reminder={editingReminder}
                    onClose={() => setEditingReminder(null)}
                    onSave={handleEditReminder}
                    onDelete={handleDeleteReminder}
                />
            )}
        </div>
    );
};

export default RemindersList;
