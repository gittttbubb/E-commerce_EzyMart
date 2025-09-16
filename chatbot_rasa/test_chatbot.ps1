# Lưu file với UTF-8 BOM
$RASA_URL = "http://localhost:5005/webhooks/rest/webhook"
$body = '{"sender":"test_user","message":"Xin chao"}'
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
$response = Invoke-RestMethod -Uri $RASA_URL -Method POST -ContentType "application/json" -Body $bodyBytes
$response | ForEach-Object { Write-Host ("Bot tra loi: " + $_.text) }
