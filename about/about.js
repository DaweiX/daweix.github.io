document.title = 'LI Jiawei';
document.write("<div style='text-align:center'><span class='time'>Last update: " + document.lastModified + " (UTC+8)<span></div>");
document.addEventListener('DOMContentLoaded', function () {
    langEN = 'en';
    langZH = 'zh-CN';
    langKey = 'preferredLang';
    const cnIcon = this.querySelector('.icon-cn');
    const enIcon = this.querySelector('.icon-en');
    const plang = localStorage.getItem(langKey) || langEN;
    localStorage.setItem(langKey, plang);
    enIcon.style.display = plang === 'en' ? 'none' : 'inline-block';
    cnIcon.style.display = plang === 'en' ? 'inline-block' : 'none';
    var targetPath = window.location.pathname;
    if (plang !== 'en') {
        if (!window.location.pathname.includes('zh')) {
            targetPath = window.location.pathname + 'zh';
            window.location.href = targetPath;
            return;
        }
    }
    document.getElementById('lang-toggle-btn').addEventListener('click', function () {
        tog.call(this);
    });
    function tog() {
        var targetPath = window.location.pathname;
        if (window.location.pathname.includes('zh')) {
            targetPath = window.location.pathname.replace('zh', '')
        } else {
            targetPath = window.location.pathname + 'zh'
        }
        enIcon.style.display = enIcon.style.display === 'none' ? 'inline-block' : 'none';
        cnIcon.style.display = cnIcon.style.display === 'none' ? 'inline-block' : 'none';
        var tgtLang = localStorage.getItem(langKey) === langEN ? langZH : langEN;
        localStorage.setItem(langKey, tgtLang);
        window.location.href = targetPath;
    }
});