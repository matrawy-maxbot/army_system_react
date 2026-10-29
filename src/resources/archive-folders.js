// ========== Archive Folders System ==========

// Global state for archive system
let archiveState = {
    archiveCategories: [],
    currentFolder: null
};

// تهيئة نظام الأرشيف
function initializeArchiveFolders() {
    console.log('Initializing Archive Folders System...');
    
    // تحميل البيانات
    loadArchiveData();
    
    // ربط الأحداث
    initializeArchiveEventListeners();
    
    // عرض البيانات
    renderArchiveCategories();
}

// تحميل بيانات الأرشيف
function loadArchiveData() {
    // التحقق من وجود بيانات محفوظة في appState
    if (appState.archiveCategories) {
        archiveState.archiveCategories = appState.archiveCategories;
    } else {
        // بيانات تجريبية للعرض
        archiveState.archiveCategories = [
            {
                id: 1,
                name: 'المستندات الإدارية',
                folders: [
                    {
                        id: 101,
                        name: 'مستندات 2026',
                        description: 'مستندات السنة الجارية',
                        categoryId: 1,
                        files: []
                    },
                    {
                        id: 102,
                        name: 'القرارات والأوامر',
                        description: 'القرارات الإدارية والأوامر الصادرة',
                        categoryId: 1,
                        files: []
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
                        files: []
                    }
                ]
            },
            {
                id: 3,
                name: 'الأرشيف القديم',
                folders: []
            }
        ];
        
        // حفظ البيانات التجريبية
        saveArchiveData();
    }
}

// حفظ بيانات الأرشيف
async function saveArchiveData() {
    appState.archiveCategories = archiveState.archiveCategories;
    await saveData();
}

