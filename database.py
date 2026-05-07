import sqlite3

# Connect to the database (creates 'students.db' if it doesn't exist)
try:
    connection = sqlite3.connect("students.db")
    print("[OK] Connected to database: students.db")

    # Create a cursor to execute SQL commands
    cursor = connection.cursor()

    # Create the 'students' table if it doesn't already exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            student_id  TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            age         INTEGER,
            gender      TEXT,
            department  TEXT,
            semester    INTEGER,
            gpa         REAL
        )
    """)

    # Save (commit) the changes to the database
    connection.commit()
    print("[OK] Table 'students' created successfully.")

except sqlite3.Error as e:
    # Print the error if something goes wrong
    print(f"[ERROR] Database error: {e}")

finally:
    # Always close the connection when done
    if connection:
        connection.close()
        print("[OK] Database connection closed.")
