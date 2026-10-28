# خطة نقل المشروع من JavaScript Vanilla إلى React

## نظرة عامة
هذا المستند يحتوي على خطة تنفيذ مفصلة لنقل نظام إدارة المستندات العسكرية من JavaScript الخام إلى React مع الحفاظ على **كل** الوظائف والأنماط كما هي.

---

## 📋 الأنظمة المكتشفة في المشروع القديم

### 1. نظام الفاكسات (Fax System)
#### البيانات والحالة:
- `originalFax`: الفاكس الأصلي المرفوع
- `faxPages`: صفحات الفاكس الأصلي
- `filteredFaxes`: الفاكسات المفلترة
- `currentFilteringSession`: جلسة الفلترة الحالية
- `replies`: الردود على الفاكسات

#### الوظائف الرئيسية:
```javascript
// رفع الفاكس
- uploadOriginalFaxBtn: فتح مودال الرفع
- handleUploadFax(): رفع PDF أو صور متعددة
- handlePdfFileSelect(): معالجة ملف PDF
- handleImagesFileSelect(): معالجة الصور المتعددة

// الفلترة
- openFaxFilterModal(): فتح مودال فلترة الصفحات
- handleConfirmFilter(): تأكيد الفلترة وإنشاء الفاكسات
- renderFaxes(): عرض الفاكسات المفلترة

// العمليات على الفاكسات
- toggleFaxSelection(): تحديد/إلغاء تحديد فاكس
- deleteSelectedFaxes(): حذف الفاكسات المحددة
- clearFaxSelection(): إلغاء التحديد
- toggleOriginalFaxFavorite(): إضافة/إزالة من المفضلة
- deleteOriginalFax(): حذف الفاكس الأصلي

// الردود
- addReply(): إضافة رد على فاكس
- deleteReply(): حذف رد
- renderReplies(): عرض الردود
```

#### الأنماط CSS المطلوبة:
```css
.original-fax-section
.original-fax-header
.original-fax-box
.original-fax-preview
.original-fax-actions
.faxes-section
.faxes-grid
.fax-card
.fax-selection-checkbox
.replies-section
.replies-grid
.reply-card
```

---

### 2. نظام الملفات اليومية (Today's Files System)
#### البيانات والحالة:
- `lastRenderedFiles`: قائمة الملفات المعروضة حالياً
- `selectedDate`: التاريخ المحدد للفلترة
- `thumbnailCache`: ذاكرة تخزين مؤقتة للصور المصغرة
- `selectedFiles`: الملفات المحددة للطباعة/الدمج/الحذف

#### الوظائف الرئيسية:
```javascript
// عرض الملفات
- renderTodayFiles(): عرض ملفات اليوم
- generateThumbnailAsync(): توليد صور مصغرة للملفات
- displayThumbnail(): عرض الصورة المصغرة
- showPlaceholder(): عرض placeholder

// فلترة التاريخ
- initializeDateFilter(): تهيئة فلتر التاريخ
- updateSidebarTitle(): تحديث عنوان القسم

// التحديد والعمليات
- toggleFileSelection(): تحديد/إلغاء تحديد ملف
- selectAllFiles(): تحديد جميع الملفات
- deselectAllFiles(): إلغاء التحديد
- printSingleFile(): طباعة ملف واحد
- printSelectedFiles(): طباعة الملفات المحددة
- mergeSelectedFiles(): دمج الملفات المحددة
- deleteSingleFile(): حذف ملف واحد
- deleteSelectedFiles(): حذف الملفات المحددة
- openTodayCopiesFolder(): فتح مجلد اليوم
```

#### الأنماط CSS المطلوبة:
```css
.sidebar
.sidebar-header
.sidebar-content
.date-filter-container
.date-filter-input
.btn-reset-date
.file-item
.file-checkbox
.file-preview-thumbnail
.file-info-overlay
.file-item-actions
.file-action-btn
.selection-toolbar
.selection-info
.selection-actions
.btn-toolbar
.thumbnail-loading
.thumbnail-placeholder
.spinner
```

---

### 3. نظام الفئات والمستندات (Categories & Documents)
#### البيانات والحالة:
- `categories`: قائمة الفئات
- `otherDocuments`: المستندات الأخرى (deprecated)

#### الوظائف الرئيسية:
```javascript
// إدارة الفئات
- openAddCategoryModal(): فتح مودال إضافة فئة
- handleAddCategory(): إضافة فئة جديدة
- openEditCategoryModal(): فتح مودال تعديل فئة
- handleEditCategory(): حفظ تعديلات الفئة
- handleDeleteCategory(): حذف فئة
- renderCategories(): عرض الفئات
- updateCategoryFilterOptions(): تحديث خيارات الفلتر

// إدارة المستندات
- openCategorySettings(): فتح إعدادات الفئة لإضافة مستند
- handleAddDocument(): إضافة مستند جديد
- openEditDocumentModal(): فتح مودال تعديل مستند
- handleEditDocument(): حفظ تعديلات المستند
- handleDeleteDocument(): حذف مستند
- renderCategoryDocuments(): عرض مستندات الفئة
- openDocumentDetail(): فتح تفاصيل المستند
- addNewDocumentCopy(): إنشاء نسخة جديدة من المستند
- openDocumentCopiesFolder(): فتح مجلد نسخ المستند
```

