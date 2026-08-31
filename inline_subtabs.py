with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

html = html.replace(
    '<button class="subtab-btn active" data-subtab="canchas-horarios">',
    '<button class="subtab-btn active" id="btn-canchas-horarios" onclick="window.cambiarSubtabCanchas(\'canchas-horarios\')" style="background: linear-gradient(135deg, #FF6600 0%, #FF8800 100%); border: 1px solid #FFD700; color: #FFF; padding: 10px 18px; border-radius: 8px; font-weight: 800; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 0 10px rgba(255,102,0,0.4);">'
)

html = html.replace(
    '<button class="subtab-btn" data-subtab="canchas-controles">',
    '<button class="subtab-btn" id="btn-canchas-controles" onclick="window.cambiarSubtabCanchas(\'canchas-controles\')" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #CBD5E1; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">'
)

html = html.replace(
    '<button class="subtab-btn" data-subtab="canchas-monitor">',
    '<button class="subtab-btn" id="btn-canchas-monitor" onclick="window.cambiarSubtabCanchas(\'canchas-monitor\')" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #CBD5E1; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">'
)

# Fix subtab-content CSS
html = html.replace('<div id="subtab-canchas-horarios" class="subtab-content active">', '<div id="subtab-canchas-horarios" class="subtab-content" style="display:block;">')
html = html.replace('<div id="subtab-canchas-controles" class="subtab-content">', '<div id="subtab-canchas-controles" class="subtab-content" style="display:none;">')
html = html.replace('<div id="subtab-canchas-monitor" class="subtab-content">', '<div id="subtab-canchas-monitor" class="subtab-content" style="display:none;">')

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)