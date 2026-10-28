import React, { useState } from 'react';
import { AppStateProvider } from './context/AppStateContext';
import { SettingsProvider } from './context/SettingsContext';
import { TitleBar, Header, Sidebar, TabBar, Footer } from './components/layout';

function App() {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <SettingsProvider>
            <AppStateProvider>
                <div className="app" dir="rtl">
                    <TitleBar />
                    <Header onSettingsClick={() => setShowSettings(true)} />
                    <TabBar />
                    <Sidebar />
                    
                    <main className="container">
                    </main>
                    
                    <Footer />
                </div>
            </AppStateProvider>
        </SettingsProvider>
    );
}

export default App;
