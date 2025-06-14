import logging
import os
import sqlite3
from dataclasses import dataclass, field
from typing import Optional, List
from datetime import datetime
from dotenv import load_dotenv
import re
import asyncio

logger = logging.getLogger("nurse-assistant")
logger.setLevel(logging.INFO)

load_dotenv()


def init_db():
    conn = sqlite3.connect("hospital.db")
    cursor = conn.cursor()


    cursor.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            insurance_provider TEXT,
            insurance_number TEXT
        )
    """)

   
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialty TEXT NOT NULL
        )
    """)

    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            doctor_id INTEGER,
            specialty TEXT NOT NULL,
            preferred_date TEXT NOT NULL,
            preferred_time TEXT NOT NULL,
            FOREIGN KEY (patient_id) REFERENCES patients(id),
            FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        )
    """)

 
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS insurance_claims (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            insurance_provider TEXT,
            insurance_number TEXT,
            claim_amount REAL,
            status TEXT,
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
    """)

    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS medicines (
            name TEXT PRIMARY KEY,
            description TEXT,
            side_effects TEXT
        )
    """)

   
    doctors_data = [
        ("Dr. Anil Sharma", "General Medicine"), ("Dr. Priya Gupta", "General Medicine"),
        ("Dr. Rajesh Kumar", "General Medicine"), ("Dr. Neha Patel", "General Medicine"),
        ("Dr. Sanjay Desai", "General Medicine"), ("Dr. Anjali Mehta", "General Medicine"),
        ("Dr. Vikram Singh", "General Medicine"), ("Dr. Pooja Shah", "General Medicine"),
        ("Dr. Rakesh Verma", "General Medicine"), ("Dr. Sunita Joshi", "General Medicine"),
        ("Dr. Amit Choudhary", "Orthopedics"), ("Dr. Shalini Kapoor", "Orthopedics"),
        ("Dr. Manoj Patil", "Orthopedics"), ("Dr. Kavita Rana", "Orthopedics"),
        ("Dr. Deepak Malhotra", "Orthopedics"), ("Dr. Meera Nair", "Orthopedics"),
        ("Dr. Rohan Kulkarni", "Orthopedics"), ("Dr. Swati Thakur", "Orthopedics"),
        ("Dr. Vinod Agarwal", "Orthopedics"), ("Dr. Lakshmi Iyer", "Orthopedics"),
        ("Dr. Sameer Khan", "Psychiatry"), ("Dr. Ritu Saxena", "Psychiatry"),
        ("Dr. Arjun Menon", "Psychiatry"), ("Dr. Nisha Varghese", "Psychiatry"),
        ("Dr. Siddharth Bose", "Psychiatry"), ("Dr. Ananya Das", "Psychiatry"),
        ("Dr. Karan Oberoi", "Psychiatry"), ("Dr. Preeti Malhotra", "Psychiatry"),
        ("Dr. Vivek Sharma", "Psychiatry"), ("Dr. Smriti Jain", "Psychiatry"),
        ("Dr. Rahul Mehra", "Cardiology"), ("Dr. Suman Gupta", "Cardiology"),
        ("Dr. Ashok Reddy", "Cardiology"), ("Dr. Divya Sharma", "Cardiology"),
        ("Dr. Kunal Desai", "Cardiology"), ("Dr. Rekha Pillai", "Cardiology"),
        ("Dr. Manish Thakur", "Cardiology"), ("Dr. Seema Kapoor", "Cardiology"),
        ("Dr. Ajay Bhatt", "Cardiology"), ("Dr. Lakshmi Nair", "Cardiology"),
        ("Dr. Vikrant Singh", "Neurology"), ("Dr. Anjali Rao", "Neurology"),
        ("Dr. Sanjay Gupta", "Neurology"), ("Dr. Priyanka Shah", "Neurology"),
        ("Dr. Rohit Kumar", "Neurology"), ("Dr. Neeta Patel", "Neurology"),
        ("Dr. Aravind Menon", "Neurology"), ("Dr. Shalini Desai", "Neurology"),
        ("Dr. Rajiv Malhotra", "Neurology"), ("Dr. Meena Iyer", "Neurology")
    ]
    cursor.executemany("INSERT OR IGNORE INTO doctors (name, specialty) VALUES (?, ?)", doctors_data)

    # Insert sample patient data
    patients_data = [
        ("Arav Saxena", "+919876543210", "arav.saxena@example.com", "Star Health", "SH123456"),
        ("Priya Sharma", "+918765432109", "priya.sharma@example.com", "HDFC Ergo", "HE789012"),
        ("Rahul Mehta", "+917654321098", "rahul.mehta@example.com", None, None)
    ]
    cursor.executemany(
        "INSERT OR IGNORE INTO patients (name, phone, email, insurance_provider, insurance_number) VALUES (?, ?, ?, ?, ?)",
        patients_data
    )

    # Insert sample appointment data
    cursor.execute("SELECT id FROM patients WHERE name = 'Arav Saxena'")
    arav_id = cursor.fetchone()[0]
    cursor.execute("SELECT id FROM doctors WHERE name = 'Dr. Anil Sharma' AND specialty = 'General Medicine'")
    doctor1_id = cursor.fetchone()[0]
    cursor.execute("SELECT id FROM doctors WHERE name = 'Dr. Amit Choudhary' AND specialty = 'Orthopedics'")
    doctor2_id = cursor.fetchone()[0]
    appointments_data = [
        (arav_id, doctor1_id, "General Medicine", "2025-06-15", "10:00"),
        (arav_id, doctor2_id, "Orthopedics", "2025-06-20", "14:30"),
        (2, doctor1_id, "General Medicine", "2025-06-16", "11:00"), 
        (3, doctor2_id, "Orthopedics", "2025-06-18", "09:30")  
    ]
    cursor.executemany(
        "INSERT INTO appointments (patient_id, doctor_id, specialty, preferred_date, preferred_time) VALUES (?, ?, ?, ?, ?)",
        appointments_data
    )

   
    insurance_claims_data = [
        (arav_id, "Star Health", "SH123456", 5000.0, "Pending"),
        (2, "HDFC Ergo", "HE789012", 7500.0, "Approved")
    ]
    cursor.executemany(
        "INSERT INTO insurance_claims (patient_id, insurance_provider, insurance_number, claim_amount, status) VALUES (?, ?, ?, ?, ?)",
        insurance_claims_data
    )

  
    medicines_data = [
        ("Paracetamol", "Pain reliever and fever reducer", "Nausea, rash, liver damage (rare)"),
        ("Ibuprofen", "Nonsteroidal anti-inflammatory drug", "Stomach pain, dizziness, headache"),
        ("Aspirin", "Pain reliever and blood thinner", "Stomach upset, bleeding risk"),
        ("Amoxicillin", "Antibiotic for bacterial infections", "Diarrhea, rash, allergic reactions")
    ]
    cursor.executemany(
        "INSERT OR IGNORE INTO medicines (name, description, side_effects) VALUES (?, ?, ?)",
        medicines_data
    )

    conn.commit()
    conn.close()

init_db()