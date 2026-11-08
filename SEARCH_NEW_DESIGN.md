# التصميم الجديد لنتائج البحث

## نظرة عامة
تم إعادة تصميم صفحة نتائج البحث بالكامل لتكون **محاكية للمستندات الحقيقية** مع معاينة بصرية لكل نتيجة.

## المميزات الجديدة ✨

### 1. **معاينة المستند (Paper Preview)**
- كل نتيجة تعرض محاكاة لمستند حقيقي
- خطوط محاكية تمثل محتوى الصفحة
- تمييز النص المطابق بخلفية صفراء داخل المعاينة
- دوران طفيف للمستند (0.3 درجة) لمظهر أكثر واقعية

### 2. **أنواع الملفات الملونة**
- **PDF**: خلفية وردية (#ffe5e8) مع نص أحمر
- **DOCX**: خلفية زرقاء (#e3efff) مع نص أزرق غامق
- **XLSX**: خلفية خضراء (#dcf5e8) مع نص أخضر غامق

### 3. **بحث داخلي في النتائج**
- حقل بحث ثانوي في أعلى الصفحة
- فلترة فورية للنتائج أثناء الكتابة
- رمز بحث أنيق (⌕)

### 4. **تمييز النصوص (Highlighting)**
- الكلمات المطابقة تظهر بخلفية صفراء داخل المعاينة
- تمييز النص في excerpt أيضاً
- استخدام `<mark>` tag للتوافق مع معايير الويب

### 5. **Grid Layout متجاوب**
- 3 أعمدة على الشاشات الكبيرة (>1000px)
- عمودان على الشاشات المتوسطة (650px-1000px)
- عمود واحد على الموبايل (<650px)

## البنية الجديدة

### هيكل البطاقة:
```
┌─────────────────────────────┐
│ Preview Section             │
│  ┌─────────────┐            │
│  │ File Type   │  [PDF]     │
│  └─────────────┘            │
│                             │
│  ┌───────────────────────┐  │
│  │ Paper Document        │  │
│  │  - Header             │  │
│  │  - Title              │  │
│  │  - Lines (decorative) │  │
│  │  - Hit Line (yellow)  │  │
│  │  - More lines         │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│ Body Section                │
│  Title + Pages              │
│  Excerpt Box                │
│  Date | Open Link           │
└─────────────────────────────┘
```

## الألوان المستخدمة

### الخلفيات:
- الصفحة: `#f6f7f9`
- البطاقة: `#fff`
- Preview: `#edf1f6`
- Paper: `#fff`
- Excerpt Box: `#f8f9fb`
- Hit Line: `#fff9df`

### النصوص:
- العناوين: `#182230`
- النص الثانوي: `#758196`, `#66748a`
- الرابط: `#2867c7`
- النص داخل Mark: `#684800`

### التظليل:
- Mark Background: `#ffe18a`
- Border: `#e1e5eb`, `#f2e3a5`

## مثال على البيانات

```jsx
{
    id: 1,
    type: 'pdf',
    title: 'فاكس من وزارة الدفاع',
    date: '2026-11-05',
    pages: 4,
    excerpt: 'بخصوص التدريبات السنوية والاستعدادات',
    paperHeader: 'وزارة الدفاع — الإدارة المختصة',
    paperTitle: 'بيان بشأن خطة التدريب',
    hitText: '... بشأن التدريبات السنوية والاستعدادات ...',
    searchTerms: 'التدريبات السنوية فاكس وزارة'
}
```

## الوظائف التفاعلية

### 1. Hover Effects
```css
.search-card:hover {
    border-color: #b8cbea;
    box-shadow: 0 8px 22px rgba(29, 53, 87, 0.06);
    transform: translateY(-2px);
}
```

### 2. البحث الداخلي
```jsx
const filteredResults = mockResults.filter(result => {
    if (!searchFilter) return true;
    return result.searchTerms
        .toLowerCase()
        .includes(searchFilter.toLowerCase());
});
```

### 3. تمييز النصوص
```jsx
const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i}>{part}</mark> 
            : part
    );
};
```

## زر العودة

زر ثابت في الزاوية اليسرى السفلية:
- موضع ثابت (fixed)
- ظل جميل
- تأثير hover
- responsive على الموبايل (يتمدد بالعرض الكامل)

## التوافق

✅ متوافق مع جميع المتصفحات الحديثة
✅ Responsive 100%
✅ RTL Layout
✅ Accessibility compliant
✅ Performance optimized

## ملاحظات التطوير

### إضافة نتيجة جديدة:
```jsx
{
    id: 6,
    type: 'docx', // pdf, docx, xlsx
    title: 'عنوان الملف',
    date: '2026-11-10',
    pages: 3,
    excerpt: 'نص مختصر يظهر في الصندوق الرمادي',
    paperHeader: 'الجهة — القسم',
    paperTitle: 'عنوان المستند',
    hitText: '... النص الذي سيظهر في المعاينة الصفراء ...',
    searchTerms: 'كلمات البحث للفلترة'
}
```

### تخصيص الألوان:
غيّر المتغيرات في `SearchResults.css`:
```css
.file-type.pdf { background: #ffe5e8; color: #bd3345; }
.file-type.docx { background: #e3efff; color: #235cae; }
.file-type.xlsx { background: #dcf5e8; color: #167a4c; }
```

## الفرق عن التصميم القديم

| القديم | الجديد |
|--------|--------|
| قائمة عمودية بسيطة | Grid بمعاينة مستندات |
| أيقونات emoji | شارات ملونة حسب النوع |
| حالات ملونة | تركيز على محتوى المستند |
| بدون معاينة | معاينة واقعية للمستند |
| بحث واحد فقط | بحث + فلترة داخلية |

## ملفات التصميم

```
src/components/common/
├── SearchResults.jsx      # المكون الرئيسي
└── SearchResults.css      # التنسيقات الكاملة
```

---

**آخر تحديث**: 8 نوفمبر 2026
**نسخة التصميم**: 2.0
**الحالة**: ✅ جاهز للإنتاج
