# خطة النقل الشاملة من Vanilla JS إلى React + Electron
# Comprehensive Migration Plan from Vanilla JS to React + Electron

## 📋 نظرة عامة على المشروع

### المشروع القديم (Vanilla JS)
- **الموقع**: `C:\Users\moham\OneDrive\Desktop\army_system`
- **التكنولوجيا**: HTML + CSS + Vanilla JavaScript
- **حجم الكود**:
  - `index.html`: 1824 سطر
  - `script.js`: 4063 سطر
  - `style.css`: 5542 سطر
- **الوظائف**: نظام إدارة فاكسات ومستندات عسكرية كامل

### المشروع الجديد (React + Electron)
- **الموقع**: `C:\Users\moham\OneDrive\Desktop\army_system_react`
- **التكنولوجيا**: React 18.2.0 + Electron 22.3.27 + Vite 4.3.9
- **الحالة الحالية**: البنية الأساسية جاهزة (45% مكتمل)
- **ما تم**: Context API، Layout Components، Styles، Electron Setup

---

## 🎯 الهدف الرئيسي

**نقل جميع الوظائف والمكونات من المشروع القديم إلى المشروع الجديد بدون تغيير أو إضافة أو حذف**، مع الحفاظ على:
- جميع الأنماط كما هي
- جميع الوظائف كما هي
- نفس واجهة المستخدم
- نفس سلوك التطبيق

---

## 📊 تحليل المشروع القديم

### 1. الوظائف الرئيسية في script.js (4063 سطر)

#### A. إدارة الحالة العامة (Global State)
```javascript
let appState = {
    dailyTasks: [],
    categories: [],
    otherDocuments: [],
    finishedTasks: [],
    currentTask: null,
    currentCategory: null,
    originalFax: null,
    faxPages: [],
    filteredFaxes: [],
    currentFilteringSession: { isActive: false, nextFaxNumber: 1 },
    replies: [],
    reminders: [],
    lists: [{id: 1, name: "المفضلة", isDefault: true, items: []}],
    templates: []
};

let appSettings = {
    savePath: '',
    dateFormat: 'DD-MM-YYYY',
    customPattern: ''
};
```
**➡️ تم**: موجود في `AppStateContext.jsx` و `SettingsContext.jsx`

#### B. وظائف التاريخ والوقت
- `formatDateArabic()` - تنسيق التاريخ بالأرقام العربية
- `formatDateByPattern()` - دعم 7 أنماط تاريخ + نمط مخصص
- `updateDateTime()` - تحديث التاريخ والوقت كل ثانية
**➡️ تم**: موجود في `SettingsContext.jsx` و `Header.jsx`

#### C. وظائف الفئات (Categories)
- `renderCategories()` - عرض جميع الفئات
- `openAddCategoryModal()` - فتح نافذة إضافة فئة
- `handleAddCategory()` - إضافة فئة جديدة
- `openEditCategoryModal()` - فتح نافذة تعديل فئة
- `handleEditCategory()` - تعديل فئة موجودة
- `handleDeleteCategory()` - حذف فئة
- `openCategorySettings()` - فتح إعدادات الفئة

**➡️ مطلوب**: إنشاء Components في `src/components/categories/`

#### D. وظائف المستندات (Documents)
- `renderCategoryDocuments()` - عرض مستندات الفئة
- `openDocumentDetail()` - فتح تفاصيل مستند
- `handleAddDocument()` - إضافة مستند جديد
- `openEditDocumentModal()` - فتح نافذة تعديل
- `handleEditDocument()` - تعديل مستند
- `handleDeleteDocument()` - حذف مستند
- `addNewDocumentCopy()` - إضافة نسخة جديدة
- `deleteDocumentCopy()` - حذف نسخة
- `openDocumentCopiesFolder()` - فتح مجلد النسخ

**➡️ مطلوب**: إنشاء Components في `src/components/documents/`

#### E. وظائف الفاكسات (Faxes)
- `renderOriginalFax()` - عرض الفاكس الأصلي
- `handleUploadFax()` - رفع فاكس أصلي (PDF أو صور)
- `openFaxFilterModal()` - فتح نافذة الفلترة
- `handleConfirmFilter()` - تطبيق الفلترة
- `renderFaxes()` - عرض جميع الفاكسات المفلترة
- `toggleFaxSelection()` - تحديد/إلغاء تحديد فاكس
- `deleteSelectedFaxes()` - حذف الفاكسات المحددة
- `deleteOriginalFax()` - حذف الفاكس الأصلي
- `toggleOriginalFaxFavorite()` - إضافة/إزالة من المفضلة

**➡️ مطلوب**: إنشاء Components في `src/components/faxes/`

#### F. وظائف الردود (Replies)
- `renderReplies()` - عرض جميع الردود
- `openAddReplyModal()` - فتح نافذة إضافة رد
- `handleAddReply()` - إضافة رد جديد
- `deleteSelectedReplies()` - حذف الردود المحددة

**➡️ مطلوب**: إنشاء Components في `src/components/replies/`

#### G. وظائف التذكيرات (Reminders)
- `renderReminders()` - عرض جميع التذكيرات
- `openAddReminderModal()` - فتح نافذة إضافة تذكير
- `handleAddReminder()` - إضافة تذكير
- `handleEditReminder()` - تعديل تذكير
- `handleDeleteReminder()` - حذف تذكير
- `checkExpiredReminders()` - فحص التذكيرات المنتهية
- `handleCompleteReminder()` - إكمال تذكير

**➡️ مطلوب**: إنشاء Components في `src/components/reminders/`

#### H. وظائف القوائم (Lists)
- `renderLists()` - عرض جميع القوائم
- `addList()` - إضافة قائمة جديدة
- `deleteList()` - حذف قائمة
- `addItemToList()` - إضافة عنصر لقائمة
- `removeItemFromList()` - حذف عنصر من قائمة
- `exportList()` - تصدير قائمة

**➡️ مطلوب**: إنشاء Components في `src/components/lists/`

#### I. وظائف القوالب (Templates)
- `renderTemplates()` - عرض جميع القوالب
- `openAddTemplateModal()` - فتح نافذة إضافة قالب
- `handleAddTemplate()` - إضافة قالب
- `deleteTemplate()` - حذف قالب
- `applyTemplate()` - تطبيق قالب

