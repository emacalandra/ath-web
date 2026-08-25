import os
import shutil
import zipfile

src_dir = r"c:\Users\Emanu\OneDrive\Documentos\prueba de pagina ath"
backup_base_dir = os.path.join(src_dir, "_backups")
v061_dir = os.path.join(backup_base_dir, "v0.6.1")
zip_path = os.path.join(backup_base_dir, "ATH_v0.6.1_Backup_Completo.zip")

os.makedirs(v061_dir, exist_ok=True)

# Copiar todos los archivos y carpetas del proyecto excluyendo _backups y archivos temporales
copied_count = 0
for item in os.listdir(src_dir):
    if item in ["_backups", "scratch", ".git", ".vscode", "update_html_version.py", "diff_check.py"]:
        continue
    
    s = os.path.join(src_dir, item)
    d = os.path.join(v061_dir, item)
    
    if os.path.isdir(s):
        if os.path.exists(d):
            shutil.rmtree(d)
        shutil.copytree(s, d)
        copied_count += 1
    else:
        shutil.copy2(s, d)
        copied_count += 1

print(f"Copiados {copied_count} elementos a {v061_dir}")

# Crear archivo ZIP completo
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(v061_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, v061_dir)
            zipf.write(full_path, rel_path)

zip_size_mb = os.path.getsize(zip_path) / (1024 * 1024)
print(f"Backup ZIP creado exitosamente: {zip_path} ({zip_size_mb:.2f} MB)")