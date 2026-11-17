# ✅ ملخص قاعدة بيانات الصفحة الرئيسية
# Main Page Database Summary

## 📊 نظرة عامة Overview

الصفحة الرئيسية تعرض **نظام إدارة الفاكسات الكامل** مع:
- رفع فاكس PDF أصلي
- فلترة الصفحات إلى فاكسات منفصلة
- إنشاء ردود Word لكل فاكس
- إدارة تذكيرات المتابعة
- نظام المفضلة والقوائم

---

## 🗃️ الجداول المطلوبة (10 Tables)

### الجداول الأساسية Core Tables

| # | اسم الجدول | الوصف | العلاقات |
|---|------------|--------|----------|
| 1 | `original_faxes` | الفاكس الأصلي المرفوع | → fax_pages, filtered_faxes |
| 2 | `fax_pages` | صفحات الفاكس الأصلي | ← original_faxes, → filtered_fax_pages |
| 3 | `filtered_faxes` | الفاكسات المفلترة (فاكس 1، 2، ...) | ← original_faxes, → replies, reminders |
| 4 | `filtered_fax_pages` | ربط الصفحات بالفاكسات المفلترة | ← filtered_faxes + fax_pages |
| 5 | `fax_replies` | مستندات الردود | ← filtered_faxes, templates |
| 6 | `fax_reminders` | تذكيرات المتابعة | ← filtered_faxes |
| 7 | `fax_lists` | القوائم (المفضلة، مهم، ...) | → fax_list_items |
| 8 | `fax_list_items` | عناصر القوائم | ← fax_lists, → faxes |
| 9 | `templates` | قوالب Word للردود | → fax_replies |
| 10 | `filtering_sessions` | جلسات الفلترة | ← original_faxes |

---

## 🎯 سيناريوهات الاستخدام Use Cases

### 1️⃣ رفع فاكس أصلي

```javascript
// User uploads PDF file
const originalFax = {
  fileName: 'fax_2024_11_04.pdf',
  filePath: '/path/to/file.pdf',
  pageCount: 4,
  uploadDate: '2024-11-04'
};

// System creates pages
const pages = [
  { originalFaxId: 1, pageNumber: 1, imagePath: '/page1.png' },
  { originalFaxId: 1, pageNumber: 2, imagePath: '/page2.png' },
  { originalFaxId: 1, pageNumber: 3, imagePath: '/page3.png' },
  { originalFaxId: 1, pageNumber: 4, imagePath: '/page4.png' }
];

// System creates filtering session
const session = {
  originalFaxId: 1,
  isActive: true,
  nextFaxNumber: 1
};
```

**Database Operations:**
```sql
INSERT INTO original_faxes (...) VALUES (...);
INSERT INTO fax_pages (original_fax_id, page_number, ...) VALUES (...);
INSERT INTO filtering_sessions (...) VALUES (...);
```

---

### 2️⃣ فلترة صفحات وإنشاء فاكس مفلتر

```javascript
// User selects pages 1 & 2 for Fax 1
const filteredFax = {
  originalFaxId: 1,
  faxNumber: 1,
  pageCount: 2,
  selectedPages: [1, 2]
};

// System creates filtered fax
// Links pages to filtered fax
// Updates session counter
```

**Database Operations:**
```sql
-- Create filtered fax
INSERT INTO filtered_faxes (original_fax_id, fax_number, page_count)
VALUES (1, 1, 2);

-- Link pages
INSERT INTO filtered_fax_pages (filtered_fax_id, page_id, page_order)
VALUES 
  (1, 1, 1),  -- Page 1 in position 1
  (1, 2, 2);  -- Page 2 in position 2

-- Update session
UPDATE filtering_sessions 
SET next_fax_number = 2 
WHERE original_fax_id = 1;
```

---

### 3️⃣ إنشاء رد لفاكس

```javascript
// User clicks "إنشاء رد لهذا الفاكس"
// Selects template
// System creates Word document

const reply = {
  filteredFaxId: 1,
  templateId: 3,
  title: 'رد فاكس 1',
  filePath: '/replies/reply_fax_1.docx',
  status: 'draft'
};
```

**Database Operations:**
```sql
INSERT INTO fax_replies (filtered_fax_id, template_id, title, file_path, status)
VALUES (1, 3, 'رد فاكس 1', '/replies/reply_fax_1.docx', 'draft');
```

