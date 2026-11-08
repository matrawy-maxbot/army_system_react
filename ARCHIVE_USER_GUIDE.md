# 📁 الدليل الشامل لصفحة الأرشيف | Archive System Complete Guide

## 📋 جدول المحتويات

1. [نظرة عامة](#overview)
2. [الهيكل الهرمي للأرشيف](#hierarchy)
3. [العلاقة مع الـ Sidebar](#sidebar-relation)
4. [صفحة الأرشيف الرئيسية](#main-page)
5. [بطاقات الفئات](#category-cards)
6. [بطاقات المجلدات](#folder-cards)
7. [المودالات (النوافذ المنبثقة)](#modals)
8. [نظام التثبيت في Sidebar](#pinning-system)
9. [إدارة الملفات](#file-management)
10. [نظام الألوان](#color-system)
11. [سيناريوهات الاستخدام](#scenarios)
12. [نصائح للمستخدم المبتدئ](#beginner-tips)
13. [نصائح للاستخدام الاحترافي](#pro-tips)
14. [حل المشاكل الشائعة](#troubleshooting)

---

## 🎯 1. نظرة عامة <a name="overview"></a>

### ما هو نظام الأرشيف؟

نظام الأرشيف هو نظام تنظيم هرمي لحفظ وإدارة الملفات والمستندات المهمة. يتيح لك:

- ✅ **تنظيم الملفات** في بنية هرمية واضحة (فئات → مجلدات → ملفات)
- ✅ **رفع ملفات** بأنواع متعددة (PDF, DOCX, XLSX, PPTX, Images)
- ✅ **تثبيت عناصر** مهمة في Sidebar للوصول السريع
- ✅ **نقل المجلدات** بين الفئات
- ✅ **إضافة مفضلة** للملفات المهمة
- ✅ **معاينة وتحميل** الملفات

---

## 🏗️ 2. الهيكل الهرمي للأرشيف <a name="hierarchy"></a>

### البنية الهرمية الثلاثية المستويات

```
📦 نظام الأرشيف
│
├── 📂 الفئات (Archive Categories)
│   │   - مثال: "المستندات الإدارية"
│   │   - مثال: "التقارير السنوية"
│   │   - مثال: "الملفات القانونية"
│   │
│   ├── 📁 المجلدات (Folders)
│   │   │   - مثال: "مجلد يناير 2024"
│   │   │   - مثال: "التقارير الشهرية"
│   │   │   - مثال: "العقود"
│   │   │
│   │   └── 📄 الملفات (Files)
│   │       - مثال: "تقرير_يناير.pdf"
│   │       - مثال: "عقد_موظف.docx"
│   │       - مثال: "جدول_بيانات.xlsx"
```

### شرح المستويات

| المستوى | الوصف | مثال | الرمز |
|---------|-------|-------|-------|
| **الفئات** | التصنيف الأكبر والأعم | "المستندات الإدارية" | 📂 |
| **المجلدات** | تصنيف فرعي داخل الفئة | "مجلد يناير 2024" | 📁 |
| **الملفات** | الملفات الفعلية المخزنة | "تقرير.pdf" | 📄 |

---

## 🎛️ 3. العلاقة مع الـ Sidebar <a name="sidebar-relation"></a>

### قسم "العناصر المثبتة" في Sidebar

```
┌─────────────────────────────┐
│ 🏠 الصفحة الرئيسية         │
│ 📨 الفاكسات                │
│ 📋 القوالب                 │
│ 🔔 التذكيرات               │
│ ✅ المهام                  │
│ 📝 القوائم                 │
├─────────────────────────────┤
│ 📌 العناصر المثبتة        │ ← قسم خاص بالأرشيف
│   📁 مجلد التقارير (5)    │ ← مجلد مثبت
│   📄 عقد_موظف.pdf         │ ← ملف مثبت
└─────────────────────────────┘
│ 📂 الأرشيف                │
│ ⚙️ الإعدادات               │
└─────────────────────────────┘
```

### كيفية ظهور العناصر المثبتة

#### 1. **المجلدات المثبتة**

```javascript
{
  id: 123,
  name: "مجلد التقارير",
  isPinned: true,
  files: [file1, file2, ...] // 5 ملفات
}
```

**في Sidebar:**
```
📁 مجلد التقارير (5)
     └── رقم (5) = عدد الملفات في المجلد
```

#### 2. **الملفات المثبتة**

```javascript
{
  id: 456,
  name: "عقد_موظف.pdf",
  type: "pdf",
  isPinned: true
}
```

**في Sidebar:**
```
📄 عقد_موظف.pdf
     └── رمز الملف يتغير حسب النوع (PDF, Word, Excel)
```

### أنواع الرموز في Sidebar

| نوع العنصر | الرمز | مثال |
|-----------|-------|-------|
| مجلد مثبت | 📁 | 📁 مجلد التقارير (12) |
| ملف PDF | 📄 | 📄 تقرير.pdf |
| ملف Word | 📝 | 📝 مستند.docx |
| ملف Excel | 📊 | 📊 جدول.xlsx |
| ملف PowerPoint | 📊 | 📊 عرض.pptx |
| صورة | 🖼️ | 🖼️ صورة.jpg |

### التفاعل مع Sidebar

#### عند النقر على مجلد مثبت:
1. فتح modal "FolderViewModal"
2. عرض جميع الملفات داخل المجلد
3. إمكانية رفع ملفات جديدة
4. إمكانية فتح/حذف الملفات

#### عند النقر على ملف مثبت:
1. فتح modal "FileDetailModal"
2. عرض معلومات الملف الكاملة
3. أزرار: تحميل، حذف، إلغاء التثبيت

---

## 📄 4. صفحة الأرشيف الرئيسية <a name="main-page"></a>

### تخطيط الصفحة (Layout)

```
┌─────────────────────────────────────────────────────┐
│  🏠 > 📂 الأرشيف                                    │ ← Breadcrumb
├─────────────────────────────────────────────────────┤
│  📂 الأرشيف                                         │
│  نظام تنظيم الملفات والمستندات                     │
│                                    [+ إضافة فئة ⬇️] │ ← زر إضافة فئة
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ 📂 الفئة 1   │ │ 📂 الفئة 2   │ │ 📂 الفئة 3   ││
│  │              │ │              │ │              ││
│  │ 5 مجلدات    │ │ 3 مجلدات    │ │ 8 مجلدات    ││
│  └──────────────┘ └──────────────┘ └──────────────┘│
│                                                     │
│  ┌──────────────┐ ┌──────────────┐                 │
│  │ 📂 الفئة 4   │ │ 📂 الفئة 5   │                 │
│  └──────────────┘ └──────────────┘                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### العناصر الرئيسية

#### 1. **Header (الرأس)**

```html
<div class="archive-header">
  <div>
    <h1>📂 الأرشيف</h1>
    <p>نظام تنظيم الملفات والمستندات</p>
  </div>
  <button>+ إضافة فئة أرشيف</button>
</div>
```

**الوظيفة:**
- عرض عنوان الصفحة ووصف مختصر
- زر لإضافة فئة جديدة (يفتح AddArchiveCategoryModal)

#### 2. **Grid الفئات (ArchiveGrid)**

```css
.archive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
```

**الوظيفة:**
- عرض جميع فئات الأرشيف في شبكة متجاوبة
- كل بطاقة = فئة واحدة

---

## 🎴 5. بطاقات الفئات (Category Cards) <a name="category-cards"></a>

### تصميم البطاقة

```
┌─────────────────────────────────────┐
│ 📂 المستندات الإدارية              │ ← اسم الفئة
│                                     │
│ 📁 5 مجلدات                        │ ← عدد المجلدات
│                                     │
│ [+ إضافة مجلد]        [عرض الكل ↗️] │ ← أزرار الإجراءات
└─────────────────────────────────────┘
```

### الكود الفعلي (ArchiveCategoryCard)

```javascript
<div className="archive-category-card">
  <div className="category-header">
    <h3>📂 {category.name}</h3>
  </div>
  
  <div className="category-stats">
    <span>📁 {category.folders?.length || 0} مجلدات</span>
  </div>
  
  <div className="category-actions">
    <button onClick={handleAddFolder}>+ إضافة مجلد</button>
    <button onClick={handleViewAll}>عرض الكل</button>
  </div>
</div>
```

### وظائف البطاقة

| العنصر | الوظيفة | Modal المفتوح |
|--------|---------|---------------|
| **زر "إضافة مجلد"** | إضافة مجلد جديد في هذه الفئة | AddFolderModal |
| **زر "عرض الكل"** | عرض جميع المجلدات في modal كبير | FolderViewModal |
| **عنوان الفئة** | معلومات فقط | - |

---

## 📁 6. بطاقات المجلدات (Folder Cards) <a name="folder-cards"></a>

### تصميم البطاقة (داخل FolderViewModal)

```
┌─────────────────────────────────────┐
│ 📁 مجلد التقارير الشهرية           │ ← اسم المجلد
│ تقارير شهرية لعام 2024             │ ← وصف المجلد
│                                     │
│ 📄 12 ملف                          │ ← عدد الملفات
│ 📅 2024-01-15                       │ ← تاريخ الإنشاء
│                                     │
│ [📌]  [✏️]  [🗑️]  [↗️]  [فتح ↗️]   │ ← أزرار الإجراءات
└─────────────────────────────────────┘
```

### الأزرار والوظائف

| الزر | الأيقونة | الوظيفة | التفاصيل |
|-----|---------|---------|----------|
| **تثبيت** | 📌 | تثبيت المجلد في Sidebar | `isPinned: true/false` |
| **تعديل** | ✏️ | تعديل اسم ووصف المجلد | EditFolderModal |
| **حذف** | 🗑️ | حذف المجلد وجميع ملفاته | DeleteFolderModal |
| **نقل** | ↗️ | نقل المجلد لفئة أخرى | MoveFolderModal |
| **فتح** | فتح ↗️ | عرض الملفات داخل المجلد | FolderViewModal (detail) |

### الكود الفعلي (FolderCard)

```javascript
<div className="folder-card">
  <div className="folder-header">
    <h4>📁 {folder.name}</h4>
    {folder.description && (
      <p className="folder-description">{folder.description}</p>
    )}
  </div>
  
  <div className="folder-stats">
    <span>📄 {folder.files?.length || 0} ملف</span>
    <span>📅 {formatDate(folder.createdAt)}</span>
  </div>
  
  <div className="folder-actions">
    <button onClick={handlePin} title="تثبيت">
      {folder.isPinned ? '📌' : '📍'}
    </button>
    <button onClick={handleEdit} title="تعديل">✏️</button>
    <button onClick={handleDelete} title="حذف">🗑️</button>
    <button onClick={handleMove} title="نقل">↗️</button>
    <button onClick={handleOpen}>فتح ↗️</button>
  </div>
</div>
```

---

## 🪟 7. المودالات (النوافذ المنبثقة) <a name="modals"></a>

### قائمة المودالات الكاملة

| # | اسم المودال | الوظيفة | متى يفتح |
|---|-------------|---------|----------|
| 1 | AddArchiveCategoryModal | إضافة فئة أرشيف جديدة | عند النقر على "+ إضافة فئة أرشيف" |
| 2 | AddFolderModal | إضافة مجلد جديد | عند النقر على "+ إضافة مجلد" في بطاقة فئة |
| 3 | FolderViewModal | عرض محتويات المجلد | عند النقر على "عرض الكل" أو "فتح" |
| 4 | FileDetailModal | عرض تفاصيل ملف | عند النقر على ملف في FolderViewModal |
| 5 | EditFolderModal | تعديل معلومات مجلد | عند النقر على "✏️" في بطاقة مجلد |
| 6 | DeleteFolderModal | تأكيد حذف مجلد | عند النقر على "🗑️" في بطاقة مجلد |
| 7 | MoveFolderModal | نقل مجلد لفئة أخرى | عند النقر على "↗️" في بطاقة مجلد |

---

### 📝 المودال 1: AddArchiveCategoryModal

#### الغرض
إضافة فئة أرشيف جديدة (المستوى الأول في الهرمية)

#### التصميم

```
┌────────────────────────────────────┐
│  إضافة فئة أرشيف جديدة        [✖️] │
├────────────────────────────────────┤
│                                    │
│  اسم الفئة *                       │
│  ┌──────────────────────────────┐  │
│  │ مثال: المستندات الإدارية    │  │
│  └──────────────────────────────┘  │
│                                    │
│  [حفظ الفئة]           [إلغاء]     │
└────────────────────────────────────┘
```

#### الحقول

| الحقل | نوع الإدخال | مطلوب | القيمة الافتراضية |
|-------|-------------|-------|-------------------|
| **اسم الفئة** | Input (text) | ✅ نعم | فارغ |

#### المميزات
- ✅ حقل واحد بسيط
- ✅ التحقق من الحقل (لا يمكن حفظ حقل فارغ)
- ✅ إضافة الفئة الجديدة في `appState.archiveCategories`

#### الكود

```javascript
const handleSave = async () => {
  if (!categoryName.trim()) {
    setError('الرجاء إدخال اسم الفئة');
    return;
  }

  const newCategory = {
    id: Date.now(),
    name: categoryName.trim(),
    folders: [] // بدون مجلدات في البداية
  };

  setAppState({
    ...appState,
    archiveCategories: [...(appState.archiveCategories || []), newCategory]
  });

  await saveData();
  handleClose();
};
```

---

### 📁 المودال 2: AddFolderModal

#### الغرض
إضافة مجلد جديد داخل فئة محددة

#### التصميم

```
┌────────────────────────────────────┐
│  إضافة مجلد جديد              [✖️] │
├────────────────────────────────────┤
│                                    │
│  اسم المجلد *                      │
│  ┌──────────────────────────────┐  │
│  │ أدخل اسم المجلد...          │  │
│  └──────────────────────────────┘  │
│                                    │
│  وصف المجلد                       │
│  ┌──────────────────────────────┐  │
│  │ وصف اختياري للمجلد...       │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  [حفظ المجلد]          [إلغاء]     │
└────────────────────────────────────┘
```

#### الحقول

| الحقل | نوع الإدخال | مطلوب | القيمة الافتراضية |
|-------|-------------|-------|-------------------|
| **اسم المجلد** | Input (text) | ✅ نعم | فارغ |
| **وصف المجلد** | Textarea | ❌ لا | فارغ |

#### المميزات
- ✅ حقلان: اسم (مطلوب) + وصف (اختياري)
- ✅ إضافة المجلد في الفئة المحددة
- ✅ التحقق من الحقل المطلوب

#### الكود

```javascript
const handleSave = async () => {
  if (!folderName.trim()) {
    setError('الرجاء إدخال اسم المجلد');
    return;
  }

  const newFolder = {
    id: Date.now(),
    name: folderName.trim(),
    description: folderDescription.trim(),
    categoryId: categoryId, // الفئة الحالية
    files: [], // بدون ملفات في البداية
    createdAt: new Date().toISOString(),
    isPinned: false,
    isFavorite: false
  };

  // إضافة المجلد للفئة المحددة
  const updatedCategories = appState.archiveCategories.map(cat => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        folders: [...(cat.folders || []), newFolder]
      };
    }
    return cat;
  });

  setAppState({
    ...appState,
    archiveCategories: updatedCategories
  });

  await saveData();
  handleClose();
};
```

---

### 🗂️ المودال 3: FolderViewModal

#### الغرض
عرض جميع الملفات داخل مجلد + رفع ملفات جديدة

#### التصميم (وضع العرض)

```
┌──────────────────────────────────────────┐
│  📁 مجلد التقارير الشهرية          [✖️] │
│  تقارير شهرية لعام 2024                 │
├──────────────────────────────────────────┤
│                                          │
│  [📤 رفع ملفات]                         │ ← زر رفع ملفات
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 📄 تقرير_يناير.pdf                │  │
│  │ 📅 2024-01-15  |  💾 2.5 MB        │  │
│  │ [⭐] [📌] [⬇️] [🗑️] [عرض التفاصيل] │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 📊 جدول_بيانات.xlsx               │  │
│  │ 📅 2024-01-20  |  💾 1.2 MB        │  │
│  │ [⭐] [📌] [⬇️] [🗑️] [عرض التفاصيل] │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 📝 مستند.docx                      │  │
│  │ 📅 2024-02-01  |  💾 890 KB        │  │
│  │ [⭐] [📌] [⬇️] [🗑️] [عرض التفاصيل] │  │
│  └────────────────────────────────────┘  │
│                                          │
│                              [إغلاق]     │
└──────────────────────────────────────────┘
```

#### العناصر الرئيسية

##### 1. Header المجلد

```javascript
<div className="folder-modal-header">
  <h2>📁 {folder.name}</h2>
  {folder.description && (
    <p className="folder-description">{folder.description}</p>
  )}
</div>
```

##### 2. زر رفع الملفات

```javascript
<button className="upload-btn" onClick={handleFileUpload}>
  📤 رفع ملفات
</button>

// عند النقر:
<input 
  type="file" 
  multiple 
  accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png"
  onChange={handleFilesSelected}
/>
```

##### 3. قائمة الملفات

```javascript
{folder.files.map(file => (
  <div key={file.id} className="file-item">
    <div className="file-info">
      <span className="file-icon">{getFileIcon(file.type)}</span>
      <span className="file-name">{file.name}</span>
    </div>
    
    <div className="file-meta">
      <span>📅 {formatDate(file.createdAt)}</span>
      <span>💾 {formatSize(file.size)}</span>
    </div>
    
    <div className="file-actions">
      <button onClick={() => handleFavorite(file.id)}>
        {file.isFavorite ? '⭐' : '☆'}
      </button>
      <button onClick={() => handlePin(file.id)}>
        {file.isPinned ? '📌' : '📍'}
      </button>
      <button onClick={() => handleDownload(file)}>⬇️</button>
      <button onClick={() => handleDelete(file.id)}>🗑️</button>
      <button onClick={() => openFileDetail(file)}>عرض التفاصيل</button>
    </div>
  </div>
))}
```

#### أزرار الملف الفردي

| الزر | الأيقونة | الوظيفة |
|-----|---------|---------|
| **مفضل** | ⭐/☆ | إضافة/إزالة من المفضلة |
| **تثبيت** | 📌/📍 | تثبيت في Sidebar |
| **تحميل** | ⬇️ | تحميل الملف |
| **حذف** | 🗑️ | حذف الملف |
| **التفاصيل** | عرض التفاصيل | فتح FileDetailModal |

#### رفع الملفات (Upload)

```javascript
const handleFilesSelected = async (event) => {
  const files = Array.from(event.target.files);
  
  for (const file of files) {
    // نسخ الملف إلى مجلد assets
    const savedPath = await electronAPI.saveFileToAssets(file);
    
    // إضافة الملف لبيانات المجلد
    const newFile = {
      id: Date.now() + Math.random(),
      name: file.name,
      type: getFileType(file.name),
      size: file.size,
      path: savedPath,
      createdAt: new Date().toISOString(),
      isPinned: false,
      isFavorite: false,
      folderId: folder.id
    };
    
    // تحديث state
    // ... update folder.files
  }
  
  await saveData();
};
```

---

### 📄 المودال 4: FileDetailModal

#### الغرض
عرض تفاصيل ملف واحد + إجراءات (تحميل، حذف، تثبيت)

#### التصميم

```
┌──────────────────────────────────────────┐
│  📄 تفاصيل الملف                   [✖️] │
├──────────────────────────────────────────┤
│                                          │
│  📄 تقرير_يناير.pdf                     │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 📋 معلومات الملف:                 │  │
│  │                                    │  │
│  │ • النوع: PDF                      │  │
│  │ • الحجم: 2.5 MB                   │  │
│  │ • تاريخ الإضافة: 2024-01-15       │  │
│  │ • المجلد: مجلد التقارير           │  │
│  │ • الفئة: المستندات الإدارية       │  │
│  │                                    │  │
│  │ 📌 مثبت في Sidebar                │  │
│  │ ⭐ مضاف للمفضلة                   │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [⬇️ تحميل]  [🗑️ حذف]  [📌 إلغاء التثبيت]│
│                              [إغلاق]     │
└──────────────────────────────────────────┘
```

#### المعلومات المعروضة

| البيانات | الوصف | مصدر البيانات |
|----------|-------|---------------|
| **اسم الملف** | الاسم الكامل مع الامتداد | `file.name` |
| **النوع** | نوع الملف (PDF, Word, Excel, etc.) | `file.type` |
| **الحجم** | حجم الملف بالميجابايت | `file.size` مع formatSize() |
| **تاريخ الإضافة** | متى تم رفع الملف | `file.createdAt` |
| **المجلد** | اسم المجلد الموجود فيه | `folder.name` |
| **الفئة** | اسم الفئة | `category.name` |
| **حالة التثبيت** | مثبت أو غير مثبت | `file.isPinned` |
| **حالة المفضلة** | مفضل أو لا | `file.isFavorite` |

#### الأزرار

| الزر | الوظيفة | الكود |
|-----|---------|-------|
| **⬇️ تحميل** | تحميل الملف للجهاز | `electronAPI.downloadFile(file.path)` |
| **🗑️ حذف** | حذف الملف نهائياً | حذف من folder.files + حذف من assets |
| **📌 إلغاء التثبيت** | إلغاء التثبيت في Sidebar | `file.isPinned = false` |
| **إغلاق** | إغلاق المودال | `onClose()` |

---

### ✏️ المودال 5: EditFolderModal

#### الغرض
تعديل اسم ووصف مجلد موجود

#### التصميم

```
┌────────────────────────────────────┐
│  تعديل المجلد                 [✖️] │
├────────────────────────────────────┤
│                                    │
│  اسم المجلد *                      │
│  ┌──────────────────────────────┐  │
│  │ مجلد التقارير الشهرية       │  │
│  └──────────────────────────────┘  │
│                                    │
│  وصف المجلد                       │
│  ┌──────────────────────────────┐  │
│  │ تقارير شهرية لعام 2024      │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  [حفظ التغييرات]       [إلغاء]     │
└────────────────────────────────────┘
```

#### الوظيفة

```javascript
const handleSave = async () => {
  if (!folderName.trim()) {
    setError('الرجاء إدخال اسم المجلد');
    return;
  }

  // تحديث المجلد في الفئة
  const updatedCategories = appState.archiveCategories.map(cat => ({
    ...cat,
    folders: cat.folders?.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          name: folderName.trim(),
          description: folderDescription.trim()
        };
      }
      return f;
    })
  }));

  setAppState({ ...appState, archiveCategories: updatedCategories });
  await saveData();
  handleClose();
};
```

---

### 🗑️ المودال 6: DeleteFolderModal

#### الغرض
تأكيد حذف مجلد (وجميع ملفاته)

#### التصميم

```
┌────────────────────────────────────┐
│  تأكيد حذف المجلد             [✖️] │
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐  │
│  │      ⚠️ تحذير                │  │
│  │                              │  │
│  │  هل أنت متأكد من حذف المجلد  │  │
│  │  "مجلد التقارير الشهرية"؟   │  │
│  │                              │  │
│  │  يحتوي المجلد على 12 ملف    │  │
│  │  سيتم حذفها أيضاً            │  │
│  │                              │  │
│  │  ⚠️ ملاحظة: حذف المجلد سيؤدي │  │
│  │  إلى حذف جميع الملفات الموجودة│  │
│  │  فيه                         │  │
│  └──────────────────────────────┘  │
│                                    │
│  [🗑️ حذف المجلد]         [إلغاء]  │
└────────────────────────────────────┘
```

#### التحذيرات

```javascript
<div className="warning-message">
  <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor">
    {/* Warning Icon */}
  </svg>
  <p>
    هل أنت متأكد من حذف المجلد "<strong>{folder.name}</strong>"؟
  </p>
  {folder.files && folder.files.length > 0 && (
    <p>
      يحتوي المجلد على {folder.files.length} ملف سيتم حذفها أيضاً
    </p>
  )}
  <p style={{ fontSize: '13px', color: '#b45309' }}>
    ملاحظة: حذف المجلد سيؤدي إلى حذف جميع الملفات الموجودة فيه
  </p>
</div>
```

#### الوظيفة (الحذف الفعلي)

```javascript
const handleDelete = async () => {
  // 1. حذف الملفات من assets
  if (folder.files && folder.files.length > 0) {
    for (const file of folder.files) {
      try {
        await electronAPI.deleteFileFromAssets(file.path || file.name);
      } catch (err) {
        console.warn('Could not delete file:', file.name, err);
      }
    }
  }

  // 2. حذف المجلد من الفئة
  const updatedCategories = appState.archiveCategories.map(cat => {
    if (cat.id === category.id) {
      return {
        ...cat,
        folders: cat.folders?.filter(f => f.id !== folderId) || []
      };
    }
    return cat;
  });

  setAppState({ ...appState, archiveCategories: updatedCategories });
  await saveData();
  handleClose();
};
```

---

### ↗️ المودال 7: MoveFolderModal

#### الغرض
نقل مجلد من فئة إلى فئة أخرى

#### التصميم

```
┌────────────────────────────────────┐
│  نقل المجلد إلى فئة أخرى      [✖️] │
├────────────────────────────────────┤
│                                    │
│  الفئة الحالية                    │
│  ┌──────────────────────────────┐  │
│  │ المستندات الإدارية (locked) │  │
│  └──────────────────────────────┘  │
│                                    │
│  الفئة الجديدة *                  │
│  ┌──────────────────────────────┐  │
│  │ التقارير السنوية ⬇️         │  │
│  └──────────────────────────────┘  │
│  ├─ الملفات القانونية              │
│  ├─ الأرشيف العام                  │
│  └─ المشاريع                       │
│                                    │
│  [نقل المجلد]             [إلغاء]  │
└────────────────────────────────────┘
```

#### الحقول

| الحقل | نوع الإدخال | مطلوب | الوصف |
|-------|-------------|-------|-------|
| **الفئة الحالية** | Input (readonly) | - | عرض فقط، غير قابل للتعديل |
| **الفئة الجديدة** | Select (dropdown) | ✅ نعم | قائمة الفئات الأخرى المتاحة |

#### الوظيفة

```javascript
const handleMove = async () => {
  if (!selectedCategoryId) {
    setError('الرجاء اختيار فئة');
    return;
  }

  const updatedCategories = appState.archiveCategories.map(cat => {
    // إزالة المجلد من الفئة القديمة
    if (cat.id === currentCategory.id) {
      return {
        ...cat,
        folders: cat.folders?.filter(f => f.id !== folderId) || []
      };
    }
    
    // إضافة المجلد للفئة الجديدة
    if (cat.id === selectedCategoryId) {
      return {
        ...cat,
        folders: [
          ...(cat.folders || []),
          { ...folder, categoryId: selectedCategoryId }
        ]
      };
    }
    
    return cat;
  });

  setAppState({ ...appState, archiveCategories: updatedCategories });
  await saveData();
  handleClose();
};
```

#### الحالات الخاصة

##### لا توجد فئات أخرى

```
┌────────────────────────────────────┐
│  نقل المجلد                   [✖️] │
├────────────────────────────────────┤
│                                    │
│  لا توجد فئات أخرى متاحة لنقل     │
│  المجلد إليها.                    │
│                                    │
│                        [إغلاق]     │
└────────────────────────────────────┘
```

---

## 📌 8. نظام التثبيت في Sidebar <a name="pinning-system"></a>

### كيف يعمل التثبيت؟

#### 1. تثبيت المجلد

```javascript
// عند النقر على زر التثبيت في FolderCard
const handlePinFolder = (folderId) => {
  const updatedCategories = appState.archiveCategories.map(cat => ({
    ...cat,
    folders: cat.folders?.map(f => {
      if (f.id === folderId) {
        return { ...f, isPinned: !f.isPinned };
      }
      return f;
    })
  }));

  setAppState({ ...appState, archiveCategories: updatedCategories });
  saveData();
};
```

**النتيجة في Sidebar:**
```
📌 العناصر المثبتة
  📁 مجلد التقارير (12)  ← ظهور المجلد
```

#### 2. تثبيت الملف

```javascript
// عند النقر على زر التثبيت لملف داخل FolderViewModal
const handlePinFile = (fileId, folderId) => {
  const updatedCategories = appState.archiveCategories.map(cat => ({
    ...cat,
    folders: cat.folders?.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          files: f.files?.map(file => {
            if (file.id === fileId) {
              return { ...file, isPinned: !file.isPinned };
            }
            return file;
          })
        };
      }
      return f;
    })
  }));

  setAppState({ ...appState, archiveCategories: updatedCategories });
  saveData();
};
```

**النتيجة في Sidebar:**
```
📌 العناصر المثبتة
  📁 مجلد التقارير (12)
  📄 عقد_موظف.pdf        ← ظهور الملف
```

### جلب العناصر المثبتة

```javascript
// في Sidebar Component
const getPinnedArchiveItems = () => {
  const pinnedItems = [];
  
  if (appState.archiveCategories) {
    appState.archiveCategories.forEach(category => {
      category.folders?.forEach(folder => {
        // المجلدات المثبتة
        if (folder.isPinned) {
          pinnedItems.push({
            type: 'folder',
            id: folder.id,
            name: folder.name,
            filesCount: folder.files?.length || 0,
            categoryId: category.id
          });
        }
        
        // الملفات المثبتة
        folder.files?.forEach(file => {
          if (file.isPinned) {
            pinnedItems.push({
              type: 'file',
              id: file.id,
              name: file.name,
              fileType: file.type,
              folderId: folder.id,
              categoryId: category.id
            });
          }
        });
      });
    });
  }
  
  return pinnedItems;
};
```

### العرض في Sidebar

```javascript
const pinnedItems = getPinnedArchiveItems();

return (
  <div className="sidebar-section">
    <h3>📌 العناصر المثبتة</h3>
    {pinnedItems.map(item => (
      <div key={item.id} className="pinned-item" onClick={() => handlePinnedClick(item)}>
        {item.type === 'folder' ? (
          <>
            <span>📁 {item.name}</span>
            <span className="count">({item.filesCount})</span>
          </>
        ) : (
          <>
            <span>{getFileIcon(item.fileType)} {item.name}</span>
          </>
        )}
      </div>
    ))}
  </div>
);
```

---

## 📂 9. إدارة الملفات <a name="file-management"></a>

### أنواع الملفات المدعومة

| النوع | الامتدادات | الأيقونة | الوصف |
|-------|-----------|---------|-------|
| **PDF** | .pdf | 📄 | ملفات PDF |
| **Word** | .doc, .docx | 📝 | مستندات Word |
| **Excel** | .xls, .xlsx | 📊 | جداول بيانات Excel |
| **PowerPoint** | .ppt, .pptx | 📊 | عروض تقديمية |
| **صور** | .jpg, .jpeg, .png, .gif | 🖼️ | ملفات الصور |

### دورة حياة الملف

#### 1. الرفع (Upload)

```javascript
// في FolderViewModal
const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files);
  
  for (const file of files) {
    // نسخ الملف إلى assets
    const savedPath = await electronAPI.saveFileToAssets(file);
    
    // إنشاء كائن الملف
    const newFile = {
      id: Date.now() + Math.random(),
      name: file.name,
      type: getFileType(file.name), // "pdf", "docx", etc.
      size: file.size,
      path: savedPath,
      createdAt: new Date().toISOString(),
      isPinned: false,
      isFavorite: false,
      folderId: currentFolder.id
    };
    
    // إضافة للمجلد
    updatedFolder.files.push(newFile);
  }
  
  await saveData();
};
```

#### 2. العرض (Display)

```javascript
const getFileIcon = (fileType) => {
  const icons = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '📊',
    pptx: '📊',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️'
  };
  return icons[fileType] || '📄';
};
```

#### 3. التحميل (Download)

```javascript
const handleDownload = async (file) => {
  try {
    await electronAPI.downloadFile(file.path, file.name);
    // يفتح dialog لحفظ الملف
  } catch (err) {
    console.error('Error downloading file:', err);
  }
};
```

#### 4. الحذف (Delete)

```javascript
const handleDeleteFile = async (fileId, folderId) => {
  // 1. حذف الملف من assets
  const file = findFile(fileId, folderId);
  await electronAPI.deleteFileFromAssets(file.path);
  
  // 2. حذف من بيانات المجلد
  const updatedCategories = appState.archiveCategories.map(cat => ({
    ...cat,
    folders: cat.folders?.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          files: f.files?.filter(file => file.id !== fileId)
        };
      }
      return f;
    })
  }));
  
  setAppState({ ...appState, archiveCategories: updatedCategories });
  await saveData();
};
```

### تنسيق الحجم

```javascript
const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// أمثلة:
// 1024 → "1 KB"
// 2621440 → "2.5 MB"
// 890000 → "869.14 KB"
```

---

## 🎨 10. نظام الألوان <a name="color-system"></a>

### الألوان الرئيسية

```css
/* ألوان الفئات */
.archive-category-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.archive-category-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* ألوان المجلدات */
.folder-card {
  background: #f8f9fb;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.folder-card.pinned {
  background: #fffbeb; /* أصفر فاتح للمثبتة */
  border-color: #fbbf24;
}

