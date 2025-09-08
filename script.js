// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.gallery-item, .feature-item, .service-item, .about-content, .cv-content');
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Initialize EmailJS
(function() {
    emailjs.init("nr7SoJlSirQ6LWdpQ"); // EmailJS에서 발급받은 Public Key를 입력하세요
})();

// Contact form handling
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const area = formData.get('area');
        const purpose = formData.get('purpose');
        const budget = formData.get('budget');
        const address = formData.get('address');
        const memo = formData.get('memo');
        
        // Basic validation
        if (!name || !phone || !area || !purpose || !budget || !address) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^[0-9-+\s()]+$/;
        if (!phoneRegex.test(phone)) {
            alert('올바른 연락처를 입력해주세요.');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '전송 중...';
        submitBtn.disabled = true;
        
        // EmailJS template parameters
        const templateParams = {
            from_name: name,
            from_phone: phone,
            area: area,
            purpose: purpose,
            budget: budget,
            address: address,
            message: memo || '내용 없음',
            reply_to: phone
        };
        
        // Send email using EmailJS
        emailjs.send('service_36gjxp2', 'template_xq67h4c', templateParams)
            .then(function(response) {
                alert('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.');
                contactForm.reset();
            }, function(error) {
                alert('전송에 실패했습니다. 다시 시도해주세요.');
                console.error('EmailJS Error:', error);
            })
            .finally(function() {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Image lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });
});

// Counter animation for experience section
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Trigger counter animation when experience section is visible
const experienceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counterElement = entry.target.querySelector('h2');
            if (counterElement && !counterElement.classList.contains('animated')) {
                counterElement.classList.add('animated');
                // HTML에서 설정된 숫자를 가져와서 애니메이션 실행
                const currentText = counterElement.textContent;
                const targetNumber = parseInt(currentText.match(/\d+/)[0]);
                animateCounter(counterElement, targetNumber);
            }
        }
    });
}, { threshold: 0.5 });

const experienceSection = document.querySelector('.experience');
if (experienceSection) {
    experienceObserver.observe(experienceSection);
}

// Project Slider functionality
const slider = {
    currentSlide: 0,
    slides: document.querySelectorAll('.slide'),
    dots: document.querySelectorAll('.dot'),
    prevBtn: document.querySelector('.prev-btn'),
    nextBtn: document.querySelector('.next-btn'),
    autoPlayInterval: null,
    
    init() {
        if (this.slides.length === 0) return;
        
        this.bindEvents();
        this.startAutoPlay();
        this.showSlide(0); // 첫 번째 슬라이드 표시
    },
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
    },
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide and activate dot
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        
        this.currentSlide = index;
    },
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    },
    
    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
    },
    
    goToSlide(index) {
        this.showSlide(index);
        this.restartAutoPlay();
    },
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // 5초 간격
    },
    
    restartAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.startAutoPlay();
        }
    }
};

// Hero Slider functionality
const heroSlider = {
    currentSlide: 0,
    slides: document.querySelectorAll('.hero-slide'),
    autoPlayInterval: null,
    
    init() {
        if (this.slides.length === 0) return;
        
        this.startAutoPlay();
        this.showSlide(0); // 첫 번째 슬라이드 표시
    },
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        this.slides[index].classList.add('active');
        
        this.currentSlide = index;
    },
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    },
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // 5초 간격
    }
};

// Typing Animation
const typingAnimation = {
    texts: [
        "공간 속에 담긴 이야기를 발견하고,",
        "그 이야기를 가장 아름다운 형태로 표현하는 것을 목표로 합니다.",
        "우리는 단순함 속에서 발견되는 풍부함과 깊이를 믿으며,",
        "각각의 프로젝트에서 클라이언트의 개성과",
        "라이프스타일을 반영한 독창적인 공간을 창조합니다.",
        "건축과 인테리어의 경계를 넘나들며,",
        "공간 사용자의 경험을 최우선으로 하는 디자인 철학을 바탕으로 작업합니다."
    ],
    currentTextIndex: 0,
    currentCharIndex: 0,
    completedLines: [],
    typingSpeed: 50,
    pauseTime: 1000,
    isCompleted: false,
    
    init() {
        // 1초 후에 애니메이션 시작
        setTimeout(() => {
            this.typeText();
        }, 1000);
    },
    
    typeText() {
        const element = document.getElementById('typingText');
        if (!element) return;
        
        if (this.isCompleted) return;
        
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.currentCharIndex < currentText.length) {
            // 타이핑 중
            const currentLine = currentText.substring(0, this.currentCharIndex + 1);
            this.completedLines[this.currentTextIndex] = currentLine;
            this.currentCharIndex++;
        } else {
            // 한 줄 완성
            this.completedLines[this.currentTextIndex] = currentText;
            this.currentTextIndex++;
            this.currentCharIndex = 0;
            
            // 모든 줄이 완성되었는지 확인
            if (this.currentTextIndex >= this.texts.length) {
                this.isCompleted = true;
                return;
            }
        }
        
        // 화면에 표시
        element.innerHTML = this.completedLines.map(line => 
            line ? `<div style="font-size: inherit;">${line}</div>` : ''
        ).join('');
        
        let speed = this.currentCharIndex === currentText.length ? this.pauseTime : this.typingSpeed;
        
        setTimeout(() => this.typeText(), speed);
    }
};

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    slider.init();
    heroSlider.init();
    typingAnimation.init();
});

// Add loading animation
window.addEventListener('load', () => {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div style="font-size: 2rem; color: #333;">HWADAM DESIGN</div>';
    document.body.appendChild(loading);
    
    setTimeout(() => {
        loading.classList.add('hidden');
        setTimeout(() => {
            if (loading.parentNode) {
                loading.parentNode.removeChild(loading);
            }
        }, 500);
    }, 1000);
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 500);
    }
});

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    z-index: 10001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});
