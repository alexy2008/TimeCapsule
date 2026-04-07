Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

$pythonExe = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
if (-not (Test-Path $pythonExe)) {
    throw "Missing Python virtual environment: .venv\\Scripts\\python.exe"
}

if (-not $env:PORT) {
    $env:PORT = "18010"
}

& $pythonExe -m uvicorn app.main:app --reload --host 0.0.0.0 --port $env:PORT