**➡️ مطلوب**: إنشاء Components في `src/components/templates/`

#### J. وظائف ملفات اليوم (Today's Files)
- `renderTodayFiles()` - عرض ملفات اليوم مع معاينات
- `openTodayCopiesFolder()` - فتح مجلد نسخ اليوم
- `generateThumbnail()` - توليد صورة مصغرة
- `loadThumbnailsForFiles()` - تحميل المعاينات
- Thumbnail caching system - نظام تخزين مؤقت للمعاينات

**➡️ مطلوب**: إنشاء Components في `src/components/files/`

#### K. وظائف البحث والفلترة
- `initializeSearchAndFilter()` - تهيئة نظام البحث
- `filterAndSortFiles()` - فلترة وترتيب الملفات
- `updateCategoryFilterOptions()` - تحديث خيارات الفلترة
- `initializeDateFilter()` - تهيئة فلتر التاريخ

**➡️ مطلوب**: إنشاء Custom Hooks في `src/hooks/`

#### L. وظائف الطباعة
- `initializePrintButtons()` - تهيئة أزرار الطباعة
- `printFile()` - طباعة ملف واحد
- `printSelectedFiles()` - طباعة الملفات المحددة
- `mergeAndPrintFiles()` - دمج وطباعة

**➡️ مطلوب**: إنشاء `src/services/printService.js`

#### M. وظائف الإعدادات (Settings)
- `openSettingsModal()` - فتح نافذة الإعدادات
- `handleSaveSettings()` - حفظ الإعدادات
- `browseSavePath()` - اختيار مسار الحفظ
- `updatePathPreview()` - تحديث معاينة المسار
- `toggleCustomPatternSection()` - إظهار/إخفاء النمط المخصص

**➡️ مطلوب**: إنشاء Components في `src/components/settings/`

#### N. وظائف التحكم بالنافذة
- `initializeWindowControls()` - تهيئة أزرار النافذة
- Minimize, Maximize, Close
- Shortcuts menu

**➡️ تم**: موجود في `TitleBar.jsx`

#### O. وظائف الملفات
- `setupFileInputs()` - إعداد حقول رفع الملفات
- `handlePdfFileSelect()` - اختيار ملف PDF
- `handleImagesFileSelect()` - اختيار صور متعددة
- `getAssetUrl()` - الحصول على URL الأصول

**➡️ مطلوب**: إنشاء Components و Services

### 2. البنية الكاملة في index.html (1824 سطر)

#### A. Custom Title Bar
```html
<div class="custom-titlebar">
    <div class="titlebar-drag-region">
        <div class="titlebar-title">
            <span>إدارة الفاكسات</span>
            <button class="titlebar-shortcuts-btn">
        </div>
        <div class="shortcuts-dropdown">
            <!-- قائمة الاختصارات -->
        </div>
    </div>
    <div class="titlebar-controls">
        <!-- أزرار minimize, maximize, close -->
    </div>
</div>
```
**➡️ تم**: موجود في `TitleBar.jsx`

#### B. Header
```html
<header class="header">
    <div class="header-content">
        <div class="header-right">
            <h1>برنامج ادارة نظام مكتب الفاكسات والتدريب</h1>
        </div>
        <div class="header-left">
            <span class="date-time">...</span>
            <button id="openSettingsBtn">...</button>
        </div>
    </div>
</header>
```
**➡️ تم**: موجود في `Header.jsx`

#### C. App Sidebar
```html
<aside class="app-sidebar">
    <button data-section="main">الرئيسية</button>
    <button data-section="templates">القوالب</button>
    <button data-section="reminders">التذكيرات</button>
    <button data-section="lists">القوائم</button>
</aside>
```
**➡️ مطلوب**: إنشاء `AppSidebar.jsx`

#### D. Main Container
```html
<main class="container">
    <div class="container-header">
        <!-- Add Category Button + Search Box -->
    </div>
    <div class="filters-view-container">
        <!-- Filters + Sort + Date -->
    </div>
    
    <!-- Sections -->
    <section class="original-fax-section" id="originalFaxSection">
    <section class="faxes-section" id="faxesSection">
    <section class="replies-section" id="repliesSection">
    <section class="reminders-section" id="remindersSection">
    <section class="lists-section" id="listsSection">
    <section class="templates-section" id="templatesSection">
</main>
```
**➡️ مطلوب**: إنشاء Section Components

#### E. Modals (25+ نافذة منبثقة)
1. Add Category Modal
2. Edit Category Modal
3. Add Document Modal
4. Edit Document Modal
5. Document Detail Modal
6. Upload Fax Modal
7. Filter Fax Modal
8. Add Reply Modal
9. Add Reminder Modal
10. Edit Reminder Modal
11. Add List Modal
12. Add Template Modal
13. Settings Modal
14. ... والمزيد

**➡️ مطلوب**: إنشاء Modal Components

### 3. جميع الأنماط في style.css (5542 سطر)

#### المكونات الرئيسية:
1. **Fonts**: خطوط Tajawal (7 أوزان) ✅
2. **Variables**: متغيرات CSS (ألوان، مسافات، ظلال) ✅
3. **Reset**: إعادة تعيين CSS ✅
4. **RTL Support**: دعم كامل للعربية ✅
5. **Title Bar**: أنماط شريط العنوان ✅
6. **Header**: أنماط الرأس ✅
7. **Sidebar**: أنماط الشريط الجانبي ⏳
8. **Container**: أنماط الحاوية الرئيسية ⏳
9. **Categories**: أنماط الفئات ⏳
10. **Documents**: أنماط المستندات ⏳
11. **Faxes**: أنماط الفاكسات ⏳
12. **Files**: أنماط الملفات ⏳
13. **Modals**: أنماع النوافذ المنبثقة ⏳
14. **Buttons**: جميع أنواع الأزرار ⏳
15. **Forms**: حقول الإدخال ⏳
16. **Cards**: البطاقات ⏳
17. **Grids**: الشبكات ⏳
18. **Animations**: الحركات ⏳

