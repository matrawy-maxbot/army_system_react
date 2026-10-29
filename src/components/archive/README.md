# نظام الأرشفة - Archive System

نظام شامل لإدارة الملفات والمستندات بطريقة منظمة ومرنة.

## 📋 البنية الهيكلية

```
Archive System
├── Archive Categories (فئات الأرشيف)
│   ├── Category 1
│   │   ├── Folder 1
│   │   │   ├── File 1
│   │   │   ├── File 2
│   │   │   └── File 3
│   │   └── Folder 2
│   │       └── File 4
│   └── Category 2
│       └── Folder 3
│           ├── File 5
│           └── File 6
```

## 🗂️ المكونات (Components)

### المكونات الأساسية

1. **ArchiveGrid.jsx**
   - عرض شبكة فئات الأرشيف
   - معالجة الحالة الفارغة

2. **ArchiveCategoryCard.jsx**
   - بطاقة عرض فئة أرشيف واحدة
   - إمكانية طي/فتح المجلدات
   - زر إضافة مجلد جديد

3. **FolderGrid.jsx**
   - عرض شبكة المجلدات داخل الفئة
   - تصميم متجاوب

4. **FolderCard.jsx**
   - بطاقة عرض مجلد واحد
   - عرض عدد الملفات
   - الوصف (اختياري)

### النوافذ المنبثقة (Modals)

1. **AddArchiveCategoryModal.jsx**
   - إضافة فئة أرشيف جديدة
   - التحقق من المدخلات

2. **AddFolderModal.jsx**
   - إضافة مجلد جديد
   - اختيار الفئة التابعة
   - وصف اختياري

3. **FolderViewModal.jsx**
   - عرض محتويات المجلد
   - إضافة ملفات متعددة
   - Drag & Drop support
   - فتح الملفات
   - إدارة المجلد (تعديل، نقل، حذف)

4. **EditFolderModal.jsx**
   - تعديل اسم المجلد
   - تعديل الوصف

5. **MoveFolderModal.jsx**
   - نقل المجلد إلى فئة أخرى
   - عرض الفئة الحالية والمتاحة

6. **DeleteFolderModal.jsx**
   - تأكيد حذف المجلد
   - تحذير من حذف الملفات

## 💾 نموذج البيانات

### Archive Category

```javascript
{
  id: 1,
  name: 'المستندات الإدارية',
  folders: [...]
}
```

### Folder

```javascript
{
  id: 101,
  name: 'مستندات 2026',
  description: 'مستندات السنة الجارية',
  categoryId: 1,
  files: [...]
}
```

### File

```javascript
{
  id: 1001,
  name: 'document.docx',
  originalFileName: 'document.docx',
  size: 1024000,
  addedAt: '2026-01-15T10:00:00.000Z',
  path: 'relative/path/to/file'
}
```

## 🎨 التصميم

### الألوان الأساسية
- Primary: `#3b82f6` (أزرق)
- Secondary: `#64748b` (رمادي)
- Success: `#10b981` (أخضر)
- Danger: `#ef4444` (أحمر)

### الأيقونات
- مجلد: أيقونة مجلد مملوء
- ملف: أيقونة مستند

## 🚀 الاستخدام

### الصفحة الرئيسية

```jsx
import ArchivePage from './pages/ArchivePage';

function App() {
  return <ArchivePage />;
}
```

### استخدام المكونات بشكل منفصل

```jsx
import { ArchiveGrid, AddFolderModal } from './components/archive';

function MyComponent() {
  return (
    <>
      <ArchiveGrid onAddFolder={handleAddFolder} onOpenFolder={handleOpenFolder} />
      <AddFolderModal isOpen={showModal} onClose={handleClose} categoryId={categoryId} />
    </>
  );
}
```

## 🔄 ترحيل البيانات

استخدم الدوال المساعدة لترحيل البيانات:

```javascript
import { migrateCategoriestoArchive } from './utils/migrateToArchive';

// ترحيل الفئات القديمة
const archiveCategories = migrateCategoriestoArchive(oldCategories);

// حفظ البيانات الجديدة
await saveData({ ...appState, archiveCategories });
```

## ⚙️ Context API

النظام يستخدم `AppStateContext` لإدارة الحالة:

```javascript
const { appState, setAppState, saveData } = useAppState();

// الوصول لفئات الأرشيف
const archiveCategories = appState.archiveCategories;

// تحديث البيانات
setAppState({ ...appState, archiveCategories: newData });
await saveData();
```

## 🎯 المميزات

✅ تصنيف متعدد المستويات (فئات → مجلدات → ملفات)
✅ وصف للمجلدات
✅ نقل المجلدات بين الفئات
✅ رفع ملفات متعددة
✅ Drag & Drop للملفات
✅ عرض حجم الملفات وتاريخ الإضافة
✅ طي/فتح الفئات
✅ تصميم متجاوب

## 📱 Responsive Design

النظام يعمل بشكل ممتاز على جميع الأجهزة:
- Desktop (> 1200px)
- Tablet (768px - 1200px)
- Mobile (< 768px)

## 🔧 التخصيص

يمكن تخصيص المكونات عبر:
- تعديل ملفات CSS
- تمرير props إضافية
- تعديل نموذج البيانات

## 🐛 المشاكل المعروفة

لا توجد مشاكل معروفة حالياً.

## 📝 الملاحظات

- تأكد من تهيئة `archiveCategories` في `AppStateContext`
- استخدم دوال الترحيل للانتقال من النظام القديم
- احفظ البيانات بعد كل تعديل

## 🤝 المساهمة

لإضافة ميزات جديدة:
1. أنشئ مكون جديد في مجلد `archive`
2. أضف التصدير في `index.js`
3. حدّث `README.md`

---

تم إنشاؤه بواسطة Kiro 🤖
