import os
import psycopg2
from psycopg2.extras import RealDictCursor
import sqlite3
import json
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Header, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

app = FastAPI(title="KITE Admission API (PostgreSQL + SQLite Fallback)", version="3.1.0")

# --- Configuration ---
API_KEY = os.getenv("API_KEY")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "admin")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "postgres")
SQLITE_PATH = os.getenv("SQLITE_PATH", "database.sqlite")
GOOGLE_SHEET_WEBHOOK_URL = os.getenv("GOOGLE_SHEET_WEBHOOK_URL")

if not API_KEY:
    raise RuntimeError("API_KEY not found in environment variables")

# --- Global State ---
db_type = "postgresql"

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Setup ---
def get_db_connection():
    global db_type
    # Try PostgreSQL first
    try:
        conn = psycopg2.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            connect_timeout=2
        )
        db_type = "postgresql"
        return conn
    except Exception as e:
        print(f"PostgreSQL connection failed: {e}. Falling back to SQLite...")
        
    # Fallback to SQLite
    try:
        conn = sqlite3.connect(SQLITE_PATH)
        conn.row_factory = sqlite3.Row
        db_type = "sqlite"
        return conn
    except Exception as e:
        print(f"SQLite connection failed: {e}")
        return None

def init_db():
    conn = get_db_connection()
    if not conn:
        print("COULD NOT CONNECT TO ANY DATABASE. Please check your environment.")
        return
    
    if db_type == "postgresql":
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admissions (
                id SERIAL PRIMARY KEY,
                appNumber TEXT UNIQUE NOT NULL,
                studentName TEXT NOT NULL,
                course TEXT NOT NULL,
                institution TEXT NOT NULL,
                formData TEXT NOT NULL,
                studentUsername TEXT NOT NULL,
                status TEXT DEFAULT 'Pending',
                remarks TEXT,
                submittedAt TEXT,
                approvedAt TEXT
            )
        """)
        # Migration: Add remarks column if it doesn't exist
        try:
            cursor.execute("ALTER TABLE admissions ADD COLUMN remarks TEXT")
            conn.commit()
        except Exception:
            pass # Column already exists
        cursor.close()
        print("--- DATABASE: PostgreSQL Initialized ---")
    else:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                appNumber TEXT UNIQUE NOT NULL,
                studentName TEXT NOT NULL,
                course TEXT NOT NULL,
                institution TEXT NOT NULL,
                formData TEXT NOT NULL,
                studentUsername TEXT NOT NULL,
                status TEXT DEFAULT 'Pending',
                remarks TEXT,
                submittedAt TEXT,
                approvedAt TEXT
            )
        """)
        # Migration: Add remarks column if it doesn't exist
        try:
            cursor.execute("ALTER TABLE admissions ADD COLUMN remarks TEXT")
        except Exception:
            pass # Column already exists
        conn.commit()
        print("--- DATABASE: SQLite Initialized ---")
    
    conn.close()

def sync_to_google_sheets(data):
    """Sends admission data to a Google Sheets Webhook (Apps Script)"""
    if not GOOGLE_SHEET_WEBHOOK_URL:
        print("--- GOOGLE SHEETS SYNC: Skipped (URL not configured) ---")
        return False
    
    try:
        # Prepare a flat dictionary for the sheet
        payload = {
            "appNumber": data.get("appNumber"),
            "studentName": data.get("studentName"),
            "course": data.get("course"),
            "institution": data.get("institution"),
            "phone1": data.get("phone1"),
            "district": data.get("district"),
            "marks12th_cutoff": data.get("marks12th", {}).get("cutoff") if isinstance(data.get("marks12th"), dict) else "N/A",
            "submittedAt": datetime.now().isoformat(),
            "status": "Pending"
        }
        
        response = requests.post(GOOGLE_SHEET_WEBHOOK_URL, json=payload, timeout=5)
        if response.status_code == 200:
            print(f"--- GOOGLE SHEETS SYNC: Success for {payload['studentName']} ---")
            return True
        else:
            print(f"--- GOOGLE SHEETS SYNC: Failed ({response.status_code}) ---")
            return False
    except Exception as e:
        print(f"--- GOOGLE SHEETS SYNC: Error: {e} ---")
        return False

init_db()