// عرض فئات الأرشيف
function renderArchiveCategories() {
    const categoriesContainer = document.getElementById('archiveCategories');
    const emptyState = document.getElementById('archiveEmpty');
    
    if (!categoriesContainer || !emptyState) return;
    
    if (archiveState.archiveCategories.length === 0) {
        categoriesContainer.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    categoriesContainer.style.display = 'flex';
    emptyState.style.display = 'none';
    
    categoriesContainer.innerHTML = archiveState.archiveCategories.map(category => `
        <div class="archive-category-card" data-category-id="${category.id}">
            <div class="archive-category-header" onclick="toggleArchiveCategory(${category.id})">
                <div class="archive-category-title">
                    <div class="archive-category-toggle">
                        <svg class="toggle-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 6l6 6l-6 6"/>
                        </svg>
                        <span>${category.name}</span>
                    </div>
                    <span style="color: #64748b; font-size: 13px; font-weight: normal;">
                        (${category.folders.length} مجلد)
                    </span>
                </div>
                <div class="archive-category-actions" onclick="event.stopPropagation()">
                    <button class="btn-add-folder" onclick="openAddFolderModal(${category.id})">
                        <svg class="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1 -2 0v-6h-6a1 1 0 0 1 0 -2h6v-6a1 1 0 0 1 1 -1" />
                        </svg>
                        إضافة مجلد
                    </button>
                </div>
            </div>
            <div class="archive-folders-grid">
                ${renderFoldersGrid(category.folders)}
            </div>
        </div>
    `).join('');
}

// عرض شبكة المجلدات
function renderFoldersGrid(folders) {
    if (folders.length === 0) {
        return `
            <div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #94a3b8;">
                لا توجد مجلدات في هذه الفئة
            </div>
        `;
    }
    
    return folders.map(folder => `
        <div class="folder-card" onclick="openFolderView(${folder.id})">
            <div class="folder-card-icon">
                <svg class="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" />
                </svg>
            </div>
            <div class="folder-card-name">${folder.name}</div>
            ${folder.description ? `<div class="folder-card-desc">${folder.description}</div>` : ''}
            <div class="folder-card-files-count">
                ${folder.files.length} ${folder.files.length === 1 ? 'ملف' : 'ملفات'}
            </div>
        </div>
    `).join('');
}

// توسيع/طي فئة الأرشيف
function toggleArchiveCategory(categoryId) {
    const categoryCard = document.querySelector(`.archive-category-card[data-category-id="${categoryId}"]`);
    if (categoryCard) {
        categoryCard.classList.toggle('collapsed');
    }
}

// ربط الأحداث
function initializeArchiveEventListeners() {
    // إضافة فئة أرشيف
    const addArchiveCategoryBtn = document.getElementById('addArchiveCategoryBtn');
    if (addArchiveCategoryBtn) {
        addArchiveCategoryBtn.addEventListener('click', openAddArchiveCategoryModal);
    }
    
    // مودال إضافة فئة أرشيف
    const closeAddArchiveCategoryModal = document.getElementById('closeAddArchiveCategoryModal');
    if (closeAddArchiveCategoryModal) {
        closeAddArchiveCategoryModal.addEventListener('click', () => {
            document.getElementById('addArchiveCategoryModal').classList.remove('active');
        });
    }
    
    const cancelAddArchiveCategory = document.getElementById('cancelAddArchiveCategory');
    if (cancelAddArchiveCategory) {
        cancelAddArchiveCategory.addEventListener('click', () => {
            document.getElementById('addArchiveCategoryModal').classList.remove('active');
        });
    }
    
    const saveArchiveCategoryBtn = document.getElementById('saveArchiveCategoryBtn');
    if (saveArchiveCategoryBtn) {
        saveArchiveCategoryBtn.addEventListener('click', handleAddArchiveCategory);
    }
    
    // مودال إضافة مجلد
    const closeAddFolderModal = document.getElementById('closeAddFolderModal');
    if (closeAddFolderModal) {
        closeAddFolderModal.addEventListener('click', () => {
            document.getElementById('addFolderModal').classList.remove('active');
        });
    }
    
    const cancelAddFolder = document.getElementById('cancelAddFolder');
    if (cancelAddFolder) {
        cancelAddFolder.addEventListener('click', () => {
            document.getElementById('addFolderModal').classList.remove('active');
        });
    }
    
    const saveFolderBtn = document.getElementById('saveFolderBtn');
    if (saveFolderBtn) {
        saveFolderBtn.addEventListener('click', handleAddFolder);
    }
    
    // مودال عرض المجلد
    const closeFolderViewModal = document.getElementById('closeFolderViewModal');
    if (closeFolderViewModal) {
        closeFolderViewModal.addEventListener('click', closeFolderView);
    }
    
    // أزرار إدارة المجلد
    setupFolderManagementButtons();
    
    // مودال إضافة ملفات
    setupAddFilesModal();
}

// فتح مودال إضافة فئة أرشيف
function openAddArchiveCategoryModal() {
    const modal = document.getElementById('addArchiveCategoryModal');
    const input = document.getElementById('archiveCategoryName');
    
    if (modal && input) {
        input.value = '';
        modal.classList.add('active');
        input.focus();
    }
}

// معالجة إضافة فئة أرشيف
async function handleAddArchiveCategory() {
    const nameInput = document.getElementById('archiveCategoryName');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('الرجاء إدخال اسم الفئة');
        return;
    }
    
    // إنشاء فئة جديدة
    const newCategory = {
        id: Date.now(),
        name: name,
        folders: []
    };
    
    archiveState.archiveCategories.push(newCategory);
    await saveArchiveData();
    
    // إغلاق المودال وتحديث العرض
    document.getElementById('addArchiveCategoryModal').classList.remove('active');
    renderArchiveCategories();
}

// فتح مودال إضافة مجلد
function openAddFolderModal(categoryId) {
    const modal = document.getElementById('addFolderModal');
    const categorySelect = document.getElementById('folderCategorySelect');
    const nameInput = document.getElementById('folderName');
    const descInput = document.getElementById('folderDescription');
    
    if (!modal || !categorySelect) return;
    
    // ملء قائمة الفئات
    categorySelect.innerHTML = archiveState.archiveCategories.map(cat => `
        <option value="${cat.id}" ${cat.id === categoryId ? 'selected' : ''}>
            ${cat.name}
        </option>
    `).join('');
    
    // تخزين معرف الفئة المختارة
    modal.dataset.categoryId = categoryId;
    
    // تفريغ الحقول
    nameInput.value = '';
    descInput.value = '';
    
    modal.classList.add('active');
    nameInput.focus();
}

