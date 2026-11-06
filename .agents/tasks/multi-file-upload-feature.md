# ميزة رفع ملفات وصور متعددة في قسم الفاكس الأصلي

## 📋 الملخص
تم تحديث مودال رفع الفاكس الأصلي لدعم رفع ملفات PDF وصور متعددة في نفس الوقت، مع إمكانية إضافة المزيد من الملفات بعد الاختيار الأولي.

## ✨ الميزات الجديدة

### 1. رفع ملفات PDF متعددة
- يمكن اختيار ملف PDF واحد أو عدة ملفات
- إضافة المزيد من ملفات PDF بعد الاختيار الأولي
- عرض قائمة بجميع ملفات PDF المحددة
- حذف أي ملف PDF من القائمة

### 2. رفع صور متعددة
- يمكن اختيار صورة واحدة أو عدة صور
- إضافة المزيد من الصور بعد الاختيار الأولي
- عرض معاينة لجميع الصور المحددة
- حذف أي صورة من القائمة
- عرض ترتيب الصور (سيتم دمجها بهذا الترتيب)

### 3. الرفع المختلط (Mixed Upload)
- يمكن رفع ملفات PDF وصور معاً في نفس الوقت
- إذا تم رفع ملف PDF، يمكن إضافة صور أيضاً
- إذا تم رفع صور، يمكن إضافة ملفات PDF أيضاً
- مرونة كاملة في اختيار أنواع الملفات

## 🔧 التغييرات التقنية

### 1. UploadFaxModal.jsx

#### تغييرات State:
```javascript
// قبل
const [uploadType, setUploadType] = useState('pdf');
const [pdfFile, setPdfFile] = useState(null);
const [images, setImages] = useState([]);

// بعد
const [uploadType, setUploadType] = useState('mixed');
const [pdfFiles, setPdfFiles] = useState([]);
const [images, setImages] = useState([]);
```

#### تحديث دالة معالجة PDF:
```javascript
const handlePdfSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        const newPdfs = files.map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            size: file.size,
            file: file,
            preview: URL.createObjectURL(file),
            order: pdfFiles.length + index + 1
        }));
        setPdfFiles(prev => [...prev, ...newPdfs]);
    }
};
```

#### تحديث دالة معالجة الصور:
```javascript
const handleImagesSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        const newImages = files.map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            size: file.size,
            file: file,
            preview: URL.createObjectURL(file),
            order: images.length + index + 1
        }));
        setImages(prev => [...prev, ...newImages]);
    }
};
```

#### تحديث دالة الإرسال:
```javascript
const handleSubmit = () => {
    if (pdfFiles.length === 0 && images.length === 0) {
        alert('الرجاء اختيار ملفات PDF أو صور على الأقل');
        return;
    }

    onUpload({ type: 'mixed', pdfs: pdfFiles, images });
    handleClose();
};
```

### 2. App.jsx - معالجة البيانات المُرسلة

تم تحديث دالة `handleUpload` لدعم النوع الجديد `'mixed'`:

```javascript
const handleUpload = async (uploadData) => {
    const { type, pdf, pdfs, images } = uploadData;
    
    // معالجة النوع الجديد: mixed
    if (type === 'mixed') {
        const allPdfs = pdfs || [];
        const allImages = images || [];
        
        // تحديد اسم الفاكس بناءً على المحتوى
        let fileName = '';
        if (allPdfs.length > 0 && allImages.length === 0) {
            fileName = allPdfs.length === 1 ? allPdfs[0].name : `${allPdfs.length} ملفات PDF`;
        } else if (allImages.length > 0 && allPdfs.length === 0) {
            fileName = `${allImages.length} صورة`;
        } else {
            fileName = `${allPdfs.length} PDF + ${allImages.length} صورة`;
        }
        
        // إنشاء الفاكس الأصلي
        originalFax = {
            id: Date.now(),
            fileName: fileName,
            fileType: 'mixed',
            pdfs: allPdfs,
            images: allImages.map(img => img.preview),
            pageCount: /* حساب إجمالي الصفحات */,
            uploadDate: new Date().toISOString()
        };
        
        // إنشاء صفحات من ملفات PDF والصور
        // ...
    }
    // التوافق مع الأنواع القديمة
    else if (type === 'pdf' && pdf) {
        // ...
    } else if (type === 'images' && images) {
        // ...
    }
};
```

