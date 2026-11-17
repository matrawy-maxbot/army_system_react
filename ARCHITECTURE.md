# 🏗️ Army System - Architecture

## 📁 البنية النهائية للمشروع

```
army_system_react/
│
├── server/                                # Dev Server (للتطوير في المتصفح)
│   └── index.js                          # Express API Server
│
├── src/
│   ├── shared/                           # كود مشترك بين Dev و Electron
│   │   ├── repositories/                 # طبقة Database
│   │   │   └── settingsRepository.js    # Settings DB operations
│   │   └── controllers/                  # طبقة Business Logic
│   │       └── settingsController.js    # Settings logic
│   │
│   ├── services/                         # Client-side services
│   │   └── settingsAPI.js               # API wrapper (HTTP/IPC)
│   │
│   ├── main/                            # Electron Main Process
│   │   ├── database/
│   │   │   ├── connection/
│   │   │   │   └── database.js          # SQLite connection
│   │   │   └── tables/
│   │   │       └── index.js             # Tables schema
│   │   └── ipc/
│   │       └── settingsIpc.js           # IPC handlers
│   │
│   └── components/                       # React Components
│       └── settings/
│           └── SettingsModal.jsx        # Settings UI
│
└── DEV_SERVER_GUIDE.md                  # دليل الاستخدام
```

---

## 🎯 كيف يعمل النظام

### 1️⃣ وضع التطوير (Browser Dev Mode)

```
React App (localhost:3000)
    ↓
settingsAPI.js (يكتشف: Browser Mode)
    ↓
HTTP Request → Express Server (localhost:3001)
    ↓
settingsController.js (Business Logic)
    ↓
settingsRepository.js (Database Queries)
    ↓
SQLite Database (في AppData)
```

### 2️⃣ وضع الإنتاج (Electron App)

```
React App (Renderer Process)
    ↓
settingsAPI.js (يكتشف: Electron Mode)
    ↓
IPC → Electron Main Process
    ↓
settingsIpc.js (IPC Handlers)
    ↓
settingsController.js (نفس الـ Business Logic)
    ↓
settingsRepository.js (نفس الـ Database Queries)
    ↓
SQLite Database (في AppData)
```

---

## 🔑 المبادئ الأساسية

### ✅ DRY (Don't Repeat Yourself)
- **Repository** و **Controller** موحدين
- يستخدمهما Express و Electron معاً
- لا تكرار في الـ queries أو logic

### ✅ Separation of Concerns
- **Repository**: Database operations فقط
- **Controller**: Business logic فقط
- **Routes/IPC**: Communication layer فقط
- **API Client**: Frontend interface فقط

### ✅ Single Source of Truth
- قاعدة بيانات واحدة: `C:\Users\moham\AppData\Roaming\army-system-electron\database\application.db`
- يستخدمها Dev Server و Electron App
- نفس البيانات في الحالتين

---

## 📊 مقارنة الأوضاع

| Feature | Dev Mode | Electron Mode |
|---------|----------|---------------|
| Transport | HTTP (REST API) | IPC (Inter-Process Communication) |
| Server | Express (port 3001) | Electron Main Process |
| Client | Fetch API | window.electron.ipcRenderer |
| Database | SQLite (better-sqlite3) | SQLite (better-sqlite3) |
| Location | Same (AppData) | Same (AppData) |
| Repository | ✅ Same code | ✅ Same code |
| Controller | ✅ Same code | ✅ Same code |

---

## 🚀 كيفية التشغيل

### للتطوير (Dev Mode):
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run dev

# أو الأمر الشامل:
npm run dev:full
```

### لـ Electron:
```bash
npm run electron:dev
```

---

## 📝 إضافة API جديد (مثال: Files API)

### 1. أنشئ Repository
```javascript
// src/shared/repositories/filesRepository.js
class FilesRepository {
  constructor(db) {
    this.db = db;
  }
  
  getAll() {
    return this.db.prepare('SELECT * FROM files').all();
  }
  
  // ... other methods
}
```

### 2. أنشئ Controller
```javascript
// src/shared/controllers/filesController.js
class FilesController {
  constructor(repository) {
    this.repository = repository;
  }
  
  async getFiles() {
    const files = this.repository.getAll();
    return { success: true, data: files };
  }
  