/* ألوان الملفات */
.file-item {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 12px;
  border-radius: 8px;
}

.file-item.favorite {
  background: #fef3c7; /* أصفر للمفضلة */
}

.file-item.pinned {
  background: #e0f2fe; /* أزرق فاتح للمثبتة */
}
```

### ألوان الأزرار

```css
/* زر إضافة فئة/مجلد */
.primary-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

/* زر الحذف */
.danger-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

/* زر ثانوي */
.secondary-btn {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}
```

### ألوان الحالات

| الحالة | اللون | الاستخدام |
|--------|-------|-----------|
| **عادي** | أبيض (#ffffff) | العناصر الافتراضية |
| **مثبت** | أزرق فاتح (#e0f2fe) | الملفات المثبتة |
| **مفضل** | أصفر فاتح (#fef3c7) | الملفات المفضلة |
| **Hover** | رمادي فاتح (#f8f9fb) | عند المرور بالماوس |
| **خطأ** | أحمر (#ef4444) | رسائل الخطأ |
| **تحذير** | أصفر (#f59e0b) | تحذيرات |

---

## 💼 11. سيناريوهات الاستخدام <a name="scenarios"></a>

### السيناريو 1: إنشاء أرشيف جديد من الصفر

**الخطوات:**

```
1. الدخول إلى صفحة الأرشيف
   ↓
