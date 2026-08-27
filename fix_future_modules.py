import sys

filepaths = ['contacto.html', 'canchero.html']
for filepath in filepaths:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
        
        # Add future-module class to nav items
        html = html.replace('<li class="nav-item"><a href="noticias.html"', '<li class="nav-item future-module"><a href="noticias.html"')
        html = html.replace('<li class="nav-item"><a href="clases.html"', '<li class="nav-item future-module"><a href="clases.html"')
        html = html.replace('<li class="nav-item"><a href="torneos.html"', '<li class="nav-item future-module"><a href="torneos.html"')
        html = html.replace('<li class="nav-item"><a href="construccion.html"', '<li class="nav-item future-module"><a href="construccion.html"')
        html = html.replace('<li class="nav-item"><a href="historia.html"', '<li class="nav-item future-module"><a href="historia.html"')
        
        # Add future-module class to footer items
        html = html.replace('<li><a href="noticias.html">Noticias</a></li>', '<li class="future-module"><a href="noticias.html">Noticias</a></li>')
        html = html.replace('<li><a href="clases.html">Clases</a></li>', '<li class="future-module"><a href="clases.html">Clases</a></li>')
        html = html.replace('<li><a href="torneos.html">Torneos</a></li>', '<li class="future-module"><a href="torneos.html">Torneos</a></li>')
        html = html.replace('<li><a href="construccion.html">Construcción</a></li>', '<li class="future-module"><a href="construccion.html">Construcción</a></li>')
        html = html.replace('<li><a href="historia.html">Historia</a></li>', '<li class="future-module"><a href="historia.html">Historia</a></li>')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Updated {filepath}")
    except FileNotFoundError:
        pass
