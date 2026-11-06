# إصلاح مودالات المجلدات في الـ Sidebar

## المشكلة
كانت أزرار التعديل والنقل والحذف في مودال المجلد (عند فتحه من الـ Sidebar) لا تظهر المودالات الخاصة بها. بدلاً من ذلك، كانت تغلق المودال وتنتقل إلى صفحة الأرشيف.

## الحل
تم إضافة المودالات الثلاثة المفقودة إلى الـ Sidebar:
1. **EditFolderModal** - مودال تعديل المجلد
2. **MoveFolderModal** - مودال نقل المجلد
3. **DeleteFolderModal** - مودال حذف المجلد

## التغييرات المُنفذة

### 1. تحديث الاستيرادات في `Sidebar.jsx`
```javascript
import { 
    FolderViewModal, 
    EditFolderModal, 
    MoveFolderModal, 
    DeleteFolderModal 
} from '../archive';
```

### 2. إضافة States جديدة
```javascript
const [editingFolder, setEditingFolder] = useState(null);
const [movingFolder, setMovingFolder] = useState(null);
const [deletingFolder, setDeletingFolder] = useState(null);
```

### 3. تحديث معالجات FolderViewModal
```javascript
onEdit={(folderId) => {
    setViewingFolder(null);
    setEditingFolder(folderId);
}}
onMove={(folderId) => {
    setViewingFolder(null);
    setMovingFolder(folderId);
}}
onDelete={(folderId) => {
    setViewingFolder(null);
    setDeletingFolder(folderId);
}}
```

### 4. إضافة عرض المودالات الثلاثة
```javascript
{editingFolder && (
    <EditFolderModal
        isOpen={true}
        onClose={() => setEditingFolder(null)}
        folderId={editingFolder}
    />
)}

{movingFolder && (
    <MoveFolderModal
        isOpen={true}
        onClose={() => setMovingFolder(null)}
        folderId={movingFolder}
    />
)}

{deletingFolder && (
    <DeleteFolderModal
        isOpen={true}
        onClose={() => {
            setDeletingFolder(null);
            loadSidebarData(); // إعادة تحميل البيانات بعد الحذف
        }}
        folderId={deletingFolder}
    />
)}
```

## سير العمل الآن

### عند الضغط على مجلد مثبت في Sidebar:
1. يفتح `FolderViewModal` - عرض تفاصيل المجلد

### من داخل FolderViewModal:
2. **زر التعديل** ✏️ → يغلق مودال العرض ويفتح `EditFolderModal`
3. **زر النقل** 📁 → يغلق مودال العرض ويفتح `MoveFolderModal`
4. **زر الحذف** 🗑️ → يغلق مودال العرض ويفتح `DeleteFolderModal`

### بعد التعديل/النقل/الحذف:
5. يغلق المودال المفتوح
6. في حالة الحذف: يتم إعادة تحميل بيانات Sidebar تلقائياً

## التطابق مع صفحة الأرشيف
الآن يعمل Sidebar بنفس طريقة عمل صفحة الأرشيف تماماً:
- ✅ نفس المودالات
- ✅ نفس المعالجات
- ✅ نفس سير العمل
- ✅ نفس التجربة

## نتائج البناء
```
Build Successful
dist-vite/assets/main-e0dc64bf.js    382.82 kB │ gzip: 98.56 kB
```

## الملفات المُعدلة
- `src/components/layout/Sidebar.jsx`

## الحالة
✅ **مكتمل** - جميع أزرار المجلدات في Sidebar تعمل وتفتح المودالات الصحيحة
