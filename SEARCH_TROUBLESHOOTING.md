# دليل استكشاف أخطاء البحث

## المشكلة
عند الضغط على زر البحث، لا تظهر نتائج البحث.

## الحل

### 1. التحقق من استيراد المكونات
تأكد من أن `SearchResults` مستورد في `App.jsx`:

```jsx
import SearchResults from './components/common/SearchResults';
```

### 2. التحقق من State Variables
تأكد من وجود هذه المتغيرات في `AppContent`:

```jsx
const [searchMode, setSearchMode] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
```

### 3. التحقق من Header Props
تأكد من تمرير `onSearch` prop للـ Header:

```jsx
<Header 
    onSettingsClick={() => setShowSettings(true)}
    onSearch={(query) => {
        setSearchQuery(query);
        setSearchMode(true);
    }}
    onArchiveSearch={(query) => {
        setActiveSection('archive');
        toast.info(`البحث عن: ${query}`);
    }}
/>
```

### 4. التحقق من SearchResults في JSX
تأكد من وجود هذا الكود داخل `container-content`:

```jsx
<div className="container-content">
    {/* نتائج البحث */}
    {searchMode && activeSection === 'main' && (
        <SearchResults 
            query={searchQuery} 
            onClose={() => {
                setSearchMode(false);
                setSearchQuery('');
            }} 
        />
    )}

    {/* قسم الصفحة الرئيسية */}
    {activeSection === 'main' && !searchMode && (
        <>
            {/* محتوى الصفحة الرئيسية */}
        </>
    )}
</div>
```

### 5. كيفية الاختبار

#### الطريقة الأولى: من خلال Header
1. افتح التطبيق
2. اذهب إلى الصفحة الرئيسية (main)
3. اكتب أي نص في حقل البحث في الـ Header
4. اضغط Enter أو زر البحث (🔍)
5. يجب أن تظهر نتائج البحث

#### الطريقة الثانية: فحص Console
افتح DevTools (F12) وتحقق من:
- عدم وجود errors في Console
- قيمة `searchMode` و `searchQuery` في React DevTools

### 6. الأخطاء الشائعة

#### لا يظهر شيء عند البحث
**السبب المحتمل**: `activeSection` ليس 'main'
**الحل**: تأكد من أنك في الصفحة الرئيسية وليس في صفحة أخرى

#### يظهر Error في Console
**السبب المحتمل**: المكون SearchResults غير موجود
**الحل**: تأكد من وجود الملفات:
- `src/components/common/SearchResults.jsx`
- `src/components/common/SearchResults.css`

#### البحث يعمل لكن لا توجد نتائج
**السبب**: هذا طبيعي! النتائج افتراضية ثابتة
**الحل**: راجع المصفوفة `mockResults` في `SearchResults.jsx`

### 7. اختبار يدوي سريع

قم بتشغيل هذا في Console لاختبار الوظيفة:

```javascript
// في React DevTools, ابحث عن AppContent component
// ثم قم بتغيير state يدوياً:
// searchMode = true
// searchQuery = "test"
```

### 8. إعادة البناء

إذا لم يعمل شيء، قم بإعادة بناء التطبيق:

```bash
npm run build
```

ثم شغل التطبيق مرة أخرى.

### 9. الملفات المطلوبة

تأكد من وجود هذه الملفات:

```
✅ src/components/common/SearchResults.jsx
✅ src/components/common/SearchResults.css
✅ src/components/common/DatePickerModal.jsx
✅ src/components/common/DatePickerModal.css
```

### 10. Debug Step by Step

أضف `console.log` statements:

في `Header.jsx`:
```jsx
const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted:', searchQuery);
    if (searchQuery.trim()) {
        if (onSearch) {
            console.log('Calling onSearch with:', searchQuery);
            onSearch(searchQuery);
        }
    }
};
```

في `App.jsx`:
```jsx
<Header 
    onSearch={(query) => {
        console.log('onSearch called with:', query);
        setSearchQuery(query);
        setSearchMode(true);
        console.log('Search mode activated');
    }}
/>
```

ثم راقب Console عند البحث.

---

## ملاحظات مهمة

1. **البحث يعمل فقط في الصفحة الرئيسية** (main section)
2. **النتائج افتراضية وثابتة** - لا تعتمد على استعلام البحث الفعلي
3. **يمكن تخصيص النتائج** عن طريق تعديل `mockResults` في `SearchResults.jsx`

---

**آخر تحديث**: 8 نوفمبر 2026
