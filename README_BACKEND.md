# 🚀 Army System Backend - Quick Reference

## 📦 What We Have

✅ **Clean MVC Architecture**  
✅ **Unified Database Layer** (Repository Pattern)  
✅ **Unified Business Logic** (Controller Pattern)  
✅ **Works in Dev & Production** (Same code)  
✅ **SQLite Database** (Same file, both modes)  

---

## 🎯 Current Status

### Settings API: ✅ **COMPLETE**

```
✓ src/shared/repositories/settingsRepository.js
✓ src/shared/controllers/settingsController.js
✓ server/index.js (Express routes)
✓ src/main/ipc/settingsIpc.js (Electron IPC)
✓ src/services/settingsAPI.js (Client wrapper)
```

**8 Settings:**
- save_path
- folder_pattern
- auto_backup
- backup_interval
- theme
- language
- font_size
- notifications_enabled

**8 Operations:**
- Get all
- Get single
- Update single
- Update multiple
- Get formatted path
- Validate path
- Ensure directory
- Initialize defaults

---

## 🏃 How to Run

### Dev Mode (Browser):
```bash
npm run dev:full
```
Opens:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Electron Mode:
```bash
npm run electron:dev
```

---

## 📁 File Structure

```
src/shared/          ← Shared between Dev & Electron
  ├── repositories/  ← Database queries
  └── controllers/   ← Business logic

server/              ← Express API (Dev mode)
  └── index.js

src/main/ipc/        ← Electron IPC (Production)
  └── settingsIpc.js

src/services/        ← Client API (Frontend)
  └── settingsAPI.js
```

---

## 🔑 Key Principles

1. **DRY** → No code duplication
2. **Separation** → Each file has ONE job
3. **Unified** → Same database, same code
4. **Testable** → Easy to test each layer
5. **Scalable** → Easy to add new APIs

---

## 🎓 Add New API (5 Steps)

```bash
1. Create Repository    (Database)
2. Create Controller    (Logic)
3. Add Express Routes   (Dev mode)
4. Add IPC Handlers     (Electron)
5. Create Client API    (Frontend)
```

See: `ARCHITECTURE.md` for details

---

## 📊 Database

**Location:**
```
C:\Users\moham\AppData\Roaming\army-system-electron\database\application.db
```

**Tables:** 15 tables (see `src/main/database/tables/index.js`)

---

## 📖 Documentation

- `ARCHITECTURE.md` → Full architecture
- `DEV_SERVER_GUIDE.md` → How to run
- `CLEANUP_SUMMARY.md` → What changed

---

## 🚀 Next Steps

1. ✅ Settings API (Done)
2. 🔜 Files API (Next)
3. 🔜 Faxes API
4. 🔜 Archive API
5. 🔜 Reminders API
6. 🔜 Tasks API

---

**Status:** ✅ Production Ready  
**Last Update:** 2024-11-12  
**Ready for:** Files Management API 🎉
