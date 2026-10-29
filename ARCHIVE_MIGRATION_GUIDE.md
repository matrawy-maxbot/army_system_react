# دليل ترحيل نظام الأرشفة
# Archive System Migration Guide

---

## 📌 نظرة عامة

هذا الدليل يوضح كيفية الانتقال من نظام الفئات والمستندات الحالي إلى نظام الأرشفة الجديد.

---

## 🎯 الخيارات المتاحة

### الخيار 1: استخدام نظام الأرشفة بجانب النظام القديم (موصى به)

هذا الخيار يتيح لك تجربة النظام الجديد دون التأثير على البيانات الحالية.

#### الخطوات:

1. **إضافة رابط صفحة الأرشفة في التطبيق**

```jsx
// في App.jsx أو ملف التوجيه الرئيسي
import ArchivePage from './pages/ArchivePage';

// في قائمة التنقل، أضف:
<Link to="/archive">نظام الأرشفة</Link>

// في Routes:
<Route path="/archive" element={<ArchivePage />} />
```

2. **إنشاء بيانات تجريبية**

```javascript
import { createSampleArchiveData } from './utils/migrateToArchive';

// في أي مكان تريد إنشاء بيانات تجريبية
const sampleData = createSampleArchiveData();

setAppState({
  ...appState,
  archiveCategories: sampleData
});
await saveData();
```

3. **الوصول للنظامين معاً**

الآن يمكنك استخدام:
- النظام القديم: `/` أو `/categories`
- نظام الأرشفة: `/archive`

---

### الخيار 2: ترحيل البيانات الكاملة

ترحيل جميع الفئات والمستندات إلى نظام الأرشفة.

#### الخطوات:

1. **استيراد دالة الترحيل**

```javascript
import { migrateCategoriestoArchive } from './utils/migrateToArchive';
```

2. **تشغيل الترحيل**

```javascript
// في مكان مناسب (مثل useEffect في الصفحة الرئيسية)
useEffect(() => {
  const performMigration = async () => {
    // ترحيل البيانات
    const archiveCategories = migrateCategoriestoArchive(appState.categories);
    
    // حفظ البيانات الجديدة
    setAppState({
      ...appState,
      archiveCategories: archiveCategories
    });
    
    await saveData();
    
    console.log('تم ترحيل البيانات بنجاح!');
  };
  
  // تنفيذ الترحيل مرة واحدة فقط
  if (appState.categories.length > 0 && (!appState.archiveCategories || appState.archiveCategories.length === 0)) {
    performMigration();
  }
}, []);
```

3. **التحقق من نجاح الترحيل**

```javascript
import { validateArchiveStructure, getArchiveStats } from './utils/migrateToArchive';

// التحقق من صحة البنية
const isValid = validateArchiveStructure(appState.archiveCategories);
console.log('البنية صحيحة:', isValid);

// عرض الإحصائيات
const stats = getArchiveStats(appState.archiveCategories);
console.log('إحصائيات النظام:', stats);
/*
{
  totalCategories: 3,
  totalFolders: 5,
  totalFiles: 12,
  totalSize: 1024000
}
*/
```

---

### الخيار 3: الاستبدال الكامل

استبدال النظام القديم تماماً بنظام الأرشفة.

⚠️ **تحذير**: هذا الخيار يتطلب نسخ احتياطي من البيانات أولاً!

#### الخطوات:

1. **عمل نسخة احتياطية**

```javascript
// حفظ نسخة من البيانات القديمة
const backup = {
  categories: [...appState.categories],
  timestamp: new Date().toISOString()
};

localStorage.setItem('categories_backup', JSON.stringify(backup));
console.log('تم حفظ النسخة الاحتياطية');
```

2. **ترحيل البيانات**

```javascript
const archiveCategories = migrateCategoriestoArchive(appState.categories);
```

3. **استبدال الصفحة الرئيسية**

```jsx
// في App.jsx، استبدل:
// import HomePage from './pages/HomePage';
// بـ:
import ArchivePage from './pages/ArchivePage';

// وفي Routes:
<Route path="/" element={<ArchivePage />} />
```

4. **حذف النظام القديم (اختياري)**

بعد التأكد من استقرار النظام الجديد، يمكنك:
- حذف مجلد `src/components/categories`
- حذف مجلد `src/components/documents`
- إزالة `categories` من `AppStateContext`

---

## 🔄 مثال عملي كامل

### إنشاء صفحة ترحيل مخصصة