#### الأنماط CSS المطلوبة:
```css
.add-category-section
.btn-add-category
.category-card
.category-header
.category-title
.category-icon
.category-actions
.category-content
.category-documents-grid
.category-empty
.task-card
.clickable-card
.doc-settings-btn
.task-icon
.task-title
.task-meta
.document-item
.document-icon
.document-details
```

---

### 4. نظام التذكيرات (Reminders System)
#### البيانات والحالة:
- `reminders`: قائمة التذكيرات
- كل تذكير يحتوي على:
  - `id`: معرف فريد
  - `title`: عنوان التذكير
  - `date`: تاريخ التذكير
  - `time`: وقت التذكير (اختياري)
  - `notes`: ملاحظات (اختياري)
  - `isExpired`: حالة انتهاء التذكير

#### الوظائف الرئيسية:
```javascript
// إدارة التذكيرات
- addReminder(): إضافة تذكير جديد
- editReminder(): تعديل تذكير
- deleteReminder(): حذف تذكير
- checkExpiredReminders(): فحص التذكيرات المنتهية
- renderReminders(): عرض التذكيرات
- filterReminders(): فلترة التذكيرات (الكل/النشطة/المنتهية)
- sortReminders(): ترتيب التذكيرات (حسب التاريخ/العنوان)
```

#### الأنماط CSS المطلوبة:
```css
.reminders-section
.reminders-header
.reminders-filters
.reminders-grid
.reminder-card
.reminder-expired
.reminder-active
.reminder-title
.reminder-date
.reminder-notes
.reminder-actions
.reminders-empty
```

---

### 5. نظام القوائم (Lists System)
#### البيانات والحالة:
- `lists`: قائمة القوائم
- كل قائمة تحتوي على:
  - `id`: معرف فريد
  - `name`: اسم القائمة
  - `isDefault`: هل هي قائمة افتراضية (المفضلة)
  - `items`: عناصر القائمة

#### الوظائف الرئيسية:
```javascript
// إدارة القوائم
- addList(): إضافة قائمة جديدة
- editList(): تعديل قائمة
- deleteList(): حذف قائمة
- renderLists(): عرض القوائم

// إدارة عناصر القوائم
- addListItem(): إضافة عنصر للقائمة
- editListItem(): تعديل عنصر
- deleteListItem(): حذف عنصر
- toggleListItemComplete(): تبديل حالة اكتمال العنصر
- renderListItems(): عرض عناصر القائمة
```

#### الأنماط CSS المطلوبة:
```css
.lists-section
.lists-header
.lists-grid
.list-card
.list-name
.list-items-count
.list-actions
.list-items
.list-item
.list-item-checkbox
.list-item-text
.list-item-completed
.list-item-actions
```

---

### 6. نظام القوالب (Templates System)
#### البيانات والحالة:
- `templates`: قائمة القوالب
- كل قالب يحتوي على:
  - `id`: معرف فريد
  - `name`: اسم القالب
  - `icon`: أيقونة القالب
  - `file`: مسار الملف
  - `originalFileName`: اسم الملف الأصلي

#### الوظائف الرئيسية:
```javascript
// إدارة القوالب
- addTemplate(): إضافة قالب جديد
- editTemplate(): تعديل قالب
- deleteTemplate(): حذف قالب
- useTemplate(): استخدام قالب (إنشاء نسخة)
- renderTemplates(): عرض القوالب
```

#### الأنماط CSS المطلوبة:
```css
.templates-section (غالباً مشابه لـ category-card)
.template-card
.template-icon
.template-name
.template-actions
```

---

### 7. نظام الإعدادات (Settings System)
#### البيانات والحالة:
- `appSettings`:
  - `savePath`: مسار حفظ المستندات
  - `dateFormat`: نمط تنظيم المجلدات حسب التاريخ
  - `customPattern`: النمط المخصص

#### الأنماط المدعومة:
```javascript
'YYYY/MM/DD': '2026/10/11'
'YYYY/MM-DD': '2026/10-11'
'YYYY-MM-DD': '2026-10-11'
'DD-MM-YYYY': '١١-١٠-٢٠٢٦' (أرقام عربية)
'YYYY': '2026'
'YYYY/MM': '2026/10'
'CUSTOM': نمط مخصص
```

#### الكلمات المفتاحية للنمط المخصص:
- `YYYY`: السنة (4 أرقام)
- `YY`: السنة (رقمان)
- `MM`: الشهر (رقمان)
- `M`: الشهر (بدون صفر)
- `MMMM`: اسم الشهر كامل (عربي)
- `MMM`: اسم الشهر مختصر (عربي)
- `DD`: اليوم (رقمان)
- `D`: اليوم (بدون صفر)
- `[AR]`: تحويل لأرقام عربية

#### الوظائف الرئيسية:
```javascript
- loadSettings(): تحميل الإعدادات
- saveSettings(): حفظ الإعدادات
- handleSaveSettings(): معالجة حفظ الإعدادات
- browseSavePath(): استعراض مجلد الحفظ
- formatDateByPattern(): تنسيق التاريخ حسب النمط
- updatePathPreview(): تحديث معاينة المسار
- toggleCustomPatternSection(): إظهار/إخفاء قسم النمط المخصص
```

