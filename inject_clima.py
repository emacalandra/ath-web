with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Alerta Climática
html = re.sub(
    r'(<p[^>]*>Cancela turnos activos y notifica a los jugadores.</p>)',
    r'\1\n            <p class="help-text" style="font-size: 0.85rem; color: #94A3B8; margin-top: -10px; margin-bottom: 20px;"><i class="fa-solid fa-lightbulb" style="color: #FFD700;"></i> Ejemplo: Llueve fuerte. Seleccionas las 18:00 y todos los turnos desde esa hora se cancelan y se avisa a los jugadores.</p>',
    html
)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)