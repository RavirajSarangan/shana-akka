$token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTAxMjk3MjMwM2NiMWIwN2U2N2YyNSIsImlhdCI6MTc3OTQzODI2MywiZXhwIjoxNzgyMDMwMjYzfQ.h8DuIK0Gc-vAbSlmmirwsh5sU8fjL_bNvya8cP37Rqo'
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri 'http://localhost:5000/api/routines' -Method Get -Headers $headers | ConvertTo-Json -Depth 5
Write-Host ""
