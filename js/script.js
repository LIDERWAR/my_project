// Star field animation
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

// Window resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Smooth scroll
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

// Scroll animations
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

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .mission-content, .satellite-content');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Earth glow effect on mouse move
const earthImage = document.querySelector('.earth-image');
if (earthImage) {
    document.addEventListener('mousemove', (e) => {
        const rect = earthImage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const distance = Math.sqrt(x * x + y * y);

        if (distance < 250) {
            const intensity = 1 - (distance / 250);
            earthImage.style.filter = `brightness(${1 + intensity * 0.3}) drop-shadow(0 0 ${30 + intensity * 30}px rgba(74, 158, 255, ${0.4 + intensity * 0.3}))`;
        } else {
            earthImage.style.filter = '';
        }
    });
}

// Interactive button effects
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.05)';
    });

    button.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
});

// Service cards hover effect
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

// Parallax effect for sections
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.mission-image, .satellite-image');

    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
    });
});

// Animated counters for stats
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

    // Calculator functionality
    const calculatorInputs = document.querySelectorAll('input[name="projectType"], select[name="pageCount"], select[name="designType"], input[type="checkbox"]');
    const priceDisplay = document.getElementById('calculatedPrice');

    function calculatePrice() {
        let totalPrice = 0;

        // Get selected project type
        const projectType = document.querySelector('input[name="projectType"]:checked');
        if (projectType) {
            totalPrice += parseInt(projectType.getAttribute('data-price'));
        }

        // Get selected page count
        const pageCount = document.querySelector('select[name="pageCount"]');
        if (pageCount) {
            const selectedOption = pageCount.options[pageCount.selectedIndex];
            totalPrice += parseInt(selectedOption.getAttribute('data-price'));
        }

        // Get selected design type
        const designType = document.querySelector('select[name="designType"]');
        if (designType) {
            const selectedOption = designType.options[designType.selectedIndex];
            totalPrice += parseInt(selectedOption.getAttribute('data-price'));
        }

        // Get checked additional options
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            totalPrice += parseInt(checkbox.getAttribute('data-price'));
        });

        // Format price with spaces
        const formattedPrice = totalPrice.toLocaleString('ru-RU');
        priceDisplay.textContent = `${formattedPrice} ₽`;
    }

    // Add event listeners to all calculator inputs
    calculatorInputs.forEach(input => {
        input.addEventListener('change', calculatePrice);
    });

    // Scroll to contact form on button click
    const getQuoteBtn = document.querySelector('.btn-get-quote');
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', () => {
            // Scroll to mission section (placeholder for contact form)
            const contactSection = document.querySelector('.mission');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // FAQ Flip Cards
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const nameInput = document.getElementById('contactName');
        const phoneInput = document.getElementById('contactPhone');
        const projectTypeInput = document.getElementById('contactProjectType');
        const messageInput = document.getElementById('contactMessage');

        // Phone mask
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

        // Validation functions
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

        // Real-time validation
        nameInput.addEventListener('blur', validateName);
        phoneInput.addEventListener('blur', validatePhone);
        projectTypeInput.addEventListener('change', validateProjectType);
        messageInput.addEventListener('blur', validateMessage);

        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isNameValid = validateName();
            const isPhoneValid = validatePhone();
            const isProjectTypeValid = validateProjectType();
            const isMessageValid = validateMessage();

            if (isNameValid && isPhoneValid && isProjectTypeValid && isMessageValid) {
                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Отправка...';
                submitBtn.disabled = true;

                // Telegram Configuration
                // TODO: Replace with your actual Bot Token and Chat ID
                const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
                const CHAT_ID = 'YOUR_CHAT_ID_HERE';
                const URI_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

                let message = `<b>Заявка с сайта</b>\n`;
                message += `<b>Имя:</b> ${nameInput.value}\n`;
                message += `<b>Телефон:</b> ${phoneInput.value}\n`;
                message += `<b>Тип проекта:</b> ${projectTypeInput.value}\n`;
                message += `<b>Сообщение:</b> ${messageInput.value}`;

                try {
                    const response = await fetch(URI_API, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            chat_id: CHAT_ID,
                            text: message,
                            parse_mode: 'html'
                        })
                    });

                    const result = await response.json();

                    if (result.ok) {
                        alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
                        contactForm.reset();
                        [nameInput, phoneInput, projectTypeInput, messageInput].forEach(input => {
                            clearError(input);
                        });
                    } else {
                        throw new Error('Telegram API Error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Ошибка отправки. Пожалуйста, свяжитесь с нами другим способом.');
                } finally {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
});

// Active navigation on scroll
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
