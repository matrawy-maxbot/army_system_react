# تحسينات قسم التذكيرات في الصفحة الرئيسية

## التعديلات المنفذة

### 1. إضافة زر الجرس في الكارت

**الموقع:**
- داخل `top-actions` في أعلى الكارت
- قبل أيقونة الربط بالفاكس والمرفقات

**الوظيفة:**
- إيقاف/تفعيل التنبيهات للتذكير
- يتغير اللون والشكل حسب الحالة

**التصميم:**

```jsx
<button
    className={`bell-icon ${isActive ? 'active' : 'inactive'}`}
    onClick={(e) => {
        e.stopPropagation();
        handleToggleReminder(reminder.id);
    }}
    title={isActive ? "إيقاف التنبيه" : "تفعيل التنبيه"}
>
    {isActive ? (
        // أيقونة الجرس الممتلئ (نشط)
        <svg>...</svg>
    ) : (
        // أيقونة الجرس مع خط القطع (متوقف)
        <svg>...</svg>
    )}
</button>
```

**الأنماط:**

```css
/* زر الجرس في الكارت */
.main-reminder-card .bell-icon {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 8px;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.18s ease;
    background: transparent;
}

/* حالة نشط */
.main-reminder-card .bell-icon.active {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.12);
}

.main-reminder-card .bell-icon.active:hover {
    background: rgba(59, 130, 246, 0.2);
    transform: translateY(-1px);
}

/* حالة متوقف */
.main-reminder-card .bell-icon.inactive {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.12);
}

.main-reminder-card .bell-icon.inactive:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: translateY(-1px);
}

.main-reminder-card .bell-icon svg {
    width: 16px;
    height: 16px;
}
```