**UI Display:**
```
┌─────────────────────────┐
│ فاكس 1                   │
│ صفحتان · فاكس مفلتر      │
├─────────────────────────┤
│ [W] رد فاكس 1           │
│     Word · مستند مرتبط   │
│     [مسودة]              │
└─────────────────────────┘
```

---

### 4️⃣ إضافة تذكير مرتبط بفاكس

```javascript
// User clicks "+ إضافة تذكير"
// Selects fax
// Fills reminder details

const reminder = {
  filteredFaxId: 1,
  title: 'متابعة الرد',
  description: 'التأكد من إرسال الرد',
  startDate: '2024-11-05',
  endDate: '2024-11-09',
  isActive: true
};
```

**Database Operations:**
```sql
INSERT INTO fax_reminders (filtered_fax_id, title, description, start_date, end_date)
VALUES (1, 'متابعة الرد', 'التأكد من إرسال الرد', '2024-11-05', '2024-11-09');
```

**UI Display:**
```
┌─────────────────────────────────────┐
│ التذكيرات - المتابعة القادمة         │
├─────────────────────────────────────┤
│ [09] متابعة الرد              [فاكس 1]│
│ نوف  متابعة الرد على الفاكس · نشط   │
│                                      │
│ [13] مراجعة المستندات         [فاكس 2]│
│ نوف  التأكد من اكتمال المعالجة · نشط │
└─────────────────────────────────────┘
```

---

### 5️⃣ إضافة فاكس للمفضلة

```javascript
// User clicks star button ⭐
// System toggles favorite status

const addToFavorite = {
  listId: 1,  // المفضلة
  itemType: 'filtered_fax',
  itemId: 1
};
```

**Database Operations:**
```sql
-- Add to favorites list
INSERT INTO fax_list_items (list_id, item_type, item_id)
VALUES (1, 'filtered_fax', 1);

-- Update flag
UPDATE filtered_faxes 
SET is_in_favorites = 1 
WHERE id = 1;
```

**UI Behavior:**
- زر النجمة يتغير لونه
- النجمة تظهر دائماً (filled) عند الإضافة

---

### 6️⃣ حذف فاكس مفلتر

```javascript
// User deletes Fax 1
// System cascades delete to:
// - Replies
// - Reminders
// - List items
// - Page links
```

**Database Operations:**
```sql
-- Single delete with CASCADE
DELETE FROM filtered_faxes WHERE id = 1;

-- Auto-deleted:
-- - filtered_fax_pages (CASCADE)
-- - fax_replies (CASCADE)
-- - fax_reminders (CASCADE)
-- - fax_list_items (CASCADE)
```

---

## 📋 SQL Queries للصفحة الرئيسية

### Query 1: عرض جميع الفاكسات

```sql
-- Original Fax
SELECT 
  id,
  'original' AS type,
  file_name AS title,
  'الفاكس الأصلي' AS display_name,
  page_count,
  upload_date,
  is_pinned,
  is_in_favorites
FROM original_faxes
WHERE id = ?;

-- Filtered Faxes with Replies
SELECT 
  f.id,
  'filtered' AS type,
  'فاكس ' || f.fax_number AS title,
  f.page_count,
  f.filter_date,
  f.is_pinned,
  f.is_in_favorites,
  r.id AS reply_id,
  r.title AS reply_title,
  r.status AS reply_status,
  r.file_type AS reply_file_type
FROM filtered_faxes f
LEFT JOIN fax_replies r ON f.id = r.filtered_fax_id
WHERE f.original_fax_id = ?
ORDER BY f.fax_number ASC;
```

---

### Query 2: عرض التذكيرات المرتبطة

```sql
SELECT 
  r.id,
  r.title,
  r.description,
  r.end_date,
  r.is_active,
  f.fax_number,
  'فاكس ' || f.fax_number AS fax_display_name
FROM fax_reminders r
INNER JOIN filtered_faxes f ON r.filtered_fax_id = f.id
WHERE f.original_fax_id = ?
  AND r.is_active = 1
  AND date(r.end_date) >= date('now')
ORDER BY r.end_date ASC
LIMIT 10;
```

---

### Query 3: التحقق من المفضلة

```sql
-- Check if fax is in favorites
SELECT COUNT(*) > 0 AS is_favorite
FROM fax_list_items
WHERE list_id = 1
  AND item_type = ?
  AND item_id = ?;
```

---

### Query 4: الحصول على صفحات فاكس مفلتر

