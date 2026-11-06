# إصلاح مشكلة z-index للمودالات المتداخلة

## المشكلة المحددة
عند فتح مودال تفاصيل الفاكس والضغط على زر "المفضلة"، يظهر مودال القوائم (AddToListsModal) خلف مودال التفاصيل بدلاً من الظهور أمامه.

## السبب
كانت هناك مشكلة في آلية تسجيل المودالات في الـ Hook:
1. `registerModal` كان يحسب z-index بناءً على `modalStack.length` **قبل** إضافة المودال الجديد
2. هذا يؤدي إلى حساب z-index خاطئ

## الإصلاح المطبق

### قبل الإصلاح
```jsx
const registerModal = useCallback((modalId) => {
    setModalStack(prev => {
        if (prev.includes(modalId)) return prev;
        return [...prev, modalId];
    });
    
    // ❌ المشكلة: modalStack.length لم يتحدث بعد!
    const currentIndex = modalStack.length;
    return BASE_MODAL_ZINDEX + (currentIndex * ZINDEX_INCREMENT);
}, [modalStack.length]);
```

### بعد الإصلاح
```jsx
const registerModal = useCallback((modalId) => {
    let newIndex = 0;
    setModalStack(prev => {
        if (prev.includes(modalId)) {
            newIndex = prev.indexOf(modalId);
            return prev;
        }
        newIndex = prev.length;  // ✅ نحفظ الـ index الصحيح
        return [...prev, modalId];
    });
    
    // ✅ نستخدم newIndex المحفوظ
    const zIndex = BASE_MODAL_ZINDEX + (newIndex * ZINDEX_INCREMENT);
    return zIndex;
}, []);
```

## كيف يعمل الآن

### السيناريو 1: فتح مودال تفاصيل الفاكس
```
1. FaxDetailModal يُفتح
2. registerModal("fax-detail-123")
3. modalStack = ["fax-detail-123"]
4. z-index = 1040 + (0 * 10) = 1040 ✅
```

### السيناريو 2: فتح مودال القوائم من داخل مودال التفاصيل
```
1. AddToListsModal يُفتح
2. registerModal("add-to-lists-fax-123")
3. modalStack = ["fax-detail-123", "add-to-lists-fax-123"]
4. z-index = 1040 + (1 * 10) = 1050 ✅ أعلى من FaxDetailModal
```

### السيناريو 3: فتح مودال تأكيد من داخل مودال القوائم
```
1. ConfirmDeleteModal يُفتح
2. registerModal("confirm-delete-modal")
3. modalStack = ["fax-detail-123", "add-to-lists-fax-123", "confirm-delete-modal"]
4. z-index = 1040 + (2 * 10) = 1060 ✅ أعلى من الجميع
```

## التحسينات الإضافية

### 1. تحسين useModalZIndex Hook
```jsx
// قبل: كان يسجل ويلغي في نفس الوقت
React.useEffect(() => {
    if (isOpen) {
        const calculatedZIndex = registerModal(modalId);
        setZIndex(calculatedZIndex);
        return () => unregisterModal(modalId);  // ❌ قد يحدث تسجيل وإلغاء متزامن
    }
}, [isOpen, modalId, registerModal, unregisterModal]);

// بعد: فصل التسجيل والإلغاء
React.useEffect(() => {
    if (isOpen) {
        registerModal(modalId);  // ✅ تسجيل فقط
    } else {
        unregisterModal(modalId);  // ✅ إلغاء عند الإغلاق
    }
}, [isOpen, modalId, registerModal, unregisterModal]);
```

### 2. إضافة console.log للتشخيص
تم إضافة logs لتتبع تسجيل وإلغاء المودالات:
```
[ModalStack] Registered "fax-detail-123" at index 0
[ModalStack] Modal "fax-detail-123" z-index: 1040
[ModalStack] Registered "add-to-lists-fax-123" at index 1
[ModalStack] Modal "add-to-lists-fax-123" z-index: 1050
[ModalStack] Unregistered "add-to-lists-fax-123"
```

## كيفية التحقق من الإصلاح

### 1. افتح Console في المتصفح (F12)
سترى logs مثل:
```
[ModalStack] Registered "fax-detail-123" at index 0 ["fax-detail-123"]
[ModalStack] Modal "fax-detail-123" z-index: 1040
```

### 2. افتح مودال تفاصيل الفاكس
- افتح أي فاكس
- اضغط F12 وافتح Console
- لاحظ log التسجيل

### 3. افتح مودال القوائم
- اضغط على زر "المفضلة" (النجمة)
- لاحظ في Console:
  ```
  [ModalStack] Registered "add-to-lists-fax-123" at index 1 ["fax-detail-123", "add-to-lists-fax-123"]
  [ModalStack] Modal "add-to-lists-fax-123" z-index: 1050
  ```
- **التحقق البصري**: مودال القوائم يجب أن يظهر فوق مودال التفاصيل ✅

### 4. افحص z-index في Developer Tools
- اضغط بزر الماوس الأيمن على backdrop المودال
- اختر "Inspect" أو "فحص العنصر"
- في styles panel، ابحث عن `z-index`
- يجب أن ترى:
  - FaxDetailModal backdrop: `z-index: 1040`
  - AddToListsModal backdrop: `z-index: 1050` ✅

## الملفات المعدلة

### `src/context/ModalStackContext.jsx`
- ✅ إصلاح registerModal لحفظ index قبل setState
- ✅ إصلاح useModalZIndex لفصل التسجيل والإلغاء
- ✅ إضافة console.log للتشخيص

## النتيجة المتوقعة

بعد هذا الإصلاح:
1. ✅ كل مودال يُفتح بعد آخر يحصل على z-index أعلى
2. ✅ المودالات المتداخلة تظهر بالترتيب الصحيح
3. ✅ عند إغلاق مودال، يتم إزالته من الـ stack تلقائيًا
4. ✅ يمكن فتح عدد غير محدود من المودالات المتداخلة

## الخطوات القادمة

إذا استمرت المشكلة:
1. تحقق من Console للتأكد من أن logs تظهر بشكل صحيح
2. تحقق من أن modalId فريد لكل مودال
3. تحقق من عدم وجود CSS يعيد تعريف z-index بشكل ثابت

## إزالة console.log في الإنتاج

عندما تتأكد أن كل شيء يعمل، يمكنك إزالة console.log من `ModalStackContext.jsx`:
```jsx
// قبل الإنتاج، احذف أو علّق على هذه الأسطر:
// console.log(`[ModalStack] ...`);
```
