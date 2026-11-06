import React, { useState } from 'react';

const UploadFaxModal = ({ isOpen, onClose, onUpload, existingFax }) => {
    const [uploadType, setUploadType] = useState('mixed');
    const [pdfFiles, setPdfFiles] = useState([]);
    const [images, setImages] = useState([]);

    React.useEffect(() => {
        if (existingFax) {
            setUploadType(existingFax.fileType === 'pdf' ? 'mixed' : 'mixed');
        }
    }, [existingFax]);

    const handlePdfSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newPdfs = files.map((file, index) => ({
                id: Date.now() + index,
                name: file.name,
                size: file.size,
                file: file,
                preview: URL.createObjectURL(file),
                order: pdfFiles.length + index + 1
            }));
            setPdfFiles(prev => [...prev, ...newPdfs]);
        }
    };

    const removePdf = (pdfId) => {
        setPdfFiles(prev => prev.filter(pdf => pdf.id !== pdfId).map((pdf, idx) => ({
            ...pdf,
            order: idx + 1
        })));
    };

    const handleImagesSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = files.map((file, index) => ({
                id: Date.now() + index,
                name: file.name,
                size: file.size,
                file: file,
                preview: URL.createObjectURL(file),
                order: images.length + index + 1
            }));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (imageId) => {
        setImages(prev => prev.filter(img => img.id !== imageId).map((img, idx) => ({
            ...img,
            order: idx + 1
        })));
    };

    const handleSubmit = () => {
        if (pdfFiles.length === 0 && images.length === 0) {
            alert('الرجاء اختيار ملفات PDF أو صور على الأقل');
            return;
        }

        onUpload({ type: 'mixed', pdfs: pdfFiles, images });
        handleClose();
    };

    const handleClose = () => {
        setPdfFiles([]);
        setImages([]);
        setUploadType('mixed');
        onClose();
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        // إغلاق المودال فقط عند الضغط على الخلفية وليس على المحتوى
        if (e.target.classList.contains('modal')) {
            handleClose();
        }
    };

    return (
        <div className="modal active" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{existingFax ? 'تغيير الفاكس الأصلي' : 'رفع الفاكس الأصلي'}</h2>
                    <button className="btn-close" onClick={handleClose}>
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                        </svg>
                    </button>
                </div>
                
                <div className="modal-body">
                    {/* قسم رفع ملفات PDF */}
                    <div className="upload-section">
                        <h3 className="upload-section-title">
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor" style={{color: '#ef4444'}}>
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                            </svg>
                            ملفات PDF
                        </h3>
                        <div className="upload-area" id="pdfUploadArea">
                            <input 
                                type="file" 
                                id="pdfFileInput" 
                                accept=".pdf" 
                                multiple
                                style={{ display: 'none' }}
                                onChange={handlePdfSelect}
                            />
                            {pdfFiles.length === 0 ? (
                                <div 
                                    className="upload-placeholder" 
                                    id="pdfPlaceholder"
                                    onClick={() => document.getElementById('pdfFileInput').click()}
                                >
                                    <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"/>
                                        <path d="M9 15l3 -3l3 3"/>
                                        <path d="M12 12l0 9"/>
                                    </svg>
                                    <p>انقر لاختيار ملفات PDF أو اسحبها هنا</p>
                                    <small>يمكنك اختيار ملف واحد أو عدة ملفات PDF</small>
                                </div>
                            ) : (
                                <>
                                    <div className="upload-preview" id="pdfPreview">
                                        {pdfFiles.map((pdf) => (
                                            <div key={pdf.id} className="preview-file">
                                                <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor" style={{color: '#ef4444'}}>
                                                    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                                                </svg>
                                                <div className="preview-file-info">
                                                    <h4>{pdf.name}</h4>
                                                    <small>{formatFileSize(pdf.size)}</small>
                                                </div>
                                                <button className="btn-icon-small" type="button" onClick={() => removePdf(pdf.id)}>
                                                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        className="btn-add-more" 
                                        onClick={() => document.getElementById('pdfFileInput').click()}
                                    >
                                        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 5l0 14"/>
                                            <path d="M5 12l14 0"/>
                                        </svg>
                                        إضافة المزيد من ملفات PDF
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* قسم رفع الصور */}
                    <div className="upload-section">
                        <h3 className="upload-section-title">
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor" style={{color: '#10b981'}}>
                                <path d="M15 8h.01"/>
                                <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z"/>
                                <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5"/>
                                <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3"/>
                            </svg>
                            صور
                        </h3>
                        <div className="upload-area" id="imagesUploadArea">
                            <input 
                                type="file" 
                                id="imagesFileInput" 
                                accept="image/*" 
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleImagesSelect}
                            />
                            {images.length === 0 ? (
                                <div 
                                    className="upload-placeholder" 
                                    id="imagesPlaceholder"
                                    onClick={() => document.getElementById('imagesFileInput').click()}
                                >
                                    <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"/>
                                        <path d="M9 15l3 -3l3 3"/>
                                        <path d="M12 12l0 9"/>
                                    </svg>
                                    <p>انقر لاختيار صور أو اسحبها هنا</p>
                                    <small>يمكنك اختيار صورة واحدة أو عدة صور (JPG, PNG, ...)</small>
                                </div>
                            ) : (
                                <>
                                    <div className="upload-preview images-grid" id="imagesPreview">
                                        {images.map((img) => (
                                            <div key={img.id} className="image-preview-item">
                                                <img src={img.preview} alt={img.name} />
                                                <button className="remove-image-btn" onClick={() => removeImage(img.id)}>
                                                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                                                    </svg>
                                                </button>
                                                <div className="image-order">{img.order}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        className="btn-add-more" 
                                        onClick={() => document.getElementById('imagesFileInput').click()}
                                    >
                                        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 5l0 14"/>
                                            <path d="M5 12l14 0"/>
                                        </svg>
                                        إضافة المزيد من الصور
                                    </button>
                                    <div className="images-merge-note" id="imagesMergeNote">
                                        <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
                                        </svg>
                                        <span>سيتم دمج <strong id="imagesCount">{images.length}</strong> صورة في ملف PDF بالترتيب المعروض</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" id="cancelUploadFax" onClick={handleClose}>
                            إلغاء
                        </button>
                        <button type="button" className="btn-success" id="confirmUploadFax" onClick={handleSubmit}>
                            <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 15a1 1 0 0 1 .993 .883l.007 .117v2a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-2a1 1 0 0 1 1.993 -.117l.007 .117v2a1 1 0 0 0 .883 .993l.117 .007h10a1 1 0 0 0 .993 -.883l.007 -.117v-2a1 1 0 0 1 1 -1"/>
                            </svg>
                            رفع الفاكس
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadFaxModal;