#### الأنماط CSS المطلوبة:
```css
.settings-modal (موجود في modal)
.form-group
.path-input-wrapper
.btn-browse
.date-format-options
.radio-option
.radio-label
.format-name
.format-example
.custom-pattern-section
.custom-pattern-input
.keywords-reference
.keywords-grid
.keyword-item
.path-preview
```

---

### 8. نظام البحث والفلترة (Search & Filter)
#### الوظائف الرئيسية:
```javascript
- initializeSearchAndFilter(): تهيئة البحث والفلترة
- handleSearch(): معالجة البحث
- handleCategoryFilter(): فلترة حسب الفئة
- handleSortChange(): ترتيب النتائج
- filterAndSortFiles(): تطبيق الفلترة والترتيب
```

#### الأنماط CSS المطلوبة:
```css
.search-box
.search-filter-container
.filters-view-container
.sort-view-container
.filter-select
.filters-container
```

---

### 9. نظام الإيموجي (Emoji Picker)
#### البيانات:
```javascript
emojiData: {
  'smileys': { name, icon, emojis[] },
  'people': { name, icon, emojis[] },
  'animals': { name, icon, emojis[] },
  'food': { name, icon, emojis[] },
  'activities': { name, icon, emojis[] },
  'travel': { name, icon, emojis[] },
  'objects': { name, icon, emojis[] },
  'symbols': { name, icon, emojis[] },
  'flags': { name, icon, emojis[] }
}
```

#### الوظائف الرئيسية:
```javascript
- initEmojiPicker(): تهيئة منتقي الإيموجي
- showEmojiPicker(): عرض المنتقي
- closeEmojiPicker(): إغلاق المنتقي
- renderEmojiGrid(): عرض شبكة الإيموجي
- emojiToFilename(): تحويل الإيموجي لاسم ملف
```

#### الأنماط CSS المطلوبة:
```css
.emoji-picker-overlay
.emoji-picker-dropdown
.emoji-picker-header
.emoji-picker-search
.emoji-picker-categories
.emoji-category-btn
.emoji-picker-grid
.emoji-item
.btn-emoji-picker
```

---

### 10. نظام التحكم بالنافذة (Window Controls)
#### الوظائف الرئيسية:
```javascript
- initializeWindowControls(): تهيئة أزرار النافذة
- btn-minimize: تصغير النافذة
- btn-maximize: تكبير/استعادة النافذة
- btn-close: إغلاق النافذة
- shortcutsDropdownBtn: قائمة الاختصارات
```

#### الأنماط CSS المطلوبة:
```css
.custom-titlebar
.titlebar-drag-region
.titlebar-title
.titlebar-shortcuts-btn
.shortcuts-dropdown
.shortcuts-header
.shortcuts-list
.shortcut-item
.shortcut-label
.shortcut-keys
.titlebar-controls
.titlebar-btn
.close-btn
```

---

### 11. نظام المودالات العامة (Modal System)
#### المودالات المطلوبة:
```javascript
1. addCategoryModal - إضافة فئة
2. editCategoryModal - تعديل فئة
3. otherDocsModal - إعدادات المستندات
4. documentDetailModal - تفاصيل المستند
5. editDocumentModal - تعديل المستند
6. settingsModal - إعدادات التطبيق
7. uploadFaxModal - رفع فاكس أصلي
8. faxFilterModal - فلترة صفحات الفاكس
9. addReplyModal - إضافة رد
10. addReminderModal - إضافة تذكير
11. addListModal - إضافة قائمة
12. addListItemModal - إضافة عنصر قائمة
```

#### الأنماط CSS المطلوبة:
```css
.modal
.modal.active
.modal-content
.modal-small
.modal-header
.modal-body
.modal-footer
.btn-close
.form-group
.form-actions
.file-input-wrapper
.file-input-text
.btn-file
```

---

## 🎯 خطة التنفيذ المفصلة

### المرحلة 1: إعداد البنية الأساسية ✅ (مكتملة جزئياً)

- [x] 1.1 التحقق من وجود Context API (AppStateContext, SettingsContext)
  - الملفات: `src/context/AppStateContext.jsx`, `src/context/SettingsContext.jsx`
  - التحقق: التحقق من وجود الملفات وقراءتها

- [ ] 1.2 إنشاء Hooks مخصصة للوظائف المشتركة
  - الملفات: `src/hooks/useFileOperations.js`, `src/hooks/useDateFormatter.js`, `src/hooks/useModal.js`
  - الوظائف: عمليات الملفات، تنسيق التاريخ، إدارة المودالات

- [ ] 1.3 إعداد أدوات مساعدة (Utilities)
  - الملفات: `src/utils/dateFormat.js`, `src/utils/emojiConverter.js`, `src/utils/fileHelpers.js`
  - التحقق: نقل الدوال المساعدة من script.js

### المرحلة 2: نقل نظام الفاكسات (Priority: HIGH)

- [ ] 2.1 إنشاء مكون OriginalFaxSection
  - الملف: `src/components/fax/OriginalFaxSection.jsx`
  - الوظائف:
    * رفع فاكس أصلي (PDF أو صور متعددة)
    * عرض معلومات الفاكس
    * أزرار: تغيير، حذف، إضافة للمفضلة، فلترة الصفحات
  - الأنماط: نسخ من `.original-fax-section` وما يتعلق بها
  - التحقق: `npm run dev` ثم اختبار رفع فاكس

