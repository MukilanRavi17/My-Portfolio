Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\Mukilan_R\.gemini\antigravity\brain\03a41d41-3b38-47ce-a7c6-3542f7bd87bb\.user_uploaded\media_1790665665828.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Dimensions: $($bmp.Width) x $($bmp.Height)"

# Check row 240 non-black start and end
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

$bmp.Dispose()
