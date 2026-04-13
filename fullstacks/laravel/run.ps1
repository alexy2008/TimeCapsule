Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

$port = if ($env:PORT) { $env:PORT } else { "5179" }
php artisan serve --host=localhost --port=$port