- [ ] 2.2 إنشاء مكون FaxFilterModal
  - الملف: `src/components/fax/FaxFilterModal.jsx`
  - الوظائف:
    * عرض صفحات الفاكس الأصلي
    * تحديد الصفحات لكل فاكس
    * تأكيد الفلترة وإنشاء الفاكسات
  - الأنماط: نسخ من `.fax-filter-modal` وما يتعلق بها
  - التحقق: اختبار فلترة صفحات فاكس مرفوع

- [ ] 2.3 إنشاء مكون FaxesSection
  - الملف: `src/components/fax/FaxesSection.jsx`
  - الوظائف:
    * عرض الفاكسات المفلترة في شبكة
    * تحديد متعدد للفاكسات
    * حذف الفاكسات المحددة
  - الأنماط: نسخ من `.faxes-section`, `.faxes-grid`, `.fax-card`
  - التحقق: عرض الفاكسات والتحديد والحذف

- [ ] 2.4 إنشاء مكون RepliesSection
  - الملف: `src/components/fax/RepliesSection.jsx`
  - الوظائف:
    * عرض الردود المرتبطة بالفاكسات
    * إضافة رد جديد
    * حذف رد
  - الأنماط: نسخ من `.replies-section`, `.replies-grid`, `.reply-card`
  - التحقق: إضافة وحذف ردود

- [ ] 2.5 دمج مكونات الفاكسات في App
  - الملف: `src/App.jsx`
  - الخطوات:
    * استيراد المكونات
    * وضعها في القسم الرئيسي
    * ربطها بـ Context
  - التحقق: `npm run dev` ثم اختبار الدورة الكاملة

### المرحلة 3: نقل نظام الملفات اليومية (Priority: HIGH)

- [ ] 3.1 إنشاء مكون TodayFilesSidebar
  - الملف: `src/components/files/TodayFilesSidebar.jsx`
  - الوظائف:
    * عرض ملفات اليوم في شبكة بطاقات
    * توليد صور مصغرة للملفات Word
    * تحديد متعدد للملفات
  - الأنماط: نسخ من `.sidebar`, `.file-item`, `.file-preview-thumbnail`
  - التحقق: عرض الملفات مع الصور المصغرة

- [ ] 3.2 إنشاء مكون DateFilter
  - الملف: `src/components/files/DateFilter.jsx`
  - الوظائف:
    * اختيار تاريخ
    * زر العودة لتاريخ اليوم
    * تحديث العنوان حسب التاريخ
  - الأنماط: نسخ من `.date-filter-container`, `.date-filter-input`
  - التحقق: تغيير التاريخ وعرض الملفات المناسبة

- [ ] 3.3 إنشاء مكون SelectionToolbar
  - الملف: `src/components/files/SelectionToolbar.jsx`
  - الوظائف:
    * تحديد الكل / إلغاء التحديد
    * طباعة المحدد
    * دمج الملفات المحددة
    * حذف المحدد
  - الأنماط: نسخ من `.selection-toolbar`, `.selection-actions`
  - التحقق: تحديد ملفات وتنفيذ العمليات

- [ ] 3.4 إنشاء Hook مخصص للملفات
  - الملف: `src/hooks/useFileOperations.js`
  - الوظائف:
    * `renderTodayFiles()`
    * `generateThumbnailAsync()`
    * `toggleFileSelection()`
    * `selectAllFiles()`
    * `printSelectedFiles()`
    * `mergeSelectedFiles()`
    * `deleteSelectedFiles()`
  - التحقق: اختبار الوظائف من المكونات

- [ ] 3.5 دمج مكونات الملفات في App
  - الملف: `src/App.jsx`
  - الخطوات:
    * استيراد TodayFilesSidebar
    * وضعه في المكان الصحيح
    * ربطه بـ Context
  - التحقق: عرض الشريط الجانبي وتنفيذ العمليات

### المرحلة 4: نقل نظام الفئات والمستندات (Priority: HIGH)

- [ ] 4.1 إنشاء مكون CategoriesContainer
  - الملف: `src/components/categories/CategoriesContainer.jsx`
  - الوظائف:
    * عرض جميع الفئات
    * زر إضافة فئة جديدة
  - الأنماط: نسخ من `#categoriesContainer`, `.add-category-section`
  - التحقق: عرض الفئات

- [ ] 4.2 إنشاء مكون CategoryCard
  - الملف: `src/components/categories/CategoryCard.jsx`
  - الوظائف:
    * عرض اسم وأيقونة الفئة
    * زر إضافة مستند
    * زر إعدادات الفئة
    * عرض مستندات الفئة
  - الأنماط: نسخ من `.category-card`, `.category-header`, `.category-content`
  - التحقق: عرض بطاقة فئة

- [ ] 4.3 إنشاء مكون DocumentCard
  - الملف: `src/components/categories/DocumentCard.jsx`
  - الوظائف:
    * عرض أيقونة واسم المستند
    * زر إعدادات المستند (ظاهر عند hover)
    * فتح تفاصيل المستند عند النقر
  - الأنماط: نسخ من `.task-card`, `.doc-settings-btn`
  - التحقق: عرض بطاقة مستند والنقر عليها

