@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo === RedVelvet - A enviar para o GitHub e Vercel ===
echo.

where git >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Git nao encontrado. Instala em: https://git-scm.com/download/win
    echo Depois abre de novo este ficheiro.
    pause
    exit /b 1
)

git add package.json package-lock.json
git add -A
git commit -m "fix: atualizar Next.js 15.5.7 e dependencias"
if errorlevel 1 (
    echo Nenhuma alteracao para enviar ou ja foi feito commit.
)
git push origin dev 2>nul
git push origin dev:main --force 2>nul

echo.
echo Concluido. O Vercel vai fazer deploy automaticamente em 1-2 minutos.
echo.
pause
