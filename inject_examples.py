with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# 1. Bloqueo inmediato
html = re.sub(
    r'(<p[^>]*>Bloqueá canchas de forma inmediata por alquileres externos o clases sueltas.</p>)',
    r'\1\n            <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: -10px; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Selecciona Cancha 1, fecha de hoy, de 14:00 a 16:00, motivo "Mantenimiento". Nadie podrá reservar en ese horario.</p>',
    html
)

# 2. Receso
html = re.sub(
    r'(<p[^>]*>Programa un receso. Las canchas quedarán liberadas al público en este rango.</p>)',
    r'\1\n            <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: -10px; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Vacaciones del 01/01 al 15/01. Las clases fijas se suspenden temporalmente.</p>',
    html
)

# 3. Excepción de plantilla
html = re.sub(
    r'(<p[^>]*>¿Falta el profesor hoy\? Ingresa la fecha y horario para anular la plantilla fija <strong>solo por ese día</strong> y permitir reservas.</p>)',
    r'\1\n            <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: -10px; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Falta el profe de las 18:00, anulas esa clase hoy y la cancha se abre al público.</p>',
    html
)

# 4. Plantilla Fija Semanal
html = re.sub(
    r'(<p[^>]*>Configura horarios fijos \(ej: clases\). El sistema los bloqueará automáticamente todas las semanas.</p>)',
    r'\1\n            <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: -10px; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Lunes y Miércoles, Cancha 1, de 16:00 a 18:00 para Escuela. Nadie podrá reservar.</p>',
    html
)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)