// معالجة إضافة مجلد
async function handleAddFolder() {
    const nameInput = document.getElementById('folderName');
    const descInput = document.getElementById('folderDescription');
    const categorySelect = document.getElementById('folderCategorySelect');
    
    const name = nameInput.value.trim();
    const description = descInput.value.trim();
    const categoryId = parseInt(categorySelect.value);
    
    if (!name) {
        alert('الرجاء إدخال اسم المجلد');
        return;
    }
    
    // إيجاد الفئة
    const category = archiveState.archiveCategories.find(cat => cat.id === categoryId);
    if (!category) {
        alert('الفئة غير موجودة');
        return;
    }
    
    // إنشاء مجلد جديد
    const newFolder = {
        id: Date.now(),
        name: name,
        description: description,
        categoryId: categoryId,
        files: []
    };
    
    category.folders.push(newFolder);
    await saveArchiveData();
    
    // إغلاق المودال وتحديث العرض
    document.getElementById('addFolderModal').classList.remove('active');
    renderArchiveCategories();
}

// فتح عرض المجلد
function openFolderView(folderId) {
    const folder = findFolderById(folderId);
    if (!folder) {
        alert('المجلد غير موجود');
        return;
    }
    
    const category = archiveState.archiveCategories.find(cat => cat.id === folder.categoryId);
    if (!category) {
        alert('الفئة غير موجودة');
        return;
    }
    
    archiveState.currentFolder = folder;
    
    const modal = document.getElementById('folderViewModal');
    if (!modal) return;
    
    // تحديث عنوان المودال
    document.getElementById('folderViewTitle').textContent = folder.name;
    document.getElementById('folderCategoryName').textContent = category.name;
    document.getElementById('folderDescriptionText').textContent = folder.description || 'لا يوجد وصف';
    
    // عرض الملفات
    renderFolderFiles(folder);
    
    modal.classList.add('active');
}

// إغلاق عرض المجلد
function closeFolderView() {
    const modal = document.getElementById('folderViewModal');
    if (modal) {
        modal.classList.remove('active');
        archiveState.currentFolder = null;
    }
}

