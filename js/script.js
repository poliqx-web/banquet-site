// ==================================================
// БАНКЕТНЫЙ ЗАЛ «ВАЛЬС» — СКРИПТЫ
// ==================================================

// ==========================================
// 1. ЛАЙТБОКС-КАРУСЕЛЬ
// ==========================================
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCounter = document.getElementById('lbCounter');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const lbClose = document.getElementById('lbClose');
const halls = document.querySelectorAll('.hall');

let currentImages = [];
let currentIndex = 0;

const updateLightbox = () => {
    lbImg.src = currentImages[currentIndex];
    lbCounter.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
};

const showNext = () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightbox();
};

const showPrev = () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightbox();
};

const closeLightbox = () => {
    lightbox.classList.remove('open');
};

halls.forEach((hall) => {
    hall.addEventListener('click', () => {
        currentImages = JSON.parse(hall.dataset.images);
        currentIndex = 0;
        updateLightbox();
        lightbox.classList.add('open');
    });
});

lbNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
});

lbPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
});

lbClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
});


// ==========================================
// 2. ГАМБУРГЕР-МЕНЮ
// ==========================================
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

burger.addEventListener('click', () => {
    mobileNav.classList.add('open');
});

mobileClose.addEventListener('click', () => {
    mobileNav.classList.remove('open');
});

mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
    });
});


// ==========================================
// 3. МАСКА И ПРОВЕРКА ТЕЛЕФОНА
// ==========================================
const phoneInput = document.getElementById('phone');
const phoneError = document.getElementById('phoneError');

// Режим ввода: 'ru' (российский) или 'intl' (международный)
let phoneMode = 'ru';

const formatPhone = (value) => {
    // Оставляем только цифры и +
    const cleaned = value.replace(/[^\d+]/g, '');

    // Если начинается с "+" и это не "+7" — международный режим
    if (cleaned.startsWith('+') && !cleaned.startsWith('+7')) {
        phoneMode = 'intl';
        return cleaned;
    }

    // Если пользователь стёр всё — сбрасываем режим на российский
    if (cleaned === '' || cleaned === '+') {
        return cleaned;
    }

    // Всё остальное — российский формат
    phoneMode = 'ru';
    let digits = cleaned.replace(/\D/g, '');

    if (digits.startsWith('7') || digits.startsWith('8')) {
        digits = digits.slice(1);
    }

    digits = digits.slice(0, 10);

    if (digits.length === 0) {
        return '';
    }

    let result = '+7 (' + digits.slice(0, 3);

    if (digits.length >= 3) result += ') ';
    if (digits.length > 3) result += digits.slice(3, 6);
    if (digits.length >= 6) result += '-';
    if (digits.length > 6) result += digits.slice(6, 8);
    if (digits.length >= 8) result += '-';
    if (digits.length > 8) result += digits.slice(8, 10);

    return result;
};

const validatePhone = (value) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    const digits = cleaned.replace(/\D/g, '');

    if (digits.startsWith('7') && digits.length === 11) {
        return true;
    }

    if (cleaned.startsWith('+') && !cleaned.startsWith('+7')) {
        return digits.length >= 8 && digits.length <= 15;
    }

    return false;
};

// Умное удаление: если Backspace нажат на символе форматирования —
// удаляем ближайшую цифру слева
phoneInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Backspace') return;

    const cursorPos = phoneInput.selectionStart;
    const value = phoneInput.value;

    if (phoneInput.selectionEnd !== cursorPos) return;
    if (cursorPos === 0) return;

    const charBefore = value[cursorPos - 1];

    // Если это цифра — пусть браузер удалит как обычно
    if (/\d/.test(charBefore)) return;

    // Иначе — ищем ближайшую цифру слева и удаляем её
    e.preventDefault();

    let pos = cursorPos - 1;
    while (pos >= 0 && !/\d/.test(value[pos])) {
        pos--;
    }

    if (pos < 0) return;

    const newValue = value.slice(0, pos) + value.slice(pos + 1);
    const formatted = formatPhone(newValue);

    // Если после удаления осталось пусто или только "+" — очищаем поле полностью
    if (formatted === '' || formatted === '+') {
        phoneInput.value = '';
        phoneInput.setSelectionRange(0, 0);
        return;
    }

    phoneInput.value = formatted;
    phoneInput.setSelectionRange(pos, pos);
});

