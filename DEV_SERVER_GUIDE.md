# 🚀 دليل Development Server - الحل النهائي

## ✅ المشكلة تم حلها!

الآن لديك **نفس قاعدة البيانات SQLite** تعمل في **الحالتين**:

```
Dev Mode (Browser)     →  HTTP API  →  SQLite (في AppData)
                          ↓
                     localhost:3001

Electron Mode          →  IPC API   →  SQLite (في AppData)
                          ↓
                    Main Process
```

---

## 📁 موقع قاعدة البيانات

```
C:\Users\moham\AppData\Roaming\army-system-electron\database\application.db
```

**نفس الملف** يستخدمه:
- ✅ Dev Server في المتصفح
- ✅ Electron App

---

## 🎯 كيفية التشغيل

### الطريقة 1: تشغيل كامل (موصى بها)

```bash
npm run dev:full
```

هذا الأمر يشغل:
1. Development Server (Backend) على `localhost:3001`
2. Vite Dev Server (Frontend) على `localhost:3000`

### الطريقة 2: تشغيل منفصل

**Terminal 1: Backend Server**
```bash
npm run server
```

**Terminal 2: Frontend**
```bash
npm run dev
```

---

## 🧪 اختبار النظام

### 1. تحقق من تشغيل الـ Server

افتح: http://localhost:3001/health

**يجب أن ترى:**
```json
{
  "status": "ok",
  "database": "connected",
  "path": "C:\\Users\\moham\\AppData\\Roaming\\army-system-electron\\database\\application.db",
  "size": "20.00 KB"
}
```

### 2. افتح التطبيق

افتح: http://localhost:3000

### 3. افتح Console (F12)

يجب أن ترى:
```
🌐 Using HTTP API (Dev Server)
🔄 Checking API connection...
✅ API connected: http mode
```

### 4. افتح صفحة الإعدادات

1. اضغط على زر الإعدادات ⚙️
2. راقب Console:
   ```
   📥 Getting all settings...
   ✅ Settings loaded
   ```

### 5. غيّر أي إعداد واحفظ

مثلاً: غيّر Theme من `light` إلى `dark`

**يجب أن ترى في Console:**
```
💾 Updating multiple settings...
✅ Settings saved successfully
```

### 6. تحقق من حفظ البيانات

#### الطريقة الأولى: أعد تحميل الصفحة
1. اضغط F5
2. افتح الإعدادات مرة أخرى
3. **تحقق:** الثيم لا يزال `dark` ✅

