# دليل ميزة البحث في الصفحة الرئيسية

## نظرة عامة
تم إضافة ميزة البحث الذكي التي تعرض نتائج البحث مباشرة في الصفحة الرئيسية بدلاً من التوجيه إلى صفحة الأرشيف.

## المكونات الجديدة

### 1. SearchResults Component
**الملف**: `src/components/common/SearchResults.jsx`

مكون لعرض نتائج البحث مع:
- عرض استعلام البحث وعدد النتائج
- قائمة النتائج مع تفاصيل كاملة (النوع، التاريخ، الحالة)
- أيقونات مميزة لكل نوع (فاكس، رد، ملف، تذكير)
- حالات ملونة (مكتمل، مسودة، قيد المعالجة، إلخ)
- زر للعودة للصفحة الرئيسية
- رسالة "لا توجد نتائج" عند عدم وجود نتائج

### 2. SearchResults Styles
**الملف**: `src/components/common/SearchResults.css`

تصميم احترافي وعصري مع:
- تأثيرات hover وانتقالات سلسة
- بطاقات نتائج قابلة للنقر
- تصميم responsive للشاشات الصغيرة
- ألوان متناسقة مع نظام التصميم

## كيفية الاستخدام

### في MainPage.jsx

```jsx
import SearchResults from '../components/common/SearchResults';

const [searchMode, setSearchMode] = useState(false);
const [searchQuery, setSearchQuery] = useState('');

// عند الضغط على زر البحث
const handleArchiveSearchClick = () => {
    const demoQuery = 'فاكس'; // يمكن استبداله باستعلام حقيقي
    setSearchQuery(demoQuery);
    setSearchMode(true);
};

// العودة للصفحة الرئيسية
const handleCloseSearch = () => {
    setSearchMode(false);
    setSearchQuery('');
};

// عرض نتائج البحث
if (searchMode) {
    return (
        <main className="page">
            <header className="topbar">
                {/* Header content */}
            </header>
            <SearchResults query={searchQuery} onClose={handleCloseSearch} />
        </main>
    );
}
```

## البيانات التجريبية

المكون يحتوي على 7 نتائج تجريبية افتراضية:
1. فاكس من وزارة الدفاع
2. رد على فاكس القيادة العامة
3. تقرير التدريب الشهري
4. فاكس طلب معدات
5. تذكير: اجتماع اللجنة
6. قائمة المتدربين
7. فاكس من قيادة المنطقة

## أنواع النتائج المدعومة

- **فاكس** (fax): 📄
- **رد** (reply): 📝
- **ملف** (file): 📁
- **تذكير** (reminder): 🔔

## حالات النتائج

- **مكتمل** (success): خلفية خضراء
- **مسودة** (draft): خلفية صفراء
- **قيد المعالجة** (processing): خلفية زرقاء
- **نشط** (active): خلفية بنفسجية
- **مؤرشف** (archived): خلفية رمادية

## التكامل مع Header Component

تم تحديث Header.jsx لدعم البحث:

```jsx
function Header({ onSearch }) {
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            if (onSearch) {
                onSearch(searchQuery);
            }
        }
    };
}
```

## خطوات التطوير المستقبلية

1. **ربط البيانات الحقيقية**: استبدال `mockResults` ببيانات حقيقية من API أو state management
2. **فلترة متقدمة**: إضافة فلاتر حسب النوع والتاريخ والحالة
3. **ترتيب النتائج**: إضافة خيارات ترتيب (الأحدث، الأقدم، الأكثر صلة)
4. **تمييز الكلمات المطابقة**: تمييز الكلمات المطابقة في النتائج
5. **pagination**: إضافة ترقيم الصفحات للنتائج الكثيرة
6. **حفظ البحث**: حفظ استعلامات البحث المتكررة

## الملفات المعدلة

1. ✅ `src/components/common/SearchResults.jsx` - جديد
2. ✅ `src/components/common/SearchResults.css` - جديد
3. ✅ `src/pages/MainPage.jsx` - محدث
4. ✅ `src/components/layout/Header.jsx` - محدث
5. ✅ `src/components/common/DatePickerModal.jsx` - جديد
6. ✅ `src/components/common/DatePickerModal.css` - جديد

## التوافق

- ✅ متوافق مع React 18+
- ✅ متوافق مع جميع المتصفحات الحديثة
- ✅ responsive تماماً
- ✅ يدعم RTL layout
- ✅ تم اختباره مع vite build

---

**آخر تحديث**: 8 نوفمبر 2026
