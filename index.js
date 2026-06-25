document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       MOBILE MENU TOGGLE
       ========================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbar = document.getElementById('navbar');

    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navbar.classList.contains('active')) {
                icon.className = 'ri-close-line';
            } else {
                icon.className = 'ri-menu-line';
            }
        });

        // Close navbar on link click (mobile)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                mobileMenuBtn.querySelector('i').className = 'ri-menu-line';
            });
        });
    }

    /* ==========================================
       STICKY HEADER & ACTIVE SCROLL LINK
       ========================================== */
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link highlighting
        let currentSectionId = 'hero';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // adjust offset for header height
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================
       TYPEWRITER SUBTITLE ANIMATION
       ========================================== */
    const typewriterElement = document.getElementById('typewriter');
    const phrases = [
        "Intelligent AI Systems.",
        "Natural Language Models.",
        "Modern Web Solutions.",
        "Empowering Business Apps.",
        "Clean, Optimized Code."
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // speed up deletion
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // standard typing speed
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000; // wait before starting deletion
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // delay before next word
        }

        setTimeout(type, typingSpeed);
    }

    if (typewriterElement) {
        type();
    }

    /* ==========================================
       SCROLL-REVEAL & ANIMATION TRIGGERS
       ========================================== */
    const revealElements = document.querySelectorAll('.section-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger stats count up inside this section
                const stats = entry.target.querySelectorAll('.stat-number');
                stats.forEach(stat => animateCounter(stat));

                // Trigger language fill-bar animations inside this section
                const fillBars = entry.target.querySelectorAll('.lang-bar-fill');
                fillBars.forEach(bar => {
                    // Set width from style property written in HTML
                    const targetWidth = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 100);
                });

                observer.unobserve(entry.target); // stop observing once animation triggers
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Stats counter helper function
    function animateCounter(counterElement) {
        if (counterElement.classList.contains('counted')) return;
        
        counterElement.classList.add('counted');
        const target = +counterElement.getAttribute('data-target');
        let count = 0;
        const duration = 1500; // 1.5 seconds
        const step = target / (duration / 16); // ~60fps
        
        const updateCount = () => {
            count += step;
            if (count < target) {
                counterElement.textContent = Math.floor(count);
                requestAnimationFrame(updateCount);
            } else {
                counterElement.textContent = target;
            }
        };
        updateCount();
    }

    /* ==========================================
       CONTACT FORM SUBMISSION FEEDBACK
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Visual feedback during processing
            formStatus.className = 'form-status';
            formStatus.textContent = 'Transmitting credentials to server...';
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const submitBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Connecting...</span> <i class="ri-loader-3-line pulse"></i>`;

            // Prepare form data
            const formData = new FormData(contactForm);
            const formObject = Object.fromEntries(formData.entries());

            // Send request to FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/harshavardan0203@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formObject)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                formStatus.className = 'form-status success';
                formStatus.innerHTML = `<i class="ri-checkbox-circle-line"></i> Secure message successfully delivered to Harshavardhana.`;
                contactForm.reset();
            })
            .catch(error => {
                formStatus.className = 'form-status error';
                formStatus.innerHTML = `<i class="ri-error-warning-line"></i> Connection failed. Please try again or use direct email link.`;
                console.error("Mail submission error:", error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtnContent;
                
                // Clear state after 6 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 6000);
            });
        });
    }

    /* ==========================================
       INTERACTIVE PROJECT DEMO SIMULATION (SANDBOX)
       ========================================== */
    const demoTriggers = document.querySelectorAll('.demo-trigger');
    const activePageTrigger = document.querySelector('.active-page-trigger');
    const demoModal = document.getElementById('demo-modal');
    const modalClose = document.getElementById('modal-close');
    const modalProjectText = document.getElementById('modal-project-text');
    const terminalBody = document.getElementById('terminal-body');

    // Terminal command sequences
    const simulationData = {
        "Career Forge AI": [
            "Initializing Career Forge Engine (v1.4.2)...",
            "Connecting NLP parsing pipelines...",
            "Loading local candidate scoring weight matrices...",
            "Analyzing resume corpus: 'HARSHAVARDHANA_REDDY_BK_FlowCV_Resume_2026-06-22.pdf'...",
            "...",
            "[SUCCESS] Target parsing complete.",
            "Candidate Profile: HARSHAVARDHANA REDDY BK",
            "Target Field: Artificial Intelligence & Web Dev",
            "Matched Core Skills:",
            "  - NLP (Natural Language Processing)",
            "  - Regressions & Classifiers (SVM, KNN, Naive Bayes)",
            "  - Backend Integration (Flask, MySQL)",
            "Running Job Description (JD) matching simulation against Senior AI Engineer JD...",
            "  - Keyword Overlap: 89.2%",
            "  - Experience/Skill Density: High",
            "  - Predicted Placement Suitability Rate: 92.4% (T1 High Quality)",
            "Done. Platform connection stable."
        ],
        "KCR Validations Platform": [
            "Sending diagnostic request to KCR Validations web host...",
            "Pinging validation database endpoint: SECURE CONNECTED",
            "...",
            "Analyzing platform web performance metrics:",
            "  - TTFB (Time to First Byte): 0.08s",
            "  - Google Lighthouse Score (Performance): 98/100",
            "  - Google Lighthouse Score (SEO): 100/100",
            "  - Google Lighthouse Score (Accessibility): 97/100",
            "Reviewing Client Inquiry Module status...",
            "  - Lead routing pipeline: ACTIVE",
            "  - Form submission validation state: OPERATIONAL",
            "Validation services showcase responsiveness test: OK (100% Mobile Ready)",
            "Done. Platform status: ONLINE"
        ],
        "Taskflow AI (NLP Task Manager)": [
            "Booting Taskflow NLP parsing node...",
            "Connecting interface scheduler database...",
            "Prompt Input: 'Review calibration checklist with KCR team tomorrow at 2:30 PM'",
            "...",
            "Processing Natural Language sequence...",
            "Tokenizing input structure...",
            "Extracting Event Parameters:",
            "  - Intent Found: 'create_calendar_event'",
            "  - Event Topic: 'Review calibration checklist with KCR team'",
            "  - Target Date: '2026-06-23'",
            "  - Target Time: '14:30:00 (IST)'",
            "  - Priority: 'Medium'",
            "Inserting record into local SQL database scheduler...",
            "Database status: OK (1 row affected)",
            "System Output: Event scheduled successfully. Reminder notification dispatched."
        ]
    };

    function runTerminalSimulation(projectName) {
        const lines = simulationData[projectName] || ["Booting system...", "Executing project routine..."];
        terminalBody.textContent = "";
        let currentLine = 0;

        function printLine() {
            if (currentLine < lines.length) {
                terminalBody.textContent += (currentLine === 0 ? "" : "\n") + "> " + lines[currentLine];
                terminalBody.scrollTop = terminalBody.scrollHeight; // auto-scroll terminal
                currentLine++;
                setTimeout(printLine, Math.random() * 400 + 200); // realistic variance in typing/calculating speed
            } else {
                terminalBody.textContent += "\n\n[PROCESS CONCLUDED SUCCESSFULLY]\n$ _";
            }
        }
        printLine();
    }

    // Modal open controls
    demoTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const projectCard = trigger.closest('.project-card');
            const projectName = projectCard.querySelector('.project-name').textContent;
            
            modalProjectText.innerHTML = `Running diagnostic simulation for project: <strong style="color:var(--color-secondary);">${projectName}</strong>`;
            demoModal.classList.add('active');
            
            runTerminalSimulation(projectName);
        });
    });

    if (activePageTrigger) {
        activePageTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            modalProjectText.innerHTML = `Running diagnostic simulation for project: <strong style="color:var(--color-accent);">Futuristic Personal Portfolio</strong>`;
            demoModal.classList.add('active');
            
            const lines = [
                "Scanning current page elements...",
                "Host architecture: Client Client-side Static",
                "Detected Components:",
                "  - Interactive Navigation Bar: Active",
                "  - Grayscale-to-Color Profile image: Hover responsive",
                "  - Statistics auto-counters: Active",
                "  - Contact form integration validator: Operational",
                "  - Background decorative animation engines: Active",
                "All UI/UX units successfully operating at optimal frames-per-second.",
                "Portfolio status: EXCELLENT."
            ];
            
            terminalBody.textContent = "";
            let currentLine = 0;
            function printLine() {
                if (currentLine < lines.length) {
                    terminalBody.textContent += (currentLine === 0 ? "" : "\n") + "> " + lines[currentLine];
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                    currentLine++;
                    setTimeout(printLine, Math.random() * 300 + 150);
                } else {
                    terminalBody.textContent += "\n\n[PROCESS CONCLUDED SUCCESSFULLY]\n$ _";
                }
            }
            printLine();
        });
    }

    // Modal close controls
    if (modalClose && demoModal) {
        modalClose.addEventListener('click', () => {
            demoModal.classList.remove('active');
            terminalBody.textContent = ""; // clear terminal
        });

        // Close on background overlay click
        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) {
                demoModal.classList.remove('active');
                terminalBody.textContent = "";
            }
        });
    }



    function showToast(message) {
        // Remove existing toast if present
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-icon"><i class="ri-checkbox-circle-fill"></i></div>
            <div class="toast-message">${message}</div>
        `;
        document.body.appendChild(toast);

        // Force reflow and activate animation
        setTimeout(() => {
            toast.classList.add('active');
        }, 50);

        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
    }
});