2. النقر على "إضافة فئة أرشيف"
   ↓
3. إدخال اسم الفئة (مثلاً: "المستندات الإدارية")
   ↓
4. النقر على "حفظ الفئة"
   ↓
5. ظهور بطاقة الفئة الجديدة
   ↓
6. النقر على "إضافة مجلد" في بطاقة الفئة
   ↓
7. إدخال اسم المجلد ووصف اختياري
   ↓
8. النقر على "حفظ المجلد"
   ↓
9. النقر على "عرض الكل" لفتح المجلد
   ↓
10. النقر على "رفع ملفات"
    ↓
11. اختيار ملفات من الجهاز
    ↓
12. ظهور الملفات في المجلد
    ✅ تم إنشاء الأرشيف بنجاح
```

**الوقت المتوقع:** 3-5 دقائق

---

### السيناريو 2: تثبيت مجلد في Sidebar للوصول السريع

**الخطوات:**

```
1. الدخول إلى صفحة الأرشيف
   ↓
2. النقر على "عرض الكل" لفئة معينة
   ↓
3. ظهور قائمة المجلدات
   ↓
4. النقر على أيقونة التثبيت 📍 للمجلد المطلوب
   ↓
5. تتحول الأيقونة إلى 📌 (مثبت)
   ↓
