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

const supportOpenTriggers = ['openSupport', 'openSupportMobile'];

function openSupportModal(e) {
    e.preventDefault();
    closeAllModals(supportOverlay);
    supportOverlay.classList.add('open');
    syncBodyScrollLock();
}

supportOpenTriggers.forEach((id) => {
    const trigger = document.getElementById(id);
    if (trigger) trigger.addEventListener('click', openSupportModal);
});

function closeSupportModal() {
    supportOverlay.classList.remove('open');
    syncBodyScrollLock();
}

document.getElementById('supportClose').addEventListener('click', closeSupportModal);
supportOverlay.addEventListener('click', (e) => { if (e.target === supportOverlay) closeSupportModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSupportModal(); });

const registerOverlay = document.getElementById('registerOverlay');
const registerForm = document.getElementById('registerForm');
const registerSuccess = document.getElementById('registerSuccess');
const registerSubmit = document.getElementById('registerSubmit');
const registerNickname = document.getElementById('registerNickname');
const registerEmailToggle = document.getElementById('registerEmailToggle');
const registerEmailCheckbox = document.getElementById('registerEmailCheckbox');
const registerEmailCheckboxBox = document.getElementById('registerEmailCheckboxBox');
const registerEmailFieldWrap = document.getElementById('registerEmailFieldWrap');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerNicknameError = document.getElementById('registerNicknameError');
const registerEmailError = document.getElementById('registerEmailError');
const registerPasswordError = document.getElementById('registerPasswordError');

function setRegisterError(inputEl, errorEl, message) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
    inputEl.classList.add('input-error');
}

function clearRegisterError(inputEl, errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
    inputEl.classList.remove('input-error');
}

function clearAllRegisterErrors() {
    clearRegisterError(registerNickname, registerNicknameError);
    clearRegisterError(registerEmail, registerEmailError);
    clearRegisterError(registerPassword, registerPasswordError);
}

function resetRegisterCounters() {
    ['registerNicknameCounter', 'registerEmailCounter', 'registerPasswordCounter'].forEach((id) => {
        const counterEl = document.getElementById(id);
        if (!counterEl) return;
        counterEl.textContent = '0 / 50';
        counterEl.classList.remove('at-limit');
    });

    [registerNickname, registerEmail, registerPassword].forEach((inputEl) => {
        inputEl.classList.remove('at-limit');
    });
}

function resetRegisterForm() {
    registerForm.classList.remove('hide');
    registerSuccess.classList.remove('show');

    registerNickname.value = '';
    registerEmail.value = '';
    registerPassword.value = '';

    registerEmailCheckbox.checked = false;
    registerEmailCheckboxBox.classList.remove('checked');
    registerEmailFieldWrap.classList.remove('visible');

    resetRegisterCounters();
    clearAllRegisterErrors();

    registerSubmit.disabled = false;
    if (typeof i18n !== 'undefined' && typeof currentLang !== 'undefined' && i18n[currentLang]) {
        registerSubmit.textContent = i18n[currentLang].registerSubmitBtn;
    }
}

function closeRegisterModal() {
    registerOverlay.classList.remove('open');
    syncBodyScrollLock();
}

const registerOpenTriggers = ['openRegister', 'openRegisterMobile'];

function openRegisterModal(e) {
    e.preventDefault();
    closeAllModals(registerOverlay);
    resetRegisterForm();
    registerOverlay.classList.add('open');
    syncBodyScrollLock();
}

registerOpenTriggers.forEach((id) => {
    const trigger = document.getElementById(id);
    if (trigger) trigger.addEventListener('click', openRegisterModal);
});

document.getElementById('registerClose').addEventListener('click', closeRegisterModal);
registerOverlay.addEventListener('click', (e) => { if (e.target === registerOverlay) closeRegisterModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeRegisterModal(); });

registerEmailToggle.addEventListener('click', () => {
    const isChecked = registerEmailCheckbox.checked;
    registerEmailCheckbox.checked = !isChecked;
    registerEmailCheckboxBox.classList.toggle('checked', !isChecked);
    registerEmailFieldWrap.classList.toggle('visible', !isChecked);

    if (isChecked) {
        registerEmail.value = '';
        const emailCounter = document.getElementById('registerEmailCounter');
        if (emailCounter) {
            emailCounter.textContent = '0 / 50';
            emailCounter.classList.remove('at-limit');
        }
        registerEmail.classList.remove('at-limit');
        clearRegisterError(registerEmail, registerEmailError);
    }
});

