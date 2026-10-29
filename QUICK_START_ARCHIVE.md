# 🚀 البدء السريع - نظام الأرشفة

## ✅ تم الدمج بنجاح!

تم دمج نظام الأرشفة في التطبيق بالفعل. الآن يمكنك الوصول إليه من خلال:

### 📍 الوصول للنظام

1. **شغّل التطبيق**
   ```bash
   npm run dev
   ```

2. **اضغط على زر "الأرشفة"** في الشريط الجانبي الأيسر
   - الأيقونة: 📦 (صندوق أرشيف)

3. **ستظهر لك صفحة نظام الأرشفة**

---

## 🎯 ماذا تريد أن تفعل؟

### الخيار 1️⃣: إنشاء بيانات تجريبية (موصى به للاختبار)

افتح Console في المتصفح (`F12`) والصق هذا الكود:

```javascript
// استيراد دالة إنشاء البيانات التجريبية
import { createSampleArchiveData } from './utils/migrateToArchive';

// إنشاء البيانات
const sampleData = createSampleArchiveData();

// حفظ البيانات (يتم تلقائياً في المكون)
console.log('تم إنشاء بيانات تجريبية:', sampleData);
```

**أو بطريقة أسهل:**

أضف هذا الكود في `AppStateContext.jsx` داخل دالة `loadData`:

```javascript
// في نهاية دالة loadData، أضف:
if (!cleanedData.archiveCategories || cleanedData.archiveCategories.length === 0) {
    // استيراد في أعلى الملف:
    // import { createSampleArchiveData } from '../utils/migrateToArchive';
    
    const sampleData = createSampleArchiveData();
    cleanedData.archiveCategories = sampleData;
    await saveData(cleanedData);
}
```

---

### الخيار 2️⃣: ترحيل البيانات من النظام القديم

إذا كان لديك فئات ومستندات في النظام القديم:

**الطريقة الآلية:**

أضف في `App.jsx` داخل `AppContent`:

```javascript
import { useEffect } from 'react';
import { migrateCategoriestoArchive } from './utils/migrateToArchive';

// داخل AppContent component
useEffect(() => {
    const performMigration = async () => {
        // تحقق من وجود بيانات للترحيل
        if (appState.categories?.length > 0 && 
            (!appState.archiveCategories || appState.archiveCategories.length === 0)) {
            
            console.log('🔄 بدء ترحيل البيانات...');
            
            const archiveCategories = migrateCategoriestoArchive(appState.categories);
            
            await updateState({
                archiveCategories: archiveCategories
            });
            
            console.log('✅ تم الترحيل بنجاح!');
            alert('تم ترحيل البيانات إلى نظام الأرشفة بنجاح!');
        }
    };
    
    performMigration();
}, []); // يعمل مرة واحدة فقط عند التحميل
```

---

### الخيار 3️⃣: البدء من الصفر

ببساطة:
1. افتح نظام الأرشفة من الشريط الجانبي
2. اضغط "إضافة فئة أرشيف"
3. أدخل اسم الفئة
4. ابدأ بإضافة المجلدات والملفات

---

## 🎨 معاينة سريعة

### ستجد في نظام الأرشفة:

```
📦 نظام الأرشفة
│
├── 📁 فئة 1: المستندات الإدارية
│   ├── 📂 مجلد 1: مستندات 2026
│   │   ├── 📄 ملف 1
│   │   └── 📄 ملف 2
│   └── 📂 مجلد 2: القرارات
│       └── 📄 ملف 3
│
└── 📁 فئة 2: التقارير
    └── 📂 مجلد 1: تقارير شهرية
        └── 📄 ملف 4
```

---

## ⚡ المميزات الجاهزة للاستخدام

✅ **إضافة فئات أرشيف**
- زر "إضافة فئة أرشيف" في الأعلى

✅ **إضافة مجلدات**
- زر "إضافة مجلد" في كل فئة

✅ **إدارة المجلدات**
- تعديل الاسم والوصف
- نقل بين الفئات
- حذف المجلد

✅ **إدارة الملفات**
- رفع ملفات متعددة
- Drag & Drop (قريباً في Electron)
- عرض حجم وتاريخ الملفات
- فتح الملفات

✅ **طي/فتح الفئات**
- اضغط على عنوان الفئة للطي/الفتح

---

## 🔧 استكشاف الأخطاء

### المشكلة: لا أرى بيانات

**الحل:**
```javascript
// افتح Console واكتب:
localStorage.getItem('army_system_data')

// إذا كانت النتيجة null أو بدون archiveCategories
// استخدم الخيار 1 أو 2 أعلاه
```

### المشكلة: الزر "إضافة فئة" لا يعمل

**الحل:**
تأكد من:
1. تم استيراد `ArchivePage` في `App.jsx`
2. تم تحديث `AppStateContext` ليشمل `archiveCategories`

### المشكلة: لا يمكن رفع الملفات

**الحل:**
في وضع المتصفح، الرفع يستخدم `input[type="file"]`
في وضع Electron، يستخدم Native Dialog

---

## 📚 للمزيد من المعلومات

- **الدليل الكامل**: `ARCHIVE_MIGRATION_GUIDE.md`
- **توثيق المكونات**: `src/components/archive/README.md`
- **كود الترحيل**: `src/utils/migrateToArchive.js`

---

## 🎉 جاهز!

الآن نظام الأرشفة جاهز تماماً. جرّب الآن:

1. شغّل: `npm run dev`
2. اضغط زر "الأرشفة" 📦
3. استمتع بالنظام الجديد! 🚀

---

**ملاحظة مهمة:** 
- النظام القديم (الفئات الحالية) لا يزال يعمل
- يمكنك استخدام النظامين معاً
- أو ترحيل البيانات واستبدال النظام القديم بالكامل

---

*تم بواسطة Kiro 🤖 - 29 أكتوبر 2026*