// عرض ملفات المجلد
function renderFolderFiles(folder) {
    const filesGrid = document.getElementById('folderFilesGrid');
    const emptyState = document.getElementById('folderFilesEmpty');
    
    if (!filesGrid || !emptyState) return;
    
    if (folder.files.length === 0) {
        filesGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    filesGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    filesGrid.innerHTML = folder.files.map(file => `
        <div class="folder-file-card">
            <div class="folder-file-icon">
                <svg class="svg-icon-lg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                </svg>
            </div>
            <div class="folder-file-name">${file.name}</div>
        </div>
    `).join('');
}

// إيجاد مجلد بواسطة المعرف
function findFolderById(folderId) {
    for (const category of archiveState.archiveCategories) {
        const folder = category.folders.find(f => f.id === folderId);
        if (folder) return folder;
    }
    return null;
}

// إعداد أزرار إدارة المجلد
function setupFolderManagementButtons() {
    // تعديل اسم المجلد
    const editFolderNameBtn = document.getElementById('editFolderNameBtn');
    if (editFolderNameBtn) {
        editFolderNameBtn.addEventListener('click', openEditFolderNameModal);
    }
    
    const closeEditFolderNameModal = document.getElementById('closeEditFolderNameModal');
    if (closeEditFolderNameModal) {
        closeEditFolderNameModal.addEventListener('click', () => {
            document.getElementById('editFolderNameModal').classList.remove('active');
        });
    }
    
    const cancelEditFolderName = document.getElementById('cancelEditFolderName');
    if (cancelEditFolderName) {
        cancelEditFolderName.addEventListener('click', () => {
            document.getElementById('editFolderNameModal').classList.remove('active');
        });
    }
    
    const saveEditFolderNameBtn = document.getElementById('saveEditFolderNameBtn');
    if (saveEditFolderNameBtn) {
        saveEditFolderNameBtn.addEventListener('click', handleEditFolderName);
    }
    
    // تعديل وصف المجلد
    const editFolderDescBtn = document.getElementById('editFolderDescBtn');
    if (editFolderDescBtn) {
        editFolderDescBtn.addEventListener('click', openEditFolderDescModal);
    }
    
    const closeEditFolderDescModal = document.getElementById('closeEditFolderDescModal');
    if (closeEditFolderDescModal) {
        closeEditFolderDescModal.addEventListener('click', () => {
            document.getElementById('editFolderDescModal').classList.remove('active');
        });
    }
    
    const cancelEditFolderDesc = document.getElementById('cancelEditFolderDesc');
    if (cancelEditFolderDesc) {
        cancelEditFolderDesc.addEventListener('click', () => {
            document.getElementById('editFolderDescModal').classList.remove('active');
        });
    }
    
    const saveEditFolderDescBtn = document.getElementById('saveEditFolderDescBtn');
    if (saveEditFolderDescBtn) {
        saveEditFolderDescBtn.addEventListener('click', handleEditFolderDesc);
    }
    
    // نقل المجلد
    const moveFolderBtn = document.getElementById('moveFolderBtn');
    if (moveFolderBtn) {
        moveFolderBtn.addEventListener('click', openMoveFolderModal);
    }
    
    const closeMoveFolderModal = document.getElementById('closeMoveFolderModal');
    if (closeMoveFolderModal) {
        closeMoveFolderModal.addEventListener('click', () => {
            document.getElementById('moveFolderModal').classList.remove('active');
        });
    }
    
    const cancelMoveFolder = document.getElementById('cancelMoveFolder');
    if (cancelMoveFolder) {
        cancelMoveFolder.addEventListener('click', () => {
            document.getElementById('moveFolderModal').classList.remove('active');
        });
    }
    
    const saveMoveFolderBtn = document.getElementById('saveMoveFolderBtn');
    if (saveMoveFolderBtn) {
        saveMoveFolderBtn.addEventListener('click', handleMoveFolder);
    }
    
    // حذف المجلد
    const deleteFolderBtn = document.getElementById('deleteFolderBtn');
    if (deleteFolderBtn) {
        deleteFolderBtn.addEventListener('click', openDeleteFolderModal);
    }
    
    const closeDeleteFolderModal = document.getElementById('closeDeleteFolderModal');
    if (closeDeleteFolderModal) {
        closeDeleteFolderModal.addEventListener('click', () => {
            document.getElementById('deleteFolderModal').classList.remove('active');
        });
    }
    
    const cancelDeleteFolder = document.getElementById('cancelDeleteFolder');
    if (cancelDeleteFolder) {
        cancelDeleteFolder.addEventListener('click', () => {
            document.getElementById('deleteFolderModal').classList.remove('active');
        });
    }
    
    const confirmDeleteFolder = document.getElementById('confirmDeleteFolder');
    if (confirmDeleteFolder) {
        confirmDeleteFolder.addEventListener('click', handleDeleteFolder);
    }
}

// فتح مودال تعديل اسم المجلد
function openEditFolderNameModal() {
    if (!archiveState.currentFolder) return;
    
    const modal = document.getElementById('editFolderNameModal');
    const input = document.getElementById('editFolderNameInput');
    
    if (modal && input) {
        input.value = archiveState.currentFolder.name;
        modal.classList.add('active');
        input.focus();
    }
}

// معالجة تعديل اسم المجلد
async function handleEditFolderName() {
    if (!archiveState.currentFolder) return;
    
    const input = document.getElementById('editFolderNameInput');
    const newName = input.value.trim();
    
    if (!newName) {
        alert('الرجاء إدخال اسم المجلد');
        return;
    }
    
    archiveState.currentFolder.name = newName;
    await saveArchiveData();
    
    // تحديث العرض
    document.getElementById('folderViewTitle').textContent = newName;
    document.getElementById('editFolderNameModal').classList.remove('active');
    renderArchiveCategories();
}

// فتح مودال تعديل وصف المجلد
function openEditFolderDescModal() {
    if (!archiveState.currentFolder) return;
    
    const modal = document.getElementById('editFolderDescModal');
    const input = document.getElementById('editFolderDescInput');
    
    if (modal && input) {
        input.value = archiveState.currentFolder.description || '';
        modal.classList.add('active');
        input.focus();
    }
}

// معالجة تعديل وصف المجلد
async function handleEditFolderDesc() {
    if (!archiveState.currentFolder) return;
    
    const input = document.getElementById('editFolderDescInput');
    const newDesc = input.value.trim();
    
    archiveState.currentFolder.description = newDesc;
    await saveArchiveData();
    
    // تحديث العرض
    document.getElementById('folderDescriptionText').textContent = newDesc || 'لا يوجد وصف';
    document.getElementById('editFolderDescModal').classList.remove('active');
    renderArchiveCategories();
}

// فتح مودال نقل المجلد
function openMoveFolderModal() {
    if (!archiveState.currentFolder) return;
    
    const currentCategory = archiveState.archiveCategories.find(cat => 
        cat.id === archiveState.currentFolder.categoryId
    );
    
    if (!currentCategory) return;
    
    const modal = document.getElementById('moveFolderModal');
    const currentCategoryInput = document.getElementById('currentFolderCategory');
    const categorySelect = document.getElementById('moveFolderCategorySelect');
    
    if (!modal || !currentCategoryInput || !categorySelect) return;
    
    // عرض الفئة الحالية
    currentCategoryInput.value = currentCategory.name;
    
    // ملء قائمة الفئات المتاحة (باستثناء الفئة الحالية)
    categorySelect.innerHTML = archiveState.archiveCategories
        .filter(cat => cat.id !== currentCategory.id)
        .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
        .join('');
    
    modal.classList.add('active');
}

// معالجة نقل المجلد
async function handleMoveFolder() {
    if (!archiveState.currentFolder) return;
    
    const categorySelect = document.getElementById('moveFolderCategorySelect');
    const newCategoryId = parseInt(categorySelect.value);
    
    // إيجاد الفئة القديمة
    const oldCategory = archiveState.archiveCategories.find(cat => 
        cat.id === archiveState.currentFolder.categoryId
    );
    
    // إيجاد الفئة الجديدة
    const newCategory = archiveState.archiveCategories.find(cat => cat.id === newCategoryId);
    
    if (!oldCategory || !newCategory) {
        alert('حدث خطأ في نقل المجلد');
        return;
    }
    
    // إزالة المجلد من الفئة القديمة
    const folderIndex = oldCategory.folders.findIndex(f => f.id === archiveState.currentFolder.id);
    if (folderIndex !== -1) {
        oldCategory.folders.splice(folderIndex, 1);
    }
    
    // إضافة المجلد للفئة الجديدة
    archiveState.currentFolder.categoryId = newCategoryId;
    newCategory.folders.push(archiveState.currentFolder);
    
    await saveArchiveData();
    
    // تحديث العرض
    document.getElementById('folderCategoryName').textContent = newCategory.name;
    document.getElementById('moveFolderModal').classList.remove('active');
    renderArchiveCategories();
}

// فتح مودال حذف المجلد
function openDeleteFolderModal() {
    if (!archiveState.currentFolder) return;
    
    const modal = document.getElementById('deleteFolderModal');
    const nameText = document.getElementById('deleteFolderNameText');
    
    if (modal && nameText) {
        nameText.textContent = archiveState.currentFolder.name;
        modal.classList.add('active');
    }
}

// معالجة حذف المجلد
async function handleDeleteFolder() {
    if (!archiveState.currentFolder) return;
    
    const category = archiveState.archiveCategories.find(cat => 
        cat.id === archiveState.currentFolder.categoryId
    );
    
    if (!category) {
        alert('الفئة غير موجودة');
        return;
    }
    
    // حذف المجلد
    const folderIndex = category.folders.findIndex(f => f.id === archiveState.currentFolder.id);
    if (folderIndex !== -1) {
        category.folders.splice(folderIndex, 1);
    }
    
    await saveArchiveData();
    
    // إغلاق النوافذ وتحديث العرض
    document.getElementById('deleteFolderModal').classList.remove('active');
    document.getElementById('folderViewModal').classList.remove('active');
    archiveState.currentFolder = null;
    renderArchiveCategories();
}

// إعداد مودال إضافة ملفات
function setupAddFilesModal() {
    const addFilesToFolderBtn = document.getElementById('addFilesToFolderBtn');
    if (addFilesToFolderBtn) {
        addFilesToFolderBtn.addEventListener('click', openAddFilesToFolderModal);
    }
    
    const closeAddFilesToFolderModal = document.getElementById('closeAddFilesToFolderModal');
    if (closeAddFilesToFolderModal) {
        closeAddFilesToFolderModal.addEventListener('click', () => {
            document.getElementById('addFilesToFolderModal').classList.remove('active');
        });
    }
    
    const cancelAddFilesToFolder = document.getElementById('cancelAddFilesToFolder');
    if (cancelAddFilesToFolder) {
        cancelAddFilesToFolder.addEventListener('click', () => {
            document.getElementById('addFilesToFolderModal').classList.remove('active');
        });
    }
    
    const confirmAddFilesToFolder = document.getElementById('confirmAddFilesToFolder');
    if (confirmAddFilesToFolder) {
        confirmAddFilesToFolder.addEventListener('click', handleAddFilesToFolder);
    }
    
    // منطقة رفع الملفات
    const uploadArea = document.getElementById('folderFileUploadArea');
    const fileInput = document.getElementById('folderFilesInput');
    
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFilesSelection);
        
        // Drag & Drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#3b82f6';
            uploadArea.style.background = '#f8f9fb';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#cbd5e1';
            uploadArea.style.background = 'transparent';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#cbd5e1';
            uploadArea.style.background = 'transparent';
            
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                handleFilesSelection();
            }
        });
    }
}

