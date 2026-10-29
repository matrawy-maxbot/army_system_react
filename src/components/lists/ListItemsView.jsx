import React, { useState, useEffect } from 'react';
import { dataAPI } from '../../services/electronAPI';

const ListItemsView = ({ list, onClose }) => {
    const [items, setItems] = useState([]);
    const [faxes, setFaxes] = useState([]);
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        loadItems();
    }, [list]);

    const loadItems = async () => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                setFaxes(result.data.filteredFaxes || []);
                setReplies(result.data.replies || []);
                
                // تحديث عناصر القائمة
                const currentList = result.data.lists?.find(l => l.id === list.id);
                setItems(currentList?.items || []);
            }
        } catch (error) {
            console.error('Error loading items:', error);
        }
    };

    const handleRemoveItem = async (itemType, itemId) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const currentList = result.data.lists.find(l => l.id === list.id);
                if (currentList) {
                    currentList.items = currentList.items.filter(
                        item => !(item.type === itemType && item.itemId === itemId)
                    );
                    
                    await dataAPI.saveData(result.data);
                    loadItems();
                }
            }
        } catch (error) {
            console.error('Error removing item:', error);
            alert('حدث خطأ أثناء إزالة العنصر');
        }
    };

    const getItemData = (item) => {
        if (item.type === 'fax') {
            const fax = faxes.find(f => f.id === item.itemId);
            if (fax) {
                return {
                    name: `فاكس رقم ${fax.faxNumber}`,
                    icon: (
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                            <path d="M11 14a2 2 0 1 0 2 2" />
                            <path d="M11 10h1" />
                        </svg>
                    ),
                    type: 'فاكس'
                };
            }
        } else if (item.type === 'reply') {
            const reply = replies.find(r => r.id === item.itemId);
            if (reply) {
                return {
                    name: reply.name,
                    icon: (
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                            <path d="M9 11h6" />
                            <path d="M9 15h4" />
                        </svg>
                    ),
                    type: 'رد'
                };
            }
        }
        return null;
    };

    const validItems = items.map(item => ({
        ...item,
        data: getItemData(item)
    })).filter(item => item.data !== null);

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{list.name}</h2>
                    <button className="btn-close" onClick={onClose}>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {validItems.length === 0 ? (
                        <div className="list-content-empty">
                            <div className="empty-icon">
                                <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                                    <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                                </svg>
                            </div>
                            <p>لا توجد عناصر في هذه القائمة</p>
                            <span className="empty-hint">أضف فاكسات أو ردود إلى هذه القائمة</span>
                        </div>
                    ) : (
                        <div className="list-items-container">
                            {validItems.map((item, index) => (
                                <div key={index} className="list-item">
                                    <div className={`list-item-icon ${item.type}`}>
                                        {item.data.icon}
                                    </div>
                                    <div className="list-item-info">
                                        <div className="list-item-name">{item.data.name}</div>
                                        <div className="list-item-type">{item.data.type}</div>
                                    </div>
                                    <button
                                        className="btn-icon-small danger"
                                        onClick={() => handleRemoveItem(item.type, item.itemId)}
                                        title="إزالة"
                                    >
                                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListItemsView;
