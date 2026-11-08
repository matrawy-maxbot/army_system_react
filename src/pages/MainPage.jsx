/**
 * MainPage Component
 * الصفحة الرئيسية المعاد تصميمها بالكامل
 * تطابق التصميم المرجعي بالضبط
 */

import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import DatePickerModal from '../components/common/DatePickerModal';
import SearchResults from '../components/common/SearchResults';
import './MainPage.css';

const MainPage = ({ onUploadClick }) => {
    const { appState } = useAppState();
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalText, setModalText] = useState('');
    const [toast, setToast] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchMode, setSearchMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const showModalDialog = (title, text) => {
        setModalTitle(title);
        setModalText(text);
        setShowModal(true);
    };

    const showToastMessage = (message) => {
        setToast(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2100);
    };

    const handleUploadClick = () => {
        showModalDialog('رفع فاكس أصلي', 'هذه معاينة للواجهة. اربط هذا الزر لاحقًا بنافذة اختيار ملف PDF.');
    };

    const handleFilterClick = () => {
        showToastMessage('أنت الآن في مرحلة فلترة الصفحات');
    };

    const handleSelectClick = () => {
        document.querySelectorAll('.fax-card').forEach(c => c.classList.toggle('selected-card'));
        showToastMessage('تم تفعيل وضع التحديد');
    };

    const handleAddReminderClick = () => {
        showModalDialog('إضافة تذكير', 'يمكن إضافة تاريخ وموضوع التذكير وربطه بالفاكس المطلوب.');
    };

    const handleCardClick = (name) => {
        showModalDialog(name, `تفاصيل ${name} — يمكنك هنا عرض الصفحات والمستندات المرتبطة به.`);
    };

    const handleAddReplyClick = () => {
        showModalDialog('إنشاء رد لهذا الفاكس', 'سيتم إنشاء مستند رد جديد مرتبط بفاكس 2.');
    };

    const handleDatePickerClick = () => {
        setShowDatePicker(true);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        const formattedDate = date.toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        showToastMessage(`تم اختيار: ${formattedDate}`);
    };

    const handleTodayClick = () => {
        showToastMessage('تم اختيار تاريخ اليوم');
    };

    const handleArchiveSearchClick = () => {
        const demoQuery = 'فاكس';
        setSearchQuery(demoQuery);
        setSearchMode(true);
    };

    const handleCloseSearch = () => {
        setSearchMode(false);
        setSearchQuery('');
    };

    // إذا كان في وضع البحث، اعرض نتائج البحث
    if (searchMode) {
        return (
            <main className="page">
                {/* Header Section */}
                <header className="topbar">
                    <div className="heading">
                        <h1>الرئيسية</h1>
                        <p>إدارة الفاكسات والردود والمتابعة</p>
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn date-btn" onClick={handleDatePickerClick} title="اختيار تاريخ">
                            📅
                        </button>
                        <button className="secondary today-btn" onClick={handleTodayClick}>
                            اليوم
                        </button>
                        <button className="secondary search-btn" onClick={handleArchiveSearchClick}>
                            🔍 بحث في الأرشيف
                        </button>
                        <button className="primary" onClick={handleUploadClick}>
                            + رفع فاكس أصلي
                        </button>
                    </div>
                </header>

                {/* Search Results */}
                <SearchResults query={searchQuery} onClose={handleCloseSearch} />

                {/* Date Picker Modal */}
                <DatePickerModal
                    isOpen={showDatePicker}
                    onClose={() => setShowDatePicker(false)}
                    onSelectDate={handleDateSelect}
                    initialDate={selectedDate}
                />

                {/* Toast */}
                <div className={`toast ${showToast ? 'show' : ''}`}>
                    {toast}
                </div>
            </main>
        );
    }

    return (
        <main className="page">
            {/* Header Section */}
            <header className="topbar">
                <div className="heading">
                    <h1>الرئيسية</h1>
                    <p>إدارة الفاكسات والردود والمتابعة</p>
                </div>
                <div className="header-actions">
                    <button className="icon-btn date-btn" onClick={handleDatePickerClick} title="اختيار تاريخ">
                        📅
                    </button>
                    <button className="secondary today-btn" onClick={handleTodayClick}>
                        اليوم
                    </button>
                    <button className="secondary search-btn" onClick={handleArchiveSearchClick}>
                        🔍 بحث في الأرشيف
                    </button>
                    <button className="primary" onClick={handleUploadClick}>
                        + رفع فاكس أصلي
                    </button>
                </div>
            </header>

            {/* Workflow Section */}
            <section className="workflow">
                <div className="workflow-head">
                    <strong>مسار معالجة الفاكس</strong>
                    <span>المرحلة 2 من 4</span>
                </div>
                <div className="steps">
                    <div className="step done">
                        <div className="circle">✓</div>
                        <div className="label">
                            رفع الفاكس
                            <small>تم الرفع</small>
                        </div>
                    </div>
                    <div className="step active">
                        <div className="circle">2</div>
                        <div className="label">
                            فلترة الصفحات
                            <small>قيد المعالجة</small>
                        </div>
                    </div>
                    <div className="step">
                        <div className="circle">3</div>
                        <div className="label">
                            الردود
                            <small>إنشاء المستندات</small>
                        </div>
                    </div>
                    <div className="step">
                        <div className="circle">4</div>
                        <div className="label">
                            التذكيرات
                            <small>المتابعة</small>
                        </div>
                    </div>
                </div>
            </section>

            {/* Faxes Section */}
            <section>
                <div className="section-head">
                    <div className="section-title">
                        <h2>الفاكسات</h2>
                        <span>3 عناصر</span>
                    </div>
                    <div className="actions">
                        <button onClick={handleSelectClick}>تحديد</button>
                        <button className="selected" onClick={handleFilterClick}>فلترة الصفحات</button>
                    </div>
                </div>
                <div className="fax-grid">
                    {/* Original Fax Card */}
                    <article 
                        className="fax-card original" 
                        data-name="الفاكس الأصلي"
                        onClick={() => handleCardClick('الفاكس الأصلي')}
                    >
                        <div className="preview">
                            <span className="tag">الملف المصدر</span>
                            <div className="paper">
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                                <div className="stamp"></div>
                                <i></i>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="card-title">
                                <strong>الفاكس الأصلي</strong>
                                <span className="source">المصدر</span>
                            </div>
                            <div className="meta">
                                <span>PDF · 4 صفحات · 4 نوفمبر 2026</span>
                            </div>
                        </div>
                    </article>

                    {/* Fax 1 Card */}
                    <article 
                        className="fax-card" 
                        data-name="فاكس 1"
                        onClick={() => handleCardClick('فاكس 1')}
                    >
                        <div className="preview">
                            <span className="tag">صفحات</span>
                            <div className="paper">
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                                <div className="stamp"></div>
                                <i></i>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="card-title">
                                <strong>فاكس 1</strong>
                                <span className="meta">4 نوفمبر</span>
                            </div>
                            <div className="meta">
                                <span>صفحتان · فاكس مفلتر</span>
                            </div>
                            <div className="card-divider"></div>
                            <div className="file-row">
                                <div className="word-icon">W</div>
                                <div className="file-info">
                                    <strong>رد فاكس 1</strong>
                                    <span>Word · مستند مرتبط</span>
                                </div>
                                <span className="status">مسودة</span>
                            </div>
                        </div>
                    </article>

                    {/* Fax 2 Card */}
                    <article 
                        className="fax-card" 
                        data-name="فاكس 2"
                        onClick={() => handleCardClick('فاكس 2')}
                    >
                        <div className="preview">
                            <span className="tag">صفحات</span>
                            <div className="paper">
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                                <div className="stamp"></div>
                                <i></i>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="card-title">
                                <strong>فاكس 2</strong>
                                <span className="meta">4 نوفمبر</span>
                            </div>
                            <div className="meta">
                                <span>صفحتان · فاكس مفلتر</span>
                            </div>
                            <div className="card-divider"></div>
                            <button 
                                className="add-filter" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddReplyClick();
                                }}
                            >
                                + إنشاء رد لهذا الفاكس
                            </button>
                        </div>
                    </article>
                </div>
            </section>

            {/* Reminders Section */}
            <section className="reminders">
                <div className="reminder-head">
                    <div className="section-title">
                        <h2>التذكيرات</h2>
                        <span>المتابعة القادمة</span>
                    </div>
                    <button className="link" onClick={handleAddReminderClick}>
                        + إضافة تذكير
                    </button>
                </div>
                <div className="reminder-list">
                    <div className="reminder">
                        <div className="date">
                            <strong>09</strong>
                            <span>نوفمبر</span>
                        </div>
                        <div className="reminder-copy">
                            <strong>تذكير المسؤول</strong>
                            <span>متابعة الرد على الفاكس · نشط</span>
                        </div>
                        <span className="fax-pill">فاكس 1</span>
                        <span className="chevron">‹</span>
                    </div>
                    <div className="reminder">
                        <div className="date">
                            <strong>13</strong>
                            <span>نوفمبر</span>
                        </div>
                        <div className="reminder-copy">
                            <strong>مراجعة المستندات</strong>
                            <span>التأكد من اكتمال المعالجة · نشط</span>
                        </div>
                        <span className="fax-pill">فاكس 2</span>
                        <span className="chevron">‹</span>
                    </div>
                </div>
            </section>

            {/* Modal */}
            <div 
                className={`modal-backdrop ${showModal ? 'show' : ''}`}
                onClick={(e) => {
                    if (e.target.classList.contains('modal-backdrop')) {
                        setShowModal(false);
                    }
                }}
            >
                <div className="modal" role="dialog" aria-modal="true">
                    <h3>{modalTitle}</h3>
                    <p>{modalText}</p>
                    <div className="modal-footer">
                        <button onClick={() => setShowModal(false)}>إغلاق</button>
                        <button className="primary" onClick={() => setShowModal(false)}>حسنًا</button>
                    </div>
                </div>
            </div>

            {/* Toast */}
            <div className={`toast ${showToast ? 'show' : ''}`}>
                {toast}
            </div>

            {/* Date Picker Modal */}
            <DatePickerModal
                isOpen={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onSelectDate={handleDateSelect}
                initialDate={selectedDate}
            />
        </main>
    );
};

export default MainPage;
