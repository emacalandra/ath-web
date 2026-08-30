import glob

files = glob.glob('*.html') + glob.glob('*.js')

emojis = {
    '\ufffd??\ufffd \ufffdBienvenido': '🎉 ¡Bienvenido',
    '\ufffd??\ufffd? Activar': '✨ Activar',
    '\ufffd??\ufffd Guardar': '💾 Guardar',
    '\ufffd??\ufffd? Cambiar': '🖼️ Cambiar',
    '\ufffd??\ufffd Abrir': '📝 Abrir',
    '\ufffd??\ufffd \ufffdFoto': '✅ ¡Foto',
    '\ufffd??? \ufffdEst\ufffd': '⚠️ ¿Est',
    '\ufffd??\ufffd\ufffd\ufffd? Reservas': '⛈️ Reservas',
    '\ufffd??\ufffd Bloqueo': '🔒 Bloqueo',
    '\ufffd??\ufffd Reservado': '⛔ Reservado',
    '\ufffd??\ufffd Horario': '❌ Horario',
    '\ufffd??\ufffd Fuera': '🚫 Fuera',
    '\ufffd??\ufffd Turno': '⚠️ Turno',
    '\ufffd??\ufffd Opciones': '💡 Opciones',
    '\ufffd??\ufffd Cancha': '🎾 Cancha',
    '\ufffd??? D\ufffda': '📅 Día',
    '\ufffd??? Día': '📅 Día',
    '\ufffd?\ufffd Horario': '⏰ Horario',
    '\ufffd?? CONFIRMACI\ufffdN': '✅ CONFIRMACIÓN',
    '\ufffd?? CONFIRMACIÓN': '✅ CONFIRMACIÓN',
    '\ufffd??\ufffd Reserva cancelada': '❌ Reserva cancelada',
    '\ufffd??\ufffd \ufffdReserva': '🎉 ¡Reserva',
    '\ufffd??\ufffd\ufffd \ufffdFondo': '🖼️ ¡Fondo',
    '\ufffd??\ufffd? \ufffdFondo': '🖼️ ¡Fondo',
    '\ufffd??\ufffd Total': '💳 Total',
    '\ufffd??\ufffd \ufffdCambios': '✅ ¡Cambios',
    '\ufffd?? ATENCI\ufffdN': '⚠️ ATENCIÓN',
    '\ufffd?? ATENCIÓN': '⚠️ ATENCIÓN',
    '\ufffd?\ufffd? ATH': '🔔 ATH',
    '\ufffd?\ufffd? ATENCI\ufffdN': '⚠️ ATENCIÓN',
    '\ufffd?\ufffd? ATENCIÓN': '⚠️ ATENCIÓN',
    '\ufffd??\ufffd Modo': '✨ Modo',
    '\ufffd??\ufffd? Modo': '✨ Modo'
}

# Add fallback replacements for remaining mojibake/
fallbacks = {
    '\ufffdxito': 'éxito',
    '\ufffdBienvenido': '¡Bienvenido',
    'Edici\ufffdn': 'Edición',
    'P\ufffdgina': 'Página',
    'Men\ufffd': 'Menú',
    'dise\ufffdo': 'diseño',
    'f\ufffdbrica': 'fábrica',
    'clim\ufffdticas': 'climáticas',
    'Inv\ufffdlido': 'Inválido',
    '\ufffddigo': 'código',
    '\ufffdgina': 'ágina', # Just in case
    '\ufffdtica': 'ática',
    'devoluci\ufffdn': 'devolución',
    '\ufffdEst\ufffds': '¿Estás',
    'quer\ufffds': 'querés',
    'liberar\ufffd': 'liberará',
    'administraci\ufffdn': 'administración',
    'complet\ufffd': 'completá',
    'ingres\ufffd': 'ingresá',
    'Inici\ufffd': 'Iniciá',
    'cre\ufffd': 'creá',
    'verif\ufffdcalas': 'verifícalas',
    't\ufffdrminos': 'términos',
    'condici\ufffdn': 'condición',
    '\ufffdDeseas': '¿Deseas',
    '\ufffdYa': '¡Ya'
}

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    modified = False
    
    # Process emojis first
    for k, v in emojis.items():
        if k in content:
            content = content.replace(k, v)
            modified = True
            
    # Process fallbacks
    for k, v in fallbacks.items():
        if k in content:
            content = content.replace(k, v)
            modified = True
            
    # Remove any stray  that weren't caught
    if '\ufffd' in content:
        # We will replace them manually in next pass if any are left, let's just log them
        print(f"File {f} still contains U+FFFD!")
            
    if modified:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Fixed emojis/characters in {f}")
