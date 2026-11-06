# تبسيط معاينة القوالب - استخدام No-Preview بشكل افتراضي

## التاريخ: 30 أكتوبر 2026

## الهدف
إزالة المعاينات المزيفة (الخطوط والكتل) واستخدام "no-preview" لجميع القوالب بشكل افتراضي، مع إمكانية عرض صورة مصغرة حقيقية عند توفرها.

## الملفات المعدلة

### 1. `src/components/templates/TemplateCard.jsx`

#### التغييرات:

**أ) إزالة المعاينات المزيفة:**
- ✅ حذف `renderSheetPreview()` - كان يعرض خطوط ومربعات لملفات Excel
- ✅ حذف `renderPdfPreview()` - كان يعرض خطوط ومربعات لملفات PDF
- ✅ حذف `renderDocxPreview()` - كان يعرض خطوط ومربعات لملفات Word
- ✅ حذف `renderDocumentContent()` - كان يختار المعاينة حسب النوع

**ب) تبسيط المنطق:**
- ✅ إضافة `hasThumbnail` لفحص وجود صورة مصغرة حقيقية
- ✅ إذا كان `template.thumbnailPath` أو `template.thumbnail` موجود → عرض الصورة
- ✅ إذا لم يكن موجود → عرض "no-preview" بشكل افتراضي

**ج) دعم الصور المصغرة:**
```jsx
if (hasThumbnail) {
    return (
        <div className="document">
            <img 
                src={template.thumbnailPath || template.thumbnail} 
                alt={template.name}
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain' 
                }}
            />
        </div>
    );
}
```

**د) No-Preview الافتراضي:**
```jsx
// جميع القوالب بدون thumbnailPath تعرض هذا
<div className="no-preview">
    <div className="no-preview-icon">▤</div>
    <span className="no-preview-title">لا توجد معاينة متاحة</span>
    <span className="no-preview-subtitle">افتح الملف للاطلاع على محتواه</span>
</div>
```

### 2. `src/styles/templates.css`

#### التغييرات:

**أ) تحديث `.document`:**
- ✅ إضافة `display: flex` + `align-items: center` + `justify-content: center`
- ✅ هذا يجعل الصورة المصغرة تظهر في المنتصف بشكل صحيح

**ب) إضافة قواعد للصور:**
```css
.templates-section .document img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
```

**ج) إزالة CSS غير المستخدم:**
- ✅ حذف `.doc-title` - لم يعد مستخدماً
- ✅ حذف `.doc-line` - لم يعد مستخدماً
- ✅ حذف `.doc-line.dark` - لم يعد مستخدماً
- ✅ حذف `.doc-line.mid` - لم يعد مستخدماً
- ✅ حذف `.doc-block` - لم يعد مستخدماً
- ✅ حذف `.doc-table` - لم يعد مستخدماً
- ✅ حذف `.doc-table div` - لم يعد مستخدماً

### 3. `src/components/templates/TemplatesView.jsx`

#### التغييرات:

**أ) تحديث البيانات الافتراضية:**
- ✅ إزالة `noPreview: true` من القالب الثالث
- ✅ الآن جميع القوالب متساوية، ستعرض "no-preview" افتراضياً

## كيفية استخدام الصور المصغرة

### في المستقبل، لإضافة صورة مصغرة لقالب:

```javascript
const templateWithThumbnail = {
    id: 1,
    name: 'نموذج عقد عمل',
    fileName: 'نموذج عقد عمل.docx',
    fileType: 'DOCX',
    thumbnailPath: '/path/to/thumbnail.png'  // ← أضف هذا
};
```

أو:

```javascript
const templateWithThumbnail = {
    id: 1,
    name: 'نموذج عقد عمل',
    fileName: 'نموذج عقد عمل.docx',
    fileType: 'DOCX',
    thumbnail: 'data:image/png;base64,...'  // ← أو استخدم base64
};
```

## المزايا

### ✅ كود أنظف وأبسط:
- إزالة 60+ سطر من الكود غير الضروري
- منطق واحد واضح بدلاً من 3 أنواع معاينات مختلفة

### ✅ أداء أفضل:
- عدم رسم عناصر DOM غير ضرورية (الخطوط والمربعات)
- تحميل أسرع للصفحة

### ✅ مظهر احترافي موحد:
- جميع القوالب تبدو متسقة
- رسالة واضحة للمستخدم: "لا توجد معاينة متاحة"

### ✅ جاهز للمستقبل:
- بمجرد إضافة `thumbnailPath` → ستظهر الصورة تلقائياً
- لا يحتاج لتغيير في الكود

### ✅ صيانة أسهل:
- CSS أقل = أخطاء أقل
- منطق واحد بدلاً من تفرعات متعددة

## مثال على الاستخدام المستقبلي

### عند توليد صور مصغرة من Electron:

```javascript
// في electron/ipc/thumbnail-handlers.js
const generateThumbnail = async (filePath) => {
    // توليد صورة مصغرة من الملف
    const thumbnail = await someThumbnailLibrary.generate(filePath);
    return {
        success: true,
        thumbnailPath: thumbnail.path
    };
};

// في TemplatesView.jsx عند إضافة قالب
const handleAddTemplate = async (templateData) => {
    // توليد صورة مصغرة
    const thumbnailResult = await window.electron.generateThumbnail(
        templateData.filePath
    );
    
    const newTemplate = {
        ...templateData,
        thumbnailPath: thumbnailResult.thumbnailPath,  // ← الصورة المصغرة
        createdAt: new Date().toISOString()
    };
    
    // حفظ القالب مع الصورة المصغرة
    // ...
};
```

## الحالة الحالية

**الآن:**
- ✅ جميع القوالب تعرض "no-preview" بشكل افتراضي
- ✅ نظيف وموحد ومرتب
- ✅ جاهز لإضافة صور مصغرة حقيقية

**في المستقبل:**
- 📸 إضافة مكتبة توليد صور مصغرة في Electron
- 📸 حفظ مسارات الصور المصغرة مع القوالب
- 📸 الكروت ستعرض الصور تلقائياً بدون تغيير الكود

## الخلاصة

تم تبسيط معاينة القوالب بشكل كامل:

- **قبل**: معاينات مزيفة معقدة بـ 3 أنواع مختلفة
- **بعد**: no-preview واحد بسيط للجميع
- **المستقبل**: صور مصغرة حقيقية عند توفرها

الكود الآن أنظف، أسرع، وأسهل في الصيانة! 🎨✨
