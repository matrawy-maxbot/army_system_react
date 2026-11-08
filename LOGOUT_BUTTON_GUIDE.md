# دليل زر تسجيل الخروج

## نظرة عامة
تم إضافة زر تسجيل الخروج في الـ TabBar (الشريط الجانبي الأيسر) لتوفير طريقة سريعة وسهلة للخروج من النظام.

## الملفات المُعدّلة

### 1. TabBar Component
- **`src/components/layout/TabBar.jsx`** - إضافة زر تسجيل الخروج

### 2. Layout CSS
- **`src/styles/layout.css`** - إضافة تنسيقات خاصة بزر تسجيل الخروج

## المميزات

### التصميم
- ✅ لون مميز أحمر فاتح للدلالة على إجراء الخروج
- ✅ أيقونة واضحة لتسجيل الخروج (سهم للخارج)
- ✅ تأثيرات hover ناعمة
- ✅ موضع مناسب في نهاية الشريط الجانبي

### الوظيفة
- ✅ عند الضغط يتم التوجيه لصفحة تسجيل الدخول
- ✅ يمكن إضافة منطق إضافي (تنظيف الجلسة، حفظ البيانات، إلخ)

## كيفية العمل

### الوظيفة الأساسية
عند الضغط على زر تسجيل الخروج:
```javascript
onClick={() => handleButtonClick('login')}
```

يتم تغيير `activeSection` إلى `'login'` مما يعرض صفحة تسجيل الدخول.

### إضافة منطق إضافي

في `App.jsx`، يمكنك تعديل دالة `handleSectionChange` لإضافة منطق خاص عند تسجيل الخروج:

```javascript
const handleSectionChange = (section) => {
    // إذا كان التوجه لصفحة Login (تسجيل الخروج)
    if (section === 'login') {
        // تنظيف الجلسة
        sessionStorage.removeItem('isLoggedIn');
        localStorage.removeItem('authToken');
        
        // حفظ البيانات المهمة قبل الخروج
        saveData();
        
        // عرض رسالة توديع
        toast('تم تسجيل الخروج بنجاح', 'info');
        
        // إعادة تعيين بعض الحالات إذا لزم الأمر
        // resetAppState();
    }
    
    setActiveSection(section);
};
```

### مثال متقدم: تأكيد قبل الخروج

يمكن إضافة نافذة تأكيد قبل تسجيل الخروج:

```javascript
// في TabBar.jsx
const handleLogout = () => {
    const confirmed = window.confirm('هل أنت متأكد من تسجيل الخروج؟');
    if (confirmed) {
        handleButtonClick('login');
    }
};

// ثم في الزر:
<button 
    className="sidebar-btn sidebar-btn-logout"
    data-section="logout" 
    title="تسجيل الخروج"
    onClick={handleLogout}
>
```

### مثال: استخدام Modal مخصص

إنشاء modal تأكيد احترافي:

```jsx
// في App.jsx
const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

const handleLogout = () => {
    setShowLogoutConfirm(true);
};

const confirmLogout = () => {
    sessionStorage.clear();
    toast('تم تسجيل الخروج بنجاح', 'success');
    setActiveSection('login');
    setShowLogoutConfirm(false);
};

// في JSX:
{showLogoutConfirm && (
    <ConfirmModal
        title="تسجيل الخروج"
        message="هل أنت متأكد من رغبتك في تسجيل الخروج؟"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
    />
)}
```

## التنسيقات CSS

### الألوان
```css
.sidebar-btn-logout {
    background: #fff2f2;      /* خلفية حمراء فاتحة جداً */
    color: #d83939;           /* نص أحمر */
    border: 1px solid #ffd5d5; /* حدود حمراء فاتحة */
}

.sidebar-btn-logout:hover {
    background: #ffe8e8;      /* خلفية أغمق قليلاً عند التحويم */
    color: #c72828;           /* نص أغمق */
    border-color: #ffbaba;    /* حدود أغمق */
    transform: translateY(-1px); /* رفع الزر قليلاً */
}
```

### تخصيص الألوان
يمكن تغيير الألوان حسب هوية التطبيق:

```css
/* نمط أزرق محافظ */
.sidebar-btn-logout {
    background: #f0f4f8;
    color: #4a5568;
    border: 1px solid #cbd5e0;
}

/* نمط برتقالي تحذيري */
.sidebar-btn-logout {
    background: #fff5eb;
    color: #dd6b20;
    border: 1px solid #fbd38d;
}

/* نمط رمادي محايد */
.sidebar-btn-logout {
    background: #f7fafc;
    color: #718096;
    border: 1px solid #e2e8f0;
}
```

## سيناريوهات الاستخدام

### 1. تسجيل خروج بسيط
```javascript
// مجرد توجيه لصفحة تسجيل الدخول
handleSectionChange('login');
```

