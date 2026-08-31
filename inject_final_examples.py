with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# 1. Usuarios y Roles
html = re.sub(
    r'(Buscá usuarios por Nombre, Apellido, DNI o Email.*?)</p>',
    r'\1</p>\n                        <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: -10px; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Busca a un usuario y cámbiale el rol a "alumno" para que tenga descuentos en sus reservas.</p>',
    html, flags=re.DOTALL
)

# 2. Agenda de turnos
html = re.sub(
    r'(<div class="admin-tab-content active" id="admin-tab-turnos">\s*<div class="admin-card">\s*<h3 class="admin-card-title">.*?</h3>)',
    r'\1\n                        <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: El canchero puede usar esta vista para ver de un pantallazo rápido quién viene a jugar hoy y en qué cancha.</p>',
    html, flags=re.DOTALL
)

# 3. Pagos y Reservas
html = re.sub(
    r'(<div class="admin-tab-content" id="admin-tab-reservas">\s*<div class="admin-card">\s*<h3 class="admin-card-title">.*?</h3>)',
    r'\1\n                        <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Entras aquí para revisar un comprobante de transferencia. Si el dinero llegó, presionas "Aprobar". Si el comprobante es falso, presionas "Rechazar" y la cancha queda libre de nuevo.</p>',
    html, flags=re.DOTALL
)

# 4. Tarifas
html = re.sub(
    r'(<div class="admin-tab-content" id="admin-tab-tarifas">\s*<div class="admin-card".*?>\s*<h3 class="admin-card-title">.*?</h3>)',
    r'\1\n                        <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Cambias el precio nocturno aquí a .000 y automáticamente toda la página web se actualiza con el nuevo precio para los usuarios.</p>',
    html, flags=re.DOTALL
)

# Horarios
html = re.sub(
    r'(<h3 class="admin-card-title"><i class="fa-solid fa-clock".*?</h3>)',
    r'\1\n                        <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Cambias la hora de cierre de Sábados a las 18:00 y automáticamente nadie podrá reservar a las 19:00 los fines de semana.</p>',
    html, flags=re.DOTALL
)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)