registerNickname.addEventListener('input', () => clearRegisterError(registerNickname, registerNicknameError));
registerEmail.addEventListener('input', () => clearRegisterError(registerEmail, registerEmailError));
registerPassword.addEventListener('input', () => clearRegisterError(registerPassword, registerPasswordError));

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isRegisterLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
const registerApiBaseUrl = window.SHAPIX_API_BASE_URL
    ? String(window.SHAPIX_API_BASE_URL).replace(/\/+$/, '')
    : (isRegisterLocalHost ? 'http://localhost:8080' : '');

function setRegisterSubmitDefaultText() {
    if (typeof i18n !== 'undefined' && typeof currentLang !== 'undefined' && i18n[currentLang]) {
        registerSubmit.textContent = i18n[currentLang].registerSubmitBtn;
        return;
    }

    registerSubmit.textContent = 'Register';
}

function getRegisterRequestErrorMessage() {
    if (!registerApiBaseUrl && !isRegisterLocalHost) {
        if (typeof currentLang !== 'undefined') {
            if (currentLang === 'ru') return 'Backend URL не настроен. Укажите window.SHAPIX_API_BASE_URL с адресом API.';
            if (currentLang === 'az') return 'Backend URL qurulmayib. API unvanini window.SHAPIX_API_BASE_URL-a yazin.';
        }

        return 'Backend URL is not configured. Set window.SHAPIX_API_BASE_URL to your API URL.';
    }

    if (typeof currentLang !== 'undefined') {
        if (currentLang === 'ru') return 'Не удалось выполнить регистрацию. Проверьте API и backend.';
        if (currentLang === 'az') return 'Qeydiyyat alınmadı. API və backend-i yoxlayın.';
    }

    return 'Registration failed. Check API and backend.';
}

