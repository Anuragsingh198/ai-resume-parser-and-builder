# PowerShell script to set up the backend environment

Write-Host "Setting up Python virtual environment..." -ForegroundColor Green

# Create virtual environment
python -m venv venv

Write-Host "Virtual environment created!" -ForegroundColor Green
Write-Host ""
Write-Host "To activate the virtual environment, run:" -ForegroundColor Yellow
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you get an execution policy error, run:" -ForegroundColor Yellow
Write-Host "  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then install dependencies:" -ForegroundColor Yellow
Write-Host "  pip install -r requirements.txt" -ForegroundColor Cyan

