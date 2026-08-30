import glob

files = glob.glob('*.html') + glob.glob('*.js')

mojibake_map = {
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã\xad': 'í',  # í is \xc3\xad which becomes Ã\xad
    'Ã±': 'ñ',
    'Ã\x81': 'Á',
    'Ã\x89': 'É',
    'Ã\x93': 'Ó',
    'Ã\x9a': 'Ú',
    'Ã\x8d': 'Í',
    'Ã\x91': 'Ñ',
    'Â¿': '¿',
    'Â¡': '¡'
}

for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as file:
        content = file.read()
    
    modified = False
    
    # Fix U+FFFD (Replacement Character) manually
    replacements = {
        'C\ufffdrdoba': 'Córdoba',
        'Electr\ufffdnico': 'Electrónico',
        'administraci\ufffdn': 'administración',
        'Administraci\ufffdn': 'Administración',
        'Instituci\ufffdn': 'Institución',
        'l\ufffdder': 'líder',
        'ense\ufffdanza': 'enseñanza',
        'pr\ufffdtica': 'práctica',
        'Formaci\ufffdn': 'Formación',
        't\ufffdcnica': 'técnica',
        'cert\ufffdmenes': 'certámenes',
        'Protecci\ufffdn': 'Protección',
        'N\ufffd 25': 'N° 25',
        'Rep\ufffdblica': 'República',
        'Tel\ufffdfono': 'Teléfono',
        'ser\ufffdn': 'serán',
        'identificaci\ufffdn': 'identificación',
        'comunicaci\ufffdn': 'comunicación',
        'finalizaci\ufffdn': 'finalización',
        'da\ufffdar': 'dañar',
        'men\ufffd': 'menú',
        'Men\ufffd': 'Menú',
        'P\ufffdgina': 'Página',
        'p\ufffdgina': 'página',
        'A\ufffdadir': 'Añadir',
        'Edici\ufffdn': 'Edición',
        'Configuraci\ufffdn': 'Configuración',
        'Ubicaci\ufffdn': 'Ubicación',
        'Sesi\ufffdn': 'Sesión',
        'Construcci\ufffdn': 'Construcción',
        'Direcci\ufffdn': 'Dirección',
        'N\ufffdmero': 'Número',
        'pa\ufffds': 'país',
        'c\ufffddigo': 'código',
        'B\ufffdsqueda': 'Búsqueda',
        'autom\ufffdtica': 'automática',
        'D\ufffda': 'Día',
        'd\ufffdas': 'días',
        'Aqu\ufffd': 'Aquí',
        'aqu\ufffd': 'aquí',
        'm\ufffds': 'más',
        'M\ufffds': 'Más',
        's\ufffdlo': 'sólo',
        'S\ufffdlo': 'Sólo',
        'r\ufffdpida': 'rápida',
        'Gesti\ufffdn': 'Gestión',
        'gesti\ufffdn': 'gestión',
        'Secci\ufffdn': 'Sección',
        'Acci\ufffdn': 'Acción',
        'acci\ufffdn': 'acción',
        'Bot\ufffdn': 'Botón',
        'bot\ufffdn': 'botón',
        'Informaci\ufffdn': 'Información',
        'informaci\ufffdn': 'información',
        'T\ufffdrminos': 'Términos',
        't\ufffdrminos': 'términos',
        'Condici\ufffdn': 'Condición',
        'condici\ufffdn': 'condición',
        'Pol\ufffdtica': 'Política',
        'pol\ufffdtica': 'política',
        'Privacidad': 'Privacidad',
        'privacidad': 'privacidad',
        'Autenticaci\ufffdn': 'Autenticación',
        'Recuperaci\ufffdn': 'Recuperación',
        'Contrase\ufffda': 'Contraseña',
        'contrase\ufffda': 'contraseña',
        'A\ufffdo': 'Año',
        'a\ufffdo': 'año',
        'Dise\ufffdo': 'Diseño',
        'dise\ufffdo': 'diseño',
        'Versi\ufffdn': 'Versión',
        'versi\ufffdn': 'versión',
        'visi\ufffdn': 'visión',
        'misi\ufffdn': 'misión',
        'Asociaci\ufffdn': 'Asociación',
        'Federaci\ufffdn': 'Federación',
        'Compatici\ufffdn': 'Competición',
        'Creaci\ufffdn': 'Creación',
        'creaci\ufffdn': 'creación',
        'N\ufffd': 'N°'
    }
    
    for k, v in mojibake_map.items():
        if k in content:
            content = content.replace(k, v)
            modified = True
            
    for k, v in replacements.items():
        if k in content:
            content = content.replace(k, v)
            modified = True
            
    if modified:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Fixed encoding issues in {f}")
