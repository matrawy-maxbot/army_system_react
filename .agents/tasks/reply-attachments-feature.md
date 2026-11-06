# ميزة المرفقات المتعددة في الردود على الفاكسات

## 📋 الملخص
تم إضافة ميزة كاملة لإرفاق ملفات PDF وصور متعددة عند الرد على الفاكسات، مع عرض مرئي مميز للملفات المكدسة في بطاقات الردود.

## ✨ الميزات الجديدة

### 1. إضافة مرفقات متعددة
- رفع ملفات PDF متعددة
- رفع صور متعددة  
- إضافة المزيد من الملفات في أي وقت
- حذف مرفقات فردية

### 2. عرض مكدس (Stacked) للملفات في البطاقة
- عرض الملفات بشكل مكدس خلف بطاقة الرد
- استخدام `position: absolute` و `z-index`
- تأثير hover جميل يُظهر التكديس بوضوح
- عرض عداد للملفات الإضافية (+3)

### 3. إدارة المرفقات في مودال التفاصيل
- عرض جميع المرفقات مع معاينات
- حذف مرفقات فردية
- إضافة مرفقات جديدة
- معاينة الصور والملفات

## 🎨 التصميم المرئي

### بطاقة الرد مع الملفات المكدسة
```
┌─────────────────────────┐
│  ┌───────────────────┐  │  ← الملف الأول (z-index: 10)
│  │  ┌─────────────┐  │  │
│  │  │  ┌────────┐ │  │  │  ← الملف الثاني (z-index: 9)
│  │  │  │        │ │  │  │
│  │  │  │  رد -  │ │  │  │  ← الملف الثالث (z-index: 8)
│  │  │  │   ...  │ │  │  │
│  │  │  │        │ │  │  │
│  │  │  │   +3   │ │  │  │  ← Badge لعدد الملفات
│  │  │  └────────┘ │  │  │
│  │  └─────────────┘  │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

عند Hover: تتباعد البطاقات المكدسة لإظهار العمق

## 🔧 التغييرات التقنية

### 1. ReplyCard.jsx

تم إضافة:
- قراءة `attachments` من بيانات الرد
- عرض الملفات المكدسة قبل محتوى البطاقة
- حساب عدد الملفات وعرض badge

```javascript
const ReplyCard = ({ reply, isSelected, onSelect, onClick, onDelete }) => {
    const attachments = reply.attachments || [];
    const hasAttachments = attachments.length > 0;
    
    return (
        <article className="fax-reply-card">
            <div className="fax-reply-card__preview-box">
                {/* الملفات المكدسة */}
                {hasAttachments && attachments.length > 1 && (
                    <div className="reply-attachments-stack">
                        {attachments.slice(0, 3).map((attachment, index) => (
                            <div 
                                className="attachment-card-stacked"
                                style={{
                                    zIndex: 10 - index,
                                    transform: `translateX(${index * -8}px) translateY(${index * -8}px)`,
                                }}
                            >
                                {/* محتوى البطاقة */}
                            </div>
                        ))}
                        {attachments.length > 3 && (
                            <div className="attachments-count-badge">
                                +{attachments.length - 3}
                            </div>
                        )}
                    </div>
                )}
                
                {/* بقية محتوى البطاقة */}
            </div>
        </article>
    );
};
```

### 2. ReplyDetailModal.jsx

تم إضافة:
- State لإدارة المرفقات (`pdfFiles`, `images`, `showAttachmentsModal`)
- دوال معالجة رفع وحذف المرفقات
- قسم عرض المرفقات الحالية
- مودال رفع المرفقات الجديدة

#### State الجديد:
```javascript
const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
const [pdfFiles, setPdfFiles] = useState([]);
const [images, setImages] = useState([]);
```

#### دوال المعالجة:
```javascript
const handlePdfSelect = (e) => {
    const files = Array.from(e.target.files);
    const newPdfs = files.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: file.size,
        type: 'pdf',
        file: file,
        preview: URL.createObjectURL(file),
        order: (reply.attachments?.length || 0) + pdfFiles.length + index + 1
    }));
    setPdfFiles(prev => [...prev, ...newPdfs]);
};

const handleImagesSelect = (e) => {
    // مشابه لـ handlePdfSelect
};

const handleSaveAttachments = async () => {
    const allNewAttachments = [...pdfFiles, ...images];
    const updatedAttachments = [...(reply.attachments || []), ...allNewAttachments];
    
    const updatedReplies = replies.map(r =>
        r.id === reply.id ? { 
            ...r, 
            attachments: updatedAttachments,
            lastModified: new Date().toISOString() 
        } : r
    );

    await updateState({ faxReplies: updatedReplies });
    // تنظيف
};

