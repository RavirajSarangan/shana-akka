$token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTAxMWViMzFlMjEwNjEzN2EzZjIyZiIsImlhdCI6MTc3OTQzODA5NSwiZXhwIjoxNzgyMDMwMDk1fQ.ts6-Bou2ZgzEv9jUkyU-5XdrMNUdcJ6oHKOLbwdIiBA'
$body = @{elderId='6a1012972303cb1b07e67f25'; title='Take Medicine'; description='Take 1 pill after breakfast'; time='09:00'; date=(Get-Date).ToString('s')}
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri 'http://localhost:5000/api/routines' -Method Post -Headers $headers -Body ($body | ConvertTo-Json) -ContentType 'application/json' | ConvertTo-Json -Depth 5
Write-Host ""