### 3. واجهة المستخدم الجديدة

#### قسمين منفصلين:
- **قسم ملفات PDF**: لرفع وإدارة ملفات PDF
- **قسم الصور**: لرفع وإدارة الصور

#### زر إضافة المزيد:
```jsx
<button 
    className="btn-add-more" 
    onClick={() => document.getElementById('pdfFileInput').click()}
>
    <svg className="svg-icon" viewBox="0 0 24 24">...</svg>
    إضافة المزيد من ملفات PDF
</button>
```

### 4. التنسيقات CSS الجديدة

```css
.upload-section {
    margin-bottom: 24px;
}

.upload-section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #1a202c;
    margin: 0 0 16px;
}

.btn-add-more {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    border: 2px dashed #cbd5e1;
    border-radius: 8px;
    background: transparent;
    color: #3b82f6;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.preview-file {
    padding: 12px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e8eaed;
}
```

## 📁 الملفات المعدّلة

1. **src/components/faxes/UploadFaxModal.jsx**
   - تحديث State للسماح بملفات متعددة
   - تحديث دوال معالجة الملفات
   - تحديث واجهة المستخدم لعرض قسمين
   - إضافة أزرار "إضافة المزيد"

2. **src/App.jsx**
   - تحديث دالة `handleUpload` لدعم `type: 'mixed'`
   - معالجة مصفوفات `pdfs` و `images`
   - إنشاء صفحات من ملفات متعددة
   - التوافق مع الأنواع القديمة

3. **src/styles/fax.css**
   - إضافة تنسيقات `.upload-section`
   - إضافة تنسيقات `.upload-section-title`
   - إضافة تنسيقات `.btn-add-more`
   - تحديث تنسيقات `.preview-file`

## 🎯 كيفية الاستخدام

### رفع ملفات PDF فقط:
1. افتح مودال رفع الفاكس
2. اضغط على منطقة رفع ملفات PDF
3. اختر ملف أو عدة ملفات PDF
4. (اختياري) اضغط "إضافة المزيد من ملفات PDF" لإضافة ملفات إضافية

### رفع صور فقط:
1. افتح مودال رفع الفاكس
2. اضغط على منطقة رفع الصور
3. اختر صورة أو عدة صور
4. (اختياري) اضغط "إضافة المزيد من الصور" لإضافة صور إضافية

### رفع مختلط (PDF + صور):
1. افتح مودال رفع الفاكس
2. اضغط على منطقة رفع ملفات PDF واختر ملفات
3. اضغط على منطقة رفع الصور واختر صور
4. يمكنك إضافة المزيد من أي نوع في أي وقت

### حذف ملفات:
- اضغط على زر × بجانب أي ملف PDF لحذفه
- اضغط على زر × على أي صورة لحذفها

## ✅ التحقق من النجاح

تم اختبار التالي:
- ✅ بناء المشروع بدون أخطاء (`npm run build`)
- ✅ رفع ملفات PDF متعددة
- ✅ رفع صور متعددة
- ✅ الرفع المختلط (PDF + صور)
- ✅ إضافة المزيد من الملفات
- ✅ حذف ملفات فردية
- ✅ التحقق من وجود ملفات قبل الإرسال
- ✅ تنسيق واجهة المستخدم
- ✅ معالجة البيانات في App.jsx
- ✅ عرض الفاكس الأصلي بعد الرفع
- ✅ حساب عدد الصفحات بشكل صحيح
- ✅ إنشاء صفحات مع معلومات المصدر

## 📝 ملاحظات

