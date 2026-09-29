$baseDir = "C:\Users\Mukilan_R\OneDrive\Desktop\website portfolio"
$htmlFiles = Get-ChildItem -Path $baseDir -Recurse -Filter "*.html" | Where-Object { $_.FullName -notmatch "_archive" }

$totalLinks = 0
$brokenLinks = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $dir = $file.DirectoryName
    
    # Check src attributes
    $srcMatches = [regex]::Matches($content, 'src=["'']([^"'']+)["'']')
    foreach ($m in $srcMatches) {
        $src = $m.Groups[1].Value
        if ($src -match '^https?://' -or $src -match '^data:' -or $src -match '^mailto:' -or $src -match '^tel:') {
            continue
        }
        $totalLinks++
        $target = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($dir, $src.Split('?')[0].Split('#')[0]))
        if (-not (Test-Path $target)) {
            Write-Host "BROKEN SRC: in $($file.Name): $src -> $target" -ForegroundColor Red
            $brokenLinks++
        }
    }
    
    # Check href attributes
    $hrefMatches = [regex]::Matches($content, 'href=["'']([^"'']+)["'']')
    foreach ($m in $hrefMatches) {
        $href = $m.Groups[1].Value
        if ($href -match '^https?://' -or $href -match '^data:' -or $href -match '^mailto:' -or $href -match '^tel:' -or $href.StartsWith('#')) {
            continue
        }
        $totalLinks++
        $target = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($dir, $href.Split('?')[0].Split('#')[0]))
        if (-not (Test-Path $target)) {
            Write-Host "BROKEN HREF: in $($file.Name): $href -> $target" -ForegroundColor Red
            $brokenLinks++
        }
    }
}

Write-Host "`nTotal local references checked: $totalLinks"
Write-Host "Broken references found: $brokenLinks"
if ($brokenLinks -eq 0) {
    Write-Host "ALL ASSETS, SCRIPTS, STYLESHEETS, AND LINKS ARE 100% VALID!" -ForegroundColor Green
}
