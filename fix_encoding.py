import os
import glob

files = glob.glob('*.html') + glob.glob('*.js')

for f in files:
    with open(f, 'rb') as file:
        raw = file.read()
    
    content_utf8 = raw.decode('utf-8', errors='replace')
    
    # Fix double-encoded UTF-8 (Mojibake)
    if 'Ã' in content_utf8:
        try:
            # Try to reverse double encoding
            fixed_content = content_utf8.encode('latin-1').decode('utf-8')
            with open(f, 'w', encoding='utf-8') as file:
                file.write(fixed_content)
            print(f"Fixed Mojibake in {f}")
            content_utf8 = fixed_content
        except Exception as e:
            print(f"Could not reverse mojibake in {f}: {e}")

    # Fix U+FFFD (Replacement Character) manually
    if '\ufffd' in content_utf8:
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
            'P\ufffdgina': 'Página',
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
            'visi\ufffdn': 'visión',
            'misi\ufffdn': 'misión',
            'Asociaci\ufffdn': 'Asociación',
            'Federaci\ufffdn': 'Federación',
            'Compatici\ufffdn': 'Competición',
            'Creaci\ufffdn': 'Creación',
            'creaci\ufffdn': 'creación',
            'N\ufffd': 'N°',
            '\ufffd': 'í' # Fallback for remaining  which are often 'í' in Spanish... wait this is dangerous. Let's list a few more.
        }
        
        for k, v in replacements.items():
            if k != '\ufffd':
                content_utf8 = content_utf8.replace(k, v)
                
        # Now what remains is replaced cautiously. 'í' or 'ó'? Let's not replace blindly.
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content_utf8)
        print(f"Fixed U+FFFD in {f}")
