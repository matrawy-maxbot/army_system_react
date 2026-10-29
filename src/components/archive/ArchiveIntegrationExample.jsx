/**
 * مثال على كيفية دمج نظام الأرشفة في التطبيق الحالي
 * Example of integrating Archive System in existing app
 */

import { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  migrateCategoriestoArchive, 
  createSampleArchiveData,
  getArchiveStats,
  validateArchiveStructure 
} from '../../utils/migrateToArchive';
import ArchivePage from '../../pages/ArchivePage';

const ArchiveIntegrationExample = () => {
  const { appState, setAppState, saveData } = useAppState();
  const [view, setView] = useState('setup'); // setup, archive

  // عرض الإحصائيات
  const stats = getArchiveStats(appState.archiveCategories || []);

  // الترحيل من النظام القديم
  const handleMigrateFromOld = async () => {
    const archiveCategories = migrateCategoriestoArchive(appState.categories);
    
    setAppState({
      ...appState,
      archiveCategories: archiveCategories
    });
    
    await saveData();
    setView('archive');
    
    alert('تم ترحيل البيانات بنجاح!');
  };

  // إنشاء بيانات تجريبية
  const handleCreateSample = async () => {
    const sampleData = createSampleArchiveData();
    
    setAppState({
      ...appState,
      archiveCategories: sampleData
    });
    
    await saveData();
    setView('archive');
    
    alert('تم إنشاء بيانات تجريبية!');
  };

  // بدء من الصفر
  const handleStartFresh = async () => {
    setAppState({
      ...appState,
      archiveCategories: []
    });
    
    await saveData();
    setView('archive');
  };

  if (view === 'archive') {
    return <ArchivePage />;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>
        مرحباً بك في نظام الأرشفة
      </h1>

      {/* الإحصائيات الحالية */}
      <div style={{ 
        padding: '20px', 
        background: '#f8f9fb', 
        borderRadius: '12px', 
        marginBottom: '30px' 
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
          الإحصائيات الحالية:
        </h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>📁 فئات الأرشيف: {stats.totalCategories}</li>
          <li>📂 المجلدات: {stats.totalFolders}</li>
          <li>📄 الملفات: {stats.totalFiles}</li>
          <li>📦 النظام القديم - الفئات: {appState.categories?.length || 0}</li>
          <li>📄 النظام القديم - المستندات: {
            appState.categories?.reduce((sum, cat) => sum + (cat.documents?.length || 0), 0) || 0
          }</li>
        </ul>
      </div>

      {/* الخيارات */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
          كيف تريد البدء؟
        </h2>

        {/* الخيار 1: الترحيل */}
        {appState.categories && appState.categories.length > 0 && (
          <button
            onClick={handleMigrateFromOld}
            style={{
              padding: '20px',
              background: 'white',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'right',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#eff6ff';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#3b82f6', marginBottom: '8px' }}>
              🔄 ترحيل البيانات الحالية
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              نقل جميع الفئات والمستندات إلى نظام الأرشفة الجديد
            </p>
          </button>
        )}

        {/* الخيار 2: البيانات التجريبية */}
        <button
          onClick={handleCreateSample}
          style={{
            padding: '20px',
            background: 'white',
            border: '2px solid #10b981',
            borderRadius: '12px',
            cursor: 'pointer',
            textAlign: 'right',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f0fdf4';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>
            🎯 إنشاء بيانات تجريبية
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            إنشاء فئات ومجلدات تجريبية لتجربة النظام
          </p>
        </button>

        {/* الخيار 3: البدء من الصفر */}
        <button
          onClick={handleStartFresh}
          style={{
            padding: '20px',
            background: 'white',
            border: '2px solid #64748b',
            borderRadius: '12px',
            cursor: 'pointer',
            textAlign: 'right',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f8f9fb';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
            ✨ البدء من الصفر
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            إنشاء نظام أرشفة جديد تماماً
          </p>
        </button>

        {/* الانتقال المباشر للأرشيف */}
        {stats.totalCategories > 0 && (
          <button
            onClick={() => setView('archive')}
            style={{
              padding: '15px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              marginTop: '10px'
            }}
          >
            الانتقال إلى نظام الأرشفة →
          </button>
        )}
      </div>

      {/* ملاحظة مهمة */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        background: '#fef3c7',
        border: '1px solid #fbbf24',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#92400e'
      }}>
        <strong>💡 ملاحظة:</strong> يمكنك استخدام نظام الأرشفة بجانب النظام القديم، 
        أو استبدال النظام القديم بالكامل. راجع <code>ARCHIVE_MIGRATION_GUIDE.md</code> للمزيد من التفاصيل.
      </div>
    </div>
  );
};

export default ArchiveIntegrationExample;