#### الطريقة الثانية: افتح قاعدة البيانات
1. حمّل [DB Browser for SQLite](https://sqlitebrowser.org/)
2. افتح الملف: `C:\Users\moham\AppData\Roaming\army-system-electron\database\application.db`
3. افتح جدول `settings`
4. **تحقق:** القيمة محفوظة في SQLite ✅

---

## 📊 API Endpoints المتاحة

### Settings API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | فحص حالة السيرفر |
| GET | `/api/settings` | الحصول على جميع الإعدادات |
| GET | `/api/settings/:key` | الحصول على إعداد واحد |
| POST | `/api/settings` | تحديث عدة إعدادات |
| PUT | `/api/settings/:key` | تحديث إعداد واحد |
| POST | `/api/settings/formatted-path` | الحصول على مسار منسق |
| POST | `/api/settings/validate-path` | التحقق من صلاحية مسار |
| POST | `/api/settings/ensure-directory` | إنشاء مجلد |

---

## 🔍 اختبار مباشر بـ curl

```bash
# 1. Health check
curl http://localhost:3001/health

# 2. Get all settings
curl http://localhost:3001/api/settings

# 3. Get single setting
curl http://localhost:3001/api/settings/theme

# 4. Update setting
curl -X PUT http://localhost:3001/api/settings/theme ^
  -H "Content-Type: application/json" ^
  -d "{\"value\":\"dark\"}"

# 5. Get formatted path
curl -X POST http://localhost:3001/api/settings/formatted-path ^
  -H "Content-Type: application/json" ^
  -d "{\"filename\":\"test.pdf\"}"
```

---

## 🐛 Troubleshooting

### المشكلة 1: Dev server not running

**الخطأ:**
```
❌ Dev server not running. Start it with: npm run server
```

**الحل:**
```bash
# في terminal منفصل
npm run server
```

أو استخدم الأمر الشامل:
```bash
npm run dev:full
```

---

### المشكلة 2: Port 3001 already in use

**الخطأ:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**الحل:**
```bash
# ابحث عن العملية
netstat -ano | findstr :3001

# اقتل العملية (استبدل PID بالرقم الفعلي)
taskkill /PID <PID> /F

# أو غيّر البورت في server/index.js
const PORT = 3002;
```

---

### المشكلة 3: CORS Error

**الخطأ:**
```
Access to fetch at 'http://localhost:3001' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**الحل:** تأكد من أن `cors` مُثبت ومُفعّل في `server/index.js`:
```javascript
import cors from 'cors';
app.use(cors());
```

---

### المشكلة 4: Database file not found

**الحل:**
1. احذف المجلد القديم:
   ```
   C:\Users\moham\AppData\Roaming\army-system-electron\
   ```

2. أعد تشغيل السيرفر:
   ```bash
   npm run server
   ```

سيتم إنشاء قاعدة بيانات جديدة تلقائياً.

---

## 📦 الملفات المهمة

```
army_system_react/
├── server/
│   └── index.js                      ✅ Dev Server (Backend)
├── src/
│   ├── services/
│   │   └── settingsAPI.js            ✅ Client API Wrapper
│   └── components/
│       └── settings/
│           └── SettingsModal.jsx     ✅ Settings Page
├── package.json                      ✅ Scripts
└── DEV_SERVER_GUIDE.md              📖 هذا الملف
```

---

## 🎓 كيف يعمل النظام

### 1. Client-side (React)

```javascript
import settingsAPI from './services/settingsAPI';

// الـ API يختار تلقائياً:
// - إذا window.electron موجود → IPC
// - إذا لا → HTTP

const result = await settingsAPI.getAll();
```

### 2. settingsAPI.js يفحص البيئة

```javascript
function isElectron() {
  return !!(window.electron?.ipcRenderer);
}

// إذا Browser → يستخدم fetch
// إذا Electron → يستخدم IPC
```

### 3. Dev Server (server/index.js)

```javascript
// Express server يستمع على localhost:3001
app.get('/api/settings', (req, res) => {
  // يقرأ من SQLite مباشرة
  const rows = db.prepare('SELECT * FROM settings').all();
  res.json({ success: true, data: rows });
});
```

### 4. قاعدة البيانات الموحدة

```
C:\Users\moham\AppData\Roaming\army-system-electron\database\application.db
        ↑
        |
    ┌───┴───┐
    |       |
  Dev     Electron
 Server     App
```

---

## ✅ Checklist للتأكد من العمل

- [ ] `npm run server` يعمل بدون أخطاء
- [ ] http://localhost:3001/health يعطي استجابة
- [ ] http://localhost:3000 يفتح التطبيق
- [ ] Console يظهر: "Using HTTP API (Dev Server)"
- [ ] صفحة الإعدادات تفتح بدون أخطاء
- [ ] تغيير الإعدادات يحفظ البيانات
- [ ] F5 (Reload) لا يفقد البيانات
- [ ] قاعدة البيانات موجودة في AppData
- [ ] DB Browser يظهر الإعدادات المحفوظة

---

## 🚀 الخطوة التالية

بعد التأكد من عمل Settings API بنجاح:

1. ✅ **اختبر كل شيء** (Settings CRUD)
2. ✅ **تحقق من قاعدة البيانات** (DB Browser)
3. ✅ **جرّب في Electron** (تأكد أن IPC يعمل)
4. 🚀 **ابدأ Files Management API**

---

## 💡 Tips

- **استخدم دائماً:** `npm run dev:full` في التطوير
- **راقب Console**: لمعرفة أي API يُستخدم
- **استخدم DB Browser**: لفحص البيانات مباشرة
- **احفظ النسخ**: اعمل backup للـ `application.db` بانتظام

---

**أنت الآن جاهز للتطوير الكامل! 🎉**

قاعدة البيانات SQLite الحقيقية تعمل في وضع المتصفح.
