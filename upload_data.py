import sqlite3
import csv

# Step 1: Connect to the existing students.db database
try:
    connection = sqlite3.connect("students.db")
    cursor = connection.cursor()
    print("[OK] Connected to students.db")

    # Step 2: Open and read the CSV file
    with open("Data.csv", "r") as csv_file:
        reader = csv.DictReader(csv_file)

        # Step 3: Insert each row from CSV into the students table
        records_inserted = 0
        for row in reader:
            cursor.execute("""
                INSERT OR IGNORE INTO students
                    (student_id, name, age, gender, department, semester, gpa)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                row["student_id"],
                row["name"],
                int(row["age"]),
                row["gender"],
                row["department"],
                int(row["semester"]),
                float(row["gpa"])
            ))
            records_inserted += 1

    # Step 4: Save changes to the database
    connection.commit()
    print(f"[OK] {records_inserted} records inserted from Data.csv")

    # Step 5: Verify - fetch total count from the database
    cursor.execute("SELECT COUNT(*) FROM students")
    total_count = cursor.fetchone()[0]
    print(f"[OK] Total records in database: {total_count}")

    # Step 6: Show a preview of the uploaded data
    print("\n--- Preview of uploaded data ---")
    cursor.execute("SELECT * FROM students LIMIT 5")
    rows = cursor.fetchall()
    print(f"{'ID':<8} {'Name':<20} {'Age':<5} {'Gender':<8} {'Dept':<6} {'Sem':<5} {'GPA'}")
    print("-" * 65)
    for r in rows:
        print(f"{r[0]:<8} {r[1]:<20} {r[2]:<5} {r[3]:<8} {r[4]:<6} {r[5]:<5} {r[6]}")

except FileNotFoundError:
    print("[ERROR] Data.csv file not found. Make sure it is in the same folder.")

except sqlite3.Error as e:
    print(f"[ERROR] Database error: {e}")

finally:
    if connection:
        connection.close()
        print("\n[OK] Database connection closed.")
