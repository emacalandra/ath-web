with open('admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

js_code = '''
window.cambiarSubtabCanchas = function(subtabId) {
    const tabs = ['canchas-horarios', 'canchas-controles', 'canchas-monitor'];
    tabs.forEach(t => {
        const btn = document.getElementById('btn-' + t);
        const content = document.getElementById('subtab-' + t);
        if (t === subtabId) {
            if (btn) {
                btn.style.background = 'linear-gradient(135deg, #FF6600 0%, #FF8800 100%)';
                btn.style.borderColor = '#FFD700';
                btn.style.color = '#FFF';
                btn.style.boxShadow = '0 0 10px rgba(255,102,0,0.4)';
                btn.classList.add('active');
            }
            if (content) content.style.display = 'block';
        } else {
            if (btn) {
                btn.style.background = 'rgba(255,255,255,0.05)';
                btn.style.borderColor = 'rgba(255,255,255,0.15)';
                btn.style.color = '#CBD5E1';
                btn.style.boxShadow = 'none';
                btn.classList.remove('active');
            }
            if (content) content.style.display = 'none';
        }
    });
};
'''

with open('admin.js', 'w', encoding='utf-8') as f:
    f.write(js_code + '\n' + js)