# دليل البناء - Army System

## متطلبات النظام

### لبناء التطبيق
- Node.js 16.x أو أحدث
- npm 7.x أو أحدث
- Windows 7/8/10/11 (64-bit)

### للتشغيل على الأجهزة المستهدفة
- Windows 7 SP1 64-bit أو أحدث
- .NET Framework 4.5 أو أحدث (متضمن في Windows 8+)
- 2 GB RAM (4 GB موصى به)
- 500 MB مساحة تخزين

## خطوات البناء

### 1. تثبيت الحزم
```bash
npm install
```

### 2. بناء التطبيق
```bash
npm run build
```
هذا الأمر سيقوم ببناء واجهة React باستخدام Vite.

### 3. إنشاء ملف التثبيت
```bash
npm run electron:build
```

أو يمكنك تنفيذ الخطوتين معاً:
```bash
npm run build && npm run electron:build
```

### 4. النتيجة
ستجد ملف التثبيت في:
```
build/Army-System-Setup-1.0.0-x64.exe
```

## تخصيص البناء

### تغيير الإصدار
عدل `version` في `package.json`:
```json
{
  "version": "1.0.0"
}
```

### تغيير الأيقونة
استبدل الملف:
```
public/icons/icon.ico
```

تنسيق ICO يجب أن يحتوي على:
- 256x256 px
- 128x128 px
- 64x64 px
- 48x48 px
- 32x32 px
- 16x16 px

### تغيير اسم التطبيق
عدل في `electron-builder.json`:
```json
{
  "productName": "Army System",
  "appId": "com.army.system"
}
```

## استكشاف الأخطاء

### خطأ: Cannot find module 'electron'
```bash
npm install --save-dev electron
```

### خطأ: ENOENT: no such file or directory 'dist-vite'
قم ببناء التطبيق أولاً:
```bash
npm run build
```

### خطأ: Icon file not found
تأكد من وجود الملف:
```
public/icons/icon.ico
```

### خطأ: Out of memory
زيادة ذاكرة Node.js:
```bash
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run electron:build
```

## التوافق مع Windows 7

التطبيق متوافق مع Windows 7 SP1 64-bit بفضل:

1. **Electron 22.x**: آخر إصدار يدعم Windows 7
2. **معمارية x64 فقط**: أداء أفضل على الأنظمة الحديثة
3. **NSIS Installer**: متوافق مع Windows 7

### متطلبات Windows 7
- Windows 7 SP1 (Service Pack 1) مثبت
- تحديثات النظام الأساسية
- .NET Framework 4.5 أو أحدث

### إذا واجهت مشاكل على Windows 7
1. تأكد من تثبيت جميع تحديثات Windows
2. تثبيت .NET Framework 4.8
3. تثبيت Visual C++ Redistributable 2015-2019

## البناء للإصدارات المختلفة

### بناء 32-bit (إذا لزم الأمر)
عدل `electron-builder.json`:
```json
{
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": ["x64", "ia32"]
      }
    ]
  }
}
```

### بناء Portable (بدون تثبيت)
عدل `electron-builder.json`:
```json
{
  "win": {
    "target": ["portable"]
  }
}
```

## حجم الملف

### الحجم المتوقع
- ملف التثبيت: ~150-200 MB
- التطبيق المثبت: ~250-300 MB

### تقليل الحجم
1. إزالة ملفات التطوير:
```json
{
  "files": [
    "dist-vite/**/*",
    "electron/**/*",
    "!electron/**/*.map",
    "package.json"
  ]
}
```

2. ضغط الأصول:
```bash
npm install --save-dev @electron/asar
```

## الأمان

### التوقيع الرقمي (اختياري)
للتوقيع الرقمي، أضف في `electron-builder.json`:
```json
{
  "win": {
    "certificateFile": "cert.p12",
    "certificatePassword": "YOUR_PASSWORD",
    "signDlls": true
  }
}
```

### Auto-Update (للإصدارات المستقبلية)
يمكن إضافة نظام تحديثات تلقائي باستخدام `electron-updater`.

## نصائح إضافية

### التحقق من البناء
بعد البناء، اختبر الملف:
1. ثبت على جهاز Windows 7 نظيف
2. تحقق من جميع الميزات
3. اختبر الأداء

### التوزيع
يمكنك توزيع الملف عبر:
- USB Drive
- Network Share
- Download Link

### الصيانة
- احتفظ بنسخة احتياطية من الكود المصدري
- وثق أي تغييرات في الإصدارات
- اختبر على أجهزة مختلفة

## الموارد

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Vite Documentation](https://vitejs.dev/)

## الدعم

لأي مشاكل أو استفسارات:
1. راجع هذا الدليل
2. تحقق من logs في `%APPDATA%/Army System/logs`
3. افحص console في DevTools (Ctrl+Shift+I)
