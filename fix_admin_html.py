with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# We will remove the exact divs that correspond to the old Configurar
# Instead of Regex, let's inject right below the title.

new_inputs = '''
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                                <!-- Lunes a Viernes -->
                                <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                                    <label style="color: #94A3B8; font-size: 0.8rem; text-transform: uppercase;">Lunes a Viernes</label>
                                    <div class="form-group" style="margin-top: 8px;">
                                        <label><i class="fa-solid fa-door-open" style="color: #10B981;"></i> Apertura</label>
                                        <input type="time" id="configTimeOpenLV" value="08:00" required>
                                    </div>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-door-closed" style="color: #EF4444;"></i> Cierre</label>
                                        <input type="time" id="configTimeCloseLV" value="23:00" required>
                                    </div>
                                </div>
                                <!-- Sábados y Domingos -->
                                <div style="background: rgba(59, 130, 246, 0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3);">
                                    <label style="color: #60A5FA; font-size: 0.8rem; text-transform: uppercase;">Sábados y Domingos</label>
                                    <div class="form-group" style="margin-top: 8px;">
                                        <label><i class="fa-solid fa-door-open" style="color: #10B981;"></i> Apertura</label>
                                        <input type="time" id="configTimeOpenSD" value="08:00" required>
                                    </div>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-door-closed" style="color: #EF4444;"></i> Cierre</label>
                                        <input type="time" id="configTimeCloseSD" value="22:00" required>
                                    </div>
                                </div>
                                <!-- Feriados -->
                                <div style="background: rgba(16, 185, 129, 0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3);">
                                    <label style="color: #34D399; font-size: 0.8rem; text-transform: uppercase;">Feriados (Opcional)</label>
                                    <div class="form-group" style="margin-top: 8px;">
                                        <label><i class="fa-solid fa-door-open" style="color: #10B981;"></i> Apertura</label>
                                        <input type="time" id="configTimeOpenF" value="09:00" required>
                                    </div>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-door-closed" style="color: #EF4444;"></i> Cierre</label>
                                        <input type="time" id="configTimeCloseF" value="21:00" required>
                                    </div>
                                </div>
                            </div>
'''

if 'configTimeOpenLV' not in html:
    # Let's find the old ones and replace them
    # "id="configTimeOpen""
    html = re.sub(r'<div class="form-group">\s*<label><i class="fa-solid fa-door-open" style="color: #10B981;"></i> Hora de Apertura</label>\s*<input type="time" id="configTimeOpen" required.*?>\s*</div>', new_inputs, html, count=1, flags=re.DOTALL)
    # Remove the others
    html = re.sub(r'<div class="form-group">\s*<label><i class="fa-solid fa-door-closed" style="color: #EF4444;"></i> Hora de Cierre</label>\s*<input type="time" id="configTimeClose" required.*?>\s*</div>', '', html, count=1, flags=re.DOTALL)
    
    with open('admin.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed admin.html")