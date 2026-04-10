const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderText = document.getElementById('loaderText');

const messages = ['Загрузка...', 'Подготовка ножей...', 'Почти готово...'];
let progress = 0;
let msgIndex = 0;
let done = false;

const interval = setInterval(() => {
    if (done) return;
    progress += Math.random() * 18 + 5;
    if (progress > 90) progress = 90;
    loaderBar.style.width = progress + '%';
    if (progress > 40 && msgIndex === 0) { msgIndex = 1; loaderText.textContent = messages[1]; }
    if (progress > 75 && msgIndex === 1) { msgIndex = 2; loaderText.textContent = messages[2]; }
}, 120);

window.addEventListener('load', () => {
    done = true;
    clearInterval(interval);
    loaderBar.style.width = '100%';
    setTimeout(() => loader.classList.add('hidden'), 500);
});

const supportOverlay = document.getElementById('supportOverlay');

document.getElementById('openSupport').addEventListener('click', (e) => {
    e.preventDefault();
    supportOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
});

function closeSupportModal() {
    supportOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('supportClose').addEventListener('click', closeSupportModal);
supportOverlay.addEventListener('click', (e) => { if (e.target === supportOverlay) closeSupportModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSupportModal(); });

const overlay = document.getElementById('reviewOverlay');
const modalForm = document.getElementById('modalForm');
const modalSuccess = document.getElementById('modalSuccess');
const modalSubmit = document.getElementById('modalSubmit');
const stars = document.querySelectorAll('.star');
const contactCheckbox = document.getElementById('contactCheckbox');
const contactFieldWrap = document.getElementById('contactFieldWrap');
let selectedRating = 0;

document.getElementById('openReview').addEventListener('click', (e) => {
    e.preventDefault();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
});

function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

function updateStars(hoverIndex, isHover) {
    const index = isHover ? hoverIndex : selectedRating;
    stars.forEach(s => {
        const i = +s.dataset.i;
        s.classList.remove('active', 'dimmed');
        if (i === index) {
            s.classList.add('active');
        } else if (i < index) {
            s.classList.add('dimmed');
        }
    });
}

stars.forEach(star => {
    star.addEventListener('mouseenter', () => updateStars(+star.dataset.i, true));
    star.addEventListener('mouseleave', () => updateStars(selectedRating, false));
    star.addEventListener('click', () => {
        selectedRating = +star.dataset.i;
        updateStars(selectedRating, false);
    });
});

const contactToggle = document.getElementById('contactToggle');
const checkboxBox = document.getElementById('checkboxBox');

contactToggle.addEventListener('click', () => {
    const isChecked = contactCheckbox.checked;
    contactCheckbox.checked = !isChecked;
    checkboxBox.classList.toggle('checked', !isChecked);
    contactFieldWrap.classList.toggle('visible', !isChecked);
});

function shakeInput(el) {
    el.classList.remove('input-shake');
    el.offsetHeight;
    el.classList.add('input-shake');
    el.addEventListener('animationend', () => el.classList.remove('input-shake'), { once: true });
}

function setupField(inputEl, counterId, maxLen) {
    const counter = document.getElementById(counterId);

    let prevValue = '';

    function update() {
        const len = inputEl.value.length;
        counter.textContent = len + ' / ' + maxLen;
        const atLimit = len >= maxLen;
        counter.classList.toggle('at-limit', atLimit);
        inputEl.classList.toggle('at-limit', atLimit);
    }

    function resizeTextarea() {
        if (inputEl.tagName === 'TEXTAREA') {
            inputEl.style.height = 'auto';
            inputEl.style.height = inputEl.scrollHeight + 'px';
        }
    }

    function clampValue(triggerShake) {
        if (inputEl.value.length > maxLen) {
            const cursorPos = inputEl.selectionStart;
            inputEl.value = inputEl.value.slice(0, maxLen);
            const newCursor = Math.min(cursorPos, maxLen);
            inputEl.selectionStart = inputEl.selectionEnd = newCursor;
            if (triggerShake) shakeInput(inputEl);
        }
        prevValue = inputEl.value;
    }

    inputEl.addEventListener('input', () => {
        clampValue(true);
        resizeTextarea();
        update();
    });

    inputEl.addEventListener('keydown', (e) => {
        const isControl = e.ctrlKey || e.metaKey || e.altKey;
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab'];

        if (allowedKeys.includes(e.key) || isControl || e.key.length !== 1) return;

        const start = inputEl.selectionStart;
        const end = inputEl.selectionEnd;
        const hasSelection = start !== end;
        const len = inputEl.value.length - (hasSelection ? end - start : 0);

        if (len >= maxLen) {
            e.preventDefault();
            shakeInput(inputEl);
        }
    });

    inputEl.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        const start = inputEl.selectionStart;
        const end = inputEl.selectionEnd;
        const selectedLen = end - start;
        const currentLen = inputEl.value.length - selectedLen;
        const remaining = maxLen - currentLen;

        if (remaining <= 0) {
            shakeInput(inputEl);
            return;
        }

        const allowed = text.slice(0, remaining);
        inputEl.value = inputEl.value.slice(0, start) + allowed + inputEl.value.slice(end);
        inputEl.selectionStart = inputEl.selectionEnd = start + allowed.length;

        resizeTextarea();
        update();

        if (inputEl.value.length >= maxLen) shakeInput(inputEl);
    });
}