6. فتح Sidebar
   ↓
7. رؤية المجلد في قسم "العناصر المثبتة"
   ↓
8. النقر على المجلد من Sidebar
   ↓
9. فتح محتويات المجلد مباشرة
   ✅ الوصول السريع ممكن الآن
```

**الوقت المتوقع:** 1 دقيقة

---

### السيناريو 3: نقل مجلد من فئة لأخرى

**الخطوات:**

```
1. الدخول إلى صفحة الأرشيف
   ↓
2. النقر على "عرض الكل" للفئة الحالية
   ↓
3. العثور على المجلد المراد نقله
   ↓
4. النقر على أيقونة النقل ↗️
   ↓
5. فتح modal "نقل المجلد إلى فئة أخرى"
   ↓
6. اختيار الفئة الجديدة من القائمة المنسدلة
   ↓
7. النقر على "نقل المجلد"
   ↓
8. اختفاء المجلد من الفئة القديمة
   ↓
9. ظهور المجلد في الفئة الجديدة
   ✅ تم النقل بنجاح
```

**الوقت المتوقع:** 30 ثانية

---

### السيناريو 4: رفع عدة ملفات دفعة واحدة

**الخطوات:**

```
1. فتح المجلد المطلوب (FolderViewModal)
   ↓
2. النقر على "📤 رفع ملفات"
   ↓
