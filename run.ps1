# Starts ClassMind AI: backend (FastAPI, :5000) and frontend (Vite, :5173) in two windows.
# Usage:  .\run.ps1            (first run also installs dependencies)
#         .\run.ps1 -Key sk-ant-...   (optional: enable Claude instead of the offline engine)
param([string]$Key = "")

$root = $PSScriptRoot

if (-not (Test-Path "$root\frontend\node_modules")) {
    Write-Host "Installing frontend packages..."
    Push-Location "$root\frontend"; npm install; Pop-Location
}
python -c "import fastapi, sqlalchemy, alembic" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing backend packages..."
    pip install -r "$root\backend\requirements-dev.txt"
}

$keyLine = if ($Key) { "`$env:ANTHROPIC_API_KEY = '$Key'; " } else { "" }
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; $keyLine`$env:RELOAD = '1'; python asgi.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Start-Sleep -Seconds 6
Start-Process "http://localhost:5173"
Write-Host "Backend: http://localhost:5000  (API docs: /api/docs)   Frontend: http://localhost:5173"
