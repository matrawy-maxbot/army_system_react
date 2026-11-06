/**
 * index.js
 * نقطة تصدير مركزية لجميع الخدمات
 */

// إعادة تصدير جميع التصديرات المُسماة
export * from './fileService.js';
export * from './thumbnailService.js';
export * from './printService.js';
export * from './dateService.js';
export * from './storageService.js';

// إعادة تصدير electronAPI بشكل صريح
export { 
  electronAPI,
  dataAPI,
  fileAPI,
  settingsAPI,
  printAPI,
  windowAPI,
  getEnvironment,
  showEnvironmentInfo
} from './electronAPI.js';

// التصدير الافتراضي
export { default as fileService } from './fileService.js';
export { default as thumbnailService } from './thumbnailService.js';
export { default as printService } from './printService.js';
export { default as dateService } from './dateService.js';
export { default as storageService } from './storageService.js';
