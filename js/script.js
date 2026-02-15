// Анимация звездного фона
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const starCount = 200;

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random();
        this.fadeSpeed = (Math.random() * 0.02) + 0.01;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.opacity += this.fadeSpeed;
        if (this.opacity >= 1 || this.opacity <= 0) {
            this.fadeSpeed = -this.fadeSpeed;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initStars() {
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animateStars);
}

initStars();
animateStars();

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимации при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Анимация элементов при появлении
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .mission-content, .satellite-content');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

function initEarthInteraction() {
    console.log("Инициализация взаимодействия с Землей");
    const earthImage = document.querySelector('.earth-image');
    const container = document.querySelector('.earth-container');

    if (earthImage && container) {
        console.log("Элементы Земли найдены, добавляем слушатели");
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Вычисление углов поворота
            // Максимальный поворот: 20 градусов
            const rotateY = (x / (rect.width / 2)) * 20;
            const rotateX = -(y / (rect.height / 2)) * 20;

            // Применение трансформации: Масштаб (1.2) + Поворот
            earthImage.style.transform = `scale(1.2) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            // Добавляем класс для паузы анимации вращения
            earthImage.classList.add('interactive');

            // Эффект динамического освещения
            const distance = Math.sqrt(x * x + y * y);
            if (distance < 250) {
                const intensity = 1 - (distance / 250);
                earthImage.style.filter = `brightness(${1 + intensity * 0.3}) drop-shadow(0 0 ${30 + intensity * 20}px rgba(74, 158, 255, ${0.5 + intensity * 0.2}))`;
            }
        });

        container.addEventListener('mouseleave', () => {
            // Сброс трансформации к умолчанию
            earthImage.style.transform = 'scale(1) rotateX(0) rotateY(0)';

            // Удаление класса интерактивности
            earthImage.classList.remove('interactive');

            // Сброс фильтра
            earthImage.style.filter = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', initEarthInteraction);

// Интерактивные эффекты кнопок
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.05)';
    });

    button.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
});

// Эффект наведения на карточки услуг
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        const icon = this.querySelector('.service-icon svg');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });

    card.addEventListener('mouseleave', function () {
        const icon = this.querySelector('.service-icon svg');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Эффект параллакса для секций
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.mission-image, .satellite-image');

    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
    });
});

// Анимированные счетчики статистики
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const target = parseInt(statNumber.getAttribute('data-target'));
            animateCounter(statNumber, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-card').forEach(card => {
        statsObserver.observe(card);
    });

    // Функционал калькулятора
    const calculatorInputs = document.querySelectorAll('input[name="projectType"], select[name="pageCount"], select[name="designType"], input[type="checkbox"]');
    const priceDisplay = document.getElementById('calculatedPrice');

    function calculatePrice() {
        let totalPrice = 0;

        // Получение выбранного типа проекта
        const projectType = document.querySelector('input[name="projectType"]:checked');
        if (projectType) {
            totalPrice += parseInt(projectType.getAttribute('data-price'));
        }

        // Получение количества страниц
        const pageCount = document.querySelector('select[name="pageCount"]');
        if (pageCount) {
            const selectedOption = pageCount.options[pageCount.selectedIndex];
            totalPrice += parseInt(selectedOption.getAttribute('data-price'));
        }

        // Получение типа дизайна
        const designType = document.querySelector('select[name="designType"]');
        if (designType) {
            const selectedOption = designType.options[designType.selectedIndex];
            totalPrice += parseInt(selectedOption.getAttribute('data-price'));
        }

        // Получение выбранных дополнительных опций
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            totalPrice += parseInt(checkbox.getAttribute('data-price'));
        });

        // Форматирование цены с пробелами
        const formattedPrice = totalPrice.toLocaleString('ru-RU');
        priceDisplay.textContent = `${formattedPrice} ₽`;
    }

    // Слушатели событий для всех полей калькулятора
    calculatorInputs.forEach(input => {
        input.addEventListener('change', calculatePrice);
    });

    // Прокрутка к форме контактов при клике
    const getQuoteBtn = document.querySelector('.btn-get-quote');
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', () => {
            // Прокрутка к секции about (или контактам)
            const contactSection = document.querySelector('.mission');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // FAQ карточки
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Закрыть все FAQ элементы
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });

            // Открыть текущий
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Функция построения сообщения для Telegram (по аналогии с шаблоном vlprime)
    const buildTelegramMessage = (formData) => {
        const lines = [`📩 *Новая заявка с сайта*`, ``];

        if (formData.name) lines.push(`*Имя:* ${formData.name}`);
        if (formData.phone) lines.push(`*Телефон:* ${formData.phone}`);
        if (formData.projectType) lines.push(`*Тип проекта:* ${formData.projectType}`);
        if (formData.message) lines.push(`*Сообщение:* ${formData.message}`);

        lines.push(``);
        lines.push(`Дата: ${new Date().toLocaleString('ru-RU')}`);

        return lines.join('\n');
    };

    // Обработчик отправки формы
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // ... (инициализация инпутов) ...
        const nameInput = document.getElementById('contactName');
        const phoneInput = document.getElementById('contactPhone');
        const projectTypeInput = document.getElementById('contactProjectType');
        const messageInput = document.getElementById('contactMessage');

        // Маска телефона
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value[0] !== '7') {
                    value = '7' + value;
                }

                let formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.substring(1, 4);
                }
                if (value.length >= 5) {
                    formatted += ') ' + value.substring(4, 7);
                }
                if (value.length >= 8) {
                    formatted += '-' + value.substring(7, 9);
                }
                if (value.length >= 10) {
                    formatted += '-' + value.substring(9, 11);
                }

                e.target.value = formatted;
            }
        });

        // Функции валидации
        function showError(input, message) {
            const formGroup = input.parentElement;
            const errorSpan = formGroup.querySelector('.form-error');
            input.classList.add('error');
            errorSpan.textContent = message;
        }

        function clearError(input) {
            const formGroup = input.parentElement;
            const errorSpan = formGroup.querySelector('.form-error');
            input.classList.remove('error');
            errorSpan.textContent = '';
        }

        function validateName() {
            const value = nameInput.value.trim();
            if (value === '') {
                showError(nameInput, 'Пожалуйста, введите ваше имя');
                return false;
            }
            if (value.length < 2) {
                showError(nameInput, 'Имя должно содержать минимум 2 символа');
                return false;
            }
            clearError(nameInput);
            return true;
        }

        function validatePhone() {
            const value = phoneInput.value.replace(/\D/g, '');
            if (value === '') {
                showError(phoneInput, 'Пожалуйста, введите номер телефона');
                return false;
            }
            if (value.length !== 11) {
                showError(phoneInput, 'Введите корректный номер телефона');
                return false;
            }
            clearError(phoneInput);
            return true;
        }

        function validateProjectType() {
            if (projectTypeInput.value === '') {
                showError(projectTypeInput, 'Пожалуйста, выберите тип проекта');
                return false;
            }
            clearError(projectTypeInput);
            return true;
        }

        function validateMessage() {
            const value = messageInput.value.trim();
            if (value === '') {
                showError(messageInput, 'Пожалуйста, введите сообщение');
                return false;
            }
            if (value.length < 10) {
                showError(messageInput, 'Сообщение должно содержать минимум 10 символов');
                return false;
            }
            clearError(messageInput);
            return true;
        }

        // Переиспользуем существующие функции валидации
        nameInput.addEventListener('blur', validateName);
        phoneInput.addEventListener('blur', validatePhone);
        projectTypeInput.addEventListener('change', validateProjectType);
        messageInput.addEventListener('blur', validateMessage);

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isNameValid = validateName();
            const isPhoneValid = validatePhone();
            const isProjectTypeValid = validateProjectType();
            const isMessageValid = validateMessage();

            if (isNameValid && isPhoneValid && isProjectTypeValid && isMessageValid) {
                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Подготовка...';
                submitBtn.disabled = true;

                // Сбор данных формы
                const formData = {
                    name: nameInput.value,
                    phone: phoneInput.value,
                    projectType: projectTypeInput.value,
                    message: messageInput.value
                };

                // Генерация сообщения
                const messageText = buildTelegramMessage(formData);
                const targetPhone = '79266262662';

                // 1. Копирование в буфер обмена (надежный способ передачи текста)
                try {
                    await navigator.clipboard.writeText(messageText);
                    alert('Сообщение скопировано! Переходим в Telegram...');
                } catch (err) {
                    console.error('Ошибка буфера:', err);
                    alert('Переходим в Telegram...');
                }

                // 2. Открытие чата
                // Формат ссылки для открытия чата с пользователем
                const telegramUrl = `https://t.me/+${targetPhone}`;

                window.open(telegramUrl, '_blank', 'noopener,noreferrer');

                // Сброс формы
                contactForm.reset();
                [nameInput, phoneInput, projectTypeInput, messageInput].forEach(input => {
                    clearError(input);
                });

                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Активная навигация при прокрутке
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === entry.target.id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => {
    navObserver.observe(section);
});

// Функционал бургер-меню
const burgerBtn = document.querySelector('.burger-btn');
const nav = document.querySelector('.nav');

if (burgerBtn && nav) {
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Закрытие меню при клике на ссылку
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        const isClickInsideMenu = nav.contains(e.target) && e.target !== nav;
        const isClickOnBurger = burgerBtn.contains(e.target);

        if (nav.classList.contains('active') && !isClickInsideMenu && !isClickOnBurger) {
            burgerBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

// Наблюдатель анимации прокрутки (fade-up)
const fadeObserverOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Анимировать только один раз
        }
    });
}, fadeObserverOptions);

// Элементы для анимации
const elementsToAnimate = document.querySelectorAll(
    '.section-title, .section-label, .service-item, .bento-item, .portfolio-item, .process-header'
);

elementsToAnimate.forEach((el, index) => {
    el.classList.add('fade-up');
    fadeObserver.observe(el);
});

// Логика кнопок прокрутки
document.addEventListener('DOMContentLoaded', () => {
    const scrollTopBtn = document.getElementById('scrollTop');
    const scrollBottomBtn = document.getElementById('scrollBottom');

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    if (scrollBottomBtn) {
        scrollBottomBtn.addEventListener('click', () => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        });
    }
});
