/* ==========================================================================
   ACADEMIA TENIS HITS (ATH) - INTERACTIVE JAVASCRIPT (ARGENTINA)
   Navegación Multi-Página, Autenticación, Control RBAC, Recuperación de Contraseña
   y Motor de CMS Visual Multi-Página con Escáner Dinámico de Atributos
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos Principales del DOM
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navActions = document.getElementById('navActions');
    const openModalBtn = document.getElementById('openModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const openBookingTriggers = document.querySelectorAll('.open-booking-trigger');
    const openRegisterTriggers = document.querySelectorAll('.open-register-trigger');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const courtSelect = document.getElementById('courtSelect');
    const loginAlertError = document.getElementById('loginAlertError');

    // Elementos del Modal Legal Secundario
    const legalModalOverlay = document.getElementById('legalModalOverlay');
    const legalModalCloseBtn = document.getElementById('legalModalCloseBtn');
    const legalAcceptBtn = document.getElementById('legalAcceptBtn');

    // Elementos de Recuperación de Contraseña (#tab-recovery)
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    const recoveryStep1Form = document.getElementById('recoveryStep1Form');
    const recoveryStep2Form = document.getElementById('recoveryStep2Form');
    const recAlertError = document.getElementById('recAlertError');
    const recAlertSuccess = document.getElementById('recAlertSuccess');

    let pendingCourtReservation = null;
    let recoveryState = {
        email: null,
        userId: null,
        code: null
    };

    // 1. EJECUCIÓN UNIVERSAL DE SESIÓN Y CMS (SIEMPRE AL INICIO ABSOLUTO PARA EVITAR BLOQUEOS)
    const activeUser = getActiveUser();
    renderUserNavbarState(activeUser);
    initCmsVisualEditor(activeUser);

    // Helper global para identificar la clave y nombre de la página actual
    function getPageInfo() {
        let path = window.location.pathname.toLowerCase();
        let filename = path.substring(path.lastIndexOf('/') + 1);
        if (!filename || filename === '' || filename === '/') {
            filename = 'index.html';
        }
        const key = filename.replace('.html', '');
        const mapNames = {
            'index': 'Inicio',
            'sede': 'Sede y Reservas',
            'noticias': 'Noticias',
            'clases': 'Clases',
            'torneos': 'Torneos',
            'construccion': 'Construcción',
            'historia': 'Historia'
        };
        return {
            key: key,
            name: mapNames[key] || 'Página Actual'
        };
    }

    // 2. Control de Desplazamiento de Cabecera & Active Link Handling
    function handleHeaderScroll() {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (sections.length > 0) {
            let currentSectionId = '';
            const scrollPosition = window.scrollY + 140;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    link.classList.remove('active');
                    if (href === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                }
            });
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();

    // 3. Menú Hamburguesa Móvil Universal (Delegación de eventos para máxima robustez)
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('#mobileToggle, .mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (toggleBtn && navMenu) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
            return;
        }

        const navLinkClick = e.target.closest('.nav-link');
        if (navLinkClick && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const toggle = document.querySelector('#mobileToggle, .mobile-toggle');
            if (toggle) {
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });


    // 4. FUNCIONES DE MODAL & CONTROL DE PESTAÑAS
    function openModal(tab = 'login', showBookingTab = false) {
        if (modalOverlay) {
            const bookingTabBtn = document.querySelector('.tab-btn[data-tab="booking"]');
            
            if (showBookingTab) {
                if (bookingTabBtn) bookingTabBtn.classList.remove('hidden-tab');
            } else {
                if (bookingTabBtn) bookingTabBtn.classList.add('hidden-tab');
            }

            switchTab(tab);
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function switchTab(tabName) {
        tabBtns.forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        tabContents.forEach(content => {
            if (content.id === `tab-${tabName}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        if (recAlertError) recAlertError.style.display = 'none';
        if (recAlertSuccess) recAlertSuccess.style.display = 'none';
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            if (loginAlertError) loginAlertError.style.display = 'none';
            openModal('login', false);
        });
    }

    openRegisterTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal('register', false);
        });
    });

    openBookingTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const courtId = btn.getAttribute('data-court') || btn.closest('[data-court]')?.getAttribute('data-court') || '1';
            openAppBookingModal(courtId);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });

    // Modal Legal Secundario
    function openLegalModal() {
        if (legalModalOverlay) legalModalOverlay.classList.add('active');
    }

    function closeLegalModal() {
        if (legalModalOverlay) legalModalOverlay.classList.remove('active');
    }

    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('terms-link')) {
            e.preventDefault();
            openLegalModal();
        }
    });

    if (legalModalCloseBtn) legalModalCloseBtn.addEventListener('click', closeLegalModal);
    if (legalAcceptBtn) {
        legalAcceptBtn.addEventListener('click', () => {
            const regTerms = document.getElementById('regTerms');
            if (regTerms) regTerms.checked = true;
            closeLegalModal();
        });
    }

    if (legalModalOverlay) {
        legalModalOverlay.addEventListener('click', (e) => {
            if (e.target === legalModalOverlay) closeLegalModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (legalModalOverlay && legalModalOverlay.classList.contains('active')) {
                closeLegalModal();
            } else if (modalOverlay && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        }
    });

    // Flujo de Recuperación de Contraseña (#tab-recovery)
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (recoveryStep1Form) recoveryStep1Form.style.display = 'flex';
            if (recoveryStep2Form) recoveryStep2Form.style.display = 'none';
            if (recAlertError) recAlertError.style.display = 'none';
            if (recAlertSuccess) recAlertSuccess.style.display = 'none';
            
            switchTab('recovery');
        });
    }

    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('login');
        });
    }

    if (recoveryStep1Form) {
        recoveryStep1Form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (recAlertError) recAlertError.style.display = 'none';
            if (recAlertSuccess) recAlertSuccess.style.display = 'none';

            const emailInput = document.getElementById('recEmail').value.trim();

            if (!emailInput) {
                showErrorAlert(recAlertError, 'Por favor, ingresá tu correo electrónico.');
                return;
            }

            try {
                const usuario = await window.DBHits.obtenerUsuarioPorEmail(emailInput);
                if (!usuario) {
                    showErrorAlert(recAlertError, 'No encontramos ninguna cuenta asociada a este correo.');
                    return;
                }

                const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
                recoveryState = {
                    email: emailInput.toLowerCase(),
                    userId: usuario.id,
                    code: generatedCode
                };

                console.log(`✉️ [SIMULACIÓN EMAIL ATH] Código para ${emailInput}: ${generatedCode}`);

                if (recAlertSuccess) {
                    recAlertSuccess.innerHTML = `
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <span><i class="fa-solid fa-envelope-circle-check"></i> Simulación de Email enviado desde <strong>no-reply@tenishits.com.ar</strong></span>
                            <span style="font-size: 1rem; font-weight: 800; color: #FFF;">Tu código de verificación es: <span style="color: var(--color-ath-orange); font-size: 1.2rem; letter-spacing: 2px;">${generatedCode}</span></span>
                        </div>
                    `;
                    recAlertSuccess.style.display = 'flex';
                }

                recoveryStep1Form.style.display = 'none';
                if (recoveryStep2Form) recoveryStep2Form.style.display = 'flex';

            } catch (error) {
                showErrorAlert(recAlertError, error.message);
            }
        });
    }

    if (recoveryStep2Form) {
        recoveryStep2Form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (recAlertError) recAlertError.style.display = 'none';

            const inputCode = document.getElementById('recCode').value.trim();
            const newPassword = document.getElementById('recNewPassword').value;

            if (!inputCode || !newPassword) {
                showErrorAlert(recAlertError, 'Por favor, completá el código de 6 dígitos y la nueva contraseña.');
                return;
            }

            if (inputCode !== recoveryState.code) {
                showErrorAlert(recAlertError, 'El código ingresado es incorrecto o ha vencido.');
                return;
            }

            try {
                await window.DBHits.actualizarPasswordUsuario(recoveryState.userId, newPassword);

                if (recAlertSuccess) {
                    recAlertSuccess.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Contraseña actualizada con éxito! Ya podés iniciar sesión.';
                    recAlertSuccess.style.display = 'flex';
                }

                recoveryStep2Form.reset();

                setTimeout(() => {
                    const loginEmailInput = document.getElementById('loginEmail');
                    if (loginEmailInput) loginEmailInput.value = recoveryState.email;
                    switchTab('login');
                }, 2000);

            } catch (error) {
                showErrorAlert(recAlertError, error.message);
            }
        });
    }

    // 5. GESTIÓN DE SESIÓN DE USUARIO & AUTENTICACIÓN RBAC (Usuario, Alumno, Admin)
    function getActiveUser() {
        if (window.DBHits && typeof window.DBHits.getActiveUser === 'function') {
            return window.DBHits.getActiveUser();
        }
        try {
            return JSON.parse(localStorage.getItem('ath_active_user')) || null;
        } catch {
            return null;
        }
    }

    function renderUserNavbarState(usuario) {
        const navActionsContainer = document.getElementById('navActions');

        if (usuario) {
            // 1. Ocultar todos los botones de creación de cuenta en el sitio (Hero y Banner)
            document.querySelectorAll('.open-register-trigger').forEach(btn => {
                btn.style.display = 'none';
            });

            // 2. Personalizar el Banner CTA inferior si estamos en index.html
            const ctaTitle = document.getElementById('ctaBannerTitle');
            const ctaDesc = document.getElementById('ctaBannerDesc');

            if (ctaTitle) {
                ctaTitle.innerHTML = `<i class="fa-solid fa-trophy" style="color: var(--color-ath-orange);"></i> ¿Listo para tu próximo partido, <span class="text-highlight">${usuario.nombre}</span>?`;
            }
            if (ctaDesc) {
                ctaDesc.innerHTML = `Tenés acceso directo a la disponibilidad en vivo del Club Ciudad Verde. Elegí tu cancha, programá tu turno minuto a minuto y prepará tus raquetas.`;
            }

            if (!navActionsContainer) return;

            let roleBadgeHtml = '';
            let adminBtnHtml = '';

            if (usuario.role === 'admin') {
                roleBadgeHtml = `<span class="user-role-tag tag-admin"><i class="fa-solid fa-shield-halved"></i> Admin</span>`;
                adminBtnHtml = `
                    <button class="btn-admin-panel" id="adminPanelBtn" title="Acceder al Panel de Administración">
                        <i class="fa-solid fa-bolt"></i><span class="hide-mobile"> Panel Admin</span>
                    </button>
                `;
            } else if (usuario.role === 'socio') {
                roleBadgeHtml = `<span class="user-role-tag tag-socio" style="background: rgba(59, 130, 246, 0.2); color: #60A5FA; border: 1px solid #3B82F6;"><i class="fa-solid fa-star"></i> Socio ATH</span>`;
            } else if (usuario.role === 'alumno') {
                roleBadgeHtml = `<span class="user-role-tag tag-alumno"><i class="fa-solid fa-graduation-cap"></i> Alumno ATH</span>`;
            } else {
                roleBadgeHtml = `<span class="user-role-tag tag-usuario"><i class="fa-solid fa-user"></i> Usuario</span>`;
            }

            const notificaciones = usuario.notificaciones || [];
            const unreadCount = notificaciones.filter(n => !n.leida).length;
            const badgeHtml = unreadCount > 0 ? `<span style="position: absolute; top: -5px; right: -8px; background: #EF4444; color: white; font-size: 0.65rem; font-weight: 800; padding: 2px 5px; border-radius: 50%;">${unreadCount}</span>` : '';

            navActionsContainer.innerHTML = `
                ${adminBtnHtml}
                <div class="user-badge-nav" style="display: flex; align-items: center;">
                    <a href="perfil.html" style="text-decoration: none; display: flex; align-items: center; gap: 8px;">
                        <img src="${usuario.avatarBase64 || 'assets/default-avatar.png'}" alt="Avatar" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-ath-orange);" onerror="this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png'">
                        <div class="user-info-text">
                            <span class="user-name" style="color: #FFF;">${usuario.nombre} ${usuario.apellido || ''}</span>
                            ${roleBadgeHtml}
                        </div>
                    </a>
                    
                    <a href="perfil.html?tab=notificaciones" class="nav-bell-icon" style="position: relative; margin-left: 15px; margin-right: 15px; color: #FFF; text-decoration: none; font-size: 1.2rem;">
                        <i class="fa-solid fa-bell"></i>
                        ${badgeHtml}
                    </a>

                    <button class="btn-logout" id="logoutBtn" title="Cerrar Sesión">
                        <i class="fa-solid fa-right-from-bracket"></i><span class="hide-mobile"> Salir</span>
                    </button>
                </div>
                <button class="mobile-toggle" id="mobileToggle" aria-label="Abrir menú">
                    <i class="fa-solid fa-bars"></i>
                </button>
            `;

            const adminPanelBtn = document.getElementById('adminPanelBtn');
            if (adminPanelBtn) {
                adminPanelBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openAdminPanel(usuario);
                });
            }

            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.DBHits && typeof window.DBHits.saveActiveUserSession === 'function') {
                        window.DBHits.saveActiveUserSession(null);
                    } else {
                        localStorage.removeItem('ath_active_user');
                    }
                    renderUserNavbarState(null);
                    initCmsVisualEditor(null);
                    window.location.href = 'index.html';
                });
            }

            // INYECTAR LOGOUT EN MENÚ HAMBURGUESA PARA MÓVILES
            const navList = document.querySelector('.nav-list');
            if (navList && !document.getElementById('mobileLogoutBtn')) {
                const logoutLi = document.createElement('li');
                logoutLi.className = 'nav-item mobile-logout-item';
                logoutLi.innerHTML = `<a href="#" class="nav-link" id="mobileLogoutBtn" style="color: #EF4444 !important; font-weight: bold;"><i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión</a>`;
                navList.appendChild(logoutLi);
                
                document.getElementById('mobileLogoutBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    if (logoutBtn) logoutBtn.click(); 
                });
            }
        } else {
            // Eliminar botón de logout móvil si existe
            const mobileLogoutItem = document.querySelector('.mobile-logout-item');
            if (mobileLogoutItem) mobileLogoutItem.remove();

            // Restaurar visibilidad por defecto si no hay sesión
            document.querySelectorAll('.open-register-trigger').forEach(btn => {
                btn.style.display = '';
            });

            if (navActionsContainer) {
                navActionsContainer.innerHTML = `
                    <button class="btn-cta" id="openModalBtn">
                        <i class="fa-solid fa-user"></i>
                        <span>Iniciar Sesión / Crear Cuenta</span>
                    </button>
                    <button class="mobile-toggle" id="mobileToggle" aria-label="Abrir menú">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                `;

                const openModalBtnDynamic = document.getElementById('openModalBtn');
                if (openModalBtnDynamic) {
                    openModalBtnDynamic.addEventListener('click', () => {
                        if (loginAlertError) loginAlertError.style.display = 'none';
                        openModal('login');
                    });
                }
            }
        }
    }

    function openAdminPanel(usuarioActual) {
        const usuario = usuarioActual || getActiveUser();

        if (!usuario || usuario.role !== 'admin') {
            alert('⛔ ACCESO DENEGADO: Se requieren privilegios de Administrador para acceder al Panel de Gestión de la Academia.');
            window.location.href = 'index.html';
            return;
        }

        window.location.href = 'admin.html';
    }

    function checkPagePermissions() {
        const currentPath = window.location.pathname.toLowerCase();
        if (currentPath.includes('admin.html')) {
            const activeUser = getActiveUser();
            if (!activeUser || activeUser.role !== 'admin') {
                alert('⛔ ACCESO DENEGADO: Se requieren privilegios de Administrador.');
                window.location.href = 'index.html';
            }
        }
    }

    checkPagePermissions();

    function showErrorAlert(containerElement, message) {
        if (containerElement) {
            containerElement.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
            containerElement.style.display = 'flex';
        } else {
            alert(`⚠️ ATH Atención: ${message}`);
        }
    }

    // 6. CONTROLADOR DE REGISTRO
    const registerForm = document.getElementById('registerForm');
    const regAlertError = document.getElementById('regAlertError');
    const regAlertSuccess = document.getElementById('regAlertSuccess');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (regAlertError) regAlertError.style.display = 'none';
            if (regAlertSuccess) regAlertSuccess.style.display = 'none';

            const regNombreEl = document.getElementById('regNombre');
            const regApellidoEl = document.getElementById('regApellido');
            const regDniEl = document.getElementById('regDni');
            const regEmailEl = document.getElementById('regEmail');
            const regTelefonoEl = document.getElementById('regTelefono');
            const regPasswordEl = document.getElementById('regPassword');
            const regConfirmPasswordEl = document.getElementById('regConfirmPassword');
            const regTermsEl = document.getElementById('regTerms');

            const nombre = regNombreEl ? regNombreEl.value.trim() : '';
            const apellido = regApellidoEl ? regApellidoEl.value.trim() : '';
            const dni = regDniEl ? regDniEl.value.trim() : '';
            const email = regEmailEl ? regEmailEl.value.trim() : '';
            const telefono = regTelefonoEl ? regTelefonoEl.value.trim() : '';
            const password = regPasswordEl ? regPasswordEl.value : '';
            const confirmPassword = regConfirmPasswordEl ? regConfirmPasswordEl.value : '';

            if (!nombre || !apellido || !dni || !email || !telefono || !password || !confirmPassword) {
                showErrorAlert(regAlertError, 'Por favor, completá todos los campos obligatorios del formulario.');
                return;
            }

            if (!/^\d{7,8}$/.test(dni)) {
                showErrorAlert(regAlertError, 'El DNI debe ser numérico y contener entre 7 y 8 dígitos sin puntos ni espacios.');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showErrorAlert(regAlertError, 'Por favor, ingresá una dirección de correo electrónico válida.');
                return;
            }

            if (password !== confirmPassword) {
                showErrorAlert(regAlertError, 'Las contraseñas no coinciden. Por favor, verifícalas.');
                return;
            }

            if (!regTermsEl || !regTermsEl.checked) {
                showErrorAlert(regAlertError, 'Debés marcar la casilla de aceptación de los Términos y Condiciones y la Política de Privacidad para registrarte.');
                return;
            }

            try {
                const nuevoUsuario = await window.DBHits.registrarUsuario({
                    nombre,
                    apellido,
                    dni,
                    email,
                    telefono,
                    password,
                    role: 'usuario'
                });

                if (regAlertSuccess) {
                    regAlertSuccess.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Cuenta creada con éxito! Ya podés iniciar sesión con tu Correo o DNI.';
                    regAlertSuccess.style.display = 'flex';
                } else {
                    alert(`🎾 ¡Bienvenido/a ${nuevoUsuario.nombre}! Tu cuenta ha sido registrada con éxito.`);
                }

                registerForm.reset();

                setTimeout(() => {
                    const loginEmailInput = document.getElementById('loginEmail');
                    if (loginEmailInput) loginEmailInput.value = email;
                    switchTab('login');
                }, 1500);

            } catch (error) {
                console.error("Error en registro de usuario:", error);
                showErrorAlert(regAlertError, error.message || "Error al procesar el registro de usuario.");
            }
        });
    }

    // 7. FORMULARIO DE INICIO DE SESIÓN
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (loginAlertError) loginAlertError.style.display = 'none';

            const identificadorInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');

            const identificador = identificadorInput ? identificadorInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!identificador || !password) {
                showErrorAlert(loginAlertError, 'Por favor, ingresá tu Correo o DNI y tu contraseña.');
                return;
            }

            try {
                const usuario = await window.DBHits.autenticarUsuario({ identificador, password });
                if (window.DBHits && typeof window.DBHits.saveActiveUserSession === 'function') {
                    window.DBHits.saveActiveUserSession(usuario);
                } else {
                    localStorage.setItem('ath_active_user', JSON.stringify(usuario));
                }

                renderUserNavbarState(usuario);
                initCmsVisualEditor(usuario);

                if (pendingCourtReservation) {
                    openModal('booking', true);
                    if (courtSelect) {
                        courtSelect.value = pendingCourtReservation;
                    }
                    pendingCourtReservation = null;
                } else {
                    closeModal();
                }

                setTimeout(() => {
                    if (usuario.role === 'admin') {
                        alert(`⚡ ¡Bienvenido Administrador ${usuario.nombre}! Se ha habilitado la opción "⚡ Panel de Administración" y el Botón Flotante "Modo Edición ATH".`);
                    } else if (usuario.role === 'alumno') {
                        alert(`🎾 ¡Bienvenido/a Alumno/a ${usuario.nombre}! Sesión iniciada con éxito.`);
                    } else {
                        alert(`¡Bienvenido/a de nuevo a Tenis Hits, ${usuario.nombre}!`);
                    }
                }, 200);

            } catch (error) {
                console.error("Error en inicio de sesión:", error);
                showErrorAlert(loginAlertError, error.message || "Error al autenticar usuario.");
            }
        });
    }

    // 8. APARICIÓN SUAVE DE SECCIONES (FADE-IN REVEAL)
    function initScrollReveal() {
        const revealTargets = document.querySelectorAll('.section-header, .court-card, .news-card, .class-card, .tournament-block-card, .history-card, .feature-box, .contact-card-item, .construction-banner-box');

        revealTargets.forEach(el => {
            el.classList.add('reveal-element');
        });

        const observerOptions = {
            threshold: 0.12,
            rootMargin: '0px 0px -30px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealTargets.forEach(el => revealObserver.observe(el));
    }

    initScrollReveal();

    // 9. ESCÁNER DINÁMICO DE ATRIBUTOS EDITABLES PARA CUALQUIER PÁGINA HTML
    function runDynamicCmsDomScanner(pageKey) {
        const rootEl = document.body;

        // Escanear casi todos los elementos textuales de la página
        const textElements = rootEl.querySelectorAll('h1, h2, h3, h4, h5, p, span, a, label, strong, li, .btn-hero-primary, .btn-hero-secondary, .btn-court-book, .btn-submit, .btn-cta, td, th, caption');

        let textIdx = 0;
        textElements.forEach(el => {
            // Ignorar elementos críticos del sistema, modales y el propio CMS
            if (el.closest('.modal-overlay') || el.closest('.legal-modal-overlay') || el.closest('#adminCmsFabWrapper') || el.closest('.nav-menu') && el.tagName === 'BUTTON') return;
            // Ignorar íconos y textos vacíos
            if (el.tagName === 'SPAN' && (el.classList.contains('live-dot') || el.innerHTML.trim() === '')) return;
            if (el.querySelector('i') && el.textContent.trim() === '') return;

            if (!el.getAttribute('data-editable')) {
                const tag = el.tagName.toLowerCase();
                const autoKey = `${pageKey}_auto_${tag}_${textIdx++}`;
                el.setAttribute('data-editable', autoKey);
            }
        });

        // Escanear todas las imágenes y contenedores de fondo
        const imgElements = rootEl.querySelectorAll('img, .hero-bg, .court-image-wrapper, .section-bg, .banner-bg');
        let imgIdx = 0;
        imgElements.forEach(el => {
            if (el.closest('.modal-overlay') || el.closest('.legal-modal-overlay') || el.closest('#adminCmsFabWrapper')) return;

            if (!el.getAttribute('data-editable-img')) {
                const autoImgKey = `${pageKey}_auto_img_${imgIdx++}`;
                el.setAttribute('data-editable-img', autoImgKey);
            }
        });
    }

    // 10. CONTROLADOR UNIVERSAL DE CMS MULTI-PÁGINA CON FAB DISCRETO (EXCLUSIVO ROLE: 'ADMIN')
    function initCmsVisualEditor(usuario) {
        if (!usuario || usuario.role !== 'admin') {
            const existingFab = document.getElementById('adminCmsFabWrapper');
            if (existingFab) existingFab.remove();
            document.body.classList.remove('cms-editing-active');
            return;
        }

        const pageInfo = getPageInfo();
        const pageKey = pageInfo.key;
        const pageName = pageInfo.name;

        // Ejecutar escáner dinámico en la página HTML actual
        runDynamicCmsDomScanner(pageKey);

        if (document.getElementById('adminCmsFabWrapper')) return;

        // Inyectar Botón Flotante Discreto (FAB) y Panel Popover Compacto
        const fabHtml = `
            <div class="cms-fab-wrapper" id="adminCmsFabWrapper">
                <div class="cms-popover-panel" id="cmsPopoverPanel">
                    <div style="font-size: 0.78rem; font-weight: 800; color: #FFD700; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 8px;">
                        <span><i class="fa-solid fa-shield-halved"></i> Admin ATH</span>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span style="font-size: 0.7rem; color: var(--color-ath-orange); background: rgba(255,102,0,0.15); padding: 2px 6px; border-radius: 4px;">${pageName}</span>
                            <button id="cmsPopoverCloseBtn" style="background: none; border: none; color: #94A3B8; font-size: 1.4rem; cursor: pointer; padding: 0 4px; line-height: 1;">&times;</button>
                        </div>
                    </div>
                    
                    <div id="cmsInactiveControls" style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="btn-submit" id="cmsEnableEditBtn" style="padding: 10px; font-size: 0.85rem; border-radius: 8px; margin-top: 2px;">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> 🛠️ Activar Modo Edición
                        </button>
                    </div>

                    <div id="cmsActiveControls" style="display: none; flex-direction: column; gap: 8px;">
                        <button class="cms-save-btn" id="cmsSaveBtn" style="width: 100%; justify-content: center; padding: 10px; font-size: 0.85rem; border-radius: 8px;">
                            <i class="fa-solid fa-floppy-disk"></i> 💾 Guardar en ${pageName}
                        </button>
                        <button class="btn-submit" id="cmsExitEditBtn" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #EF4444; color: #FCA5A5; padding: 9px; font-size: 0.85rem; border-radius: 8px; box-shadow: none; margin-top: 0;">
                            <i class="fa-solid fa-xmark"></i> ❌ Salir del Modo Edición
                        </button>
                        <button class="cms-reset-btn" id="cmsResetBtn" style="justify-content: center; width: 100%; padding: 6px; font-size: 0.78rem; border-radius: 6px;">
                            <i class="fa-solid fa-rotate-left"></i> Restablecer de Fábrica
                        </button>
                    </div>
                </div>

                <button class="cms-fab-btn" id="cmsFabMainBtn" aria-label="Modo Edición ATH">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span class="cms-fab-tooltip">Modo Edición &bull; ${pageName}</span>
                </button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', fabHtml);

        const cmsFabMainBtn = document.getElementById('cmsFabMainBtn');
        const cmsPopoverPanel = document.getElementById('cmsPopoverPanel');
        const cmsEnableEditBtn = document.getElementById('cmsEnableEditBtn');
        const cmsExitEditBtn = document.getElementById('cmsExitEditBtn');
        const cmsSaveBtn = document.getElementById('cmsSaveBtn');
        const cmsResetBtn = document.getElementById('cmsResetBtn');

        const cmsInactiveControls = document.getElementById('cmsInactiveControls');
        const cmsActiveControls = document.getElementById('cmsActiveControls');

        let tempImagesMap = {};

        // Abrir / Cerrar Popover con el FAB
        if (cmsFabMainBtn) {
            cmsFabMainBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (cmsPopoverPanel) cmsPopoverPanel.classList.toggle('active');
            });
        }
        
        const cmsPopoverCloseBtn = document.getElementById('cmsPopoverCloseBtn');
        if (cmsPopoverCloseBtn) {
            cmsPopoverCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (cmsPopoverPanel) cmsPopoverPanel.classList.remove('active');
            });
        }

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            const fabWrapper = document.getElementById('adminCmsFabWrapper');
            if (fabWrapper && !fabWrapper.contains(e.target) && cmsPopoverPanel) {
                cmsPopoverPanel.classList.remove('active');
            }
        });

        // Alternar Estado de Edición Visual
        function setVisualEditingState(active) {
            if (active) {
                document.body.classList.add('cms-editing-active');
                if (cmsPopoverPanel) cmsPopoverPanel.classList.add('editing-mode-on');
                if (cmsInactiveControls) cmsInactiveControls.style.display = 'none';
                if (cmsActiveControls) cmsActiveControls.style.display = 'flex';
            } else {
                document.body.classList.remove('cms-editing-active');
                if (cmsPopoverPanel) cmsPopoverPanel.classList.remove('editing-mode-on');
                if (cmsInactiveControls) cmsInactiveControls.style.display = 'flex';
                if (cmsActiveControls) cmsActiveControls.style.display = 'none';
            }

            // 1. Alternar contenteditable en textos
            document.querySelectorAll('[data-editable]').forEach(el => {
                if (active) el.setAttribute('contenteditable', 'true');
                else el.removeAttribute('contenteditable');
            });
            // 2. Alternar botones de cámara flotantes
            document.querySelectorAll('[data-editable-img]').forEach(el => {
                let container = el.tagName === 'IMG' ? el.parentElement : el;
                
                if (active) {
                    if (!container.querySelector('.cms-img-overlay-btn')) {
                        const imgKey = el.getAttribute('data-editable-img');
                        container.classList.add('cms-img-wrapper-relative');

                        const camBtn = document.createElement('button');
                        camBtn.className = 'cms-img-overlay-btn';
                        camBtn.innerHTML = '<i class="fa-solid fa-camera"></i> Cambiar Imagen';

                        camBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();

                            const fileInput = document.createElement('input');
                            fileInput.type = 'file';
                            fileInput.accept = 'image/*';

                            fileInput.addEventListener('change', async (event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    const base64Data = await window.DBHits.convertFileToBase64(file);
                                    if (el.tagName === 'IMG') el.src = base64Data;
                                    else el.style.backgroundImage = `url("${base64Data}")`;

                                    tempImagesMap[imgKey] = base64Data;
                                    window.DBHits.guardarImagenCMS(imgKey, base64Data, pageKey);
                                    showCmsToast(`📷 Imagen de ${pageName} actualizada y guardada.`);
                                }
                            });

                            fileInput.click();
                        });

                        container.appendChild(camBtn);
                    }
                } else {
                    const existingCamBtn = container.querySelector('.cms-img-overlay-btn');
                    if (existingCamBtn) existingCamBtn.remove();
                    container.classList.remove('cms-img-wrapper-relative');
                }
            });
        }

        // Interceptar clicks en modo edicion para evitar acciones por defecto en botones/enlaces
        // Lo ponemos FUERA de setVisualEditingState para no registrarlo múltiples veces
        if (!window._cmsClickInterceptorAdded) {
            document.addEventListener('click', (e) => {
                if (document.body.classList.contains('cms-editing-active')) {
                    const editableEl = e.target.closest('[data-editable]');
                    if (editableEl) {
                        if (editableEl.tagName === 'A' || editableEl.tagName === 'BUTTON' || editableEl.closest('a') || editableEl.closest('button')) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                        }
                    }
                }
            }, true);
            window._cmsClickInterceptorAdded = true;
        }

        if (cmsEnableEditBtn) {
            cmsEnableEditBtn.addEventListener('click', () => {
                setVisualEditingState(true);
                showCmsToast(`🛠️ Modo Edición Activado en ${pageName}. Podés modificar cualquier texto o imagen.`);
            });
        }

        if (cmsExitEditBtn) {
            cmsExitEditBtn.addEventListener('click', () => {
                setVisualEditingState(false);
                if (cmsPopoverPanel) cmsPopoverPanel.classList.remove('active');
                showCmsToast('Has salido del modo edición. Ahora visualizas la web como un usuario estándar.');
            });
        }

        if (cmsSaveBtn) {
            cmsSaveBtn.addEventListener('click', async () => {
                // 1. Guardar en localStorage (Fallback y persistencia base)
                const textsMap = {};
                document.querySelectorAll('[data-editable]').forEach(el => {
                    const key = el.getAttribute('data-editable');
                    if (key) textsMap[key] = el.innerHTML.trim();
                });

                window.DBHits.guardarLoteCMS(textsMap, tempImagesMap, {}, pageKey);
                
                // 2. Intentar guardar en código fuente si el Servidor Python está corriendo
                let extraMsg = '';
                try {
                    const clonedHtml = document.documentElement.cloneNode(true);
                    clonedHtml.querySelector('body').classList.remove('cms-editing-active');
                    const cmsWrapper = clonedHtml.querySelector('#adminCmsFabWrapper');
                    if (cmsWrapper) cmsWrapper.remove();
                    clonedHtml.querySelectorAll('.cms-img-overlay-btn').forEach(btn => btn.remove());
                    clonedHtml.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
                    clonedHtml.querySelectorAll('.cms-img-wrapper-relative').forEach(el => el.classList.remove('cms-img-wrapper-relative'));
                    
                    const doctype = "<!DOCTYPE html>\n";
                    const finalHtml = doctype + clonedHtml.outerHTML;
                    
                    const filename = pageKey === 'index' ? 'index.html' : pageKey + '.html';
                    
                    const res = await fetch('/api/save-html', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ filename, html: finalHtml })
                    });
                    
                    if (res.ok) {
                        extraMsg = '<br><span style="color:#10B981;font-size:0.8rem;">✓ Código fuente (.html) actualizado vía Servidor Python</span>';
                    }
                } catch (e) {
                    // Servidor Python no está corriendo, no hacemos nada extra
                }

                showCmsToast(`💾 ¡Cambios guardados en ${pageName}!${extraMsg}`);
            });
        }

        if (cmsResetBtn) {
            cmsResetBtn.addEventListener('click', () => {
                if (confirm('🔄 ¿Estás seguro de que querés borrar todas las personalizaciones y devolver la web al diseño de fábrica original?')) {
                    window.DBHits.resetToDefaults();
                }
            });
        }
    }

    // Helper de Notificación Toast Flotante
    function showCmsToast(message) {
        const existingToast = document.querySelector('.cms-toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'cms-toast-notification';
        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i> <span>${message}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    /* ==========================================================================
       11. MODAL UNIFICADO 2 COLUMNAS (DETALLE + RESERVA INTERACTIVA) (#modalReservaUnificada)
       ========================================================================== */
    const modalReservaUnificada = document.getElementById('modalReservaUnificada');
    const closeUnifiedModalBtn = document.getElementById('closeUnifiedModalBtn');
    const unifiedCourtName = document.getElementById('unifiedCourtName');
    const unifiedCourtImg = document.getElementById('unifiedCourtImg');
    const unifiedCourtSpecsList = document.getElementById('unifiedCourtSpecsList');

    const widgetCourtBadge = document.getElementById('widgetCourtBadge');
    const widgetDatePills = document.getElementById('widgetDatePills');
    const widgetDayTimelineGrid = document.getElementById('widgetDayTimelineGrid');
    const widgetTimeStart = document.getElementById('widgetTimeStart') || document.getElementById('customStart');
    const widgetTimeEnd = document.getElementById('widgetTimeEnd') || document.getElementById('customEnd');
    const widgetQuickDurBtns = document.getElementById('widgetQuickDurBtns');
    const widgetPriceSummary = document.getElementById('widgetPriceSummary');
    const widgetSummaryStatus = document.getElementById('widgetSummaryStatus');
    const widgetSummaryDetails = document.getElementById('widgetSummaryDetails');
    const widgetSummaryLighting = document.getElementById('widgetSummaryLighting');
    const widgetSummaryPrice = document.getElementById('widgetSummaryPrice');
    const widgetConfirmBtn = document.getElementById('widgetConfirmBtn');

    let currentWidgetCourt = '1';
    let currentWidgetDate = new Date().toISOString().split('T')[0];

    const courtDataMap = {
        '1': {
            nombre: 'Cancha 1 (Estadio Principal)',
            img: 'assets/cancha1.jpg',
            specs: [
                'Superficie reglamentaria de polvo de ladrillo con drenaje rápido.',
                'Iluminación LED Pro de 1000W para partidos nocturnos televisados.',
                'Tribuna lateral exclusiva y sector de sombra para jugadores.',
                'Mantenimiento continuo y rastreado automatizado post-partido.'
            ]
        },
        '2': {
            nombre: 'Cancha 2 - Central',
            img: 'assets/cancha2.jpg',
            specs: [
                'Polvo de ladrillo con grado de compactación ideal para entrenamiento.',
                'Medidas oficiales ITF con espaciado amplio para dobles.',
                'Iluminación nocturna LED de alta uniformidad.',
                'Mantenimiento diario de riego y cepillado.'
            ]
        },
        '3': {
            nombre: 'Cancha 3 - Torneos',
            img: 'assets/cancha3.jpg',
            specs: [
                'Ubicada en el sector tranquilo cercano a la terraza del club.',
                'Superficie óptima con excelente respuesta al pique de bola.',
                'Iluminación LED ambiental continua.',
                'Sector cercano a vestuarios e hidratación.'
            ]
        }
    };

    // 8. CONTROLADOR DE MODAL DE RESERVA INTERACTIVA ATH (#modalReservaApp / #modalReservaUnificada)
    function openAppBookingModal(courtId) {
        currentWidgetCourt = String(courtId || '1');
        const modalApp = document.getElementById('modalReservaApp') || document.getElementById('modalReservaUnificada');
        if (!modalApp) return;

        const imgEl = document.getElementById('appCourtImg') || document.getElementById('unifiedCourtImg');
        const nameEl = document.getElementById('appCourtName') || document.getElementById('unifiedCourtName');
        const badgeEl = document.getElementById('appCourtBadge') || document.getElementById('widgetCourtBadge');

        const courtDataMap = {
            '1': { nombre: 'Cancha 1 (Polvo de Ladrillo)', img: 'assets/cancha1.jpg' },
            '2': { nombre: 'Cancha 2 (Polvo de Ladrillo)', img: 'assets/cancha2.jpg' },
            '3': { nombre: 'Cancha 3 (Polvo de Ladrillo)', img: 'assets/cancha3.jpg' }
        };

        const data = courtDataMap[currentWidgetCourt] || courtDataMap['1'];
        if (imgEl) imgEl.src = data.img;
        if (nameEl) nameEl.textContent = data.nombre;
        if (badgeEl) badgeEl.textContent = `Polvo de Ladrillo • Cancha ${currentWidgetCourt}`;

        // Garantizar presencia del aviso climático institucional en el modal
        const confirmBtn = document.getElementById('appConfirmBtn') || document.getElementById('widgetConfirmBtn');
        const paymentCard = document.getElementById('paymentTransferCard');
        const targetAnchor = paymentCard || confirmBtn;
        let weatherNotice = document.getElementById('appWeatherNotice');
        if (!weatherNotice && targetAnchor && targetAnchor.parentNode) {
            weatherNotice = document.createElement('div');
            weatherNotice.id = 'appWeatherNotice';
            weatherNotice.style.cssText = "background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 10px; margin-bottom: 14px; display: flex; align-items: flex-start; gap: 10px;";
            weatherNotice.innerHTML = `
                <i class="fa-solid fa-cloud-sun-rain" style="color: #60A5FA; font-size: 1.2rem; margin-top: 2px;"></i>
                <div style="font-size: 0.76rem; color: #E2E8F0; line-height: 1.3;">
                    <strong style="color: #93C5FD; display: block; margin-bottom: 2px;">🌦️ Reservas sujetas a condiciones climáticas</strong>
                    Al tratarse de canchas descubiertas de polvo de ladrillo, la jugabilidad depende del buen tiempo. En caso de lluvia o fuerza mayor, comunicate con la administración para reprogramar tu turno sin perder tu dinero.
                </div>
            `;
            targetAnchor.parentNode.insertBefore(weatherNotice, targetAnchor);
        }

        renderWidgetDatePills();
        renderWidgetDayTimelineGrid();
        calculateAndVerifyMinuteByMinute();

        modalApp.classList.add('active');
        modalApp.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeAppBookingModal() {
        const modalApp = document.getElementById('modalReservaApp') || document.getElementById('modalReservaUnificada');
        if (modalApp) {
            modalApp.classList.remove('active');
            modalApp.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Amarrar con Delegación de Eventos Resiliente a todos los botones de reserva del sitio
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.open-booking-trigger, .btn-court-book, .view-court-trigger');
        if (trigger) {
            if (e.target.closest('.cms-img-edit-overlay') || e.target.closest('.cms-floating-editor-bar')) return;
            e.preventDefault();
            e.stopPropagation();

            const courtId = trigger.getAttribute('data-court') || trigger.closest('[data-court]')?.getAttribute('data-court') || '1';
            openAppBookingModal(courtId);
        }
    });

    const closeAppModalBtn = document.getElementById('closeAppModalBtn') || document.getElementById('closeUnifiedModalBtn');
    if (closeAppModalBtn) {
        closeAppModalBtn.addEventListener('click', closeAppBookingModal);
    }

    window.addEventListener('click', (e) => {
        const modalApp = document.getElementById('modalReservaApp') || document.getElementById('modalReservaUnificada');
        if (modalApp && e.target === modalApp) {
            closeAppBookingModal();
        }
    });

    function pintarBotonSeleccionado(todosLosBotones, botonActivo) {
        if (!todosLosBotones) return;
        todosLosBotones.forEach(btn => {
            // Estado INACTIVO (Apagado / Gris oscuro)
            btn.style.background = "rgba(255, 255, 255, 0.06)";
            btn.style.border = "1px solid rgba(255, 255, 255, 0.15)";
            btn.style.color = "#CBD5E1";
            btn.style.boxShadow = "none";
            btn.style.transform = "none";
            btn.style.fontWeight = "500";
            btn.classList.remove('active');
        });

        if (botonActivo) {
            // Estado ACTIVO / SELECCIONADO (Naranja vibrante, Borde Dorado y Glow)
            botonActivo.style.background = "linear-gradient(135deg, #FF6600 0%, #FF8800 100%)";
            botonActivo.style.border = "2px solid #FFD700"; // Borde amarillo oro bien grueso
            botonActivo.style.color = "#FFFFFF";
            botonActivo.style.boxShadow = "0 0 15px rgba(255, 102, 0, 0.8), inset 0 0 8px rgba(255, 255, 255, 0.3)";
            botonActivo.style.transform = "translateY(-2px)";
            botonActivo.style.fontWeight = "900";
            botonActivo.classList.add('active');
        }
    }

    function renderWidgetDatePills() {
        const datePillsContainer = document.getElementById('appDatePills') || document.getElementById('widgetDatePills');
        if (!datePillsContainer) return;

        const days = [];
        const today = new Date();
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);
            const iso = d.toISOString().split('T')[0];
            const name = i === 0 ? 'Hoy' : diasSemana[d.getDay()];
            const num = d.getDate();
            days.push({ iso, name, num });
        }

        datePillsContainer.innerHTML = days.map(d => `
            <button type="button" class="date-pill-btn ${d.iso === currentWidgetDate ? 'active' : ''}" data-date="${d.iso}">
                <span>${d.name}</span>
                <span style="font-size: 1rem; font-weight: 900;">${d.num}</span>
            </button>
        `).join('');

        const dateBtns = datePillsContainer.querySelectorAll('.date-pill-btn');
        const botonFechaActiva = Array.from(dateBtns).find(b => b.dataset.date === currentWidgetDate);
        pintarBotonSeleccionado(dateBtns, botonFechaActiva);

        dateBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentWidgetDate = btn.dataset.date;
                pintarBotonSeleccionado(dateBtns, btn);
                renderWidgetDatePills();
                renderWidgetDayTimelineGrid();
                calculateAndVerifyMinuteByMinute();
            });
        });
    }

    async function renderWidgetDayTimelineGrid() {
        const gridContainer = document.getElementById('appDayTimelineGrid') || document.getElementById('widgetDayTimelineGrid');
        if (!gridContainer) return;
        gridContainer.innerHTML = '<span style="color:var(--color-text-muted); font-size:0.85rem;">Cargando estado de la cancha...</span>';

        try {
            const reservasDia = await window.DBHits.listarReservas();
            
            // CORRECCIÓN: Filtrar también los turnos que fueron rechazados o cancelados
            const reservasCancha = reservasDia.filter(r => {
                const estado = String(r.estadoPago || '');
                return String(r.canchaId) === String(currentWidgetCourt) && 
                       r.fecha === currentWidgetDate &&
                       !estado.includes('Rechazado') && 
                       !estado.includes('Cancelado') && 
                       !estado.includes('❌');
            });

            if (reservasCancha.length === 0) {
                gridContainer.innerHTML = `
                    <div style="color: #10B981; font-weight: 700; font-size: 0.88rem; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-circle-check"></i> Cancha 100% despejada en todo el día (08:00 a 23:00 hs).
                    </div>
                `;
                return;
            }

            let html = '<div style="display: flex; gap: 8px; flex-wrap: wrap;">';
            reservasCancha.forEach(r => {
                const isLock = r.tipo === 'bloqueo_admin';
                const label = isLock ? `🚫 Bloqueo: ${r.motivo || 'Uso Interno'}` : `🎾 Reservado`;
                html += `
                    <span class="occupancy-slot-pill busy">
                        ${label} (${r.horaInicio} a ${r.horaFin} hs)
                    </span>
                `;
            });
            html += '</div>';

            gridContainer.innerHTML = html;

        } catch (err) {
            console.error("Error al renderizar línea de tiempo del widget:", err);
            gridContainer.innerHTML = '<span style="color:var(--color-text-muted); font-size:0.85rem;">Sin reservas registradas para hoy.</span>';
        }
    }

    function formatFriendlyDate(isoDateStr) {
        if (!isoDateStr) return '';
        const parts = isoDateStr.split('-');
        if (parts.length !== 3) return isoDateStr;
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const diaNombre = dias[d.getDay()];
        const mesNombre = meses[d.getMonth()];
        return `${diaNombre} ${day} de ${mesNombre}`;
    }

    function calculateAndVerifyMinuteByMinute() {
        const timeStart = document.getElementById('appTimeStart') || document.getElementById('widgetTimeStart');
        const timeEnd = document.getElementById('appTimeEnd') || document.getElementById('widgetTimeEnd');
        const priceSummary = document.getElementById('appPriceSummary') || document.getElementById('widgetPriceSummary');
        const confirmBtn = document.getElementById('appConfirmBtn') || document.getElementById('widgetConfirmBtn');

        const summaryStatus = document.getElementById('appSummaryStatus') || document.getElementById('widgetSummaryStatus');
        const summaryDetails = document.getElementById('appSummaryDetails') || document.getElementById('widgetSummaryDetails');
        const summaryLighting = document.getElementById('appSummaryLighting') || document.getElementById('widgetSummaryLighting');
        const summaryPrice = document.getElementById('appSummaryPrice') || document.getElementById('widgetSummaryPrice');
        const courtBadge = document.getElementById('appCourtBadge') || document.getElementById('widgetCourtBadge');

        if (!timeStart || !timeEnd || !priceSummary || !confirmBtn) return;

        const horaInicio = timeStart.value || '16:00';
        const horaFin = timeEnd.value || '17:30';

        const startMin = timeStringToMinutes(horaInicio);
        const endMin = timeStringToMinutes(horaFin);
        const duracionHoras = (endMin - startMin) / 60;

        // Sincronizar resaltado activo de los botones de duración rápida por Fuerza Bruta
        const quickDurContainer = document.getElementById('appQuickDurBtns') || document.getElementById('widgetQuickDurBtns');
        if (quickDurContainer) {
            const quickBtns = quickDurContainer.querySelectorAll('.quick-dur-btn');
            const botonMatch = Array.from(quickBtns).find(b => Math.abs(duracionHoras - parseFloat(b.dataset.hours)) < 0.02);
            pintarBotonSeleccionado(quickBtns, botonMatch || null);
        }

        const fechaFormateada = formatFriendlyDate(currentWidgetDate);

        if (endMin <= startMin) {
            priceSummary.className = 'booking-summary-card occupied status-busy';
            if (summaryStatus) summaryStatus.innerHTML = '❌ La hora de finalización debe ser posterior a la de inicio';
            if (summaryDetails) summaryDetails.innerHTML = 'Horario inválido';
            if (summaryLighting) summaryLighting.innerHTML = '-';
            if (summaryPrice) summaryPrice.innerHTML = '$0 ARS';
            if (courtBadge) courtBadge.innerHTML = '🔴 Horario Inválido';
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            return;
        }

        if (startMin < 480 || endMin > 1380) {
            priceSummary.className = 'booking-summary-card occupied status-busy';
            if (summaryStatus) summaryStatus.innerHTML = '❌ El complejo opera únicamente entre las 08:00 y las 23:00 hs';
            if (summaryDetails) summaryDetails.innerHTML = 'Fuera de rango operativo';
            if (summaryLighting) summaryLighting.innerHTML = '-';
            if (summaryPrice) summaryPrice.innerHTML = '$0 ARS';
            if (courtBadge) courtBadge.innerHTML = '🔴 Fuera de Horario';
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            return;
        }

        const chequeo = window.DBHits.verificarDisponibilidad(currentWidgetCourt, currentWidgetDate, horaInicio, horaFin);

        if (!chequeo.disponible) {
            priceSummary.className = 'booking-summary-card occupied status-busy';
            if (courtBadge) courtBadge.innerHTML = '🔴 Turno Solapado';
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';

            let statusHTML = `<div>❌ ${chequeo.mensaje}</div>`;

            // Buscar recomendaciones inteligentes libres ante conflicto
            if (window.DBHits && typeof window.DBHits.obtenerSugerenciasLibres === 'function') {
                const sugerencias = window.DBHits.obtenerSugerenciasLibres(currentWidgetCourt, currentWidgetDate, horaInicio, duracionHoras);
                if (sugerencias && sugerencias.length > 0) {
                    statusHTML += `
                        <div id="appSuggestionsBox" style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(239, 68, 68, 0.4);">
                            <span style="color: #FCA5A5; font-size: 0.78rem; font-weight: 800; display: block; margin-bottom: 6px;">🔥 Opciones libres recomendadas para vos:</span>
                            <div style="display: flex; flex-direction: column; gap: 6px;">
                                ${sugerencias.map(s => `
                                    <button type="button" class="btn-suggestion-item" data-cancha="${s.canchaId}" data-inicio="${s.horaInicio}" data-fin="${s.horaFin}" style="background: rgba(255, 102, 0, 0.18); border: 1px solid var(--color-ath-orange); color: #FFF; padding: 6px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; text-align: left; cursor: pointer; transition: all 0.2s ease;">
                                        ${s.texto}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }
            }

            if (summaryStatus) summaryStatus.innerHTML = statusHTML;
        } else {
            priceSummary.className = 'booking-summary-card available status-available';
            if (summaryStatus) summaryStatus.innerHTML = `🟢 Horario 100% Libre y Disponible`;
            if (courtBadge) courtBadge.innerHTML = '🟢 Cancha Disponible';
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
        }

        try {
            const activeUser = getActiveUser();
            const userRole = activeUser ? activeUser.role : 'usuario';
            const calculo = window.DBHits.calcularPrecioReserva(horaInicio, duracionHoras, userRole);

            let detalleIluminacion = 'Turno Diurno';
            if (calculo.horasDia > 0 && calculo.horasNoche > 0) {
                detalleIluminacion = `Turno Mixto (${calculo.horasDia.toFixed(1)}h Día + ${calculo.horasNoche.toFixed(1)}h Noche LED)`;
            } else if (calculo.horasNoche > 0) {
                detalleIluminacion = `Turno Nocturno (Incluye Luz LED)`;
            }

            if (summaryDetails) {
                summaryDetails.innerHTML = `
                    <div style="background: rgba(0,0,0,0.3); padding: 8px 10px; border-radius: 6px; margin: 6px 0; border-left: 3px solid var(--color-ath-orange);">
                        <div style="color: #FFF; font-weight: 700; font-size: 0.88rem;">🎾 Cancha: <span style="color: #FFD700;">Cancha ${currentWidgetCourt}</span></div>
                        <div style="color: #FFF; font-weight: 700; font-size: 0.88rem;">📅 Día: <span style="color: #FFD700;">${fechaFormateada}</span></div>
                        <div style="color: #FFF; font-weight: 700; font-size: 0.88rem;">⏰ Horario: <span style="color: #FFD700;">${horaInicio} a ${horaFin} hs</span> (${duracionHoras.toFixed(2)} hs)</div>
                    </div>
                `;
            }
            if (summaryLighting) summaryLighting.innerHTML = `<i class="fa-solid fa-bolt" style="color:#FFD700;"></i> ${detalleIluminacion}`;
            if (summaryPrice) summaryPrice.innerHTML = `$${calculo.precioTotal.toLocaleString('es-AR')} ARS`;

        } catch (err) {
            console.error("Error al calcular cotización libre:", err);
        }
    }

    // Escuchador interactivo para las sugerencias de canchas/horarios libres
    document.addEventListener('click', (e) => {
        const btnSug = e.target.closest('.btn-suggestion-item');
        if (btnSug) {
            const cId = btnSug.dataset.cancha;
            const hInicio = btnSug.dataset.inicio;
            const hFin = btnSug.dataset.fin;

            if (cId) {
                currentWidgetCourt = cId;
                const appCourtName = document.getElementById('appCourtName');
                if (appCourtName) appCourtName.innerText = `Cancha ${cId} (Polvo de Ladrillo)`;
            }

            const timeStartInput = document.getElementById('appTimeStart') || document.getElementById('widgetTimeStart');
            const timeEndInput = document.getElementById('appTimeEnd') || document.getElementById('widgetTimeEnd');
            if (timeStartInput) timeStartInput.value = hInicio;
            if (timeEndInput) timeEndInput.value = hFin;

            renderWidgetDayTimelineGrid();
            calculateAndVerifyMinuteByMinute();
        }
    });

    // Escucha en tiempo real de los relojes digitales de escritura libre
    const timeStartInput = document.getElementById('appTimeStart') || document.getElementById('widgetTimeStart');
    const timeEndInput = document.getElementById('appTimeEnd') || document.getElementById('widgetTimeEnd');

    if (timeStartInput) {
        timeStartInput.addEventListener('input', calculateAndVerifyMinuteByMinute);
        timeStartInput.addEventListener('change', calculateAndVerifyMinuteByMinute);
    }

    if (timeEndInput) {
        timeEndInput.addEventListener('input', calculateAndVerifyMinuteByMinute);
        timeEndInput.addEventListener('change', calculateAndVerifyMinuteByMinute);
    }

    // Sugerencias rápidas de duración que asisten pero no bloquean la escritura libre
    const quickDurBtnsContainer = document.getElementById('appQuickDurBtns') || document.getElementById('widgetQuickDurBtns');
    if (quickDurBtnsContainer) {
        const quickBtns = quickDurBtnsContainer.querySelectorAll('.quick-dur-btn');
        const defaultMatch = Array.from(quickBtns).find(b => parseFloat(b.dataset.hours) === 1.5) || quickBtns[0];
        pintarBotonSeleccionado(quickBtns, defaultMatch);

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                pintarBotonSeleccionado(quickBtns, btn);

                const hours = parseFloat(btn.dataset.hours) || 1.5;
                const startVal = timeStartInput ? timeStartInput.value : '16:00';
                const startMin = timeStringToMinutes(startVal);
                const endMin = startMin + Math.round(hours * 60);

                if (timeEndInput) {
                    timeEndInput.value = minutesToTimeString(endMin);
                    calculateAndVerifyMinuteByMinute();
                }
            });
        });
    }

    let selectedPaymentMethod = 'transferencia';

    // 1. Evento para abrir el calendario nativo del navegador vía showPicker()
    const btnOpenCalendar = document.getElementById('btnOpenCalendar');
    const appCustomDateHidden = document.getElementById('appCustomDateHidden');
    if (btnOpenCalendar && appCustomDateHidden) {
        btnOpenCalendar.addEventListener('click', () => {
            if (typeof appCustomDateHidden.showPicker === 'function') {
                appCustomDateHidden.showPicker();
            } else {
                appCustomDateHidden.focus();
                appCustomDateHidden.click();
            }
        });

        appCustomDateHidden.addEventListener('change', (e) => {
            if (e.target.value) {
                currentWidgetDate = e.target.value;
                renderWidgetDatePills();
                renderWidgetDayTimelineGrid();
                calculateAndVerifyMinuteByMinute();
            }
        });
    }

    // 2. Copiado Rápido de Alias y CBU al Portapapeles con Feedback Visual
    document.addEventListener('click', (e) => {
        const btnCopy = e.target.closest('.btn-copy-data');
        if (btnCopy && btnCopy.dataset.copy) {
            const textToCopy = btnCopy.dataset.copy;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = btnCopy.innerHTML;
                btnCopy.innerHTML = '✅ ¡Copiado!';
                btnCopy.style.background = '#10B981';
                setTimeout(() => {
                    btnCopy.innerHTML = originalText;
                    btnCopy.style.background = textToCopy.includes('TENIS') ? 'var(--color-ath-orange)' : 'rgba(255,255,255,0.15)';
                }, 2000);
            }).catch(err => {
                console.error("Error al copiar datos:", err);
            });
        }
    });

    // Toggle interactivo de Métodos de Pago ATH (Transferencia vs Secretaría)
    const payTransferBtn = document.getElementById('payAppTransfer') || document.getElementById('payOptionTransfer');
    const payClubBtn = document.getElementById('payAppClub') || document.getElementById('payOptionClub');
    const paymentTransferCard = document.getElementById('paymentTransferCard');

    if (payTransferBtn && payClubBtn) {
        payTransferBtn.addEventListener('click', () => {
            selectedPaymentMethod = 'transferencia';
            payTransferBtn.classList.add('active');
            payTransferBtn.style.background = 'rgba(255, 102, 0, 0.15)';
            payTransferBtn.style.borderColor = 'var(--color-ath-orange)';
            
            payClubBtn.classList.remove('active');
            payClubBtn.style.background = 'rgba(255, 255, 255, 0.05)';
            payClubBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';

            if (paymentTransferCard) paymentTransferCard.style.display = 'block';
        });

        payClubBtn.addEventListener('click', () => {
            selectedPaymentMethod = 'secretaria';
            payClubBtn.classList.add('active');
            payClubBtn.style.background = 'rgba(16, 185, 129, 0.15)';
            payClubBtn.style.borderColor = '#10B981';

            payTransferBtn.classList.remove('active');
            payTransferBtn.style.background = 'rgba(255, 255, 255, 0.05)';
            payTransferBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';

            if (paymentTransferCard) paymentTransferCard.style.display = 'none';
        });
    }

    // 3. Candado de Seguridad Estricto en Confirmación de Reserva & Doble Confirmación
    const confirmAppBtn = document.getElementById('appConfirmBtn') || document.getElementById('widgetConfirmBtn');
    if (confirmAppBtn) {
        confirmAppBtn.addEventListener('click', async () => {
            const activeUser = getActiveUser();
            const timeStart = document.getElementById('appTimeStart') || document.getElementById('widgetTimeStart');
            const timeEnd = document.getElementById('appTimeEnd') || document.getElementById('widgetTimeEnd');
            const fileInput = document.getElementById('appReceiptUpload');

            const horaInicio = timeStart ? timeStart.value : '16:00';
            const horaFin = timeEnd ? timeEnd.value : '17:30';

            const startMin = timeStringToMinutes(horaInicio);
            const endMin = startMin + Math.round(timeStringToMinutes(horaFin) - startMin);
            const duracionHoras = (endMin - startMin) / 60;

            let comprobanteBase64 = null;

            if (selectedPaymentMethod === 'transferencia' || selectedPaymentMethod === 'mercadopago') {
                const file = (fileInput && fileInput.files && fileInput.files.length > 0) ? fileInput.files[0] : null;

                // VALIDACIÓN BLOQUEANTE ESTRICTA
                if (!file) {
                    if (fileInput) {
                        fileInput.style.border = '2px solid #EF4444';
                        fileInput.focus();
                    }
                    alert("⛔ CANDADO DE SEGURIDAD: Para abonar con Transferencia es obligatorio adjuntar la foto o captura de tu comprobante de pago.");
                    return; // Aborta inmediatamente. NO crea reserva ni cierra modal.
                }

                if (fileInput) {
                    fileInput.style.border = '1px dashed #FF8800';
                }

                try {
                    comprobanteBase64 = await window.DBHits.convertFileToBase64(file);
                } catch (err) {
                    alert("Error al procesar la captura del comprobante: " + err.message);
                    return;
                }
            }

            // DOBLE CONFIRMACIÓN ANTI-ERROR
            const fechaFormateada = formatFriendlyDate(currentWidgetDate);
            const userRole = activeUser ? activeUser.role : 'usuario';
            const calculo = window.DBHits.calcularPrecioReserva(horaInicio, duracionHoras, userRole);
            const mensajeConfirmacion = `❓ CONFIRMACIÓN DE RESERVA ATH\n\n¿Estás seguro que deseas confirmar la reserva con los siguientes datos?\n\n🎾 Cancha: Cancha ${currentWidgetCourt}\n📅 Día: ${fechaFormateada}\n⏰ Horario: ${horaInicio} a ${horaFin} hs\n💰 Total a abonar: $${calculo.precioTotal.toLocaleString('es-AR')} ARS\n\nPresiona ACEPTAR para enviar tu reserva o CANCELAR para modificar los horarios.`;

            if (!confirm(mensajeConfirmacion)) {
                console.log("🚫 Reserva cancelada por el usuario en el paso de doble confirmación.");
                return; // Detiene la ejecución sin guardar nada
            }

            const pendingData = {
                canchaId: currentWidgetCourt,
                fecha: currentWidgetDate,
                horaInicio: horaInicio,
                horaFin: horaFin,
                duracionHoras: duracionHoras,
                metodoPago: selectedPaymentMethod,
                comprobanteBase64: comprobanteBase64
            };

            if (!activeUser) {
                if (window.DBHits && typeof window.DBHits.saveActiveUserSession === 'function') {
                    try {
                        localStorage.setItem('pending_ath_booking', JSON.stringify(pendingData));
                    } catch {}
                }
                closeAppBookingModal();

                if (loginAlertError) {
                    loginAlertError.innerHTML = `<i class="fa-solid fa-lock"></i> ¡Ya casi! Iniciá sesión o creá tu cuenta en segundos para asegurar tu turno en la Cancha ${currentWidgetCourt} (${currentWidgetDate} de ${horaInicio} a ${horaFin} hs).`;
                    loginAlertError.style.display = 'flex';
                }
                openModal('login', false);
                return;
            }

            try {
                const nuevaReserva = await window.DBHits.crearReserva({
                    usuarioId: activeUser.id,
                    usuarioNombre: `${activeUser.nombre} ${activeUser.apellido || ''}`,
                    usuarioEmail: activeUser.email,
                    usuarioTelefono: activeUser.telefono,
                    usuarioRole: activeUser.role || 'usuario',
                    canchaId: currentWidgetCourt,
                    fecha: currentWidgetDate,
                    horaInicio: horaInicio,
                    duracionHoras: duracionHoras,
                    metodoPago: selectedPaymentMethod,
                    comprobanteBase64: comprobanteBase64,
                    rolUsuario: userRole
                });

                alert("✅ ¡RESERVA REGISTRADA CON ÉXITO!\n\nEstado actual: ⏳ PAGO ESPERANDO APROBACIÓN\n\nTu solicitud y/o comprobante ya están en poder de la secretaría del Club Ciudad Verde. En cuanto un administrador verifique el ingreso, tu estado cambiará automáticamente a 'Pago confirmado'.");

                closeAppBookingModal();
                localStorage.removeItem('pending_ath_booking');

                renderWidgetDayTimelineGrid();

            } catch (err) {
                alert(`Error al procesar reserva: ${err.message}`);
            }
        });
    }

    // Auto-procesar reserva pendiente tras iniciar sesión
    const pendingBooking = localStorage.getItem('pending_ath_booking');
    if (activeUser && pendingBooking) {
        try {
            const data = JSON.parse(pendingBooking);
            window.DBHits.crearReserva({
                usuarioId: activeUser.id,
                usuarioNombre: `${activeUser.nombre} ${activeUser.apellido || ''}`,
                usuarioEmail: activeUser.email,
                usuarioTelefono: activeUser.telefono,
                canchaId: data.canchaId,
                fecha: data.fecha,
                horaInicio: data.horaInicio,
                duracionHoras: data.duracionHoras
            }).then(r => {
                alert(`🎾 ¡Reserva completada con éxito tras iniciar sesión! Cancha ${r.canchaId} el ${r.fecha} (${r.horaInicio} a ${r.horaFin} hs).`);
                localStorage.removeItem('pending_ath_booking');
                if (typeof renderWidgetDayTimelineGrid === 'function') renderWidgetDayTimelineGrid();
            }).catch(e => {
                console.error("Error al completar reserva pendiente:", e);
                localStorage.removeItem('pending_ath_booking');
            });
        } catch {
            localStorage.removeItem('pending_ath_booking');
        }
    }
});
