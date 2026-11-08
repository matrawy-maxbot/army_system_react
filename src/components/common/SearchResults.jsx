/**
 * SearchResults Component
 * عرض نتائج البحث بتصميم محاكي للمستندات
 */

import React, { useState } from 'react';
import './SearchResults.css';

const SearchResults = ({ query, onClose }) => {
    // نتائج بحث افتراضية مع تفاصيل أكثر
    const mockResults = [
        {
            id: 1,
            type: 'pdf',
            title: 'فاكس من وزارة الدفاع',
            date: '2026-11-05',
            pages: 4,
            excerpt: 'بخصوص التدريبات السنوية والاستعدادات الخاصة بالوحدات',
            paperHeader: 'وزارة الدفاع — الإدارة المختصة',
            paperTitle: 'بيان بشأن خطة التدريب',
            hitText: '... بشأن التدريبات السنوية والاستعدادات الخاصة بالوحدات خلال العام الحالي ...',
            searchTerms: 'التدريبات السنوية والاستعدادات فاكس وزارة الدفاع',
            previewImage: null // يمكن وضع مسار الصورة هنا
        },
        {
            id: 2,
            type: 'docx',
            title: 'رد على فاكس القيادة العامة',
            date: '2026-11-03',
            pages: 2,
            excerpt: 'نرجو موافاتنا بجدول التدريبات السنوية بعد اعتماده',
            paperHeader: 'القيادة العامة',
            paperTitle: 'رد على المكاتبة الواردة',
            hitText: '... نرجو موافاتنا بجدول التدريبات السنوية بعد اعتماده من الجهة المختصة ...',
            searchTerms: 'التدريبات السنوية رد فاكس القيادة العامة',
            previewImage: null
        },
        {
            id: 3,
            type: 'xlsx',
            title: 'تقرير التدريب الشهري',
            date: '2026-10-28',
            pages: 8,
            excerpt: 'ملخص تنفيذ التدريبات السنوية ونسب الإنجاز',
            paperHeader: 'الإدارة — تقارير المتابعة',
            paperTitle: 'تقرير التدريب الشهري',
            hitText: 'ملخص تنفيذ التدريبات السنوية ونسب الإنجاز خلال شهر أكتوبر',
            searchTerms: 'التدريبات السنوية تقرير التدريب الشهري',
            previewImage: null
        },
        {
            id: 4,
            type: 'pdf',
            title: 'فاكس طلب معدات',
            date: '2026-10-25',
            pages: 3,
            excerpt: 'لدعم تنفيذ التدريبات السنوية ورفع كفاءة التجهيزات',
            paperHeader: 'طلب احتياجات — الإدارة',
            paperTitle: 'طلب توفير معدات جديدة',
            hitText: '... لدعم تنفيذ التدريبات السنوية ورفع كفاءة التجهيزات ...',
            searchTerms: 'التدريبات السنوية طلب معدات فاكس',
            previewImage: null
        },
        {
            id: 5,
            type: 'docx',
            title: 'محضر اجتماع اللجنة',
            date: '2026-10-20',
            pages: 5,
            excerpt: 'مناقشة خطة التدريبات السنوية والجدول الزمني',
            paperHeader: 'اللجنة الإدارية',
            paperTitle: 'محضر اجتماع رقم 42',
            hitText: '... مناقشة خطة التدريبات السنوية والجدول الزمني للتنفيذ ...',
            searchTerms: 'التدريبات السنوية اجتماع اللجنة محضر',
            previewImage: null
        }
    ];

    const getTypeClass = (type) => {
        return type.toLowerCase();
    };

    const getTypeName = (type) => {
        return type.toUpperCase();
    };

    const highlightText = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, i) => 
            part.toLowerCase() === query.toLowerCase() 
                ? <mark key={i}>{part}</mark> 
                : part
        );
    };

    // فلترة النتائج بناءً على البحث (يمكن إضافتها لاحقاً)
    const filteredResults = mockResults;

    return (
        <div className="search-page">
            <header className="search-top">
                <div className="search-info">
                    <h1>نتائج البحث</h1>
                    <p>
                        <span className="search-query">"{query}"</span>
                        <span className="results-count">{filteredResults.length} نتيجة</span>
                    </p>
                </div>
                <button className="close-search-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    العودة للرئيسية
                </button>
            </header>

            <section className="search-grid">
                {filteredResults.map((result) => (
                    <article key={result.id} className="search-card">
                        <div className="card-preview">
                            <span className={`file-type ${getTypeClass(result.type)}`}>
                                {getTypeName(result.type)}
                            </span>
                            
                            {result.previewImage ? (
                                // عرض صورة الملف إذا كانت موجودة
                                <div className="preview-image-container">
                                    <img 
                                        src={result.previewImage} 
                                        alt={result.title}
                                        className="preview-image"
                                    />
                                </div>
                            ) : (
                                // عرض "no preview" إذا لم تكن هناك صورة
                                <div className="no-preview">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    <span>لا توجد معاينة</span>
                                </div>
                            )}
                        </div>
                        <div className="card-body">
                            <div className="name-row">
                                <div className="card-name">{result.title}</div>
                                <span className="card-pages">
                                    {result.pages > 2 ? `${result.pages} صفحات` : result.pages === 2 ? 'صفحتان' : 'صفحة واحدة'}
                                </span>
                            </div>
                            <div className="card-excerpt">
                                تم العثور على: «{highlightText(result.excerpt, query)}»
                            </div>
                            <div className="card-footer">
                                <span className="card-date">
                                    {new Date(result.date).toLocaleDateString('ar-EG', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                                <a href="#" className="card-open" onClick={(e) => e.preventDefault()}>
                                    فتح الملف ↗
                                </a>
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            {filteredResults.length === 0 && (
                <div className="search-empty">
                    لا توجد نتائج تحتوي على كلمة البحث.
                </div>
            )}
        </div>
    );
};

export default SearchResults;
