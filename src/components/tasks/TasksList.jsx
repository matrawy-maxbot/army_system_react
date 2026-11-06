import React, { useState, useEffect } from 'react';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import { dataAPI } from '../../services/electronAPI';

const TasksList = () => {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortNewest, setSortNewest] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data && result.data.tasks) {
                setTasks(result.data.tasks || []);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const handleAddTask = async (taskData) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const newTask = {
                    id: Date.now(),
                    ...taskData,
                    isCompleted: false,
                    createdAt: new Date().toISOString(),
                    completedAt: null
                };

                const updatedTasks = [...(result.data.tasks || []), newTask];
                result.data.tasks = updatedTasks;

                await dataAPI.saveData(result.data);
                loadTasks();
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error adding task:', error);
            alert('حدث خطأ أثناء إضافة المهمة');
        }
    };

    const handleEditTask = async (taskData) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedTasks = result.data.tasks.map(t =>
                    t.id === editingTask.id ? { ...t, ...taskData } : t
                );

                result.data.tasks = updatedTasks;
                await dataAPI.saveData(result.data);
                loadTasks();
                setEditingTask(null);
            }
        } catch (error) {
            console.error('Error editing task:', error);
            alert('حدث خطأ أثناء تعديل المهمة');
        }
    };

    const handleToggleTask = async (taskId) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedTasks = result.data.tasks.map(t => {
                    if (t.id === taskId) {
                        const isCompleted = !t.isCompleted;
                        return {
                            ...t,
                            isCompleted,
                            completedAt: isCompleted ? new Date().toISOString() : null
                        };
                    }
                    return t;
                });

                result.data.tasks = updatedTasks;
                await dataAPI.saveData(result.data);
                loadTasks();
            }
        } catch (error) {
            console.error('Error toggling task:', error);
            alert('حدث خطأ أثناء تحديث حالة المهمة');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm('هل أنت متأكد من حذف هذه المهمة؟')) return;

        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedTasks = result.data.tasks.filter(t => t.id !== taskId);
                result.data.tasks = updatedTasks;

                await dataAPI.saveData(result.data);
                loadTasks();
                setEditingTask(null);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('حدث خطأ أثناء حذف المهمة');
        }
    };

    const getRelativeDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        today.setHours(0, 0, 0, 0);
        yesterday.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) return 'اليوم';
        if (date.getTime() === yesterday.getTime()) return 'أمس';
        
        const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        if (diffDays < 7) return `منذ ${diffDays} يوم`;
        if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسبوع`;
        return `منذ ${Math.floor(diffDays / 30)} شهر`;
    };

    const getFilteredAndSortedTasks = () => {
        let filtered = [...tasks];

        // فلترة حسب الحالة
        if (filter === 'open') {
            filtered = filtered.filter(t => !t.isCompleted);
        } else if (filter === 'done') {
            filtered = filtered.filter(t => t.isCompleted);
        }

        // فلترة حسب البحث
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(query) || 
                (t.description && t.description.toLowerCase().includes(query))
            );
        }

        // ترتيب
        filtered.sort((a, b) => sortNewest ? b.id - a.id : a.id - b.id);

        return filtered;
    };

    const filteredTasks = getFilteredAndSortedTasks();
    const totalCount = tasks.length;
    const openCount = tasks.filter(t => !t.isCompleted).length;
    const doneCount = tasks.filter(t => t.isCompleted).length;
    const progressPercent = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

    return (
        <main className="task-shell">
            <header className="task-top">
                <div>
                    <h1>المهام</h1>
                    <div className="task-sub">نظرة عامة على ما يحتاج إلى إنجاز</div>
                </div>
                <button className="task-primary" onClick={() => setShowAddModal(true)}>
                    إضافة مهمة
                </button>
            </header>

            <section className="task-overview" aria-label="ملخص المهام">
                <div className="task-metric">
                    <strong>{totalCount}</strong>
                    <span>إجمالي المهام</span>
                </div>
                <div className="task-metric">
                    <strong>{openCount}</strong>
                    <span>قيد التنفيذ</span>
                </div>
                <div className="task-metric">
                    <strong>{doneCount}</strong>
                    <span>مكتملة</span>
                </div>
                <div className="task-progress" aria-label="نسبة الإنجاز">
                    <i style={{ width: `${progressPercent}%` }}></i>
                </div>
            </section>

            <section className="task-toolbar" aria-label="أدوات المهام">
                <label className="task-search">
                    <input
                        type="search"
                        placeholder="ابحث في المهام..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="ابحث في المهام"
                    />
                </label>
                <div className="task-filters" role="group" aria-label="تصفية المهام">
                    <button
                        className={`task-filter ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        الكل
                    </button>
                    <button
                        className={`task-filter ${filter === 'open' ? 'active' : ''}`}
                        onClick={() => setFilter('open')}
                    >
                        قيد التنفيذ
                    </button>
                    <button
                        className={`task-filter ${filter === 'done' ? 'active' : ''}`}
                        onClick={() => setFilter('done')}
                    >
                        مكتملة
                    </button>
                </div>
                <button
                    className="task-sort"
                    onClick={() => setSortNewest(!sortNewest)}
                >
                    {sortNewest ? 'الأحدث أولاً ↕' : 'الأقدم أولاً ↕'}
                </button>
            </section>

            <section className="task-list-container" aria-live="polite">
                {filteredTasks.length === 0 ? (
                    <div className="task-empty">لا توجد مهام مطابقة</div>
                ) : (
                    filteredTasks.map((task) => (
                        <article
                            key={task.id}
                            className={`task-item ${task.isCompleted ? 'done' : ''}`}
                        >
                            <input
                                className="task-check"
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={() => handleToggleTask(task.id)}
                                aria-label={`تحديد ${task.title} كمكتملة`}
                            />
                            <div className="task-main">
                                <div className="task-title">{task.title}</div>
                                {task.description && (
                                    <div className="task-note">{task.description}</div>
                                )}
                            </div>
                            <div className="task-meta">
                                <span>{getRelativeDate(task.createdAt)}</span>
                                <span className={`task-status ${task.isCompleted ? 'done' : ''}`}>
                                    {task.isCompleted ? 'مكتملة' : 'قيد التنفيذ'}
                                </span>
                                <span className="task-actions">
                                    <button
                                        className="task-icon-btn"
                                        type="button"
                                        onClick={() => setEditingTask(task)}
                                    >
                                        تعديل
                                    </button>
                                    <button
                                        className="task-icon-btn"
                                        type="button"
                                        onClick={() => handleDeleteTask(task.id)}
                                    >
                                        حذف
                                    </button>
                                </span>
                            </div>
                        </article>
                    ))
                )}
            </section>

            {showAddModal && (
                <AddTaskModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddTask}
                />
            )}

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={handleEditTask}
                    onDelete={handleDeleteTask}
                />
            )}
        </main>
    );
};

export default TasksList;
