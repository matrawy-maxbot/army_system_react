# تنفيذ مودال تفاصيل القالب

## التاريخ
8 نوفمبر 2026

## الملخص
تم إنشاء مودال تفاصيل القالب بنفس التصميم المطلوب من الكود HTML المرجعي. المودال يفتح عند الضغط على كارت القالب ويعرض تفاصيل القالب ومعاينة للمستند.

## الملفات المُنشأة

### 1. TemplateDetailModal.jsx
**المسار**: `src/components/templates/TemplateDetailModal.jsx`

مكون React رئيسي للمودال يتضمن:
- **Header**: عنوان المودال مع اسم القالب ونوع الملف
- **Sidebar**: تفاصيل القالب (النوع، الحجم، التاريخ، الحالة)
- **Document Viewer**: معاينة المستند مع أدوات التحكم (Zoom, Pagination)
- **Actions**: أزرار استخدام القالب وتنزيل الملف

**المزايا**:
- إدارة حالة الـ zoom (60% - 150%)
- التنقل بين الصفحات (محاكاة 2 صفحات)
- إغلاق المودال بالضغط خارجه أو بزر Escape
- منع تمرير الصفحة الرئيسية عند فتح المودال

### 2. TemplateDetailModal.css
**المسار**: `src/components/templates/TemplateDetailModal.css`

ملف CSS مطابق 100% للتصميم المرجعي:

#### البنية الرئيسية
```
.template-modal-overlay        → طبقة الخلفية
  └── .template-modal          → المودال الرئيسي
      ├── .template-modal-header    → الهيدر
      └── .template-modal-body      → المحتوى
          ├── .template-details     → الشريط الجانبي
          │   ├── .details-label
          │   ├── .details-description
          │   ├── .details-list
          │   ├── .details-note
          │   └── .details-actions
          └── .template-viewer      → عارض المستند
              ├── .viewer-toolbar
              │   └── .zoom-controls
              ├── .viewer-stage
              │   └── .document-preview
              └── .viewer-footer
                  └── .page-controls
```

#### الأبعاد والقياسات
- **المودال**: `width: min(1050px, 100%)`, `height: min(660px, 95vh)`
- **الهيدر**: `height: 58px`
- **الشريط الجانبي**: `width: 285px`
- **عارض المستند**: `flex: 1`
- **معاينة المستند**: `width: 390px`, `min-height: 490px`

#### الألوان
- **خلفية الطبقة**: `rgba(28, 41, 59, 0.45)`
- **خلفية المودال**: `#fff`
- **الحدود**: `#e1e6ee`, `#e9edf2`
- **النصوص**: `#202c40`, `#65758b`, `#8794a7`
- **الأزرار الرئيسية**: `#3779ee` → `#2868d9` (hover)
- **الحالة النشطة**: `#1c9b72` + نقطة خضراء `#21a77a`

#### التفاعلية
- انتقالات سلسة `transition: 0.15s`
- تأثيرات hover على الأزرار
- تعطيل الأزرار (disabled) مع opacity
- backdrop-filter blur على الطبقة الخلفية

#### الاستجابة (Responsive)

**دون 650px**:
- تقليل padding
- تقليل عرض الشريط الجانبي (190px)
- تصغير معاينة المستند (300px)

**دون 450px**:
- تحويل التخطيط إلى عمودي
- الشريط الجانبي بعرض 100%
- إخفاء details-note
- الأزرار جنباً إلى جنب

## التعديلات على الملفات الموجودة

### 3. TemplatesView.jsx
**التعديلات**:

