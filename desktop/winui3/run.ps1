Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot
dotnet run --project .\HelloTimeWinUI.csproj