3. فتح نافذة اختيار الملفات
   ↓
4. اختيار ملفات متعددة (Ctrl+Click أو Shift+Click)
   ↓
5. النقر على "فتح"
   ↓
6. انتظار رفع الملفات (progress indicator)
   ↓
7. ظهور الملفات واحداً تلو الآخر في القائمة
   ✅ تم رفع جميع الملفات
```

**الوقت المتوقع:** 1-3 دقائق (حسب عدد وحجم الملفات)

---

### السيناريو 5: حذف مجلد وجميع محتوياته

**الخطوات:**

```
1. الدخول إلى صفحة الأرشيف
   ↓
2. فتح الفئة التي تحتوي المجلد
   ↓
3. النقر على أيقونة الحذف 🗑️ في بطاقة المجلد
   ↓
4. فتح modal "تأكيد حذف المجلد"
   ↓
5. قراءة التحذير (يحتوي على X ملف سيتم حذفها)
   ↓
6. النقر على "🗑️ حذف المجلد"
   ↓
7. حذف جميع الملفات من assets
   ↓
8. حذف المجلد من البيانات
   ↓
9. اختفاء بطاقة المجلد
   ✅ تم الحذف بنجاح
```

**⚠️ تحذير:** هذا الإجراء لا يمكن التراجع عنه!

**الوقت المتوقع:** 30 ثانية

---

## 🎓 12. نصائح للمستخدم المبتدئ <a name="beginner-tips"></a>

### ✅ البداية الصحيحة

#### 1. **ابدأ بالتخطيط**

قبل إنشاء الأرشيف، خطط للبنية:

```
مثال:
📂 الفئات التي أحتاجها:
  - المستندات الإدارية
  - التقارير السنوية
  - الملفات القانونية
  - المشاريع
  
