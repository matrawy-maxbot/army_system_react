# نظام إدارة المستندات العسكرية
# Army Document Management System

## 📋 نظرة عامة

نظام إدارة المستندات العسكرية المبني على React + Electron - متوافق مع Windows 7

## 🚀 التقنيات المستخدمة

- **React 18.2.0** - مكتبة واجهة المستخدم
- **Electron 22.3.27** - إطار عمل التطبيقات المكتبية (آخر إصدار يدعم Windows 7)
- **Vite 4.3.9** - أداة البناء والتطوير
- **Node.js 16.x** - بيئة التشغيل (موصى بها لـ Windows 7)

## 📁 هيكل المشروع

```
army-system-react/
├── electron/              # Electron main process
│   ├── main.js           # نقطة البداية
│   ├── preload.js        # Preload script
│   ├── ipc/              # IPC handlers (قيد التطوير)
│   ├── protocols/        # Custom protocols (قيد التطوير)
│   └── utils/            # Utilities (قيد التطوير)
│
├── src/                  # React application
│   ├── main.jsx          # نقطة البداية لـ React
│   ├── App.jsx           # المكون الرئيسي
│   ├── components/       # المكونات (قيد التطوير)
│   ├── hooks/            # Custom hooks (قيد التطوير)
│   ├── context/          # React Context (قيد التطوير)
│   ├── services/         # Business logic (قيد التطوير)
│   ├── utils/            # Utilities (قيد التطوير)
│   ├── assets/           # الأصول الثابتة (خطوط، صور)
│   └── styles/           # ملفات CSS
│
├── public/               # الملفات العامة
│   ├── icons/            # أيقونات التطبيق
│   ├── emoji-images/     # صور الإيموجي
│   └── emoji-data.json   # بيانات الإيموجي
│
├── config/               # ملفات الإعدادات (قيد التطوير)
├── package.json          # تبعيات المشروع
├── vite.config.js        # إعدادات Vite
└── electron-builder.json # إعدادات بناء Electron
```

## 🛠️ التثبيت والإعداد

### المتطلبات الأساسية

1. **Node.js 16.x** (آخر إصدار يدعم Windows 7 بشكل جيد)
2. **npm** أو **yarn**

### خطوات التثبيت

```bash
# 1. الانتقال إلى مجلد المشروع
cd c:\Users\moham\OneDrive\Desktop\army_system_react

# 2. تثبيت التبعيات
npm install

# أو باستخدام yarn
yarn install
```

## 🚀 التشغيل

### وضع التطوير

```bash
# تشغيل خادم التطوير (Vite)
npm run dev

# في نافذة أخرى، تشغيل Electron
npm run electron:dev
```

### البناء والتوزيع

```bash
# بناء التطبيق
npm run build

# بناء نسخة Electron قابلة للتثبيت
npm run electron:build
```

## ✅ الحالة الحالية - المرحلة 1

### ما تم إنجازه:

- ✅ إنشاء مجلد المشروع الجديد
- ✅ إنشاء `package.json` بالتبعيات المتوافقة مع Windows 7
- ✅ إعداد `vite.config.js` للتكامل مع Electron
- ✅ إعداد `electron-builder.json` للبناء والتوزيع
- ✅ إنشاء البنية الأساسية لـ Electron:
  - `electron/main.js` - نقطة البداية
  - `electron/preload.js` - تعريف electronAPI
  - البروتوكولات المخصصة (asset://, emoji://)
- ✅ إنشاء البنية الأساسية لـ React:
  - `src/main.jsx` - نقطة البداية
  - `src/App.jsx` - المكون الرئيسي
  - `index.html` - الصفحة الرئيسية
- ✅ إنشاء ملفات CSS:
  - `variables.css` - متغيرات CSS
  - `reset.css` - CSS reset
  - `typography.css` - خطوط Tajawal
  - `rtl.css` - دعم RTL
  - `index.css` - الأنماط الرئيسية
- ✅ نسخ الأصول الثابتة:
  - مجلد `fonts/` (خطوط Tajawal)
  - مجلد `icons/`
  - مجلد `emoji-images/`
  - مجلد `assets/`
  - ملف `emoji-data.json`
- ✅ إنشاء بنية المجلدات الكاملة

### الخطوات التالية (المرحلة 2):

- ⏳ إنشاء `AppStateContext` لإدارة الحالة
- ⏳ إنشاء `SettingsContext` لإدارة الإعدادات
- ⏳ تطوير IPC handlers في Electron
- ⏳ إنشاء خدمات البيانات والملفات

## 📝 ملاحظات مهمة

### توافق Windows 7

- Electron 22.3.27 هو آخر إصدار يدعم Windows 7
- يُنصح باستخدام Node.js 16.x على Windows 7
- تم اختبار التوافق مع Windows 7 32-bit و 64-bit

### البروتوكولات المخصصة

المشروع يستخدم بروتوكولات مخصصة:
- `asset://` - للوصول إلى الملفات المحلية
- `emoji://` - للوصول إلى صور الإيموجي

### دعم RTL والعربية

- كل الواجهة تدعم الاتجاه من اليمين لليسار (RTL)
- استخدام خط Tajawal للنصوص العربية
- دعم الأرقام العربية في التواريخ

## 📚 المراجع

- [خطة الهجرة الكاملة](.agents/tasks/migration-plan.md)
- [Electron 22 Documentation](https://www.electronjs.org/docs/v22)
- [React 18 Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 👥 الدعم

للمساعدة أو الأسئلة، راجع خطة الهجرة في `.agents/tasks/migration-plan.md`

---

**الإصدار:** 1.0.0 (المرحلة 1 - الإعداد الأولي)
**آخر تحديث:** 2024
