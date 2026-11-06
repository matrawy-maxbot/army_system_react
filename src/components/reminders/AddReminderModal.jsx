import React, { useState, useEffect, useRef } from 'react';
import ModalPortal from '../common/ModalPortal';
import { dataAPI } from '../../services/electronAPI';
import { useModalZIndex } from '../../context/ModalStackContext';

const AddReminderModal = ({ onClose, onSave, showFaxLink = false }) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: todayStr,
        endDate: '',
        linkedFaxId: null,
        attachments: []
    });

    const [faxes, setFaxes] = useState([]);
    const [showFaxSelector, setShowFaxSelector] = useState(false);
    const [faxSearch, setFaxSearch] = useState('');
    
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

    useEffect(() => {
        loadFaxes();
    }, []);

    const loadFaxes = async () => {
        try {
            const result = await dataAPI.loadData();
            if (result.success && result.data && result.data.filteredFaxes) {
                setFaxes(result.data.filteredFaxes);
            }
        } catch (error) {
            console.error('Error loading faxes:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        
        for (const file of files) {
            try {
                const base64 = await fileToBase64(file);
                const newAttachment = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: base64,
                    addedAt: new Date().toISOString()
                };

                setFormData(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, newAttachment]
                }));
            } catch (error) {
                console.error('Error reading file:', error);
                alert(`فشل في قراءة الملف: ${file.name}`);
            }
        }
        e.target.value = '';
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleRemoveAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSelectFax = (faxId) => {
        setFormData(prev => ({
            ...prev,
            linkedFaxId: faxId
        }));
        setShowFaxSelector(false);
    };

    const handleUnlinkFax = () => {
        setFormData(prev => ({
            ...prev,
            linkedFaxId: null
        }));
    };

    const getLinkedFax = () => {
        if (!formData.linkedFaxId) return null;
        return faxes.find(f => f.id === formData.linkedFaxId);
    };

    const getFilteredFaxes = () => {
        if (!faxSearch.trim()) return faxes;
        const search = faxSearch.toLowerCase();
        return faxes.filter(fax => 
            fax.name?.toLowerCase().includes(search) ||
            fax.sender?.toLowerCase().includes(search) ||
            fax.faxNumber?.toString().includes(search) ||
            fax.note?.toLowerCase().includes(search)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('أدخل العنوان وتاريخ البداية والنهاية.');
            return;
        }

        if (!formData.startDate || !formData.endDate) {
            alert('أدخل العنوان وتاريخ البداية والنهاية.');
            return;
        }

        if (formData.endDate < formData.startDate) {
            alert('تاريخ النهاية يجب ألا يسبق تاريخ البداية.');
            return;
        }

        onSave(formData);
    };

    return (
        <>
            <ModalPortal>
                <div 
                    ref={mainModalRef}
                    className="modal reminder-clean-modal active" 
                    onClick={onClose}
                >
                    <div className="modal-content modal-clean-reminder" onClick={(e) => e.stopPropagation()}>
                        {/* Top bar */}
                        <header className="clean-topbar">
                            <h2>تذكير جديد</h2>
                            <button className="clean-close" onClick={onClose} aria-label="إغلاق">
                                ×
                            </button>
                        </header>

                        <form onSubmit={handleSubmit}>
                            {/* Composer */}
                            <main className="clean-composer">
                                <input
                                    className="clean-title-input"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="ما الذي تريد تذكّر متابعته؟"
                                    autoComplete="off"
                                    required
                                />
                                <textarea
                                    className="clean-description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="أضف ملاحظة أو تفاصيل إضافية..."
                                />

                                {/* Schedule */}
                                <div className="clean-schedule">
                                    <div className="clean-date-field">
                                        <label>من تاريخ</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="clean-date-separator"></div>
                                    <div className="clean-date-field">
                                        <label>حتى تاريخ</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Relations */}
                                <div className="clean-utilities">
                                    {/* Fax Link */}
                                    {showFaxLink && (
                                        <div className="clean-utility-row">
                                            <span className="clean-utility-label">الفاكس المرتبط</span>
                                            <div>
                                                {getLinkedFax() && (
                                                    <span className="clean-selected-value">
                                                        فاكس #{getLinkedFax().faxNumber}
                                                    </span>
                                                )}
                                                <button
                                                    type="button"
                                                    className="clean-utility-action"
                                                    onClick={() => getLinkedFax() ? handleUnlinkFax() : setShowFaxSelector(true)}
                                                >
                                                    {getLinkedFax() ? '× إزالة' : '+ ربط بفاكس'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Attachments */}
                                    <div className="clean-utility-row">
                                        <span className="clean-utility-label">المرفقات</span>
                                        <label className="clean-utility-action" htmlFor="attachments-input">
                                            + إرفاق ملفات
                                        </label>
                                        <input
                                            className="clean-hidden-input"
                                            id="attachments-input"
                                            type="file"
                                            multiple
                                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,image/*"
                                            onChange={handleFileSelect}
                                        />
                                    </div>

                                    {/* File List */}
                                    {formData.attachments.length > 0 && (
                                        <div className="clean-file-list">
                                            {formData.attachments.map((file, index) => (
                                                <div key={index} className="clean-file-chip">
                                                    <span>{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAttachment(index)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </main>

                            {/* Footer */}
                            <footer className="clean-footer">
                                <button type="button" className="clean-cancel" onClick={onClose}>
                                    إلغاء
                                </button>
                                <button type="submit" className="clean-save">
                                    حفظ التذكير
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            </ModalPortal>

            {/* Fax Selector Modal */}
            {showFaxSelector && (
                <ModalPortal>
                    <div 
                        ref={faxSelectorRef}
                        className="modal-overlay" 
                        onClick={() => setShowFaxSelector(false)}
                    >
                        <div className="modal-content modal-fax-selector-clean" onClick={(e) => e.stopPropagation()}>
                            <header className="clean-topbar">
                                <h2>اختيار فاكس للربط</h2>
                                <button className="clean-close" onClick={() => setShowFaxSelector(false)} aria-label="إغلاق">
                                    ×
                                </button>
                            </header>
                            <div className="clean-selector-body">
                                <input
                                    type="text"
                                    className="clean-search-input"
                                    placeholder="ابحث عن رقم الفاكس..."
                                    value={faxSearch}
                                    onChange={(e) => setFaxSearch(e.target.value)}
                                />
                                <div className="clean-fax-list">
                                    {getFilteredFaxes().length === 0 ? (
                                        <div className="clean-empty-state">لا توجد فاكسات</div>
                                    ) : (
                                        getFilteredFaxes().map(fax => (
                                            <button
                                                key={fax.id}
                                                type="button"
                                                className="clean-fax-item"
                                                onClick={() => handleSelectFax(fax.id)}
                                            >
                                                <span className="fax-number">#{fax.faxNumber}</span>
                                                <span className="fax-name">{fax.name}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </>
    );
};

export default AddReminderModal;
