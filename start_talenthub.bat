@echo off
title TalentHub Campus Placement Platform
echo =========================================================
echo    TalentHub Campus Placement Platform (Team 14)
echo =========================================================
echo.

echo 1. Checking Python and SQLite database...
if not exist "talenthub.db" (
    echo Seeding SQLite database with 11 tables...
    python backend/seed.py
) else (
    echo SQLite database talenthub.db is ready.
)
echo.

echo 2. Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "TalentHub Backend (FastAPI)" cmd /k "python backend/run.py"

echo 3. Launching Vite React Frontend on http://localhost:5173 ...
start "TalentHub Frontend (React + Vite)" cmd /k "npm run dev"

echo.
echo =========================================================
echo  Platform is running!
echo  - Frontend: http://localhost:5173
echo  - API Docs: http://127.0.0.1:8000/docs
echo =========================================================
pause