**الألوان:**
- **نشط**: أزرق (#3b82f6) مع خلفية شفافة
- **متوقف**: أحمر (#ef4444) مع خلفية شفافة

### 2. إظهار التذكيرات المتوقفة

**قبل التعديل:**
```javascript
const activeReminders = result.data.reminders
    .filter(r => !r.isExpired && (r.isActive !== false))
    // تُظهر فقط التذكيرات النشطة
```

**بعد التعديل:**
```javascript
const relatedReminders = result.data.reminders.filter(reminder => {
    if (reminder.linkedFaxId) {
        return filteredFaxIds.includes(reminder.linkedFaxId);
    }
    return false;
});
// تُظهر جميع التذكيرات المرتبطة (نشطة ومتوقفة)
```

**النتيجة:**
- ✅ التذكيرات النشطة تظهر مع badge أخضر
- ✅ التذكيرات المتوقفة تظهر مع badge رمادي
- ✅ التذكيرات المنتهية تظهر مع badge أحمر

### 3. فلترة التذكيرات حسب الفاكسات المعروضة

**المشكلة السابقة:**
- كانت تعرض جميع التذكيرات بدون تمييز
- لم تكن مرتبطة بالفاكسات المفلترة المعروضة

**الحل الجديد:**

#### أ. استخدام AppState Context
```javascript
import { useAppState } from '../../context/AppStateContext';

const MainRemindersSection = () => {
    const { appState } = useAppState();
    
    useEffect(() => {
        loadReminders();
    }, [appState.filteredFaxes]); // إعادة التحميل عند تغيير الفاكسات
```

#### ب. الفلترة بناءً على IDs الفاكسات
```javascript
const loadReminders = async () => {
    const result = await dataAPI.loadData();
    
    // الحصول على IDs الفاكسات المفلترة الحالية
    const filteredFaxIds = appState.filteredFaxes 
        ? appState.filteredFaxes.map(fax => fax.id)
        : [];

    // فلترة التذكيرات لتظهر فقط التي لها علاقة بالفاكسات المعروضة
    const relatedReminders = result.data.reminders.filter(reminder => {
        // إذا كان التذكير مربوط بفاكس
        if (reminder.linkedFaxId) {
            return filteredFaxIds.includes(reminder.linkedFaxId);
        }
        // إذا لم يكن مربوط بفاكس، لا نعرضه
        return false;
    });

    // ترتيب التذكيرات (الأحدث أولاً) وأخذ أول 10
    const sortedReminders = relatedReminders
        .sort((a, b) => new Date(b.id) - new Date(a.id))
        .slice(0, 10);

    setReminders(sortedReminders);
};
```

**منطق الفلترة:**
1. احصل على قائمة IDs الفاكسات المفلترة المعروضة في `FaxGrid`
2. فلتر التذكيرات لتعرض فقط تلك المرتبطة بهذه الفاكسات
3. التذكيرات غير المرتبطة بفاكس **لا تظهر** في الصفحة الرئيسية
4. التذكيرات المرتبطة بفاكسات غير معروضة **لا تظهر**

**الحد الأقصى:**
- 10 تذكيرات كحد أقصى (كان 5 سابقاً)
- يمكن تعديلها من `.slice(0, 10)`

## الملفات المعدلة

### 1. `src/components/main/MainRemindersSection.jsx`

**التغييرات الرئيسية:**

#### أ. الاستيراد والـ Context
```javascript
import { useAppState } from '../../context/AppStateContext';

const { appState } = useAppState();

useEffect(() => {
    loadReminders();
}, [appState.filteredFaxes]); // مراقبة تغييرات الفاكسات
```

#### ب. دالة loadReminders المحدثة
- فلترة بناءً على `filteredFaxIds`
- إظهار التذكيرات النشطة والمتوقفة
- رفع الحد الأقصى من 5 إلى 10

#### ج. JSX زر الجرس
- إضافة button مع className ديناميكية
- onClick مع stopPropagation لمنع فتح المودال
- SVG مختلف للحالة النشطة والمتوقفة

### 2. `src/styles/reminders.css`

**الإضافات:**
- أنماط `.main-reminder-card .bell-icon`
- أنماط `.bell-icon.active` (أزرق)
- أنماط `.bell-icon.inactive` (أحمر)
- حالات hover لكل نوع

## سير العمل (User Flow)

### سيناريو 1: فلترة الفاكسات
```
1. المستخدم يفتح الصفحة الرئيسية
   ↓
2. يوجد 3 فاكسات مفلترة معروضة (IDs: 101, 102, 103)
   ↓
3. قسم التذكيرات يعرض فقط التذكيرات المرتبطة بـ:
   - فاكس 101
   - فاكس 102
   - فاكس 103
   ↓
4. التذكيرات الأخرى (المرتبطة بفاكسات أخرى أو غير مرتبطة) لا تظهر
```

### سيناريو 2: إيقاف/تفعيل التنبيهات
```
1. المستخدم يرى كارت تذكير مع زر جرس أزرق (نشط)
   ↓
2. يضغط على زر الجرس
   ↓
3. الزر يتحول للون الأحمر (متوقف)
   ↓
4. الكارت يتحول للون الرمادي
   ↓
5. Badge تتحول من "نشط" إلى "متوقف"
   ↓
6. التنبيهات متوقفة الآن (لكن الكارت مازال معروض)
```

### سيناريو 3: التحديث التلقائي
```
1. المستخدم يفلتر فاكسات جديدة
   ↓
2. appState.filteredFaxes يتغير
   ↓
3. useEffect يستشعر التغيير
   ↓
4. loadReminders() تُنفذ تلقائياً
   ↓
5. قسم التذكيرات يُحدَّث ليعرض فقط التذكيرات المرتبطة بالفاكسات الجديدة
```

## المميزات الجديدة

### 1. **تكامل أفضل مع الفاكسات**
- التذكيرات المعروضة مرتبطة مباشرة بالفاكسات المفلترة
- تحديث تلقائي عند تغيير الفاكسات
- سياق واضح للمستخدم

### 2. **التحكم في التنبيهات من الكارت**
- لا حاجة لفتح المودال لإيقاف التنبيهات
- تفاعل سريع ومباشر
- ردود فعل بصرية فورية

### 3. **رؤية كاملة للتذكيرات**
- التذكيرات النشطة والمتوقفة معروضة
- تمييز بصري واضح بين الحالات
- معلومات كاملة عن حالة كل تذكير

### 4. **إدارة أفضل للمساحة**
- فقط التذكيرات ذات الصلة تُعرض
- لا فوضى من التذكيرات غير المرتبطة
- عدد محدود (10) للحفاظ على الأداء

## الحالات الخاصة

### إذا لم يكن هناك فاكسات مفلترة
```javascript
const filteredFaxIds = appState.filteredFaxes 
    ? appState.filteredFaxes.map(fax => fax.id)
    : [];
// يصبح []، لن تظهر أي تذكيرات
```

### إذا كان التذكير غير مربوط بفاكس
```javascript
if (reminder.linkedFaxId) {
    return filteredFaxIds.includes(reminder.linkedFaxId);
}
return false; // لن يظهر في الصفحة الرئيسية
```

### إذا كان التذكير متوقف
```javascript
// يظهر مع:
- badge رمادي "متوقف"
- background: #f8fafc
- border-color: #94a3b8
- زر جرس أحمر
```

## نتائج البناء

```
✓ built in 33.27s
dist-vite/assets/index-27445fd4.css     220.11 kB │ gzip: 34.23 kB
dist-vite/assets/main-793c53da.js       355.13 kB │ gzip: 91.37 kB
```

**التغيرات في الحجم:**
- CSS: +0.62 KB (من 219.49 إلى 220.11)
- JS: +0.94 KB (من 354.19 إلى 355.13)
- زيادة طفيفة ومقبولة

## الخلاصة

تم تنفيذ التحسينات التالية بنجاح:
- ✅ إضافة زر الجرس في الكارت مع تصميم احترافي
- ✅ إظهار التذكيرات المتوقفة مع تمييز بصري واضح
- ✅ فلترة التذكيرات لتظهر فقط تلك المرتبطة بالفاكسات المعروضة
- ✅ تحديث تلقائي عند تغيير الفاكسات المفلترة
- ✅ تجربة مستخدم محسّنة مع تفاعل سريع ومباشر
- ✅ إدارة أفضل للمساحة والمحتوى

التطبيق جاهز للاختبار! 🎉