**➡️ مطلوب**: نقل الأنماط المتبقية إلى ملفات CSS منفصلة

---

## 🗺️ خطة التنفيذ التفصيلية

### المرحلة 1: إكمال IPC Handlers (أولوية قصوى)
**المدة المقدرة**: 2-3 أيام

يجب إنشاء جميع handlers المطلوبة في `electron/ipc/`:

#### 1.1 file-handlers.js (موجود جزئياً)
**الوظائف المطلوبة**:
```javascript
// اختيار الملفات والمجلدات
- selectFile(options)           // اختيار ملف واحد
- selectFolder(title)            // اختيار مجلد
- selectMultipleFiles(options)   // اختيار ملفات متعددة

// عمليات الملفات
- openFile(path)                 // فتح ملف
- openFolder(path)               // فتح مجلد
- copyFile(source, destination)  // نسخ ملف
- deleteFile(path)               // حذف ملف
- fileExists(path)               // فحص وجود ملف
- getFileInfo(path)              // معلومات الملف
```

**الملفات**: `c:\Users\moham\OneDrive\Desktop\army_system_react\electron\ipc\file-handlers.js`  
**التحقق**: اختبار كل دالة باستخدام DevTools

#### 1.2 document-handlers.js (جديد)
**الوظائف المطلوبة**:
```javascript
// إدارة المستندات
- copyFileToAssets(sourcePath, categoryId, documentId)
- deleteFileFromAssets(relativePath)
- createDocumentCopy(categoryId, documentId, copyNumber)
- deleteDocumentCopy(categoryId, documentId, copyNumber)
- openCopiesFolder(categoryId, documentId)
- openTodayCopiesFolder(date)
- getTodayFiles(date)
- getDocumentCopiesCount(categoryId, documentId)
```

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\electron\ipc\document-handlers.js`  
**التحقق**: اختبار نسخ وحذف المستندات

#### 1.3 thumbnail-handlers.js (جديد)
**الوظائف المطلوبة**:
```javascript
// نظام المعاينات
- generateThumbnail(filePath)              // توليد معاينة
- getThumbnailPath(filePath)               // الحصول على مسار المعاينة
- thumbnailExists(filePath)                // فحص وجود معاينة
- cleanupOldThumbnails()                   // تنظيف المعاينات القديمة
- getThumbnailForFile(filePath, fileModTime) // معاينة مع تخزين مؤقت
```

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\electron\ipc\thumbnail-handlers.js`  
**التحقق**: توليد معاينات لملفات Word

#### 1.4 print-handlers.js (جديد)
**الوظائف المطلوبة**:
```javascript
// الطباعة
- printFile(filePath)                      // طباعة ملف واحد
- printMultipleFiles(filePaths)            // طباعة ملفات متعددة
- mergeWordFiles(filePaths, outputPath)    // دمج ملفات Word
- mergeAndPrint(filePaths)                 // دمج وطباعة
```

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\electron\ipc\print-handlers.js`  
**التحقق**: طباعة ملف Word

#### 1.5 fax-handlers.js (جديد)
**الوظائف المطلوبة**:
```javascript
// معالجة الفاكسات
- processPdfToImages(pdfPath, outputDir)   // تحويل PDF إلى صور
- saveFaxPage(imageData, faxId, pageNum)   // حفظ صفحة فاكس
- deleteFaxPage(faxId, pageNum)            // حذف صفحة فاكس
- getFaxPagePath(faxId, pageNum)           // مسار صفحة فاكس
```

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\electron\ipc\fax-handlers.js`  
**التحقق**: رفع ومعالجة PDF

#### 1.6 تحديث electron/main.js
إضافة تسجيل جميع handlers الجديدة:
```javascript
import { registerFileHandlers } from './ipc/file-handlers.js';
import { registerDocumentHandlers } from './ipc/document-handlers.js';
import { registerThumbnailHandlers } from './ipc/thumbnail-handlers.js';
import { registerPrintHandlers } from './ipc/print-handlers.js';
import { registerFaxHandlers } from './ipc/fax-handlers.js';

app.whenReady().then(() => {
    registerFileHandlers();
    registerDocumentHandlers();
    registerThumbnailHandlers();
    registerPrintHandlers();
    registerFaxHandlers();
    // ...
});
```

**الملفات**: تعديل `c:\Users\moham\OneDrive\Desktop\army_system_react\electron\main.js`  
**التحقق**: `npm run electron:dev` بدون أخطاء

---

### المرحلة 2: إنشاء Common Components (أساسي)
**المدة المقدرة**: 2-3 أيام

#### 2.1 Modal.jsx
**الوظائف**:
- نافذة منبثقة قابلة لإعادة الاستخدام
- دعم إغلاق عند النقر خارج النافذة
- رسوم متحركة للظهور/الاختفاء
- عنوان وأزرار إغلاق

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\common\Modal.jsx`  
**التحقق**: عرض modal بمحتوى تجريبي

#### 2.2 Input.jsx
**الوظائف**:
- حقل إدخال نصي، رقمي، تاريخ
- دعم placeholder
- دعم validation
- أنماط focus وerror

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\common\Input.jsx`  
**التحقق**: إدخال وعرض قيمة

#### 2.3 Select.jsx
**الوظائف**:
- قائمة منسدلة
- دعم خيارات متعددة
- بحث في الخيارات
- أنماط مخصصة

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\common\Select.jsx`  
**التحقق**: اختيار خيار من قائمة

#### 2.4 FileInput.jsx
**الوظائف**:
- زر اختيار ملف يستخدم Electron dialog
- عرض اسم الملف المختار
- دعم اختيار متعدد
- فلاتر أنواع الملفات

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\common\FileInput.jsx`  
**التحقق**: اختيار ملف وعرض اسمه

#### 2.5 IconPicker.jsx
**الوظائف**:
- عرض شبكة من الأيقونات SVG
- اختيار أيقونة
- بحث في الأيقونات
- رفع صورة مخصصة

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\common\IconPicker.jsx`  
**التحقق**: اختيار أيقونة

#### 2.6 EmojiPicker.jsx
**الوظائف**:
- عرض شبكة من الإيموجي
- اختيار إيموجي
- فئات الإيموجي
- بحث

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\common\EmojiPicker.jsx`  
**التحقق**: اختيار إيموجي

