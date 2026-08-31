with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

new_grid = '''<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                                <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                                    <label style="color: #94A3B8; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 8px; display: block;">Lunes a Viernes</label>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-door-open"></i> Apertura</label>
                                        <input type="time" id="configTimeOpenLV" value="08:00" required style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-weight: 700; width: 100%;">
                                    </div>
                                    <div class="form-group" style="margin-top: 10px;">
                                        <label><i class="fa-solid fa-door-closed"></i> Cierre</label>
                                        <input type="time" id="configTimeCloseLV" value="23:00" required style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-weight: 700; width: 100%;">
                                    </div>
                                </div>
                                
                                <div style="background: rgba(59, 130, 246, 0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3);">
                                    <label style="color: #60A5FA; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 8px; display: block;">Sábados y Domingos</label>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-door-open"></i> Apertura</label>
                                        <input type="time" id="configTimeOpenSD" value="08:00" required style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-weight: 700; width: 100%;">
                                    </div>
                                    <div class="form-group" style="margin-top: 10px;">
                                        <label><i class="fa-solid fa-door-closed"></i> Cierre</label>
                                        <input type="time" id="configTimeCloseSD" value="22:00" required style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-weight: 700; width: 100%;">
                                    </div>
                                </div>
                                
                                <div style="background: rgba(16, 185, 129, 0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3);">
                                    <label style="color: #34D399; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 8px; display: block;">Feriados</label>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-door-open"></i> Apertura</label>
                                        <input type="time" id="configTimeOpenF" value="09:00" required style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-weight: 700; width: 100%;">
                                    </div>
                                    <div class="form-group" style="margin-top: 10px;">
                                        <label><i class="fa-solid fa-door-closed"></i> Cierre</label>
                                        <input type="time" id="configTimeCloseF" value="21:00" required style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-weight: 700; width: 100%;">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" style="margin-top: 16px;">
                                <label><i class="fa-solid fa-moon"></i> Inicio Tarifa Nocturna (LED) - General</label>
                                <input type="time" id="configTimeNight" value="18:30" required style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-weight: 700; width: 100%; max-width: 250px;">
                            </div>'''

html = re.sub(
    r'<div style="display: grid; grid-template-columns: repeat\(auto-fit, minmax\(200px, 1fr\)\); gap: 16px;">.*?<label><i class="fa-solid fa-door-open"></i> Hora Apertura</label>.*?</div>\s*</div>',
    new_grid,
    html,
    flags=re.DOTALL
)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)