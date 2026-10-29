import React, { useState } from 'react';
import { fileAPI } from '../../services/electronAPI';

const AddTemplateModal = ({ onClose, onSave }) => {
    const [templateName, setTemplateName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const getFileTypeFromExtension = (fileName) => {
        if (!fileName) return 'Unknown';
        const extension = fileName.split('.').pop().toLowerCase();
        
        const typeMap = {
            'docx': 'Word',
            'xlsx': 'Excel',
            'pptx': 'PowerPoint',
            'pdf': 'PDF'
        };
        
        return typeMap[extension] || 'Unknown';
    };

    const isValidTemplateFile = (fileName) => {
        if (!fileName) return false;
        const extension = fileName.split('.').pop().toLowerCase();
        const validExtensions = ['docx', 'xlsx', 'pptx', 'pdf'];
        return validExtensions.includes(extension);
    };

    const handleSelectFile = async () => {
        const options = {
            properties: ['openFile'],
            filters: [
                { name: 'Office & PDF Files', extensions: ['docx', 'xlsx', 'pptx', 'pdf'] },
                { name: 'Word Documents', extensions: ['docx'] },
                { name: 'Excel Spreadsheets', extensions: ['xlsx'] },
                { name: 'PowerPoint Presentations', extensions: ['pptx'] },
                { name: 'PDF Files', extensions: ['pdf'] }
            ]
        };

        const result = await fileAPI.selectFile(options);

        if (result.success && !result.canceled) {
            if (!isValidTemplateFile(result.fileName)) {
                alert('نوع الملف غير مدعوم. يرجى اختيار ملف Word أو Excel أو PowerPoint أو PDF فقط.');
                return;
            }

            setSelectedFile({
                fileName: result.fileName,
                filePath: result.filePath,
                fileType: getFileTypeFromExtension(result.fileName)
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!templateName.trim()) {
            alert('يرجى إدخال اسم القالب');
            return;
        }

        if (!selectedFile) {
            alert('يرجى اختيار ملف القالب');
            return;
        }

        onSave({
            name: templateName.trim(),
            fileName: selectedFile.fileName,
            filePath: selectedFile.filePath,
            fileType: selectedFile.fileType
        });
    };

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>إضافة قالب جديد</h2>
                    <button className="btn-close" onClick={onClose}>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
                        </svg>
                    </button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>اسم القالب *</label>
                        <input
                            type="text"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="أدخل اسم القالب"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>ملف القالب *</label>
                        <div className="file-input-wrapper">
                            <span className="file-input-text">
                                {selectedFile ? selectedFile.fileName : 'لم يتم اختيار ملف'}
                            </span>
                            <button
                                type="button"
                                className="btn-file"
                                onClick={handleSelectFile}
                            >
                                اختر ملف
                            </button>
                        </div>
                        {selectedFile && (
                            <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
                                نوع الملف: {selectedFile.fileType}
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            إلغاء
                        </button>
                        <button type="submit" className="btn-primary">
                            حفظ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTemplateModal;
