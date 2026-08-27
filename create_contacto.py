import os

with open('historia.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the title and active class
content = content.replace('<title>Historia - Academia Tenis Hits</title>', '<title>Contacto y Staff - Academia Tenis Hits</title>')
content = content.replace('class="nav-link active"', 'class="nav-link"')
content = content.replace('<a href="contacto.html" class="nav-link">', '<a href="contacto.html" class="nav-link active">')

# Extract everything between <main> and </main>
main_start = content.find('<main')
main_start = content.find('>', main_start) + 1
main_end = content.find('</main>')

new_main = '''
        <!-- Hero Section -->
        <section class="hero-section" style="min-height: 40vh; display: flex; align-items: center; justify-content: center; position: relative;">
            <div class="hero-bg" style="background-image: url('assets/hero-bg.jpg'); filter: brightness(0.4);"></div>
            <div class="hero-content" style="text-align: center; position: relative; z-index: 2;">
                <span class="badge" style="margin-bottom: 16px;"><i class="fa-solid fa-address-book"></i> Nuestro Equipo</span>
                <h1 class="hero-title">Contacto y Staff ATH</h1>
                <p class="hero-subtitle" style="font-size: 1.1rem; max-width: 600px; margin: 0 auto;">Conocé a los profesionales que día a día hacen de la Academia Tenis Hits tu mejor lugar para aprender y disfrutar del tenis.</p>
            </div>
        </section>

        <!-- Datos de Contacto Dinámicos -->
        <section class="section" style="background-color: var(--color-bg-light); padding: 60px 20px;">
            <div class="container">
                <div class="section-header reveal-element">
                    <h2 class="section-title">Datos del Club</h2>
                    <p class="section-subtitle">Vías de comunicación oficiales de ATH.</p>
                </div>
                
                <div id="publicContactData" style="display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; margin-top: 40px;" class="reveal-element">
                    <!-- Dinámico desde script.js -->
                </div>
            </div>
        </section>

        <!-- Staff Grid -->
        <section class="section" style="padding: 80px 20px;">
            <div class="container">
                <div class="section-header reveal-element">
                    <h2 class="section-title">El Equipo ATH</h2>
                    <p class="section-subtitle">Profesionales capacitados para llevar tu nivel al máximo.</p>
                </div>
                
                <div class="grid-3col" id="publicStaffGrid" style="margin-top: 40px;">
                    <!-- Cargado dinámicamente desde db.js -->
                </div>
            </div>
        </section>
'''

content = content[:main_start] + new_main + content[main_end:]

with open('contacto.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('contacto.html created')