📁 المجلدات داخل كل فئة:
  المستندات الإدارية:
    - مجلد 2024
    - مجلد 2023
    - العقود
    - الموارد البشرية
```

#### 2. **استخدم أسماء واضحة**

❌ **أسماء سيئة:**
- "مجلد 1"
- "ملفات"
- "جديد"

✅ **أسماء جيدة:**
- "تقارير يناير 2024"
- "عقود الموظفين 2024"
- "المشروع_أ_مستندات"

#### 3. **استخدم الأوصاف**

عند إنشاء مجلد، أضف وصفاً يوضح محتواه:

```
اسم المجلد: تقارير يناير 2024
الوصف: جميع التقارير الشهرية والأسبوعية لشهر يناير 2024
```

#### 4. **ثبت الأهم فقط**

لا تثبت كل شيء في Sidebar! ثبت فقط:
- ✅ المجلدات/الملفات التي تستخدمها يومياً
- ✅ المستندات العاجلة
- ✅ الملفات المرجعية المهمة

#### 5. **استخدم المفضلة بذكاء**

⭐ أضف للمفضلة:
- الملفات المهمة داخل مجلد كبير
- الملفات التي تحتاج مراجعتها قريباً
- المستندات الأساسية

---

### 🚫 أخطاء شائعة يجب تجنبها

| الخطأ | لماذا خطأ؟ | البديل الصحيح |
|-------|-----------|---------------|
| **حذف مجلد بدون نسخ احتياطي** | قد تفقد ملفات مهمة | حمّل المجلد قبل الحذف |
| **تثبيت 20+ عنصر** | Sidebar سيصبح مزدحماً | ثبت 5-10 عناصر فقط |
| **أسماء مجلدات متشابهة** | صعوبة في التمييز | استخدم أسماء فريدة |
| **رفع ملفات ضخمة جداً** | بطء في النظام | قسّم الملفات الكبيرة |
| **عدم استخدام الأوصاف** | نسيان محتوى المجلد | اكتب وصفاً دائماً |

---

## 🏆 13. نصائح للاستخدام الاحترافي <a name="pro-tips"></a>

### 💡 استراتيجيات متقدمة

#### 1. **نظام التسمية المنهجي**

استخدم بادئات (prefixes) لترتيب المجلدات:

```
01_يناير_2024
02_فبراير_2024
03_مارس_2024
...

