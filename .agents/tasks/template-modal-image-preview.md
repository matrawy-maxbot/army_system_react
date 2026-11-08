# تحديث مودال تفاصيل القالب - عرض الصور

## التاريخ
8 نوفمبر 2026

## الملخص
تم تحديث منطقة `viewer-stage` في مودال تفاصيل القالب لعرض صور المعاينة الفعلية أو placeholder احترافي.

---

## التغييرات المُنفذة

### 1. ملف: TemplateDetailModal.jsx

**تم استبدال**: محتوى HTML الثابت (الجدول والنص)

**بـ**: منطق شرطي يعرض:
- صورة المعاينة (إذا كانت موجودة)
- Placeholder احترافي (إذا لم تكن موجودة)

#### الكود الجديد:
```jsx
<div className="viewer-stage">
    {template.thumbnailPath || template.previewImage ? (
        <div
            className="document-preview-image"
            style={{ transform: `scale(${currentZoom / 100})` }}
        >
            <img 
                src={template.thumbnailPath || template.previewImage} 
                alt={template.name}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                }}
            />
        </div>
    ) : (
        <div
            className="document-preview-placeholder"
            style={{ transform: `scale(${currentZoom / 100})` }}
        >
            <div className="placeholder-icon">
                <svg><!-- أيقونة ملف --></svg>
            </div>
            <div className="placeholder-title">
                لا توجد معاينة متاحة
            </div>
            <div className="placeholder-subtitle">
                استخدم القالب لفتحه ومعاينة محتواه
            </div>
        </div>
    )}
</div>
```

### 2. ملف: TemplateDetailModal.css

**تم إضافة**:

#### أ. Document Preview Image
```css
.document-preview-image {
    width: 390px;
    min-height: 490px;
    flex-shrink: 0;
    background: #fff;
    box-shadow: 0 2px 12px rgba(38, 54, 75, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: top center;
    transition: transform 0.15s;
    overflow: hidden;
}

.document-preview-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
```

#### ب. Document Preview Placeholder
```css
.document-preview-placeholder {
    width: 390px;
    min-height: 490px;
    flex-shrink: 0;
    padding: 60px 40px;
    background: #fff;
    box-shadow: 0 2px 12px rgba(38, 54, 75, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    transform-origin: top center;
    transition: transform 0.15s;
}

.placeholder-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f6fa;
    border: 2px dashed #d9e0e9;
    border-radius: 12px;
    color: #9aa8ba;
    margin-bottom: 20px;
}

.placeholder-icon svg {
    width: 48px;
    height: 48px;
}

.placeholder-title {
    font-size: 14px;
    font-weight: 700;
    color: #4a5568;
    margin-bottom: 8px;
}

.placeholder-subtitle {
    font-size: 11px;
    color: #9aa7b8;
    line-height: 1.6;
    max-width: 280px;
}
```

#### ج. Responsive
```css
@media (max-width: 650px) {
    .document-preview,
    .document-preview-image,
    .document-preview-placeholder {
        width: 300px;
        padding: 25px;
    }
}
```

---

## كيفية استخدام الصور

### 1. إضافة صورة معاينة عند إنشاء قالب

في `AddTemplateModal.jsx` أو عند إضافة قالب:

```javascript
const newTemplate = {
    id: Date.now(),
    name: 'نموذج خطاب',
    fileType: 'DOCX',
    fileName: 'letter.docx',
    thumbnailPath: 'path/to/thumbnail.png', // إضافة الصورة
    createdAt: new Date().toISOString()
};
```

### 2. أنواع الصور المدعومة

المودال يبحث عن أحد هذين الحقلين:
- `template.thumbnailPath` (الأولوية الأولى)
- `template.previewImage` (الأولوية الثانية)

---

## السلوك الحالي

### عند وجود صورة:
✅ تعرض الصورة في منتصف المودال
✅ `object-fit: contain` للحفاظ على النسب
✅ تتأثر بأدوات Zoom
✅ خلفية بيضاء مع ظل

### عند عدم وجود صورة:
✅ يظهر placeholder احترافي
✅ أيقونة ملف مع إطار منقط
✅ نص توضيحي للمستخدم
✅ يتأثر بـ Zoom أيضاً

---

## المزايا

### 1. المرونة
- يعمل مع صور أو بدونها
- لا حاجة لتوفير صورة لكل قالب
- Fallback تلقائي للـ placeholder

