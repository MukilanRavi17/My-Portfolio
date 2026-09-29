Add-Type -AssemblyName System.Drawing

$srcDir = "C:\Users\Mukilan_R\.gemini\antigravity\brain\03a41d41-3b38-47ce-a7c6-3542f7bd87bb\.user_uploaded"
$dstDir = "C:\Users\Mukilan_R\OneDrive\Desktop\website portfolio\assets\img\instagram"

$files = @(
    @{ Src = "media_1790665254566.png"; Dst = "screen-0-homescreen.png" },
    @{ Src = "media_1790665254582.png"; Dst = "screen-4-story-editor.png" }
)

foreach ($f in $files) {
    $srcPath = Join-Path $srcDir $f.Src
    $dstPath = Join-Path $dstDir $f.Dst
    
    $bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
    Write-Host "File $($f.Src): Width=$($bmp.Width), Height=$($bmp.Height)"
    
    # Check if image is 1024x484 with centered phone or direct screenshot
    # If 1024x484, phone crop box is X=402, Y=8, Width=220, Height=470
    if ($bmp.Width -eq 1024 -and $bmp.Height -eq 484) {
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
        Write-Host "Saved cropped to $dstPath"
    } else {
        # If dimensions are different, let's copy directly or crop appropriately
        $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Host "Saved directly to $dstPath"
    }
}