- [ ] 4.4 إنشاء مكون AddCategoryModal
  - الملف: `src/components/categories/AddCategoryModal.jsx`
  - الوظائف:
    * إدخال اسم الفئة
    * اختيار أيقونة (إيموجي)
    * حفظ الفئة
  - الأنماط: استخدام `.modal`, `.modal-content`, `.form-group`
  - التحقق: إضافة فئة جديدة

- [ ] 4.5 إنشاء مكون EditCategoryModal
  - الملف: `src/components/categories/EditCategoryModal.jsx`
  - الوظائف:
    * تعديل اسم وأيقونة الفئة
    * حذف الفئة
  - الأنماط: استخدام `.modal`, `.form-group`, `.btn-danger`
  - التحقق: تعديل وحذف فئة

- [ ] 4.6 إنشاء مكون AddDocumentModal
  - الملف: `src/components/documents/AddDocumentModal.jsx`
  - الوظائف:
    * إدخال اسم المستند
    * رفع صورة أيقونة (اختياري)
    * رفع ملف Word أصلي
    * حفظ المستند في الفئة
  - الأنماط: استخدام `.add-document-form`, `.file-input-wrapper`
  - التحقق: إضافة مستند جديد لفئة

- [ ] 4.7 إنشاء مكون DocumentDetailModal
  - الملف: `src/components/documents/DocumentDetailModal.jsx`
  - الوظائف:
    * عرض نسخ المستند
    * إنشاء نسخة جديدة
    * طباعة مباشرة
    * فتح مجلد المستند
  - الأنماط: نسخ من `.task-copies`, `.task-copy-item`
  - التحقق: فتح تفاصيل مستند والعمليات

- [ ] 4.8 إنشاء مكون EditDocumentModal
  - الملف: `src/components/documents/EditDocumentModal.jsx`
  - الوظائف:
    * تعديل اسم المستند
    * تغيير الأيقونة
    * تغيير الملف الأصلي
    * حذف المستند
  - الأنماط: استخدام `.current-icon-preview`, `.current-file-info`
  - التحقق: تعديل وحذف مستند

- [ ] 4.9 دمج مكونات الفئات والمستندات في App
  - الملف: `src/App.jsx`
  - الخطوات:
    * استيراد CategoriesContainer
    * وضعه في القسم الرئيسي
    * ربطه بـ Context
  - التحقق: الدورة الكاملة للفئات والمستندات

### المرحلة 5: نقل نظام التذكيرات (Priority: MEDIUM)

- [ ] 5.1 إنشاء مكون RemindersSection
  - الملف: `src/components/reminders/RemindersSection.jsx`
  - الوظائف:
    * عرض التذكيرات في شبكة
    * فلترة التذكيرات (الكل/النشطة/المنتهية)
    * ترتيب التذكيرات
    * زر إضافة تذكير
  - الأنماط: نسخ من `.reminders-section`, `.reminders-header`, `.reminders-filters`
  - التحقق: عرض التذكيرات والفلترة

- [ ] 5.2 إنشاء مكون ReminderCard
  - الملف: `src/components/reminders/ReminderCard.jsx`
  - الوظائف:
    * عرض عنوان، تاريخ، وقت، ملاحظات
    * تمييز المنتهية
    * أزرار: تعديل، حذف
  - الأنماط: نسخ من `.reminder-card`, `.reminder-expired`, `.reminder-active`
  - التحقق: عرض بطاقة تذكير

- [ ] 5.3 إنشاء مكون AddReminderModal
  - الملف: `src/components/reminders/AddReminderModal.jsx`
  - الوظائف:
    * إدخال العنوان، التاريخ، الوقت، الملاحظات
    * حفظ التذكير
  - الأنماط: استخدام `.modal`, `.form-group`
  - التحقق: إضافة تذكير جديد

- [ ] 5.4 إنشاء Hook للتذكيرات
  - الملف: `src/hooks/useReminders.js`
  - الوظائف:
    * `addReminder()`
    * `editReminder()`
    * `deleteReminder()`
    * `checkExpiredReminders()`
    * `filterReminders()`
  - التحقق: اختبار الوظائف من المكونات

- [ ] 5.5 دمج مكونات التذكيرات في App
  - الملف: `src/App.jsx`
  - الخطوات:
    * استيراد RemindersSection
    * إضافة زر التذكيرات في Sidebar
    * ربطه بـ Context
  - التحقق: عرض التذكيرات وإدارتها

### المرحلة 6: نقل نظام القوائم (Priority: MEDIUM)

- [ ] 6.1 إنشاء مكون ListsSection
  - الملف: `src/components/lists/ListsSection.jsx`
  - الوظائف:
    * عرض القوائم في شبكة
    * زر إنشاء قائمة جديدة
  - الأنماط: نسخ من `.lists-section`, `.lists-header`, `.lists-grid`
  - التحقق: عرض القوائم

- [ ] 6.2 إنشاء مكون ListCard
  - الملف: `src/components/lists/ListCard.jsx`
  - الوظائف:
    * عرض اسم القائمة وعدد العناصر
    * عرض عناصر القائمة
    * إضافة عنصر جديد
    * أزرار: تعديل، حذف
  - الأنماط: نسخ من `.list-card`, `.list-items`, `.list-item`
  - التحقق: عرض بطاقة قائمة والعناصر

