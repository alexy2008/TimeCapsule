Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDir = $PSScriptRoot
$pidFile = Join-Path $env:TEMP "hellotime-backend-proxy.pid"
$metaFile = Join-Path $env:TEMP "hellotime-backend-proxy.meta"
$logFile = Join-Path $env:TEMP "hellotime-backend-proxy.log"
$errFile = Join-Path $env:TEMP "hellotime-backend-proxy.err"

function Show-Usage {
    $lines = @(
        "Usage:"
        "  .\scripts\switch-backend.ps1 spring-boot"
        "  .\scripts\switch-backend.ps1 fastapi"
        "  .\scripts\switch-backend.ps1 gin"
        "  .\scripts\switch-backend.ps1 elysia"
        "  .\scripts\switch-backend.ps1 nest"
        "  .\scripts\switch-backend.ps1 aspnet-core"
        "  .\scripts\switch-backend.ps1 18010"
        "  .\scripts\switch-backend.ps1 status"
        "  .\scripts\switch-backend.ps1 stop"
        ""
        "Fixed entry:"
        "  Frontends always use http://localhost:8080"
        ""
        "Default backend ports:"
        "  spring-boot -> 18000"
        "  fastapi     -> 18010"
        "  gin         -> 18020"
        "  elysia      -> 18030"
        "  nest        -> 18040"
        "  aspnet-core -> 18050"
    )

    return ($lines -join [Environment]::NewLine)
}

function Resolve-Target([string]$Name) {
    switch ($Name.ToLowerInvariant()) {
        "spring"      { return @{ Name = "spring-boot"; Port = 18000 } }
        "spring-boot" { return @{ Name = "spring-boot"; Port = 18000 } }
        "fastapi"     { return @{ Name = "fastapi"; Port = 18010 } }
        "gin"         { return @{ Name = "gin"; Port = 18020 } }
        "elysia"      { return @{ Name = "elysia"; Port = 18030 } }
        "nest"        { return @{ Name = "nest"; Port = 18040 } }
        "aspnet"      { return @{ Name = "aspnet-core"; Port = 18050 } }
        "aspnet-core" { return @{ Name = "aspnet-core"; Port = 18050 } }
        ""            { Write-Output (Show-Usage); exit 0 }
        "help"        { Write-Output (Show-Usage); exit 0 }
        "-h"          { Write-Output (Show-Usage); exit 0 }
        "--help"      { Write-Output (Show-Usage); exit 0 }
        default {
            if ($Name -match '^\d+$') {
                return @{ Name = "custom"; Port = [int]$Name }
            }

            throw "Unknown backend: $Name`n$(Show-Usage)"
        }
    }
}

function Get-StoredProcess {
    if (-not (Test-Path $pidFile)) {
        return $null
    }

    $rawPid = (Get-Content $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
    if ($null -eq $rawPid) {
        Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
        return $null
    }

    $trimmedPid = $rawPid.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmedPid) -or $trimmedPid -notmatch '^\d+$') {
        Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
        return $null
    }

    return Get-Process -Id ([int]$trimmedPid) -ErrorAction SilentlyContinue
}

function Stop-Proxy {
    $process = Get-StoredProcess
    if ($null -ne $process) {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        Write-Output "Stopped 8080 forwarding (PID: $($process.Id))"
    }

    Remove-Item $pidFile, $metaFile -Force -ErrorAction SilentlyContinue
}

function Show-Status {
    $process = Get-StoredProcess
    if ($null -ne $process -and (Test-Path $metaFile)) {
        Get-Content $metaFile
    } else {
        Write-Output "No active 8080 forwarding"
    }
}

function Start-Proxy([string]$TargetName, [int]$TargetPort) {
    Stop-Proxy

    $python = Get-Command python -ErrorAction SilentlyContinue
    if ($null -eq $python) {
        throw "Python 3 is required. Please make sure `python` is available."
    }

    $forwardScript = Join-Path $scriptDir "port_forward.py"
    $argumentList = @(
        $forwardScript
        "--listen-host"
        "127.0.0.1"
        "--listen-port"
        "8080"
        "--target-host"
        "127.0.0.1"
        "--target-port"
        "$TargetPort"
    )

    $process = Start-Process `
        -FilePath $python.Source `
        -ArgumentList $argumentList `
        -WorkingDirectory $scriptDir `
        -RedirectStandardOutput $logFile `
        -RedirectStandardError $errFile `
        -PassThru

    Set-Content -Path $pidFile -Value $process.Id -NoNewline

    $metaLines = @(
        "Current 8080 -> $TargetName ($TargetPort)"
        "PID: $($process.Id)"
        "Stdout log: $logFile"
        "Stderr log: $errFile"
    )
    Set-Content -Path $metaFile -Value ($metaLines -join [Environment]::NewLine) -NoNewline

    Start-Sleep -Seconds 1
    if ($process.HasExited) {
        Remove-Item $pidFile, $metaFile -Force -ErrorAction SilentlyContinue
        throw "Failed to start port forwarding. Check log: $logFile"
    }

    Show-Status
}

$action = if ($args.Count -gt 0) { [string]$args[0] } else { "" }

switch ($action.ToLowerInvariant()) {
    "status" {
        Show-Status
        exit 0
    }
    "stop" {
        Stop-Proxy
        exit 0
    }
}

$target = Resolve-Target $action
Start-Proxy -TargetName $target.Name -TargetPort $target.Port
