@echo off
echo ===========================================
echo  Démarrage de Tantsaha Connect - Desktop
echo ===========================================
echo.

echo 1. Démarrage du backend...
start cmd /k "cd /d C:\Users\JOEL ALPHA\Desktop\desktop\backend && npm run dev"
timeout /t 3

echo.
echo 2. Démarrage du frontend...
start cmd /k "cd /d C:\Users\JOEL ALPHA\Desktop\desktop\frontend && npm run dev"
timeout /t 5

echo.
echo 3. Ouverture des applications...
start http://localhost:3000
start http://localhost:5000

echo.
echo ✅ Applications démarrées !
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
pause