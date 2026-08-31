with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# 1. Usuarios y Roles
html = re.sub(
    r'(<p style="color: var\(--color-text-muted\); font-size: 0.9rem; margin-bottom: 24px;">Gestiona los permisos.*?)</p>',
    r'\1</p>\n                        <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: -10px; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Busca a un usuario y cámbiale el rol a "Alumno" para que tenga descuentos automáticos al reservar.</p>',
    html
)

# 2. Pagos y Reservas
html = re.sub(
    r'(<p style="color: var\(--color-text-muted\); font-size: 0.9rem; margin-bottom: 20px;">Controlá las transferencias subidas.*?)</p>',
    r'\1</p>\n                        <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: -10px; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Entras aquí para revisar un comprobante. Si el dinero llegó, presionas "Aprobar". Si el comprobante es falso, presionas "Rechazar" y la cancha queda libre de nuevo.</p>',
    html
)

# 3. Agenda de Turnos
html = re.sub(
    r'(<p style="color: var\(--color-text-muted\); font-size: 0.9rem; margin-bottom: 20px;">Monitoreo rápido de quién juega hoy.*?)</p>',
    r'\1</p>\n                        <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: -10px; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: El canchero puede usar esta vista desde su celular para saber a qué hora llegan los próximos jugadores sin tener opciones peligrosas.</p>',
    html
)

# 4. Tarifas - Precios
html = re.sub(
    r'(<p style="color: var\(--color-text-muted\); font-size: 0.9rem; margin-bottom: 24px;">\s*Configura los valores base.*?)</p>',
    r'\1</p>\n                        <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: -10px; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Cambias el precio nocturno aquí a .000 y al darle Guardar, toda la página web se actualiza al instante con el nuevo precio.</p>',
    html
)

# 5. Tarifas - Horarios
html = re.sub(
    r'(<p style="color: var\(--color-text-muted\); font-size: 0.9rem; margin-bottom: 24px;">\s*Establece a qué hora abre y cierra.*?)</p>',
    r'\1</p>\n                        <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: -10px; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Cambias la hora de cierre de Sábados a las 18:00 y automáticamente nadie podrá reservar a las 19:00 los fines de semana.</p>',
    html
)

# 6. Tarifas - Contacto
html = re.sub(
    r'(<p style="color: var\(--color-text-muted\); font-size: 0.88rem; margin-bottom: 16px;">\s*Estos datos se mostrarán en la sección de contacto.*?)</p>',
    r'\1</p>\n                        <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: -10px; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Si cambian el número de teléfono, lo escribís acá y el botón flotante de WhatsApp de toda la página se actualiza solo para dirigir al nuevo número.</p>',
    html
)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)