أو:

A_عقود_نشطة
B_عقود_منتهية
C_عقود_معلقة
```

#### 2. **البنية الهرمية المثالية**

```
📂 الفئة = الموضوع العام
  📁 المجلد = الفترة الزمنية أو المشروع
    📄 الملف = المستند الفردي

مثال:
📂 التقارير السنوية
  📁 تقارير 2024
    📄 تقرير_يناير_2024.pdf
    📄 تقرير_فبراير_2024.pdf
  📁 تقارير 2023
    📄 تقرير_سنوي_2023.pdf
```

#### 3. **استخدام نظام الأرقام**

```
📂 المشاريع
  📁 001_مشروع_التطوير
  📁 002_مشروع_الصيانة
  📁 003_مشروع_التدريب
```

**الفوائد:**
- ترتيب تلقائي
- سهولة الإشارة للمشروع ("المشروع 001")
- تتبع عدد المشاريع

#### 4. **قوالب التسمية للملفات**

```
نوع_الملف_YYYY-MM-DD_الوصف.امتداد

أمثلة:
تقرير_2024-01-15_مبيعات.pdf
عقد_2024-02-01_موظف_أحمد.docx
جدول_2024-01-20_ميزانية_Q1.xlsx
```

#### 5. **إدارة المرفقات الكبيرة**

للملفات الضخمة (>10MB):
1. ضعها في مجلد مستقل
2. أضف ملف نصي يشرح المحتوى
3. استخدم ضغط الملفات إن أمكن

---

### ⚡ اختصارات الاحتراف

#### سير عمل سريع (Quick Workflow)

```
هدف: رفع 50 ملف منظم في 10 دقائق

1. جهّز الملفات على الجهاز في مجلدات مسماة
2. أنشئ الفئات والمجلدات دفعة واحدة
3. ارفع ملفات متعددة دفعة واحدة لكل مجلد
4. ثبّت المجلدات الأساسية فقط (2-3 مجلدات)
5. أضف الأوصاف لاحقاً إذا لزم الأمر
```

#### نسخ احتياطي منتظم

```
كل أسبوع:
1. حمّل جميع الملفات المهمة
2. احفظها في مجلد خارجي
3. سمّ المجلد: backup_YYYY-MM-DD
```

---

### 🔍 البحث والتنقل السريع

#### استخدم Sidebar بذكاء:

```
اجعل Sidebar يحتوي على:
1. مجلد "الأعمال الجارية" (للمشاريع النشطة)
2. مجلد "المراجعة السريعة" (للملفات التي تحتاج مراجعة)
3. ملف "الدليل" (PDF يشرح بنية الأرشيف)
4. ملفات المرجع الأساسية (العقود، السياسات)
```

---

## 🔧 14. حل المشاكل الشائعة <a name="troubleshooting"></a>

### المشكلة 1: "لا أرى المجلد المثبت في Sidebar"

**الأسباب المحتملة:**

1. ❌ لم يتم حفظ البيانات
   - **الحل:** تأكد من الضغط على زر التثبيت 📌 وانتظر ثانيتين

2. ❌ Sidebar لا يتحدث
   - **الحل:** أعد فتح Sidebar (اضغط على الأرشيف في القائمة)

3. ❌ تم إلغاء التثبيت بالخطأ
   - **الحل:** ثبّت المجلد مرة أخرى

**خطوات التحقق:**

```javascript
// في Console (F12)
const appState = JSON.parse(localStorage.getItem('appState'));
const pinnedFolders = [];

appState.archiveCategories.forEach(cat => {
  cat.folders?.forEach(folder => {
    if (folder.isPinned) {
      pinnedFolders.push(folder.name);
    }
  });
});