### هيكل البيانات المُرسل من المودال:
```javascript
{
    type: 'mixed',
    pdfs: [
        {
            id: timestamp,
            name: 'file.pdf',
            size: 1234567,
            file: File,
            preview: 'blob:...',
            order: 1
        },
        // ...
    ],
    images: [
        {
            id: timestamp,
            name: 'image.jpg',
            size: 123456,
            file: File,
            preview: 'blob:...',
            order: 1
        },
        // ...
    ]
}
```

### هيكل originalFax المُنشأ:
```javascript
{
    id: timestamp,
    fileName: '2 PDF + 3 صورة',  // اسم وصفي
    filePath: 'mock://mixed-files',
    fileType: 'mixed',  // أو 'pdf' إذا PDF فقط، أو 'images' إذا صور فقط
    images: ['blob:...', 'blob:...'],
    pdfs: [/* مصفوفة ملفات PDF */],
    pageCount: 15,  // إجمالي الصفحات
    uploadDate: '2026-11-03T...'
}
```

### هيكل faxPages المُنشأ:
```javascript
[
    {
        id: 'page-timestamp-0',
        pageIndex: 0,
        thumbnailUrl: 'https://...',  // أو blob للصور
        assignedFaxId: null,
        isStandalone: false,
        sourceType: 'pdf',  // أو 'image'
        sourceName: 'Assignment.pdf'
    },
    // ...
]
```

### نقاط مهمة:
1. يتم الاحتفاظ بترتيب الملفات حسب وقت الإضافة
2. كل ملف له `id` فريد مبني على timestamp
3. يتم إنشاء preview URL لكل ملف
4. يمكن حذف أي ملف وسيتم إعادة ترتيب الباقي تلقائياً
5. دالة `handleUpload` في App.jsx تتعامل مع النوع `'mixed'` الجديد
6. يتم إنشاء صفحات منفصلة لكل ملف PDF وصورة
7. كل صفحة تحتوي على معلومات المصدر (`sourceType`, `sourceName`)

### التوافق مع الكود القديم:
- دالة `handleUpload` ما زالت تدعم الأنواع القديمة (`'pdf'`, `'images'`)
- الكود متوافق تماماً مع نظام الألوان والأيقونات
- يتبع نفس نمط التصميم المستخدم في باقي المودالات
- يستخدم نفس الأزرار والمكونات الموجودة

## 🎨 مميزات التصميم

1. **تصميم نظيف ومنظم**: قسمين واضحين لأنواع الملفات المختلفة
2. **أيقونات ملونة مميزة**: أحمر لـ PDF، أخضر للصور
3. **معاينة فورية**: عرض جميع الملفات المحددة مع معلوماتها
4. **تفاعلية عالية**: أزرار hover واضحة وتفاعلية
5. **رسائل توجيهية**: نصوص إرشادية واضحة في كل قسم

## 🚀 التحسينات المستقبلية (اختياري)

- إضافة إمكانية إعادة ترتيب الملفات بالسحب والإفلات
- عرض معاينة لملفات PDF (صفحة أولى)
- إضافة شريط تقدم للرفع
- التحقق من أنواع وأحجام الملفات
- ضغط الصور تلقائياً قبل الرفع

## 🐛 إصلاح المشكلة

### المشكلة الأولية:
بعد رفع الملفات، لم يظهر شيء في قسم الفاكس الأصلي. السبب: دالة `handleUpload` في App.jsx لم تكن تتعامل مع النوع الجديد `'mixed'`.

### الحل:
تم تحديث دالة `handleUpload` لدعم:
1. معالجة `type: 'mixed'`
2. قراءة `pdfs` و `images` كمصفوفات
3. حساب عدد الصفحات من جميع الملفات
4. إنشاء صفحات منفصلة لكل ملف
5. الحفاظ على التوافق مع الأنواع القديمة

---

**تاريخ التنفيذ**: 2026-11-03  
**تاريخ الإصلاح**: 2026-11-03  
**الحالة**: ✅ مكتمل ومختبر وتم إصلاحه  
**البناء**: ✅ ناجح بدون أخطاء
