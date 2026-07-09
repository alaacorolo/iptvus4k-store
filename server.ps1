# PowerShell Static Site Web Server for iptvus4k-store
$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "Local preview server started successfully!"
    Write-Host "Open your browser and navigate to: http://localhost:$port/"
    Write-Host "Press Ctrl+C in terminal (or kill the task) to stop the server."
} catch {
    Write-Error "Failed to start listener on port $port. Check if port is already in use."
    exit
}

$localPath = "C:\Users\dell\.gemini\antigravity\scratch\iptvus4k-store\public"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.RawUrl
        
        # Remove query parameters if present
        if ($urlPath.Contains("?")) {
            $urlPath = $urlPath.Substring(0, $urlPath.IndexOf("?"))
        }

        Write-Host "Request: $($request.HttpMethod) $urlPath"

        # Route matching (supporting clean Node.js-style routes)
        if ($urlPath -eq "/") {
            $filePath = Join-Path $localPath "index.html"
        } elseif ($urlPath -eq "/subscription") {
            $filePath = Join-Path $localPath "subscription.html"
        } elseif ($urlPath -eq "/faq") {
            $filePath = Join-Path $localPath "faq.html"
        } elseif ($urlPath -eq "/tutorial") {
            $filePath = Join-Path $localPath "tutorial.html"
        } else {
            # Standard static assets mapping
            $normalizedUrl = $urlPath.Replace("/", "\").TrimStart("\")
            $filePath = Join-Path $localPath $normalizedUrl
        }

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".gif"  { $response.ContentType = "image/gif" }
                ".svg"  { $response.ContentType = "image/svg+xml; charset=utf-8" }
                ".ico"  { $response.ContentType = "image/x-icon" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # Serve custom 404.html if static asset or path not found
            $response.StatusCode = 404
            $filePath404 = Join-Path $localPath "404.html"
            if (Test-Path $filePath404) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath404)
                $response.ContentType = "text/html; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        }
        $response.OutputStream.Close()
    } catch {
        # Catch connection resets or aborted requests gracefully without crashing the loop
        Write-Host "Warning: Connection error occurred: $_"
    }
}
