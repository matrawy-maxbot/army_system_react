import React, { useState } from 'react';

const UploadFaxModal = ({ isOpen, onClose, onUpload, existingFax }) => {
    const [uploadType, setUploadType] = useState('pdf');
    const [pdfFile, setPdfFile] = useState(null);
    const [images, setImages] = useState([]);

    React.useEffect(() => {
        if (existingFax) {
            setUploadType(existingFax.fileType);
        }
    }, [existingFax]);

    const handlePdfSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPdfFile({
                name: file.name,
                size: file.size,
                file: file,
                preview: URL.createObjectURL(file)
            });
        }
    };

    const removePdf = () => {
        setPdfFile(null);
    };

    const handleImagesSelect = (e) => {
        const files = Array.from(e.target.files);
        setImages(files.map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            size: file.size,
            file: file,
            preview: URL.createObjectURL(file),
            order: index + 1
        })));
    };

    const removeImage = (imageId) => {
        setImages(prev => prev.filter(img => img.id !== imageId).map((img, idx) => ({
            ...img,
            order: idx + 1
        })));
    };

    const handleSubmit = () => {
        if (uploadType === 'pdf' && !pdfFile) {
            alert('الرجاء اختيار ملف PDF');
            return;
        }
        if (uploadType === 'images' && images.length === 0) {
            alert('الرجاء اختيار صور');
            return;
        }

        onUpload({ type: uploadType, pdf: pdfFile, images });
        handleClose();
    };

    const handleClose = () => {
        setPdfFile(null);
        setImages([]);
        setUploadType('pdf');
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

    return (
        <div className="modal active">
            <div className="modal-content modal-small">
                <div className="modal-header">
                    <h2>{existingFax ? 'تغيير الفاكس الأصلي' : 'رفع فاكس أصلي'}</h2>
                    <button className="btn-close" onClick={handleClose}>×</button>
                </div>
                
                <div className="modal-body">
                    <div className="upload-type-selector">
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="uploadType" 
                                value="pdf" 
                                checked={uploadType === 'pdf'}
                                onChange={() => setUploadType('pdf')}
                            />
                            <div className="radio-label">
                                <svg className="svg-icon-md" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                                </svg>
                                <span>ملف PDF واحد</span>
                            </div>
                        </label>
                        
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="uploadType" 
                                value="images" 
                                checked={uploadType === 'images'}
                                onChange={() => setUploadType('images')}
                            />
                            <div className="radio-label">
                                <svg className="svg-icon-md" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M15 8h.01"/>
                                    <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z"/>
                                    <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5"/>
                                    <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3"/>
                                </svg>
                                <span>صور متعددة</span>
                            </div>
                        </label>
                    </div>

                    {uploadType === 'pdf' && (
                        <div className="upload-area" id="pdfUploadArea">
                            {!pdfFile ? (
                                <div 
                                    className="upload-placeholder" 
                                    onClick={() => document.getElementById('pdfFileInput').click()}
                                >
                                    <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"/>
                                        <path d="M9 15l3 -3l3 3"/>
                                        <path d="M12 12l0 9"/>
                                    </svg>
                                    <p>انقر لاختيار ملف PDF</p>
                                </div>
                            ) : (
                                <div className="file-preview">
                                    <div className="file-icon">
                                        <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                                        </svg>
                                    </div>
                                    <div className="file-info">
                                        <div className="file-name">{pdfFile.name}</div>
                                        <div className="file-size">{formatFileSize(pdfFile.size)}</div>
                                    </div>
                                    <button className="btn-remove" onClick={removePdf}>
                                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                                        </svg>
                                    </button>
                                </div>
                            )}
                            <input 
                                type="file" 
                                id="pdfFileInput" 
                                accept=".pdf" 
                                style={{ display: 'none' }}
                                onChange={handlePdfSelect}
                            />
                        </div>
                    )}

                    {uploadType === 'images' && (
                        <div className="upload-area" id="imagesUploadArea">
                            {images.length === 0 ? (
                                <div 
                                    className="upload-placeholder" 
                                    onClick={() => document.getElementById('imagesFileInput').click()}
                                >
                                    <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 8h.01"/>
                                        <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z"/>
                                        <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5"/>
                                        <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3"/>
                                    </svg>
                                    <p>انقر لاختيار صور متعددة</p>
                                </div>
                            ) : (
                                <>
                                    <div className="images-merge-note">
                                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"/>
                                        </svg>
                                        سيتم دمج الصور في ملف PDF واحد بالترتيب • {images.length} صورة
                                    </div>
                                    <div className="images-preview-grid">
                                        {images.map((img, index) => (
                                            <div key={img.id} className="image-preview-item">
                                                <img src={img.preview} alt={img.name} />
                                                <button className="btn-remove" onClick={() => removeImage(img.id)}>
                                                    <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"/>
                                                    </svg>
                                                </button>
                                                <div className="image-order">{index + 1}</div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            <input 
                                type="file" 
                                id="imagesFileInput" 
                                accept="image/*" 
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleImagesSelect}
                            />
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={handleClose}>
                        إلغاء
                    </button>
                    <button className="btn-primary" onClick={handleSubmit}>
                        {existingFax ? 'تحديث' : 'رفع'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadFaxModal;
