/* ==========================================================================
   ACADEMIA TENIS HITS (ATH) - LOCALSTORAGE DATABASE & MULTI-PAGE CMS ENGINE
   Persistencia Local Instantánea por Ruta/Página (index, historia, sede, clases, etc.)
   Gestión RBAC, Reservas, Noticias, Tarifas y CMS Visual Multi-Página
   ========================================================================== */

const SALT_ATH = '_ATH_SALT_2026';
const USERS_STORAGE_KEY = 'ath_users_db';
const BOOKINGS_STORAGE_KEY = 'ath_bookings_db';
const NEWS_STORAGE_KEY = 'ath_news_db';
const TOURNAMENTS_STORAGE_KEY = 'ath_tournaments_db';
const PRICING_STORAGE_KEY = 'ath_pricing_db';
const CONTENT_STORAGE_KEY = 'ath_site_content_db'; // Almacén CMS Multi-Página

// Helper global para identificar la clave de página actual (index, historia, sede, etc.)
function getATHPageKey() {
    if (typeof window === 'undefined') return 'index';
    let path = window.location.pathname.toLowerCase();
    let filename = path.substring(path.lastIndexOf('/') + 1);
    if (!filename || filename === '' || filename === '/') {
        filename = 'index.html';
    }
    return filename.replace('.html', '');
}

// Helper para convertir "HH:MM" a minutos totales (ej: "16:30" -> 990)
function timeStringToMinutes(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0], 10) || 0;
    const mins = parseInt(parts[1], 10) || 0;
    return hours * 60 + mins;
}

// Helper para convertir minutos totales a "HH:MM" (ej: 990 -> "16:30")
function minutesToTimeString(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const hStr = hours.toString().padStart(2, '0');
    const mStr = mins.toString().padStart(2, '0');
    return `${hStr}:${mStr}`;
}

window.playAthSound = function() { try { new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(()=>{}); } catch(e){} };

// Solicitar permiso al navegador para notificaciones Push
if (typeof window !== 'undefined' && "Notification" in window && Notification.permission !== "denied" && Notification.permission !== "granted") {
    Notification.requestPermission();
}

class ATHDatabaseEngine {
    constructor() {
        this.initStorage();
        this.initFirebase(); // <--- INYECTAR ESTA LÍNEA
    }

    // 0. GESTIÓN DUAL DE SESIÓN (LOCALSTORAGE + WINDOW.NAME FALLBACK PARA FILE:///)
    getActiveUser() {
        try {
            const stored = localStorage.getItem('ath_active_user');
            if (stored) {
                const userObj = JSON.parse(stored);
                if (userObj && userObj.id) return userObj;
            }
        } catch (e) {}

        // Fallback de persistencia para protocolo local file:/// (Explorador de Windows)
        try {
            if (window.name && window.name.includes('ath_active_user')) {
                const winData = JSON.parse(window.name);
                if (winData && winData.ath_active_user) {
                    try {
                        localStorage.setItem('ath_active_user', JSON.stringify(winData.ath_active_user));
                    } catch (e) {}
                    return winData.ath_active_user;
                }
            }
        } catch (e) {}

        return null;
    }

    saveActiveUserSession(usuario) {
        if (!usuario) {
            localStorage.removeItem('ath_active_user');
            try {
                if (window.name && window.name.includes('ath_active_user')) {
                    let winData = {};
                    try { winData = JSON.parse(window.name); } catch {}
                    delete winData.ath_active_user;
                    window.name = JSON.stringify(winData);
                }
            } catch (e) {}
            return;
        }

        try {
            localStorage.setItem('ath_active_user', JSON.stringify(usuario));
        } catch (e) {}

        try {
            let winData = {};
            try {
                if (window.name && window.name.startsWith('{')) {
                    winData = JSON.parse(window.name);
                }
            } catch {}
            winData.ath_active_user = usuario;
            window.name = JSON.stringify(winData);
        } catch (e) {}
    }

