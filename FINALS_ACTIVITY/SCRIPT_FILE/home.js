class PortfolioApp {
    constructor() {
        this.data = null;
        this.currentTheme = localStorage.getItem("theme") || "dark";
        this.init();
    }

    async init() {
        this.applyTheme(this.currentTheme);
        await this.loadData();
        this.renderAll();
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setupScrollTop();
        this.animateOnScroll();
        this.hideLoader();
        this.initContactForm(); // Initialize enhanced contact form
    }

    applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        const icon = document.getElementById("themeIcon");
        if (icon) {
            icon.textContent = theme === "dark" ? "☀️" : "🌙";
        }
    }

    setupThemeToggle() {
        const toggle = document.getElementById("themeToggle");
        if (toggle) {
            toggle.addEventListener("click", () => {
                this.currentTheme = this.currentTheme === "dark" ? "light" : "dark";
                this.applyTheme(this.currentTheme);
                localStorage.setItem("theme", this.currentTheme);
            });
        }
    }

    // for connecting json file
    async loadData() {
        try {
            const response = await fetch("../SCRIPT_FILE/content.json");
            this.data = await response.json();
        } catch (error) {
            console.error("Error loading content:", error);
            // fallback data
            this.data = this.getFallbackData();
        }
    }
    
    renderAll() {
        this.renderNavigation();
        this.renderHeader();
        this.renderHero();
        this.renderSkills();
        this.renderStats();
        this.renderProjects();
        this.renderServices();
        this.renderFooter();
    }

    renderNavigation() {
        const brand = document.getElementById("navBrand");
        const menu = document.getElementById("navMenu");

        if (brand && this.data.header) {
            brand.innerHTML = `
                <img src="${this.data.header.logo}" alt="Logo" onerror="this.style.display='none'">
                <span>${this.data.header.name}</span>
            `;
        }

        if (menu && this.data.navigation) {
            menu.innerHTML = this.data.navigation
                .map(
                    (item) =>
                        `<li><a href="${item.href}" class="nav-link">${item.label}</a></li>`,
                )
                .join("");
        }
    }

    renderHeader() {
        const logoContainer = document.getElementById("logoContainer");
        const profileSection = document.getElementById("profileSection");

        if (logoContainer && this.data.header) {
            logoContainer.innerHTML = `
                <img src="${this.data.header.logo}" alt="Logo" class="logo-img">
                <div class="brand-text">
                    <h1>${this.data.header.name}</h1>
                    <p>${this.data.header.tagline}</p>
                </div>
            `;
        }

        if (profileSection && this.data.header) {
            profileSection.innerHTML = `
                <img src="${this.data.header.profileImage}" alt="Profile" class="profile-image">
            `;
        }
    }

    renderHero() {
        const background = document.getElementById("heroBackground");
        const content = document.getElementById("heroContent");

        if (background && this.data.hero) {
            background.style.backgroundImage = `url(${this.data.hero.backgroundImage})`;
        }

        if (content && this.data.hero) {
            content.innerHTML = `
                <div class="hero-badge">
                    <span>👋</span> Available for freelance work
                </div>
                <h2>${this.data.hero.welcomeMessage}</h2>
                <p class="subtitle">${this.data.hero.subtitle}</p>
                <p>${this.data.hero.description}</p>
                <div class="cta-group">
                    <a href="#projects" class="cta-button">${this.data.hero.ctaButton}</a>
                    <a href="#contact" class="cta-button secondary">${this.data.hero.secondaryCta || "Contact Me"}</a>
                </div>
            `;
        }
    }

    renderSkills() {
        const grid = document.getElementById("skillsGrid");
        if (!grid || !this.data.skills) return;

        grid.innerHTML = this.data.skills
            .map((skill) => {
                const dots = Array(5)
                    .fill(0)
                    .map(
                        (_, i) =>
                            `<div class="dot ${i < skill.level ? "active" : ""}"></div>`,
                    )
                    .join("");

                return `
                    <div class="skill-card" data-skill="${skill.name}">
                        <div class="skill-icon">
                            <img src="${skill.icon}" alt="${skill.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22><text x=%2225%22 y=%2235%22 text-anchor=%22middle%22 font-size=%2230%22>${skill.name[0]}</text></svg>'">
                        </div>
                        <h3>${skill.name}</h3>
                        <p>${skill.description}</p>
                        <div class="skill-level">
                            <div class="skill-dots">${dots}</div>
                        </div>
                    </div>
                `;
            })
            .join("");
    }

    renderStats() {
        const grid = document.getElementById("statsGrid");
        if (!grid || !this.data.stats) return;

        grid.innerHTML = this.data.stats
            .map(
                (stat) => `
                    <div class="stat-item">
                        <h4>${stat.value}</h4>
                        <p>${stat.label}</p>
                    </div>
                `,
            )
            .join("");
    }

    renderProjects() {
        const grid = document.getElementById("projectsGrid");
        if (!grid || !this.data.projects) return;

        grid.innerHTML = this.data.projects
            .map(
                (project) => `
                    <article class="project-card">
                        <div class="project-image-container">
                            <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
                            <div class="project-overlay">
                                <div onclick="location.window" class="project-overlay-content">
                                    <p><a class="project-link-text" href="${project.link}" target="_blank" rel="noopener">
                                    Click to view project</a></p>
                                </div>
                            </div>
                        </div>
                        <div class="project-content">
                            <span style="display: inline-block; padding: 0.25rem 0.75rem; background: rgba(102, 126, 234, 0.1); color: var(--primary-color); border-radius: 20px; font-size: 0.75rem; margin-bottom: 0.5rem;">${project.category}</span>
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="project-tech">
                                ${project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
                            </div>
                            <a href="${project.link}" class="project-link" target="_blank" rel="noopener">
                                View Project →
                            </a>
                        </div>
                    </article>
                `,
            )
            .join("");
    }

    renderServices() {
        const header = document.getElementById("servicesHeader");
        const grid = document.getElementById("servicesGrid");

        if (header && this.data.services) {
            header.innerHTML = `
                <span class="section-label">Services</span>
                <h2 class="section-title">${this.data.services.title}</h2>
                <p class="section-subtitle">${this.data.services.subtitle}</p>
            `;
        }

        if (grid && this.data.services) {
            grid.innerHTML = this.data.services.items
                .map(
                    (service) => `
                        <div class="service-card">
                            <span class="service-icon">${service.icon}</span>
                            <h3>${service.title}</h3>
                            <p>${service.description}</p>
                        </div>
                    `,
                )
                .join("");
        }
    }

    renderFooter() {
        const footer = document.getElementById("footer");
        if (!footer || !this.data.footer) return;

        const socialsHtml = this.data.footer.socials
            ? this.data.footer.socials
                .map(
                    (social) => `
                        <a href="${social.url}" target="_blank" rel="noopener" title="${social.platform}">
                            ${social.icon || social.platform[0]}
                        </a>
                    `,
                )
                .join("")
            : "";

        footer.innerHTML = `
            <div class="footer-content">
                <p>${this.data.footer.copyright}</p>
                <p>${this.data.footer.developer}</p>
                <a href="mailto:${this.data.footer.email}" class="footer-email">${this.data.footer.email}</a>
                <div class="social-links">${socialsHtml}</div>
            </div>
        `;
    }

    setupEventListeners() {
        const hamburger = document.getElementById("hamburger");
        const navMenu = document.getElementById("navMenu");

        if (hamburger && navMenu) {
            hamburger.addEventListener("click", () => {
                hamburger.classList.toggle("active");
                navMenu.classList.toggle("active");
            });

            // close menu when clicking link
            navMenu.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", () => {
                    hamburger.classList.remove("active");
                    navMenu.classList.remove("active");
                });
            });
        }

        const navbar = document.getElementById("navbar");
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    setupScrollTop() {
        const scrollTop = document.getElementById("scrollTop");
        if (!scrollTop) return;

        window.addEventListener("scroll", () => {
            if (window.scrollY > 500) {
                scrollTop.classList.add("visible");
            } else {
                scrollTop.classList.remove("visible");
            }
        });

        scrollTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, observerOptions);

        // observe all cards
        document
            .querySelectorAll(".skill-card, .project-card, .service-card, .stat-item")
            .forEach((el) => {
                el.style.opacity = "0";
                el.style.transform = "translateY(20px)";
                el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                observer.observe(el);
            });
    }

    hideLoader() {
        const loader = document.getElementById("loader");
        if (loader) {
            setTimeout(() => {
                loader.classList.add("hidden");
            }, 1000);
        }
    }

    // for contact
    initContactForm() {
        const form = document.getElementById('enhancedMessageForm');
        if (!form) return;
        
        const nameInput = document.getElementById('senderName');
        const emailInput = document.getElementById('senderEmail');
        const messageTextarea = document.getElementById('commentMessage');
        const submitBtn = document.getElementById('sendMsgBtn');
        const statusDiv = document.getElementById('formStatus');
        const DEV_EMAIL = "luzonjared5@gmail.com";

        // for showing show status with theme-aware styling
        const showStatus = (message, type = 'info') => {
            if (!statusDiv) return;
            statusDiv.style.display = 'flex';
            statusDiv.innerHTML = '';
            
            let icon = ' ';
            if (type ==='success') icon = '✅ ';
            else if (type === 'error') icon = '⚠️ ';
            else if (type === 'loading') icon = '⏳ ';
            else icon = '📨 ';
            
            statusDiv.innerHTML = `${icon} ${message}`;
            statusDiv.className = `status-message-modern ${type}`;
            
            if (type !== 'loading') {
                setTimeout(() => {
                    if (statusDiv) {
                        statusDiv.style.display = 'none';
                        statusDiv.className = 'status-message-modern';
                    }
                }, 5500);
            }
        };

        const hideStatus = () => {
            if (statusDiv) {
                statusDiv.style.display = 'none';
                statusDiv.className = 'status-message-modern';
            }
        };

        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
            return emailRegex.test(email);
        };
        
        const validateForm = () => {
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageTextarea.value.trim();

            if (!name) {
                showStatus("❌ Please enter your name.", "error");
                nameInput.focus();
                return false;
            }
            if (!email) {
                showStatus("❌ Please enter your email address.", "error");
                emailInput.focus();
                return false;
            }
            if (!isValidEmail(email)) {
                showStatus("❌ Please provide a valid email address (e.g., name@domain.com).", "error");
                emailInput.focus();
                return false;
            }
            if (!message) {
                showStatus("❌ Please write a comment or message before sending.", "error");
                messageTextarea.focus();
                return false;
            }
            if (message.length < 1) {
                showStatus("✏️ Message is too short. Please add at least a few words.", "error");
                return false;
            }
            return true;
        };

      // REPLACE this function in your home.js file:

    // for sending end message using formsubmit.com it provides a simple api for me and the person who view my portfolio
    const sendMessageViaFormSubmit = async (name, email, messageContent) => {
        const endpoint = `https://formsubmit.co/ajax/${DEV_EMAIL}`;
        const payload = {
            name: name,
            email: email,
            message: messageContent,
            _subject: ` Red Portfolio Message from ${name}`,
            _captcha: "false",
            _template: "box",
            _autoresponse: "Thank you for reaching out! I'll reply within 24 hours. — Red Luzon"
        };
        
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            // FIX: Check for both boolean true AND string "true" because FormSubmit returns string "true"
            const isSuccess = result.success === true || result.success === "true";
            
            if (response.ok && isSuccess) {
                return { success: true, message: "Message sent successfully! I'll get back to you soon." };
            } else {
                let errorMsg = result.message || "Unable to deliver. Please try again later or use the contact button.";
                return { success: false, message: errorMsg };
            }
        } catch (networkError) {
            console.error("Network error:", networkError);
            return { success: false, message: "Network error. Check your connection or try the 'Contact Me' button." };
        }
    };

        // main submit handler
        const handleFormSubmit = async (event) => {
            event.preventDefault();
            
            if (!validateForm()) return;
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const messageText = messageTextarea.value.trim();
            
            submitBtn.disabled = true;
            showStatus(" Sending your message to developer (luzonjared5@gmail.com)...", "loading");
            
            const result = await sendMessageViaFormSubmit(name, email, messageText);
            
            if (result.success) {
                form.reset();
                showStatus(result.message, "success");
                submitBtn.disabled = true;                
                statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                showStatus(`❌ ${result.message}`, "error");
                submitBtn.disabled = false;
                //for providing helpful hint
                if (statusDiv && !statusDiv.querySelector('.fallback-tip')) {
                    const tip = document.createElement('div');
                    tip.className = 'fallback-tip';
                    tip.style.marginTop = '0.5rem';
                    tip.style.fontSize = '0.8rem';
                    tip.style.opacity = '0.9';
                    tip.innerHTML = `💡 You can also use the <strong>"Contact Me"</strong> button above to open your email client directly.`;
                    statusDiv.appendChild(tip);
                }
            }
        };
        
        form.addEventListener('submit', handleFormSubmit);
        
        // clear status when user starts typing
        const allInputs = [nameInput, emailInput, messageTextarea];
        allInputs.forEach(input => {
            if (input) {
                input.addEventListener('focus', () => {
                    if (statusDiv && statusDiv.style.display !== 'none' && !statusDiv.classList.contains('loading')) {
                        hideStatus();
                    }
                });
            }
        });
        
        console.log("✅ Enhanced contact form active — messages sent to luzonjared5@gmail.com via FormSubmit");
    }
        };
        
document.addEventListener("DOMContentLoaded", () => {
    new PortfolioApp();
});