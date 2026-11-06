# إصلاح z-index لمودال إنشاء التذكير

## المشكلة
عند فتح مودال "إنشاء تذكير" والضغط على زر "ربط بفاكس"، كان مودال اختيار الفاكس يظهر خلف مودال التذكير بدلاً من الظهور أمامه.

## السبب
- **AddReminderModal** لا يستخدم مكون `Modal.jsx` العام
- بدلاً من ذلك، يستخدم بنية مخصصة مع `ModalPortal`
- مودال اختيار الفاكس الداخلي لم يكن لديه z-index ديناميكي

## الحل المطبق

### 1. تحديث AddReminderModal.jsx

#### إضافة الـimports
```jsx
import React, { useState, useEffect, useRef } from 'react';
import { useModalZIndex } from '../../context/ModalStackContext';
```

#### إضافة z-index للمودال الرئيسي والمودال الداخلي
```jsx
const AddReminderModal = ({ onClose, onSave, showFaxLink = false }) => {
    // استخدام نظام z-index للمودالات
    const mainModalZIndex = useModalZIndex('add-reminder-modal', true);
    const mainModalRef = useRef(null);
    const faxSelectorZIndex = useModalZIndex('add-reminder-fax-selector', showFaxSelector);
    const faxSelectorRef = useRef(null);

    // تطبيق z-index للمودال الرئيسي مع !important
    useEffect(() => {
        if (mainModalRef.current) {
            mainModalRef.current.style.cssText = `z-index: ${mainModalZIndex} !important`;
        }
    }, [mainModalZIndex]);

    // تطبيق z-index لمودال اختيار الفاكس مع !important
    useEffect(() => {
        if (faxSelectorRef.current && showFaxSelector) {
            faxSelectorRef.current.style.cssText = `z-index: ${faxSelectorZIndex} !important`;
        }
    }, [faxSelectorZIndex, showFaxSelector]);
    
    // ...
}
```

#### تطبيق الـrefs على العناصر
```jsx
return (
    <ModalPortal>
        <div 
            ref={mainModalRef}
            className="modal reminder-clean-modal active" 
            onClick={onClose}
        >
            {/* محتوى المودال الرئيسي */}
            
            {/* Fax Selector Modal */}
            {showFaxSelector && (
                <ModalPortal>
                    <div 
                        ref={faxSelectorRef}
                        className="modal-overlay" 
                        onClick={() => setShowFaxSelector(false)}
                    >
                        {/* محتوى مودال اختيار الفاكس */}
                    </div>
                </ModalPortal>
            )}
        </div>
    </ModalPortal>
);
```

## كيف يعمل الآن

### السيناريو الكامل

```
1. المستخدم يفتح قسم التذكيرات
   ├─ لا مودالات مفتوحة
   └─ modalStack = []

2. المستخدم يضغط على "إضافة تذكير"
   ├─ AddReminderModal يُفتح
   ├─ registerModal("add-reminder-modal")
   ├─ modalStack = ["add-reminder-modal"]
   ├─ z-index = 1040
   └─ cssText = "z-index: 1040 !important" ✅

3. المستخدم يضغط على "+ ربط بفاكس"
   ├─ setShowFaxSelector(true)
   ├─ registerModal("add-reminder-fax-selector")
   ├─ modalStack = ["add-reminder-modal", "add-reminder-fax-selector"]
   ├─ z-index = 1050
   └─ cssText = "z-index: 1050 !important" ✅ أمام المودال الرئيسي

4. المستخدم يختار فاكس أو يغلق المودال
   ├─ setShowFaxSelector(false)
   ├─ unregisterModal("add-reminder-fax-selector")
   └─ modalStack = ["add-reminder-modal"]

5. المستخدم يحفظ أو يلغي التذكير
   ├─ onClose()
   ├─ unregisterModal("add-reminder-modal")
   └─ modalStack = [] (فارغ)
```

## التحقق من الإصلاح

### 1. افتح Console (F12)
يجب أن ترى:
```
[ModalStack] Registered "add-reminder-modal" at index 0
[ModalStack] Modal "add-reminder-modal" z-index: 1040
[ModalStack] Registered "add-reminder-fax-selector" at index 1
[ModalStack] Modal "add-reminder-fax-selector" z-index: 1050
```

### 2. افتح مودال إنشاء التذكير
- اذهب إلى قسم التذكيرات
- اضغط على "+ إضافة"
- افتح Developer Tools → Elements
- اختر `div.modal.reminder-clean-modal`
- في Styles:
  ```css
  element.style {
      z-index: 1040 !important;
  }
  ```

### 3. اضغط على "+ ربط بفاكس"
- اضغط على الزر
- في Console:
  ```
  [ModalStack] Registered "add-reminder-fax-selector" at index 1
  [ModalStack] Modal "add-reminder-fax-selector" z-index: 1050
  ```
- في Elements → اختر مودال اختيار الفاكس:
  ```css
  element.style {
      z-index: 1050 !important;  ← أعلى من 1040
  }
  ```
- **النتيجة البصرية**: مودال اختيار الفاكس يظهر فوق مودال التذكير ✅

## الملفات المعدلة

### `src/components/reminders/AddReminderModal.jsx`
- ✅ إضافة `import { useModalZIndex }` 
- ✅ إضافة `useRef` للمودال الرئيسي والفرعي
- ✅ إضافة `useModalZIndex` لكل مودال
- ✅ إضافة `useEffect` لتطبيق z-index مع !important
- ✅ إضافة `ref` على عناصر المودالات

## المودالات المشابهة التي قد تحتاج نفس الإصلاح

تحقق من هذه المودالات إذا واجهت نفس المشكلة:

- [ ] EditReminderModal (إذا كان لديه مودالات متداخلة)
- [ ] AddTaskModal (إذا كان لديه مودالات متداخلة)
- [ ] EditTaskModal (إذا كان لديه مودالات متداخلة)
- [ ] أي مودال مخصص لا يستخدم Modal.jsx

## ملاحظات مهمة

1. **ModalPortal المتداخل**: عند استخدام ModalPortal داخل ModalPortal، تأكد من:
   - كل مودال له modalId فريد
   - كل مودال له ref خاص
   - كل مودال له useEffect لتطبيق z-index

2. **Modal.jsx vs مودالات مخصصة**:
   - المودالات التي تستخدم `Modal.jsx` تحصل على z-index تلقائياً
   - المودالات المخصصة تحتاج تطبيق يدوي كما في هذا الإصلاح

3. **modalId التسمية**:
   - استخدم أسماء وصفية: `add-reminder-modal`, `add-reminder-fax-selector`
   - تجنب التعارض مع مودالات أخرى

---

**آخر تحديث**: تم إصلاح مودال إنشاء التذكير ومودال اختيار الفاكس الداخلي ✅
