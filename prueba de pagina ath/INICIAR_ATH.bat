@echo off
title Servidor Local - Academia Tenis Hits (ATH)
echo ======================================================
echo  Iniciando servidor local para Academia Tenis Hits...
echo ======================================================
echo.
echo Intentando iniciar con Python...
start "" "http://localhost:8000/index.html"
python -m http.server 8000 2>nul || py -m http.server 8000 2>nul
echo.
echo Si la ventana se cerro o dio error de Python, no te preocupes:
echo Como ya limpiamos el codigo a localStorage, puedes abrir index.html 
echo haciendo doble clic directamente en tu explorador de archivos!
pause
