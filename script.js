/* ==========================================================================
   ACADEMIA TENIS HITS (ATH) - INTERACTIVE JAVASCRIPT (ARGENTINA)
   Navegación Multi-Página, Autenticación, Control RBAC, Recuperación de Contraseña
   y Motor de CMS Visual Multi-Página con Escáner Dinámico de Atributos
   ========================================================================== */


// ---------------------------------------------------------
// ATH - MOTOR DE BADGES VISUALES PARA ADMINISTRADORES
// ---------------------------------------------------------
window.actualizarBadgesAdmin = async function() {
    if (!window.DBHits) return;
    const activeUser = window.DBHits.getActiveUser();
    if (!activeUser || activeUser.role !== 'admin') return;

    try {
        const reservas = await window.DBHits.listarReservas();
        const pendientes = reservas.filter(r => r.estadoPago && String(r.estadoPago).toLowerCase().includes('esperando')).length;

        const navBadge = document.getElementById('navAdminPendingBadge');
        const tabBadge = document.getElementById('adminPendingBadge');

        if (navBadge) {
            navBadge.style.display = pendientes > 0 ? 'flex' : 'none';
            navBadge.textContent = pendientes;
        }
        if (tabBadge) {
            tabBadge.style.display = pendientes > 0 ? 'inline-flex' : 'none';
            tabBadge.textContent = pendientes;
        }
    } catch(e) { console.error("Error al actualizar badges:", e); }
};

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

            if (usuario.role === 'admin' || usuario.role === 'secretaria') {
                const isAdmin = usuario.role === 'admin';
                roleBadgeHtml = isAdmin 
                    ? `<span class="user-role-tag tag-admin"><i class="fa-solid fa-shield-halved"></i> Admin</span>`
                    : `<span class="user-role-tag tag-admin" style="background: rgba(16, 185, 129, 0.2); color: #34D399; border: 1px solid #10B981;"><i class="fa-solid fa-address-book"></i> Secretaría</span>`;
                
                adminBtnHtml = `
                    <button class="btn-admin-panel" id="adminPanelBtn" title="${isAdmin ? 'Acceder al Panel de Administración' : 'Acceder a la Agenda de Secretaría'}" style="position: relative; ${!isAdmin ? 'background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFF;' : ''}">
                        <i class="fa-solid ${isAdmin ? 'fa-bolt' : 'fa-calendar-check'}"></i><span class="hide-mobile"> ${isAdmin ? 'Panel Admin' : 'Agenda'}</span>
                        ${isAdmin ? '<span id="navAdminPendingBadge" style="display: none; align-items: center; justify-content: center; position: absolute; top: -6px; right: -6px; background: #EF4444; color: #FFF; font-size: 0.65rem; font-weight: 800; min-width: 18px; height: 18px; border-radius: 50%; box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);">0</span>' : ''}
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
                    
                    <div style="position: relative; display: inline-block;">
                        <button class="nav-bell-icon" id="notificationBell" style="background: none; border: none; cursor: pointer; position: relative; margin-left: 12px; margin-right: 12px; color: #FFF; font-size: 1.2rem; display: flex; align-items: center;" title="Notificaciones">
                            <i class="fa-solid fa-bell"></i>
                            ${badgeHtml}
                        </button>
                        <div id="notificationDropdownMenu" style="display: none; position: absolute; right: 0; top: 40px; width: 300px; background: #0F172A; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 14px; z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px;">
                                <span style="font-weight: 700; color: #FFF; font-size: 0.9rem;"><i class="fa-solid fa-bell"></i> Notificaciones</span>
                                <span id="closeNotifDropdown" style="cursor: pointer; color: #94A3B8; font-size: 0.9rem;"><i class="fa-solid fa-xmark"></i></span>
                            </div>
                            <div id="notificationDropdownList" style="display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto;">
                                <span style="color: #94A3B8; font-size: 0.8rem; text-align: center; padding: 10px;">No hay notificaciones nuevas.</span>
                            </div>
                        </div>
                    </div>

                    <button class="btn-logout" id="logoutBtn" title="Cerrar Sesión">
                        <i class="fa-solid fa-right-from-bracket"></i><span class="hide-mobile"> Salir</span>
                    </button>
                </div>
                <button class="mobile-toggle" id="mobileToggle" aria-label="Abrir menú">
                    <i class="fa-solid fa-bars"></i>
                </button>
            `;

            if (typeof window.actualizarBadgesAdmin === 'function') window.actualizarBadgesAdmin();
            if (typeof renderizarMisTurnos === 'function') renderizarMisTurnos();
            setupNotificationDropdown();
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

        if (!usuario || (usuario.role !== 'admin' && usuario.role !== 'secretaria')) {
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
            if (!activeUser || (activeUser.role !== 'admin' && activeUser.role !== 'secretaria')) {
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
                    } else if (usuario.role === 'secretaria') {
                        alert(`📅 ¡Bienvenida Secretaría! Se ha habilitado el botón "📅 Agenda" para gestionar el mostrador.`);
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

    // 9. ESCÁNER DINÁMICO DE ATRIBUTOS EDITABLES PARA CUALQUIER PÁGINA HTML (CMS TOTAL 2.0)
    function runDynamicCmsDomScanner(pageKey) {
        const rootEl = document.body;

        // Escanear elementos textuales principales (incluyendo títulos, descripciones, badges y botones de tarjetas)
        const textElements = rootEl.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .hero-title, .hero-subtitle, .section-title, .section-subtitle, .section-description, .court-title, .court-description, .court-badge-tag, .btn-court-book, .live-status-pill span');

        let textIdx = 0;
        textElements.forEach(el => {
            if (el.closest('#modalOverlay') || el.closest('.legal-modal-overlay') || el.closest('#adminCmsFabWrapper') || el.closest('.cms-popover-panel') || el.closest('.nav-actions') || el.closest('.user-badge-nav')) return;
            if (el.id === 'openModalBtn' || el.id === 'logoutBtn' || el.id === 'adminPanelBtn' || el.id === 'mobileToggle' || el.id === 'mobileLogoutBtn') return;
            if (el.classList.contains('btn-cta') || el.classList.contains('btn-logout') || el.classList.contains('mobile-toggle') || el.classList.contains('cms-img-overlay-btn') || el.classList.contains('cms-bg-overlay-btn')) return;

            if (!el.getAttribute('data-editable')) {
                const tag = el.tagName.toLowerCase();
                const autoKey = `${pageKey}_auto_${tag}_${textIdx++}`;
                el.setAttribute('data-editable', autoKey);
            }
        });

        // 2. Escanear el fondo general de la página (Hero Background)
        const heroBgElements = rootEl.querySelectorAll('.hero-bg');
        heroBgElements.forEach((el) => {
            if (el.closest('.modal-overlay') || el.closest('.legal-modal-overlay') || el.closest('#adminCmsFabWrapper')) return;
            el.removeAttribute('data-editable-img'); // Limpiar para que no lo trate como foto interna
            if (!el.getAttribute('data-editable-bg')) {
                el.setAttribute('data-editable-bg', `${pageKey}_hero_bg`);
            }
        });

        // 3. Escanear todas las imágenes <img> reales de la página (fotos de canchas, tarjetas, logo)
        const imgElements = rootEl.querySelectorAll('img');
        let imgIdx = 0;
        imgElements.forEach(el => {
            if (el.closest('.modal-overlay') || el.closest('.legal-modal-overlay') || el.closest('#adminCmsFabWrapper') || el.closest('.cms-popover-panel') || el.closest('.user-badge-nav')) return;
            if (el.classList.contains('cms-fab-btn') || el.src.includes('data-icons')) return;

            if (!el.getAttribute('data-editable-img')) {
                const autoImgKey = `${pageKey}_auto_img_${imgIdx++}`;
                el.setAttribute('data-editable-img', autoImgKey);
            }
        });
    }

    // 10. CONTROLADOR UNIVERSAL DE CMS MULTI-PÁGINA (EXCLUSIVO ROLE: 'ADMIN' CON CONTROL TOTAL DE IMÁGENES Y TEXTOS)
    function initCmsVisualEditor(usuario) {
        if (!usuario || (usuario.role !== 'admin' && usuario.role !== 'secretaria')) {
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
                    <div style="font-size: 0.82rem; font-weight: 800; color: #FFD700; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 10px;">
                        <span style="display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-shield-halved" style="color: var(--color-ath-orange);"></i> Admin ATH &bull; CMS</span>
                        <div style="display: flex; gap: 6px; align-items: center;">
                            <span style="font-size: 0.72rem; color: #FFF; background: rgba(255,102,0,0.25); border: 1px solid var(--color-ath-orange); padding: 2px 8px; border-radius: 4px; font-weight: 700;">${pageName}</span>
                            <button id="cmsPopoverCloseBtn" style="background: none; border: none; color: #94A3B8; font-size: 1.4rem; cursor: pointer; padding: 0 4px; line-height: 1;">&times;</button>
                        </div>
                    </div>

                    <div style="font-size: 0.72rem; color: #94A3B8; line-height: 1.4;">
                        <i class="fa-solid fa-cloud" style="color: #10B981;"></i> Sincronización en la nube activa. Todos los usuarios verán los cambios en tiempo real.
                    </div>
                    
                    <div id="cmsInactiveControls" style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="btn-submit" id="cmsEnableEditBtn" style="padding: 11px; font-size: 0.88rem; border-radius: 8px; margin-top: 2px; background: linear-gradient(135deg, var(--color-ath-orange) 0%, #FF8C00 100%); font-weight: 800;">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> 🛠️ Activar Modo Edición
                        </button>
                    </div>

                    <div id="cmsActiveControls" style="display: none; flex-direction: column; gap: 8px;">
                        <button class="cms-save-btn" id="cmsSaveBtn" style="width: 100%; justify-content: center; padding: 11px; font-size: 0.88rem; border-radius: 8px;">
                            <i class="fa-solid fa-floppy-disk"></i> 💾 Guardar y Publicar para Todos
                        </button>
                        <button class="btn-submit" id="cmsChangeHeroBgBtn" style="background: rgba(255, 215, 0, 0.12); border: 1px solid #FFD700; color: #FFD700; padding: 10px; font-size: 0.84rem; border-radius: 8px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: none; margin-top: 0;">
                            <i class="fa-solid fa-image"></i> 🖼️ Cambiar Fondo de la Página
                        </button>
                        <button class="btn-submit" id="cmsEditModalBtn" style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #6EE7B7; padding: 10px; font-size: 0.84rem; border-radius: 8px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: none; margin-top: 0;">
                            <i class="fa-solid fa-pen-to-square"></i> 🎾 Abrir y Editar Menú de Reservas
                        </button>
                        <button class="btn-submit" id="cmsExitEditBtn" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #EF4444; color: #FCA5A5; padding: 9px; font-size: 0.82rem; border-radius: 8px; box-shadow: none; margin-top: 0;">
                            <i class="fa-solid fa-xmark"></i> ❌ Salir del Modo Edición
                        </button>
                        <button class="cms-reset-btn" id="cmsResetBtn" style="justify-content: center; width: 100%; padding: 6px; font-size: 0.75rem; border-radius: 6px;">
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

            // 1. Alternar contenteditable en textos con desbloqueo de selección total
            runDynamicCmsDomScanner(pageKey);
            document.querySelectorAll('[data-editable]').forEach(el => {
                if (active) {
                    el.setAttribute('contenteditable', 'true');
                    el.setAttribute('spellcheck', 'false');
                    el.style.userSelect = 'text';
                    el.style.webkitUserSelect = 'text';
                    el.style.cursor = 'text';
                    el.style.outline = '2px dashed rgba(255, 102, 0, 0.75)';
                    el.style.outlineOffset = '2px';
                    el.style.minHeight = '1em';
                } else {
                    el.removeAttribute('contenteditable');
                    el.removeAttribute('spellcheck');
                    el.style.userSelect = '';
                    el.style.webkitUserSelect = '';
                    el.style.cursor = '';
                    el.style.outline = '';
                    el.style.outlineOffset = '';
                }
            });

            // 2. Alternar botones de cámara sobre las fotos e imágenes reales (<img>)
            document.querySelectorAll('[data-editable-img]').forEach(el => {
                if (el.classList.contains('hero-bg')) return; // Blindaje: Ignorar hero-bg

                const imgKey = el.getAttribute('data-editable-img');
                const container = el.tagName === 'IMG' ? (el.parentElement || el) : el;
                
                if (active) {
                    if (!container.querySelector('.cms-img-overlay-btn')) {
                        container.classList.add('cms-img-wrapper-relative');

                        const camBtn = document.createElement('button');
                        camBtn.type = 'button';
                        camBtn.className = 'cms-img-overlay-btn';
                        camBtn.innerHTML = '<i class="fa-solid fa-camera"></i>';
                        camBtn.title = 'Cambiar foto';
                        camBtn.setAttribute('aria-label', 'Cambiar Foto');

                        camBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();

                            const fileInput = document.createElement('input');
                            fileInput.type = 'file';
                            fileInput.accept = 'image/*';
                            fileInput.style.display = 'none';
                            document.body.appendChild(fileInput);

                            fileInput.addEventListener('change', async (event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    try {
                                        showCmsToast('⏳ Optimizando imagen...');
                                        const base64Data = await window.DBHits.convertFileToBase64(file, 1600, 1600, 0.85);
                                        
                                        if (el.tagName === 'IMG') {
                                            el.src = base64Data;
                                        } else if (el.querySelector('img')) {
                                            el.querySelector('img').src = base64Data;
                                        } else {
                                            el.style.backgroundImage = `url("${base64Data}")`;
                                            el.style.backgroundSize = 'cover';
                                            el.style.backgroundPosition = 'center';
                                        }

                                        tempImagesMap[imgKey] = base64Data;
                                        window.DBHits.guardarImagenCMS(imgKey, base64Data, pageKey);
                                        showCmsToast('📷 ¡Foto actualizada y guardada!');
                                    } catch (err) {
                                        console.error("Error al procesar imagen:", err);
                                        alert("⚠️ No se pudo procesar la imagen seleccionada.");
                                    }
                                }
                                fileInput.remove();
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

        // Handler para el botón "🖼️ Cambiar Fondo de la Página" del panel Admin CMS
        const cmsChangeHeroBgBtn = document.getElementById('cmsChangeHeroBgBtn');
        if (cmsChangeHeroBgBtn) {
            cmsChangeHeroBgBtn.addEventListener('click', () => {
                const bgEl = document.querySelector('.hero-bg');
                const bgKey = bgEl ? (bgEl.getAttribute('data-editable-bg') || `${pageKey}_hero_bg`) : `${pageKey}_hero_bg`;

                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.style.display = 'none';
                document.body.appendChild(fileInput);

                fileInput.addEventListener('change', async (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        try {
                            showCmsToast('⏳ Optimizando fondo de pantalla...');
                            const base64Data = await window.DBHits.convertFileToBase64(file, 1920, 1080, 0.85);
                            
                            if (bgEl) {
                                bgEl.style.backgroundImage = `url("${base64Data}")`;
                                bgEl.style.backgroundSize = 'cover';
                                bgEl.style.backgroundPosition = 'center';
                            }

                            tempImagesMap[bgKey] = base64Data;
                            window.DBHits.guardarImagenCMS(bgKey, base64Data, pageKey);
                            showCmsToast('🖼️ ¡Fondo de página actualizado y sincronizado!');
                        } catch (err) {
                            console.error("Error al cambiar fondo:", err);
                            alert("⚠️ No se pudo cargar la imagen de fondo.");
                        }
                    }
                    fileInput.remove();
                });

                fileInput.click();
            });
        }

        // Interceptar clicks en modo edicion para permitir edición de textos sin navegar
        if (!window._cmsClickInterceptorAdded) {
            document.addEventListener('click', (e) => {
                if (document.body.classList.contains('cms-editing-active')) {
                    const editableEl = e.target.closest('[data-editable]');
                    if (editableEl && !e.target.closest('.cms-img-overlay-btn') && !e.target.closest('.cms-bg-overlay-btn') && !e.target.closest('#adminCmsFabWrapper')) {
                        if (editableEl.tagName === 'A' || editableEl.closest('a')) {
                            e.preventDefault();
                        }
                        editableEl.focus();
                    }
                }
            });
            window._cmsClickInterceptorAdded = true;
        }

        if (cmsEnableEditBtn) {
            cmsEnableEditBtn.addEventListener('click', () => {
                setVisualEditingState(true);
                showCmsToast(`🛠️ Modo Edición Activado en ${pageName}. Podés hacer clic en cualquier texto para editarlo o en "Cambiar Imagen" en cualquier foto o fondo.`);
            });
        }

        if (cmsExitEditBtn) {
            cmsExitEditBtn.addEventListener('click', () => {
                setVisualEditingState(false);
                if (cmsPopoverPanel) cmsPopoverPanel.classList.remove('active');
                showCmsToast('Has salido del modo edición. La web ahora se visualiza como usuario estándar.');
            });
        }

        if (cmsSaveBtn) {
            cmsSaveBtn.addEventListener('click', async () => {
                showCmsToast('⏳ Publicando y sincronizando cambios en la nube...');

                // 1. Guardar en localStorage y Firebase Firestore
                const textsMap = {};
                document.querySelectorAll('[data-editable]').forEach(el => {
                    const key = el.getAttribute('data-editable');
                    if (key) textsMap[key] = el.innerHTML.trim();
                });

                window.DBHits.guardarLoteCMS(textsMap, tempImagesMap, {}, pageKey);
                
                // 2. Guardar en código fuente físico si el Servidor Python local está en ejecución
                let extraMsg = '';
                try {
                    const clonedHtml = document.documentElement.cloneNode(true);
                    clonedHtml.querySelector('body').classList.remove('cms-editing-active');
                    const cmsWrapper = clonedHtml.querySelector('#adminCmsFabWrapper');
                    if (cmsWrapper) cmsWrapper.remove();
                    clonedHtml.querySelectorAll('.cms-img-overlay-btn, .cms-bg-overlay-btn').forEach(btn => btn.remove());
                    clonedHtml.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
                    clonedHtml.querySelectorAll('[spellcheck]').forEach(el => el.removeAttribute('spellcheck'));
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
                        extraMsg = '<br><span style="color:#10B981;font-size:0.8rem;">✓ Código fuente (.html) actualizado en disco</span>';
                    }
                } catch (e) {
                    // Servidor Python no activo, continúa con Firebase y LocalStorage
                }

                showCmsToast(`💾 ¡Cambios guardados y publicados para todos los usuarios en ${pageName}!${extraMsg}`);
            });
        }

        if (cmsResetBtn) {
            cmsResetBtn.addEventListener('click', () => {
                if (confirm('🔄 ¿Estás seguro de que querés restablecer esta página al diseño original de fábrica?')) {
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

        // Sincronizar botones de selección de cancha en el modal
        const courtPillsContainer = document.getElementById('appCourtSelectBtns');
        if (courtPillsContainer) {
            const pills = courtPillsContainer.querySelectorAll('.court-select-pill');
            pills.forEach(p => {
                const isSelected = String(p.dataset.court) === String(currentWidgetCourt);
                if (isSelected) {
                    p.classList.add('active');
                    p.style.background = 'var(--color-ath-orange)';
                    p.style.borderColor = 'var(--color-ath-orange)';
                    p.style.color = '#FFFFFF';
                    p.style.fontWeight = '800';
                } else {
                    p.classList.remove('active');
                    p.style.background = 'rgba(255,255,255,0.08)';
                    p.style.borderColor = 'rgba(255,255,255,0.2)';
                    p.style.color = '#CBD5E1';
                    p.style.fontWeight = '700';
                }
            });
        }

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

                const activeUserModal = getActiveUser();
        const confirmBtnEl = document.getElementById('appConfirmBtn') || document.getElementById('widgetConfirmBtn');
        let secFields = document.getElementById('secretariaBookingFields');
        const paymentCardEl = document.getElementById('paymentTransferCard');
        const weatherNoticeEl = document.getElementById('appWeatherNotice');

        if (activeUserModal && (activeUserModal.role === 'admin' || activeUserModal.role === 'secretaria')) {
            if (!secFields && confirmBtnEl && confirmBtnEl.parentNode) {
                secFields = document.createElement('div');
                secFields.id = 'secretariaBookingFields';
                secFields.style.cssText = "background: rgba(16, 185, 129, 0.1); border: 1px solid #10B981; border-radius: 8px; padding: 12px; margin-bottom: 14px;";
                secFields.innerHTML = `
                    <div style="font-size: 0.85rem; color: #10B981; font-weight: bold; margin-bottom: 8px;"><i class="fa-solid fa-user-shield"></i> Modo Secretaría: Cargar turno a cliente</div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="text" id="secInputNombre" placeholder="Nombre" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                        <input type="text" id="secInputApellido" placeholder="Apellido" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                    </div>
                    <input type="tel" id="secInputTelefono" placeholder="Teléfono" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: #fff;">
                    <div style="margin-top: 8px; font-size: 0.75rem; color: #FCA5A5;"><i class="fa-solid fa-clock"></i> El turno se agendará y el pago quedará <strong>Pendiente</strong> hasta que el cliente abone en el club.</div>
                `;
                confirmBtnEl.parentNode.insertBefore(secFields, confirmBtnEl);
            }
            if (paymentCardEl) paymentCardEl.style.display = 'none'; // Ocultar carga de comprobante
            if (weatherNoticeEl) weatherNoticeEl.style.display = 'none';
        } else {
            if (secFields) secFields.remove();
            if (paymentCardEl) paymentCardEl.style.display = 'block';
            if (weatherNoticeEl) weatherNoticeEl.style.display = 'flex';
        }

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

    // LISTENER UNIVERSAL PARA SELECCIONAR CANCHA EN EL MODAL (#appCourtSelectBtns)
    document.addEventListener('click', (e) => {
        const courtPill = e.target.closest('.court-select-pill');
        if (courtPill && courtPill.dataset.court) {
            e.preventDefault();
            e.stopPropagation();
            
            const selectedCourtId = String(courtPill.dataset.court);
            currentWidgetCourt = selectedCourtId;

            const nameEl = document.getElementById('appCourtName') || document.getElementById('unifiedCourtName');
            const badgeEl = document.getElementById('appCourtBadge') || document.getElementById('widgetCourtBadge');
            const imgEl = document.getElementById('appCourtImg') || document.getElementById('unifiedCourtImg');

            const courtDataMap = {
                '1': { nombre: 'Cancha 1 (Polvo de Ladrillo)', img: 'assets/cancha1.jpg', badge: 'Polvo de Ladrillo • LED Pro' },
                '2': { nombre: 'Cancha 2 (Polvo de Ladrillo)', img: 'assets/cancha2.jpg', badge: 'Polvo de Ladrillo • Central' },
                '3': { nombre: 'Cancha 3 (Polvo de Ladrillo)', img: 'assets/cancha3.jpg', badge: 'Polvo de Ladrillo • Torneos' }
            };

            const data = courtDataMap[currentWidgetCourt] || courtDataMap['1'];
            if (nameEl) nameEl.textContent = data.nombre;
            if (badgeEl) badgeEl.innerHTML = data.badge;
            if (imgEl) imgEl.src = data.img;

            // Actualizar estilo visual de las pastillas
            const courtPillsContainer = document.getElementById('appCourtSelectBtns');
            if (courtPillsContainer) {
                const pills = courtPillsContainer.querySelectorAll('.court-select-pill');
                pills.forEach(p => {
                    const isSelected = String(p.dataset.court) === String(currentWidgetCourt);
                    if (isSelected) {
                        p.classList.add('active');
                        p.style.background = 'var(--color-ath-orange)';
                        p.style.borderColor = 'var(--color-ath-orange)';
                        p.style.color = '#FFFFFF';
                        p.style.fontWeight = '800';
                    } else {
                        p.classList.remove('active');
                        p.style.background = 'rgba(255,255,255,0.08)';
                        p.style.borderColor = 'rgba(255,255,255,0.2)';
                        p.style.color = '#CBD5E1';
                        p.style.fontWeight = '700';
                    }
                });
            }

            renderWidgetDayTimelineGrid();
            calculateAndVerifyMinuteByMinute();
        }
    });

    // Amarrar con Delegación de Eventos Resiliente a todos los botones de reserva del sitio
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.open-booking-trigger, .btn-court-book, .view-court-trigger');
        if (trigger) {
            // SI EL MODO EDICIÓN ESTÁ ACTIVO, NO ABRIR EL MODAL (Permitir editar el texto del botón o tarjeta)
            if (document.body.classList.contains('cms-editing-active')) {
                e.preventDefault();
                trigger.focus();
                return;
            }
            // Si el botón es un enlace <a> que apunta a otra página (ej: sede.html, clases.html) y NO tiene la clase open-booking-trigger, permitir la navegación natural
            const href = trigger.getAttribute('href');
            if (href && (href.endsWith('.html') || href.includes('.html')) && !trigger.classList.contains('open-booking-trigger')) {
                return; // Permitir que el navegador redirija a sede.html
            }

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

            // Inyección virtual de la plantilla en la grilla visual
            if (window.DBHits && window.DBHits.getWeeklyRules) {
                const vacDates = window.DBHits.getVacationsDates ? window.DBHits.getVacationsDates() : null;
                let enVacaciones = false;
                if (vacDates && vacDates.desde && vacDates.hasta) {
                    enVacaciones = (currentWidgetDate >= vacDates.desde && currentWidgetDate <= vacDates.hasta);
                }
                
                if (!enVacaciones) {
                    const rules = window.DBHits.getWeeklyRules();
                    const exceptions = window.DBHits.getExceptions ? window.DBHits.getExceptions() : [];
                    const dayOfWeek = new Date(`${currentWidgetDate}T12:00:00`).getDay();
                    
                    rules.forEach(rule => {
                        if (String(rule.day) === String(dayOfWeek) && (rule.court === 'TODAS' || String(rule.court) === String(currentWidgetCourt))) {
                            const startRuleMin = parseInt(rule.start.split(':')[0])*60 + parseInt(rule.start.split(':')[1]);
                            const endRuleMin = parseInt(rule.end.split(':')[0])*60 + parseInt(rule.end.split(':')[1]);
                            
                            let ruleBlocks = [{start: startRuleMin, end: endRuleMin}];

                            for (let ex of exceptions) {
                                if (ex.fecha === currentWidgetDate && (ex.cancha === 'TODAS' || String(ex.cancha) === String(currentWidgetCourt))) {
                                    const exStartMin = parseInt(ex.inicio.split(':')[0])*60 + parseInt(ex.inicio.split(':')[1]);
                                    const exEndMin = parseInt(ex.fin.split(':')[0])*60 + parseInt(ex.fin.split(':')[1]);
                                    
                                    let newBlocks = [];
                                    for (let block of ruleBlocks) {
                                        if (block.start < exEndMin && block.end > exStartMin) {
                                            if (block.start < exStartMin) newBlocks.push({start: block.start, end: exStartMin});
                                            if (block.end > exEndMin) newBlocks.push({start: exEndMin, end: block.end});
                                        } else {
                                            newBlocks.push(block);
                                        }
                                    }
                                    ruleBlocks = newBlocks;
                                }
                            }

                            // Dibujar solo los fragmentos de clase que sobrevivieron a las excepciones
                            ruleBlocks.forEach(block => {
                                const hIn = String(Math.floor(block.start / 60)).padStart(2, '0') + ':' + String(block.start % 60).padStart(2, '0');
                                const hOut = String(Math.floor(block.end / 60)).padStart(2, '0') + ':' + String(block.end % 60).padStart(2, '0');
                                reservasCancha.push({
                                    tipo: 'bloqueo_admin', motivo: rule.label, horaInicio: hIn, horaFin: hOut
                                });
                            });
                        }
                    });
                }
            }

            if (reservasCancha.length === 0) {
                gridContainer.innerHTML = `
                    <div style="color: #10B981; font-weight: 700; font-size: 0.88rem; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-circle-check"></i> Cancha 100% despejada en todo el día.
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

        const pricingConfig = window.DBHits.getPricingRaw();
        const openMin = timeStringToMinutes(pricingConfig.timeOpen || '08:00');
        const closeMin = timeStringToMinutes(pricingConfig.timeClose || '23:00');

        if (startMin < openMin || endMin > closeMin) {
            priceSummary.className = 'booking-summary-card occupied status-busy';
            if (summaryStatus) summaryStatus.innerHTML = `❌ El club opera entre las ${pricingConfig.timeOpen || '08:00'} y ${pricingConfig.timeClose || '23:00'} hs`;
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

            const isSecretaria = activeUser && (activeUser.role === 'admin' || activeUser.role === 'secretaria');
            
            // VALIDACIÓN BLOQUEANTE ESTRICTA PARA TRANSFERENCIA ÚNICA (Solo si NO es secretaria)
            const file = (fileInput && fileInput.files && fileInput.files.length > 0) ? fileInput.files[0] : null;
            if (!isSecretaria && !file) {
                if (fileInput) { fileInput.style.border = '2px solid #EF4444'; fileInput.focus(); }
                alert("⛔ ATENCIÓN: Solo aceptamos pagos por transferencia. Es obligatorio adjuntar la captura del comprobante de pago para reservar la cancha.");
                return;
            }

            if (file) {
                if (fileInput) fileInput.style.border = '1px dashed #FF8800';
                try {
                    comprobanteBase64 = await window.DBHits.convertFileToBase64(file);
                } catch (err) {
                    alert("Error al procesar la captura del comprobante: " + err.message);
                    return;
                }
            }

            // Capturar datos de secretaría si existen
            const secNombre = document.getElementById('secInputNombre')?.value.trim();
            const secApellido = document.getElementById('secInputApellido')?.value.trim();
            const secTelefono = document.getElementById('secInputTelefono')?.value.trim();

            const finalNombre = isSecretaria && secNombre ? `${secNombre} ${secApellido || ''}`.trim() : (activeUser ? `${activeUser.nombre} ${activeUser.apellido || ''}` : 'Usuario');
            const finalTelefono = isSecretaria && secTelefono ? secTelefono : (activeUser ? activeUser.telefono : '');
            const finalEstadoPago = isSecretaria ? '⏳ Pago pendiente en Club' : '⏳ Pago esperando aprobación';
            const finalMetodoPago = isSecretaria ? 'En Secretaría (Efectivo/Físico)' : selectedPaymentMethod;

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
                    usuarioId: isSecretaria ? 'mostrador' : activeUser.id,
                    usuarioNombre: finalNombre,
                    usuarioEmail: activeUser.email,
                    usuarioTelefono: finalTelefono,
                    usuarioRole: activeUser.role || 'usuario',
                    canchaId: currentWidgetCourt,
                    fecha: currentWidgetDate,
                    horaInicio: horaInicio,
                    duracionHoras: duracionHoras,
                    metodoPago: finalMetodoPago,
                    comprobanteBase64: comprobanteBase64,
                    rolUsuario: isSecretaria ? 'usuario' : userRole,
                    overrideEstadoPago: finalEstadoPago // Parámetro nuevo
                });

                if (isSecretaria) {
                    alert("✅ ¡TURNO AGENDADO EN MOSTRADOR!\n\nEl turno de " + finalNombre + " ha sido registrado exitosamente.\n\n⚠️ RECORDATORIO: El pago ha quedado PENDIENTE. Cuando el cliente abone en el club, recuerda presionar 'Aprobar' en el Panel de Administración para que impacte en el reporte financiero.");
                } else {
                    alert("✅ ¡RESERVA REGISTRADA CON ÉXITO!\n\nEstado actual: ⏳ PAGO ESPERANDO APROBACIÓN.");
                }

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
    initFloatingWhatsApp();
            }).catch(e => {
                console.error("Error al completar reserva pendiente:", e);
                localStorage.removeItem('pending_ath_booking');
            });
        } catch {
            localStorage.removeItem('pending_ath_booking');
        }
    }
});


// Helper de fecha para Mis Turnos
function formatFechaLocal(isoDate) {
    if (!isoDate || !isoDate.includes('-')) return isoDate;
    const parts = isoDate.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

async function renderizarMisTurnos() {
    // Buscar el contenedor de Mis Turnos en el HTML
    const container = document.getElementById('misTurnosContainer') || document.querySelector('.mis-turnos-list');
    if (!container) return;

    const user = window.DBHits ? window.DBHits.getActiveUser() : null;
    if (!user) return;

    const misTurnos = window.DBHits.getReservasPorUsuario ? window.DBHits.getReservasPorUsuario(user) : [];
    const ahora = new Date();

    if (misTurnos.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#94A3B8; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 8px;">No tienes turnos registrados.</div>`;
        return;
    }

    container.innerHTML = `<div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">` + misTurnos.map(turno => {
        const fechaHoraTurno = new Date(`${turno.fecha}T${turno.horaInicio || '00:00'}`);
        const esPasado = fechaHoraTurno < ahora;
        const minutosFaltantes = (fechaHoraTurno - ahora) / (1000 * 60);
        
        let colorEstado = '#94A3B8'; // default
        let estadoStr = turno.estadoPago || 'Pendiente';
        const estaPagado = estadoStr.includes('✅') || estadoStr.toLowerCase().includes('confirmado') || estadoStr.toLowerCase().includes('aprobado');
        
        if(estaPagado) colorEstado = '#10B981';
        else if(estadoStr.includes('⏳') || estadoStr.includes('pendiente') || estadoStr.includes('esperando')) colorEstado = '#F59E0B';
        else if(estadoStr.includes('❌') || estadoStr.includes('Rechazado') || estadoStr.includes('Cancelado')) colorEstado = '#EF4444';

        // Botón de cancelar: Permitir si faltan >= 30 minutos
        let btnCancelar = '';
        if (!esPasado && minutosFaltantes >= 30) {
            const textoBtn = estaPagado ? '<i class="fa-solid fa-triangle-exclamation"></i> Cancelar y Pedir Reembolso' : '<i class="fa-solid fa-xmark"></i> Cancelar Turno';
            const colorBtn = estaPagado ? 'rgba(245, 158, 11, 0.2); border: 1px solid #F59E0B; color: #FCD34D;' : 'rgba(239, 68, 68, 0.1); border: 1px solid #EF4444; color: #FCA5A5;';
            
            btnCancelar = `<button class="btn-cancelar-turno" data-id="${turno.id}" data-pagado="${estaPagado ? '1' : '0'}" data-fecha="${turno.fecha}" data-hora="${turno.horaInicio}" data-cancha="${turno.canchaId}" style="margin-top: 10px; width: 100%; padding: 8px; border-radius: 6px; background: ${colorBtn} cursor: pointer; font-size: 0.8rem; font-weight: 700;">${textoBtn}</button>`;
        }

        return `
        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-left: 4px solid ${colorEstado}; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; opacity: ${esPasado ? '0.6' : '1'};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
                <div>
                    <strong style="color: #FFF; font-size: 1rem;">${formatFechaLocal(turno.fecha)}</strong><br>
                    <span style="color: var(--color-ath-orange); font-weight: 700;">${turno.horaInicio} a ${turno.horaFin || turno.hora} hs</span>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; color: #E2E8F0;">
                    ${turno.canchaId === '1' ? 'Cancha 1' : turno.canchaId === '2' ? 'Cancha 2' : 'Cancha 3'}
                </div>
            </div>
            <div style="margin-top: 8px; font-size: 0.85rem; color: ${colorEstado}; font-weight: 700;">
                ${estadoStr}
            </div>
            ${btnCancelar}
        </div>
        `;
    }).join('') + `</div>`;

    // Asignar eventos de cancelación
    document.querySelectorAll('.btn-cancelar-turno').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const buttonEl = e.target.closest('.btn-cancelar-turno');
            const id = buttonEl.dataset.id;
            const estabaPagado = buttonEl.dataset.pagado === '1';
            const fechaTurno = buttonEl.dataset.fecha || '';
            const horaTurno = buttonEl.dataset.hora || '';
            const canchaTurno = buttonEl.dataset.cancha || '';

            let mensajeConfirmacion = "⚠️ ¿Estás seguro de que deseas cancelar este turno? La cancha quedará liberada.";
            if (estabaPagado) {
                mensajeConfirmacion = "⚠️ ATENCIÓN: Este turno ya figura como PAGADO.

Al cancelar, el sistema liberará la cancha y te abrirá un chat de WhatsApp con la administración para coordinar la devolución de tu dinero. ¿Deseas continuar?";
            }

            if (confirm(mensajeConfirmacion)) {
                try {
                    window.DBHits.cancelarReservaUsuario(id, user);
                    alert("Turno cancelado exitosamente.");
                    renderizarMisTurnos();

                    if (estabaPagado) {
                        const wppNum = window.DBHits.getWhatsAppConfig ? window.DBHits.getWhatsAppConfig() : '5493564000000';
                        const fechaFormat = typeof formatFechaLocal === 'function' ? formatFechaLocal(fechaTurno) : fechaTurno;
                        const textoWpp = encodeURIComponent(`Hola! Acabo de cancelar mi turno pagado para el día ${fechaFormat} (${horaTurno} hs - Cancha ${canchaTurno}) en Academia Tenis Hits y necesito coordinar la devolución del dinero.`);
                        window.open(`https://wa.me/${wppNum}?text=${textoWpp}`, '_blank');
                    }
                } catch(err) {
                    alert(err.message);
                }
            }
        });
    });
}
window.renderizarMisTurnos = renderizarMisTurnos;


// Controlador del menú flotante de notificaciones en la barra de navegación
function setupNotificationDropdown() {
    const notifBell = document.getElementById('notificationBell') || document.querySelector('.nav-bell-icon');
    const notifDropdown = document.getElementById('notificationDropdownMenu');
    const closeNotif = document.getElementById('closeNotifDropdown');

    if (notifBell && notifDropdown) {
        notifBell.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isVisible = notifDropdown.style.display === 'block';
            notifDropdown.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible && window.DBHits) {
                const user = window.DBHits.getActiveUser();
                const listContainer = document.getElementById('notificationDropdownList');
                if (user && listContainer) {
                    const notifs = user.notificaciones || [];
                    const isAdminOrSec = (user.role === 'admin' || user.role === 'secretaria');

                    if (notifs.length === 0) {
                        listContainer.innerHTML = `
                            <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; font-size: 0.8rem; color: #E2E8F0;">
                                <i class="fa-solid fa-circle-info" style="color: var(--color-ath-orange);"></i> ¡Hola ${user.nombre || 'Usuario'}! Tus turnos y avisos se actualizarán aquí.
                            </div>
                        `;
                    } else {
                        listContainer.innerHTML = notifs.slice(0, 6).map(n => {
                            const clickAttr = isAdminOrSec ? `onclick="window.location.href='admin.html';" style="cursor: pointer; background: rgba(255,255,255,0.07); padding: 8px; border-radius: 6px; font-size: 0.8rem; color: #E2E8F0; border-left: 3px solid ${n.tipo === 'success' ? '#10B981' : (n.tipo === 'error' ? '#EF4444' : 'var(--color-ath-orange)')}; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.12)'" onmouseout="this.style.background='rgba(255,255,255,0.07)'"` : `style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; font-size: 0.8rem; color: #E2E8F0; border-left: 3px solid ${n.tipo === 'success' ? '#10B981' : (n.tipo === 'error' ? '#EF4444' : 'var(--color-ath-orange)')};"`;
                            const adminHint = isAdminOrSec ? `<div style="font-size: 0.68rem; color: var(--color-ath-orange); font-weight: 700; margin-top: 4px;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Ver en Panel de Control</div>` : '';
                            return `
                                <div ${clickAttr}>
                                    <div>${n.mensaje}</div>
                                    <div style="color: #94A3B8; font-size: 0.7rem; margin-top: 4px;">${new Date(n.fecha).toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})} hs</div>
                                    ${adminHint}
                                </div>
                            `;
                        }).join('');
                        window.DBHits.marcarNotificacionesLeidas(user.id);
                    }
                }
            }
        };

        if (closeNotif) {
            closeNotif.onclick = (e) => {
                e.stopPropagation();
                notifDropdown.style.display = 'none';
            };
        }

        document.addEventListener('click', (e) => {
            if (!notifDropdown.contains(e.target) && !notifBell.contains(e.target)) {
                notifDropdown.style.display = 'none';
            }
        });
    }
}


// Inyector automático de Botón Flotante de WhatsApp Responsivo (Esquina Inferior Izquierda)
function initFloatingWhatsApp() {
    if (document.getElementById('athFloatingWpp')) return; // Evitar duplicados

    const wppFloat = document.createElement('a');
    wppFloat.id = 'athFloatingWpp';
    wppFloat.href = '#';
    wppFloat.setAttribute('aria-label', 'Contactar por WhatsApp');
    wppFloat.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9999;
        background-color: #25D366;
        color: #FFF;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        transition: transform 0.3s ease, background-color 0.3s ease;
        text-decoration: none;
    `;
    wppFloat.innerHTML = `<i class="fa-brands fa-whatsapp"></i>`;

    // Efecto hover
    wppFloat.addEventListener('mouseenter', () => { wppFloat.style.transform = 'scale(1.1)'; });
    wppFloat.addEventListener('mouseleave', () => { wppFloat.style.transform = 'scale(1.0)'; });

    // Acción de clic vinculada al número oficial guardado en la BD
    wppFloat.addEventListener('click', (e) => {
        e.preventDefault();
        const wppNum = window.DBHits && window.DBHits.getWhatsAppConfig ? window.DBHits.getWhatsAppConfig() : '5493564000000';
        const mensaje = encodeURIComponent("¡Hola! Me comunico desde la web de Academia Tenis Hits para realizar una consulta.");
        window.open(`https://wa.me/${wppNum}?text=${mensaje}`, '_blank');
    });

    document.body.appendChild(wppFloat);
}
