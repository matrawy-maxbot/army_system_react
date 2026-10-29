# خطة تطبيق Browser Mode Guide على مكونات المشروع
# Browser Mode Implementation Plan

## نظرة عامة على المهمة

تطبيق wrapper APIs من `src/services/electronAPI.js` على 11 ملف React في المجلدات المحددة، لاستبدال الاستخدام المباشر لـ `window.electronAPI` بـ APIs المغلفة التي توفر fallback تلقائي للمتصفح.

## البيئة والأدوات

### معلومات المشروع
- **نوع المشروع**: React 18.2.0 + Electron 22.3.27
- **اللغة**: JavaScript/JSX
- **أداة البناء**: Vite 4.3.9
- **مدير الحزم**: npm
- **البنية**: Electron app مع React frontend

### أوامر التحقق
- **التشغيل في المتصفح**: `npm run dev` (http://localhost:3000)
- **التشغيل في Electron**: `npm run electron:dev`
- **البناء**: `npm run build`

### البيئة والقيود
- التطبيق يدعم Windows 7 (Electron 22.3.27)
- يجب أن يعمل في كلا البيئتين: Electron و Browser
- الملف المرجعي: `BROWSER_MODE_GUIDE.md`
- ملف الـ wrapper: `src/services/electronAPI.js`

## الملفات المتأثرة

تم تحديد **11 ملف** يحتوي على `window.electronAPI`:

1. `src/components/settings/SettingsModal.jsx` - عمليات إعدادات + ملفات
2. `src/components/templates/AddTemplateModal.jsx` - عمليات ملفات
3. `src/components/templates/TemplatesView.jsx` - عمليات بيانات
4. `src/components/lists/ListItemsView.jsx` - عمليات بيانات
5. `src/components/lists/ListsView.jsx` - عمليات بيانات
6. `src/components/files/FilesList.jsx` - عمليات ملفات غير محددة في wrapper
7. `src/components/files/FileThumbnail.jsx` - عمليات ملفات
8. `src/components/faxes/FaxGrid.jsx` - عمليات بيانات
9. `src/components/faxes/OriginalFaxSection.jsx` - عمليات بيانات
10. `src/components/categories/EditCategoryModal.jsx` - عمليات بيانات
11. `src/components/layout/TitleBar.jsx` - عمليات النافذة

**ملاحظة**: `src/components/reminders/RemindersList.jsx` تم تحديثه بالفعل ويستخدم الـ wrapper APIs بشكل صحيح.

## أنواع APIs المستخدمة في المشروع

### 1. Data Operations (عمليات البيانات)
```javascript
import { dataAPI } from '../../services/electronAPI';
// الاستبدالات:
window.electronAPI.loadData() → dataAPI.loadData()
window.electronAPI.saveData(data) → dataAPI.saveData(data)
```

### 2. File Operations (عمليات الملفات)
```javascript
import { fileAPI } from '../../services/electronAPI';
// الاستبدالات:
window.electronAPI.selectFile(options) → fileAPI.selectFile(options)
window.electronAPI.selectFolder(options) → fileAPI.selectFolder(title)
window.electronAPI.openFile(filePath) → fileAPI.openFile(filePath)
```

### 3. Settings Operations (عمليات الإعدادات)
```javascript
import { settingsAPI } from '../../services/electronAPI';
// الاستبدالات:
window.electronAPI.loadSettings() → settingsAPI.loadSettings()
window.electronAPI.saveSettings(settings) → settingsAPI.saveSettings(settings)
```

### 4. Window Operations (عمليات النافذة)
```javascript
import { windowAPI } from '../../services/electronAPI';
// الاستبدالات:
window.electronAPI.minimizeWindow() → windowAPI.minimizeWindow()
window.electronAPI.maximizeWindow() → windowAPI.maximizeWindow()
window.electronAPI.closeWindow() → windowAPI.closeWindow()
```

### 5. APIs غير محددة في الـ Wrapper
الملفات التالية تستخدم APIs غير موجودة في `electronAPI.js`:
- `window.electronAPI.getTodayFiles()` - في FilesList.jsx
- `window.electronAPI.printFiles()` - في FilesList.jsx
- `window.electronAPI.mergeFiles()` - في FilesList.jsx
- `window.electronAPI.deleteFiles()` - في FilesList.jsx
- `window.electronAPI.openTodayCopiesFolder()` - في FilesList.jsx
- `window.electronAPI.testPathWritable()` - في SettingsModal.jsx
- `window.electronAPI.toggleDevTools()` - في TitleBar.jsx
- `window.electronAPI.resetZoom()` - في TitleBar.jsx
- `window.electronAPI.zoomIn()` - في TitleBar.jsx
- `window.electronAPI.zoomOut()` - في TitleBar.jsx
- `window.electronAPI.toggleFullscreen()` - في TitleBar.jsx

## خطة التنفيذ

# Implementation Plan

- [ ] 1. **تحديث ملفات Templates (القوالب)**
      استبدال `window.electronAPI.loadData/saveData/selectFile` بـ `dataAPI` و `fileAPI` في ملفات القوالب.
      الملفات:
      - `src/components/templates/TemplatesView.jsx` (loadData, saveData)
      - `src/components/templates/AddTemplateModal.jsx` (selectFile)
      المسار النسبي للـ import: `../../services/electronAPI`
      التحقق: تشغيل `npm run dev` والتأكد من عمل صفحة القوالب بدون أخطاء في console، ثم اختبار إضافة وتعديل قالب.

- [ ] 2. **تحديث ملفات Lists (القوائم)**
      استبدال `window.electronAPI.loadData/saveData` بـ `dataAPI` في ملفات القوائم.
      الملفات:
      - `src/components/lists/ListsView.jsx`
      - `src/components/lists/ListItemsView.jsx`
      المسار النسبي للـ import: `../../services/electronAPI`
      التحقق: تشغيل `npm run dev` والتأكد من عمل صفحة القوائم، واختبار إضافة وحذف قائمة.

- [ ] 3. **تحديث ملفات Faxes (الفاكسات)**
      استبدال `window.electronAPI.saveData` بـ `dataAPI.saveData` في مكونات الفاكسات.
      الملفات:
      - `src/components/faxes/FaxGrid.jsx`
      - `src/components/faxes/OriginalFaxSection.jsx`
      المسار النسبي للـ import: `../../services/electronAPI`
      التحقق: تشغيل `npm run dev` والتأكد من عمل شبكة الفاكسات وقسم الفاكس الأصلي.

- [ ] 4. **تحديث ملف Categories (الفئات)**
      استبدال `window.electronAPI.loadData/saveData` بـ `dataAPI` في مكون تعديل الفئات.
      الملفات:
      - `src/components/categories/EditCategoryModal.jsx`
      المسار النسبي للـ import: `../../services/electronAPI`
      التحقق: تشغيل `npm run dev` واختبار تعديل فئة موجودة.

- [ ] 5. **تحديث ملف Settings (الإعدادات)**
      استبدال `window.electronAPI.loadSettings/saveSettings/selectFolder` بـ `settingsAPI` و `fileAPI`.
      ملاحظة: `testPathWritable` غير موجود في wrapper - سيتم الاحتفاظ به كـ optional chaining.
      الملفات:
      - `src/components/settings/SettingsModal.jsx`
      المسار النسبي للـ import: `../../services/electronAPI`
      التحقق: تشغيل `npm run dev` واختبار فتح نافذة الإعدادات، وتغيير مسار الحفظ.

- [ ] 6. **تحديث ملف TitleBar (شريط العنوان)**
      استبدال `window.electronAPI.minimizeWindow/maximizeWindow/closeWindow` بـ `windowAPI`.
      ملاحظة: الدوال الأخرى (toggleDevTools, resetZoom, إلخ) سيتم الاحتفاظ بها مع optional chaining لأنها غير موجودة في wrapper.
      الملفات:
      - `src/components/layout/TitleBar.jsx`
      المسار النسبي للـ import: `../../services/electronAPI`
      التحقق: تشغيل `npm run electron:dev` واختبار أزرار تصغير/تكبير/إغلاق النافذة.

- [ ] 7. **معالجة ملفات Files (الملفات) مع APIs غير محددة**
      بما أن FilesList.jsx و FileThumbnail.jsx يستخدمان APIs غير موجودة في wrapper (`getTodayFiles`, `printFiles`, `mergeFiles`, `deleteFiles`, `openTodayCopiesFolder`)، سنقوم بالآتي:
      أ. إضافة تعليق توضيحي أن هذه الدوال تحتاج wrapper مخصص
      ب. الاحتفاظ بـ optional chaining الحالي (`window.electronAPI && window.electronAPI.getTodayFiles`)
      ج. إضافة استيراد `import { fileAPI } from '../../services/electronAPI';` للدوال المتاحة إذا وجدت
      الملفات:
      - `src/components/files/FilesList.jsx`
      - `src/components/files/FileThumbnail.jsx`
      التحقق: تشغيل `npm run dev` والتأكد من عدم وجود أخطاء في console عند فتح صفحة الملفات.

- [ ] 8. **التحقق الشامل من عدم وجود window.electronAPI مباشر**
      البحث في جميع الملفات المحدثة للتأكد من عدم وجود استخدام مباشر لـ `window.electronAPI` (باستثناء optional chaining للـ APIs غير المحددة).
      الأمر: تشغيل `grep -r "window\.electronAPI\." src/components/reminders src/components/settings src/components/templates src/components/lists src/components/files src/components/faxes src/components/documents src/components/categories src/components/layout src/components/common --include="*.jsx"`
      المتوقع: يجب أن تظهر فقط النتائج في FilesList.jsx و FileThumbnail.jsx و SettingsModal.jsx و TitleBar.jsx للـ APIs غير المحددة مع optional chaining.
      التحقق: النتيجة يجب ألا تحتوي على `window.electronAPI.loadData` أو `saveData` أو `selectFile` مباشرة.

- [ ] 9. **اختبار شامل في وضع المتصفح**
      تشغيل التطبيق في وضع المتصفح والتأكد من:
      - عدم وجود أخطاء في console
      - عمل localStorage للبيانات والإعدادات
      - عمل اختيار الملفات عبر input file
      - ظهور رسائل تنبيه مناسبة للميزات غير المتاحة
      الأمر: `npm run dev` ثم فتح http://localhost:3000
      التحقق: فحص console في المتصفح، واختبار:
      - إضافة تذكير (يجب أن يحفظ في localStorage)
      - إضافة قالب (يجب أن يظهر نافذة اختيار ملف)
      - فتح الإعدادات (يجب أن تعمل بدون أخطاء)
      - النقر على أزرار النافذة (قد تظهر رسائل أو لا تعمل، وهذا متوقع)

- [ ] 10. **اختبار شامل في وضع Electron**
      تشغيل التطبيق في وضع Electron والتأكد من:
      - عمل جميع عمليات الملفات بشكل كامل
      - عمل التحكم في النافذة
      - حفظ البيانات في ملف data.json
      - حفظ الإعدادات في ملف settings.json
      الأمر: `npm run electron:dev`
      التحقق: 
      - إضافة تذكير والتحقق من حفظه في data.json
      - إضافة قالب واختيار ملف من النظام
      - فتح الإعدادات واختيار مجلد حفظ
      - اختبار أزرار تصغير/تكبير/إغلاق النافذة

- [ ] 11. **توثيق التغييرات**
      إنشاء ملف توثيق للتغييرات المنفذة.
      الملف: `.agents/tasks/browser-mode-implementation-report.md`
      المحتوى:
      - قائمة بجميع الملفات المحدثة
      - ملخص الاستبدالات المنفذة
      - APIs التي لم يتم تغطيتها في wrapper (مع تفسير)
      - نتائج الاختبارات
      - توصيات للتحسينات المستقبلية
      التحقق: مراجعة الملف والتأكد من اكتماله.

## تفاصيل الاستبدالات المطلوبة

### النمط العام للتحديث:

#### قبل:
```javascript
import React, { useState } from 'react';

const Component = () => {
    const loadData = async () => {
        const result = await window.electronAPI.loadData();
        // ...
    };
    
    const saveData = async (data) => {
        await window.electronAPI.saveData(data);
    };
};
```

#### بعد:
```javascript
import React, { useState } from 'react';
import { dataAPI } from '../../services/electronAPI';

const Component = () => {
    const loadData = async () => {
        const result = await dataAPI.loadData();
        // ...
    };
    
    const saveData = async (data) => {
        await dataAPI.saveData(data);
    };
};
```

### حساب المسارات النسبية:

جميع الملفات في المجلدات المحددة تستخدم:
```javascript
import { dataAPI, fileAPI, settingsAPI, windowAPI } from '../../services/electronAPI';
```

لأن البنية هي:
- `src/components/<category>/<Component>.jsx`
- `src/services/electronAPI.js`

المسار النسبي: `../../services/electronAPI`

### معالجة Imports المتعددة:

إذا كان الملف يستخدم أكثر من نوع API، دمجها في import واحد:
```javascript
// صحيح:
import { dataAPI, fileAPI, settingsAPI } from '../../services/electronAPI';

// خطأ:
import { dataAPI } from '../../services/electronAPI';
import { fileAPI } from '../../services/electronAPI';
import { settingsAPI } from '../../services/electronAPI';
```

### معالجة Optional Chaining:

للـ APIs غير الموجودة في wrapper (مثل getTodayFiles):
```javascript
// قبل:
if (window.electronAPI && window.electronAPI.getTodayFiles) {
    const result = await window.electronAPI.getTodayFiles(dateStr, '');
}

// بعد (الاحتفاظ به كما هو مع تعليق):
// Note: getTodayFiles is not wrapped yet - keeping original implementation
if (window.electronAPI && window.electronAPI.getTodayFiles) {
    const result = await window.electronAPI.getTodayFiles(dateStr, '');
}
```

## APIs غير المغطاة في Wrapper

الـ APIs التالية موجودة في الملفات لكنها **غير محددة** في `src/services/electronAPI.js`:

### File Operations (غير محددة):
- `window.electronAPI.getTodayFiles(dateStr, filter)` - FilesList.jsx
- `window.electronAPI.printFiles(filePaths)` - FilesList.jsx  
- `window.electronAPI.mergeFiles(filePaths)` - FilesList.jsx
- `window.electronAPI.deleteFiles(filePaths)` - FilesList.jsx
- `window.electronAPI.openTodayCopiesFolder(dateStr, filter)` - FilesList.jsx

### Settings Operations (غير محددة):
- `window.electronAPI.testPathWritable(path)` - SettingsModal.jsx

### Window Operations (غير محددة):
- `window.electronAPI.toggleDevTools()` - TitleBar.jsx
- `window.electronAPI.resetZoom()` - TitleBar.jsx
- `window.electronAPI.zoomIn()` - TitleBar.jsx
- `window.electronAPI.zoomOut()` - TitleBar.jsx
- `window.electronAPI.toggleFullscreen()` - TitleBar.jsx

**القرار**: الاحتفاظ بهذه الدوال مع optional chaining وإضافة تعليقات توضيحية. يمكن إضافتها للـ wrapper في مرحلة لاحقة.

## معايير النجاح

✅ **معايير القبول:**

1. جميع ملفات المكونات في المجلدات المحددة تستخدم wrapper APIs بدلاً من window.electronAPI المباشر
2. لا توجد أخطاء في console عند التشغيل في وضع المتصفح (`npm run dev`)
3. لا توجد أخطاء في console عند التشغيل في Electron (`npm run electron:dev`)
4. جميع الميزات الأساسية تعمل في كلا الوضعين:
   - حفظ وتحميل البيانات (localStorage في المتصفح، ملفات في Electron)
   - اختيار الملفات (input file في المتصفح، نوافذ النظام في Electron)
   - التحكم في النافذة (Electron فقط)
5. رسائل تنبيه مناسبة للميزات غير المتاحة في المتصفح
6. الاستبدالات المنفذة:
   - `window.electronAPI.loadData()` → `dataAPI.loadData()`
   - `window.electronAPI.saveData()` → `dataAPI.saveData()`
   - `window.electronAPI.selectFile()` → `fileAPI.selectFile()`
   - `window.electronAPI.selectFolder()` → `fileAPI.selectFolder()`
   - `window.electronAPI.loadSettings()` → `settingsAPI.loadSettings()`
   - `window.electronAPI.saveSettings()` → `settingsAPI.saveSettings()`
   - `window.electronAPI.minimizeWindow()` → `windowAPI.minimizeWindow()`
   - `window.electronAPI.maximizeWindow()` → `windowAPI.maximizeWindow()`
   - `window.electronAPI.closeWindow()` → `windowAPI.closeWindow()`

## ملاحظات إضافية

### الملفات التي تم تحديثها مسبقاً:
- ✅ `src/components/reminders/RemindersList.jsx` - يستخدم بالفعل `import { dataAPI } from '../../services/electronAPI';`

### اعتبارات خاصة:
1. **FilesList.jsx**: يحتوي على العديد من APIs غير محددة - يحتاج عناية خاصة
2. **TitleBar.jsx**: يحتوي على دوال اختيارية (DevTools, Zoom) - استخدام optional chaining
3. **SettingsModal.jsx**: يستخدم `testPathWritable` غير محددة - الاحتفاظ بـ optional chaining

### فوائد التحديث:
- ✅ التطبيق يعمل في المتصفح للتطوير السريع
- ✅ Fallback تلقائي عند عدم توفر Electron
- ✅ كود أنظف وأسهل في الصيانة
- ✅ إمكانية استضافة التطبيق كـ web app في المستقبل

### التوصيات للمستقبل:
1. إضافة APIs المفقودة إلى `electronAPI.js`:
   - File operations: getTodayFiles, printFiles, mergeFiles, deleteFiles, openTodayCopiesFolder
   - Settings: testPathWritable
   - Window: toggleDevTools, resetZoom, zoomIn, zoomOut, toggleFullscreen
2. إنشاء tests للـ wrapper APIs
3. توثيق الـ fallback behavior لكل API

---

## الخلاصة

هذه الخطة تغطي تحديث **11 ملف** في **10 مجلدات مختلفة** لاستخدام wrapper APIs، مع معالجة خاصة للـ APIs غير المحددة في الـ wrapper. التنفيذ يحافظ على التوافق مع كلا البيئتين (Electron و Browser) ويضمن عدم كسر أي وظيفة موجودة.