console.log('Pinned folders:', pinnedFolders);
// إذا كان فارغاً، المجلد غير مثبت فعلياً
```

---

### المشكلة 2: "فشل رفع الملف"

**الأسباب المحتملة:**

1. ❌ الملف كبير جداً (>100MB)
   - **الحل:** قسّم الملف أو ضغّطه

2. ❌ نوع الملف غير مدعوم
   - **الحل:** استخدم الأنواع المدعومة فقط (PDF, DOCX, XLSX, PPTX, Images)

3. ❌ خطأ في الصلاحيات
   - **الحل:** تأكد من صلاحيات الكتابة في مجلد assets

4. ❌ اسم الملف يحتوي رموز خاصة
   - **الحل:** أعد تسمية الملف بدون رموز مثل: `#`, `%`, `&`

---

### المشكلة 3: "اختفى مجلد بعد نقله"

**السبب:** خطأ في عملية النقل

**الحل:**

```
1. لا تُغلق الصفحة
2. افتح Console (F12)
3. نفذ:
   localStorage.getItem('appState_backup')
4. إذا وُجد backup، استرجعه
5. إذا لم يُوجد، المجلد في الفئة الجديدة فعلاً
6. ابحث في جميع الفئات
```

---

### المشكلة 4: "حذفت مجلداً بالخطأ"

**❌ للأسف:** الحذف نهائي ولا يمكن التراجع عنه

**الوقاية المستقبلية:**

```
1. حمّل المجلدات المهمة قبل الحذف
2. استخدم نظام النسخ الاحتياطي الأسبوعي
3. اقرأ التحذيرات في modal الحذف بتمعّن
4. اضغط "إلغاء" إذا لم تكن متأكداً 100%
```

---

### المشكلة 5: "الملف لا يُفتح بعد التحميل"

**الأسباب المحتملة:**

1. ❌ الملف تالف
   - **الحل:** ارفع الملف مرة أخرى من النسخة الأصلية

2. ❌ امتداد الملف خاطئ
   - **الحل:** أعد تسمية الملف بالامتداد الصحيح

3. ❌ لا يوجد برنامج لفتح هذا النوع
   - **الحل:** ثبّت البرنامج المناسب (مثلاً: Adobe Reader للـ PDF)

---

### المشكلة 6: "Sidebar مزدحم جداً"

**الحل:**

```
1. ألغِ تثبيت العناصر غير المستخدمة يومياً
2. احتفظ بـ 5-10 عناصر فقط
3. استخدم "المفضلة" داخل المجلدات بدلاً من التثبيت
4. أعد تقييم العناصر المثبتة كل شهر
```

---

### المشكلة 7: "لا أجد ملفاً محدداً"

**استراتيجية البحث:**

```
1. تذكر الفئة (أي موضوع؟)
   ↓
2. ابحث في المجلدات المحتملة
   ↓
3. استخدم تاريخ الإنشاء للتضييق
   ↓
4. ابحث عن الاسم أو الامتداد
   ↓
5. إذا كان مثبتاً/مفضلاً، ابحث في Sidebar أولاً
```

**نصيحة:** استخدم نظام تسمية منهجي منذ البداية لتجنب هذه المشكلة

---

## 📊 ملخص سريع (Quick Reference)

### الهيكل الكامل

```
📦 نظام الأرشيف
│
├── 🏠 صفحة الأرشيف الرئيسية
│   ├── Header (عنوان + زر إضافة فئة)
│   └── Grid الفئات (بطاقات الفئات)
│
├── 🎴 بطاقة الفئة
│   ├── اسم الفئة
│   ├── عدد المجلدات
│   └── أزرار: [إضافة مجلد] [عرض الكل]
│
├── 📁 بطاقة المجلد (داخل FolderViewModal)
│   ├── اسم ووصف المجلد
│   ├── عدد الملفات + تاريخ الإنشاء
│   └── أزرار: [تثبيت] [تعديل] [حذف] [نقل] [فتح]
│
├── 📄 عنصر الملف
│   ├── اسم الملف + أيقونة النوع
│   ├── تاريخ + حجم
│   └── أزرار: [مفضل] [تثبيت] [تحميل] [حذف] [التفاصيل]
│
└── 🎛️ Sidebar: العناصر المثبتة
    ├── 📁 مجلدات مثبتة (مع عدد الملفات)
    └── 📄 ملفات مثبتة (مع أيقونة النوع)
```

### المودالات (7 نوافذ)

| # | Modal | الغرض |
|---|-------|-------|
| 1 | AddArchiveCategoryModal | إضافة فئة |
| 2 | AddFolderModal | إضافة مجلد |
| 3 | FolderViewModal | عرض ملفات المجلد |
| 4 | FileDetailModal | تفاصيل ملف |
| 5 | EditFolderModal | تعديل مجلد |
| 6 | DeleteFolderModal | حذف مجلد |
| 7 | MoveFolderModal | نقل مجلد |

### الإجراءات السريعة

| الهدف | الخطوات |
|-------|---------|
| **إضافة فئة** | صفحة الأرشيف → + إضافة فئة → إدخال الاسم → حفظ |
| **إضافة مجلد** | بطاقة فئة → + إضافة مجلد → اسم+وصف → حفظ |
| **رفع ملفات** | فتح مجلد → رفع ملفات → اختر ملفات → OK |
| **تثبيت مجلد** | فتح فئة → زر 📍 على المجلد → يظهر في Sidebar |
| **تثبيت ملف** | فتح مجلد → زر 📍 على الملف → يظهر في Sidebar |
| **نقل مجلد** | فتح فئة → زر ↗️ → اختر فئة جديدة → نقل |
| **حذف مجلد** | فتح فئة → زر 🗑️ → تأكيد الحذف |
| **تحميل ملف** | فتح مجلد → زر ⬇️ → اختر مكان الحفظ |

---

## 🎉 الخاتمة

الآن أنت تعرف:

✅ البنية الهرمية الكاملة (فئات → مجلدات → ملفات)  
✅ كيفية استخدام جميع المودالات السبعة  
✅ نظام التثبيت في Sidebar  
✅ إدارة الملفات (رفع، تحميل، حذف)  
✅ السيناريوهات العملية  
✅ حل المشاكل الشائعة  

**ابدأ الآن:**
1. أنشئ فئتك الأولى
2. أضف مجلداً
3. ارفع بعض الملفات
4. ثبّت الأهم في Sidebar

🚀 **استخدم النظام بثقة واحترافية!**

---

**آخر تحديث:** 2024  
**الإصدار:** 1.0  
**الدعم:** راجع قسم "حل المشاكل الشائعة" أو اتصل بالدعم الفني
