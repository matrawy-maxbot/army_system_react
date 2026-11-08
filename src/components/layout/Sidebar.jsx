/**
 * Sidebar Component - Redesigned
 * الشريط الجانبي للوصول السريع
 * 
 * Features:
 * - Pinned archive items (المجلدات والملفات المثبتة)
 * - Quick reminders list (التذكيرات السريعة)
 * - Quick tasks list (المهمات السريعة)
 * - Quick lists access (الوصول السريع للقوائم)
 * - Backup management (إدارة النسخ الاحتياطية)
 */

import React, { useState, useEffect } from 'react';
import { dataAPI } from '../../services/electronAPI';
import { useAppState } from '../../context/AppStateContext';
import ReminderDetailModal from '../reminders/ReminderDetailModal';
import AddReminderModal from '../reminders/AddReminderModal';
import TaskDetailModal from '../tasks/TaskDetailModal';
import EditTaskModal from '../tasks/EditTaskModal';
import AddTaskModal from '../tasks/AddTaskModal';
import { 
    FolderViewModal, 
    EditFolderModal, 
    MoveFolderModal, 
    DeleteFolderModal,
    FileDetailModal 
} from '../archive';
import '../archive/FolderViewModal.css';

function Sidebar({ onSectionChange, onShowListDetails, onOpenPinnedFolder, onSettingsClick }) {
    const [reminders, setReminders] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [lists, setLists] = useState([]);
    const [pinnedItems, setPinnedItems] = useState([]);
    const { appState, setAppState, saveData } = useAppState();
    
    // Modal states
    const [viewingReminder, setViewingReminder] = useState(null);
    const [addingReminder, setAddingReminder] = useState(false);
    const [viewingTask, setViewingTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [addingTask, setAddingTask] = useState(false);
    const [viewingFolderId, setViewingFolderId] = useState(null);
    const [viewingFile, setViewingFile] = useState(null);
    const [editingFolderId, setEditingFolderId] = useState(null);
    const [movingFolderId, setMovingFolderId] = useState(null);
    const [deletingFolderId, setDeletingFolderId] = useState(null);
    const [unpinningItem, setUnpinningItem] = useState(null);
    
    // Section visibility states
    const [showPinned, setShowPinned] = useState(true);
    const [showReminders, setShowReminders] = useState(true);
    const [showTasks, setShowTasks] = useState(true);
    const [showLists, setShowLists] = useState(true);

    useEffect(() => {
        loadSidebarData();
    }, []);

    useEffect(() => {
        loadPinnedItems();
    }, [appState.archiveCategories]);

    const loadSidebarData = async () => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                // تحميل التذكيرات النشطة (غير المنتهية) ومرتبة
                const activeReminders = (result.data.reminders || [])
                    .filter(r => !r.isExpired && (r.isActive !== false))
                    .sort((a, b) => {
                        const orderA = a.order !== undefined ? a.order : 999999;
                        const orderB = b.order !== undefined ? b.order : 999999;
                        return orderA - orderB;
                    })
                    .slice(0, 4);
                
                // تحميل المهمات النشطة (غير المكتملة)
                const activeTasks = (result.data.tasks || [])
                    .filter(t => !t.isCompleted)
                    .slice(0, 3);
                
                // تحميل القوائم ومرتبة
                const realLists = (result.data.lists || []).sort((a, b) => {
                    const orderA = a.order !== undefined ? a.order : 999999;
                    const orderB = b.order !== undefined ? b.order : 999999;
                    return orderA - orderB;
                });

                setReminders(activeReminders);
                setTasks(activeTasks);
                
                if (realLists.length > 0) {
                    setLists(realLists);
                }
            }
        } catch (error) {
            console.error('Error loading sidebar data:', error);
        }
    };

    const loadPinnedItems = () => {
        if (!appState.archiveCategories) return;

        const pinned = [];
        
        // البحث عن المجلدات والملفات المثبتة
        appState.archiveCategories.forEach(category => {
            if (category.folders) {
                category.folders.forEach(folder => {
                    if (folder.isPinned) {
                        pinned.push({
                            type: 'folder',
                            id: folder.id,
                            name: folder.name,
                            categoryName: category.name,
                            filesCount: folder.files?.length || 0
                        });
                    }
                    
                    // البحث عن الملفات المثبتة داخل المجلد
                    if (folder.files) {
                        folder.files.forEach(file => {
                            if (file.isPinned) {
                                pinned.push({
                                    type: 'file',
                                    id: file.id,
                                    name: file.originalFileName || file.name,
                                    folderName: folder.name,
                                    categoryName: category.name,
                                    folderId: folder.id,
                                    filePath: file.path || file.name
                                });
                            }
                        });
                    }
                });
            }
        });

        setPinnedItems(pinned);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const end = new Date(dateString);
        end.setHours(0, 0, 0, 0);
        
        const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return `اليوم · ${date.getDate()} ${date.toLocaleDateString('ar-EG', { month: 'long' })}`;
        }
        
        return `${date.getDate()} ${date.toLocaleDateString('ar-EG', { month: 'long' })}`;
    };

    // حساب حالة التذكير
    const getReminderState = (endDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { text: 'متأخر', class: 'overdue' };
        if (diffDays === 0) return { text: 'اليوم', class: 'today' };
        if (diffDays === 1) return { text: 'غداً', class: '' };
        if (diffDays <= 7) return { text: `بعد ${diffDays} أيام`, class: '' };
        if (diffDays <= 30) {
            const weeks = Math.ceil(diffDays / 7);
            return { text: `بعد ${weeks} ${weeks === 1 ? 'أسبوع' : weeks === 2 ? 'أسبوعين' : 'أسابيع'}`, class: '' };
        }
        const months = Math.ceil(diffDays / 30);
        return { text: `بعد ${months} ${months === 1 ? 'شهر' : months === 2 ? 'شهرين' : 'أشهر'}`, class: '' };
    };

    const handleUnpinItem = async (item) => {
        const updatedCategories = appState.archiveCategories.map(category => {
            if (category.folders) {
                return {
                    ...category,
                    folders: category.folders.map(folder => {
                        if (item.type === 'folder' && folder.id === item.id) {
                            return { ...folder, isPinned: false };
                        }
                        
                        if (item.type === 'file' && folder.id === item.folderId && folder.files) {
                            return {
                                ...folder,
                                files: folder.files.map(file => 
                                    file.id === item.id ? { ...file, isPinned: false } : file
                                )
                            };
                        }
                        
                        return folder;
                    })
                };
            }
            return category;
        });

        setAppState({
            ...appState,
            archiveCategories: updatedCategories
        });

        await saveData();
        setUnpinningItem(null);
    };

    const handleOpenPinnedItem = (item) => {
        if (item.type === 'folder') {
            // تمرير folderId فقط مثل ArchivePage
            setViewingFolderId(item.id);
        } else if (item.type === 'file') {
            // البحث عن الملف الكامل
            let fullFile = null;
            appState.archiveCategories?.forEach(category => {
                if (category.folders) {
                    category.folders.forEach(folder => {
                        if (folder.files) {
                            const found = folder.files.find(f => f.id === item.id);
                            if (found) {
                                fullFile = {
                                    ...found,
                                    folderName: folder.name,
                                    folderId: folder.id,
                                    categoryName: category.name,
                                    categoryId: category.id
                                };
                            }
                        }
                    });
                }
            });
            
            if (fullFile) {
                setViewingFile(fullFile);
            }
        }
    };

    const handleNavigate = (section) => {
        if (onSectionChange) {
            onSectionChange(section);
        }
        
        const sidebarButtons = document.querySelectorAll('.sidebar-btn');
        sidebarButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === section) {
                btn.classList.add('active');
            }
        });
    };

    const handleListClick = (list) => {
        if (onShowListDetails) {
            onShowListDetails(list);
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
                loadSidebarData();
            }
        } catch (error) {
            console.error('Error toggling task:', error);
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
                loadSidebarData();
                setEditingTask(null);
            }
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedTasks = result.data.tasks.filter(t => t.id !== taskId);
                result.data.tasks = updatedTasks;

                await dataAPI.saveData(result.data);
                loadSidebarData();
                setViewingTask(null);
                setEditingTask(null);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
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
                loadSidebarData();
            }
        } catch (error) {
            console.error('Error toggling reminder:', error);
        }
    };

    const handleDeleteReminder = async (reminderId) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedReminders = result.data.reminders.filter(r => r.id !== reminderId);
                result.data.reminders = updatedReminders;

                await dataAPI.saveData(result.data);
                loadSidebarData();
                setViewingReminder(null);
            }
        } catch (error) {
            console.error('Error deleting reminder:', error);
        }
    };

    return (
        <>
            <aside className="sidebar">
                {/* Header */}
                <div className="sidebar-header">
                    <div>
                        <strong>مساحة العمل</strong>
                        <small className="sidebar-header-subtitle">الوصول السريع والمواعيد</small>
                    </div>
                    <div className="sidebar-toggle-buttons">
                        <button 
                            className="sidebar-toggle-btn welcome-btn"
                            onClick={() => handleNavigate('welcome')}
                            title="صفحة الترحيب"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l.324 .001l.318 .004l.616 .017l.299 .013l.579 .034l.553 .046c4.785 .464 6.732 2.411 7.196 7.196l.046 .553l.034 .579c.005 .098 .01 .198 .013 .299l.017 .616l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.464 4.785 -2.411 6.732 -7.196 7.196l-.553 .046l-.579 .034c-.098 .005 -.198 .01 -.299 .013l-.616 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.785 -.464 -6.732 -2.411 -7.196 -7.196l-.046 -.553l-.034 -.579a28.058 28.058 0 0 1 -.013 -.299l-.017 -.616c-.003 -.21 -.005 -.424 -.005 -.642l.001 -.324l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.464 -4.785 2.411 -6.732 7.196 -7.196l.553 -.046l.579 -.034c.098 -.005 .198 -.01 .299 -.013l.616 -.017c.21 -.003 .424 -.005 .642 -.005zm.01 5l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 3a1 1 0 0 0 -.993 .883l-.007 .117v5l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-5l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
                            </svg>
                        </button>
                        <button 
                            className={`sidebar-toggle-btn ${showPinned ? 'active' : ''}`}
                            onClick={() => setShowPinned(!showPinned)}
                            title={showPinned ? 'إخفاء الملفات المثبتة' : 'إظهار الملفات المثبتة'}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4" />
                                <path d="M9 15l-4.5 4.5" />
                                <path d="M14.5 4l5.5 5.5" />
                            </svg>
                        </button>
                        <button 
                            className={`sidebar-toggle-btn ${showReminders ? 'active' : ''}`}
                            onClick={() => setShowReminders(!showReminders)}
                            title={showReminders ? 'إخفاء التذكيرات' : 'إظهار التذكيرات'}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"/>
                                <path d="M9 17v1a3 3 0 0 0 6 0v-1"/>
                            </svg>
                        </button>
                        <button 
                            className={`sidebar-toggle-btn ${showTasks ? 'active' : ''}`}
                            onClick={() => setShowTasks(!showTasks)}
                            title={showTasks ? 'إخفاء المهام' : 'إظهار المهام'}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2"/>
                                <rect x="9" y="3" width="6" height="4" rx="2"/>
                                <path d="M9 12l2 2l4 -4"/>
                            </svg>
                        </button>
                        <button 
                            className={`sidebar-toggle-btn ${showLists ? 'active' : ''}`}
                            onClick={() => setShowLists(!showLists)}
                            title={showLists ? 'إخفاء القوائم' : 'إظهار القوائم'}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="8" y1="6" x2="21" y2="6"/>
                                <line x1="8" y1="12" x2="21" y2="12"/>
                                <line x1="8" y1="18" x2="21" y2="18"/>
                                <line x1="3" y1="6" x2="3.01" y2="6"/>
                                <line x1="3" y1="12" x2="3.01" y2="12"/>
                                <line x1="3" y1="18" x2="3.01" y2="18"/>
                            </svg>
                        </button>
                        <button 
                            className="sidebar-toggle-btn settings-btn"
                            onClick={onSettingsClick}
                            title="الإعدادات"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="sidebar-content-wrapper">
                    <div className="sidebar-content">
                        {/* الملفات المثبتة */}
                        {showPinned && (
                        <section className="sidebar-section pinned">
                            <div className="sidebar-section-header">
                                <div className="sidebar-section-title">
                                    الملفات المثبتة
                                    {pinnedItems.length > 0 && (
                                        <span className="sidebar-count">{pinnedItems.length}</span>
                                    )}
                                </div>
                                <button 
                                    className="sidebar-view-all"
                                    onClick={() => handleNavigate('archive')}
                                >
                                    فتح الملفات ↗
                                </button>
                            </div>
                            <div className="sidebar-section-content">
                                {pinnedItems.length > 0 ? (
                                    <div className="file-grid">
                                        {pinnedItems.slice(0, 2).map(item => (
                                            <div 
                                                key={`${item.type}-${item.id}`}
                                                className="file"
                                            >
                                                <div className="file-top">
                                                    <span className="file-icon">
                                                        {item.type === 'folder' ? (
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"/>
                                                            </svg>
                                                        ) : (
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
                                                            </svg>
                                                        )}
                                                    </span>
                                                    <span
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '0',
                                                            color: '#f59e0b',
                                                            lineHeight: '1',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setUnpinningItem(item);
                                                        }}
                                                        title="إلغاء التثبيت"
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.stopPropagation();
                                                                setUnpinningItem(item);
                                                            }
                                                        }}
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                                                            <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4" />
                                                            <path d="M9 15l-4.5 4.5" />
                                                            <path d="M14.5 4l5.5 5.5" />
                                                        </svg>
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '0',
                                                        width: '100%',
                                                        textAlign: 'right',
                                                        fontFamily: 'inherit'
                                                    }}
                                                    onClick={() => handleOpenPinnedItem(item)}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            handleOpenPinnedItem(item);
                                                        }
                                                    }}
                                                >
                                                    <div className="file-title">{item.name}</div>
                                                    <div className="meta">
                                                        {item.type === 'folder' 
                                                            ? `مجلد · ${item.categoryName}`
                                                            : `مستند · ${item.folderName}`
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="sidebar-empty-state">
                                        <svg className="empty-icon" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M16 12a1 1 0 0 1 0 2v.01a1 1 0 0 1 0 -2.01v-.01z"/>
                                            <path d="M9 8a1 1 0 0 1 0 2v.01a1 1 0 1 1 0 -2.01v-.01z"/>
                                            <path d="M15 8a1 1 0 0 1 0 2v.01a1 1 0 0 1 0 -2.01v-.01z"/>
                                            <path d="M9 12a1 1 0 1 1 0 2v.01a1 1 0 0 1 0 -2.01v-.01z"/>
                                            <rect x="4" y="4" width="16" height="16" rx="2"/>
                                        </svg>
                                        <p>لا توجد عناصر مثبتة</p>
                                    </div>
                                )}
                            </div>
                        </section>
                        )}

                        {/* التذكيرات */}
                        {showReminders && (
                        <section className="sidebar-section reminders">
                            <div className="sidebar-section-header">
                                <div className="sidebar-section-title">
                                    التذكيرات
                                    {reminders.length > 0 && (
                                        <span className="sidebar-count">{reminders.length}</span>
                                    )}
                                </div>
                                <button 
                                    className="sidebar-add-btn"
                                    onClick={() => setAddingReminder(true)}
                                >
                                    + إضافة
                                </button>
                            </div>
                            <div className="sidebar-section-content">
                                {reminders.length > 0 ? (
                                    <>
                                        <div className="agenda">
                                            {reminders.map(reminder => {
                                                const state = getReminderState(reminder.endDate);
                                                return (
                                                    <button
                                                        key={reminder.id}
                                                        className={`reminder ${state.class}`}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            width: '100%',
                                                            fontFamily: 'inherit'
                                                        }}
                                                        onClick={() => setViewingReminder(reminder)}
                                                    >
                                                        <div>
                                                            <div className="rem-title">{reminder.title}</div>
                                                            <div className="rem-date">{formatDate(reminder.endDate)}</div>
                                                        </div>
                                                        <span className="state">{state.text}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="foot">
                                            <button 
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontFamily: 'inherit',
                                                    fontSize: '10px',
                                                    color: '#3478ed',
                                                    fontWeight: '600'
                                                }}
                                                onClick={() => handleNavigate('reminders')}
                                            >
                                                كل التذكيرات ←
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="sidebar-empty-state">
                                        <svg className="empty-icon" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"/>
                                            <path d="M9 17v1a3 3 0 0 0 6 0v-1"/>
                                        </svg>
                                        <p>لا توجد تذكيرات</p>
                                    </div>
                                )}
                            </div>
                        </section>
                        )}

                        {/* المهام */}
                        {showTasks && (
                        <section className="sidebar-section tasks">
                            <div className="sidebar-section-header">
                                <div className="sidebar-section-title">
                                    المهام
                                    {tasks.length > 0 && (
                                        <span className="sidebar-count">{tasks.length}</span>
                                    )}
                                </div>
                                <button 
                                    className="sidebar-add-btn"
                                    onClick={() => setAddingTask(true)}
                                >
                                    + إضافة
                                </button>
                            </div>
                            <div className="sidebar-section-content">
                                {tasks.length > 0 ? (
                                    tasks.map((task, index) => (
                                        <div
                                            key={task.id}
                                            className={`task ${task.isCompleted ? 'done' : ''}`}
                                            style={{
                                                background: 'white',
                                                border: '1px solid #e8eef8',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontFamily: 'inherit',
                                                width: '100%',
                                                marginBottom: index < tasks.length - 1 ? '8px' : '0'
                                            }}
                                            onClick={() => setViewingTask(task)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    setViewingTask(task);
                                                }
                                            }}
                                        >
                                            <button 
                                                className="check"
                                                style={{
                                                    border: '1.5px solid #9cb7e9',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleTask(task.id);
                                                }}
                                                aria-label="إكمال المهمة"
                                            >
                                                {task.isCompleted ? '✓' : ''}
                                            </button>
                                            <div className="taskcopy">
                                                <b>{task.title}</b>
                                                <div className="meta">
                                                    موعد التسليم · {new Date(task.createdAt).toLocaleDateString('ar-EG', {
                                                        day: 'numeric',
                                                        month: 'long'
                                                    })}
                                                </div>
                                            </div>
                                            <span className="priority">عادية</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="sidebar-empty-state">
                                        <svg className="empty-icon" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2"/>
                                            <rect x="9" y="3" width="6" height="4" rx="2"/>
                                        </svg>
                                        <p>لا توجد مهمات</p>
                                    </div>
                                )}
                            </div>
                        </section>
                        )}

                        {/* القوائم */}
                        {showLists && (
                        <section className="sidebar-section lists">
                            <div className="sidebar-section-header">
                                <div className="sidebar-section-title">
                                    القوائم
                                    {lists.length > 0 && (
                                        <span className="sidebar-count">{lists.length}</span>
                                    )}
                                </div>
                                <button 
                                    className="sidebar-view-all"
                                    onClick={() => handleNavigate('lists')}
                                >
                                    إدارة ↗
                                </button>
                            </div>
                            <div className="sidebar-section-content">
                                {lists.length > 0 ? (
                                    <div className="chips">
                                        {lists.slice(0, 2).map(list => (
                                            <button
                                                key={list.id}
                                                className="chip"
                                                style={{
                                                    border: '1px solid #e5eaf1',
                                                    cursor: 'pointer',
                                                    fontFamily: 'inherit'
                                                }}
                                                onClick={() => handleListClick(list)}
                                            >
                                                <span 
                                                    className="dot" 
                                                    style={{ background: list.color || '#3478ed' }}
                                                ></span>
                                                <b>{list.name}</b>
                                                <span className="num">{list.faxes?.length || 0}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="sidebar-empty-state">
                                        <svg className="empty-icon" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2"/>
                                            <rect x="9" y="3" width="6" height="4" rx="2"/>
                                        </svg>
                                        <p>لا توجد قوائم</p>
                                    </div>
                                )}
                            </div>
                        </section>
                        )}

                        {/* النسخ الاحتياطية */}
                        <section className="sidebar-section">
                            <button
                                className="backup"
                                onClick={() => handleNavigate('backup')}
                                style={{
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    width: '100%'
                                }}
                            >
                                <span className="backupicon">☁</span>
                                <span className="backupcopy">
                                    <b>النسخ الاحتياطية</b>
                                    <small>إدارة النسخ والاسترجاع</small>
                                </span>
                                <span className="arrow">‹</span>
                            </button>
                        </section>
                    </div>
                </div>
            </aside>

            {/* Modals */}
            {viewingReminder && (
                <ReminderDetailModal
                    reminder={viewingReminder}
                    onClose={() => setViewingReminder(null)}
                    onToggle={handleToggleReminder}
                    onDelete={handleDeleteReminder}
                />
            )}

            {addingReminder && (
                <AddReminderModal
                    onClose={() => setAddingReminder(false)}
                    onAdd={loadSidebarData}
                />
            )}

            {viewingTask && !editingTask && (
                <TaskDetailModal
                    task={viewingTask}
                    onClose={() => setViewingTask(null)}
                    onEdit={() => setEditingTask(viewingTask)}
                    onDelete={handleDeleteTask}
                    onToggle={handleToggleTask}
                />
            )}

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() => {
                        setEditingTask(null);
                        setViewingTask(null);
                    }}
                    onSave={handleEditTask}
                />
            )}

            {addingTask && (
                <AddTaskModal
                    onClose={() => setAddingTask(false)}
                    onAdd={loadSidebarData}
                />
            )}

            {viewingFolderId && (
                <FolderViewModal
                    isOpen={true}
                    folderId={viewingFolderId}
                    onClose={() => setViewingFolderId(null)}
                    onEdit={(folderId) => {
                        setViewingFolderId(null);
                        setEditingFolderId(folderId);
                    }}
                    onMove={(folderId) => {
                        setViewingFolderId(null);
                        setMovingFolderId(folderId);
                    }}
                    onDelete={(folderId) => {
                        setViewingFolderId(null);
                        setDeletingFolderId(folderId);
                    }}
                />
            )}

            {editingFolderId && (
                <EditFolderModal
                    isOpen={true}
                    folderId={editingFolderId}
                    onClose={() => {
                        setEditingFolderId(null);
                    }}
                    onSave={() => {
                        setEditingFolderId(null);
                        loadSidebarData();
                    }}
                />
            )}

            {movingFolderId && (
                <MoveFolderModal
                    isOpen={true}
                    folderId={movingFolderId}
                    onClose={() => {
                        setMovingFolderId(null);
                    }}
                    onMove={() => {
                        setMovingFolderId(null);
                        loadSidebarData();
                    }}
                />
            )}

            {deletingFolderId && (
                <DeleteFolderModal
                    isOpen={true}
                    folderId={deletingFolderId}
                    onClose={() => {
                        setDeletingFolderId(null);
                    }}
                    onDelete={() => {
                        setDeletingFolderId(null);
                        loadSidebarData();
                    }}
                />
            )}

            {viewingFile && (
                <FileDetailModal
                    file={viewingFile}
                    onClose={() => setViewingFile(null)}
                    onUpdate={loadSidebarData}
                />
            )}

            {/* Unpin Confirmation Modal */}
            {unpinningItem && (
                <div 
                    className="fvm-dialog-backdrop" 
                    onClick={() => setUnpinningItem(null)}
                >
                    <div 
                        className="fvm-dialog" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="fvm-dialog-content">
                            <h2 className="fvm-dialog-title">إلغاء التثبيت؟</h2>
                            <p className="fvm-dialog-message">
                                سيتم إزالة <strong>{unpinningItem.name}</strong> من الملفات المثبتة في الشريط الجانبي.
                                <br />
                                يمكنك إعادة تثبيته في أي وقت.
                            </p>
                            <div className="fvm-dialog-actions">
                                <button 
                                    className="fvm-dialog-btn danger"
                                    onClick={() => handleUnpinItem(unpinningItem)}
                                >
                                    إلغاء التثبيت
                                </button>
                                <button 
                                    className="fvm-dialog-btn secondary"
                                    onClick={() => setUnpinningItem(null)}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Sidebar;