### 2. تسجيل خروج مع حفظ البيانات
```javascript
const handleLogout = async () => {
    // حفظ البيانات
    await saveData();
    
    // تنظيف الجلسة
    sessionStorage.clear();
    
    // التوجيه لصفحة تسجيل الدخول
    handleSectionChange('login');
};
```

### 3. تسجيل خروج مع API
```javascript
const handleLogout = async () => {
    try {
        // إرسال طلب تسجيل خروج للسيرفر
        await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        // تنظيف البيانات المحلية
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        
        // عرض رسالة
        toast('تم تسجيل الخروج بنجاح', 'success');
        
        // التوجيه
        handleSectionChange('login');
    } catch (error) {
        toast('حدث خطأ أثناء تسجيل الخروج', 'error');
    }
};
```

### 4. تسجيل خروج مع تسجيل النشاط
```javascript
const handleLogout = () => {
    // تسجيل وقت الخروج
    const logoutTime = new Date().toISOString();
    localStorage.setItem('lastLogout', logoutTime);
    
    // حساب مدة الجلسة
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
        const sessionDuration = Date.now() - new Date(loginTime).getTime();
        console.log(`مدة الجلسة: ${Math.floor(sessionDuration / 1000)} ثانية`);
    }
    
    // تنظيف البيانات
    sessionStorage.clear();
    
    // التوجيه
    handleSectionChange('login');
};
```

## الموضع في TabBar

الزر موضوع في نهاية القائمة بعد:
1. الرئيسية
2. القوالب
3. التذكيرات
4. المهمات
5. القوائم
6. الأرشفة
7. النسخ الاحتياطي
8. الدليل التعليمي
9. **تسجيل الخروج** ← هنا

## ملاحظات الأمان

⚠️ **نصائح أمنية:**

1. **تنظيف كامل**: تأكد من حذف جميع البيانات الحساسة عند الخروج
```javascript
sessionStorage.clear();
localStorage.removeItem('authToken');
localStorage.removeItem('refreshToken');
// أي بيانات حساسة أخرى
```

2. **حفظ البيانات**: احفظ البيانات المهمة قبل الخروج
```javascript
await saveData();
```

3. **إلغاء الطلبات**: ألغِ أي طلبات API قيد التنفيذ
```javascript
abortController.abort();
```

4. **تأكيد الخروج**: اسأل المستخدم إذا كانت هناك تغييرات غير محفوظة
```javascript
if (hasUnsavedChanges) {
    const confirmed = confirm('لديك تغييرات غير محفوظة. هل تريد الخروج؟');
    if (!confirmed) return;
}
```

## التكامل مع Authentication

### مع JWT Tokens
```javascript
const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    
    // إلغاء صلاحية التوكن في السيرفر
    await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // حذف التوكنات
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    // التوجيه
    handleSectionChange('login');
};
```

### مع Session Cookies
```javascript
const handleLogout = async () => {
    // السيرفر سيحذف الـ cookie
    await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
    });
    
    // تنظيف البيانات المحلية
    sessionStorage.clear();
    
    // التوجيه
    handleSectionChange('login');
};
```

## الاختبار

### اختبار الزر
1. شغل التطبيق
2. ابحث عن زر تسجيل الخروج في أسفل الشريط الجانبي الأيسر
3. تحقق من اللون الأحمر المميز
4. حرك الماوس فوق الزر لرؤية تأثير hover
5. اضغط على الزر
6. يجب أن تظهر صفحة تسجيل الدخول

### اختبار الوظيفة
```javascript
// في console المتصفح
// تحقق من تنظيف البيانات
console.log(sessionStorage.getItem('isLoggedIn')); // يجب أن يكون null
console.log(localStorage.getItem('authToken')); // يجب أن يكون null
```

## التوافق

- ✅ متوافق مع جميع المتصفحات الحديثة
- ✅ يعمل في نسخة الديسكتوب والمتصفح
- ✅ تصميم متجاوب
- ✅ تكامل سلس مع باقي الأزرار

## المشاكل الشائعة وحلولها

### المشكلة: الزر لا يظهر
**الحل**: تأكد من استيراد ملف CSS:
```javascript
import './styles/layout.css';
```

### المشكلة: الزر لا يعمل
**الحل**: تحقق من وجود دالة `handleButtonClick` في props:
```javascript
function TabBar({ onSectionChange, activeSection }) {
    const handleButtonClick = (section) => {
        if (onSectionChange) {
            onSectionChange(section);
        }
    };
    // ...
}
```

### المشكلة: اللون لا يظهر
**الحل**: تأكد من إضافة class `sidebar-btn-logout`:
```html
<button className="sidebar-btn sidebar-btn-logout">
```

## التطوير المستقبلي

يمكن إضافة:
- [ ] خيار "تذكر الجلسة" لعدم تسجيل الخروج التلقائي
- [ ] عرض مدة الجلسة الحالية
- [ ] خيار "تسجيل الخروج من جميع الأجهزة"
- [ ] سجل تسجيلات الدخول والخروج
- [ ] إشعار قبل انتهاء الجلسة تلقائياً
