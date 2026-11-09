import os
import sys
import uvicorn

# Ensure backend folder is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("Starting TalentHub FastAPI Backend Server on http://127.0.0.1:8000...")
    print("Documentation available at http://127.0.0.1:8000/docs")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

