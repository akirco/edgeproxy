# test download coast time and print the download speed
$startTime = Get-Date
Invoke-WebRequest "http://localhost:8088/github.com/oven-sh/bun/releases/download/bun-v1.2.19/bun-windows-x64.zip" -OutFile ".\test.zip"
$endTime = Get-Date
$duration = $endTime - $startTime
Write-Host "Download completed in $duration seconds."

# Calculate and print download speed
$fileSize = (Get-Item ".\test.zip").Length
$downloadSpeed = $fileSize / $duration.TotalSeconds / 1MB
Write-Host "Download speed: $downloadSpeed MB/s"
# Clean up the downloaded file
Remove-Item ".\test.zip" -Force