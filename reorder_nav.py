with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

new_nav = '''<div class="admin-tabs-nav">
                    <button class="admin-tab-btn active" data-admintab="turnos">
                        <i class="fa-solid fa-calendar-days"></i> 1. Agenda de Turnos
                    </button>
                    <button class="admin-tab-btn" data-admintab="reservas">
                        <i class="fa-solid fa-file-invoice-dollar"></i> 2. Pagos & Reservas <span id="adminPendingBadge" style="display:none; align-items:center; justify-content:center; background:#EF4444; color:#FFF; font-size:0.75rem; padding:0 6px; height:18px; border-radius:10px; margin-left:6px; box-shadow:0 0 5px rgba(239,68,68,0.5);">0</span>
                    </button>
                    <button class="admin-tab-btn" data-admintab="tarifas">
                        <i class="fa-solid fa-tags"></i> 3. Tarifas y Horarios
                    </button>
                    <button class="admin-tab-btn" data-admintab="usuarios">
                        <i class="fa-solid fa-users-gear"></i> 4. Usuarios & Roles
                    </button>
                    <button class="admin-tab-btn" data-admintab="canchas">
                        <i class="fa-solid fa-lock"></i> 5. Gestión y Bloqueo de Canchas
                    </button>
                    <button class="admin-tab-btn future-module" data-admintab="escuela">
                        <i class="fa-solid fa-graduation-cap"></i> 6. Escuela y Alumnos
                    </button>
                    <button class="admin-tab-btn future-module" data-admintab="contenido">
                        <i class="fa-solid fa-newspaper"></i> 7. Publicar Contenido
                    </button>
                </div>'''

html = re.sub(r'<div class="admin-tabs-nav">.*?</div>', new_nav, html, flags=re.DOTALL)

# Set turnos to active
html = html.replace('<div class="admin-tab-content active" id="admin-tab-usuarios">', '<div class="admin-tab-content" id="admin-tab-usuarios">')
html = html.replace('<div class="admin-tab-content" id="admin-tab-turnos">', '<div class="admin-tab-content active" id="admin-tab-turnos">')

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)