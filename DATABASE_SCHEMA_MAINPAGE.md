# هيكل قاعدة البيانات للصفحة الرئيسية
# Database Schema for Main Page

## نظرة عامة Overview

الصفحة الرئيسية تعرض **نظام إدارة الفاكسات** الذي يتكون من:

1. **الفاكس الأصلي** (Original Fax) - الملف المرفوع
2. **الفاكسات المفلترة** (Filtered Faxes) - الفاكسات المستخرجة من الملف الأصلي
3. **الردود** (Replies) - مستندات Word مرتبطة بكل فاكس
4. **التذكيرات** (Reminders) - تذكيرات متابعة مرتبطة بالفاكسات
5. **القوائم/المفضلة** (Lists/Favorites) - لإضافة الفاكسات للمفضلة

---

## 📋 الجداول المطلوبة Required Tables

### 1. جدول `original_faxes` (الفاكسات الأصلية)

الفاكس الأصلي هو ملف PDF تم رفعه يحتوي على عدة فاكسات بداخله.

```sql
CREATE TABLE IF NOT EXISTS original_faxes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_name TEXT NOT NULL,                    -- اسم الملف
  file_path TEXT NOT NULL,                    -- مسار الملف على الجهاز
  file_type TEXT DEFAULT 'PDF',               -- نوع الملف (PDF, Images)
  file_size INTEGER,                          -- حجم الملف بالبايت
  page_count INTEGER DEFAULT 0,               -- عدد الصفحات
  upload_date TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  is_pinned INTEGER DEFAULT 0,                -- هل مثبت؟
  is_in_favorites INTEGER DEFAULT 0,          -- هل في المفضلة؟
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
```

**ملاحظات:**
- يتم رفع فاكس أصلي واحد فقط في الجلسة (يمكن استبداله)
- يحتوي على عدة صفحات يتم فلترتها لاحقاً
- يظهر في الصفحة الرئيسية بتصميم مختلف (border dashed)

---

### 2. جدول `fax_pages` (صفحات الفاكس)

كل صفحة من الفاكس الأصلي.

```sql
CREATE TABLE IF NOT EXISTS fax_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_fax_id INTEGER NOT NULL,           -- FK إلى original_faxes
  page_number INTEGER NOT NULL,               -- رقم الصفحة (1, 2, 3...)
  image_path TEXT,                            -- مسار صورة الصفحة
  is_selected INTEGER DEFAULT 0,              -- هل محددة في عملية الفلترة؟
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  
  FOREIGN KEY (original_fax_id) REFERENCES original_faxes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_fax_pages_original_fax 
ON fax_pages(original_fax_id);
```

**ملاحظات:**
- تستخدم في modal الفلترة لاختيار صفحات معينة
- يمكن تجميع عدة صفحات في فاكس مفلتر واحد

---

### 3. جدول `filtered_faxes` (الفاكسات المفلترة)

الفاكسات المستخرجة من الفاكس الأصلي (فاكس 1، فاكس 2، إلخ).

```sql
CREATE TABLE IF NOT EXISTS filtered_faxes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_fax_id INTEGER NOT NULL,           -- FK إلى original_faxes
  fax_number INTEGER NOT NULL,                -- رقم الفاكس (1, 2, 3...)
  title TEXT,                                 -- عنوان مخصص (optional)
  page_count INTEGER DEFAULT 0,               -- عدد الصفحات في هذا الفاكس
  filter_date TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  is_pinned INTEGER DEFAULT 0,                -- هل مثبت؟
  pin_order INTEGER,                          -- ترتيب التثبيت
  is_in_favorites INTEGER DEFAULT 0,          -- هل في المفضلة؟
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  
  FOREIGN KEY (original_fax_id) REFERENCES original_faxes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_filtered_faxes_original 
ON filtered_faxes(original_fax_id);

CREATE INDEX IF NOT EXISTS idx_filtered_faxes_pinned 
ON filtered_faxes(is_pinned);
```

**ملاحظات:**
- يعرض في Grid كـ "فاكس 1"، "فاكس 2"
- كل فاكس يحتوي على صفحتين أو أكثر
- يمكن ربط رد واحد لكل فاكس

---

### 4. جدول `filtered_fax_pages` (ربط الصفحات بالفاكسات المفلترة)

