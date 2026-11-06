# إضافة مودال تأكيد حذف المرفقات

## 📋 الملخص
تم إضافة مودال تأكيد عند حذف أي مرفق من الرد، لضمان عدم الحذف الخاطئ.

## ✨ التحسينات المضافة

### 1. مودال تأكيد الحذف
- يظهر عند الضغط على زر حذف المرفق (×)
- يعرض اسم المرفق المراد حذفه
- يتطلب تأكيد صريح من المستخدم
- يمكن إلغاء العملية

### 2. حماية من الحذف الخاطئ
- لا يتم الحذف مباشرة
- المستخدم يرى تحذير: "لا يمكن التراجع عن هذا الإجراء"
- فرصة لمراجعة القرار قبل التنفيذ

## 🔧 التغييرات التقنية

### State الجديد:
```javascript
const [showDeleteAttachmentModal, setShowDeleteAttachmentModal] = useState(false);
const [attachmentToDelete, setAttachmentToDelete] = useState(null);
```

### دالة معالجة الحذف المحدّثة:
```javascript
// دالة لفتح مودال التأكيد
const handleDeleteAttachmentClick = (attachment) => {
    setAttachmentToDelete(attachment);
    setShowDeleteAttachmentModal(true);
};

// دالة الحذف الفعلية (بعد التأكيد)
const handleDeleteAttachment = async (attachmentId) => {
    const updatedAttachments = (reply.attachments || []).filter(
        att => att.id !== attachmentId
    );
    
    const updatedReplies = replies.map(r =>
        r.id === reply.id ? { 
            ...r, 
            attachments: updatedAttachments,
            lastModified: new Date().toISOString() 
        } : r
    );

    await updateState({ faxReplies: updatedReplies });
    setShowDeleteAttachmentModal(false);
    setAttachmentToDelete(null);
};
```

### زر الحذف المحدّث:
```jsx
<button 
    className="btn-delete-attachment"
    onClick={() => handleDeleteAttachmentClick(attachment)}
    title="حذف المرفق"
>
    <svg>...</svg>
</button>
```

### مودال التأكيد:
```jsx
<ConfirmDeleteModal
    isOpen={showDeleteAttachmentModal}
    onClose={() => {
        setShowDeleteAttachmentModal(false);
        setAttachmentToDelete(null);
    }}
    onConfirm={() => handleDeleteAttachment(attachmentToDelete?.id)}
    title="تأكيد حذف المرفق"
    message="هل أنت متأكد من حذف هذا المرفق؟"
    itemName={attachmentToDelete?.name}
    warningNote="لا يمكن التراجع عن هذا الإجراء"
    loading={false}
/>
```

## 🎯 سيناريو الاستخدام

### الخطوات:
1. المستخدم يفتح مودال تفاصيل الرد
2. ينتقل إلى قسم المرفقات
3. يضغط على زر الحذف (×) بجانب مرفق
4. **يظهر مودال التأكيد** ✨
5. المودال يعرض:
   - العنوان: "تأكيد حذف المرفق"
   - الرسالة: "هل أنت متأكد من حذف هذا المرفق؟"
   - اسم المرفق
   - تحذير: "لا يمكن التراجع عن هذا الإجراء"
6. المستخدم يختار:
   - **"تأكيد"** → يتم الحذف ويُغلق المودال
   - **"إلغاء"** أو **"×"** → يُغلق المودال بدون حذف

## 📦 المكونات المستخدمة

### ConfirmDeleteModal
مكون موجود مسبقاً يستخدم في التطبيق لتأكيد عمليات الحذف:
- يعرض عنوان مخصص
- يعرض رسالة تأكيد
- يعرض اسم العنصر المراد حذفه
- يعرض ملاحظة تحذيرية
- يوفر زرين: تأكيد وإلغاء

## ✅ الفوائد

1. **حماية من الأخطاء**: منع الحذف الخاطئ غير المقصود
2. **تجربة مستخدم أفضل**: وضوح في العملية
3. **اتساق في التصميم**: نفس المودال المستخدم في باقي التطبيق
4. **معلومات واضحة**: عرض اسم المرفق قبل الحذف

## 📁 الملفات المعدّلة

**src/components/faxes/ReplyDetailModal.jsx**
- إضافة State للمودال والمرفق المراد حذفه
- تحديث دالة `handleDeleteAttachment` لتعمل بعد التأكيد
- إضافة دالة `handleDeleteAttachmentClick` لفتح المودال
- تحديث زر الحذف ليستدعي الدالة الجديدة
- إضافة مودال `ConfirmDeleteModal` للمرفقات

## 🎨 المظهر

### قبل (حذف مباشر):
```
[×] ← ضغطة واحدة → حُذف المرفق!
```

### بعد (مع تأكيد):
```
[×] ← ضغطة
    ↓
┌──────────────────────────┐
│ تأكيد حذف المرفق         │
│                          │
│ هل أنت متأكد من حذف     │
│ هذا المرفق؟             │
│                          │
│ اسم الملف: image.jpg     │
│                          │
│ ⚠ لا يمكن التراجع       │
│                          │
│  [إلغاء]    [تأكيد]     │
└──────────────────────────┘
    ↓ (إذا تأكيد)
حُذف المرفق ✓
```

## ✅ التحقق

- ✅ البناء ناجح بدون أخطاء
- ✅ مودال التأكيد يظهر عند الضغط على حذف
- ✅ يعرض اسم المرفق المراد حذفه
- ✅ يمكن إلغاء العملية
- ✅ يتم الحذف فقط بعد التأكيد
- ✅ يُغلق المودال تلقائياً بعد الحذف

## 🔄 التكامل مع الميزات الأخرى

يستخدم نفس `ConfirmDeleteModal` المستخدم في:
- حذف الردود
- حذف الملاحظات
- حذف الفاكسات
- حذف العناصر الأخرى في التطبيق

هذا يضمن تجربة موحدة ومألوفة للمستخدم.

---

**تاريخ التنفيذ**: 2026-11-03  
**الحالة**: ✅ مكتمل ومختبر  
**البناء**: ✅ ناجح بدون أخطاء