#### 2.7 SearchBox.jsx
**الوظائف**:
- حقل بحث مع أيقونة
- debouncing للبحث
- زر مسح
- اختصارات لوحة المفاتيح

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\common\SearchBox.jsx`  
**التحقق**: البحث في قائمة

#### 2.8 تحديث Button.jsx
تحسين المكون الموجود:
- إضافة جميع الأنماط من المشروع القديم
- دعم loading state
- دعم disabled state
- أحجام مختلفة

**الملفات**: تعديل `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\common\Button.jsx`  
**التحقق**: عرض جميع أنواع الأزرار

---

### المرحلة 3: نظام الفئات (Categories)
**المدة المقدرة**: 3-4 أيام

#### 3.1 CategoryCard.jsx
**الوظائف**:
- عرض بطاقة فئة واحدة
- عرض الأيقونة والاسم
- عدد المستندات
- أزرار الإجراءات (إضافة مستند، إعدادات)
- شبكة المستندات داخل الفئة

**المكونات الفرعية**:
- CategoryHeader (العنوان والأيقونة)
- CategoryActions (الأزرار)
- CategoryDocumentsGrid (شبكة المستندات)

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\categories\CategoryCard.jsx`  
**التحقق**: عرض فئة مع مستنداتها

#### 3.2 CategoryGrid.jsx
**الوظائف**:
- عرض جميع الفئات في شبكة
- ترتيب الفئات
- حالة فارغة عند عدم وجود فئات

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\categories\CategoryGrid.jsx`  
**التحقق**: عرض عدة فئات

#### 3.3 AddCategoryModal.jsx
**الوظائف**:
- نافذة إضافة فئة جديدة
- حقل اسم الفئة
- IconPicker لاختيار الأيقونة
- EmojiPicker كبديل
- زر حفظ وإلغاء

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\categories\AddCategoryModal.jsx`  
**التحقق**: إضافة فئة جديدة وعرضها

#### 3.4 EditCategoryModal.jsx
**الوظائف**:
- نافذة تعديل فئة موجودة
- تحميل بيانات الفئة
- تعديل الاسم والأيقونة
- زر حذف الفئة (مع تأكيد)
- زر حفظ وإلغاء

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\categories\EditCategoryModal.jsx`  
**التحقق**: تعديل فئة وحذفها

#### 3.5 نقل الأنماط
نقل أنماط الفئات من `style.css`:
- `.category-card`
- `.category-header`
- `.category-title`
- `.category-actions`
- `.category-content`
- `.category-documents-grid`
- `.category-empty`

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\styles\categories.css`  
**التحقق**: الفئات تظهر بنفس التصميم القديم

---

### المرحلة 4: نظام المستندات (Documents)
**المدة المقدرة**: 3-4 أيام

#### 4.1 DocumentCard.jsx
**الوظائف**:
- عرض بطاقة مستند واحد
- الأيقونة/الصورة
- اسم المستند
- اسم الملف الأصلي
- زر الإعدادات (يظهر عند hover)
- فتح تفاصيل المستند عند النقر

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\documents\DocumentCard.jsx`  
**التحقق**: عرض مستند

#### 4.2 DocumentGrid.jsx
**الوظائف**:
- عرض شبكة المستندات
- grid responsive
- حالة فارغة
- ترتيب المستندات

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\documents\DocumentGrid.jsx`  
**التحقق**: عرض عدة مستندات

#### 4.3 AddDocumentModal.jsx
**الوظائف**:
- نافذة إضافة مستند جديد
- حقل اسم المستند
- FileInput لاختيار ملف Word
- IconPicker لاختيار أيقونة
- خيار رفع صورة كأيقونة
- زر حفظ وإلغاء

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\documents\AddDocumentModal.jsx`  
**التحقق**: إضافة مستند ونسخه إلى assets

#### 4.4 EditDocumentModal.jsx
**الوظائف**:
- نافذة تعديل مستند
- تحميل بيانات المستند
- تعديل الاسم، الملف، الأيقونة
- زر حذف المستند
- زر حفظ وإلغاء

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\documents\EditDocumentModal.jsx`  
**التحقق**: تعديل مستند

#### 4.5 DocumentDetailModal.jsx
**الوظائف**:
- نافذة تفاصيل المستند الكاملة
- عرض الأيقونة والاسم
- معلومات الملف
- قائمة النسخ الموجودة
- زر "إنشاء نسخة جديدة"
- زر "فتح مجلد النسخ"
- أزرار لكل نسخة (فتح، طباعة، حذف)

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\documents\DocumentDetailModal.jsx`  
**التحقق**: عرض تفاصيل مستند وإنشاء نسخ

#### 4.6 نقل الأنماط
نقل أنماط المستندات من `style.css`:
- `.task-card` (بطاقة المستند)
- `.doc-settings-btn`
- `.task-icon`
- `.task-title`
- `.task-meta`
- `.clickable-card`

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\styles\documents.css`  
**التحقق**: المستندات تظهر بنفس التصميم

---

### المرحلة 5: نظام الفاكسات (Faxes)
**المدة المقدرة**: 4-5 أيام

#### 5.1 OriginalFaxSection.jsx
**الوظائف**:
- قسم الفاكس الأصلي
- عرض معلومات الفاكس بعد الرفع
- زر "رفع فاكس أصلي"
- أزرار الإجراءات (مفضلة، تعديل، حذف، فلترة)
- حالة فارغة عند عدم رفع فاكس

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\faxes\OriginalFaxSection.jsx`  
**التحقق**: عرض القسم

#### 5.2 UploadFaxModal.jsx
**الوظائف**:
- نافذة رفع فاكس أصلي
- اختيار نوع الرفع (PDF أو صور)
- FileInput لـ PDF (ملف واحد)
- FileInput لصور (متعدد)
- معاينة الملفات المختارة
- زر رفع وإلغاء

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\faxes\UploadFaxModal.jsx`  
**التحقق**: رفع PDF أو صور