جدول ربط many-to-many بين الفاكسات المفلترة والصفحات.

```sql
CREATE TABLE IF NOT EXISTS filtered_fax_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filtered_fax_id INTEGER NOT NULL,           -- FK إلى filtered_faxes
  page_id INTEGER NOT NULL,                   -- FK إلى fax_pages
  page_order INTEGER NOT NULL,                -- ترتيب الصفحة داخل الفاكس المفلتر
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  
  FOREIGN KEY (filtered_fax_id) REFERENCES filtered_faxes(id) ON DELETE CASCADE,
  FOREIGN KEY (page_id) REFERENCES fax_pages(id) ON DELETE CASCADE,
  
  UNIQUE(filtered_fax_id, page_id)            -- منع تكرار نفس الصفحة في نفس الفاكس
);

CREATE INDEX IF NOT EXISTS idx_filtered_fax_pages_fax 
ON filtered_fax_pages(filtered_fax_id);

CREATE INDEX IF NOT EXISTS idx_filtered_fax_pages_page 
ON filtered_fax_pages(page_id);
```

**ملاحظات:**
- يسمح بإضافة صفحات مختلفة لكل فاكس مفلتر
- مثال: فاكس 1 يحتوي على الصفحات 1 و 2
- مثال: فاكس 2 يحتوي على الصفحات 3 و 4

---

### 5. جدول `fax_replies` (الردود على الفاكسات)

مستندات Word المرتبطة بكل فاكس (رد فاكس 1، رد فاكس 2، إلخ).

```sql
CREATE TABLE IF NOT EXISTS fax_replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filtered_fax_id INTEGER NOT NULL,           -- FK إلى filtered_faxes
  template_id INTEGER,                        -- FK إلى templates (optional)
  title TEXT NOT NULL,                        -- عنوان الرد (مثلاً "رد فاكس 1")
  file_path TEXT,                             -- مسار ملف Word
  file_type TEXT DEFAULT 'Word',              -- نوع الملف (Word, PDF, etc.)
  status TEXT DEFAULT 'draft',                -- مسودة | مكتمل | مرسل
  content TEXT,                               -- محتوى نصي (optional)
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  
  FOREIGN KEY (filtered_fax_id) REFERENCES filtered_faxes(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_fax_replies_filtered_fax 
ON fax_replies(filtered_fax_id);

CREATE INDEX IF NOT EXISTS idx_fax_replies_status 
ON fax_replies(status);
```

**ملاحظات:**
- كل فاكس مفلتر يمكن أن يكون له رد واحد (one-to-one relationship)
- الرد يُنشأ من template أو من الصفر
- يظهر في الكارت تحت الـ divider

---

### 6. جدول `fax_reminders` (تذكيرات الفاكسات)

التذكيرات المرتبطة بالفاكسات للمتابعة.

```sql
CREATE TABLE IF NOT EXISTS fax_reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filtered_fax_id INTEGER,                    -- FK إلى filtered_faxes (optional - يمكن أن يكون تذكير عام)
  title TEXT NOT NULL,                        -- عنوان التذكير
  description TEXT,                           -- وصف التذكير
  start_date TEXT NOT NULL,                   -- تاريخ البداية
  end_date TEXT NOT NULL,                     -- تاريخ الانتهاء/الموعد النهائي
  is_active INTEGER DEFAULT 1,                -- هل نشط؟ (يمكن إيقافه من زر الجرس)
  is_expired INTEGER DEFAULT 0,               -- هل انتهى؟
  priority TEXT DEFAULT 'normal',             -- منخفض | عادي | عالي
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  
  FOREIGN KEY (filtered_fax_id) REFERENCES filtered_faxes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_fax_reminders_filtered_fax 
ON fax_reminders(filtered_fax_id);

CREATE INDEX IF NOT EXISTS idx_fax_reminders_end_date 
ON fax_reminders(end_date);

CREATE INDEX IF NOT EXISTS idx_fax_reminders_is_active 
ON fax_reminders(is_active);
```

**ملاحظات:**
- في الصفحة الرئيسية، تظهر **فقط** التذكيرات المرتبطة بالفاكسات المفلترة الموجودة
- يمكن إيقاف/تفعيل التذكير من زر الجرس 🔔
- يظهر اسم الفاكس المرتبط (فاكس 1، فاكس 2) في pill

