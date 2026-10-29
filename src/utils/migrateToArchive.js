/**
 * Data Migration Utility
 * ترحيل البيانات من نظام الفئات القديم إلى نظام الأرشفة الجديد
 */

/**
 * ترحيل الفئات والمستندات إلى نظام الأرشفة
 * @param {Array} categories - الفئات القديمة
 * @returns {Array} - فئات الأرشيف الجديدة
 */
export function migrateCategoriestoArchive(categories) {
  if (!categories || categories.length === 0) {
    return [];
  }

  return categories.map(category => {
    // إنشاء مجلد رئيسي لكل فئة
    const mainFolder = {
      id: Date.now() + Math.random(),
      name: `${category.name} - المجلد الرئيسي`,
      description: `ملفات ${category.name} المرحّلة من النظام القديم`,
      categoryId: category.id,
      files: []
    };

    // تحويل المستندات إلى ملفات
    if (category.documents && category.documents.length > 0) {
      mainFolder.files = category.documents.map(doc => ({
        id: doc.id,
        name: doc.originalFileName || doc.file || doc.name,
        originalFileName: doc.originalFileName || doc.file || doc.name,
        size: 0, // سيتم حسابه لاحقاً
        addedAt: new Date().toISOString(),
        path: doc.file,
        icon: doc.icon,
        // الاحتفاظ بالبيانات الأصلية للمرجعية
        _originalDocument: {
          id: doc.id,
          name: doc.name,
          file: doc.file,
          copies: doc.copies || []
        }
      }));
    }

    return {
      id: category.id,
      name: category.name,
      folders: [mainFolder]
    };
  });
}

/**
 * دمج نظام الأرشفة مع النظام القديم (للاستخدام التدريجي)
 * @param {Object} appState - حالة التطبيق
 * @returns {Object} - الحالة المحدثة
 */
export function mergeArchiveWithCategories(appState) {
  if (!appState.categories || appState.categories.length === 0) {
    return appState;
  }

  // إذا كان نظام الأرشفة فارغاً، قم بالترحيل
  if (!appState.archiveCategories || appState.archiveCategories.length === 0) {
    return {
      ...appState,
      archiveCategories: migrateCategoriestoArchive(appState.categories)
    };
  }

  return appState;
}

/**
 * إنشاء بيانات تجريبية لنظام الأرشفة
 * @returns {Array} - فئات أرشيف تجريبية
 */
export function createSampleArchiveData() {
  return [
    {
      id: 1,
      name: 'المستندات الإدارية',
      folders: [
        {
          id: 101,
          name: 'مستندات 2026',
          description: 'مستندات السنة الجارية',
          categoryId: 1,
          files: [
            {
              id: 1001,
              name: 'تقرير_يناير_2026.docx',
              originalFileName: 'تقرير_يناير_2026.docx',
              size: 1024000,
              addedAt: '2026-01-15T10:00:00.000Z'
            },
            {
              id: 1002,
              name: 'خطة_العمل_2026.pdf',
              originalFileName: 'خطة_العمل_2026.pdf',
              size: 2048000,
              addedAt: '2026-01-20T14:30:00.000Z'
            }
          ]
        },
        {
          id: 102,
          name: 'القرارات والأوامر',
          description: 'القرارات الإدارية والأوامر الصادرة',
          categoryId: 1,
          files: [
            {
              id: 1003,
              name: 'قرار_رقم_1.pdf',
              originalFileName: 'قرار_رقم_1.pdf',
              size: 512000,
              addedAt: '2026-01-10T09:00:00.000Z'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'التقارير',
      folders: [
        {
          id: 201,
          name: 'تقارير شهرية',
          description: 'التقارير الشهرية للوحدة',
          categoryId: 2,
          files: [
            {
              id: 2001,
              name: 'تقرير_ديسمبر_2025.docx',
              originalFileName: 'تقرير_ديسمبر_2025.docx',
              size: 896000,
              addedAt: '2025-12-31T16:00:00.000Z'
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'الأرشيف القديم',
      folders: []
    }
  ];
}

/**
 * التحقق من صحة بنية بيانات الأرشفة
 * @param {Array} archiveCategories - فئات الأرشيف
 * @returns {Boolean} - true إذا كانت البنية صحيحة
 */
export function validateArchiveStructure(archiveCategories) {
  if (!Array.isArray(archiveCategories)) {
    return false;
  }

  for (const category of archiveCategories) {
    if (!category.id || !category.name) {
      return false;
    }

    if (!Array.isArray(category.folders)) {
      return false;
    }

    for (const folder of category.folders) {
      if (!folder.id || !folder.name || !folder.categoryId) {
        return false;
      }

      if (!Array.isArray(folder.files)) {
        return false;
      }

      for (const file of folder.files) {
        if (!file.id || !file.name) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * دالة مساعدة: إحصائيات نظام الأرشفة
 * @param {Array} archiveCategories - فئات الأرشيف
 * @returns {Object} - إحصائيات النظام
 */
export function getArchiveStats(archiveCategories) {
  if (!archiveCategories || archiveCategories.length === 0) {
    return {
      totalCategories: 0,
      totalFolders: 0,
      totalFiles: 0,
      totalSize: 0
    };
  }

  let totalFolders = 0;
  let totalFiles = 0;
  let totalSize = 0;

  for (const category of archiveCategories) {
    totalFolders += category.folders?.length || 0;

    for (const folder of category.folders || []) {
      totalFiles += folder.files?.length || 0;

      for (const file of folder.files || []) {
        totalSize += file.size || 0;
      }
    }
  }

  return {
    totalCategories: archiveCategories.length,
    totalFolders,
    totalFiles,
    totalSize
  };
}

export default {
  migrateCategoriestoArchive,
  mergeArchiveWithCategories,
  createSampleArchiveData,
  validateArchiveStructure,
  getArchiveStats
};
