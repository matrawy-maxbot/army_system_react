/**
 * DeleteCategoryConfirm Component
 * نافذة تأكيد حذف الفئة
 * (يتم استخدام هذه الوظيفة داخل EditCategoryModal)
 */

const DeleteCategoryConfirm = ({ isOpen, onConfirm, onCancel, category }) => {
  if (!isOpen) return null;

  const hasDocuments = category?.documents && category.documents.length > 0;

  return (
    <div className="modal active" onClick={(e) => e.target.classList.contains('modal') && onCancel()}>
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>تأكيد الحذف</h2>
          <button className="modal-close-btn" onClick={onCancel}>
            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <p>
            {hasDocuments
              ? `تحتوي هذه الفئة على ${category.documents.length} مستند. هل تريد حذفها مع جميع المستندات؟`
              : 'هل أنت متأكد من حذف هذه الفئة؟'}
          </p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            إلغاء
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryConfirm;
