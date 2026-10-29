# دليل تشغيل التطبيق في المتصفح
# Browser Mode Guide

## ✅ تم الحل / Solution Complete

تم إنشاء `src/services/electronAPI.js` - وهو wrapper layer يوفر fallback تلقائي للمتصفح!

## كيفية استخدام الـ Wrapper الجديد

### قبل (Before) - استخدام مباشر:
```javascript
// ❌ هذا يعمل فقط في Electron
const result = await window.electronAPI.loadData();
```

### بعد (After) - استخدام الـ Wrapper:
```javascript
// ✅ هذا يعمل في كل من Electron و المتصفح
import { dataAPI } from '../services/electronAPI';

const result = await dataAPI.loadData();
```

## API المتاحة

### 1. عمليات البيانات (Data Operations)
```javascript
import { dataAPI } from '../services/electronAPI';

// تحميل البيانات
const result = await dataAPI.loadData();
// Electron: يقرأ من ملف data.json
// Browser: يقرأ من localStorage

// حفظ البيانات
await dataAPI.saveData(data);
// Electron: يحفظ في ملف data.json
// Browser: يحفظ في localStorage

// نسخ احتياطي
await dataAPI.backupData();
// Electron: ينشئ ملف نسخة احتياطية
// Browser: يحمل ملف JSON للمستخدم

// مسح البيانات
await dataAPI.clearData();
```

### 2. عمليات الملفات (File Operations)
```javascript
import { fileAPI } from '../services/electronAPI';

// اختيار ملف
const result = await fileAPI.selectFile({
    filters: [
        { name: 'Word Documents', extensions: ['docx'] },
        { name: 'PDF Files', extensions: ['pdf'] }
    ]
});
// Electron: يفتح نافذة اختيار ملفات النظام
// Browser: يفتح <input type="file">

// اختيار عدة ملفات
const result = await fileAPI.selectMultipleFiles(filters);

// اختيار مجلد (Electron فقط)
const result = await fileAPI.selectFolder('اختر المجلد');

// فتح ملف (Electron فقط)
await fileAPI.openFile(filePath);
```

### 3. عمليات الإعدادات (Settings Operations)
```javascript
import { settingsAPI } from '../services/electronAPI';

// تحميل الإعدادات
const result = await settingsAPI.loadSettings();

// حفظ الإعدادات
await settingsAPI.saveSettings(settings);

// إعادة تعيين الإعدادات
await settingsAPI.resetSettings();
```

### 4. عمليات الطباعة (Print Operations)
```javascript
import { printAPI } from '../services/electronAPI';

// طباعة ملف
await printAPI.printFile(filePath);
// Electron: يطبع الملف مباشرة
// Browser: يفتح window.print()

// طباعة عدة ملفات (Electron فقط)
await printAPI.printMultipleFiles(filePaths);
```

### 5. عمليات النافذة (Window Operations)
```javascript
import { windowAPI } from '../services/electronAPI';

// تصغير النافذة (Electron فقط)
await windowAPI.minimizeWindow();

// تكبير النافذة (Electron فقط)
await windowAPI.maximizeWindow();

// إغلاق النافذة
await windowAPI.closeWindow();
// Electron: يغلق النافذة
// Browser: يحاول إغلاق التبويب
```

### 6. التحقق من البيئة (Environment Detection)
```javascript
import electronAPI from '../services/electronAPI';

// التحقق من البيئة
if (electronAPI.isElectron()) {
    console.log('Running in Electron');
} else {
    console.log('Running in Browser');
}

// الحصول على اسم البيئة
const env = electronAPI.getEnvironment(); // 'electron' or 'browser'

// عرض معلومات البيئة
electronAPI.showEnvironmentInfo();
// 🖥️ البيئة الحالية: Electron
// 📦 الميزات المتاحة: جميع الميزات
```

## مثال عملي كامل

### تحديث مكون RemindersList

```javascript
// قبل
import React, { useState, useEffect } from 'react';

const RemindersList = () => {
    const loadReminders = async () => {
        const result = await window.electronAPI.loadData(); // ❌
        // ...
    };

    const handleAddReminder = async (reminderData) => {
        const result = await window.electronAPI.loadData(); // ❌
        // ...
        await window.electronAPI.saveData(result.data); // ❌
    };

    // ...
};
```

