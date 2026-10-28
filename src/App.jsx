import React, { useState } from 'react';
import { AppStateProvider } from './context/AppStateContext';
import { SettingsProvider } from './context/SettingsContext';
import { TitleBar, Header, Sidebar, TabBar, Footer } from './components/layout';
import { OriginalFaxSection, FaxGrid, UploadFaxModal, FilterFaxModal } from './components/faxes';
import { FilesList } from './components/files';
import { SettingsModal } from './components/settings';
import './styles/files.css';

function App() {
    const [showSettings, setShowSettings] = useState(false);
    const [showUploadFax, setShowUploadFax] = useState(false);
    const [showFilterFax, setShowFilterFax] = useState(false);

    const handleUpload = async (uploadData) => {
        const { type, pdf, images } = uploadData;
        
        // TODO: Implement actual file upload logic
        console.log('Upload data:', uploadData);
    };

    return (
        <SettingsProvider>
            <AppStateProvider>
                <div className="app" dir="rtl">
                    <TitleBar />
                    <Header onSettingsClick={() => setShowSettings(true)} />
                    <TabBar />
                    <Sidebar />
                    
                    <main className="container">
                        <OriginalFaxSection 
                            onUploadClick={() => setShowUploadFax(true)}
                            onEditClick={() => setShowUploadFax(true)}
                            onDeleteClick={async () => {
                                // TODO: Implement delete logic
                                console.log('Delete fax');
                            }}
                            onFilterClick={() => setShowFilterFax(true)}
                        />

                        <FaxGrid />
                    </main>
                    
                    {/* نظام الملفات اليومية */}
                    <FilesList />
                    
                    <Footer />

                    <UploadFaxModal 
                        isOpen={showUploadFax}
                        onClose={() => setShowUploadFax(false)}
                        onUpload={handleUpload}
                    />

                    <FilterFaxModal 
                        isOpen={showFilterFax}
                        onClose={() => setShowFilterFax(false)}
                    />

                    <SettingsModal 
                        isOpen={showSettings}
                        onClose={() => setShowSettings(false)}
                    />
                </div>
            </AppStateProvider>
        </SettingsProvider>
    );
}

export default App;
