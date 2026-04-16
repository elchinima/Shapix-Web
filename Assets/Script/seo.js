const seoI18n = {
    ru: {
        seoTitle: 'Shapix | Игра — Бросок ножа',
        seoDesc: 'Shapix — минималистичная игра-бросок ножа для Android. Испытай рефлексы в точной механике, чистом дизайне и без лишнего. Early Access.',
        seoKeywords: 'Shapix, игра нож, бросок ножа, knife throw, Android игра, минималистичная игра, мобильная игра, knife game',
        seoOgTitle: 'Shapix | Игра — Бросок ножа',
        seoOgDesc: 'Минималистичная игра-бросок ножа для Android. Точная механика, чистый дизайн, Early Access.',
        seoOgLocale: 'ru_RU',
        seoLdDesc: 'Минималистичная игра-бросок ножа для Android с точной механикой и чистым дизайном.',
        htmlLang: 'ru'
    },
    en: {
        seoTitle: 'Shapix | Knife Throw Game for Android',
        seoDesc: 'Shapix — a minimalist knife-throwing game for Android. Test your reflexes with precise mechanics and clean design. Early Access.',
        seoKeywords: 'Shapix, knife game, knife throw, Android game, minimalist game, mobile game, knife throwing',
        seoOgTitle: 'Shapix | Knife Throw Game for Android',
        seoOgDesc: 'A minimalist knife-throwing game for Android. Precise mechanics, clean design, Early Access.',
        seoOgLocale: 'en_US',
        seoLdDesc: 'A minimalist knife-throwing game for Android with precise mechanics and clean design.',
        htmlLang: 'en'
    },
    az: {
        seoTitle: 'Shapix | Android üçün Bıçaq Atma Oyunu',
        seoDesc: 'Shapix — Android üçün minimalist bıçaq atma oyunu. Dəqiq mexanika və təmiz dizaynla reflekslərinizi sınayın. Erkən Giriş.',
        seoKeywords: 'Shapix, bıçaq oyunu, bıçaq atma, knife throw, Android oyunu, minimalist oyun, mobil oyun',
        seoOgTitle: 'Shapix | Android üçün Bıçaq Atma Oyunu',
        seoOgDesc: 'Android üçün minimalist bıçaq atma oyunu. Dəqiq mexanika, təmiz dizayn, Erkən Giriş.',
        seoOgLocale: 'az_AZ',
        seoLdDesc: 'Android üçün dəqiq mexanika və təmiz dizaynla minimalist bıçaq atma oyunu.',
        htmlLang: 'az'
    }
};

function setMetaContent(id, value) {
    const el = document.getElementById(id);
    if (el) el.setAttribute('content', value);
}

function applySeo(lang) {
    const t = seoI18n[lang] || seoI18n.ru;

    document.documentElement.lang = t.htmlLang;

    const titleEl = document.getElementById('metaTitle');
    if (titleEl) titleEl.textContent = t.seoTitle;
    document.title = t.seoTitle;

    setMetaContent('metaDesc', t.seoDesc);
    setMetaContent('metaKeywords', t.seoKeywords);
    setMetaContent('ogTitle', t.seoOgTitle);
    setMetaContent('ogDesc', t.seoOgDesc);
    setMetaContent('ogLocale', t.seoOgLocale);
    setMetaContent('twTitle', t.seoOgTitle);
    setMetaContent('twDesc', t.seoOgDesc);

    const ldJson = document.getElementById('ldJson');
    if (ldJson) {
        ldJson.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Shapix',
            operatingSystem: 'Android',
            applicationCategory: 'GameApplication',
            description: t.seoLdDesc,
            author: { '@type': 'Person', name: 'Elsim' },
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
        }, null, 2);
    }
}

document.addEventListener('shapix:lang-change', (event) => {
    const lang = event && event.detail && event.detail.lang ? event.detail.lang : 'ru';
    applySeo(lang);
});