phoneInput.addEventListener('input', (e) => {
    const rawValue = e.target.value;
    const formatted = formatPhone(rawValue);

    // Если пользователь стёр всё — оставляем поле пустым
    if (rawValue === '') {
        e.target.value = '';
        return;
    }

    // Если только "+" — оставляем
    if (formatted === '+') {
        e.target.value = '+';
        e.target.setSelectionRange(1, 1);
        return;
    }

    if (formatted !== e.target.value) {
        e.target.value = formatted;
        e.target.setSelectionRange(formatted.length, formatted.length);
    }

    phoneInput.classList.remove('error');
    phoneError.classList.remove('visible');
});

phoneInput.addEventListener('focus', () => {
    phoneInput.classList.remove('error');
    phoneError.classList.remove('visible');
});

phoneInput.addEventListener('blur', () => {
    const value = phoneInput.value.trim();
    if (!value) return;

    if (!validatePhone(value)) {
        phoneInput.classList.add('error');
        phoneError.textContent = 'Введите корректный номер телефона';
        phoneError.classList.add('visible');
    }
});


// ==========================================
// 4. ПРОВЕРКА ДАТЫ
// ==========================================
const dateInput = document.getElementById('date');
const dateError = document.getElementById('dateError');

// Устанавливаем минимальную дату = сегодня
const setMinDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', yyyy + '-' + mm + '-' + dd);
};

setMinDate();

const validateDate = (value) => {
    if (!value) return true;

    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
        return 'Дата не может быть раньше сегодняшней';
    }

    const twoYears = new Date();
    twoYears.setFullYear(twoYears.getFullYear() + 2);

    if (selected > twoYears) {
        return 'Дата слишком далеко в будущем';
    }

    return true;
};

dateInput.addEventListener('change', () => {
    const value = dateInput.value;
    const result = validateDate(value);

    if (result === true) {
        dateInput.classList.remove('error');
        dateError.classList.remove('visible');
    } else {
        dateInput.classList.add('error');
        dateError.textContent = result;
        dateError.classList.add('visible');
    }
});


// ==========================================
// 5. ОБРАБОТКА ФОРМЫ — ОТПРАВКА В FORMSPREE
// ==========================================
const form = document.getElementById('form');
const success = document.getElementById('success');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phoneValue = form.phone.value.trim();
    const dateValue = form.date.value;

    let hasErrors = false;

    // Проверка имени
    if (!name) {
        alert('Пожалуйста, введите имя');
        hasErrors = true;
    }

    // Проверка телефона
    if (!phoneValue || !validatePhone(phoneValue)) {
        phoneInput.classList.add('error');
        phoneError.textContent = 'Введите корректный номер телефона';
        phoneError.classList.add('visible');
        hasErrors = true;
    }

    // Проверка даты
    const dateResult = validateDate(dateValue);
    if (dateResult !== true) {
        dateInput.classList.add('error');
        dateError.textContent = dateResult;
        dateError.classList.add('visible');
        hasErrors = true;
    }

    if (hasErrors) {
        const firstError = document.querySelector('#form .error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }

    const data = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            form.reset();
            document.querySelectorAll('#form .field-error').forEach((el) => el.classList.remove('visible'));
            document.querySelectorAll('#form input.error').forEach((el) => el.classList.remove('error'));
            success.style.display = 'block';
            setTimeout(() => {
                success.style.display = 'none';
            }, 5000);
        } else {
            alert('Ошибка отправки. Попробуйте ещё раз или позвоните нам.');
        }
    } catch (error) {
        alert('Ошибка соединения. Проверьте интернет и попробуйте снова.');
    }
});


// ==========================================
// 6. ПЛАВНОЕ ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ
// ==========================================
const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));