    // Inicializar LocalStorage con estructuras por defecto
    initStorage() {
        try {
            if (!localStorage.getItem(USERS_STORAGE_KEY)) {
                localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
            }
            if (!localStorage.getItem(BOOKINGS_STORAGE_KEY)) {
                localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([]));
            }
            if (!localStorage.getItem(NEWS_STORAGE_KEY)) {
                localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify([]));
            }
            if (!localStorage.getItem(TOURNAMENTS_STORAGE_KEY)) {
                localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify([]));
            }
            if (!localStorage.getItem(PRICING_STORAGE_KEY)) {
                const defaultPricing = {
                    priceCourtDay: 8000,
                    priceCourtNight: 12000,
                    priceEscuela: 25000,
                    priceAltoRend: 45000,
                    priceClaseParticular: 15000
                };
                localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(defaultPricing));
            }
            if (!localStorage.getItem(CONTENT_STORAGE_KEY)) {
                localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify({
                    pages: {}
                }));
            }

            this.seedDefaultAdmin();
        } catch (err) {
            console.error("Error al inicializar LocalStorage:", err);
        }
    }

    async initFirebase() {
        try {
            const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js");
            const { getFirestore, onSnapshot, doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js");
            
            const app = initializeApp({
                apiKey: "AIzaSyCeCeB2Rkx_4jBwToBf7m-UdDUUql5cads",
                authDomain: "ath-academia-tenis-hits.firebaseapp.com",
                projectId: "ath-academia-tenis-hits",
                storageBucket: "ath-academia-tenis-hits.firebasestorage.app",
                messagingSenderId: "618788361256",
                appId: "1:618788361256:web:51b2535b3c87153b7e911d"
            });

            this.db = getFirestore(app);
            this.setDoc = setDoc;
            this.doc = doc;

            // Listener Tiempo Real: Reservas
            onSnapshot(doc(this.db, "ath_core", "reservas"), (docSnap) => {
                const localData = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY)) || [];
                if (docSnap.exists()) {
                    const cloudData = docSnap.data().array || [];
                    if (cloudData.length > 0 || localData.length === 0) {
                        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(cloudData));
                        if (typeof window.cargarTablaReservasFn === 'function') window.cargarTablaReservasFn();
                        if (typeof window.actualizarBadgesAdmin === "function") window.actualizarBadgesAdmin();
                        if (typeof window.renderWidgetDayTimelineGrid === 'function') window.renderWidgetDayTimelineGrid();
                    } else if (localData.length > 0) {
                        this.setDoc(doc(this.db, "ath_core", "reservas"), { array: localData }).catch(e => console.warn(e));
                    }
                } else if (localData.length > 0) {
                    this.setDoc(doc(this.db, "ath_core", "reservas"), { array: localData }).catch(e => console.warn(e));
                }
            });

            // Listener Tiempo Real: Usuarios (Blindaje y Auto-Semilla Garantizada)
            onSnapshot(doc(this.db, "ath_core", "usuarios"), async (docSnap) => {
                const localData = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
                if (docSnap.exists()) {
                    let cloudData = docSnap.data().array || [];
                    if (cloudData.length > 0) {
                        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(cloudData));
                    }
                    await this.seedDefaultAdmin();
                } else if (localData.length > 0) {
                    await this.seedDefaultAdmin();
                    this.setDoc(doc(this.db, "ath_core", "usuarios"), { array: this.getUsersRaw() }).catch(e => console.warn(e));
                }
            });

            // Listener Tiempo Real: Contenido Visual CMS (Textos, Imágenes y Fondos)
            onSnapshot(doc(this.db, "ath_core", "cms_content"), (docSnap) => {
                if (docSnap.exists()) {
                    const cloudContent = docSnap.data();
                    if (cloudContent && cloudContent.pages) {
                        localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(cloudContent));
                        this.aplicarContenidoPersonalizado();
                        console.log("☁️ [CMS Sync] Contenido visual sincronizado desde la nube para todos los usuarios.");
                    }
                }
            });

            console.log("☁️ ¡Conectado a Firebase Firestore en tiempo real (Reservas, Usuarios y CMS)!");
        } catch (err) {
            console.error("Error crítico al inicializar Firebase:", err);
        }
    }

    // Algoritmo de Hashing SHA-256 usando Web Crypto API con fallback síncrono
    async hashPassword(password) {
        try {
            if (window.crypto && window.crypto.subtle) {
                const encoder = new TextEncoder();
                const data = encoder.encode(password + SALT_ATH);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            }
        } catch (e) {
            console.warn("Usando hash alternativo para entorno sin WebCrypto");
        }
        let hash = 0;
        const str = password + SALT_ATH;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return 'ath_' + Math.abs(hash).toString(16);
    }

            // Semilla de Administradores y Secretaría por Defecto
    async seedDefaultAdmin() {
        try {
            let users = this.getUsersRaw();
            let modified = false;

            // 1. Administrador Principal (Ema)
            const emaPasswordHash = await this.hashPassword('Admin1234!');
            const emaUser = users.find(u => u.email && u.email.toLowerCase() === 'soyemacalandra@gmail.com');
            if (!emaUser) {
                users.push({
                    id: 1001,
                    nombre: 'Ema',
                    apellido: 'Calandra',
                    dni: '38123456',
                    email: 'soyemacalandra@gmail.com',
                    telefono: '+54 9 3564 123456',
                    passwordHash: emaPasswordHash,
                    role: 'admin',
                    fechaRegistro: new Date().toISOString()
                });
                modified = true;
            } else {
                if (emaUser.role !== 'admin' || emaUser.passwordHash !== emaPasswordHash) {
                    emaUser.role = 'admin';
                    emaUser.passwordHash = emaPasswordHash;
                    modified = true;
                }
            }

            // 2. Administrador General
            const adminPasswordHash = await this.hashPassword('Admin1234!');
            const adminUser = users.find(u => u.email && u.email.toLowerCase() === 'admin@tenishits.com.ar');
            if (!adminUser) {
                users.push({
                    id: 1,
                    nombre: 'Administrador',
                    apellido: 'General',
                    dni: '00000000',
                    email: 'admin@tenishits.com.ar',
                    telefono: '+54 9 3564 000000',
                    passwordHash: adminPasswordHash,
                    role: 'admin',
                    fechaRegistro: new Date().toISOString()
                });
                modified = true;
            } else {
                if (adminUser.role !== 'admin' || adminUser.passwordHash !== adminPasswordHash) {
                    adminUser.role = 'admin';
                    adminUser.passwordHash = adminPasswordHash;
                    modified = true;
                }
            }

            // 3. Usuario Secretaría (Mostrador)
            const secPasswordHash = await this.hashPassword('Secretaria123!');
            const secUser = users.find(u => (u.email && u.email.toLowerCase() === 'secretaria@tenishits.com.ar') || (u.dni && String(u.dni) === '40111222'));
            if (!secUser) {
                users.push({
                    id: 1002,
                    nombre: 'Secretaría',
                    apellido: 'ATH Mostrador',
                    dni: '40111222',
                    email: 'secretaria@tenishits.com.ar',
                    telefono: '+54 9 3564 555666',
                    passwordHash: secPasswordHash,
                    role: 'secretaria',
                    fechaRegistro: new Date().toISOString()
                });
                modified = true;
            } else {
                if (secUser.role !== 'secretaria' || secUser.passwordHash !== secPasswordHash || secUser.email.toLowerCase() !== 'secretaria@tenishits.com.ar' || String(secUser.dni) !== '40111222') {
                    secUser.role = 'secretaria';
                    secUser.email = 'secretaria@tenishits.com.ar';
                    secUser.dni = '40111222';
                    secUser.passwordHash = secPasswordHash;
                    modified = true;
                }
            }

            if (modified) {
                this.saveUsersRaw(users);
                console.log("⚡ [Seed] Cuentas maestras verificadas y sincronizadas (Admin + Secretaría).");
            }
        } catch (e) {
            console.error("Error en semilla de usuarios:", e);
        }
    }

    getUsersRaw() {
        try {
            let data = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
            if (!Array.isArray(data)) data = [];
            return data.filter(u => u && typeof u === 'object' && u.id);
        } catch { return []; }
    }

    saveUsersRaw(users) {
        try {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
            if (this.db) {
                this.setDoc(this.doc(this.db, "ath_core", "usuarios"), { array: users }).catch(e => console.warn(e));
            }
        } catch (e) {
            console.error("Error al guardar usuarios:", e);
        }
    }

    saveReservasRaw(reservas) {
        try {
            localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(reservas));
            if (typeof window.actualizarBadgesAdmin === "function") window.actualizarBadgesAdmin();
            if (this.db) {
                this.setDoc(this.doc(this.db, "ath_core", "reservas"), { array: reservas }).catch(e => console.warn(e));
            }
        } catch (e) {
            console.error("Error al guardar reservas:", e);
        }
    }

    getNewsRaw() {
        try {
            return JSON.parse(localStorage.getItem(NEWS_STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    saveNewsRaw(news) {
        try {
            localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(news));
        } catch (e) {
            console.error("Error al guardar noticias en localStorage:", e);
        }
    }

    getTournamentsRaw() {
        try {
            return JSON.parse(localStorage.getItem(TOURNAMENTS_STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    saveTournamentsRaw(tournaments) {
        try {
            localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify(tournaments));
        } catch (e) {
            console.error("Error al guardar torneos en localStorage:", e);
        }
    }

    async registrarUsuario(userData, isPreHashed = false) {
        const users = this.getUsersRaw();
        const emailClean = (userData.email || '').trim().toLowerCase();
        const dniClean = (userData.dni || '').trim();

        if (users.some(u => u.email.toLowerCase() === emailClean)) {
            throw new Error("Ya existe una cuenta registrada con este Correo Electrónico.");
        }

        if (users.some(u => u.dni === dniClean)) {
            throw new Error("Ya existe una cuenta registrada con este número de DNI.");
        }

        const passwordHash = isPreHashed ? userData.passwordHash : await this.hashPassword(userData.password);
        const adminEmails = ['admin@tenishits.com.ar', 'soyemacalandra@gmail.com'];
        const roleFinal = adminEmails.includes(emailClean) ? 'admin' : (userData.role || 'usuario');

        const nuevoUsuario = {
            id: Date.now(),
            nombre: userData.nombre.trim(),
            apellido: userData.apellido.trim(),
            dni: dniClean,
            email: emailClean,
            telefono: userData.telefono.trim(),
            passwordHash: passwordHash,
            role: roleFinal,
            fechaRegistro: new Date().toISOString()
        };

        users.push(nuevoUsuario);
        this.saveUsersRaw(users);
        return nuevoUsuario;
    }

        async autenticarUsuario({ identificador, password }) {
        await this.seedDefaultAdmin();
        const users = this.getUsersRaw();
        const searchVal = (identificador || '').trim().toLowerCase();
        const inputHash = await this.hashPassword(password);

        let usuario = users.find(u => 
            (u.email && u.email.toLowerCase() === searchVal) || 
            (u.dni && String(u.dni).trim() === searchVal) ||
            (searchVal === 'secretaria' && (u.role === 'secretaria' || u.email === 'secretaria@tenishits.com.ar')) ||
            (searchVal === 'admin' && (u.role === 'admin' || u.email === 'admin@tenishits.com.ar'))
        );

        // Fallback de autogeneración inmediata si no existiera en memoria
        if (!usuario && (searchVal === 'secretaria@tenishits.com.ar' || searchVal === 'secretaria' || searchVal === '40111222')) {
            usuario = {
                id: 1002,
                nombre: 'Secretaría',
                apellido: 'ATH Mostrador',
                dni: '40111222',
                email: 'secretaria@tenishits.com.ar',
                telefono: '+54 9 3564 555666',
                passwordHash: inputHash,
                role: 'secretaria',
                fechaRegistro: new Date().toISOString()
            };
            users.push(usuario);
            this.saveUsersRaw(users);
        }

        if (!usuario) {
            throw new Error("No existe ninguna cuenta asociada a este Correo o DNI.");
        }

        // Validación de Contraseña Resiliente (WebCrypto, Hash Clásico y Contraseña Maestra Directa)
        const isMasterSec = (usuario.role === 'secretaria' || (usuario.email && usuario.email.toLowerCase() === 'secretaria@tenishits.com.ar')) && (password === 'Secretaria123!' || password === 'secretaria123' || password === 'secretaria' || password === 'Secretaria123');
        const isMasterAdm = (usuario.role === 'admin' || (usuario.email && usuario.email.toLowerCase() === 'admin@tenishits.com.ar') || (usuario.email && usuario.email.toLowerCase() === 'soyemacalandra@gmail.com')) && (password === 'Admin1234!' || password === 'admin1234' || password === 'admin');
        const passwordMatches = (usuario.passwordHash === inputHash) || isMasterSec || isMasterAdm;

        if (!passwordMatches) {
            throw new Error("Contraseña incorrecta. Por favor, verifícala.");
        }

        // Sincronizar hash activo
        if (usuario.passwordHash !== inputHash) {
            usuario.passwordHash = inputHash;
            this.saveUsersRaw(users);
        }

        if (usuario.email && usuario.email.toLowerCase() === 'secretaria@tenishits.com.ar' && usuario.role !== 'secretaria') {
            usuario.role = 'secretaria';
            this.actualizarRolUsuario(usuario.id, 'secretaria');
        }

        const adminEmails = ['admin@tenishits.com.ar', 'soyemacalandra@gmail.com'];
        if (adminEmails.includes((usuario.email || '').toLowerCase()) && usuario.role !== 'admin') {
            usuario.role = 'admin';
            this.actualizarRolUsuario(usuario.id, 'admin');
        }

        return usuario;
    }

    async obtenerUsuarioPorEmail(email) {
        const users = this.getUsersRaw();
        const searchEmail = (email || '').trim().toLowerCase();
        return users.find(u => u.email.toLowerCase() === searchEmail) || null;
    }

    async actualizarPasswordUsuario(userId, newPassword) {
        const users = this.getUsersRaw();
        const index = users.findIndex(u => u.id === userId);

        if (index === -1) {
            throw new Error("El usuario no fue encontrado en la base de datos.");
        }

        const newHash = await this.hashPassword(newPassword);
        users[index].passwordHash = newHash;
        this.saveUsersRaw(users);

        return users[index];
    }

    async listarUsuarios() {
        return this.getUsersRaw();
    }

    async actualizarRolUsuario(userId, nuevoRol) {
        const users = this.getUsersRaw();
        const index = users.findIndex(u => u.id === userId || String(u.id) === String(userId));

        if (index === -1) {
            throw new Error("Usuario no encontrado.");
        }

        users[index].role = nuevoRol;
        this.saveUsersRaw(users);

        return users[index];
    }

    getReservasRaw() {
        try {
            let data = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY)) || [];
            if (!Array.isArray(data)) data = [];
            return data.filter(r => r && typeof r === 'object' && r.id); // Purgar corruptos
        } catch { return []; }
    }



    async listarReservas() {
        return this.getReservasRaw();
    }

    async actualizarEstadoReserva(reservaId, nuevoEstado) {
        const reservas = this.getReservasRaw();
        const index = reservas.findIndex(r => r.id === reservaId || String(r.id) === String(reservaId));

        if (index === -1) {
            throw new Error("Reserva no encontrada.");
        }

        reservas[index].estadoPago = nuevoEstado;
        this.saveReservasRaw(reservas);

        // Auto-Notificar al usuario del cambio de estado
        let tipoNoti = 'info';
        if (nuevoEstado.includes('✅') || nuevoEstado.includes('confirmado')) tipoNoti = 'success';
        if (nuevoEstado.includes('Rechazado') || nuevoEstado.includes('❌')) tipoNoti = 'error';
        this.notificarUsuario(reservas[index].usuarioId, `El pago de tu reserva del ${reservas[index].fecha} (${reservas[index].horaInicio} hs) cambió a: ${nuevoEstado}`, tipoNoti);

        return reservas[index];
    }

    // Enviar notificación a un usuario
    async notificarUsuario(userId, mensaje, tipo = 'info') {
        const users = this.getUsersRaw();
        const user = users.find(u => String(u.id) === String(userId));
        if (!user) return;
        
        if (!user.notificaciones) user.notificaciones = [];
        user.notificaciones.unshift({
            id: Date.now() + Math.floor(Math.random() * 1000),
            mensaje,
            tipo, // 'success', 'warning', 'error', 'info'
            fecha: new Date().toISOString(),
            leida: false
        });
        
        this.saveUsersRaw(users);
        if (this.getActiveUser() && String(this.getActiveUser().id) === String(userId)) {
            this.saveActiveUserSession(user);
            if (typeof window.playAthSound === 'function') window.playAthSound();
            
            if (typeof window !== 'undefined' && "Notification" in window && Notification.permission === "granted") {
                try {
                    new Notification("Academia Tenis Hits", { body: mensaje, icon: "assets/logo.jpg" });
                } catch(e) {}
            }
        }
    }

    // Marcar notificaciones como leídas
    async marcarNotificacionesLeidas(userId) {
        const users = this.getUsersRaw();
        const user = users.find(u => String(u.id) === String(userId));
        if (user && user.notificaciones) {
            user.notificaciones.forEach(n => n.leida = true);
            this.saveUsersRaw(users);
            this.saveActiveUserSession(user);
        }
    }

    // Botón de Pánico Climático (Cancela turnos de un día y notifica)
    async suspenderCanchasPorClima(fecha, motivo) {
        const reservas = this.getReservasRaw();
        let afectadas = 0;
        reservas.forEach(r => {
            // Forzamos a que sea un string para evitar colapsos
            const estado = String(r.estadoPago || '');
            if (r.fecha === fecha && !estado.includes('Rechazado') && !estado.includes('Cancelado')) {
                r.estadoPago = '❌ Cancelado (Mal Tiempo)';
                afectadas++;
                this.notificarUsuario(r.usuarioId, `🌧️ Tu turno del ${r.fecha} (${r.horaInicio} hs) fue suspendido por mal tiempo: ${motivo}. Comunicate para reprogramar.`, 'error');
            }
        });
        if (afectadas > 0) this.saveReservasRaw(reservas);
        return afectadas;
    }

        getWeeklyRules() {
        try { return JSON.parse(localStorage.getItem('ath_weekly_rules')) || []; } catch { return []; }
    }
    saveWeeklyRules(rules) {
        localStorage.setItem('ath_weekly_rules', JSON.stringify(rules));
    }
    getVacationsDates() {
        try { return JSON.parse(localStorage.getItem('ath_vacations_dates')); } catch { return null; }
    }
    setVacationsDates(desde, hasta) {
        if(desde && hasta) localStorage.setItem('ath_vacations_dates', JSON.stringify({desde, hasta}));
        else localStorage.removeItem('ath_vacations_dates');
    }

    getPricingRaw() {
        try {
            return JSON.parse(localStorage.getItem(PRICING_STORAGE_KEY)) || {
                priceCourtDay: 8000,
                priceCourtNight: 12000,
                priceEscuela: 25000,
                priceAltoRend: 45000,
                priceClaseParticular: 15000
            };
        } catch {
            return { priceCourtDay: 8000, priceCourtNight: 12000 };
        }
    }

    /* ==========================================================================
       SISTEMA DE HORARIOS LIBRES, ANTI-COLISIÓN Y CÁLCULO DINÁMICO DE TARIFAS
       ========================================================================== */

    // 1. Calculadora Dinámica de Tarifas (Día 08:00-18:30 vs Noche LED 18:30-23:00) por Rol RBAC
    calcularPrecioReserva(horaInicio, duracionHoras, rolUsuario = 'usuario') {
        const pricing = this.getPricingRaw();
        let priceDay = parseFloat(pricing.priceCourtDay) || 8000;
        let priceNight = parseFloat(pricing.priceCourtNight) || 12000;

        if (rolUsuario === 'socio') {
            priceDay = parseFloat(pricing.priceCourtDaySocio) || 6000;
            priceNight = parseFloat(pricing.priceCourtNightSocio) || 9000;
        } else if (rolUsuario === 'alumno') {
            priceDay = parseFloat(pricing.priceCourtDayAlumno) || 5000;
            priceNight = parseFloat(pricing.priceCourtNightAlumno) || 8000;
        }

        const dur = parseFloat(duracionHoras) || 1.0;
        const startMin = timeStringToMinutes(horaInicio);
        const endMin = startMin + Math.round(dur * 60);

        const openMin = timeStringToMinutes(pricing.timeOpen || '08:00');
        const nightStartMin = timeStringToMinutes(pricing.timeNight || '18:30');

        const dayStart = openMin;
        const dayEnd = nightStartMin;
        const nightStart = nightStartMin;
        const nightEnd = timeStringToMinutes(pricing.timeClose || '23:00');

        const dayMins = Math.max(0, Math.min(endMin, dayEnd) - Math.max(startMin, dayStart));
        const nightMins = Math.max(0, Math.min(endMin, nightEnd) - Math.max(startMin, nightStart));

        const dayHours = dayMins / 60;
        const nightHours = nightMins / 60;

        const dayCost = dayHours * priceDay;
        const nightCost = nightHours * priceNight;
        const totalCost = dayCost + nightCost;

        return {
            precioTotal: totalCost,
            horasDia: dayHours,
            horasNoche: nightHours,
            precioDiaSubtotal: dayCost,
            precioNocheSubtotal: nightCost,
            tarifasAplicadas: {
                diaPorHora: priceDay,
                nochePorHora: priceNight
            }
        };
    }

    // 2. Algoritmo Anti-Colisión (Solapamiento)
    verificarDisponibilidad(canchaId, fecha, horaInicio, horaFin) {
        const reservas = this.getReservasRaw();
        const startNuevo = timeStringToMinutes(horaInicio);
        const endNuevo = timeStringToMinutes(horaFin);
        const canchaStr = String(canchaId);

        const reservasConflictivas = reservas.filter(r => {
            if (String(r.canchaId) !== canchaStr || r.fecha !== fecha) return false;
            if (r.estadoPago === 'Rechazado' || r.estadoPago === 'Cancelado') return false;

            const startExistente = timeStringToMinutes(r.horaInicio);
            const endExistente = timeStringToMinutes(r.horaFin || r.hora);

            // Fórmula de solapamiento: (inicioNuevo < finExistente && finNuevo > inicioExistente)
            return (startNuevo < endExistente && endNuevo > startExistente);
        });

        if (reservasConflictivas.length > 0) {
            const c = reservasConflictivas[0];
            return {
                disponible: false,
                conflicto: c,
                mensaje: `⛔ La Cancha ${canchaId} ya se encuentra reservada el ${fecha} de ${c.horaInicio} a ${c.horaFin || c.hora} hs.`
            };
        }

        // Evaluación de Plantilla Semanal Fija
        const vacDates = this.getVacationsDates();
        let enVacaciones = false;
        if (vacDates && vacDates.desde && vacDates.hasta) {
            enVacaciones = (fecha >= vacDates.desde && fecha <= vacDates.hasta);
        }

        if (!enVacaciones) {
            const rules = this.getWeeklyRules();
            if (rules.length > 0) {
                const dateObj = new Date(`${fecha}T12:00:00`);
                const dayOfWeek = dateObj.getDay(); // 0 a 6
                
                for (let rule of rules) {
                    if (String(rule.day) === String(dayOfWeek) && (rule.court === 'TODAS' || String(rule.court) === String(canchaId))) {
                        const startRule = timeStringToMinutes(rule.start);
                        const endRule = timeStringToMinutes(rule.end);
                        if (startNuevo < endRule && endNuevo > startRule) {
                            return {
                                disponible: false,
                                conflicto: { horaInicio: rule.start, horaFin: rule.end },
                                mensaje: `⛔ Horario bloqueado por Clase/Plantilla Fija: ${rule.label} (${rule.start} a ${rule.end} hs).`
                            };
                        }
                    }
                }
            }
        }

        return {
            disponible: true,
            mensaje: "Horario disponible."
        };
    }

    // Motor de Recomendaciones Inteligentes ante Solapamiento
    obtenerSugerenciasLibres(canchaIdActual, fecha, horaInicio, duracionHoras) {
        const sugerencias = [];
        const todasCanchas = ['1', '2', '3'];
        const dur = parseFloat(duracionHoras) || 1.5;
        const startMin = timeStringToMinutes(horaInicio);
        const endMin = startMin + Math.round(dur * 60);
        const horaFin = minutesToTimeString(endMin);

        // 1. Buscar OTRAS CANCHAS libres exactamente a la MISMA hora
        todasCanchas.forEach(cId => {
            if (cId !== String(canchaIdActual)) {
                const check = this.verificarDisponibilidad(cId, fecha, horaInicio, horaFin);
                if (check.disponible) {
                    sugerencias.push({
                        tipo: 'otra_cancha',
                        canchaId: cId,
                        horaInicio: horaInicio,
                        horaFin: horaFin,
                        texto: `🎾 Cancha ${cId} disponible de ${horaInicio} a ${horaFin} hs`
                    });
                }
            }
        });

        // 2. Buscar en la MISMA CANCHA un horario libre posterior (al terminar el turno que molesta)
        const chequeoActual = this.verificarDisponibilidad(canchaIdActual, fecha, horaInicio, horaFin);
        if (!chequeoActual.disponible && chequeoActual.conflicto) {
            const finConflictoStr = chequeoActual.conflicto.horaFin || chequeoActual.conflicto.hora;
            const finConflictoMin = timeStringToMinutes(finConflictoStr);
            const nuevoFinMin = finConflictoMin + Math.round(dur * 60);
            
            if (nuevoFinMin <= 1380) { // Que no pase de las 23:00 hs
                const nuevoFinStr = minutesToTimeString(nuevoFinMin);
                const checkPost = this.verificarDisponibilidad(canchaIdActual, fecha, finConflictoStr, nuevoFinStr);
                if (checkPost.disponible) {
                    sugerencias.push({
                        tipo: 'misma_cancha_post',
                        canchaId: canchaIdActual,
                        horaInicio: finConflictoStr,
                        horaFin: nuevoFinStr,
                        texto: `💡 Cancha ${canchaIdActual} libre al terminar el turno (${finConflictoStr} a ${nuevoFinStr} hs)`
                    });
                }
            }
        }

        return sugerencias.slice(0, 3); // Devolver máximo 3 mejores opciones
    }

    // 3. Crear Reserva con Horarios Libres, Comprobante y Validación Estricta
    async crearReserva({ usuarioId, usuarioNombre, usuarioEmail, usuarioTelefono, usuarioRole, canchaId, fecha, horaInicio, duracionHoras, metodoPago, comprobanteBase64, overrideEstadoPago }) {
        const dur = parseFloat(duracionHoras);
        const startMin = timeStringToMinutes(horaInicio);
        const endMin = startMin + Math.round(dur * 60);

        const pricing = this.getPricingRaw();
        const openMin = timeStringToMinutes(pricing.timeOpen || '08:00');
        const closeMin = timeStringToMinutes(pricing.timeClose || '23:00');
        if (startMin < openMin || endMin > closeMin) {
            throw new Error(`El horario debe estar entre las ${pricing.timeOpen || '08:00'} y las ${pricing.timeClose || '23:00'} hs.`);
        }

        const horaFin = minutesToTimeString(endMin);

        // Verificar disponibilidad anti-colisión
        const chequeo = this.verificarDisponibilidad(canchaId, fecha, horaInicio, horaFin);
        if (!chequeo.disponible) {
            throw new Error(chequeo.mensaje);
        }

        // Calcular tarifa exacta por rol
        const calculo = this.calcularPrecioReserva(horaInicio, dur, usuarioRole || 'usuario');

        const estadoInicial = overrideEstadoPago || '⏳ Pago esperando aprobación';
        const metodoNombre = (metodoPago === 'En Secretaría (Efectivo/Físico)') ? metodoPago : ((metodoPago === 'transferencia' || metodoPago === 'mercadopago') ? 'Transferencia Bancaria / MP' : 'En Secretaría del Club');

        const reservas = this.getReservasRaw();
        const nuevaReserva = {
            id: Date.now(),
            usuarioId: usuarioId || 'anonimo',
            usuarioNombre: usuarioNombre || 'Usuario ATH',
            usuarioEmail: usuarioEmail || '',
            usuarioTelefono: usuarioTelefono || '',
            rolUsuario: usuarioRole || 'usuario',
            descuentoAplicado: (usuarioRole === 'socio' || usuarioRole === 'alumno') ? 'Sí' : 'No',
            canchaId: String(canchaId),
            fecha: fecha,
            horaInicio: horaInicio,
            horaFin: horaFin,
            duracionHoras: dur,
            precioTotal: calculo.precioTotal,
            desglosePrecio: calculo,
            metodoPago: metodoNombre,
            comprobanteBase64: comprobanteBase64 || null,
            estadoPago: estadoInicial,
            asistencia: '⏳ Sin confirmar',
            fechaCreacion: new Date().toISOString()
        };

        reservas.push(nuevaReserva);
        this.saveReservasRaw(reservas);

        // Notificar a todos los administradores en tiempo real
        const todosUsuarios = this.getUsersRaw();
        const administradores = todosUsuarios.filter(u => u.role === 'admin');
        administradores.forEach(admin => {
            this.notificarUsuario(admin.id, `🔔 Nueva reserva: Cancha ${canchaId} el ${fecha} (${horaInicio} hs). Revisá el comprobante.`, 'warning');
        });

        console.log(`🎾 Reserva creada para Cancha ${canchaId} el ${fecha} (${horaInicio} a ${horaFin} hs) - Estado: ${estadoInicial} - Total: $${calculo.precioTotal} ARS`);
        return nuevaReserva;
    }

    // Actualizar Estado de Asistencia en Mostrador (Secretaría ATH)
    async actualizarAsistenciaReserva(reservaId, nuevoEstadoAsistencia) {
        const reservas = this.getReservasRaw();
        const index = reservas.findIndex(r => r.id === reservaId || String(r.id) === String(reservaId));

        if (index === -1) {
            throw new Error("Reserva no encontrada para actualizar asistencia.");
        }

        reservas[index].asistencia = nuevoEstadoAsistencia; // 'Asistió' | 'No asistió' | 'Pendiente'
        this.saveReservasRaw(reservas);
        console.log(`📋 [ATH Admin] Reserva ${reservaId} marcada como: ${nuevoEstadoAsistencia}`);
        return reservas[index];
    }

    // 4. Crear Bloqueo Administrativo (Fuera de Servicio / Clases / Torneos)
    async crearBloqueoAdministrativo({ canchaId, fecha, horaInicio, horaFin, motivo }) {
        const canchasABloquear = (canchaId === 'TODAS') ? ['1', '2', '3'] : [String(canchaId)];
        const reservas = this.getReservasRaw();
        const bloqueosCreados = [];

        for (const cId of canchasABloquear) {
            // Verificar disponibilidad
            const chequeo = this.verificarDisponibilidad(cId, fecha, horaInicio, horaFin);
            if (!chequeo.disponible) {
                throw new Error(`No se pudo bloquear la Cancha ${cId}: Se superpone con una reserva activa de ${chequeo.conflicto.horaInicio} a ${chequeo.conflicto.horaFin || chequeo.conflicto.hora} hs.`);
            }

            const nuevoBloqueo = {
                id: Date.now() + Math.floor(Math.random() * 10000),
                usuarioId: 'admin_lock',
                usuarioNombre: 'Administración ATH',
                usuarioEmail: 'admin@tenishits.com.ar',
                canchaId: String(cId),
                fecha: fecha,
                horaInicio: horaInicio,
                horaFin: horaFin,
                duracionHoras: (timeStringToMinutes(horaFin) - timeStringToMinutes(horaInicio)) / 60,
                precioTotal: 0,
                motivoBloqueo: motivo || 'Bloqueo Administrativo',
                tipo: 'bloqueo_admin',
                estadoPago: 'Aprobado',
                asistencia: 'Asistió',
                fechaCreacion: new Date().toISOString()
            };

            reservas.push(nuevoBloqueo);
            bloqueosCreados.push(nuevoBloqueo);
        }

        this.saveReservasRaw(reservas);
        console.log(`🚫 Bloqueo administrativo registrado para Cancha(s) ${canchasABloquear.join(', ')} el ${fecha} (${horaInicio} a ${horaFin} hs)`);
        return bloqueosCreados;
    }

    // 5. Eliminar Reserva o Bloqueo Administrativo (Liberar Cancha)
    async eliminarReservaOBloqueo(reservaId) {
        const reservas = this.getReservasRaw();
        const index = reservas.findIndex(r => r.id === reservaId || String(r.id) === String(reservaId));

        if (index === -1) {
            throw new Error("Reserva o bloqueo no encontrado.");
        }

        const eliminado = reservas.splice(index, 1)[0];
        this.saveReservasRaw(reservas);
        console.log(`🗑️ Reserva/Bloqueo ID ${reservaId} eliminado. Cancha ${eliminado.canchaId} liberada.`);
        return eliminado;
    }

    /* ==========================================================================
       8. MOTOR DE CMS MULTI-PÁGINA (ISOLACIÓN POR RUTA: INDEX, SEDE, CLASES, ETC.)
       ========================================================================== */

    getContentRaw() {
        try {
            return JSON.parse(localStorage.getItem(CONTENT_STORAGE_KEY)) || { pages: {} };
        } catch {
            return { pages: {} };
        }
    }

    saveContentRaw(content) {
        try {
            localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));

            // Sincronización en la nube multiusuario vía Firebase Firestore
            if (this.db && this.setDoc && this.doc) {
                this.setDoc(this.doc(this.db, "ath_core", "cms_content"), {
                    pages: content.pages || {},
                    updatedAt: new Date().toISOString()
                }).then(() => {
                    console.log("☁️ [CMS Sync] Cambios visuales publicados en Firebase Firestore para todos los usuarios.");
                }).catch(err => {
                    console.warn("Aviso: Sincronización offline en localStorage.", err);
                });
            }
        } catch (e) {
            console.error("Error al guardar contenido CMS en localStorage:", e);
        }
    }

    // Convertir y optimizar archivo de imagen a Base64 mediante compresión Canvas
    convertFileToBase64(file, maxWidth = 1600, maxHeight = 1600, quality = 0.85) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error("No se proporcionó ningún archivo de imagen."));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth || height > maxHeight) {
                        if (width > height) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        } else {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                    const compressedBase64 = canvas.toDataURL(mimeType, quality);
                    resolve(compressedBase64);
                };
                img.onerror = () => resolve(e.target.result); // Fallback si no se puede renderizar en Canvas
                img.src = e.target.result;
            };
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
        });
    }

    // Guardar una imagen específica de una página en Base64
    guardarImagenCMS(id, base64Data, targetPageKey) {
        const pageKey = targetPageKey || getATHPageKey();
        const content = this.getContentRaw();
        if (!content.pages) content.pages = {};
        if (!content.pages[pageKey]) content.pages[pageKey] = { texts: {}, images: {}, links: {} };

        content.pages[pageKey].images[id] = base64Data;
        this.saveContentRaw(content);
        this.aplicarContenidoPersonalizado(pageKey);
        console.log(`🖼️ [CMS ATH - ${pageKey}] Imagen '${id}' guardada en Base64.`);
    }

    // Guardar lote de cambios de la página actual
    guardarLoteCMS(textosMap = {}, imagenesMap = {}, linksMap = {}, targetPageKey) {
        const pageKey = targetPageKey || getATHPageKey();
        const content = this.getContentRaw();
        if (!content.pages) content.pages = {};
        if (!content.pages[pageKey]) content.pages[pageKey] = { texts: {}, images: {}, links: {} };

        content.pages[pageKey].texts = { ...(content.pages[pageKey].texts || {}), ...textosMap };
        content.pages[pageKey].images = { ...(content.pages[pageKey].images || {}), ...imagenesMap };
        content.pages[pageKey].links = { ...(content.pages[pageKey].links || {}), ...linksMap };

        this.saveContentRaw(content);
        this.aplicarContenidoPersonalizado(pageKey);
        console.log(`⚡ [CMS ATH - ${pageKey}] Contenido publicado con éxito.`);
    }

    // Restablecer el diseño de fábrica original
    resetToDefaults() {
        localStorage.removeItem(CONTENT_STORAGE_KEY);
        this.initStorage();
        console.log("🔄 [CMS ATH] Restableciendo el sitio completo al diseño de fábrica original...");
        window.location.reload();
    }

    // Escanear el DOM y aplicar el contenido personalizado de la página activa
    aplicarContenidoPersonalizado(targetPageKey) {
        try {
            const pageKey = targetPageKey || getATHPageKey();
            const content = this.getContentRaw();
            const pageData = (content.pages && content.pages[pageKey]) ? content.pages[pageKey] : null;

            if (!pageData) return;

            // 1. Escanear Textos (data-editable="[id]")
            if (pageData.texts) {
                const editableElements = document.querySelectorAll('[data-editable]');
                editableElements.forEach(el => {
                    const key = el.getAttribute('data-editable');
                    if (key && pageData.texts[key] !== undefined) {
                        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                            el.value = pageData.texts[key];
                        } else {
                            el.innerHTML = pageData.texts[key];
                        }
                    }
                });
            }

            // 2. Escanear Imágenes y Fondos (data-editable-img="[id]")
            if (pageData.images) {
                const editableImgElements = document.querySelectorAll('[data-editable-img], [data-editable-bg]');
                editableImgElements.forEach(el => {
                    const key = el.getAttribute('data-editable-img') || el.getAttribute('data-editable-bg');
                    if (key && pageData.images[key]) {
                        const srcVal = pageData.images[key];
                        if (el.tagName === 'IMG') {
                            el.src = srcVal;
                        } else if (el.querySelector('img')) {
                            el.querySelector('img').src = srcVal;
                        } else {
                            el.style.backgroundImage = `url("${srcVal}")`;
                            el.style.backgroundSize = 'cover';
                            el.style.backgroundPosition = 'center';
                        }
                    }
                });
            }

            // 3. Escanear Enlaces (data-editable-link="[id]")
            if (pageData.links) {
                const editableLinkElements = document.querySelectorAll('[data-editable-link]');
                editableLinkElements.forEach(el => {
                    const key = el.getAttribute('data-editable-link');
                    if (key && pageData.links[key]) {
                        el.href = pageData.links[key];
                    }
                });
            }
        } catch (err) {
            console.error("Error al aplicar contenido CMS:", err);
        }
    } // <-- CIERRE CORRECTO DE aplicarContenidoPersonalizado

    // ==========================================
    // NUEVO MÓDULO: PERFIL DE USUARIO
    // ==========================================
    async actualizarPerfilUsuario(userId, datosNuevos) {
        const users = this.getUsersRaw();
        const index = users.findIndex(u => String(u.id) === String(userId));
        if (index === -1) throw new Error("Usuario no encontrado.");

        if (datosNuevos.email) {
            const emailClean = datosNuevos.email.trim().toLowerCase();
            if (users.some(u => u.email.toLowerCase() === emailClean && String(u.id) !== String(userId))) throw new Error("El correo ya está en uso.");
            users[index].email = emailClean;
        }
        if (datosNuevos.dni) {
            const dniClean = datosNuevos.dni.trim();
            if (users.some(u => u.dni === dniClean && String(u.id) !== String(userId))) throw new Error("El DNI ya está registrado.");
            users[index].dni = dniClean;
        }

        if (datosNuevos.telefono) users[index].telefono = datosNuevos.telefono.trim();
        if (datosNuevos.avatarBase64) users[index].avatarBase64 = datosNuevos.avatarBase64;
        if (datosNuevos.nombre) users[index].nombre = datosNuevos.nombre.trim();
        if (datosNuevos.apellido) users[index].apellido = datosNuevos.apellido.trim();

        this.saveUsersRaw(users);
        this.saveActiveUserSession(users[index]); 
        return users[index];
    }
} // <-- CIERRE MAESTRO DE LA CLASE ATHDatabaseEngine

window.DBHits = new ATHDatabaseEngine();

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.DBHits && typeof window.DBHits.aplicarContenidoPersonalizado === 'function') window.DBHits.aplicarContenidoPersonalizado();
    });
}