---

### 7. جدول `fax_lists` (قوائم الفاكسات)

قوائم لتنظيم الفاكسات (مثل المفضلة، مهم، مراجعة، إلخ).

```sql
CREATE TABLE IF NOT EXISTS fax_lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,                  -- اسم القائمة
  color TEXT,                                 -- لون القائمة
  icon TEXT,                                  -- أيقونة القائمة
  is_default INTEGER DEFAULT 0,              -- هل قائمة افتراضية؟ (المفضلة)
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- إنشاء قائمة المفضلة الافتراضية
INSERT INTO fax_lists (id, name, is_default, created_at) 
VALUES (1, 'المفضلة', 1, datetime('now', 'localtime'))
ON CONFLICT(id) DO NOTHING;
```

**ملاحظات:**
- قائمة "المفضلة" لا يمكن حذفها
- يمكن إنشاء قوائم مخصصة

---

### 8. جدول `fax_list_items` (عناصر القوائم)

ربط الفاكسات بالقوائم (many-to-many).

```sql
CREATE TABLE IF NOT EXISTS fax_list_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  list_id INTEGER NOT NULL,                   -- FK إلى fax_lists
  item_type TEXT NOT NULL,                    -- نوع العنصر: 'original_fax' | 'filtered_fax'
  item_id INTEGER NOT NULL,                   -- ID العنصر (original_fax_id أو filtered_fax_id)
  added_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  
  FOREIGN KEY (list_id) REFERENCES fax_lists(id) ON DELETE CASCADE,
  
  UNIQUE(list_id, item_type, item_id)         -- منع تكرار نفس العنصر في نفس القائمة
);

CREATE INDEX IF NOT EXISTS idx_fax_list_items_list 
ON fax_list_items(list_id);

CREATE INDEX IF NOT EXISTS idx_fax_list_items_item 
ON fax_list_items(item_type, item_id);
```

**ملاحظات:**
- يدعم إضافة الفاكس الأصلي أو الفاكسات المفلترة
- زر النجمة ⭐ في الكارت للإضافة/الإزالة من المفضلة
- يتغير لون النجمة عند الإضافة

---

### 9. جدول `templates` (قوالب المستندات)

قوالب Word لإنشاء الردود.

```sql
CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                         -- اسم القالب
  description TEXT,                           -- وصف القالب
  file_path TEXT NOT NULL,                    -- مسار ملف القالب
  preview_image TEXT,                         -- صورة معاينة
  category TEXT,                              -- فئة القالب (رسمي، إداري، إلخ)
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_templates_category 
ON templates(category);
```

**ملاحظات:**
- تستخدم عند إنشاء رد جديد
- يختار المستخدم قالب ثم ينشئ رد مرتبط بفاكس

---

### 10. جدول `filtering_sessions` (جلسات الفلترة)

لتتبع جلسة الفلترة الحالية.

```sql
CREATE TABLE IF NOT EXISTS filtering_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_fax_id INTEGER NOT NULL,           -- FK إلى original_faxes
  is_active INTEGER DEFAULT 1,                -- هل الجلسة نشطة؟
  next_fax_number INTEGER DEFAULT 1,          -- رقم الفاكس التالي
  started_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  completed_at TEXT,                          -- متى انتهت الجلسة
  
  FOREIGN KEY (original_fax_id) REFERENCES original_faxes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_filtering_sessions_active 
ON filtering_sessions(is_active);
```

**ملاحظات:**
- تحدد رقم الفاكس التالي (فاكس 1، فاكس 2، ...)
- تنتهي الجلسة عند الانتهاء من الفلترة

---

## 📊 العلاقات بين الجداول Relationships

```
original_faxes (1) ──────< fax_pages (many)
                │
                └─────────< filtered_faxes (many)
                │
                └─────────< filtering_sessions (many)

filtered_faxes (1) ──────< filtered_fax_pages (many) ────── fax_pages (many)
               │
               ├─────────< fax_replies (one-to-one or one-to-many)
               │
               └─────────< fax_reminders (many)

fax_lists (1) ──────< fax_list_items (many) ────── original_faxes | filtered_faxes

templates (1) ──────< fax_replies (many)
```