```jsx
// src/pages/MigrationPage.jsx
import { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { 
  migrateCategoriestoArchive, 
  getArchiveStats,
  validateArchiveStructure 
} from '../utils/migrateToArchive';
import Button from '../components/common/Button';

const MigrationPage = () => {
  const { appState, setAppState, saveData } = useAppState();
  const [migrationStatus, setMigrationStatus] = useState('idle'); // idle, running, success, error
  const [stats, setStats] = useState(null);

  const handleMigrate = async () => {
    setMigrationStatus('running');
    
    try {
      // 1. ترحيل البيانات
      const archiveCategories = migrateCategoriestoArchive(appState.categories);
      
      // 2. التحقق من صحة البنية
      const isValid = validateArchiveStructure(archiveCategories);
      if (!isValid) {
        throw new Error('البنية غير صحيحة');
      }
      
      // 3. حفظ البيانات
      const newState = {
        ...appState,
        archiveCategories: archiveCategories
      };
      
      setAppState(newState);
      await saveData(newState);
      
      // 4. عرض الإحصائيات
      const migrationStats = getArchiveStats(archiveCategories);
      setStats(migrationStats);
      
      setMigrationStatus('success');
    } catch (error) {
      console.error('خطأ في الترحيل:', error);
      setMigrationStatus('error');
    }
  };

  return (
    <div className="migration-page" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>ترحيل البيانات إلى نظام الأرشفة</h1>
      
      <div style={{ marginTop: '30px' }}>
        <h2>البيانات الحالية:</h2>
        <ul>
          <li>عدد الفئات: {appState.categories?.length || 0}</li>
          <li>عدد المستندات: {appState.categories?.reduce((sum, cat) => sum + (cat.documents?.length || 0), 0)}</li>
        </ul>
      </div>

      {migrationStatus === 'idle' && (
        <div style={{ marginTop: '30px' }}>
          <Button variant="primary" onClick={handleMigrate}>
            بدء الترحيل
          </Button>
        </div>
      )}

      {migrationStatus === 'running' && (
        <div style={{ marginTop: '30px', color: '#3b82f6' }}>
          جاري الترحيل...
        </div>
      )}

      {migrationStatus === 'success' && stats && (
        <div style={{ marginTop: '30px', padding: '20px', background: '#d1fae5', borderRadius: '8px' }}>
          <h3 style={{ color: '#10b981' }}>✓ تم الترحيل بنجاح!</h3>
          <h4>الإحصائيات:</h4>
          <ul>
            <li>فئات الأرشيف: {stats.totalCategories}</li>
            <li>إجمالي المجلدات: {stats.totalFolders}</li>
            <li>إجمالي الملفات: {stats.totalFiles}</li>
          </ul>
          <Button variant="primary" onClick={() => window.location.href = '/archive'}>
            انتقل إلى نظام الأرشفة
          </Button>
        </div>
      )}

      {migrationStatus === 'error' && (
        <div style={{ marginTop: '30px', padding: '20px', background: '#fee2e2', borderRadius: '8px' }}>
          <h3 style={{ color: '#ef4444' }}>✗ فشل الترحيل</h3>
          <p>الرجاء مراجعة console للمزيد من التفاصيل</p>
          <Button variant="secondary" onClick={() => setMigrationStatus('idle')}>
            إعادة المحاولة
          </Button>
        </div>
      )}
    </div>
  );
};

export default MigrationPage;
```

---

## 📊 مقارنة بين النظامين

| الميزة | النظام القديم | نظام الأرشفة |
|-------|---------------|---------------|
| مستويات التصنيف | 1 (فئات فقط) | 2 (فئات + مجلدات) |
| وصف العناصر | ❌ | ✅ |
| نقل بين الفئات | ❌ | ✅ |
| رفع ملفات متعددة | ❌ | ✅ |
| Drag & Drop | ❌ | ✅ |
| معلومات الملفات | محدودة | شاملة |
| طي/فتح الأقسام | ❌ | ✅ |

---

## 🐛 استكشاف الأخطاء

### المشكلة: البيانات لم تُحفظ

**الحل:**
```javascript
// تأكد من استدعاء saveData بعد تحديث الحالة
setAppState(newState);
await saveData(newState); // أو await saveData() فقط
```

### المشكلة: الترحيل فشل

**الحل:**
```javascript
// تحقق من صحة البيانات القديمة
console.log('Categories:', appState.categories);

// تحقق من وجود documents في كل فئة
appState.categories.forEach(cat => {
  console.log(`${cat.name}:`, cat.documents?.length || 0, 'documents');
});
```

### المشكلة: المجلدات فارغة بعد الترحيل

**السبب:** المستندات القديمة ليس لها ملفات مرتبطة

**الحل:**
تحقق من بنية المستندات القديمة وتأكد من وجود حقل `file` أو `originalFileName`

---

## 📝 ملاحظات مهمة

1. **النسخ الاحتياطي**: احفظ نسخة احتياطية قبل أي ترحيل
2. **الاختبار**: جرب النظام الجديد بجانب القديم أولاً
3. **التوثيق**: وثق أي تغييرات تجريها
4. **البيانات**: تأكد من صحة البيانات بعد الترحيل

---

## ✅ قائمة التحقق

- [ ] قراءة الدليل كاملاً
- [ ] عمل نسخة احتياطية من البيانات
- [ ] اختبار النظام الجديد بجانب القديم
- [ ] ترحيل البيانات
- [ ] التحقق من صحة البيانات المرحّلة
- [ ] اختبار جميع الوظائف
- [ ] حذف النظام القديم (اختياري)

---

## 🆘 الدعم

في حالة مواجهة أي مشاكل، راجع:
1. `src/components/archive/README.md`
2. `console.log` للأخطاء
3. ملفات المكونات للمزيد من التفاصيل

---

تم إعداده بواسطة Kiro 🤖
