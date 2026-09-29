Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\Mukilan_R\.gemini\antigravity\brain\03a41d41-3b38-47ce-a7c6-3542f7bd87bb\.user_uploaded\media_1790665254582.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Dimensions: $($bmp.Width) x $($bmp.Height)"
$bg = $bmp.GetPixel(10, 10)
Write-Host "Corner pixel: R=$($bg.R), G=$($bg.G), B=$($bg.B)"

$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y += 2) {
    for ($x = 0; $x -lt $bmp.Width; $x += 2) {
        $p = $bmp.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - $bg.R) + [Math]::Abs($p.G - $bg.G) + [Math]::Abs($p.B - $bg.B)
        if ($diff -gt 30) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "Phone bounds: minX=$minX, maxX=$maxX, minY=$minY, maxY=$maxY"
$w = $maxX - $minX
$h = $maxY - $minY
Write-Host "Width=$w, Height=$h"
$bmp.Dispose()
