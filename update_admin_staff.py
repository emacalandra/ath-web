import sys

filepath = r'c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath\admin.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add nav button
nav_search = '<button class="admin-tab-btn" data-admintab="canchas">\n                        <i class="fa-solid fa-lock"></i> 6. Gestión y Bloqueo de Canchas\n                    </button>'
nav_replace = nav_search + '\n                    <button class="admin-tab-btn" data-admintab="staff">\n                        <i class="fa-solid fa-users"></i> 7. Staff y Equipo\n                    </button>'

if nav_search in html:
    html = html.replace(nav_search, nav_replace)

# 2. Add tab content at the end of module 6
mod6_end = '<!-- SCRIPTS -->'

tab_staff = '''
                <!-- MÓDULO 7: GESTIÓN DE STAFF -->
                <div class="admin-tab-content" id="admin-tab-staff">
                    <div class="admin-card">
                        <h3 class="admin-card-title">
                            <i class="fa-solid fa-users" style="color: var(--color-ath-orange);"></i> 
                            Gestión de Staff y Equipo
                        </h3>
                        <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 24px;">
                            Agrega, edita o elimina a los profesores, directivos y encargados que se mostrarán en la sección "Contacto y Staff".
                        </p>
                        
                        <div class="grid-2col" style="align-items: start;">
                            <!-- Formulario Nuevo/Edición -->
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); padding: 20px; border-radius: 12px;">
                                <h4 style="color: #FFF; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;" id="staffFormTitle">Nuevo Miembro del Staff</h4>
                                <form id="formStaffAdmin" style="display: flex; flex-direction: column; gap: 14px;">
                                    <input type="hidden" id="staffId">
                                    <div class="form-group">
                                        <label>Nombre y Apellido</label>
                                        <input type="text" id="staffName" required placeholder="Ej: Emanuel Calandra">
                                    </div>
                                    <div class="form-group">
                                        <label>Cargo / Rol</label>
                                        <input type="text" id="staffRole" required placeholder="Ej: Director & Profe Principal">
                                    </div>
                                    <div class="form-group">
                                        <label>Descripción / Bio Corta</label>
                                        <textarea id="staffDesc" rows="3" required placeholder="Especialista en alto rendimiento..." style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px; border-radius: 8px; width: 100%; box-sizing: border-box;"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label>URL de Foto (Avatar)</label>
                                        <input type="text" id="staffPhoto" placeholder="Dejar vacío para avatar genérico">
                                    </div>
                                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                                        <button type="submit" class="btn-submit" style="flex: 1; justify-content: center;"><i class="fa-solid fa-save"></i> Guardar</button>
                                        <button type="button" class="btn-submit" id="btnCancelStaff" style="flex: 1; justify-content: center; background: rgba(255,255,255,0.1); color: #FFF; display: none;"><i class="fa-solid fa-times"></i> Cancelar</button>
                                    </div>
                                </form>
                            </div>

                            <!-- Lista de Staff -->
                            <div>
                                <h4 style="color: #FFF; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">Staff Actual</h4>
                                <div id="adminStaffList" style="display: flex; flex-direction: column; gap: 12px;">
                                    <!-- Cargado por JS -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

'''

if mod6_end in html:
    html = html.replace(mod6_end, tab_staff + mod6_end)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Updated admin.html with staff tab")