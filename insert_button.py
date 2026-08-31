with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Insert the button exactly once at the end of formClubConfig
html = re.sub(
    r'(<form id="formClubConfig".*?)(</form>)',
    r'\1    <button type="submit" class="btn-submit" style="background: var(--color-ath-orange); justify-content: center;"><i class="fa-solid fa-floppy-disk"></i> Guardar Datos del Contacto</button>\n                            \2',
    html,
    flags=re.DOTALL
)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)