setupField(document.getElementById('reviewName'), 'nameCounter', 25);
setupField(document.getElementById('reviewText'), 'textCounter', 250);
setupField(document.getElementById('reviewContact'), 'contactCounter', 25);

modalSubmit.addEventListener('click', () => {
    const name = document.getElementById('reviewName').value.trim();
    const text = document.getElementById('reviewText').value.trim();

    if (!name || !text || selectedRating === 0) {
        modalSubmit.style.animation = 'none';
        modalSubmit.offsetHeight;
        modalSubmit.style.animation = 'shake 0.3s ease';
        return;
    }

    modalSubmit.disabled = true;
    modalSubmit.textContent = i18n[currentLang].sendingBtn;

    setTimeout(() => {
        modalForm.classList.add('hide');
        modalSuccess.classList.add('show');
        setTimeout(() => {
            closeModal();
            setTimeout(() => {
                modalForm.classList.remove('hide');
                modalSuccess.classList.remove('show');
                modalSubmit.disabled = false;
                modalSubmit.textContent = i18n[currentLang].submitBtn;

                const nameEl = document.getElementById('reviewName');
                const textEl = document.getElementById('reviewText');
                const contactEl = document.getElementById('reviewContact');

                nameEl.value = '';
                textEl.value = '';
                contactEl.value = '';
                textEl.style.height = 'auto';

                ['nameCounter', 'textCounter', 'contactCounter'].forEach(id => {
                    const el = document.getElementById(id);
                    el.textContent = id === 'textCounter' ? '0 / 250' : '0 / 25';
                    el.classList.remove('at-limit');
                });

                [nameEl, textEl, contactEl].forEach(el => el.classList.remove('at-limit'));

                contactCheckbox.checked = false;
                checkboxBox.classList.remove('checked');
                contactFieldWrap.classList.remove('visible');
                selectedRating = 0;
                stars.forEach(s => s.classList.remove('active', 'dimmed'));
            }, 400);
        }, 2000);
    }, 900);
});

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
animatedElements.forEach(el => observer.observe(el));

window.addEventListener('pagehide', () => {
    const nameEl = document.getElementById('reviewName');
    const textEl = document.getElementById('reviewText');
    const contactEl = document.getElementById('reviewContact');

    nameEl.value = '';
    textEl.value = '';
    contactEl.value = '';
    textEl.style.height = 'auto';

    ['nameCounter', 'textCounter', 'contactCounter'].forEach(id => {
        const el = document.getElementById(id);
        el.textContent = id === 'textCounter' ? '0 / 250' : '0 / 25';
        el.classList.remove('at-limit');
    });

    [nameEl, textEl, contactEl].forEach(el => el.classList.remove('at-limit'));

    contactCheckbox.checked = false;
    checkboxBox.classList.remove('checked');
    contactFieldWrap.classList.remove('visible');
    selectedRating = 0;
    stars.forEach(s => s.classList.remove('active', 'dimmed'));

    overlay.classList.remove('open');
    document.body.style.overflow = '';
});

const heroPlayBtn = document.getElementById('heroPlayBtn');
        const heroKnife = document.getElementById('heroKnife');
        const heroWrap = heroPlayBtn.closest('.btn-knife-wrap');
        let stabbed = false;

        heroWrap.addEventListener('mouseenter', () => {
            heroKnife.classList.add('show');
        });

        heroWrap.addEventListener('mouseleave', () => {
            if (stabbed) return;
            heroKnife.classList.remove('show');
        });

        heroPlayBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (stabbed) { window.open(this.href, '_blank'); return; }
            stabbed = true;
            const href = this.href;

            heroPlayBtn.classList.add('stabbed');

            heroKnife.classList.add('show');
            heroKnife.classList.remove('stab');
            void heroKnife.offsetWidth;
            heroKnife.classList.add('stab');

            heroPlayBtn.classList.remove('shake');
            void heroPlayBtn.offsetWidth;
            heroPlayBtn.classList.add('shake');
            heroPlayBtn.addEventListener('animationend', () => heroPlayBtn.classList.remove('shake'), { once: true });

            setTimeout(() => window.open(href, '_blank'), 500);
        });