const handleDeleteAttachment = async (attachmentId) => {
    const updatedAttachments = (reply.attachments || []).filter(att => att.id !== attachmentId);
    // تحديث
};
```

#### قسم المرفقات في الـ JSX:
```jsx
<section className="document-user-attachments">
    <div className="document-section-header">
        <span className="document-section-caption">المرفقات</span>
        <button 
            className="btn-add-attachment"
            onClick={() => setShowAttachmentsModal(true)}
        >
            إضافة ملفات
        </button>
    </div>
    
    {reply.attachments && reply.attachments.length > 0 ? (
        <div className="attachments-list">
            {reply.attachments.map((attachment) => (
                <div key={attachment.id} className="attachment-item">
                    {/* معاينة ومعلومات وزر حذف */}
                </div>
            ))}
        </div>
    ) : (
        <div className="no-attachments">
            <p>لا توجد مرفقات إضافية</p>
        </div>
    )}
</section>
```

#### مودال رفع المرفقات:
```jsx
<Modal isOpen={showAttachmentsModal} title="إضافة مرفقات">
    <div className="attachments-upload-modal">
        {/* قسم رفع ملفات PDF */}
        <div className="upload-section">
            <h3>ملفات PDF</h3>
            {/* منطقة رفع مع معاينات */}
        </div>

        {/* قسم رفع الصور */}
        <div className="upload-section">
            <h3>صور</h3>
            {/* منطقة رفع مع معاينات */}
        </div>

        {/* أزرار الإجراءات */}
        <div className="form-actions">
            <button onClick={handleSaveAttachments}>حفظ</button>
        </div>
    </div>
</Modal>
```

### 3. FaxReplies.css

تم إضافة أنماط للملفات المكدسة:

```css
/* الملفات المكدسة خلف البطاقة */
.reply-attachments-stack {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 0;
}

.attachment-card-stacked {
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: white;
    border: 2px solid #e4ebf8;
    border-radius: var(--fc-radius-preview);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: transform 0.3s ease;
}

/* تأثير hover */
.fax-reply-card:hover .attachment-card-stacked {
    transform: translateX(-12px) translateY(-12px) !important;
}

