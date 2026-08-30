import re
import glob

files = glob.glob('*.html') + glob.glob('*.js') + glob.glob('*.css')

replacements = [
    (r'\ufffd\x9f\x8e\ufffd \ufffdBienvenido', '🎉 ¡Bienvenido'),
    (r'\ufffd\x9f\x8e\ufffd\x9f Activar', '✨ Activar'),
    (r'\ufffd\x9f\x8e\ufffd Guardar', '💾 Guardar'),
    (r'\ufffd\x9f\x8e\ufffd\x9f Cambiar', '🖼️ Cambiar'),
    (r'\ufffd\x9f\x8e\ufffd Abrir', '📝 Abrir'),
    (r'\ufffd\x9f\x8e\ufffd \ufffdFoto', '✅ ¡Foto'),
    (r'\ufffd\x9f\x9a\ufffd \ufffdEst\ufffds', '⚠️ ¿Estás'),
    (r'\ufffd\x9f\x8c\ufffd\x8f Reservas', '⛈️ Reservas'),
    (r'\ufffd\x9f\x94\ufffd Bloqueo', '🔒 Bloqueo'),
    (r'\ufffd\x9f\x9a\ufffd Reservado', '⛔ Reservado'),
    (r'\ufffd\x9f\x9a\ufffd Horario', '❌ Horario'),
    (r'\ufffd\x9f\x9a\ufffd Fuera', '🚫 Fuera'),
    (r'\ufffd\x9f\x9a\ufffd Turno', '⚠️ Turno'),
    (r'\ufffd\x9f\x92\ufffd Opciones', '💡 Opciones'),
    (r'\ufffd\x9f\x8e\ufffd Horario', '✅ Horario'),
    (r'\ufffd\x9f\x8e\ufffd Cancha', '🎾 Cancha'),
    (r'\ufffd\x9f\x93\ufffd D\ufffda', '📅 Día'),
    (r'\ufffd\x9f\x95\ufffd Horario', '⏰ Horario'),
    (r'\ufffd\x9f\x93\ufffd CONFIRMACI\ufffdN', '✅ CONFIRMACIÓN'),
    (r'\ufffd\x9f\x8e\ufffd Reserva cancelada', '❌ Reserva cancelada'),
    (r'\ufffd\x9f\x8e\ufffd \ufffdReserva', '🎉 ¡Reserva'),
    (r'\ufffd\x9f\x8e\ufffd\x9f \ufffdFondo', '🖼️ ¡Fondo'),
    (r'\ufffd\x9f\x92\ufffd Total', '💳 Total'),
    (r'\ufffd\x9f\x8e\ufffd \ufffdCambios', '✅ ¡Cambios'),
    (r'\ufffd\x9f\x9a\ufffd ATENCI\ufffdN', '⚠️ ATENCIÓN'),
    (r'\ufffd\x9f\x94\ufffd ATH', '🔔 ATH'),
    (r'\ufffd\x9f\x9a\ufffd ATH', '🔔 ATH'),
    (r'\ufffd\x9f\x8e\ufffd Modo', '✨ Modo'),
    (r'\ufffd\x9f\x8e\ufffd\x9f Modo', '✨ Modo'),
    (r'\ufffd\x9f\x8e\ufffd\x9f \ufffdCambios', '✅ ¡Cambios'),
    
    # Fallback fixes for non-emojis
    (r'\ufffdxito', 'éxito'),
    (r'\ufffdBienvenido', '¡Bienvenido'),
    (r'Edici\ufffdn', 'Edición'),
    (r'P\ufffdgina', 'Página'),
    (r'Men\ufffd', 'Menú'),
    (r'dise\ufffdo', 'diseño'),
    (r'f\ufffdbrica', 'fábrica'),
    (r'clim\ufffdticas', 'climáticas'),
    (r'Inv\ufffdlido', 'Inválido'),
    (r'\ufffddigo', 'código'),
    (r'\ufffdgina', 'ágina'),
    (r'\ufffdtica', 'ática'),
    (r'devoluci\ufffdn', 'devolución'),
    (r'\ufffdEst\ufffds', '¿Estás'),
    (r'quer\ufffds', 'querés'),
    (r'liberar\ufffd', 'liberará'),
    (r'administraci\ufffdn', 'administración'),
    (r'complet\ufffd', 'completá'),
    (r'ingres\ufffd', 'ingresá'),
    (r'Inici\ufffd', 'Iniciá'),
    (r'cre\ufffd', 'creá'),
    (r'verif\ufffdcalas', 'verifícalas'),
    (r't\ufffdrminos', 'términos'),
    (r'condici\ufffdn', 'condición'),
    (r'\ufffdDeseas', '¿Deseas'),
    (r'\ufffdYa', '¡Ya'),
    (r'Pol\ufffdtica', 'Política'),
    (r'\ufffdtica', 'ítica'),
    (r'd\ufffdgitos', 'dígitos'),
    (r'contrase\ufffda', 'contraseña'),
    (r'\ufffd\x9f\x8e\ufffd \ufffdHorario', '✅ ¡Horario'),
]

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    modified = False
    
    for pattern, replacement in replacements:
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            modified = True
            
    # Generic cleanup of remaining emoji corruptions like \ufffd\x9f...
    if re.search(r'\ufffd[\x80-\x9f]+[\x80-\xbf]*\ufffd*', content):
        content = re.sub(r'\ufffd[\x80-\x9f]+[\x80-\xbf]*\ufffd*', '🎾', content)
        modified = True
        
    if modified:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Cleaned up in {f}")