#### 5.3 FilterFaxModal.jsx
**الوظائف**:
- نافذة فلترة صفحات الفاكس
- عرض جميع صفحات الفاكس الأصلي
- تحديد/إلغاء تحديد صفحات
- إدخال معلومات كل فاكس مفلتر:
  - رقم الفاكس
  - العنوان
  - الفئة
  - الوصف
- زر تطبيق الفلترة
- حفظ الفاكسات المفلترة

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\faxes\FilterFaxModal.jsx`  
**التحقق**: فلترة صفحات وإنشاء فاكسات

#### 5.4 FaxCard.jsx
**الوظائف**:
- عرض بطاقة فاكس واحد
- صورة الفاكس
- رقم الفاكس
- العنوان والفئة
- checkbox للتحديد
- أيقونة مفضلة
- أزرار الإجراءات (عرض، رد، حذف)

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\faxes\FaxCard.jsx`  
**التحقق**: عرض فاكس

#### 5.5 FaxGrid.jsx
**الوظائف**:
- عرض شبكة الفاكسات المفلترة
- عداد الفاكسات
- أزرار إلغاء التحديد وحذف المحدد
- حالة فارغة
- ترتيب وفلترة

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\faxes\FaxGrid.jsx`  
**التحقق**: عرض عدة فاكسات

#### 5.6 FaxReplyModal.jsx
**الوظائف**:
- نافذة الرد على فاكس
- عرض معلومات الفاكس الأصلي
- حقول الرد:
  - رقم الرد
  - المحتوى
  - التاريخ
  - المرفقات
- زر حفظ الرد

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\faxes\FaxReplyModal.jsx`  
**التحقق**: إضافة رد على فاكس

#### 5.7 RepliesSection.jsx
**الوظائف**:
- قسم عرض جميع الردود
- شبكة الردود
- أزرار تحديد وحذف
- حالة فارغة

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\faxes\RepliesSection.jsx`  
**التحقق**: عرض الردود

#### 5.8 نقل الأنماط
نقل أنماط الفاكسات من `style.css`:
- `.original-fax-section`
- `.original-fax-header`
- `.original-fax-box`
- `.original-fax-actions`
- `.faxes-section`
- `.faxes-grid`
- `.fax-card`
- `.replies-section`

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\styles\faxes.css`  
**التحقق**: الفاكسات تظهر بنفس التصميم

---

### المرحلة 6: ملفات اليوم وSidebar (Today's Files)
**المدة المقدرة**: 3-4 أيام

#### 6.1 FilesSidebar.jsx
**الوظائف**:
- شريط جانبي لملفات اليوم
- عنوان مع عداد الملفات
- زر تحديث
- زر فتح مجلد اليوم
- فلتر التاريخ
- شريط البحث
- فلاتر الفئة والترتيب
- شريط أدوات التحديد
- قائمة الملفات بشبكة

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\files\FilesSidebar.jsx`  
**التحقق**: عرض الشريط الجانبي

#### 6.2 FileItem.jsx
**الوظائف**:
- بطاقة ملف واحد
- صورة مصغرة (thumbnail)
- checkbox للتحديد
- أزرار إجراءات (فتح مجلد، طباعة، حذف)
- معلومات الملف على hover
- نسبة A4 للبطاقة

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\files\FileItem.jsx`  
**التحقق**: عرض ملف مع معاينة

#### 6.3 FilesList.jsx
**الوظائف**:
- شبكة 2 أعمدة للملفات
- تحميل الملفات من المجلد
- فلترة وترتيب
- حالة تحميل
- حالة فارغة

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\files\FilesList.jsx`  
**التحقق**: عرض قائمة الملفات

#### 6.4 FileThumbnail.jsx
**الوظائف**:
- عرض صورة مصغرة للملف
- توليد المعاينة إذا لم تكن موجودة
- تخزين مؤقت للمعاينات
- عرض أيقونة افتراضية أثناء التحميل
- معالجة الأخطاء

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\files\FileThumbnail.jsx`  
**التحقق**: توليد وعرض معاينة

#### 6.5 SelectionToolbar.jsx
**الوظائف**:
- شريط أدوات للملفات المحددة
- عداد الملفات المحددة
- أزرار: تحديد الكل، إلغاء التحديد، طباعة، دمج، حذف
- يظهر فقط عند وجود تحديد

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\files\SelectionToolbar.jsx`  
**التحقق**: تحديد ملفات وعرض الشريط

#### 6.6 DateFilter.jsx
**الوظائف**:
- حقل اختيار التاريخ
- زر "اليوم" للعودة لتاريخ اليوم
- تحديث العنوان حسب التاريخ المختار
- تحميل ملفات التاريخ المحدد

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\files\DateFilter.jsx`  
**التحقق**: فلترة حسب التاريخ

