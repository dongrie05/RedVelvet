# Script para enviar o projeto para https://github.com/dongrie05/RedVelvet
# Executar na pasta do projeto: .\push-to-github.ps1

$ErrorActionPreference = "Stop"
$repoUrl = "https://github.com/dongrie05/RedVelvet.git"

Write-Host "=== RedVelvet - Enviar para GitHub ===" -ForegroundColor Cyan
Write-Host ""

# 0. Configurar identidade Git se ainda nao estiver definida
$gitEmail = git config --global user.email 2>$null
$gitName = git config --global user.name 2>$null
if ([string]::IsNullOrWhiteSpace($gitEmail) -or [string]::IsNullOrWhiteSpace($gitName)) {
    Write-Host "O Git precisa do teu nome e email (para os commits)." -ForegroundColor Yellow
    $email = Read-Host "Introduz o teu email (ex: nome@gmail.com)"
    $name = Read-Host "Introduz o teu nome (ex: Joao Silva)"
    if (-not [string]::IsNullOrWhiteSpace($email)) { git config --global user.email $email }
    if (-not [string]::IsNullOrWhiteSpace($name)) { git config --global user.name $name }
    Write-Host "Configurado." -ForegroundColor Green
}

# 1. Verificar se o Git está instalado
$gitPath = $null
try {
    $gitPath = Get-Command git -ErrorAction SilentlyContinue
} catch {}

if (-not $gitPath) {
    Write-Host "Git nao encontrado. A instalar Git com winget..." -ForegroundColor Yellow
    try {
        winget install --id Git.Git -e --source winget --accept-package-agreements
        Write-Host "Git instalado. Fecha e reabre o PowerShell e volta a executar este script." -ForegroundColor Green
        exit 0
    } catch {
        Write-Host "Nao foi possivel instalar o Git. Instala manualmente em: https://git-scm.com/download/win" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Git encontrado." -ForegroundColor Green

# 2. Inicializar repo se nao existir .git
if (-not (Test-Path ".git")) {
    Write-Host "A inicializar repositorio Git..." -ForegroundColor Yellow
    git init
    git remote add origin $repoUrl
} else {
    # Garantir que o remote aponta para o repo correto
    $remotes = git remote 2>$null
    if ($remotes -notcontains "origin") {
        git remote add origin $repoUrl
    } else {
        git remote set-url origin $repoUrl
    }
}

# 3. Adicionar ficheiros e fazer commit
Write-Host "A adicionar ficheiros..." -ForegroundColor Yellow
git add .
$status = git status --short 2>$null
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "Nao ha alteracoes para enviar (tudo ja foi commitado)." -ForegroundColor Yellow
    Write-Host "A fazer push do que ja existe..." -ForegroundColor Yellow
} else {
    git commit -m "Deploy: APIs produtos e categorias, destaques AMY-GA037/34SI22362/TLGASP, filtros por slug, next.config Vercel"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Nenhuma alteracao para commit (pode ja estar tudo guardado)." -ForegroundColor Yellow
    }
}

# 4. Garantir branch main e fazer push
git branch -M main 2>$null
Write-Host "A enviar para GitHub (origin main)..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Concluido. Repositorio: https://github.com/dongrie05/RedVelvet" -ForegroundColor Green
    Write-Host "Se o projeto estiver ligado à Vercel, o deploy sera feito automaticamente." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "O push falhou. Se o repo no GitHub ja tiver outros commits, tenta:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main --force" -ForegroundColor White
    Write-Host "Ou faz login: o browser pode abrir para autenticar no GitHub." -ForegroundColor Yellow
}