```sql
SELECT 
  p.id,
  p.page_number,
  p.image_path,
  p.thumbnail_path,
  fp.page_order
FROM filtered_fax_pages fp
INNER JOIN fax_pages p ON fp.page_id = p.id
WHERE fp.filtered_fax_id = ?
ORDER BY fp.page_order ASC;
```

---

### Query 5: عدد الفاكسات

```sql
SELECT 
  COUNT(*) AS filtered_count,
  (SELECT COUNT(*) FROM original_faxes WHERE id = ?) AS has_original
FROM filtered_faxes
WHERE original_fax_id = ?;
```

---

## 🎨 واجهة المستخدم Components

### Fax Card Data Structure

```typescript
interface FaxCard {
  id: number;
  type: 'original' | 'filtered';
  title: string;               // "الفاكس الأصلي" | "فاكس 1"
  pageCount: number;
  date: string;
  isPinned: boolean;
  isInFavorites: boolean;
  reply?: {
    id: number;
    title: string;            // "رد فاكس 1"
    status: 'draft' | 'completed' | 'sent';
    fileType: 'Word' | 'PDF';
  };
}
```

### Reminder Data Structure

```typescript
interface Reminder {
  id: number;
  title: string;
  description: string;
  endDate: string;
  isActive: boolean;
  linkedFaxId: number;
  linkedFaxName: string;      // "فاكس 1"
}
```

---

## ⚡ Performance Tips

### Indexes الأساسية

```sql
-- للبحث السريع
CREATE INDEX idx_filtered_faxes_original ON filtered_faxes(original_fax_id);
CREATE INDEX idx_fax_replies_filtered_fax ON fax_replies(filtered_fax_id);
CREATE INDEX idx_fax_reminders_filtered_fax ON fax_reminders(filtered_fax_id);
CREATE INDEX idx_fax_reminders_active_date ON fax_reminders(is_active, end_date);

-- للمفضلة
CREATE INDEX idx_list_items_lookup ON fax_list_items(list_id, item_type, item_id);
```

---

## 🔄 Data Flow

```
1. User uploads PDF
   ↓
2. Create original_fax + fax_pages + filtering_session
   ↓
3. User filters pages → Create filtered_fax + filtered_fax_pages
   ↓
4. User creates reply → Create fax_reply (linked to template)
   ↓
5. User adds reminder → Create fax_reminder (linked to filtered_fax)
   ↓
6. User adds to favorites → Create fax_list_item
```

---

## ✅ Integration مع الكود الموجود

### AppStateContext Mapping

```javascript
// Current State
{
  originalFax: object,        → original_faxes table
  faxPages: array,           → fax_pages table
  filteredFaxes: array,      → filtered_faxes table
  faxReplies: array,         → fax_replies table
  reminders: array,          → fax_reminders table
  lists: array,              → fax_lists + fax_list_items
  templates: array           → templates table
}
```

### API Functions Needed

```javascript
// Original Fax
await db.createOriginalFax(data);
await db.getOriginalFax(id);
await db.deleteOriginalFax(id);

// Filtered Faxes
await db.createFilteredFax(data);
await db.getAllFilteredFaxes(originalFaxId);
await db.deleteFilteredFax(id);

// Replies
await db.createReply(data);
await db.getReply(filteredFaxId);
await db.updateReply(id, data);
await db.deleteReply(id);

// Reminders
await db.createReminder(data);
await db.getRemindersForFaxes(originalFaxId);
await db.updateReminder(id, data);
await db.deleteReminder(id);

// Favorites
await db.addToFavorites(itemType, itemId);
await db.removeFromFavorites(itemType, itemId);
await db.isFavorite(itemType, itemId);
```

---

## 📝 الخطوات التالية Next Steps

1. ✅ إنشاء جداول قاعدة البيانات
2. ✅ إنشاء Functions للعمليات الأساسية
3. ✅ إنشاء IPC Handlers
4. ✅ تحديث AppStateContext لاستخدام قاعدة البيانات
5. ✅ اختبار التكامل
6. ✅ Migration من localStorage إلى SQLite

---

## 🎉 الخلاصة

تم توثيق هيكل كامل لقاعدة البيانات يخدم:
- ✅ رفع وإدارة الفاكسات الأصلية
- ✅ فلترة الصفحات إلى فاكسات منفصلة
- ✅ إنشاء وإدارة الردود
- ✅ نظام التذكيرات والمتابعة
- ✅ القوائم والمفضلة
- ✅ القوالب الجاهزة

الهيكل يدعم جميع الميزات الموجودة في الواجهة الحالية! 🚀
