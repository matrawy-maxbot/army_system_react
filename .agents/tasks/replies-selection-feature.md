# ميزة التحديد في قسم الردود على الفاكسات

## التعديلات المنفذة

### 1. تحديث FaxRepliesSection.jsx

#### إضافة حالات التحديد (State)
```javascript
const [selectedReplies, setSelectedReplies] = useState(new Set());
const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);
```

#### إضافة وظائف التحديد
- `toggleSelection(replyId)` - تبديل تحديد رد معين
- `selectAll()` - تحديد جميع الردود
- `clearSelection()` - إلغاء جميع التحديدات
- `deleteSelected()` - حذف الردود المحددة
- `confirmDeleteSelected()` - تأكيد حذف الردود المحددة

#### تحديث Header القسم
تم إضافة منطقة الإجراءات الجماعية في header القسم:
- زر "تحديد الكل" يظهر عندما لا يوجد تحديد
- أزرار الإجراءات (إلغاء التحديد، حذف المحدد) تظهر عند وجود تحديد
- عداد للعناصر المحددة
- زر "إضافة رد" يبقى ظاهراً دائماً

#### تمرير props للتحديد
```javascript
<ReplyCard
    key={reply.id}
    reply={reply}
    isSelected={selectedReplies.has(reply.id)}
    onSelect={toggleSelection}
    onClick={() => handleReplyClick(reply.id)}
    onDelete={() => handleDeleteReply(reply)}
/>
```

#### إضافة Modal تأكيد الحذف الجماعي
```javascript
<ConfirmDeleteModal
    isOpen={showDeleteMultipleModal}
    onClose={() => setShowDeleteMultipleModal(false)}
    onConfirm={confirmDeleteSelected}
    title="تأكيد حذف الردود"
    message="هل أنت متأكد من حذف الردود المحددة؟"
    itemCount={`عدد الردود المحددة: ${selectedReplies.size}`}
    warningNote="لا يمكن التراجع عن هذا الإجراء"
    loading={isDeleting}
/>
```

### 2. تحديث ReplyCard.jsx

#### إضافة دعم التحديد
```javascript
const ReplyCard = ({ reply, isSelected, onSelect, onClick, onDelete }) => {
    // ...
    const handleCheckboxClick = (e) => {
        e.stopPropagation();
        onSelect(reply.id);
    };
    // ...
}
```

#### إضافة Checkbox في الـ overlay
```javascript
<div className="fax-reply-card__checkbox-overlay">
    <div className={`fax-reply-checkbox ${isSelected ? 'checked' : ''}`} onClick={handleCheckboxClick}>
        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    </div>
</div>
```

#### تحديث className البطاقة
```javascript
<article className={`fax-reply-card fax-reply-card--${reply.status} ${isSelected ? 'selected' : ''}`}>
```

### 3. تحديث FaxReplies.css

#### أنماط Checkbox
```css
.replies-section .fax-reply-card__checkbox-overlay {
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 11;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
}

.replies-section .fax-reply-card:hover .fax-reply-card__checkbox-overlay {
    opacity: 1;
    pointer-events: auto;
}

.replies-section .fax-reply-checkbox {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 2px solid rgba(52, 120, 246, 0.4);
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.replies-section .fax-reply-checkbox.checked {
    background: var(--fc-primary);
    border-color: var(--fc-primary);
    box-shadow: 0 2px 12px rgba(52, 120, 246, 0.4);
}
```

#### أنماط البطاقة المحددة
```css
.replies-section .fax-reply-card.selected {
    border-color: var(--fc-primary);
    box-shadow: 0 0 0 3px rgba(52, 120, 246, 0.15), var(--fc-shadow-hover);
}

.replies-section .fax-reply-card.selected .fax-reply-card__checkbox-overlay {
    opacity: 1;
    pointer-events: auto;
}
```

#### تعديل موضع زر الحذف
```css
.replies-section .fax-reply-card__delete-overlay {
    position: absolute;
    top: 14px;
    left: 58px; /* بعد checkbox */
    z-index: 10;
}
```

## الميزات الرئيسية

### 1. التحديد الفردي والجماعي
- Checkbox في أعلى يسار كل بطاقة رد
- يظهر عند hover أو عند التحديد
- زر "تحديد الكل" لتحديد جميع الردود دفعة واحدة

### 2. الإجراءات الجماعية
- **إلغاء التحديد**: إلغاء جميع التحديدات
- **حذف المحدد**: حذف جميع الردود المحددة مع تأكيد

### 3. التغذية البصرية
- تظليل البطاقات المحددة بـ border أزرق وظل
- Checkbox محدد بلون أزرق مع علامة صح بيضاء
- عداد للعناصر المحددة في header القسم
- Checkbox يبقى ظاهراً للبطاقات المحددة حتى بدون hover

### 4. تجربة مستخدم محسنة
- منع التعارض بين التحديد والنقر على البطاقة
- استخدام `stopPropagation` لمنع فتح modal التفاصيل عند النقر على checkbox
- تأكيد قبل حذف الردود المتعددة
- رسالة نجاح بعد الحذف

## التوافق مع التصميم الموجود

جميع التعديلات متوافقة تماماً مع:
- نظام الألوان والأيقونات الموجود
- نمط التصميم المستخدم في قسم الفاكسات
- نظام Toast للإشعارات
- نظام ConfirmDeleteModal للتأكيد

## البناء والاختبار

تم بناء المشروع بنجاح:
```
✓ 124 modules transformed.
dist-vite/assets/index-4932eec4.css    197.86 kB │ gzip: 31.30 kB
dist-vite/assets/main-058f5828.js      316.83 kB │ gzip: 84.97 kB
✓ built in 54.93s
```

## الملفات المعدلة

1. `src/components/faxes/FaxRepliesSection.jsx`
2. `src/components/faxes/ReplyCard.jsx`
3. `src/components/faxes/FaxReplies.css`

## الحالة النهائية

✅ تم إضافة ميزة التحديد بنجاح
✅ متوافقة تماماً مع تصميم قسم الفاكسات
✅ تجربة مستخدم سلسة ومتسقة
✅ البناء ناجح بدون أخطاء