- [ ] 6.3 إنشاء مكون ListItem
  - الملف: `src/components/lists/ListItem.jsx`
  - الوظائف:
    * عرض نص العنصر
    * checkbox للإكمال
    * أزرار: تعديل، حذف
  - الأنماط: نسخ من `.list-item`, `.list-item-checkbox`, `.list-item-completed`
  - التحقق: عرض عنصر والعمليات عليه

- [ ] 6.4 إنشاء مكونات المودالات
  - الملفات:
    * `src/components/lists/AddListModal.jsx`
    * `src/components/lists/AddListItemModal.jsx`
  - الوظائف: إضافة قوائم وعناصر
  - الأنماط: استخدام `.modal`, `.form-group`
  - التحقق: إضافة قوائم وعناصر

- [ ] 6.5 إنشاء Hook للقوائم
  - الملف: `src/hooks/useLists.js`
  - الوظائف:
    * `addList()`, `editList()`, `deleteList()`
    * `addListItem()`, `editListItem()`, `deleteListItem()`
    * `toggleListItemComplete()`
  - التحقق: اختبار الوظائف

- [ ] 6.6 دمج مكونات القوائم في App
  - الملف: `src/App.jsx`
  - الخطوات:
    * استيراد ListsSection
    * إضافة زر القوائم في Sidebar
    * ربطه بـ Context
  - التحقق: إدارة القوائم والعناصر

### المرحلة 7: نقل نظام القوالب (Priority: LOW)

- [ ] 7.1 إنشاء مكون TemplatesSection
  - الملف: `src/components/templates/TemplatesSection.jsx`
  - الوظائف:
    * عرض القوالب في شبكة
    * زر إضافة قالب جديد
  - الأنماط: مشابه لـ `.category-card`
  - التحقق: عرض القوالب

- [ ] 7.2 إنشاء مكون TemplateCard
  - الملف: `src/components/templates/TemplateCard.jsx`
  - الوظائف:
    * عرض أيقونة واسم القالب
    * زر استخدام القالب (إنشاء نسخة)
    * أزرار: تعديل، حذف
  - الأنماط: نسخ من `.task-card`
  - التحقق: عرض بطاقة قالب

- [ ] 7.3 إنشاء مكونات المودالات
  - الملفات:
    * `src/components/templates/AddTemplateModal.jsx`
    * `src/components/templates/EditTemplateModal.jsx`
  - الوظائف: إضافة وتعديل قوالب
  - الأنماط: استخدام `.modal`, `.file-input-wrapper`
  - التحقق: إدارة القوالب

- [ ] 7.4 دمج مكونات القوالب في App
  - الملف: `src/App.jsx`
  - الخطوات:
    * استيراد TemplatesSection
    * إضافة زر القوالب في Sidebar
    * ربطه بـ Context
  - التحقق: إدارة القوالب

### المرحلة 8: نقل نظام الإعدادات (Priority: HIGH)

- [ ] 8.1 إنشاء مكون SettingsModal
  - الملف: `src/components/settings/SettingsModal.jsx`
  - الوظائف:
    * اختيار مسار الحفظ
    * اختيار نمط تنظيم المجلدات
    * إدخال نمط مخصص
    * معاينة المسار
  - الأنماط: نسخ من `#settingsModal`, `.date-format-options`, `.keywords-reference`
  - التحقق: فتح الإعدادات وحفظها

- [ ] 8.2 إنشاء مكون DateFormatOptions
  - الملف: `src/components/settings/DateFormatOptions.jsx`
  - الوظائف:
    * عرض خيارات النمط
    * قسم النمط المخصص
    * دليل الكلمات المفتاحية
  - الأنماط: نسخ من `.radio-option`, `.custom-pattern-section`
  - التحقق: اختيار نمط وعرض المعاينة

- [ ] 8.3 تحديث SettingsContext
  - الملف: `src/context/SettingsContext.jsx`
  - الوظائف:
    * حفظ وتحميل الإعدادات من Electron
    * توفير دوال لتنسيق التاريخ
  - التحقق: حفظ الإعدادات والتحميل عند إعادة التشغيل

- [ ] 8.4 دمج الإعدادات في App
  - الملف: `src/App.jsx`
  - الخطوات:
    * ربط زر الإعدادات في Header
    * عرض SettingsModal
  - التحقق: فتح الإعدادات وتطبيقها

### المرحلة 9: نقل نظام البحث والفلترة (Priority: MEDIUM)

- [ ] 9.1 إنشاء مكون SearchBox
  - الملف: `src/components/common/SearchBox.jsx`
  - الوظائف:
    * input للبحث
    * البحث في الوقت الفعلي
  - الأنماط: نسخ من `.search-box`
  - التحقق: البحث في المستندات

- [ ] 9.2 إنشاء مكون FilterBar
  - الملف: `src/components/common/FilterBar.jsx`
  - الوظائف:
    * فلتر حسب الفئة
    * فلتر حسب الترتيب
    * أزرار العرض (شبكة/قائمة)
  - الأنماط: نسخ من `.filters-view-container`, `.filter-select`
  - التحقق: تطبيق الفلاتر

- [ ] 9.3 إنشاء Hook للبحث
  - الملف: `src/hooks/useSearch.js`
  - الوظائف:
    * `handleSearch()`
    * `handleFilter()`
    * `handleSort()`
    * `filterAndSortItems()`
  - التحقق: البحث والفلترة تعمل

