import pyodbc
import os
from dotenv import load_dotenv

load_dotenv()

def get_db():
    server = os.getenv('SQL_SERVER')
    database = os.getenv('SQL_DATABASE')
    conn = pyodbc.connect(
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        f"Trusted_Connection=yes;"
    )
    return conn