```javascript
// إضافة import
import TemplateDetailModal from './TemplateDetailModal';

// إضافة state جديدة
const [showDetailModal, setShowDetailModal] = useState(false);
const [selectedTemplate, setSelectedTemplate] = useState(null);

// تحديث handleOpenTemplate
const handleOpenTemplate = (template) => {
    setSelectedTemplate(template);
    setShowDetailModal(true);
};

// إضافة handlers جديدة
const handleUseTemplate = (template) => {
    alert('سيتم فتح القالب للاستخدام: ' + template.name);
};

const handleDownloadTemplate = (template) => {
    alert('سيتم تنزيل القالب: ' + template.name);
};

// إضافة المودال في JSX
<TemplateDetailModal
    template={selectedTemplate}
    isOpen={showDetailModal}
    onClose={() => {
        setShowDetailModal(false);
        setSelectedTemplate(null);
    }}
    onUseTemplate={handleUseTemplate}
    onDownloadTemplate={handleDownloadTemplate}
/>
```

### 4. index.js
**التعديل**: إضافة export للمودال الجديد
```javascript
export { default as TemplateDetailModal } from './TemplateDetailModal';
```

## كيفية الاستخدام

### 1. فتح المودال
- اضغط على أي كارت قالب في صفحة القوالب
- سيُفتح المودال تلقائياً مع تفاصيل القالب المحدد

### 2. التحكم في العرض
- **Zoom In**: زر `+` لتكبير المعاينة
- **Zoom Out**: زر `−` لتصغير المعاينة
- **Reset**: زر `↺` لإعادة التعيين إلى 100%
- **Next Page**: زر "التالي" للصفحة التالية
- **Previous Page**: زر "السابق" للصفحة السابقة

### 3. الإجراءات المتاحة
- **استخدام القالب**: يفتح القالب للتعديل (alert حالياً)
- **تنزيل الملف**: يحمّل الملف (alert حالياً)

### 4. إغلاق المودال
- زر `×` في الهيدر
- الضغط خارج المودال
- زر `Escape` من لوحة المفاتيح

## التكامل المستقبلي

### 1. معاينة حقيقية للمستندات
يمكن استبدال محتوى `.document-preview` بمعاينة حقيقية:
```javascript
// استخدام مكتبة مثل react-pdf أو docx-preview
import { Document, Page } from 'react-pdf';

<Document file={template.filePath}>
    <Page pageNumber={currentPage} scale={currentZoom / 100} />
</Document>
```

### 2. فتح الملف الفعلي
```javascript
const handleUseTemplate = async (template) => {
    try {
        await electronAPI.openFile(template.filePath);
    } catch (error) {
        console.error('Error opening template:', error);
    }
};
```

### 3. تنزيل الملف
```javascript
const handleDownloadTemplate = async (template) => {
    try {
        await electronAPI.saveFileDialog(template.filePath, template.fileName);
    } catch (error) {
        console.error('Error downloading template:', error);
    }
};
```

### 4. عدد الصفحات الديناميكي
```javascript
const [totalPages, setTotalPages] = useState(1);

useEffect(() => {
    // جلب عدد الصفحات من الملف الفعلي
    const fetchPageCount = async () => {
        const count = await getDocumentPageCount(template.filePath);
        setTotalPages(count);
    };
    
    if (template?.filePath) {
        fetchPageCount();
    }
}, [template]);
```

### 5. حجم الملف الحقيقي
```javascript
const formatFileSize = async (filePath) => {
    const stats = await fs.stat(filePath);
    const bytes = stats.size;
    
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
```

## التحقق من البناء

تم التحقق من البناء بنجاح:
```bash
npm run build
✓ 181 modules transformed.
✓ built in 38.31s
```

## الخلاصة

تم إنشاء مودال تفاصيل القالب بنجاح بنفس التصميم المطلوب تماماً:

✅ **البنية**: مطابقة 100% للكود المرجعي  
✅ **التصميم**: جميع الألوان والأبعاد والمسافات مطابقة  
✅ **التفاعلية**: Zoom، التنقل بين الصفحات، Escape للإغلاق  
✅ **الاستجابة**: يعمل على جميع أحجام الشاشات  
✅ **التكامل**: متكامل مع نظام القوالب الموجود  
✅ **البناء**: لا توجد أخطاء في البناء  

يمكنك الآن الضغط على أي كارت قالب لرؤية المودال بالتصميم المطلوب!