- [ ] 9.4 دمج البحث والفلترة في App
  - الملف: `src/App.jsx`
  - الخطوات:
    * إضافة SearchBox و FilterBar
    * ربطهم بالمكونات المناسبة
  - التحقق: البحث والفلترة في جميع الأقسام

### المرحلة 10: نقل نظام الإيموجي (Priority: LOW)

- [ ] 10.1 إنشاء مكون EmojiPicker
  - الملف: `src/components/common/EmojiPicker.jsx`
  - الوظائف:
    * عرض فئات الإيموجي
    * شبكة الإيموجي
    * البحث في الإيموجي
    * اختيار إيموجي
  - الأنماط: نسخ من `.emoji-picker-dropdown`, `.emoji-picker-grid`
  - التحقق: فتح المنتقي واختيار إيموجي

- [ ] 10.2 إنشاء Hook للإيموجي
  - الملف: `src/hooks/useEmojiPicker.js`
  - الوظائف:
    * `showEmojiPicker()`
    * `closeEmojiPicker()`
    * `selectEmoji()`
  - التحقق: استخدام المنتقي من مكونات مختلفة

- [ ] 10.3 دمج منتقي الإيموجي
  - الملفات: في جميع المودالات التي تحتاج إيموجي
  - الخطوات:
    * إضافة زر الإيموجي بجانب input
    * ربطه بـ EmojiPicker
  - التحقق: اختيار إيموجي في الفئات والقوائم

### المرحلة 11: نقل نظام التحكم بالنافذة (Priority: MEDIUM)

- [ ] 11.1 إنشاء مكون TitleBar
  - الملف: `src/components/layout/TitleBar.jsx` (موجود مسبقاً - تحديث)
  - الوظائف:
    * عنوان التطبيق
    * قائمة الاختصارات
    * أزرار: تصغير، تكبير، إغلاق
  - الأنماط: نسخ من `.custom-titlebar`, `.titlebar-controls`
  - التحقق: التحكم بالنافذة

- [ ] 11.2 إنشاء مكون ShortcutsDropdown
  - الملف: `src/components/layout/ShortcutsDropdown.jsx`
  - الوظائف:
    * عرض قائمة الاختصارات
    * تنفيذ الاختصار عند النقر
  - الأنماط: نسخ من `.shortcuts-dropdown`, `.shortcut-item`
  - التحقق: عرض القائمة وتنفيذ الاختصارات

- [ ] 11.3 ربط الأزرار بـ Electron
  - الملف: `src/hooks/useWindowControls.js`
  - الوظائف:
    * `minimizeWindow()`
    * `maximizeWindow()`
    * `closeWindow()`
    * `executeShortcut()`
  - التحقق: الأزرار تعمل

### المرحلة 12: نقل الأنماط CSS (Priority: HIGH)

- [ ] 12.1 نقل الأنماط العامة
  - الملف: `src/styles/global.css`
  - المحتوى:
    * خطوط Tajawal
    * أنماط body وعامة
    * أنماط SVG Icons
    * أنماط scrollbar
  - التحقق: استيراد في `src/main.jsx`

- [ ] 12.2 نقل أنماط Layout
  - الملف: `src/styles/layout.css`
  - المحتوى:
    * custom-titlebar
    * header
    * sidebar
    * app-sidebar (الشريط الجانبي للأقسام)
    * container
  - التحقق: Layout يظهر صحيح

- [ ] 12.3 نقل أنماط المكونات
  - الملفات:
    * `src/styles/fax.css` - أنماط الفاكسات
    * `src/styles/files.css` - أنماط الملفات
    * `src/styles/categories.css` - أنماط الفئات
    * `src/styles/modals.css` - أنماط المودالات
    * `src/styles/forms.css` - أنماط النماذج
    * `src/styles/buttons.css` - أنماط الأزرار
    * `src/styles/reminders.css` - أنماط التذكيرات
    * `src/styles/lists.css` - أنماط القوائم
    * `src/styles/emoji.css` - أنماط الإيموجي
  - التحقق: كل قسم يظهر كما في المشروع القديم

- [ ] 12.4 نقل أنماط Responsive
  - الملف: `src/styles/responsive.css`
  - المحتوى: جميع media queries من style.css
  - التحقق: التطبيق responsive على جميع الأحجام

- [ ] 12.5 دمج الأنماط
  - الملف: `src/main.jsx`
  - الخطوات:
    * استيراد جميع ملفات CSS
    * بالترتيب الصحيح
  - التحقق: `npm run dev` ثم فحص جميع الصفحات

### المرحلة 13: الاختبار النهائي والتحقق (Priority: CRITICAL)

- [ ] 13.1 اختبار نظام الفاكسات
  - الخطوات:
    1. رفع فاكس أصلي (PDF وصور)
    2. فلترة الصفحات
    3. عرض الفاكسات
    4. إضافة رد
    5. حذف فاكسات
  - النتيجة المتوقعة: جميع الوظائف تعمل كما في المشروع القديم

- [ ] 13.2 اختبار نظام الملفات
  - الخطوات:
    1. عرض ملفات اليوم
    2. تغيير التاريخ
    3. تحديد ملفات
    4. طباعة، دمج، حذف
    5. فتح المجلد
  - النتيجة المتوقعة: جميع الوظائف تعمل