registerSubmit.addEventListener('click', async () => {
    const nicknameValue = registerNickname.value.trim();
    const emailValue = registerEmail.value.trim();
    const passwordValue = registerPassword.value.trim();
    const hasEmail = registerEmailCheckbox.checked;
    let hasError = false;

    clearAllRegisterErrors();

    if (nicknameValue.length < 2) {
        setRegisterError(registerNickname, registerNicknameError, i18n[currentLang].registerNicknameError);
        shakeInput(registerNickname);
        hasError = true;
    }

    if (passwordValue.length < 8) {
        setRegisterError(registerPassword, registerPasswordError, i18n[currentLang].registerPasswordError);
        shakeInput(registerPassword);
        hasError = true;
    }

    if (hasEmail) {
        if (!emailValue) {
            setRegisterError(registerEmail, registerEmailError, i18n[currentLang].registerEmailRequiredError);
            shakeInput(registerEmail);
            hasError = true;
        } else if (!emailPattern.test(emailValue)) {
            setRegisterError(registerEmail, registerEmailError, i18n[currentLang].registerEmailError);
            shakeInput(registerEmail);
            hasError = true;
        }
    }

    if (hasError) {
        registerSubmit.style.animation = 'none';
        registerSubmit.offsetHeight;
        registerSubmit.style.animation = 'shake 0.3s ease';
        return;
    }

    registerSubmit.disabled = true;
    registerSubmit.textContent = i18n[currentLang].registerSendingBtn;

    if (!registerApiBaseUrl && !isRegisterLocalHost) {
        setRegisterError(registerPassword, registerPasswordError, getRegisterRequestErrorMessage());
        shakeInput(registerPassword);
        registerSubmit.disabled = false;
        setRegisterSubmitDefaultText();
        return;
    }

    try {
        const registerApiUrl = registerApiBaseUrl
            ? registerApiBaseUrl + '/api/auth/register'
            : '/api/auth/register';

        const response = await fetch(registerApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nickname: nicknameValue,
                email: hasEmail ? emailValue : null,
                password: passwordValue
            })
        });

        let payload = null;
        try {
            payload = await response.json();
        } catch (e) {
            payload = null;
        }

        if (!response.ok) {
            let handled = false;

            const validationErrors = payload && typeof payload === 'object' ? payload.errors : null;
            if (validationErrors && typeof validationErrors === 'object') {
                const nicknameErrors = validationErrors.Nickname || validationErrors.nickname;
                const emailErrors = validationErrors.Email || validationErrors.email;
                const passwordErrors = validationErrors.Password || validationErrors.password;

                if (Array.isArray(nicknameErrors) && nicknameErrors.length > 0) {
                    setRegisterError(registerNickname, registerNicknameError, nicknameErrors[0]);
                    shakeInput(registerNickname);
                    handled = true;
                }

                if (Array.isArray(emailErrors) && emailErrors.length > 0) {
                    setRegisterError(registerEmail, registerEmailError, emailErrors[0]);
                    shakeInput(registerEmail);
                    handled = true;
                }

                if (Array.isArray(passwordErrors) && passwordErrors.length > 0) {
                    setRegisterError(registerPassword, registerPasswordError, passwordErrors[0]);
                    shakeInput(registerPassword);
                    handled = true;
                }
            }

            const apiMessage = payload && typeof payload === 'object'
                ? (payload.message || payload.detail || payload.title || '')
                : '';

            if (!handled && apiMessage) {
                const normalized = String(apiMessage).toLowerCase();

                if (normalized.includes('nickname')) {
                    setRegisterError(registerNickname, registerNicknameError, apiMessage);
                    shakeInput(registerNickname);
                } else if (normalized.includes('email')) {
                    setRegisterError(registerEmail, registerEmailError, apiMessage);
                    shakeInput(registerEmail);
                } else {
                    setRegisterError(registerPassword, registerPasswordError, apiMessage);
                    shakeInput(registerPassword);
                }

                handled = true;
            }

            if (!handled) {
                setRegisterError(registerPassword, registerPasswordError, getRegisterRequestErrorMessage());
                shakeInput(registerPassword);
            }

            registerSubmit.disabled = false;
            setRegisterSubmitDefaultText();
            return;
        }

        registerForm.classList.add('hide');
        registerSuccess.classList.add('show');

        setTimeout(() => {
            closeRegisterModal();
            setTimeout(() => resetRegisterForm(), 350);
        }, 1800);
    } catch (e) {
        setRegisterError(registerPassword, registerPasswordError, getRegisterRequestErrorMessage());
        shakeInput(registerPassword);
        registerSubmit.disabled = false;
        setRegisterSubmitDefaultText();
    }
});

const overlay = document.getElementById('reviewOverlay');
const modalForm = document.getElementById('modalForm');
const modalSuccess = document.getElementById('modalSuccess');
const modalSubmit = document.getElementById('modalSubmit');
const stars = document.querySelectorAll('.star');
const contactCheckbox = document.getElementById('contactCheckbox');
const contactFieldWrap = document.getElementById('contactFieldWrap');
let selectedRating = 0;

function syncBodyScrollLock() {
    const hasOpenOverlay = [overlay, registerOverlay, supportOverlay].some((item) => {
        return item && item.classList.contains('open');
    });

    document.body.style.overflow = hasOpenOverlay ? 'hidden' : '';
}

function closeAllModals(exceptOverlay = null) {
    [overlay, registerOverlay, supportOverlay].forEach((item) => {
        if (item && item !== exceptOverlay) {
            item.classList.remove('open');
        }
    });

    syncBodyScrollLock();
}

const reviewOpenTriggers = ['openReview', 'openReviewMobile'];

function openReviewModal(e) {
    e.preventDefault();
    closeAllModals(overlay);
    overlay.classList.add('open');
    syncBodyScrollLock();
}

reviewOpenTriggers.forEach((id) => {
    const trigger = document.getElementById(id);
    if (trigger) trigger.addEventListener('click', openReviewModal);
});

function closeModal() {
    overlay.classList.remove('open');
    syncBodyScrollLock();
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
setupField(registerNickname, 'registerNicknameCounter', 50);
setupField(registerEmail, 'registerEmailCounter', 50);
setupField(registerPassword, 'registerPasswordCounter', 50);

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

    resetRegisterForm();
    registerOverlay.classList.remove('open');

    overlay.classList.remove('open');
    supportOverlay.classList.remove('open');
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