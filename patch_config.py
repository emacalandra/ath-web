# 1. Update admin.html
with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

config_html = '''
                            <div class="form-group">
                                <label style="font-weight: 700; color: #FFF;">Hora de Apertura</label>
                                <input type="time" id="clubAperturaInput" required style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; box-sizing: border-box;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: 700; color: #FFF;">Hora de Cierre</label>
                                <input type="time" id="clubCierreInput" required style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; box-sizing: border-box;">
                            </div>
'''
if 'clubAperturaInput' not in html:
    html = html.replace('</form>', config_html + '                            <button type="submit" class="btn-submit" style="background: var(--color-ath-orange); justify-content: center;"><i class="fa-solid fa-floppy-disk"></i> Guardar Datos del Contacto</button>\n                        </form>')
    # Remove the old submit button that was replaced
    html = html.replace('''<button type="submit" class="btn-submit" style="background: var(--color-ath-orange); justify-content: center;"><i class="fa-solid fa-floppy-disk"></i> Guardar Datos del Contacto</button>\n''' + config_html, config_html)

    with open('admin.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('admin.html patched')