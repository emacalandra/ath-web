import re

with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. REMOVE DUPLICATE APERTURA BLOCKS
# The block is <div class="form-group">\s*<label[^>]*>Hora de Apertura</label> ... to the end of the form group of clubWppInput?
# Let's find exactly what was pasted blindly.
bad_block_regex = r'\s*<div class="form-group">\s*<label[^>]*>Hora de Apertura</label>.*?<input type="time" id="clubCierreInput"[^>]*>\s*</div>'
# Wait, the original bad injection had Apertura, Cierre, and sometimes others? Let's just remove anything that matches this.
# BUT we need to KEEP the legitimate one.
# Let's first completely remove ALL of them!
clean_content = re.sub(bad_block_regex, '', content, flags=re.DOTALL)

# Now, we manually re-insert the legitimate one into the right place in admin-tab-tarifas, right before <button type="submit" id="saveClubConfigBtn"...>
# Wait, where was the save button for the club config?
# In admin.html, under "Configuración Global del Club":
config_section = r'(<h3 class="admin-card-title">.*?Configuraci.n Global del Club.*?</h3>.*?<p.*?>.*?</p>)'
legit_inputs = '''
                            <div class="form-group">
                                <label style="font-weight: 700; color: #FFF;"><i class="fa-solid fa-door-open" style="color: #10B981;"></i> Hora de Apertura</label>
                                <input type="time" id="clubAperturaInput" required style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; box-sizing: border-box;">
                                <p class="help-text" style="font-size: 0.8rem; color: #94A3B8; margin-top: 4px;">Ej: 08:00. Define desde qué hora se puede reservar.</p>
                            </div>
                            <div class="form-group">
                                <label style="font-weight: 700; color: #FFF;"><i class="fa-solid fa-door-closed" style="color: #EF4444;"></i> Hora de Cierre</label>
                                <input type="time" id="clubCierreInput" required style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; box-sizing: border-box;">
                                <p class="help-text" style="font-size: 0.8rem; color: #94A3B8; margin-top: 4px;">Ej: 23:00. Define la última hora disponible.</p>
                            </div>
'''
if re.search(config_section, clean_content, re.DOTALL):
    clean_content = re.sub(config_section, r'\1\n' + legit_inputs, clean_content, flags=re.DOTALL)


# 2. ADD TAB "Agenda de Turnos"
tabs_nav_regex = r'(<button class="admin-tab-btn" data-admintab="reservas">.*?)</button>'
# Wait, let's just insert it after 'reservas'
new_tab_btn = '''
                    <button class="admin-tab-btn" data-admintab="turnos">
                        <i class="fa-solid fa-calendar-days"></i> 3. Agenda de Turnos
                    </button>'''
clean_content = re.sub(r'(<button class="admin-tab-btn" data-admintab="reservas">.*?</button>)', r'\1' + new_tab_btn, clean_content, flags=re.DOTALL)

# Adjust the numbers of other tabs
clean_content = clean_content.replace('3. Publicar Contenido', '4. Publicar Contenido')
clean_content = clean_content.replace('4. Tarifas y Horarios', '5. Tarifas y Horarios')
clean_content = clean_content.replace('5. Escuela y Alumnos', '6. Escuela y Alumnos')
clean_content = clean_content.replace('6. Gesti\u00f3n y Bloqueo de Canchas', '7. Gesti\u00f3n y Bloqueo de Canchas')
clean_content = clean_content.replace('7. Staff y Equipo', '8. Staff y Equipo')

# Create the content for "Turnos"
turnos_content = '''
                <!-- MÓDULO 3: AGENDA DE TURNOS -->
                <div class="admin-tab-content" id="admin-tab-turnos">
                    <div class="admin-card">
                        <h3 class="admin-card-title">
                            <i class="fa-solid fa-calendar-days" style="color: var(--color-ath-orange);"></i> 
                            Agenda Operativa de Turnos
                        </h3>
                        <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 20px;">
                            Consulta rápida de las canchas reservadas, ordenadas con los turnos más próximos arriba.
                        </p>
                        
                        <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                            <button id="btnFilterHoy" class="btn-submit" style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10B981; color: #34D399; width: auto; margin: 0; padding: 8px 16px;">Hoy</button>
                            <button id="btnFilterManana" class="btn-submit" style="background: rgba(59, 130, 246, 0.2); border: 1px solid #3B82F6; color: #60A5FA; width: auto; margin: 0; padding: 8px 16px;">Mañana</button>
                            <input type="date" id="inputFilterFecha" class="admin-search-bar" style="margin: 0; width: auto; flex: 1; min-width: 150px;">
                            <button id="btnFilterClear" class="btn-submit" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFF; width: auto; margin: 0; padding: 8px 16px;">Ver Todos</button>
                        </div>

                        <div class="admin-table-container">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Cancha</th>
                                        <th>Reservó</th>
                                    </tr>
                                </thead>
                                <tbody id="turnosTableBody">
                                    <!-- Dinámico -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
'''
# Insert after admin-tab-reservas
clean_content = re.sub(r'(<div class="admin-tab-content" id="admin-tab-reservas">.*?</div>\s*</div>\s*</div>)', r'\1\n' + turnos_content, clean_content, flags=re.DOTALL)


# 3. REORGANIZE "CANCHAS" TAB AND ADD DESCRIPTIONS
# I will use a simple regex to add help text to the Canchas tab forms.
help_texts = {
    'Crear / Eliminar Canchas Físicas': '<p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: 5px; margin-bottom: 15px;">Ejemplo: Agrega "Cancha 4" si construyeron una nueva, o borra una vieja. Esto afecta la grilla principal.</p>',
    'Bloqueo Temporal de Cancha': '<p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: 5px; margin-bottom: 15px;">Ejemplo: Selecciona Cancha 1, fecha de hoy, de 14:00 a 16:00, motivo "Mantenimiento". Nadie podrá reservar en ese horario.</p>',
    'Bloquear Múltiples Días': '<p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: 5px; margin-bottom: 15px;">Ejemplo: Del 01/10 al 15/10. Ideal para torneos o refacciones largas.</p>',
    'Crear Excepción Horaria de Disponibilidad': '<p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: 5px; margin-bottom: 15px;">Ejemplo: Si el club cierra siempre a las 23:00, pero el 24 de Diciembre cierran a las 18:00, usa esta herramienta.</p>'
}
for k, v in help_texts.items():
    clean_content = clean_content.replace(f'</h4>\n', f'</h4>\n{v}\n')

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(clean_content)

print("admin.html rewritten.")