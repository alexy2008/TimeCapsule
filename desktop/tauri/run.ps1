Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

$nodeVersionRaw = (& node --version).TrimStart('v')
$nodeVersion = [Version]$nodeVersionRaw
$minNodeVersion = [Version]"20.19.0"
if ($nodeVersion -lt $minNodeVersion) {
    throw "Tauri/Vite requires Node.js 20.19+ or 22.12+. Current version: $nodeVersionRaw"
}

foreach ($proxyVar in @(
    'HTTP_PROXY',
    'HTTPS_PROXY',
    'ALL_PROXY',
    'http_proxy',
    'https_proxy',
    'all_proxy',
    'CARGO_HTTP_PROXY',
    'CARGO_HTTPS_PROXY'
)) {
    Remove-Item "Env:$proxyVar" -ErrorAction SilentlyContinue
}

if (-not (Test-Path 'node_modules')) {
    Write-Host 'Installing dependencies...'
    npm install
}

Write-Host 'Starting Tauri Desktop App...'
npm run tauri dev