/* Badge عدد الملفات */
.attachments-count-badge {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    z-index: 15;
    backdrop-filter: blur(8px);
}
```

تغيير مهم:
```css
.fax-reply-card__preview-box {
    overflow: visible; /* كان hidden */
}
```

### 4. ReplyDetailModal.css

تم إضافة أنماط شاملة:
- قسم المرفقات الإضافية (`.document-user-attachments`)
- عرض قائمة المرفقات (`.attachments-list`, `.attachment-item`)
- معاينة المرفقات (`.attachment-preview`)
- أزرار الإضافة والحذف
- مودال رفع المرفقات (`.attachments-upload-modal`)

## 📁 الملفات المعدّلة

1. **src/components/faxes/ReplyCard.jsx**
   - إضافة قراءة المرفقات
   - إضافة عرض الملفات المكدسة
   - إضافة badge عدد الملفات

2. **src/components/faxes/ReplyDetailModal.jsx**
   - إضافة State لإدارة المرفقات
   - إضافة دوال معالجة الملفات
   - إضافة قسم عرض المرفقات
   - إضافة مودال رفع المرفقات

3. **src/components/faxes/FaxReplies.css**
   - أنماط الملفات المكدسة
   - تأثيرات hover
   - Badge عدد الملفات
   - تغيير overflow في preview-box

4. **src/components/faxes/ReplyDetailModal.css**
   - أنماط قسم المرفقات
   - أنماط قائمة المرفقات
   - أنماط مودال رفع المرفقات

## 🎯 كيفية الاستخدام

### إضافة مرفقات لرد موجود:
1. افتح تفاصيل الرد
2. انتقل إلى قسم "المرفقات"
3. اضغط "إضافة ملفات"
4. اختر ملفات PDF أو صور
5. يمكنك إضافة المزيد من كل نوع
6. اضغط "حفظ المرفقات"

### عرض المرفقات:
- في بطاقة الرد: عرض مكدس للملفات
- عند hover: تتباعد البطاقات لإظهار العمق
- في مودال التفاصيل: قائمة كاملة بالمرفقات

### حذف مرفق:
- في مودال التفاصيل
- اضغط على زر الحذف (×) بجانب المرفق
- سيتم حذفه مباشرة

## 💾 هيكل البيانات

### بنية reply مع المرفقات:
```javascript
{
    id: 'reply-1',
    name: 'رد - قالب رسمي',
    faxId: 'fax-1',
    faxName: 'فاكس رقم 1',
    templateId: 'template-1',
    templateName: 'قالب رسمي',
    fileType: 'docx',
    status: 'draft', // draft | in_progress | completed
    createdDate: '2026-11-03T...',
    lastModified: '2026-11-03T...',
    note: '',
    attachments: [
        {
            id: 1730000001,
            name: 'document.pdf',
            size: 245678,
            type: 'pdf', // 'pdf' | 'image'
            file: File, // كائن الملف
            preview: 'blob:http://...', // URL للمعاينة
            order: 1
        },
        {
            id: 1730000002,
            name: 'image.jpg',
            size: 123456,
            type: 'image',
            file: File,
            preview: 'blob:http://...',
            order: 2
        }
    ]
}
```

## ✅ التحقق من النجاح

تم اختبار التالي:
- ✅ البناء ناجح (`npm run build`)
- ✅ عرض الملفات المكدسة في البطاقة
- ✅ تأثير hover على التكديس
- ✅ عرض badge لعدد الملفات الإضافية
- ✅ إضافة ملفات PDF متعددة
- ✅ إضافة صور متعددة
- ✅ حذف مرفقات فردية
- ✅ حفظ المرفقات في الحالة
- ✅ عرض المرفقات في مودال التفاصيل

## 🎨 مميزات التصميم

### 1. التكديس المرئي
- استخدام `position: absolute` لتكديس البطاقات
- كل بطاقة لها `z-index` مختلف (10, 9, 8, ...)
- كل بطاقة مزاحة قليلاً (`translateX/Y`)

### 2. تأثيرات Hover
- عند hover على البطاقة، تتباعد البطاقات المكدسة
- `transform: translateX(-12px) translateY(-12px)`
- انتقال سلس (transition: 0.3s)

### 3. Badge عدد الملفات
- موضع ثابت في الزاوية السفلية اليمنى
- خلفية شفافة مع blur
- z-index عالي لضمان الظهور

### 4. معاينة المرفقات
- صور: معاينة كاملة
- ملفات PDF: أيقونة جميلة بخلفية gradient
- معلومات الملف (اسم + حجم)

## 🚀 التحسينات المستقبلية (اختياري)

- [ ] إضافة drag & drop لرفع الملفات
- [ ] إعادة ترتيب المرفقات بالسحب والإفلات
- [ ] معاينة ملفات PDF (صفحة أولى)
- [ ] ضغط الصور تلقائياً
- [ ] شريط تقدم للرفع
- [ ] أنواع ملفات إضافية (Word, Excel, etc.)
- [ ] تحميل المرفقات
- [ ] مشاركة المرفقات

## 📝 ملاحظات تقنية

### التكديس والـ z-index:
```javascript
style={{
    zIndex: 10 - index, // أول ملف: 10, ثاني: 9, ثالث: 8
    transform: `translateX(${index * -8}px) translateY(${index * -8}px)`,
}}
```

### معالجة رفع الملفات:
```javascript
const files = Array.from(e.target.files);
const newFiles = files.map((file, index) => ({
    id: Date.now() + index, // ID فريد
    name: file.name,
    size: file.size,
    type: 'pdf', // أو 'image'
    file: file,
    preview: URL.createObjectURL(file), // للمعاينة
    order: existingCount + index + 1
}));
```

### حفظ في الحالة:
```javascript
const updatedReplies = replies.map(r =>
    r.id === reply.id ? { 
        ...r, 
        attachments: [...(r.attachments || []), ...newAttachments],
        lastModified: new Date().toISOString() 
    } : r
);

await updateState({ faxReplies: updatedReplies });
```

## 🎭 أمثلة مرئية

### بطاقة الرد بدون مرفقات:
```
┌──────────────────┐
│ رد - قالب رسمي   │
│                  │
│  [معاينة ملف]   │
│                  │
└──────────────────┘
```

### بطاقة الرد مع 3 مرفقات:
```
┌──────────────────┐ ← ملف 1 (أعلى)
│┌────────────────┐│
││ رد - قالب رسمي ││ ← ملف 2
││                ││
││ [معاينة ملف]  ││ ← ملف 3
││                ││
│└────────────────┘│
└──────────────────┘
```

### بطاقة الرد مع 5+ مرفقات:
```
┌──────────────────┐
│┌────────────────┐│
││┌──────────────┐││
│││ رد - قالب ... │││
│││              │││
│││  [+3] ◄──────┘││  ← Badge
│││              ││
││└──────────────┘│
│└────────────────┘
└──────────────────┘
```

---

**تاريخ التنفيذ**: 2026-11-03  
**الحالة**: ✅ مكتمل ومختبر  
**البناء**: ✅ ناجح بدون أخطاء  
**التكديس المرئي**: ✅ يعمل بشكل مثالي  
**إدارة المرفقات**: ✅ كاملة الوظائف
