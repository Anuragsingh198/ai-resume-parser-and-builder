# Install dependencies in stages to avoid compilation issues
Write-Host "Installing backend dependencies (avoiding compilation issues)..." -ForegroundColor Green
Write-Host ""

# Step 1: Install core FastAPI dependencies (these should have wheels)
Write-Host "Step 1: Installing core FastAPI dependencies..." -ForegroundColor Yellow
pip install fastapi uvicorn[standard] pydantic pydantic-settings python-multipart

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Core dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install core dependencies" -ForegroundColor Red
    exit 1
}

# Step 2: Install database dependencies
Write-Host ""
Write-Host "Step 2: Installing database dependencies..." -ForegroundColor Yellow
pip install motor pymongo

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install database dependencies" -ForegroundColor Red
    exit 1
}

# Step 3: Install authentication dependencies
Write-Host ""
Write-Host "Step 3: Installing authentication dependencies..." -ForegroundColor Yellow
pip install python-jose[cryptography] bcrypt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Authentication dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install authentication dependencies" -ForegroundColor Red
    exit 1
}

# Step 4: Install AI and parsing dependencies
Write-Host ""
Write-Host "Step 4: Installing AI and parsing dependencies..." -ForegroundColor Yellow
pip install openai pdfplumber

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ AI dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install AI dependencies" -ForegroundColor Red
    exit 1
}

# Step 5: Install template and cloud storage
Write-Host ""
Write-Host "Step 5: Installing template and cloud storage dependencies..." -ForegroundColor Yellow
pip install jinja2 cloudinary python-dotenv

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Template and storage dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install template/storage dependencies" -ForegroundColor Red
}

# Step 6: Try weasyprint (optional - may fail)
Write-Host ""
Write-Host "Step 6: Attempting to install weasyprint (optional)..." -ForegroundColor Yellow
pip install weasyprint

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ WeasyPrint installed successfully" -ForegroundColor Green
} else {
    Write-Host "⚠ WeasyPrint installation failed (optional - PDF generation may not work)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the server, run:" -ForegroundColor Yellow
Write-Host "  python run.py" -ForegroundColor Cyan
Write-Host ""