---

## 🎯 حالات الاستخدام Use Cases

### Case 1: رفع فاكس أصلي

```sql
-- 1. إنشاء فاكس أصلي
INSERT INTO original_faxes (file_name, file_path, page_count, ...)
VALUES ('فاكس_2024.pdf', '/path/to/file.pdf', 4, ...);

-- 2. إنشاء صفحات
INSERT INTO fax_pages (original_fax_id, page_number, image_path)
VALUES 
  (1, 1, '/path/page1.png'),
  (1, 2, '/path/page2.png'),
  (1, 3, '/path/page3.png'),
  (1, 4, '/path/page4.png');

-- 3. إنشاء جلسة فلترة
INSERT INTO filtering_sessions (original_fax_id, next_fax_number)
VALUES (1, 1);
```

---

### Case 2: فلترة صفحات وإنشاء فاكس مفلتر

```sql
-- 1. إنشاء فاكس مفلتر
INSERT INTO filtered_faxes (original_fax_id, fax_number, page_count)
VALUES (1, 1, 2);  -- فاكس 1 يحتوي على صفحتين

-- 2. ربط الصفحات
INSERT INTO filtered_fax_pages (filtered_fax_id, page_id, page_order)
VALUES 
  (1, 1, 1),  -- الصفحة 1 في الترتيب الأول
  (1, 2, 2);  -- الصفحة 2 في الترتيب الثاني

-- 3. تحديث رقم الفاكس التالي في الجلسة
UPDATE filtering_sessions 
SET next_fax_number = 2 
WHERE original_fax_id = 1 AND is_active = 1;
```

---

### Case 3: إنشاء رد لفاكس

```sql
-- إنشاء رد من قالب
INSERT INTO fax_replies (filtered_fax_id, template_id, title, file_path, status)
VALUES (1, 3, 'رد فاكس 1', '/path/reply1.docx', 'draft');
```

---

### Case 4: إضافة تذكير لفاكس

```sql
INSERT INTO fax_reminders (filtered_fax_id, title, description, start_date, end_date)
VALUES (1, 'متابعة الرد', 'التأكد من إرسال الرد', '2024-11-05', '2024-11-09');
```

---

### Case 5: إضافة فاكس للمفضلة

```sql
-- إضافة فاكس مفلتر للمفضلة
INSERT INTO fax_list_items (list_id, item_type, item_id)
VALUES (1, 'filtered_fax', 2);

-- تحديث علامة المفضلة
UPDATE filtered_faxes SET is_in_favorites = 1 WHERE id = 2;
```

---

## 📝 Queries مهمة للصفحة الرئيسية

### 1. عرض جميع الفاكسات (الأصلي + المفلترة)

```sql
-- الفاكس الأصلي
SELECT 
  id,
  'original' AS type,
  file_name AS title,
  page_count,
  upload_date AS date,
  is_pinned,
  is_in_favorites
FROM original_faxes
WHERE id = ?;

-- الفاكسات المفلترة
SELECT 
  f.id,
  'filtered' AS type,
  'فاكس ' || f.fax_number AS title,
  f.page_count,
  f.filter_date AS date,
  f.is_pinned,
  f.is_in_favorites,
  r.id AS reply_id,
  r.title AS reply_title,
  r.status AS reply_status
FROM filtered_faxes f
LEFT JOIN fax_replies r ON f.id = r.filtered_fax_id
WHERE f.original_fax_id = ?
ORDER BY f.fax_number ASC;
```

---

### 2. عرض التذكيرات المرتبطة بالفاكسات المفلترة

```sql
SELECT 
  r.id,
  r.title,
  r.description,
  r.end_date,
  r.is_active,
  f.fax_number,
  'فاكس ' || f.fax_number AS fax_name
FROM fax_reminders r
INNER JOIN filtered_faxes f ON r.filtered_fax_id = f.id
WHERE f.original_fax_id = ?
  AND r.is_active = 1
  AND date(r.end_date) >= date('now')
ORDER BY r.end_date ASC
LIMIT 10;
```

---

### 3. التحقق من وجود فاكس في المفضلة