```javascript
// بعد
import React, { useState, useEffect } from 'react';
import { dataAPI } from '../../services/electronAPI'; // ✅ import

const RemindersList = () => {
    const loadReminders = async () => {
        const result = await dataAPI.loadData(); // ✅
        // ...
    };

    const handleAddReminder = async (reminderData) => {
        const result = await dataAPI.loadData(); // ✅
        // ...
        await dataAPI.saveData(result.data); // ✅
    };

    // ...
};
```

### تحديث مكون AddTemplateModal

```javascript
// قبل
const handleSelectFile = async () => {
    const result = await window.electronAPI.selectFile(options); // ❌
    // ...
};
```

```javascript
// بعد
import { fileAPI } from '../../services/electronAPI'; // ✅

const handleSelectFile = async () => {
    const result = await fileAPI.selectFile(options); // ✅
    
    // في المتصفح، ستحصل على:
    // - result.file: كائن File الأصلي
    // - result.dataUrl: للمعاينة
    // - result.fileName, result.fileSize, result.fileType
    
    // ...
};
```

## الميزات حسب البيئة

| الميزة | Electron | Browser |
|-------|----------|---------|
| تحميل/حفظ البيانات | ✅ ملف JSON | ✅ localStorage |
| اختيار ملفات | ✅ نافذة النظام | ✅ input file |
| اختيار مجلد | ✅ | ❌ |
| فتح ملفات | ✅ | ❌ |
| الطباعة | ✅ مباشرة | ✅ window.print() |
| التحكم في النافذة | ✅ | ⚠️ محدود |
| نسخ احتياطي | ✅ ملف | ✅ تحميل JSON |

## خطوات التحديث لكل المكونات

### 1. استبدال في مكونات البيانات:
```javascript
// استبدل
window.electronAPI.loadData()
window.electronAPI.saveData(data)

// بـ
import { dataAPI } from '../services/electronAPI';
dataAPI.loadData()
dataAPI.saveData(data)
```

### 2. استبدال في مكونات الملفات:
```javascript
// استبدل
window.electronAPI.selectFile()
window.electronAPI.openFile()

// بـ
import { fileAPI } from '../services/electronAPI';
fileAPI.selectFile()
fileAPI.openFile()
```

### 3. استبدال في مكونات الإعدادات:
```javascript
// استبدل
window.electronAPI.loadSettings()
window.electronAPI.saveSettings()

// بـ
import { settingsAPI } from '../services/electronAPI';
settingsAPI.loadSettings()
settingsAPI.saveSettings()
```

## أمر سريع للبحث والاستبدال

في VS Code، استخدم:

**Find (البحث):**
```
window\.electronAPI\.
```

**Replace (الاستبدال):**
حسب نوع العملية:
- `dataAPI.` للبيانات
- `fileAPI.` للملفات  
- `settingsAPI.` للإعدادات
- `printAPI.` للطباعة
- `windowAPI.` للنوافذ

## اختبار في المتصفح

الآن يمكنك تشغيل التطبيق بـ:

```bash
# في المتصفح (للتطوير السريع)
npm run dev
# سيعمل التطبيق مع localStorage

# في Electron (للميزات الكاملة)
npm run electron:dev
# سيعمل التطبيق مع ملفات النظام
```

## القيود في وضع المتصفح

⚠️ **الميزات غير المتاحة في المتصفح:**
1. اختيار مجلدات
2. فتح ملفات بالبرامج الافتراضية
3. طباعة عدة ملفات دفعة واحدة
4. عمليات الملفات المتقدمة
5. دمج ملفات Word/PDF

✅ **الميزات المتاحة في المتصفح:**
1. تخزين البيانات (localStorage)
2. اختيار ملفات (input file)
3. عرض الملفات المحددة
4. الطباعة الأساسية
5. جميع عمليات الواجهة

## الخلاصة

الآن التطبيق يعمل في كلا البيئتين:

- **في Electron**: جميع الميزات تعمل بالكامل
- **في المتصفح**: الميزات الأساسية تعمل مع fallback ذكي

كل ما عليك فعله هو استبدال `window.electronAPI` بالـ API المناسبة من `/services/electronAPI.js`!