// فتح مودال إضافة ملفات
function openAddFilesToFolderModal() {
    if (!archiveState.currentFolder) return;
    
    const modal = document.getElementById('addFilesToFolderModal');
    const fileInput = document.getElementById('folderFilesInput');
    const preview = document.getElementById('selectedFilesPreview');
    const confirmBtn = document.getElementById('confirmAddFilesToFolder');
    
    if (!modal) return;
    
    // إعادة تعيين
    if (fileInput) fileInput.value = '';
    if (preview) preview.style.display = 'none';
    if (confirmBtn) confirmBtn.disabled = true;
    
    modal.classList.add('active');
}

// معالجة اختيار الملفات
function handleFilesSelection() {
    const fileInput = document.getElementById('folderFilesInput');
    const preview = document.getElementById('selectedFilesPreview');
    const filesList = document.getElementById('selectedFilesList');
    const confirmBtn = document.getElementById('confirmAddFilesToFolder');
    
    if (!fileInput || !fileInput.files.length) return;
    
    const files = Array.from(fileInput.files);
    
    // عرض الملفات المختارة
    filesList.innerHTML = files.map((file, index) => `
        <div class="selected-file-item">
            <div class="selected-file-info">
                <svg class="svg-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"/>
                </svg>
                <span class="selected-file-name">${file.name}</span>
            </div>
            <span class="selected-file-size">${formatFileSize(file.size)}</span>
        </div>
    `).join('');
    
    preview.style.display = 'block';
    confirmBtn.disabled = false;
}

// تنسيق حجم الملف
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// معالجة إضافة الملفات للمجلد
async function handleAddFilesToFolder() {
    if (!archiveState.currentFolder) return;
    
    const fileInput = document.getElementById('folderFilesInput');
    if (!fileInput || !fileInput.files.length) return;
    
    const files = Array.from(fileInput.files);
    
    // إضافة الملفات للمجلد (تجريبياً - فقط الأسماء)
    files.forEach(file => {
        archiveState.currentFolder.files.push({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            addedAt: new Date().toISOString()
        });
    });
    
    await saveArchiveData();
    
    // تحديث العرض
    renderFolderFiles(archiveState.currentFolder);
    document.getElementById('addFilesToFolderModal').classList.remove('active');
    renderArchiveCategories();
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تأخير بسيط للتأكد من تحميل appState
    setTimeout(() => {
        initializeArchiveFolders();
    }, 500);
});