```sql
SELECT COUNT(*) AS is_favorite
FROM fax_list_items
WHERE list_id = 1  -- قائمة المفضلة
  AND item_type = 'filtered_fax'
  AND item_id = ?;
```

---

### 4. الحصول على صفحات فاكس مفلتر

```sql
SELECT 
  p.id,
  p.page_number,
  p.image_path,
  fp.page_order
FROM filtered_fax_pages fp
INNER JOIN fax_pages p ON fp.page_id = p.id
WHERE fp.filtered_fax_id = ?
ORDER BY fp.page_order ASC;
```

---

### 5. عدد الفاكسات المفلترة

```sql
SELECT COUNT(*) AS filtered_count
FROM filtered_faxes
WHERE original_fax_id = ?;
```

---

### 6. حذف فاكس مفلتر (مع cascade)

```sql
-- سيحذف تلقائياً:
-- - العلاقات في filtered_fax_pages
-- - الردود في fax_replies
-- - التذكيرات في fax_reminders
-- - العناصر في fax_list_items
DELETE FROM filtered_faxes WHERE id = ?;
```

---

## ⚡ التحسينات Optimizations

### Indexes المهمة

```sql
-- للبحث السريع عن الفاكسات المفلترة لفاكس أصلي معين
CREATE INDEX idx_filtered_faxes_original ON filtered_faxes(original_fax_id);

-- للبحث السريع عن التذكيرات النشطة
CREATE INDEX idx_reminders_active_date ON fax_reminders(is_active, end_date);

-- للبحث السريع في المفضلة
CREATE INDEX idx_list_items_lookup ON fax_list_items(list_id, item_type, item_id);
```

---

## 🎨 واجهة المستخدم UI Components

### مكونات الصفحة الرئيسية:

1. **Topbar** - Header مع أزرار الإجراءات
2. **Workflow Progress** - مؤشر تقدم العملية (4 مراحل)
3. **Faxes Section** - عرض الفاكسات في Grid
4. **Reminders Section** - عرض التذكيرات المرتبطة
5. **Modals** - لرفع/فلترة/حذف الفاكسات

### بيانات كل فاكس card:

```javascript
{
  id: 1,
  type: 'original' | 'filtered',
  title: 'الفاكس الأصلي' | 'فاكس 1',
  pageCount: 4,
  date: '2024-11-04',
  isPinned: false,
  isInFavorites: false,
  reply: {
    id: 1,
    title: 'رد فاكس 1',
    status: 'draft' | 'completed' | 'sent'
  } | null
}
```

### بيانات كل تذكير:

```javascript
{
  id: 1,
  title: 'متابعة الرد',
  description: 'التأكد من إرسال الرد',
  endDate: '2024-11-09',
  isActive: true,
  linkedFaxId: 1,
  linkedFaxName: 'فاكس 1'
}
```

---

## ✅ الخلاصة Summary

### الجداول الأساسية (10 جداول):

1. ✅ `original_faxes` - الفاكسات الأصلية
2. ✅ `fax_pages` - صفحات الفاكس
3. ✅ `filtered_faxes` - الفاكسات المفلترة
4. ✅ `filtered_fax_pages` - ربط الصفحات بالفاكسات
5. ✅ `fax_replies` - الردود
6. ✅ `fax_reminders` - التذكيرات
7. ✅ `fax_lists` - القوائم
8. ✅ `fax_list_items` - عناصر القوائم
9. ✅ `templates` - قوالب المستندات
10. ✅ `filtering_sessions` - جلسات الفلترة

### العلاقات:

- **One-to-Many**: original_fax → filtered_faxes
- **One-to-Many**: original_fax → fax_pages
- **Many-to-Many**: filtered_faxes ↔ fax_pages (via filtered_fax_pages)
- **One-to-One/Many**: filtered_fax → fax_reply
- **One-to-Many**: filtered_fax → fax_reminders
- **Many-to-Many**: faxes ↔ lists (via fax_list_items)

### الخصائص:

- ✅ Foreign Keys مفعلة
- ✅ Cascade Delete للعلاقات
- ✅ Indexes للأداء
- ✅ Timestamps تلقائية
- ✅ دعم التثبيت والمفضلة

---

هذا هو الهيكل الكامل لقاعدة البيانات التي تخدم الصفحة الرئيسية! 🎉
