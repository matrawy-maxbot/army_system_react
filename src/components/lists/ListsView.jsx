import React, { useState, useEffect } from 'react';
import { dataAPI } from '../../services/electronAPI';
import ListCard from './ListCard';
import AddListModal from './AddListModal';
import ListItemsView from './ListItemsView';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import ReorderListsModal from './ReorderListsModal';

const ListsView = () => {
    const [lists, setLists] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [listToDelete, setListToDelete] = useState(null);
    const [showReorderModal, setShowReorderModal] = useState(false);

    useEffect(() => {
        loadLists();
    }, []);

    const loadLists = async () => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data && result.data.lists) {
                // ترتيب القوائم حسب حقل order
                const sortedLists = (result.data.lists || []).sort((a, b) => {
                    const orderA = a.order !== undefined ? a.order : 999999;
                    const orderB = b.order !== undefined ? b.order : 999999;
                    return orderA - orderB;
                });
                setLists(sortedLists);
            } else {
                // إنشاء قائمة المفضلة الافتراضية
                const defaultLists = [{id: 1, name: "المفضلة", isDefault: true, items: [], order: 0}];
                setLists(defaultLists);
            }
        } catch (error) {
            console.error('Error loading lists:', error);
        }
    };

    const handleAddList = async (listName) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const exists = result.data.lists?.some(list => list.name === listName);
                if (exists) {
                    alert('يوجد قائمة بنفس الاسم بالفعل');
                    return;
                }

                // حساب أعلى order موجود
                const maxOrder = Math.max(0, ...(result.data.lists || []).map(l => l.order || 0));

                const newList = {
                    id: Date.now(),
                    name: listName,
                    isDefault: false,
                    items: [],
                    order: maxOrder + 1
                };

                const updatedLists = [...(result.data.lists || []), newList];
                result.data.lists = updatedLists;

                await dataAPI.saveData(result.data);
                loadLists();
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error adding list:', error);
            alert('حدث خطأ أثناء إضافة القائمة');
        }
    };

    const handleDeleteList = async (listId) => {
        const list = lists.find(l => l.id === listId);
        
        if (!list) return;
        
        if (list.isDefault) {
            alert('لا يمكن حذف قائمة المفضلة');
            return;
        }

        setListToDelete(list);
        setShowDeleteModal(true);
    };

    const confirmDeleteList = async () => {
        if (!listToDelete) return;

        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                const updatedLists = result.data.lists.filter(l => l.id !== listToDelete.id);
                result.data.lists = updatedLists;

                await dataAPI.saveData(result.data);
                loadLists();
            }
        } catch (error) {
            console.error('Error deleting list:', error);
            alert('حدث خطأ أثناء حذف القائمة');
        } finally {
            setShowDeleteModal(false);
            setListToDelete(null);
        }
    };

    const handleOpenList = (list) => {
        setSelectedList(list);
    };

    const handleCloseListItems = () => {
        setSelectedList(null);
        loadLists(); // إعادة تحميل لتحديث عدد العناصر
    };

    const handleSaveOrder = async (orderedLists) => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data) {
                result.data.lists = orderedLists;
                await dataAPI.saveData(result.data);
                setLists(orderedLists);
            }
        } catch (error) {
            console.error('Error saving lists order:', error);
            alert('حدث خطأ أثناء حفظ الترتيب');
        }
    };

    return (
        <div className="lists-section">
            <div className="lists-header">
                <h2>
                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                    </svg>
                    القوائم
                    <span className="files-count">({lists.length})</span>
                </h2>
                <div className="lists-header-actions">
                    {lists.length > 1 && (
                        <button className="btn-reorder" onClick={() => setShowReorderModal(true)}>
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 8h18" />
                                <path d="M3 16h18" />
                                <path d="M11 3v18" />
                            </svg>
                            إعادة الترتيب
                        </button>
                    )}
                    <button className="btn-add-category" onClick={() => setShowAddModal(true)}>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 5a1 1 0 0 1 1 1v5h5a1 1 0 0 1 0 2h-5v5a1 1 0 0 1 -2 0v-5h-5a1 1 0 0 1 0 -2h5v-5a1 1 0 0 1 1 -1" />
                        </svg>
                        إنشاء قائمة جديدة
                    </button>
                </div>
            </div>

            <div className="lists-grid">
                {lists.map((list) => (
                    <ListCard
                        key={list.id}
                        list={list}
                        onOpen={() => handleOpenList(list)}
                        onDelete={() => handleDeleteList(list.id)}
                    />
                ))}
            </div>

            {showAddModal && (
                <AddListModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddList}
                />
            )}

            {selectedList && (
                <ListItemsView
                    list={selectedList}
                    onClose={handleCloseListItems}
                />
            )}

            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setListToDelete(null);
                }}
                onConfirm={confirmDeleteList}
                title="تأكيد حذف القائمة"
                message="هل أنت متأكد من حذف هذه القائمة؟"
                itemName={listToDelete?.name}
                itemCount={listToDelete?.items?.length > 0 ? `تحتوي على ${listToDelete.items.length} عنصر` : null}
                warningNote="لا يمكن التراجع عن هذا الإجراء"
            />

            {showReorderModal && (
                <ReorderListsModal
                    lists={lists}
                    onClose={() => setShowReorderModal(false)}
                    onSave={handleSaveOrder}
                />
            )}
        </div>
    );
};

export default ListsView;
