Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\Mukilan_R\.gemini\antigravity\brain\03a41d41-3b38-47ce-a7c6-3542f7bd87bb\.user_uploaded\media_1790665254582.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Sample horizontal line at y = 240 (middle)
Write-Host "Sampling row y = 240:"
$nonBlackX = @()
for ($x = 0; $x -lt $bmp.Width; $x++) {
    $p = $bmp.GetPixel($x, 240)
    if ($p.R -gt 15 -or $p.G -gt 15 -or $p.B -gt 15) {
        $nonBlackX += $x
    }
}
if ($nonBlackX.Count -gt 0) {
    Write-Host "Row 240 non-black start: $($nonBlackX[0]), end: $($nonBlackX[-1]), count: $($nonBlackX.Count)"
}

# Sample row y = 10
Write-Host "Sampling row y = 10:"
$row10 = @()
for ($x = 0; $x -lt $bmp.Width; $x++) {
    $p = $bmp.GetPixel($x, 10)
    if ($p.R -gt 15 -or $p.G -gt 15 -or $p.B -gt 15) {
        $row10 += $x
    }
}
if ($row10.Count -gt 0) {
    Write-Host "Row 10 non-black start: $($row10[0]), end: $($row10[-1]), count: $($row10.Count)"
}

# Sample col x = 512 (middle)
Write-Host "Sampling col x = 512:"
$col512 = @()
for ($y = 0; $y -lt $bmp.Height; $y++) {
    $p = $bmp.GetPixel(512, $y)
    if ($p.R -gt 15 -or $p.G -gt 15 -or $p.B -gt 15) {
        $col512 += $y
    }
}
if ($col512.Count -gt 0) {
    Write-Host "Col 512 non-black start: $($col512[0]), end: $($col512[-1]), count: $($col512.Count)"
}

$bmp.Dispose()
