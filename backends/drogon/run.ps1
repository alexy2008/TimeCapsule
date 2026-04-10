Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDir = $PSScriptRoot
$buildDir = Join-Path $scriptDir "build"

cmake -S $scriptDir -B $buildDir -G Ninja
cmake --build $buildDir --target hellotime-drogon

if (-not $env:HOST) {
    $env:HOST = "127.0.0.1"
}

if (-not $env:PORT) {
    $env:PORT = "18080"
}

& (Join-Path $buildDir "hellotime-drogon")