# --- Security Dependency ---
async def verify_api_key(x_api_key: str = Header(None)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid API Key")
    return x_api_key

# --- Routes ---

@app.get("/")
def read_root():
    return {"message": "KITE Admission API is Running", "docs": "/docs", "health": "/health"}

@app.get("/health")
def health_check():
    return {"status": "OK", "engine": f"FastAPI + {db_type}", "timestamp": datetime.now()}

@app.post("/api/admission", status_code=201)
async def submit_admission(request: Request, x_api_key: str = Depends(verify_api_key)):
    data = await request.json()
    
    # Required fields validation
    required = ["appNumber", "studentName", "course", "institution"]
    for field in required:
        if field not in data:
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    cursor = conn.cursor()
    try:
        app_number = data["appNumber"]
        student_name = data["studentName"]
        course = data["course"]
        institution = data["institution"]
        student_username = data.get("studentUsername", "Guest")
        status = data.get("status", "Pending")
        submitted_at = data.get("submittedAt", datetime.now().isoformat())
        form_data_json = json.dumps(data)

        if db_type == "postgresql":
            cursor.execute(
                "INSERT INTO admissions (appNumber, studentName, course, institution, formData, studentUsername, status, submittedAt) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (app_number, student_name, course, institution, form_data_json, student_username, status, submitted_at)
            )
            new_id = cursor.fetchone()[0]
        else:
            cursor.execute(
                "INSERT INTO admissions (appNumber, studentName, course, institution, formData, studentUsername, status, submittedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (app_number, student_name, course, institution, form_data_json, student_username, status, submitted_at)
            )
            new_id = cursor.lastrowid
            
        conn.commit()
        
        # Async-like sync to Google Sheets (to avoid blocking response)
        try:
            sync_to_google_sheets(data)
        except Exception as se:
            print(f"Background sync error: {se}")

        return {"success": True, "message": f"Saved to {db_type}", "id": new_id, "appNumber": app_number}
    except (psycopg2.errors.UniqueViolation if db_type == "postgresql" else sqlite3.IntegrityError):
        if conn: conn.rollback()
        raise HTTPException(status_code=409, detail="Application number already exists")
    except Exception as e:
        if conn: conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.patch("/api/admission/{app_id}/remarks")
async def update_remarks(app_id: str, request: Request, x_api_key: str = Depends(verify_api_key)):
    data = await request.json()
    remarks = data.get("remarks")
    clean_app_id = app_id.strip()
    print(f"--- REMARKS UPDATE: App={clean_app_id}, Text={remarks} ---")
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    cursor = conn.cursor()
    try:
        if db_type == "postgresql":
            cursor.execute(
                "UPDATE admissions SET remarks = %s WHERE appNumber ILIKE %s",
                (remarks, clean_app_id)
            )
        else:
            cursor.execute(
                "UPDATE admissions SET remarks = ? WHERE appNumber = ? COLLATE NOCASE",
                (remarks, clean_app_id)
            )
            
        affected = cursor.rowcount
        print(f"--- DB UPDATE: Rows affected: {affected} ---")
            
        if affected == 0:
            raise HTTPException(status_code=404, detail="Application not found")
            
        conn.commit()
        return {"success": True, "message": "Remarks updated"}
    except Exception as e:
        print(f"--- UPDATE ERROR: {e} ---")
        if conn: conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.get("/api/admissions")
async def get_admissions(x_api_key: str = Depends(verify_api_key)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    if db_type == "postgresql":
        cursor = conn.cursor(cursor_factory=RealDictCursor)
    else:
        cursor = conn.cursor()
        
    try:
        cursor.execute("SELECT * FROM admissions ORDER BY submittedAt DESC")
        rows = cursor.fetchall()
        
        result = []
        for row in rows:
            try:
                # Handle both RealDictCursor (PostgreSQL) and sqlite3.Row (SQLite)
                if db_type == "postgresql":
                    record = json.loads(row["formdata"])
                    record["id"] = row["id"]
                    record["status"] = row["status"]
                    record["appNumber"] = row["appnumber"]
                    record["remarks"] = row["remarks"]
                else:
                    record = json.loads(row["formData"])
                    record["id"] = row["id"]
                    record["status"] = row["status"]
                    record["appNumber"] = row["appNumber"]
                    record["remarks"] = row["remarks"]
                result.append(record)
            except Exception as e:
                # Fallback if JSON parsing fails
                result.append(dict(row))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
