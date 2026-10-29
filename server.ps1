# Static HTTP Development Server for Arun & Krishna Wedding Invitation
# Zero-dependency, native PowerShell/.NET implementation

param(
    [int]$Port = 8080
)

$prefix = "http://localhost:$Port/"
$root = (Get-Location).Path

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json"
    ".svg"  = "image/svg+xml"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".gif"  = "image/gif"
    ".webp" = "image/webp"
    ".webm" = "audio/webm"
    ".opus" = "audio/ogg; codecs=opus"
    ".ogg"  = "audio/ogg"
    ".m4a"  = "audio/mp4"
    ".mp3"  = "audio/mpeg"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

try {
    $listener.Start()
    Write-Host "=========================================================" -ForegroundColor Magenta
    Write-Host " Arun & Krishna - Wedding Invitation Dev Server" -ForegroundColor Cyan
    Write-Host " Local URL:      $prefix" -ForegroundColor Green
    Write-Host " Preview URL:    ${prefix}?guest=Lord%20%26%20Lady%20Harrington" -ForegroundColor Yellow
    Write-Host " Serving from:   $root" -ForegroundColor Gray
    Write-Host " Press Ctrl+C to terminate server" -ForegroundColor Gray
    Write-Host "=========================================================" -ForegroundColor Magenta
} catch {
    Write-Error "Failed to bind to port $Port. Please ensure the port is not in use: $_"
    exit 1
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.LocalPath
        if ($rawPath -eq "/" -or [string]::IsNullOrWhiteSpace($rawPath)) {
            $rawPath = "/index.html"
        }

        # Resolve clean relative path
        $relPath = [System.Uri]::UnescapeDataString($rawPath).TrimStart('/') -replace '/', '\'
        $filePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $relPath))

        # Directory traversal prevention
        if (-not $filePath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $filePath -PathType Leaf)) {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            $response.OutputStream.Close()
            continue
        }

        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
        $response.ContentType = $contentType
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Accept-Ranges", "bytes")

        $fileInfo = New-Object System.IO.FileInfo($filePath)
        $fileLength = $fileInfo.Length
        $rangeHeader = $request.Headers["Range"]

        try {
            if ($rangeHeader -and $rangeHeader -match "^bytes=(\d+)-(\d*)") {
                # Handle Byte-Range requests for media streaming (audio/video)
                $start = [int64]$matches[1]
                $end = if ($matches[2]) { [int64]$matches[2] } else { $fileLength - 1 }
                if ($end -ge $fileLength) { $end = $fileLength - 1 }
                $contentLength = $end - $start + 1

                $response.StatusCode = 206
                $rangeValue = "bytes {0}-{1}/{2}" -f $start, $end, $fileLength
                $response.Headers.Add("Content-Range", $rangeValue)
                $response.ContentLength64 = $contentLength

                $fs = [System.IO.File]::OpenRead($filePath)
                $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                $buffer = New-Object byte[] 65536
                $remaining = $contentLength
                while ($remaining -gt 0) {
                    $toRead = [System.Math]::Min([int64]$buffer.Length, $remaining)
                    $read = $fs.Read($buffer, 0, $toRead)
                    if ($read -le 0) { break }
                    $response.OutputStream.Write($buffer, 0, $read)
                    $remaining -= $read
                }
                $fs.Close()
            } else {
                $response.StatusCode = 200
                $response.ContentLength64 = $fileLength
                $fs = [System.IO.File]::OpenRead($filePath)
                $fs.CopyTo($response.OutputStream)
                $fs.Close()
            }
        } catch {
            # Client disconnected early or connection reset
        } finally {
            $response.OutputStream.Close()
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
