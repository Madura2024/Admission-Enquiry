import os
import psycopg2
import sqlite3
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# --- Configuration ---
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "admin")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "postgres")
SQLITE_PATH = os.getenv("SQLITE_PATH", "database.sqlite")

def view_data():
    db_type = "postgresql"
    try:
        # Try PostgreSQL first
        conn = psycopg2.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            connect_timeout=2
        )
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        print("--- Connected to PostgreSQL ---")
    except Exception as e:
        print(f"PostgreSQL connection failed: {e}. Trying SQLite...")
        try:
            conn = sqlite3.connect(SQLITE_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            db_type = "sqlite"
            print(f"--- Connected to SQLite ({SQLITE_PATH}) ---")
        except Exception as se:
            print(f"SQLite connection failed: {se}")
            return

    try:
        # Count total records
        cursor.execute("SELECT COUNT(*) FROM admissions")
        if db_type == "postgresql":
            count = cursor.fetchone()['count']
        else:
            count = cursor.fetchone()[0]
            
        print(f"\n--- Total Admissions Found: {count} ---")
        
        # Fetch all records
        cursor.execute("SELECT appNumber, studentName, course, status, remarks, submittedAt FROM admissions ORDER BY submittedAt DESC")
        rows = cursor.fetchall()
        
        if not rows:
            print("No records found in the table.")
        else:
            print(f"{'App Number':<20} | {'Student Name':<20} | {'Status':<10} | {'Remarks'}")
            print("-" * 85)
            for row in rows:
                if db_type == "postgresql":
                    print(f"{row['appnumber']:<20} | {row['studentname']:<20} | {row['status']:<10} | {row['remarks']}")
                else:
                    print(f"{row['appNumber']:<20} | {row['studentName']:<20} | {row['status']:<10} | {row['remarks']}")
        
    except Exception as e:
        print(f"Error querying data: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    view_data()
