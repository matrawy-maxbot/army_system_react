import React, { useState, useEffect } from 'react';
import FileItem from './FileItem';
import SelectionToolbar from './SelectionToolbar';
import DateFilter from './DateFilter';

const FilesList = () => {
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState(new Set());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    // تحميل الملفات عند تغيير التاريخ
    useEffect(() => {
        loadFiles();
    }, [selectedDate]);

    // تحديث الملفات كل 30 ثانية
    useEffect(() => {
        const interval = setInterval(() => {
            loadFiles();
        }, 30000);
        return () => clearInterval(interval);
    }, [selectedDate]);

    const loadFiles = async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        try {
            const dateStr = formatDateByPattern(selectedDate);
            const result = await window.electronAPI.getTodayFiles(dateStr, '');
            
            if (result.success && result.files) {
                setFiles(result.files);
            } else {
                setFiles([]);
            }
        } catch (error) {
            console.error('Error loading files:', error);
            setFiles([]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDateByPattern = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return `${day}-${month}-${year}`.split('').map(char => {
            if (char >= '0' && char <= '9') {
                return arabicNumerals[parseInt(char)];
            }
            return char;
        }).join('');
    };

    const toggleFileSelection = (filePath) => {
        setSelectedFiles(prev => {
            const newSet = new Set(prev);
            if (newSet.has(filePath)) {
                newSet.delete(filePath);
            } else {
                newSet.add(filePath);
            }
            return newSet;
        });
    };

    const selectAllFiles = () => {
        setSelectedFiles(new Set(files.map(f => f.path)));
    };

    const deselectAllFiles = () => {
        setSelectedFiles(new Set());
    };

    const handlePrintSelected = async () => {
        const filePaths = Array.from(selectedFiles);
        if (filePaths.length === 0) return;

        try {
            const result = await window.electronAPI.printFiles(filePaths);
            if (result.success) {
                console.log('Files printed successfully');
            }
        } catch (error) {
            console.error('Error printing files:', error);
        }
    };

    const handleMergeSelected = async () => {
        const filePaths = Array.from(selectedFiles);
        if (filePaths.length < 2) {
            alert('يرجى تحديد ملفين على الأقل للدمج');
            return;
        }

        try {
            const result = await window.electronAPI.mergeFiles(filePaths);
            if (result.success) {
                console.log('Files merged successfully');
                await loadFiles();
            }
        } catch (error) {
            console.error('Error merging files:', error);
        }
    };

    const handleDeleteSelected = async () => {
        const filePaths = Array.from(selectedFiles);
        if (filePaths.length === 0) return;

        const confirmDelete = window.confirm(
            `هل تريد حذف ${filePaths.length} ملف؟`
        );

        if (!confirmDelete) return;

        try {
            const result = await window.electronAPI.deleteFiles(filePaths);
            if (result.success) {
                setSelectedFiles(new Set());
                await loadFiles();
            }
        } catch (error) {
            console.error('Error deleting files:', error);
        }
    };

    const handlePrintSingle = async (filePath) => {
        try {
            const result = await window.electronAPI.printFiles([filePath]);
            if (result.success) {
                console.log('File printed successfully');
            }
        } catch (error) {
            console.error('Error printing file:', error);
        }
    };

    const handleDeleteSingle = async (filePath, fileName) => {
        const confirmDelete = window.confirm(`هل تريد حذف الملف "${fileName}"؟`);
        if (!confirmDelete) return;

        try {
            const result = await window.electronAPI.deleteFiles([filePath]);
            if (result.success) {
                await loadFiles();
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleOpenFolder = async (filePath) => {
        try {
            await window.electronAPI.openFile(filePath);
        } catch (error) {
            console.error('Error opening folder:', error);
        }
    };

    const handleOpenTodayFolder = async () => {
        try {
            const dateStr = formatDateByPattern(selectedDate);
            const result = await window.electronAPI.openTodayCopiesFolder(dateStr, '');
            if (!result.success) {
                alert('فشل في فتح المجلد: ' + result.error);
            }
        } catch (error) {
            console.error('Error opening folder:', error);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>
                    {selectedDate.toDateString() === new Date().toDateString() 
                        ? 'ما تم إنجازه اليوم ' 
                        : `ما تم إنجازه في ${selectedDate.toLocaleDateString('ar-EG', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })} `}
                    <span className="files-count" id="filesCount">({files.length})</span>
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        className="btn-icon-small"
                        onClick={handleOpenTodayFolder}
                        title="فتح مجلد اليوم"
                    >
                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                    <button 
                        className="btn-icon-small"
                        onClick={loadFiles}
                        title="تحديث"
                    >
                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                        </svg>
                    </button>
                </div>
            </div>

            <DateFilter 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
            />

            {selectedFiles.size > 0 && (
                <SelectionToolbar
                    selectedCount={selectedFiles.size}
                    totalCount={files.length}
                    onSelectAll={selectAllFiles}
                    onDeselectAll={deselectAllFiles}
                    onPrint={handlePrintSelected}
                    onMerge={handleMergeSelected}
                    onDelete={handleDeleteSelected}
                />
            )}

            <div className="sidebar-content" id="todayFilesList">
                {files.length === 0 ? (
                    <div className="empty-sidebar">
                        <div className="empty-sidebar-icon">
                            <svg className="svg-icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                            </svg>
                        </div>
                        <div>لم يتم إنشاء أي ملفات في هذا التاريخ</div>
                    </div>
                ) : (
                    files.map(file => (
                        <FileItem
                            key={file.path}
                            file={file}
                            isSelected={selectedFiles.has(file.path)}
                            onToggleSelect={() => toggleFileSelection(file.path)}
                            onPrint={() => handlePrintSingle(file.path)}
                            onDelete={() => handleDeleteSingle(file.path, file.name)}
                            onOpenFolder={() => handleOpenFolder(file.path)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default FilesList;
