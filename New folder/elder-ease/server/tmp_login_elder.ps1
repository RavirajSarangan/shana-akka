$body = @{email='elder1@test.com'; password='password123'}
$res = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method Post -Body ($body | ConvertTo-Json) -ContentType 'application/json'
$res | ConvertTo-Json -Depth 5
Write-Host ""