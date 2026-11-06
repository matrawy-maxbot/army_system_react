# نظام إدارة z-index للمودالات المتداخلة

## نظرة عامة

تم إنشاء نظام لإدارة z-index تلقائيًا للمودالات المتداخلة (Modal على Modal). النظام يضمن أن المودال المفتوح أخيرًا يظهر دائمًا فوق المودالات الأخرى.

## الملفات المضافة

1. **`src/context/ModalStackContext.jsx`** - Context لإدارة stack المودالات
2. **`src/components/common/ModalWrapper.jsx`** - مكون wrapper للمودالات

## كيفية الاستخدام

### الطريقة الأولى: استخدام ModalWrapper (موصى بها)

```jsx
import ModalWrapper from '../common/ModalWrapper';

function MyModal({ isOpen, onClose }) {
    return (
        <ModalWrapper
            modalId="my-unique-modal-id"  // معرف فريد للمودال
            isOpen={isOpen}
            onClose={onClose}
            className="modal-overlay"
        >
            <div className="modal-content">
                {/* محتوى المودال */}
            </div>
        </ModalWrapper>
    );
}
```

### الطريقة الثانية: استخدام Hook مباشرة

```jsx
import { useModalZIndex } from '../../context/ModalStackContext';

function MyModal({ isOpen, onClose }) {
    const zIndex = useModalZIndex('my-unique-modal-id', isOpen);
    
    if (!isOpen) return null;
    
    return (
        <div className="modal-overlay" style={{ zIndex }}>
            <div className="modal-content">
                {/* محتوى المودال */}
            </div>
        </div>
    );
}
```

## مثال عملي: مودال على مودال

```jsx
// المودال الأول (FaxDetailModal)
function FaxDetailModal({ isOpen, onClose, faxId }) {
    const [showAddToLists, setShowAddToLists] = useState(false);
    
    return (
        <ModalWrapper
            modalId="fax-detail-modal"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="modal-content">
                <h2>تفاصيل الفاكس</h2>
                <button onClick={() => setShowAddToLists(true)}>
                    إضافة إلى القوائم
                </button>
                
                {/* المودال الثاني داخل الأول */}
                <AddToListsModal
                    isOpen={showAddToLists}
                    onClose={() => setShowAddToLists(false)}
                    item={fax}
                />
            </div>
        </ModalWrapper>
    );
}

// المودال الثاني (AddToListsModal)
function AddToListsModal({ isOpen, onClose, item }) {
    return (
        <ModalWrapper
            modalId="add-to-lists-modal"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="modal-content">
                <h2>اختر القوائم</h2>
                {/* محتوى المودال */}
            </div>
        </ModalWrapper>
    );
}
```

## معايير تسمية modalId

لضمان عدم التعارض، استخدم تسمية وصفية وفريدة:

```jsx
// ✅ جيد
modalId="fax-detail-modal"
modalId="add-to-lists-modal"
modalId="confirm-delete-fax-modal"

// ✅ مع معرف ديناميكي
modalId={`fax-detail-${faxId}`}
modalId={`edit-reminder-${reminderId}`}

// ❌ سيء - قد يتعارض
modalId="modal"
modalId="detail"
```

## كيف يعمل النظام

1. **التسجيل التلقائي**: عندما يُفتح مودال، يُسجل تلقائيًا في الـ stack
2. **حساب z-index**: كل مودال يحصل على z-index بناءً على ترتيبه في الـ stack
   - المودال الأول: `z-index: 1040`
   - المودال الثاني: `z-index: 1050`
   - المودال الثالث: `z-index: 1060`
3. **الإزالة التلقائية**: عند إغلاق المودال، يُزال من الـ stack تلقائيًا

## التكامل مع Modal.jsx الموجود

يمكنك تحديث مكون `Modal.jsx` الموجود ليستخدم النظام:

```jsx
import { useModalZIndex } from '../../context/ModalStackContext';

function Modal({ isOpen, onClose, children, modalId = 'default-modal', ...props }) {
    const zIndex = useModalZIndex(modalId, isOpen);
    
    if (!isOpen) return null;
    
    return (
        <div className="modal-overlay" style={{ zIndex }}>
            {/* باقي المحتوى */}
        </div>
    );
}
```

## القيم الافتراضية

- **BASE_MODAL_ZINDEX**: `1040` (z-index للمودال الأول)
- **ZINDEX_INCREMENT**: `10` (الزيادة لكل مودال)

يمكن تعديل هذه القيم في `src/context/ModalStackContext.jsx`.

## ملاحظات مهمة

1. **معرف فريد**: كل مودال يجب أن يكون له `modalId` فريد
2. **isOpen مطلوب**: النظام يعتمد على `isOpen` لتتبع حالة المودال
3. **التنظيف التلقائي**: عند إغلاق المودال، يُزال من الـ stack تلقائيًا
4. **متوافق مع الكود الموجود**: يمكن استخدامه مع المودالات الحالية بدون تعديلات كبيرة

## الخطوات التالية

لتطبيق النظام على جميع المودالات:

1. ✅ تم إضافة `ModalStackProvider` في `App.jsx`
2. ⏳ تحديث مكون `Modal.jsx` ليستخدم `useModalZIndex`
3. ⏳ إضافة `modalId` فريد لكل مودال
4. ⏳ اختبار المودالات المتداخلة
