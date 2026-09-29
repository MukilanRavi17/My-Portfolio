Add-Type -AssemblyName System.Drawing

$imgDir = "C:\Users\Mukilan_R\OneDrive\Desktop\website portfolio\assets\img\instagram"
Get-ChildItem -Path $imgDir -Filter "*.png" | ForEach-Object {
    $bmp = [System.Drawing.Bitmap]::FromFile($_.FullName)
    Write-Host "$($_.Name): $($bmp.Width) x $($bmp.Height)"
    $bmp.Dispose()
}
