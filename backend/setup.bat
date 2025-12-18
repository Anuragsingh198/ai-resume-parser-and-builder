@echo off
echo Setting up Python virtual environment...

python -m venv venv

echo.
echo Virtual environment created!
echo.
echo To activate the virtual environment, run:
echo   venv\Scripts\activate.bat
echo.
echo Then install dependencies:
echo   pip install -r requirements.txt
echo.
pause