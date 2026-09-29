Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Mukilan_R\.gemini\antigravity\brain\03a41d41-3b38-47ce-a7c6-3542f7bd87bb\.user_uploaded\media_1790665254582.png"
$dstPath = "C:\Users\Mukilan_R\OneDrive\Desktop\website portfolio\assets\img\instagram\screen-9-story-editor.png"

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$cropRect = New-Object System.Drawing.Rectangle(402, 8, 220, 470)
$cropped = New-Object System.Drawing.Bitmap(220, 470)
$g = [System.Drawing.Graphics]::FromImage($cropped)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($bmp, (New-Object System.Drawing.Rectangle(0, 0, 220, 470)), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$bmp.Dispose()

$cropped.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()

# Remove the temporary uncropped screen-4-story-editor.png if it exists
$tempPath = "C:\Users\Mukilan_R\OneDrive\Desktop\website portfolio\assets\img\instagram\screen-4-story-editor.png"
if (Test-Path $tempPath) {
    Remove-Item $tempPath -Force
}

Write-Host "Successfully cropped story editor to screen-9-story-editor.png (220x470)"
