import React from 'react';
import './WelcomePage.css';
import developerAvatar from '../assets/avatars/developer.webp';
import bossAvatar from '../assets/avatars/boss.webp';
import user1Avatar from '../assets/avatars/user_1.webp';
import user2Avatar from '../assets/avatars/user_2.webp';
import user3Avatar from '../assets/avatars/user_3.webp';
import user4Avatar from '../assets/avatars/user_4.webp';

const WelcomePage = ({ onBackClick, onNavigateToTutorial }) => {

    return (
        <div className="welcome-page">

            <section className="welcome-hero">
                <div className="orbit o1"></div>
                <div className="orbit o2"></div>
                <div className="orbit o3"></div>
                
                <div className="float-icon fi1">✉️</div>
                <div className="float-icon fi2">📁</div>
                <div className="float-icon fi3">📄</div>
                <div className="float-icon fi4">✦</div>
                <div className="float-icon fi5">🔔</div>
                <div className="float-icon fi6">🗃️</div>
                
                <div className="hero-copy">
                    <div className="hero-rating">
                        ✦ <b>نظام متكامل</b>　·　<span style={{color:'#22ae87'}}>●</span> إدارة احترافية للفاكسات
                    </div>
                    <h1>مرحباً بك في نظام<br/><span>إدارة الفاكسات الذكي</span></h1>
                    <p className="hero-subtitle">
                        كل تجربة ناجحة تبدأ بأدوات منظمة وفعّالة.<br/>
                        اكتشف نظاماً متكاملاً لإدارة الفاكسات والردود والمتابعة.
                    </p>
                    <div className="hero-actions">
                        <button className="hero-btn" onClick={onBackClick}>ابدأ الآن</button>
                        <button className="hero-btn alt" onClick={onNavigateToTutorial}>مركز المساعدة ↘</button>
                    </div>
                </div>
                
                <div className="toast-stack">
                    <div className="welcome-toast">
                        <div className="toast-avatar">
                            <img src={developerAvatar} alt="محمد كريم رياض" />
                        </div>
                        <div className="toast-copy">
                            <b>الجندي / محمد سعيد الخضري</b>
                            <small>مهندس برمجيات , مؤسس ومطور البرنامج</small>
                        </div>
                        <span className="toast-check">✦</span>
                    </div>
                    <div className="welcome-toast">
                        <div className="toast-avatar">
                            <img src={bossAvatar} alt="فريد معاذ" />
                        </div>
                        <div className="toast-copy">
                            <b>عقيد أ ح / عصام عبدالبديع صالح</b>
                            <small><span style={{fontWeight:600}}>تحت اشراف</span> رئيس أركان اللواء 288 مد وسط</small>
                        </div>
                        <span className="toast-check">✓</span>
                    </div>
                </div>
                
                {/* المستخدمون على الجوانب */}
                <div className="side-users">
                    <div className="side-user user-left-1">
                        <div className="toast-avatar">
                            <img src={user1Avatar} alt="فادي فوزي" />
                        </div>
                        <div className="toast-copy">
                            <b>مصطفى</b>
                            <small>المستخدم الاول</small>
                        </div>
                    </div>
                    <div className="side-user user-left-2">
                        <div className="toast-avatar">
                            <img src={user2Avatar} alt="احمد فوزي" />
                        </div>
                        <div className="toast-copy">
                            <b>عبدالله</b>
                            <small>المستخدم الثاني</small>
                        </div>
                    </div>
                    <div className="side-user user-right-1">
                        <div className="toast-avatar">
                            <img src={user3Avatar} alt="سامي احمد" />
                        </div>
                        <div className="toast-copy">
                            <b>ناير</b>
                            <small>المستخدم الثالث</small>
                        </div>
                    </div>
                    <div className="side-user user-right-2">
                        <div className="toast-avatar">
                            <img src={user4Avatar} alt="محمود اسلام" />
                        </div>
                        <div className="toast-copy">
                            <b>دانيال</b>
                            <small>المستخدم الرابع</small>
                        </div>
                    </div>
                </div>
            </section>
            
        </div>
    );
};

export default WelcomePage;
