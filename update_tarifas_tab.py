import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\admin.html'

with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

start_marker = '<!-- MÓDULO 4: EDICIÓN DE PRECIOS Y TARIFAS -->'
end_marker = '<!-- MÓDULO 5: GESTIÓN Y BLOQUEO DE CANCHAS -->'

if start_marker not in html or end_marker not in html:
    print('Markers not found')
    sys.exit(1)

start_idx = html.find(start_marker)
end_idx = html.find(end_marker)

new_content = '''<!-- MÓDULO 4: EDICIÓN DE PRECIOS Y TARIFAS -->
                <div class="admin-tab-content" id="admin-tab-tarifas">
                    
                    <form id="pricingForm" class="modal-form" style="max-width: 100%;">
                        
                        <!-- TARJETA 1: MATRIZ DE PRECIOS Y ROLES -->
                        <div class="admin-card" style="margin-bottom: 24px;">
                            <h3 class="admin-card-title">
                                <i class="fa-solid fa-sack-dollar" style="color: var(--color-ath-orange);"></i> 
                                Matriz de Precios y Roles
                            </h3>
                            <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 24px;">
                                Actualizá los precios vigentes para alquiler de canchas y programas de entrenamiento de la academia.
                            </p>

                            <!-- SECCIÓN A: ALQUILER DE CANCHAS (MATRIZ POR ROLES) -->
                            <h4 style="color: var(--color-ath-orange); margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px;"><i class="fa-solid fa-layer-group"></i> Matriz de Alquiler de Canchas (ARS/Hora)</h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px;">
                                <!-- Estándar -->
                                <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                                    <label style="color: #94A3B8; font-size: 0.8rem; text-transform: uppercase;">Invitado / Usuario Estándar</label>
                                    <div class="form-group" style="margin-top: 8px;">
                                        <label><i class="fa-solid fa-sun" style="color: #FFD700;"></i> Día</label>
                                        <input type="number" id="priceCourtDay" value="8000" required>
                                    </div>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-bolt" style="color: #FFD700;"></i> Noche (LED)</label>
                                        <input type="number" id="priceCourtNight" value="12000" required>
                                    </div>
                                </div>
                                <!-- Socios -->
                                <div style="background: rgba(59, 130, 246, 0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3);">
                                    <label style="color: #60A5FA; font-size: 0.8rem; text-transform: uppercase;">Socios ATH</label>
                                    <div class="form-group" style="margin-top: 8px;">
                                        <label><i class="fa-solid fa-sun" style="color: #FFD700;"></i> Día (Socio)</label>
                                        <input type="number" id="priceCourtDaySocio" value="6000" required>
                                    </div>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-bolt" style="color: #FFD700;"></i> Noche (Socio)</label>
                                        <input type="number" id="priceCourtNightSocio" value="9000" required>
                                    </div>
                                </div>
                                <!-- Alumnos -->
                                <div style="background: rgba(16, 185, 129, 0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3);">
                                    <label style="color: #34D399; font-size: 0.8rem; text-transform: uppercase;">Alumnos Escuela</label>
                                    <div class="form-group" style="margin-top: 8px;">
                                        <label><i class="fa-solid fa-sun" style="color: #FFD700;"></i> Día (Alumno)</label>
                                        <input type="number" id="priceCourtDayAlumno" value="5000" required>
                                    </div>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-bolt" style="color: #FFD700;"></i> Noche (Alumno)</label>
                                        <input type="number" id="priceCourtNightAlumno" value="8000" required>
                                    </div>
                                </div>
                            </div>

                            <!-- SECCIÓN B: CUOTAS Y CLASES -->
                            <h4 style="color: var(--color-ath-orange); margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px;"><i class="fa-solid fa-graduation-cap"></i> Escuela, Entrenamiento y Particulares</h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                                <div class="form-group">
                                    <label>Cuota Mensual Formativa (ARS)</label>
                                    <input type="number" id="priceEscuela" value="25000" required>
                                </div>
                                <div class="form-group">
                                    <label>Cuota Alto Rendimiento (ARS)</label>
                                    <input type="number" id="priceAltoRend" value="45000" required>
                                </div>
                                <div class="form-group">
                                    <label>Clase Particular Individual (ARS)</label>
                                    <input type="number" id="priceClaseParticular" value="15000" required>
                                </div>
                            </div>
                        </div>

                        <!-- TARJETA 2: HORARIOS DE OPERACIÓN DEL CLUB -->
                        <div class="admin-card" style="margin-bottom: 24px;">
                            <h3 class="admin-card-title">
                                <i class="fa-solid fa-clock" style="color: var(--color-ath-orange);"></i> 
                                Horarios de Operación del Club
                            </h3>
                            <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 24px;">
                                Configura la hora de apertura, cierre e inicio de la tarifa lumínica (nocturna).
                            </p>

                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                                <div class="form-group">
                                    <label><i class="fa-solid fa-door-open"></i> Hora Apertura</label>
                                    <input type="time" id="configTimeOpen" value="08:00" required style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-weight: 700; width: 100%;">
                                </div>
                                <div class="form-group">
                                    <label><i class="fa-solid fa-door-closed"></i> Hora Cierre</label>
                                    <input type="time" id="configTimeClose" value="23:00" required style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-weight: 700; width: 100%;">
                                </div>
                                <div class="form-group">
                                    <label><i class="fa-solid fa-moon"></i> Inicio Tarifa Nocturna (LED)</label>
                                    <input type="time" id="configTimeNight" value="18:30" required style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-weight: 700; width: 100%;">
                                </div>
                            </div>

                            <button type="submit" class="btn-submit" style="margin-top: 24px; max-width: 300px;">
                                <i class="fa-solid fa-floppy-disk"></i> Guardar Tarifas y Horarios
                            </button>
                        </div>
                    </form>

                    <!-- TARJETA 3: DATOS DE CONTACTO Y WHATSAPP OFICIAL -->
                    <div class="admin-card" style="border: 1px solid var(--color-ath-orange); margin-bottom: 24px;">
                        <h3 class="admin-card-title"><i class="fa-solid fa-address-card" style="color: var(--color-ath-orange);"></i> Datos de Contacto y WhatsApp Oficial</h3>
                        <p style="color: var(--color-text-muted); font-size: 0.88rem; margin-bottom: 16px;">Estos datos se mostrarán en la sección de contacto y sincronizarán el botón flotante y los reenvíos de WhatsApp.</p>
                        
                        <form id="formClubConfig" style="display: flex; flex-direction: column; gap: 14px;">
                            <div class="form-group">
                                <label style="font-weight: 700; color: #FFF;">Correo Electrónico Oficial</label>
                                <input type="email" id="clubEmailInput" required style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; box-sizing: border-box;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: 700; color: #FFF;">Dirección / Ubicación</label>
                                <input type="text" id="clubAddressInput" required style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; box-sizing: border-box;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: 700; color: #FFF;">Número de WhatsApp Oficial (con código de país, sin '+' ni espacios. Ej: 5493564...)</label>
                                <input type="text" id="clubWppInput" required placeholder="5493564..." style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; box-sizing: border-box;">
                            </div>
                            <button type="submit" class="btn-submit" style="background: var(--color-ath-orange); justify-content: center;"><i class="fa-solid fa-floppy-disk"></i> Guardar Datos del Contacto</button>
                        </form>
                    </div>
                </div>

                '''

final_html = html[:start_idx] + new_content + html[end_idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(final_html)

print('Updated admin-tab-tarifas successfully')