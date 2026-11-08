# دليل صفحة تسجيل الدخول

## نظرة عامة
تم إنشاء صفحة تسجيل الدخول بنفس نمط وتصميم صفحة الدليل التعليمي (TutorialPage) لضمان تناسق التصميم عبر التطبيق.

## الملفات المُنشأة

### 1. مكونات React
- **`src/pages/LoginPage.jsx`** - المكون الرئيسي لصفحة تسجيل الدخول
- **`src/pages/LoginPage.css`** - ملف الأنماط المخصص للصفحة

### 2. نسخة HTML مستقلة
- **`public/login-demo.html`** - نسخة HTML مستقلة للاختبار السريع والمعاينة

## المميزات

### التصميم
- ✅ نفس نمط صفحة الدليل التعليمي
- ✅ تصميم ثنائي القسم (Visual Panel + Login Panel)
- ✅ شريط علوي احترافي مع شعار النظام
- ✅ خلفيات متدرجة جذابة مع دوائر زخرفية
- ✅ تصميم متجاوب (Responsive) لجميع الشاشات

### الوظائف
- ✅ إدخال كلمة المرور مع إمكانية إظهار/إخفاء
- ✅ رسائل خطأ ونجاح واضحة
- ✅ التحقق من إدخال كلمة المرور
- ✅ تكامل مع منظومة التوست (Toast) في التطبيق
- ✅ انتقال تلقائي للصفحة الرئيسية بعد الدخول الناجح

## كيفية الاستخدام

### 1. في تطبيق React

#### الوصول للصفحة
يمكن الوصول لصفحة تسجيل الدخول بتغيير `activeSection` إلى `'login'`:

```javascript
// في App.jsx أو أي component آخر
setActiveSection('login');
```

#### استخدام المكون
```jsx
import LoginPage from './pages/LoginPage';

<LoginPage 
  onLogin={(password) => {
    console.log('Login attempt with password:', password);
    // إضافة منطق التحقق هنا
    // مثال: التحقق من كلمة المرور مع قاعدة البيانات
    if (password === 'correctPassword') {
      toast('تم تسجيل الدخول بنجاح', 'success');
      handleSectionChange('main');
    } else {
      toast('كلمة مرور غير صحيحة', 'error');
    }
  }} 
/>
```

### 2. نسخة HTML المستقلة

لاختبار التصميم بسرعة:
```bash
# افتح الملف مباشرة في المتصفح
# أو استخدم Live Server
```

أو افتح: `public/login-demo.html`

## التخصيص

### تغيير كلمة المرور الافتراضية
في `LoginPage.jsx`، عدل دالة `handleSubmit`:

```javascript
const handleSubmit = (e) => {
    e.preventDefault();
    
    const CORRECT_PASSWORD = 'admin123'; // غيّر هنا
    
    if (password === CORRECT_PASSWORD) {
        if (onLogin) {
            onLogin(password);
        }
    } else {
        setMessage('كلمة مرور غير صحيحة');
    }
};
```

### تعديل النصوص
يمكن تعديل النصوص في المتغيرات التالية:
- `overline`: "مرحباً بعودتك"
- `heading`: "تسجيل الدخول"
- `description`: "أدخل كلمة المرور للمتابعة..."
- `eyebrow`: "مساحة عملك، في مكان واحد"

### تغيير الألوان
الألوان معرّفة في CSS Variables في بداية ملف `LoginPage.css`:

```css
:root {
    --blue: #3478f6;
    --blue-dark: #2465e8;
    --ink: #17243a;
    --muted: #8795aa;
    /* ... */
}
```

## التكامل مع نظام المصادقة

### مثال: التحقق من كلمة المرور المحفوظة

```javascript
import { useAppState } from './context/AppStateContext';

function App() {
    const { appState } = useAppState();
    
    const handleLogin = (password) => {
        // التحقق من كلمة المرور المحفوظة في الإعدادات
        if (appState.settings?.password === password) {
            toast('تم تسجيل الدخول بنجاح', 'success');
            setActiveSection('main');
            // حفظ حالة تسجيل الدخول
            sessionStorage.setItem('isLoggedIn', 'true');
        } else {
            toast('كلمة مرور غير صحيحة', 'error');
        }
    };
    
    return <LoginPage onLogin={handleLogin} />;
}
```

### مثال: التحقق مع API خارجي

```javascript
const handleLogin = async (password) => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            toast('تم تسجيل الدخول بنجاح', 'success');
            localStorage.setItem('authToken', data.token);
            setActiveSection('main');
        } else {
            toast('كلمة مرور غير صحيحة', 'error');
        }
    } catch (error) {
        toast('حدث خطأ في الاتصال', 'error');
    }
};
```

## التصميم المتجاوب (Responsive)

الصفحة متجاوبة تمامًا وتدعم:

- **شاشات كبيرة (> 900px)**: تصميم ثنائي القسم جنبًا إلى جنب
- **شاشات متوسطة (560-900px)**: القسمان فوق بعضهما، Login Panel أولاً
- **شاشات صغيرة (< 560px)**: تصميم مُحسّن للموبايل

## الأمان

⚠️ **ملاحظات أمنية هامة:**

1. **كلمة المرور في الكود**: لا تحفظ كلمات المرور مباشرة في الكود
2. **التشفير**: استخدم تشفير (hashing) لكلمات المرور
3. **HTTPS**: تأكد من استخدام HTTPS في الإنتاج
4. **Session Management**: استخدم نظام جلسات آمن

## الاختبار

### اختبار سريع
1. افتح `public/login-demo.html` في المتصفح
2. أدخل أي كلمة مرور
3. اضغط "الدخول إلى النظام"
4. شاهد رسالة النجاح

### اختبار في React
```bash
npm start
# ثم في console المتصفح:
# setActiveSection('login')
```

## الملاحظات

- الصفحة مُصممة لتتناسق تمامًا مع صفحة الدليل التعليمي
- استخدام نفس نظام الألوان والخطوط والمسافات
- Visual Panel يعرض معاينة للنظام مع رسوم توضيحية
- تجربة مستخدم سلسة مع تأثيرات انتقالية (transitions) ناعمة

## المساعدة والدعم

إذا واجهت أي مشاكل:
1. تحقق من console المتصفح للأخطاء
2. تأكد من استيراد المكون بشكل صحيح
3. راجع ملف `App.jsx` للتأكد من إضافة المسار

## التحديثات المستقبلية

يمكن إضافة:
- [ ] خيار "تذكرني"
- [ ] رابط "نسيت كلمة المرور"
- [ ] دعم تسجيل الدخول بالبصمة/Face ID
- [ ] تسجيل الدخول بحسابات خارجية (Google, Microsoft)
- [ ] Two-Factor Authentication (2FA)
