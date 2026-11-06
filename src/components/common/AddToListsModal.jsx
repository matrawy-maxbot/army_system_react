/**
 * AddToListsModal Component
 * نافذة اختيار القوائم لإضافة عنصر إليها
 */

import { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import Modal from './Modal';
import Button from './Button';
import './AddToListsModal.css';

const AddToListsModal = ({ isOpen, onClose, item }) => {
  const { appState, setAppState, saveData } = useAppState();
  const [selectedLists, setSelectedLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // إعادة تعيين القوائم المحددة عند فتح المودال
  useEffect(() => {
    if (isOpen && item) {
      // التحقق من القوائم التي يوجد فيها العنصر حالياً
      const currentLists = (appState.lists || [])
        .filter(list => 
          list.items?.some(listItem => 
            listItem.type === item.type && listItem.itemId === item.id
          )
        )
        .map(list => list.id);
      
      setSelectedLists(currentLists);
      setError('');
    }
  }, [isOpen, item, appState.lists]);

  const handleToggleList = (listId) => {
    if (selectedLists.includes(listId)) {
      setSelectedLists(selectedLists.filter(id => id !== listId));
    } else {
      setSelectedLists([...selectedLists, listId]);
    }
  };

  const handleSave = async () => {
    if (!item) return;

    setLoading(true);
    setError('');

    try {
      const lists = appState.lists || [];
      
      // تحديث القوائم
      const updatedLists = lists.map(list => {
        const hasItem = list.items?.some(listItem => 
          listItem.type === item.type && listItem.itemId === item.id
        );
        const shouldHaveItem = selectedLists.includes(list.id);

        if (shouldHaveItem && !hasItem) {
          // إضافة العنصر للقائمة
          return {
            ...list,
            items: [
              ...(list.items || []),
              {
                type: item.type,
                itemId: item.id,
                addedDate: new Date().toISOString()
              }
            ]
          };
        } else if (!shouldHaveItem && hasItem) {
          // إزالة العنصر من القائمة
          return {
            ...list,
            items: (list.items || []).filter(listItem => 
              !(listItem.type === item.type && listItem.itemId === item.id)
            )
          };
        }

        return list;
      });

      const updatedState = {
        ...appState,
        lists: updatedLists
      };

      setAppState(updatedState);
      await saveData();
      handleClose();
    } catch (err) {
      console.error('Error updating lists:', err);
      setError('حدث خطأ أثناء تحديث القوائم');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedLists([]);
    setError('');
    onClose();
  };

  if (!item) return null;

  const lists = appState.lists || [];
  const itemName = item.name || `${item.type === 'fax' ? 'فاكس رقم ' + item.faxNumber : item.fileName}`;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="إضافة إلى القوائم"
      modalId={`add-to-lists-${item?.type}-${item?.id}`}
    >
      <div className="add-to-lists-content">
        <div className="add-to-lists-item-info">
          <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
            {item.type === 'fax' ? (
              <>
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                <path d="M11 14a2 2 0 1 0 2 2" />
                <path d="M11 10h1" />
              </>
            ) : item.type === 'originalFax' ? (
              <>
                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
              </>
            ) : (
              <>
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                <path d="M9 11h6" />
                <path d="M9 15h4" />
              </>
            )}
          </svg>
          <span>{itemName}</span>
        </div>

        {lists.length === 0 ? (
          <div className="add-to-lists-empty">
            <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
              <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
            </svg>
            <p>لا توجد قوائم متاحة</p>
            <p className="empty-hint">قم بإنشاء قائمة أولاً من قسم القوائم</p>
          </div>
        ) : (
          <div className="add-to-lists-grid">
            <p className="add-to-lists-label">اختر القوائم:</p>
            <div className="lists-buttons-grid">
              {lists.map(list => (
                <button
                  key={list.id}
                  type="button"
                  className={`list-button ${selectedLists.includes(list.id) ? 'selected' : ''} ${list.isDefault ? 'default' : ''}`}
                  onClick={() => handleToggleList(list.id)}
                  disabled={loading}
                >
                  {list.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message" style={{ marginTop: '10px', color: '#ef4444' }}>
            {error}
          </div>
        )}
      </div>

      <div className="modal-actions" style={{ marginTop: '20px' }}>
        <Button 
          type="button" 
          variant="primary" 
          onClick={handleSave} 
          disabled={loading || lists.length === 0}
        >
          {loading ? 'جاري الحفظ...' : 'حفظ'}
        </Button>
        <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
          إلغاء
        </Button>
      </div>
    </Modal>
  );
};

export default AddToListsModal;
