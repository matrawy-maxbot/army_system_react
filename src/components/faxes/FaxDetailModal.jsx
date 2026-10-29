/**
 * FaxDetailModal Component
 * نافذة تفاصيل الفاكس مع معاينة الصور والإجراءات
 */

import { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import ConfirmPrintModal from '../common/ConfirmPrintModal';
import './FaxDetailModal.css';

const FaxDetailModal = ({ isOpen, onClose, faxId, onAddToLists, onDelete }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [note, setNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const fax = appState.filteredFaxes?.find(f => f.id === faxId);

  if (!fax) return null;

  // الحصول على صور الفاكس من الصفحات
  const getPageImages = () => {
    const pages = appState.faxPages || [];
    const mainPages = fax.pageIds?.map(id => pages.find(p => p.id === id)).filter(Boolean) || [];
    const dependentPages = fax.dependentPageIds?.map(id => pages.find(p => p.id === id)).filter(Boolean) || [];
    
    return {
      main: mainPages,
      dependent: dependentPages,
      all: [...mainPages, ...dependentPages]
    };
  };

  const pageImages = getPageImages();

  // التحقق من وجود الفاكس في أي قائمة
  const isInAnyList = () => {
    if (!appState.lists) return false;
    return appState.lists.some(list => 
      list.items?.some(item => item.type === 'fax' && item.itemId === fax.id)
    );
  };

  const handleStartEditName = () => {
    setEditedName(fax.name);
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) return;

    const updatedFaxes = appState.filteredFaxes.map(f =>
      f.id === fax.id ? { ...f, name: editedName.trim() } : f
    );

    setAppState({ ...appState, filteredFaxes: updatedFaxes });
    await saveData();
    setIsEditingName(false);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;

    const updatedFaxes = appState.filteredFaxes.map(f =>
      f.id === fax.id ? { ...f, note: note.trim() } : f
    );

    setAppState({ ...appState, filteredFaxes: updatedFaxes });
    await saveData();
    setNote('');
    setIsAddingNote(false);
  };

  const handleEditNote = () => {
    setNote(fax.note);
    setIsAddingNote(true);
  };

  const handleDeleteNote = () => {
    setShowDeleteNoteModal(true);
  };

  const confirmDeleteNote = async () => {
    const updatedFaxes = appState.filteredFaxes.map(f =>
      f.id === fax.id ? { ...f, note: '' } : f
    );

    setAppState({ ...appState, filteredFaxes: updatedFaxes });
    await saveData();
    setShowDeleteNoteModal(false);
  };

  const handleOpenFolder = () => {
    // سيتم تفعيله لاحقاً مع الباك إند
    console.log('Open folder:', fax.id);
  };

  const handleOpenFile = (pageIndex = 0) => {
    // سيتم تفعيله لاحقاً مع الباك إند
    console.log('Open file:', fax.id, 'page:', pageIndex);
  };

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  const confirmPrint = async () => {
    setIsPrinting(true);
    try {
      // سيتم تفعيله لاحقاً مع الباك إند
      console.log('Print fax:', fax.id);
      
      // محاكاة عملية الطباعة
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`تم إرسال الفاكس "${fax.name}" إلى الطابعة`);
      setShowPrintModal(false);
    } catch (error) {
      console.error('Error printing fax:', error);
      alert('حدث خطأ أثناء الطباعة');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(fax.id);
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      console.error('Error deleting fax:', error);
      alert('حدث خطأ أثناء حذف الفاكس');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(prev => 
      prev > 0 ? prev - 1 : pageImages.all.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev < pageImages.all.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={null} size="normal" customHeader={
      <div className="fax-detail-modal-header">
        <div className="fax-header-right">
          {isEditingName ? (
            <div className="fax-name-edit-inline">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="fax-name-input"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <button className="btn-icon-small success" onClick={handleSaveName} title="حفظ">
                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <button className="btn-icon-small danger" onClick={handleCancelEditName} title="إلغاء">
                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ) : (
            <>
              <h2 className="fax-modal-title">{fax.name}</h2>
              <button className="btn-icon-header" onClick={handleStartEditName} title="تعديل الاسم">
                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/>
                  <path d="M13.5 6.5l4 4"/>
                </svg>
              </button>
              <button 
                className={`btn-icon-header ${isInAnyList() ? 'in-list' : ''}`}
                onClick={() => onAddToLists(fax)}
                title={isInAnyList() ? 'موجود في القوائم' : 'إضافة إلى القوائم'}
              >
                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill={isInAnyList() ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/>
                </svg>
              </button>
              <button className="btn-icon-header" onClick={handleOpenFolder} title="فتح مسار المجلد">
                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"/>
                </svg>
              </button>
              <button className="btn-icon-header" onClick={handlePrint} title="طباعة الفاكس">
                <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"/>
                  <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"/>
                  <path d="M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4"/>
                </svg>
              </button>
            </>
          )}
        </div>
        <button className="btn-close" onClick={onClose} title="إغلاق">
          <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
          </svg>
        </button>
      </div>
    }>
      <div className="fax-detail-content">

        {/* معاينة الصور */}
        <div className="fax-detail-preview">
          {pageImages.all.length > 0 ? (
            <div className="fax-image-viewer">
              <div className="fax-image-container">
                <img 
                  src={pageImages.all[currentImageIndex]?.thumbnailUrl} 
                  alt={`صفحة ${currentImageIndex + 1}`}
                  className="fax-preview-image"
                />
                {pageImages.all.length > 1 && (
                  <>
                    <button className="fax-nav-btn prev" onClick={handlePreviousImage}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.293 6.293l-6 6l-.083 .094a1 1 0 0 0 .083 1.32l6 6l.094 .083a1 1 0 0 0 1.32 -1.497l-5.292 -5.293l5.292 -5.293l.083 -.094a1 1 0 0 0 -.083 -1.32l-.094 -.083a1 1 0 0 0 -1.32 .083z"/>
                      </svg>
                    </button>
                    <button className="fax-nav-btn next" onClick={handleNextImage}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10.707 6.293a1 1 0 0 1 1.497 1.32l-.083 .094l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.32 1.497l-.094 -.083l-6 -6a1 1 0 0 1 -.083 -1.32l.083 -.094l6 -6z"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
              <div className="fax-image-info">
                <span>{currentImageIndex + 1} / {pageImages.all.length}</span>
                {currentImageIndex >= pageImages.main.length && (
                  <span className="dependent-badge">صفحة تابعة</span>
                )}
              </div>
            </div>
          ) : (
            <div className="fax-no-images">
              <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 8h.01"/>
                <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z"/>
                <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5"/>
                <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3"/>
              </svg>
              <p>لا توجد صور متاحة</p>
            </div>
          )}
        </div>

        {/* صور مصغرة */}
        {pageImages.all.length > 1 && (
          <div className="fax-thumbnails">
            <div className="thumbnails-grid">
              {pageImages.main.map((page, index) => (
                <div 
                  key={page.id}
                  className={`thumbnail-item ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={page.thumbnailUrl} alt={`صفحة ${index + 1}`} />
                  <span className="thumbnail-number">{index + 1}</span>
                </div>
              ))}
              {pageImages.dependent.length > 0 && (
                <div className="thumbnails-divider">
                  <span>الصفحات التابعة</span>
                </div>
              )}
              {pageImages.dependent.map((page, index) => {
                const actualIndex = pageImages.main.length + index;
                return (
                  <div 
                    key={page.id}
                    className={`thumbnail-item dependent ${currentImageIndex === actualIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(actualIndex)}
                  >
                    <img src={page.thumbnailUrl} alt={`صفحة تابعة ${index + 1}`} />
                    <span className="thumbnail-number">{actualIndex + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* الملاحظة */}
        <div className="fax-detail-note">
          {fax.note && !isAddingNote ? (
            <div className="fax-note-display">
              <div className="fax-note-header">
                <label>الملاحظة:</label>
                <div className="fax-note-actions-inline">
                  <button className="btn-icon-small" onClick={handleEditNote} title="تعديل الملاحظة">
                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/>
                      <path d="M13.5 6.5l4 4"/>
                    </svg>
                  </button>
                  <button className="btn-icon-small danger" onClick={handleDeleteNote} title="حذف الملاحظة">
                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                    </svg>
                  </button>
                </div>
              </div>
              <p>{fax.note}</p>
            </div>
          ) : isAddingNote ? (
            <div className="fax-note-add">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="أضف ملاحظة..."
                className="fax-note-textarea"
                autoFocus
                rows="3"
              />
              <div className="fax-note-actions">
                <Button variant="primary" onClick={handleAddNote}>
                  {fax.note ? 'حفظ التعديلات' : 'حفظ الملاحظة'}
                </Button>
                <Button variant="secondary" onClick={() => { setIsAddingNote(false); setNote(''); }}>إلغاء</Button>
              </div>
            </div>
          ) : (
            <button className="btn-add-note" onClick={() => setIsAddingNote(true)}>
              <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5l0 14"/>
                <path d="M5 12l14 0"/>
              </svg>
              إضافة ملاحظة
            </button>
          )}
        </div>
      </div>

      <div className="modal-actions">
        <Button variant="danger" onClick={handleDelete}>
          <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007zm-10 4a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1m4 0a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1 -1"/>
            <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005z"/>
          </svg>
          حذف الفاكس
        </Button>
        <Button variant="primary" onClick={() => handleOpenFile(currentImageIndex)}>
          فتح الملف
        </Button>
        <Button variant="secondary" onClick={onClose}>
          إغلاق
        </Button>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="تأكيد حذف الفاكس"
        message="هل أنت متأكد من حذف هذا الفاكس؟"
        itemName={fax.name}
        warningNote="لا يمكن التراجع عن هذا الإجراء"
        loading={isDeleting}
      />

      <ConfirmPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        onConfirm={confirmPrint}
        title="تأكيد طباعة الفاكس"
        message="هل تريد طباعة هذا الفاكس؟"
        itemName={fax.name}
        pagesCount={`عدد الصفحات: ${pageImages.all.length}`}
        loading={isPrinting}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteNoteModal}
        onClose={() => setShowDeleteNoteModal(false)}
        onConfirm={confirmDeleteNote}
        title="تأكيد حذف الملاحظة"
        message="هل أنت متأكد من حذف الملاحظة؟"
        warningNote="لا يمكن التراجع عن هذا الإجراء"
        loading={false}
      />
    </Modal>
  );
};

export default FaxDetailModal;
