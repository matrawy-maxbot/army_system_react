# تحديث كارت التذكير - التصميم المحسّن

## التاريخ
2026-10-30

## الهدف
تحديث كارت التذكير ليطابق التصميم المحسّن المرجعي مع إضافة وظيفة تفعيل/إيقاف التنبيهات.

## الملفات المعدلة

### 1. ReminderCard.jsx
**التغييرات الرئيسية:**

#### هيكل جديد للبطاقة
```jsx
<article className={`reminder-card-new ${reminder.isExpired ? 'expired' : 'active'} ${!isActive ? 'disabled' : ''}`}>
```

#### قسم العلوي (Card Top)
- **بادج الحالة** مع نقطة ملونة:
  - "نشط" باللون الأخضر
  - "منتهي" باللون الأحمر
  - النقطة الملونة `::before` تتبع لون الحالة

- **أيقونة الجرس التفاعلية:**
  - قابلة للنقر (button بدلاً من span)
  - حالتان:
    - **مفعّل**: جرس ممتلئ باللون الأزرق (#347cf5)
    - **معطّل**: جرس فارغ مع خط قطري باللون الرمادي (#94a3b8)
  - تأثير hover مع ارتفاع البطاقة
  - tooltip واضح للحالة

- **زر التعديل:**
  - أيقونة قلم باللون الأخضر
  - تأثير hover مع تغيير اللون

#### قسم العنوان (Card Heading)
- **العنوان الرئيسي:** خط عريض 17px
- **الوصف:** خط أصغر 12px باللون الرمادي

#### شبكة التفاصيل (Details Grid)
- شبكة من عمودين
- كل عنصر يحتوي على:
  - **أيقونة:** في مربع ملون 25x25px
  - **تسمية:** نص صغير 10px
  - **القيمة:** نص عريض 11px

### 2. RemindersList.jsx
**التغييرات الرئيسية:**

#### وظيفة جديدة: `handleToggleReminder`
```javascript
const handleToggleReminder = async (reminderId) => {
    try {
        const result = await dataAPI.loadData();
        if (result.success && result.data) {
            const updatedReminders = result.data.reminders.map(r =>
                r.id === reminderId ? { ...r, isActive: !r.isActive } : r
            );

            result.data.reminders = updatedReminders;
            await dataAPI.saveData(result.data);
            loadReminders();
        }
    } catch (error) {
        console.error('Error toggling reminder:', error);
        alert('حدث خطأ أثناء تحديث حالة التذكير');
    }
};
```

#### تحديث إنشاء التذكير
```javascript
const newReminder = {
    id: Date.now(),
    ...reminderData,
    isExpired: false,
    isActive: true // التذكيرات الجديدة تكون مفعّلة افتراضيًا
};
```

#### تمرير الوظيفة للكارت
```jsx
<ReminderCard
    key={reminder.id}
    reminder={reminder}
    onEdit={() => setEditingReminder(reminder)}
    onToggle={() => handleToggleReminder(reminder.id)}
/>
```

### 3. reminders.css
**التغييرات الرئيسية:**

#### بطاقة التذكير الجديدة
```css
.reminder-card-new {
    width: 100%;
    max-width: 390px;
    position: relative;
    padding: 17px 18px 15px;
    border: 1.5px solid #08b981;
    border-radius: 17px;
    background: #f1fbf8;
    box-shadow: 0 7px 20px rgba(24, 65, 55, 0.07);
    transition: all 0.18s ease;
}
```

#### بادج الحالة
```css
.reminder-card-new .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 11px;
    border-radius: 999px;
    color: #087f5b;
    background: #d7f8e9;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.3px;
}

.reminder-card-new .status-badge::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #08b981;
}
```

#### أيقونة الجرس
```css
.reminder-card-new .bell-icon {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 10px;
    color: #347cf5;
    background: #e8f0ff;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.18s ease;
}

.reminder-card-new .bell-icon:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(52, 124, 245, 0.2);
}

.reminder-card-new .bell-icon.inactive {
    color: #94a3b8;
    background: #f1f5f9;
}
```

#### حالة البطاقة المعطلة
```css
.reminder-card-new.disabled {
    opacity: 0.6;
}

.reminder-card-new.disabled .status-badge,
.reminder-card-new.disabled .detail-icon {
    opacity: 0.7;
}
```

#### شبكة التفاصيل
```css
.reminder-card-new .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #e5edf0;
}

.reminder-card-new .detail-item {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 10px;
    border: 1px solid #e7f0ed;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.72);
}
```

## التحسينات البصرية

### 1. التصميم العام
- حدود خضراء سميكة (1.5px)
- خلفية خضراء فاتحة (#f1fbf8)
- ظلال خفيفة للعمق
- زوايا دائرية (17px)

### 2. بادج الحالة
- تصميم pill مع نقطة ملونة
- ألوان واضحة للحالة
- خط عريض مع letter-spacing

### 3. أيقونة الجرس التفاعلية
- **حالة مفعّل:**
  - جرس ممتلئ باللون الأزرق
  - خلفية زرقاء فاتحة
  - shadow عند hover
  
- **حالة معطّل:**
  - جرس فارغ مع خط قطري
  - ألوان رمادية
  - تأثير hover خفيف

### 4. شبكة التفاصيل
- أيقونات في مربعات ملونة
- تسميات صغيرة واضحة
- قيم عريضة مقروءة
- خلفية شبه شفافة

### 5. التفاعلات
- hover على البطاقة: ارتفاع مع ظل أكبر
- hover على الجرس: ارتفاع مع shadow
- hover على زر التعديل: تغيير اللون مع ارتفاع
- تأثيرات سلسة (0.18s ease)

## الوظائف الجديدة

### 1. تفعيل/إيقاف التنبيه
```javascript
// في ReminderCard
const isActive = reminder.isActive !== undefined ? reminder.isActive : true;

// عند الضغط على الجرس
onClick={onToggle}
```

### 2. الحالات المدعومة
- **مفعّل (isActive: true):**
  - جرس أزرق ممتلئ
  - البطاقة بكامل السطوع
  - جميع الألوان واضحة

- **معطّل (isActive: false):**
  - جرس رمادي فارغ مع خط
  - البطاقة بشفافية 60%
  - الأيقونات والبادج بشفافية 70%

### 3. التخزين
- خاصية `isActive` تُحفظ في قاعدة البيانات
- التذكيرات الجديدة تكون مفعّلة افتراضيًا
- التذكيرات القديمة تُعتبر مفعّلة إذا لم تحتوي على الخاصية

## الاستجابة (Responsive)

### شاشات متوسطة (≤ 768px)
```css
.reminders-grid {
    grid-template-columns: 1fr;
}
```

### شاشات صغيرة (≤ 360px)
```css
.reminder-card-new {
    padding: 14px;
}

.reminder-card-new .details-grid {
    grid-template-columns: 1fr;
    gap: 6px;
}
```

## حالات البطاقة

### 1. بطاقة نشطة مفعّلة
- حدود خضراء (#08b981)
- خلفية خضراء فاتحة (#f1fbf8)
- جرس أزرق ممتلئ
- كامل السطوع

### 2. بطاقة نشطة معطّلة
- حدود خضراء (#08b981)
- خلفية خضراء فاتحة (#f1fbf8)
- جرس رمادي فارغ
- شفافية 60%

### 3. بطاقة منتهية مفعّلة
- حدود حمراء (#ef4444)
- خلفية حمراء فاتحة (#fef5f5)
- جرس أزرق ممتلئ
- كامل السطوع

### 4. بطاقة منتهية معطّلة
- حدود حمراء (#ef4444)
- خلفية حمراء فاتحة (#fef5f5)
- جرس رمادي فارغ
- شفافية 60%

## النتيجة
تم تحديث كارت التذكير بنجاح مع:
- ✅ تصميم محسّن يطابق المرجع
- ✅ بادج حالة مع نقطة ملونة
- ✅ أيقونة جرس تفاعلية لتفعيل/إيقاف التنبيه
- ✅ شبكة تفاصيل منظمة
- ✅ تأثيرات hover سلسة
- ✅ دعم حالات متعددة
- ✅ استجابة للشاشات الصغيرة
- ✅ تخزين الحالة في قاعدة البيانات

## الاختبار
- الوظيفة تعمل على: http://localhost:3001/
- اختبر تفعيل/إيقاف التنبيه بالضغط على أيقونة الجرس
- تحقق من التغيير البصري للأيقونة
- تحقق من شفافية البطاقة عند الإيقاف
