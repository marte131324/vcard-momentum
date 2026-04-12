document.addEventListener("DOMContentLoaded", () => {
    // GSAP Initial Entry Animations
    gsap.config({ force3D: true });
    const elements = document.querySelectorAll('.animate-in');

    gsap.set(elements, { y: 30, opacity: 0 });
    gsap.to(elements, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2
    });

    // Parallax hero background
    const bgContainer = document.querySelector('.site-bg');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (bgContainer) {
            bgContainer.style.opacity = Math.max(0, 1 - (scrollTop * 0.0035));
        }
    });

    // --- Premium Audio Feedback for UI clicks ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function initAudio() {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    // Initialize audio context to bypass iOS Safari restrictions
    window.addEventListener('touchstart', initAudio, { once: true, passive: true });
    window.addEventListener('click', initAudio, { once: true, passive: true });

    function playHapticSound() {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.03);

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
    }

    const interactEls = document.querySelectorAll('.ui-interact, .social-btn, .gallery-item');
    interactEls.forEach(el => el.addEventListener('click', playHapticSound));

    // --- Lightbox Gallery Engine ---
    const lightboxGalleryItems = document.querySelectorAll('.gallery-item img');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightboxModal && lightboxImg) {
        lightboxGalleryItems.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                playHapticSound();
                lightboxImg.src = img.src;
                lightboxModal.classList.remove('hidden');
            });
        });

        lightboxClose.addEventListener('click', () => {
            playHapticSound();
            lightboxModal.classList.add('hidden');
        });

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) lightboxModal.classList.add('hidden');
        });
    }

    // --- Modal Logic ---
    const modalLinks = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close');

    modalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal) targetModal.classList.remove('hidden');
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.modal-overlay').classList.add('hidden'));
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });

    // --- FAQ Accordion Logic ---
    const faqBtns = document.querySelectorAll('.faq-btn');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const isActive = btn.classList.contains('active');

            document.querySelectorAll('.faq-content').forEach(c => c.style.maxHeight = null);
            document.querySelectorAll('.faq-btn').forEach(b => b.classList.remove('active'));

            if (!isActive) {
                btn.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // --- Portfolio Filtering Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';

                setTimeout(() => {
                    if (filterValue === 'all' || filterValue === itemCategory) {
                        item.classList.remove('hidden-item');
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.classList.add('hidden-item');
                    }
                }, 300);
            });
        });
    });

    // --- QR Code Generator ---
    const qrContainer = document.getElementById('qrcode-container');
    if (qrContainer && typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
            text: window.location.href,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // --- Contact Form Simulator ---
    const sendFormBtn = document.getElementById('send-form-btn');
    const contactFormBox = document.getElementById('contact-form-box');
    const contactSuccess = document.getElementById('contact-success');

    if (sendFormBtn && contactFormBox && contactSuccess) {
        sendFormBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('lead-name').value;
            const typeInput = document.getElementById('lead-type') ? document.getElementById('lead-type').value : '';
            const dateInput = document.getElementById('lead-date') ? document.getElementById('lead-date').value : '';
            const msgInput = document.getElementById('lead-message') ? document.getElementById('lead-message').value : '';

            if (!nameInput.trim()) return alert('Por favor, ingresa tu nombre.');

            sendFormBtn.innerHTML = '<i class="ri-loader-4-line"></i> Procesando...';
            sendFormBtn.style.opacity = '0.7';

            setTimeout(() => {
                contactFormBox.classList.add('hidden');
                contactSuccess.classList.remove('hidden');

                let wmsg = `Hola Momentum, soy ${nameInput}.`;
                if (typeInput) wmsg += ` Me interesa: ${typeInput}.`;
                if (dateInput) wmsg += ` Fecha evento: ${dateInput}.`;
                if (msgInput) wmsg += ` Detalles: ${msgInput}`;

                const url = `https://wa.me/5217205834724?text=${encodeURIComponent(wmsg)}`;
                window.open(url, '_blank');

            }, 800);
        });
    }

    // --- On-Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
});