#### 6.7 نقل الأنماط
نقل أنماط الملفات من `style.css`:
- `.sidebar`
- `.sidebar-header`
- `.sidebar-content`
- `.file-item`
- `.file-preview-thumbnail`
- `.file-checkbox`
- `.file-item-actions`
- `.selection-toolbar`
- `.date-filter-container`

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\styles\sidebar.css`  
**التحقق**: الشريط الجانبي يظهر بنفس التصميم

---

### المرحلة 7: التذكيرات والقوائم والقوالب
**المدة المقدرة**: 3-4 أيام

#### 7.1 Reminders Components
**المكونات**:
- `RemindersSection.jsx` - قسم التذكيرات الرئيسي
- `ReminderCard.jsx` - بطاقة تذكير
- `RemindersList.jsx` - قائمة التذكيرات
- `AddReminderModal.jsx` - إضافة تذكير
- `EditReminderModal.jsx` - تعديل تذكير

**الوظائف**:
- عرض التذكيرات (الكل، النشطة، المنتهية)
- إضافة/تعديل/حذف تذكير
- إكمال تذكير
- فحص التذكيرات المنتهية تلقائياً
- إشعارات للتذكيرات

**الملفات**: إنشاء في `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\reminders\`  
**التحقق**: إدارة التذكيرات كاملة

#### 7.2 Lists Components
**المكونات**:
- `ListsSection.jsx` - قسم القوائم الرئيسي
- `ListCard.jsx` - بطاقة قائمة
- `ListsGrid.jsx` - شبكة القوائم
- `AddListModal.jsx` - إضافة قائمة
- `ListItemsModal.jsx` - عرض وإدارة عناصر القائمة

**الوظائف**:
- عرض جميع القوائم
- إضافة/حذف قوائم
- إضافة/حذف عناصر في القائمة
- قائمة المفضلة الافتراضية
- تصدير قائمة

**الملفات**: إنشاء في `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\lists\`  
**التحقق**: إدارة القوائم كاملة

#### 7.3 Templates Components
**المكونات**:
- `TemplatesSection.jsx` - قسم القوالب الرئيسي
- `TemplateCard.jsx` - بطاقة قالب
- `TemplatesGrid.jsx` - شبكة القوالب
- `AddTemplateModal.jsx` - إضافة قالب
- `TemplatePreviewModal.jsx` - معاينة قالب

**الوظائف**:
- عرض جميع القوالب
- إضافة/حذف قوالب
- معاينة قالب
- تطبيق قالب على مستند
- رفع ملف قالب

**الملفات**: إنشاء في `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\templates\`  
**التحقق**: إدارة القوالب كاملة

#### 7.4 نقل الأنماط
نقل أنماط من `style.css`:
- `.reminders-section`
- `.reminder-card`
- `.lists-section`
- `.list-card`
- `.templates-section`
- `.template-card`

**الملفات**: إنشاء:
- `c:\Users\moham\OneDrive\Desktop\army_system_react\src\styles\reminders.css`
- `c:\Users\moham\OneDrive\Desktop\army_system_react\src\styles\lists.css`
- `c:\Users\moham\OneDrive\Desktop\army_system_react\src\styles\templates.css`

**التحقق**: جميع الأقسام تظهر بالتصميم الصحيح

---

### المرحلة 8: الإعدادات والفلاتر والبحث
**المدة المقدرة**: 2-3 أيام

#### 8.1 Settings Components
**المكونات**:
- `SettingsModal.jsx` - نافذة الإعدادات
- `PathSelector.jsx` - اختيار مسار الحفظ
- `DateFormatSelector.jsx` - اختيار نمط التاريخ
- `CustomPatternInput.jsx` - إدخال نمط مخصص
- `PathPreview.jsx` - معاينة المسار

**الوظائف**:
- إدارة مسار الحفظ
- اختيار نمط التاريخ (7 أنماط)
- نمط مخصص مع [AR]
- معاينة مسار حية
- حفظ وتحميل الإعدادات

**الملفات**: إنشاء في `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\settings\`  
**التحقق**: تغيير الإعدادات وحفظها

#### 8.2 Search and Filter Components
**المكونات**:
- `SearchBox.jsx` - (موجود في common)
- `CategoryFilter.jsx` - فلتر الفئات
- `SortSelect.jsx` - ترتيب النتائج
- `FilterBar.jsx` - شريط الفلاتر الكامل

**الوظائف**:
- بحث في المستندات والملفات
- فلترة حسب الفئة
- ترتيب (الأحدث، الأقدم، أبجدي)
- تحديث النتائج فورياً

**الملفات**: إنشاء في `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\filters\`  
**التحقق**: البحث والفلترة تعمل

#### 8.3 AppSidebar Component
**الوظائف**:
- الشريط الجانبي للتنقل
- أزرار الأقسام (رئيسية، قوالب، تذكيرات، قوائم)
- تفعيل القسم النشط
- تبديل الأقسام

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\src\components\layout\AppSidebar.jsx`  
**التحقق**: التنقل بين الأقسام

#### 8.4 نقل الأنماط
نقل أنماط من `style.css`:
- `.app-sidebar`
- `.sidebar-btn`
- `.search-filter-container`
- `.filter-controls`
- `.modal` (جميع أنماط النوافذ المنبثقة)

**الملفات**: تحديث `c:\Users\moham\OneDrive\Desktop\army_system_react\src\styles\index.css`  
**التحقق**: الأنماط متطابقة

---

### المرحلة 9: Services والCustom Hooks
**المدة المقدرة**: 2-3 أيام

#### 9.1 Services
إنشاء خدمات في `src/services/`:

**9.1.1 electronAPI.js**
```javascript
// واجهة موحدة لـ IPC calls
export const electronAPI = {
    // File operations
    selectFile: (options) => window.electronAPI.selectFile(options),
    openFile: (path) => window.electronAPI.openFile(path),
    // ... جميع الوظائف
};
```

**9.1.2 fileService.js**
```javascript
// عمليات الملفات عالية المستوى
export const fileService = {
    getTodayFiles: async (date) => { ... },
    copyDocumentToAssets: async (file, categoryId, docId) => { ... },
    // ...
};
```

**9.1.3 thumbnailService.js**
```javascript
// نظام المعاينات
export const thumbnailService = {
    getThumbnail: async (filePath) => { ... },
    generateIfNotExists: async (filePath) => { ... },
    // ...
};
```

**9.1.4 printService.js**
```javascript
// الطباعة
export const printService = {
    printFile: async (path) => { ... },
    printMultiple: async (paths) => { ... },
    mergeAndPrint: async (paths) => { ... },
};
```

**9.1.5 dateService.js**
```javascript
// تنسيق التواريخ
export const dateService = {
    formatArabic: (date) => { ... },
    formatByPattern: (date, pattern, custom) => { ... },
    // ...
};
```