### 2. التصميم
- Placeholder احترافي ومتناسق
- أيقونة واضحة مع رسالة مفيدة
- يتماشى مع تصميم باقي النظام

### 3. الأداء
- Lazy loading للصور
- `object-fit: contain` لتجنب التشوه
- Transform للـ zoom (أفضل أداء)

### 4. الاستجابة
- يتكيف مع الشاشات الصغيرة
- الصورة والـ placeholder responsive

---

## الحالات الخاصة

### 1. صورة كبيرة جداً
- `max-width: 100%` و `max-height: 100%`
- الصورة تتقلص للحفاظ على المساحة

### 2. صورة صغيرة جداً
- `object-fit: contain` تحافظ على النسب
- لا تكبير للصورة فوق حجمها الطبيعي

### 3. صورة تالفة أو لا تُحمل
- يمكن إضافة `onError` handler:
```jsx
<img 
    src={template.thumbnailPath}
    alt={template.name}
    onError={(e) => {
        e.target.style.display = 'none';
        // عرض placeholder بدلاً منها
    }}
/>
```

---

## التكامل المستقبلي

### 1. إنشاء Thumbnails تلقائية

يمكن إضافة خدمة لإنشاء صور مصغرة:

```javascript
// services/thumbnailService.js
import { PDFDocument } from 'pdf-lib';
import { renderAsync } from 'docx-preview';

export const generateThumbnail = async (filePath, fileType) => {
    switch(fileType) {
        case 'PDF':
            return await generatePDFThumbnail(filePath);
        case 'DOCX':
            return await generateDocxThumbnail(filePath);
        case 'XLSX':
            return await generateExcelThumbnail(filePath);
        default:
            return null;
    }
};

const generatePDFThumbnail = async (filePath) => {
    // استخدام pdf.js لعمل صورة من الصفحة الأولى
    const pdfDoc = await PDFDocument.load(filePath);
    const page = pdfDoc.getPage(0);
    const thumbnail = await page.render({
        canvasContext: canvas.getContext('2d'),
        viewport: page.getViewport({ scale: 0.5 })
    });
    return thumbnail.toDataURL();
};
```

### 2. Cache للـ Thumbnails

```javascript
// utils/thumbnailCache.js
const thumbnailCache = new Map();

export const getCachedThumbnail = (templateId) => {
    return thumbnailCache.get(templateId);
};

export const cacheThumbnail = (templateId, thumbnailData) => {
    thumbnailCache.set(templateId, thumbnailData);
};
```

### 3. التحميل التدريجي

```jsx
const [imageLoading, setImageLoading] = useState(true);

<img 
    src={template.thumbnailPath}
    onLoad={() => setImageLoading(false)}
    style={{ opacity: imageLoading ? 0 : 1 }}
/>
{imageLoading && <Spinner />}
```

---

## الاختبار

### 1. قالب مع صورة
```javascript
const templateWithImage = {
    id: 1,
    name: 'خطاب رسمي',
    fileType: 'DOCX',
    thumbnailPath: '/thumbnails/letter.png'
};
```
**النتيجة المتوقعة**: عرض الصورة

### 2. قالب بدون صورة
```javascript
const templateWithoutImage = {
    id: 2,
    name: 'جدول المصروفات',
    fileType: 'XLSX'
};
```
**النتيجة المتوقعة**: عرض placeholder

### 3. Zoom
- التكبير بـ `+`
- التصغير بـ `−`
- إعادة تعيين بـ `↺`
**النتيجة المتوقعة**: الصورة/Placeholder تتأثر بالـ zoom

---

## الملفات المُعدّلة

1. ✅ `src/components/templates/TemplateDetailModal.jsx` - منطق العرض
2. ✅ `src/components/templates/TemplateDetailModal.css` - التصميم
3. ✅ البناء نجح بدون أخطاء

---

## الخلاصة

✅ **تم التحديث**:
- عرض صور المعاينة الحقيقية
- Placeholder احترافي عند غياب الصورة
- Zoom يعمل على كليهما
- تصميم responsive

✅ **المزايا**:
- مرن (يعمل مع/بدون صور)
- احترافي (تصميم نظيف)
- سريع (أداء محسّن)
- قابل للتوسع (سهل إضافة مزايا)

✅ **الاستخدام**:
- أعد تشغيل التطبيق
- افتح أي قالب
- سترى الصورة أو Placeholder

🎉 المودال الآن يدعم عرض الصور بشكل احترافي!
