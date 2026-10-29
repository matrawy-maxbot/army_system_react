import React, { useState, useEffect, useRef } from 'react';

// Cache للصور المصغرة لمنع التكرار
const thumbnailCache = new Map();
const thumbnailGenerationInProgress = new Set();

const FileThumbnail = ({ file }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        
        const ext = file.name.split('.').pop().toLowerCase();
        const isWordDoc = ext === 'doc' || ext === 'docx';

        if (isWordDoc) {
            generateThumbnail();
        } else {
            setIsLoading(false);
        }

        return () => {
            isMounted.current = false;
        };
    }, [file.path]);

    const generateThumbnail = async () => {
        // التحقق من الـ cache أولاً
        if (thumbnailCache.has(file.path)) {
            const cachedPath = thumbnailCache.get(file.path);
            if (isMounted.current) {
                setThumbnailUrl(cachedPath + '?t=' + Date.now());
                setIsLoading(false);
            }
            return;
        }

        // التحقق من أن التوليد ليس قيد التنفيذ
        if (thumbnailGenerationInProgress.has(file.path)) {
            return;
        }

        // وضع علامة أن التوليد قيد التنفيذ
        thumbnailGenerationInProgress.add(file.path);

        try {
            // Note: generateThumbnail is not wrapped yet - keeping original implementation
            const result = window.electronAPI && await window.electronAPI.generateThumbnail(file.path);

            if (!isMounted.current) return;

            if (result.success && result.thumbnailPath) {
                // حفظ في الـ cache
                thumbnailCache.set(file.path, result.thumbnailPath);
                setThumbnailUrl(result.thumbnailPath + '?t=' + Date.now());
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error generating thumbnail:', error);
            if (isMounted.current) {
                setIsLoading(false);
            }
        } finally {
            thumbnailGenerationInProgress.delete(file.path);
        }
    };

    const ext = file.name.split('.').pop().toLowerCase();
    const isWordDoc = ext === 'doc' || ext === 'docx';

    // أيقونات للملفات غير Word
    const getFileIcon = () => {
        let iconSvg = '';
        let color = '#64748b';

        if (ext === 'pdf') {
            color = '#ef4444';
            iconSvg = '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>';
        } else if (ext === 'xls' || ext === 'xlsx') {
            color = '#10b981';
            iconSvg = '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>';
        } else {
            iconSvg = '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>';
        }

        return (
            <svg className="svg-icon-xl" style={{ color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <g dangerouslySetInnerHTML={{ __html: iconSvg }} />
            </svg>
        );
    };

    return (
        <div className="file-preview-thumbnail">
            {isWordDoc ? (
                isLoading ? (
                    <div className="thumbnail-loading">
                        <div className="spinner"></div>
                    </div>
                ) : thumbnailUrl ? (
                    <img 
                        src={thumbnailUrl} 
                        alt="معاينة المستند"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        }}
                        onError={() => setThumbnailUrl(null)}
                    />
                ) : (
                    <div className="thumbnail-placeholder">
                        <div className="thumbnail-icon">
                            <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                            </svg>
                        </div>
                        <div className="thumbnail-text">معاينة</div>
                    </div>
                )
            ) : (
                <div className="thumbnail-placeholder">
                    <div className="thumbnail-icon">
                        {getFileIcon()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileThumbnail;