  // ... other methods
}
```

### 3. أضف Express Routes
```javascript
// server/index.js
import FilesRepository from '../src/shared/repositories/filesRepository.js';
import FilesController from '../src/shared/controllers/filesController.js';

const filesRepo = new FilesRepository(db);
const filesController = new FilesController(filesRepo);

app.get('/api/files', async (req, res) => {
  const result = await filesController.getFiles();
  res.json(result);
});
```

### 4. أضف IPC Handlers
```javascript
// src/main/ipc/filesIpc.js
import database from '../database/connection/database.js';
import FilesRepository from '../../shared/repositories/filesRepository.js';
import FilesController from '../../shared/controllers/filesController.js';

let filesController;

function initFilesService() {
  if (!filesController) {
    const db = database.connection;
    const repo = new FilesRepository(db);
    filesController = new FilesController(repo);
  }
  return filesController;
}

export function registerFilesHandlers() {
  ipcMain.handle('files:getAll', async () => {
    const controller = initFilesService();
    return await controller.getFiles();
  });
}
```

### 5. أنشئ Client API
```javascript
// src/services/filesAPI.js
const filesAPI = {
  _getAPI() {
    if (window.electron?.ipcRenderer) {
      // Electron IPC
      return {
        async getAll() {
          return await window.electron.ipcRenderer.invoke('files:getAll');
        }
      };
    } else {
      // HTTP API
      return {
        async getAll() {
          const res = await fetch('http://localhost:3001/api/files');
          return await res.json();
        }
      };
    }
  },
  
  async getAll() {
    return await this._getAPI().getAll();
  }
};
```

---

## 🎓 الدروس المستفادة

### ❌ ما كان خاطئاً في البداية:
1. محاولة استخدام sql.js في المتصفح
2. localStorage للحفظ المؤقت
3. Mock data بدون قاعدة بيانات حقيقية
4. تكرار SQL queries في Routes و IPC

### ✅ الحل الصحيح:
1. **Dev Server** يشغل SQLite الحقيقي
2. **نفس قاعدة البيانات** في الحالتين
3. **Repository Pattern** لتوحيد الـ queries
4. **Controller Pattern** لتوحيد الـ logic
5. **API Wrapper** يختار تلقائياً (HTTP/IPC)

---

## 🔐 قاعدة البيانات

### الموقع:
```
C:\Users\moham\AppData\Roaming\army-system-electron\database\application.db
```

### الجداول (15 جدول):
1. `settings` - الإعدادات
2. `files` - الملفات
3. `archive_categories` - فئات الأرشيف
4. `archive_folders` - مجلدات الأرشيف
5. `original_faxes` - الفاكسات الأصلية
6. `filtered_faxes` - الفاكسات المفلترة
7. `filtered_fax_pages` - صفحات الفاكسات
8. `templates` - القوالب
9. `replies` - الردود
10. `reply_attachments` - مرفقات الردود
11. `lists` - القوائم
12. `list_items` - عناصر القوائم
13. `reminders` - التذكيرات
14. `reminder_attachments` - مرفقات التذكيرات
15. `tasks` - المهام

---

## 🎯 الخطوات التالية

الآن بعد أن أصبح لدينا بنية نظيفة وموحدة، يمكننا بناء:

1. ✅ **Settings API** (مكتمل)
2. 🔜 **Files API** - إدارة الملفات ورفعها
3. 🔜 **Faxes API** - إدارة الفاكسات
4. 🔜 **Archive API** - نظام الأرشيف
5. 🔜 **Reminders API** - التذكيرات
6. 🔜 **Tasks API** - المهام

كل API سيتبع **نفس النمط**:
- Repository (Database)
- Controller (Logic)
- Routes (Express)
- IPC Handlers (Electron)
- Client API (Frontend)

---

## 💡 نصائح مهمة

1. **لا تكرر الكود**: استخدم shared folder
2. **افصل المسؤوليات**: Repository ≠ Controller ≠ Routes
3. **وحّد الاستجابات**: دائماً `{ success, data?, error? }`
4. **اختبر في الوضعين**: Dev و Electron
5. **استخدم DB Browser**: لفحص البيانات مباشرة

---

**تم بناء هذه البنية في:** 2024-11-12  
**الحالة:** ✅ Production Ready  
**التالي:** Files Management API 🚀
