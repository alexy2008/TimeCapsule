$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$env:PORT = if ($env:PORT) { $env:PORT } else { "5181" }

bundle check 2>$null
if ($LASTEXITCODE -ne 0) { bundle install }

bundle exec rails db:migrate RAILS_ENV=development 2>$null

bundle exec rails server -p $env:PORT -b localhost
