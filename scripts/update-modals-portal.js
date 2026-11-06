/**
 * Script لتحديث جميع المودالات لاستخدام ModalPortal
 * يقوم بإضافة import و wrapping المودالات بـ ModalPortal
 */

const fs = require('fs');
const path = require('path');

// قائمة المودالات التي يجب تحديثها
const modalsToUpdate = [
    'src/components/reminders/AddReminderModal.jsx',
    'src/components/reminders/EditReminderModal.jsx',
    'src/components/reminders/ReminderDetailModal.jsx',
    'src/components/reminders/ReorderRemindersModal.jsx',
    'src/components/tasks/AddTaskModal.jsx',
    'src/components/tasks/EditTaskModal.jsx',
    'src/components/tasks/TaskDetailModal.jsx',
    'src/components/documents/AddDocumentModal.jsx',
    'src/components/documents/EditDocumentModal.jsx',
    'src/components/documents/DocumentDetailModal.jsx',
    'src/components/faxes/FaxDetailModal.jsx',
    'src/components/faxes/ReplyDetailModal.jsx',
    'src/components/faxes/FilterFaxModal.jsx',
    'src/components/faxes/SelectFaxModal.jsx',
    'src/components/faxes/SelectTemplateModal.jsx',
    'src/components/faxes/UploadFaxModal.jsx',
    'src/components/faxes/DeleteFaxModal.jsx',
    'src/components/archive/AddArchiveCategoryModal.jsx',
    'src/components/archive/AddFolderModal.jsx',
    'src/components/archive/EditFolderModal.jsx',
    'src/components/archive/DeleteFolderModal.jsx',
    'src/components/archive/FolderViewModal.jsx',
    'src/components/archive/MoveFolderModal.jsx',
    'src/components/categories/AddCategoryModal.jsx',
    'src/components/categories/EditCategoryModal.jsx',
    'src/components/lists/AddListModal.jsx',
    'src/components/lists/ReorderListsModal.jsx',
    'src/components/templates/AddTemplateModal.jsx',
    'src/components/templates/ReorderTemplatesModal.jsx',
    'src/components/common/AddToListsModal.jsx',
    'src/components/common/ConfirmDeleteModal.jsx',
    'src/components/common/ConfirmPrintModal.jsx',
    'src/components/settings/DateFormatModal.jsx',
    'src/components/backup/BackupProgressModal.jsx',
];

function updateModalFile(filePath) {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`❌ الملف غير موجود: ${filePath}`);
        return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    
    // تحقق إذا كان المودال محدثاً بالفعل
    if (content.includes('ModalPortal')) {
        console.log(`⏭️  تم تحديثه مسبقاً: ${filePath}`);
        return true;
    }

    let modified = false;

    // 1. إضافة import لـ ModalPortal
    const importRegex = /^(import\s+React[^;]+;)/m;
    if (importRegex.test(content)) {
        content = content.replace(
            importRegex,
            "$1\nimport ModalPortal from '../common/ModalPortal';"
        );
        modified = true;
    }

    // 2. البحث عن return statement وإضافة ModalPortal wrapper
    // نمط 1: return ( <div className="modal
    const returnPattern1 = /(\s+return\s+\(\s*\n\s*)(<div className="modal)/;
    if (returnPattern1.test(content)) {
        content = content.replace(
            returnPattern1,
            '$1<ModalPortal>\n        $2'
        );
        modified = true;
    }

    // نمط 2: return <div className="modal
    const returnPattern2 = /(\s+return\s+)(<div className="modal)/;
    if (returnPattern2.test(content) && !returnPattern1.test(content)) {
        content = content.replace(
            returnPattern2,
            '$1(\n        <ModalPortal>\n            $2'
        );
        // نحتاج أيضاً إضافة closing tag
        content = content.replace(
            /(export default [^;]+;)/,
            '        </ModalPortal>\n    );\n}\n\n$1'
        );
        modified = true;
    }

    // 3. إضافة closing tag لـ ModalPortal قبل آخر );
    // البحث عن آخر </div> قبل ); في نهاية return
    const closingPattern = /(    <\/div>\s*\n\s*\);?\s*\n\}/;
    if (closingPattern.test(content) && !content.includes('</ModalPortal>')) {
        content = content.replace(
            closingPattern,
            '    </div>\n    </ModalPortal>\n    );\n}'
        );
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ تم تحديث: ${filePath}`);
        return true;
    } else {
        console.log(`⚠️  لم يتم العثور على نمط مناسب: ${filePath}`);
        return false;
    }
}

// تشغيل السكريبت
console.log('🚀 بدء تحديث المودالات...\n');

let successCount = 0;
let failCount = 0;
let skipCount = 0;

modalsToUpdate.forEach(modalPath => {
    const result = updateModalFile(modalPath);
    if (result === true) {
        successCount++;
    } else if (result === false) {
        failCount++;
    } else {
        skipCount++;
    }
});

console.log('\n📊 ملخص العملية:');
console.log(`✅ تم التحديث بنجاح: ${successCount}`);
console.log(`❌ فشل التحديث: ${failCount}`);
console.log(`⏭️  تم تخطيها (محدثة مسبقاً): ${skipCount}`);
console.log('\n✨ انتهت العملية!');
