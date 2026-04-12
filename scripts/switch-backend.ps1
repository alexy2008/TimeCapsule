# switch-backend.ps1 — 薄封装，内部调用 dev-manager.py
$scriptDir = $PSScriptRoot
$action = if ($args.Count -gt 0) { [string]$args[0] } else { "status" }

switch ($action.ToLowerInvariant()) {
    "stop"   { & python "$scriptDir\dev-manager.py" --stop-proxy }
    "status" { & python "$scriptDir\dev-manager.py" --status }
    default  { & python "$scriptDir\dev-manager.py" --switch-proxy $action }
}
