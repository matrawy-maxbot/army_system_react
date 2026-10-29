/**
 * index.js
 * نقطة تصدير مركزية لجميع الخدمات
 */

export * from './electronAPI.js';
export * from './fileService.js';
export * from './thumbnailService.js';
export * from './printService.js';
export * from './dateService.js';
export * from './storageService.js';

// التصدير الافتراضي
export { default as electronAPI } from './electronAPI.js';
export { default as fileService } from './fileService.js';
export { default as thumbnailService } from './thumbnailService.js';
export { default as printService } from './printService.js';
export { default as dateService } from './dateService.js';
export { default as storageService } from './storageService.js';

// Re-export electronAPI specifically for imports like: import { electronAPI } from './services'
export { electronAPI as electronAPIWrapper } from './electronAPI.js';