**الملفات**: إنشاء في `c:\Users\moham\OneDrive\Desktop\army_system_react\src\services\`  
**التحقق**: استخدام الخدمات في المكونات

#### 9.2 Custom Hooks
إنشاء hooks في `src/hooks/`:

**9.2.1 useTodayFiles.js**
```javascript
// تحميل وإدارة ملفات اليوم
export const useTodayFiles = (selectedDate) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    // ...
    return { files, loading, refresh };
};
```

**9.2.2 useFileOperations.js**
```javascript
// عمليات الملفات (فتح، طباعة، حذف)
export const useFileOperations = () => {
    const openFile = async (path) => { ... };
    const printFile = async (path) => { ... };
    const deleteFile = async (path) => { ... };
    return { openFile, printFile, deleteFile };
};
```

**9.2.3 useThumbnail.js**
```javascript
// توليد واستخدام المعاينات
export const useThumbnail = (filePath) => {
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(true);
    // ...
    return { thumbnail, loading };
};
```

**9.2.4 useSearch.js**
```javascript
// البحث مع debouncing
export const useSearch = (items, searchTerm, searchKey) => {
    const [results, setResults] = useState([]);
    // ...
    return { results };
};
```

**9.2.5 useFilter.js**
```javascript
// فلترة وترتيب
export const useFilter = (items, filters, sortBy) => {
    const [filtered, setFiltered] = useState([]);
    // ...
    return { filtered };
};
```

**الملفات**: إنشاء في `c:\Users\moham\OneDrive\Desktop\army_system_react\src\hooks\`  
**التحقق**: استخدام الhooks في المكونات

---

### المرحلة 10: التكامل النهائي والاختبار
**المدة المقدرة**: 3-4 أيام

#### 10.1 دمج جميع المكونات في App.jsx
**المهام**:
- استيراد جميع الأقسام
- إدارة القسم النشط
- routing بين الأقسام
- تحميل البيانات الأولية
- معالجة الأخطاء العامة

**الملفات**: تحديث `c:\Users\moham\OneDrive\Desktop\army_system_react\src\App.jsx`  
**التحقق**: التطبيق يعمل بالكامل

#### 10.2 نقل الأنماط المتبقية
**المهام**:
- مراجعة `style.css` القديم
- نقل أي أنماط مفقودة
- تنظيم الأنماط في ملفات منفصلة
- التأكد من تطابق التصميم

**الملفات**: 
- `c:\Users\moham\OneDrive\Desktop\army_system_react\src\styles\*.css`

**التحقق**: التصميم متطابق 100%

#### 10.3 اختبار شامل لجميع الوظائف
**اختبارات الفئات**:
- ✅ إضافة فئة جديدة
- ✅ تعديل فئة
- ✅ حذف فئة
- ✅ عرض جميع الفئات

**اختبارات المستندات**:
- ✅ إضافة مستند
- ✅ تعديل مستند
- ✅ حذف مستند
- ✅ إنشاء نسخة
- ✅ حذف نسخة
- ✅ فتح مجلد النسخ
- ✅ طباعة مستند

**اختبارات الفاكسات**:
- ✅ رفع فاكس (PDF)
- ✅ رفع فاكس (صور)
- ✅ فلترة صفحات
- ✅ إنشاء فاكسات مفلترة
- ✅ حذف فاكس
- ✅ إضافة رد

**اختبارات ملفات اليوم**:
- ✅ عرض ملفات اليوم
- ✅ توليد معاينات
- ✅ فلترة حسب التاريخ
- ✅ فلترة حسب الفئة
- ✅ البحث في الملفات
- ✅ تحديد ملفات
- ✅ طباعة محدد
- ✅ حذف محدد

**اختبارات التذكيرات**:
- ✅ إضافة تذكير
- ✅ تعديل تذكير
- ✅ حذف تذكير
- ✅ إكمال تذكير
- ✅ إشعارات التذكيرات

**اختبارات القوائم**:
- ✅ إضافة قائمة
- ✅ حذف قائمة
- ✅ إضافة عنصر
- ✅ حذف عنصر
- ✅ تصدير قائمة

**اختبارات القوالب**:
- ✅ إضافة قالب
- ✅ حذف قالب
- ✅ معاينة قالب
- ✅ تطبيق قالب

**اختبارات الإعدادات**:
- ✅ اختيار مسار الحفظ
- ✅ تغيير نمط التاريخ
- ✅ نمط مخصص
- ✅ حفظ الإعدادات
- ✅ تحميل الإعدادات

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\TESTING_CHECKLIST.md`  
**التحقق**: جميع الاختبارات تمر

#### 10.4 إصلاح الأخطاء
**المهام**:
- جمع جميع الأخطاء المكتشفة
- تصنيف حسب الأولوية
- إصلاح الأخطاء الحرجة أولاً
- اختبار الإصلاحات

**الملفات**: إنشاء `c:\Users\moham\OneDrive\Desktop\army_system_react\BUGS.md`  
**التحقق**: لا توجد أخطاء حرجة

#### 10.5 تحسين الأداء
**المهام**:
- تحسين توليد المعاينات
- تحسين البحث والفلترة
- تحسين تحميل البيانات
- lazy loading للمكونات الثقيلة

**التحقق**: التطبيق سريع الاستجابة

---

## 📝 خطة التنفيذ الموصى بها

### الترتيب الأمثل للتنفيذ:

1. **IPC Handlers** (أولوية 1) ⚠️
   - بدون هذه لن تعمل أي وظائف
   - المدة: 2-3 أيام

2. **Common Components** (أولوية 1) ⚠️
   - أساس لجميع المكونات الأخرى
   - المدة: 2-3 أيام

3. **Categories + Documents** (أولوية 2)
   - الوظيفة الأساسية للتطبيق
   - المدة: 6-8 أيام

4. **Faxes System** (أولوية 2)
   - الوظيفة الرئيسية الثانية
   - المدة: 4-5 أيام

5. **Today's Files + Sidebar** (أولوية 2)
   - مهم لمتابعة العمل
   - المدة: 3-4 أيام

6. **Reminders + Lists + Templates** (أولوية 3)
   - وظائف إضافية
   - المدة: 3-4 أيام

7. **Settings + Filters** (أولوية 3)
   - تحسينات
   - المدة: 2-3 أيام

8. **Services + Hooks** (مستمر)
   - بالتوازي مع المكونات
   - المدة: 2-3 أيام

9. **Integration + Testing** (أولوية 1) ⚠️
   - التأكد من أن كل شيء يعمل
   - المدة: 3-4 أيام

### المجموع الكلي: 27-37 يوم عمل (5-8 أسابيع)

---

## 🎯 الحد الأدنى الوظيفي (MVP)

إذا كان الوقت محدوداً، يمكن إنشاء MVP في **7-10 أيام**:

### أسبوع 1: الأساسيات
- ✅ يوم 1-2: IPC Handlers (file, document فقط)
- ✅ يوم 3: Common Components (Button, Modal, Input, FileInput)
- ✅ يوم 4-5: Categories System
- ✅ يوم 6-7: Documents System

### أسبوع 2: الوظائف الرئيسية
- ✅ يوم 8-9: Faxes System (أساسي)
- ✅ يوم 10: Testing & Fixes

**النتيجة**: تطبيق وظيفي يمكنه إدارة الفئات والمستندات والفاكسات.

---

## ✅ ما تم إنجازه بالفعل

### البنية الأساسية (100% ✅)
- ✅ package.json
- ✅ vite.config.js
- ✅ electron-builder.json
- ✅ بنية المجلدات

### Electron (100% ✅)
- ✅ electron/main.js
- ✅ electron/preload.js
- ✅ البروتوكولات المخصصة (asset://, emoji://)
- ✅ Window management

### React + Context (100% ✅)
- ✅ AppStateContext - إدارة حالة كاملة
- ✅ SettingsContext - إدارة إعدادات كاملة
- ✅ TitleBar Component
- ✅ Header Component

### Styles (100% ✅)
- ✅ CSS Variables
- ✅ خطوط Tajawal
- ✅ RTL Support
- ✅ Title Bar & Header styles

### Common Components (جزئي 25%)
- ✅ Button.jsx - موجود
- ⏳ Modal.jsx - مطلوب
- ⏳ Input.jsx - مطلوب
- ⏳ FileInput.jsx - مطلوب

**الإجمالي**: 45% من المشروع مكتمل ✅

---

## 📚 المراجع والأمثلة

### من المشروع القديم:

#### نسخ وظيفة من script.js إلى React:
```javascript
// القديم (Vanilla JS)
function addCategory(name, icon) {
    const category = {
        id: Date.now(),
        name: name,
        icon: icon,
        documents: []
    };
    appState.categories.push(category);
    saveData();
    renderCategories();
}

// الجديد (React + Context)
const { addCategory } = useAppState();

const handleAddCategory = async (name, icon) => {
    await addCategory({ name, icon });
    // Context يحفظ ويحدث تلقائياً
};
```

#### نسخ أنماط من style.css:
```css
/* القديم - في style.css */
.category-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    /* ... */
}

/* الجديد - في categories.css */
/* نفس الأنماط بالضبط */
.category-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    /* ... */
}
```

#### نسخ HTML إلى JSX:
```html
<!-- القديم - في index.html -->
<div class="category-card">
    <div class="category-header">
        <div class="category-title">
            <span class="category-icon">📁</span>
            <h2>المستندات</h2>
        </div>
    </div>
</div>
```

```jsx
// الجديد - في CategoryCard.jsx
<div className="category-card">
    <div className="category-header">
        <div className="category-title">
            <span className="category-icon">{category.icon}</span>
            <h2>{category.name}</h2>
        </div>
    </div>
</div>
```

---

## 🚀 البدء الآن

### الخطوة 1: تثبيت التبعيات
```bash
cd c:\Users\moham\OneDrive\Desktop\army_system_react
npm install
```

### الخطوة 2: تشغيل وضع التطوير
```bash
# نافذة PowerShell 1:
npm run dev

# نافذة PowerShell 2:
npm run electron:dev
```

### الخطوة 3: بدء التطوير
ابدأ من **المرحلة 1: IPC Handlers**  
ثم **المرحلة 2: Common Components**  
ثم باقي المراحل بالترتيب.

---

## 💡 نصائح مهمة

### 1. لا تغير أي شيء من التصميم أو الوظائف
- انسخ كل شيء كما هو بالضبط
- نفس الأسماء، نفس الأنماط، نفس السلوك
- الهدف: نقل وليس إعادة تطوير

### 2. اختبر باستمرار
- اختبر كل مكون بمجرد إنشائه
- لا تنتظر حتى النهاية
- استخدم DevTools لتتبع الأخطاء

### 3. استخدم Context بدلاً من Global State
- Context جاهز وفعال
- جميع العمليات موجودة
- فقط استخدمها في المكونات

### 4. احفظ البيانات دائماً
- بعد كل عملية CRUD
- Context يحفظ تلقائياً
- لكن تأكد من await للعمليات

### 5. استخدم Electron API
- جميع IPC handlers جاهزة
- استخدم `window.electronAPI.*`
- معالجة الأخطاء دائماً

---

## 📊 تتبع التقدم

### استخدم هذا النموذج لتتبع تقدمك:

```markdown
## تقدم المشروع - [التاريخ]

### المرحلة 1: IPC Handlers
- [ ] file-handlers.js
- [ ] document-handlers.js
- [ ] thumbnail-handlers.js
- [ ] print-handlers.js
- [ ] fax-handlers.js

### المرحلة 2: Common Components
- [x] Button.jsx
- [ ] Modal.jsx
- [ ] Input.jsx
- [ ] FileInput.jsx
- [ ] IconPicker.jsx
- [ ] EmojiPicker.jsx

### المرحلة 3: Categories
- [ ] CategoryCard.jsx
- [ ] CategoryGrid.jsx
- [ ] AddCategoryModal.jsx
- [ ] EditCategoryModal.jsx

... والمزيد
```

---

## 🎉 الخلاصة

### المشروع الحالي:
- ✅ البنية الأساسية **جاهزة 100%**
- ✅ Context و State Management **جاهزة 100%**
- ✅ Electron Setup **جاهز 100%**
- ✅ Layout Components **جاهزة 100%**
- ✅ Styles Foundation **جاهزة 100%**

### المطلوب:
1. ⏳ إكمال IPC Handlers (2-3 أيام)
2. ⏳ إنشاء UI Components (15-20 يوم)
3. ⏳ Services و Hooks (2-3 أيام)
4. ⏳ Testing و Integration (3-4 أيام)

### الإجمالي: 22-30 يوم عمل (4-6 أسابيع)

**البنية الأساسية القوية موجودة. الآن فقط ابنِ المكونات وستحصل على تطبيق كامل!** 🚀

---

**آخر تحديث**: اليوم  
**الحالة الحالية**: 45% مكتمل  
**الخطوة التالية**: IPC Handlers ⚠️