- [ ] 13.3 اختبار نظام الفئات والمستندات
  - الخطوات:
    1. إضافة فئة
    2. إضافة مستند لفئة
    3. فتح تفاصيل مستند
    4. إنشاء نسخة جديدة
    5. طباعة مباشرة
    6. تعديل وحذف
  - النتيجة المتوقعة: جميع الوظائف تعمل

- [ ] 13.4 اختبار نظام التذكيرات
  - الخطوات:
    1. إضافة تذكير
    2. فلترة التذكيرات
    3. تعديل تذكير
    4. حذف تذكير
    5. فحص التذكيرات المنتهية
  - النتيجة المتوقعة: جميع الوظائف تعمل

- [ ] 13.5 اختبار نظام القوائم
  - الخطوات:
    1. إنشاء قائمة
    2. إضافة عناصر
    3. تحديد عنصر كمكتمل
    4. تعديل وحذف عناصر
    5. حذف قائمة
  - النتيجة المتوقعة: جميع الوظائف تعمل

- [ ] 13.6 اختبار نظام القوالب
  - الخطوات:
    1. إضافة قالب
    2. استخدام قالب
    3. تعديل قالب
    4. حذف قالب
  - النتيجة المتوقعة: جميع الوظائف تعمل

- [ ] 13.7 اختبار نظام الإعدادات
  - الخطوات:
    1. تغيير مسار الحفظ
    2. تغيير نمط التاريخ
    3. استخدام نمط مخصص
    4. حفظ الإعدادات
    5. إعادة تشغيل التطبيق والتحقق
  - النتيجة المتوقعة: الإعدادات تحفظ وتطبق

- [ ] 13.8 اختبار البحث والفلترة
  - الخطوات:
    1. البحث في المستندات
    2. فلترة حسب الفئة
    3. ترتيب النتائج
  - النتيجة المتوقعة: النتائج صحيحة

- [ ] 13.9 اختبار Responsive
  - الأحجام:
    * Desktop (1920px+)
    * Laptop (1024px - 1440px)
    * Tablet (768px - 1023px)
    * Mobile (320px - 767px)
  - النتيجة المتوقعة: جميع الأقسام تظهر صحيحة

- [ ] 13.10 اختبار التكامل مع Electron
  - الخطوات:
    1. بناء التطبيق: `npm run build`
    2. تشغيل Electron: `npm run electron:dev`
    3. اختبار جميع الوظائف
    4. بناء التطبيق النهائي: `npm run electron:build`
  - النتيجة المتوقعة: التطبيق يعمل بشكل كامل

---

## 📝 ملاحظات مهمة

### 1. الحفاظ على التوافق مع Electron
- جميع عمليات الملفات (رفع، حفظ، فتح) يجب أن تمر عبر `window.electronAPI`
- لا تستخدم `fs` مباشرة في React

### 2. Context API
- استخدام `AppStateContext` لجميع البيانات (فاكسات، ملفات، فئات، إلخ)
- استخدام `SettingsContext` للإعدادات

### 3. الأنماط
- **لا تغيير أي شيء** في الأنماط CSS
- نسخ الأنماط كما هي من `style.css`
- الحفاظ على جميع الأسماء والقيم

### 4. الوظائف
- **لا حذف أي وظيفة** من `script.js`
- نقل جميع الوظائف كما هي
- الحفاظ على نفس المنطق

### 5. الأولويات
```
HIGH: الفاكسات، الملفات اليومية، الفئات/المستندات، الإعدادات، CSS
MEDIUM: التذكيرات، القوائم، البحث، التحكم بالنافذة
LOW: القوالب، الإيموجي
CRITICAL: الاختبار النهائي
```

### 6. ترتيب التنفيذ الموصى به
1. البنية الأساسية (Context, Hooks, Utils)
2. الأنماط CSS (لرؤية النتائج فوراً)
3. نظام الفاكسات (أولوية المستخدم)
4. نظام الملفات اليومية (وظيفة أساسية)
5. نظام الفئات والمستندات (البنية الرئيسية)
6. نظام الإعدادات (ضروري للتخصيص)
7. التذكيرات والقوائم (وظائف إضافية)
8. القوالب والإيموجي (تحسينات)
9. البحث والفلترة (UX)
10. التحكم بالنافذة (تلميع)
11. الاختبار النهائي (التحقق)

---

## ✅ معايير القبول

### لكل مرحلة:
- [ ] الكود مكتوب ويعمل بدون أخطاء
- [ ] الأنماط منسوخة بالكامل
- [ ] الوظائف تعمل كما في المشروع القديم
- [ ] لا توجد أخطاء في console
- [ ] التطبيق يعمل في `npm run dev`

### للمشروع بالكامل:
- [ ] جميع الأنظمة ال 11 تعمل
- [ ] جميع الأنماط CSS منسوخة
- [ ] جميع الوظائف من script.js منقولة
- [ ] التطبيق responsive
- [ ] التكامل مع Electron يعمل
- [ ] يمكن بناء التطبيق النهائي

---

## 🎯 الهدف النهائي

**نقل كامل 100% من المشروع القديم إلى React بدون تغيير أو حذف أي شيء.**

كل سطر من `script.js` يجب أن يكون في React.
كل سطر من `style.css` يجب أن يكون في React.
كل وظيفة يجب أن تعمل بنفس الطريقة.

لا تغيير، لا حذف، لا إضافة - **نقل كامل فقط**.
