import logging
import os
import sqlite3
from dataclasses import dataclass, field
from typing import Optional, List
from datetime import datetime

from dotenv import load_dotenv
from livekit.agents import JobContext, WorkerOptions, cli
from livekit.agents.llm import function_tool
from livekit.agents.voice import Agent, AgentSession, RunContext
from livekit.plugins import deepgram, groq, silero,google,elevenlabs
from livekit.plugins.turn_detector.multilingual import MultilingualModel

import re
import smtplib
from email.message import EmailMessage
import asyncio

logger = logging.getLogger("nurse-assistant")
logger.setLevel(logging.INFO)

load_dotenv()

# SQLite3 Database Setup
def init_db():
    conn = sqlite3.connect("hospital.db")
    cursor = conn.cursor()

    # Create patients table
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

    # Create doctors table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialty TEXT NOT NULL
        )
    """)

    # Create appointments table
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

    # Create insurance_claims table
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

    # Create medicines table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS medicines (
            name TEXT PRIMARY KEY,
            description TEXT,
            side_effects TEXT
        )
    """)

    # Insert sample doctor data
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
        (2, doctor1_id, "General Medicine", "2025-06-16", "11:00"),  # Priya Sharma
        (3, doctor2_id, "Orthopedics", "2025-06-18", "09:30")  # Rahul Mehta
    ]
    cursor.executemany(
        "INSERT INTO appointments (patient_id, doctor_id, specialty, preferred_date, preferred_time) VALUES (?, ?, ?, ?, ?)",
        appointments_data
    )

    # Insert sample insurance claims data
    insurance_claims_data = [
        (arav_id, "Star Health", "SH123456", 5000.0, "Pending"),
        (2, "HDFC Ergo", "HE789012", 7500.0, "Approved")
    ]
    cursor.executemany(
        "INSERT INTO insurance_claims (patient_id, insurance_provider, insurance_number, claim_amount, status) VALUES (?, ?, ?, ?, ?)",
        insurance_claims_data
    )

    # Insert sample medicine data
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

# Language-specific prompts with deep health assessments
PROMPTS = {
    "en": (
        """
            You are Tanya, a compassionate, culturally sensitive nurse assistant at Symbiosis Hospital. Maintain a warm, professional, and empathetic tone without using emojis or special characters. Actively listen to the patient, validate their concerns, and use plain, accessible language, avoiding medical jargon unless explaining it clearly.  
            Begin every interaction by warmly inviting the patient to describe their main concern in their own words. Ask open-ended, non-judgmental follow-up questions to clarify symptoms (e.g., onset, duration, severity, triggers), lifestyle factors, and any relevant context. Reflect back their concerns to confirm understanding before proceeding, e.g., 'It sounds like you’ve been experiencing [symptom] for [duration]. Is that correct?'  
            For mild to moderate, self-manageable symptoms, recommend appropriate over-the-counter medications, clear dosage guidelines, and practical home-care tips, tailored to the patient’s needs and preferences. For symptoms indicating potential complications or high risk (e.g., severe pain, rapid worsening, red-flag signs like shortness of breath or neurological changes), gently explain the concern in simple terms and urge immediate booking of an appointment or escalation to emergency care if warranted.  
            Emphasize that patient data is confidential, securely handled under Symbiosis Hospital’s privacy policies, and only collected with explicit consent. Use the {identify_patient} tool to securely collect and store the patient’s name, phone number, email, and optional insurance details after confirming consent.  
            Use the following tools for specific purposes, ensuring actions align with the patient’s needs:  
            - For patient identification (collecting name, phone, email, and optional insurance details), use the {identify_patient} tool after explaining its purpose and obtaining consent.  
            - For physical injuries, use the {assess_injury} tool. Ask detailed, empathetic questions about the injury’s cause (e.g., accident, fall, sports), location, pain level (1–10), duration, swelling, bruising, mobility issues, or other symptoms to determine the appropriate specialty.  
            - For mental health concerns, use the {assess_mental_health} tool. Inquire sensitively about mood, sleep patterns, stress levels, anxiety, depression symptoms, or other emotional challenges (e.g., frequency, severity, impact on daily life), ensuring a supportive tone.  
            - Based on the {assess_injury} or {assess_mental_health} results, query the hospital database to suggest a relevant specialist doctor, considering patient preferences (e.g., language, gender, availability).  
            - For booking appointments, use the {book_appointment} tool to select a doctor matching the identified specialty. Collect the patient’s full name, phone number, email, preferred date/time, and insurance details (provider and policy number, if applicable).  
            - To view appointments, use the {view_appointments} tool with the patient’s phone number.  
            - To update appointments, use the {update_appointment} tool with the booking ID and optional new date, time, or specialty.  
            - To cancel appointments, use the {cancel_appointment} tool with the booking ID.  
            - To check insurance eligibility, use the {check_insurance} tool with the patient’s phone number.  
            - To submit insurance claims, use the {submit_insurance_claim} tool with the patient’s phone number and claim amount.  
            - To provide detailed medicine information, use the {get_medicine_info} tool with the medicine name.  
            Before executing any tool, briefly recap the planned action (e.g., ‘I’d like to collect your contact details to proceed. Is that okay?’) and obtain patient confirmation. After completing actions, summarize the outcome, next steps, and any self-care instructions, ensuring clarity and empathy.  
            If an emergency is detected (e.g., chest pain, severe bleeding, suicidal ideation), immediately instruct the patient to call emergency services (e.g., 911 or local equivalent) and escalate to an on-call physician, providing clear guidance on what to do next.  
            Always respond in clear, empathetic English, prioritizing patient safety, privacy, and comfort. Offer to follow up or provide additional resources (e.g., hospital contact information, self-care guides) based on the patient’s needs.
"""
    ),
    "hi": (
        "आप रिया हैं, सिम्बायोसिस अस्पताल की एक करुणामय नर्स सहायक। इमोजी या विशेष वर्णों का उपयोग न करें। "
        "आपका कार्य मरीजों को स्वास्थ्य मूल्यांकन, अपॉइंटमेंट बुकिंग, बीमा पूछताछ, और दवा जानकारी में सहायता करना है। "
        "स्वास्थ्य मूल्यांकन के लिए, मरीज की स्थिति को समझने के लिए विस्तृत प्रश्न पूछें: "
        "- शारीरिक चोटों के लिए, चोट का स्थान, दर्द का स्तर (1-10), अवधि, सूजन, चोट के निशान, या गतिशीलता समस्याओं के बारे में पूछें। "
        "- मानसिक स्वास्थ्य के लिए, मूड, नींद के पैटर्न, तनाव स्तर, चिंता, या अवसाद के लक्षणों (उदाहरण के लिए, आवृत्ति, गंभीरता) के बारे में पूछें। "
        "मूल्यांकन के आधार पर, संबंधित विशेषज्ञ सुझाएं और उस विशेषज्ञता के लिए 10 भारतीय डॉक्टरों की सूची प्रदान करें। "
        "अपॉइंटमेंट बुक करते समय, हमेशा पूछें कि क्या मरीज के पास बीमा पॉलिसी है और विवरण (प्रदाता और पॉलिसी नंबर) मांगें। "
        "मरीज का पूरा नाम, फोन नंबर, ईमेल, और पसंदीदा तारीख/समय एकत्र करें। "
        "अपॉइंटमेंट देखने के लिए, मरीज का फोन नंबर मांगें। "
        "अपॉइंटमेंट अपडेट या रद्द करने के लिए, बुकिंग आईडी मांगें। "
        "बीमा दावों के लिए, फोन नंबर का उपयोग करके पात्रता सत्यापित करें और दावा विवरण एकत्र करें। "
        "दवा पूछताछ के लिए, दवा के बारे में विस्तृत जानकारी प्रदान करें। "
        "हमेशा मरीज के साथ कार्रवाइयों की पुष्टि करें। सभी उत्तर हिंदी में दें।"
    ),
    "mr": (
        "आपण रिया आहात, सिम्बायोसिस हॉस्पिटलची एक दयाळू नर्स सहाय्यक। इमोजी किंवा विशेष चिन्हे वापरू नका। "
        "आपले कार्य रुग्णांना आरोग्य मूल्यांकन, अपॉइंटमेंट बुकिंग, विमा चौकशी आणि औषध माहितीमध्ये मदत करणे आहे। "
        "आरोग्य मूल्यांकनासाठी, रुग्णाच्या स्थितीचे तपशीलवार प्रश्न विचारा: "
        "- शारीरिक इजांसाठी, इजेचे स्थान, वेदनांचा स्तर (1-10), कालावधी, सूज, जखम किंवा हालचालीतील अडचणी याबद्दल विचारा। "
        "- मानसिक आरोग्यासाठी, मूड, झोपेची पद्धत, तणाव पातळी, चिंता किंवा नैराश्याची लक्षणे (उदा., वारंवारता, तीव्रता) याबद्दल विचारा। "
        "मूल्यांकनाच्या आधारावर, संबंधित विशेषज्ञ सुचवा आणि त्या विशेषज्ञतेसाठी 10 भारतीय डॉक्टरांची यादी द्या। "
        "अपॉइंटमेंट बुक करताना, नेहमी विचारा की रुग्णाकडे विमा पॉलिसी आहे का आणि तपशील (प्रदाता आणि पॉलिसी क्रमांक) विचारा। "
        "रुग्णाचे पूर्ण नाव, फोन नंबर, ईमेल आणि पसंतीचे तारीख/वेळ गोळा करा। "
        "अपॉइंटमेंट पाहण्यासाठी, रुग्णाचा फोन नंबर विचारा। "
        "अपॉइंटमेंट अपडेट किंवा रद्द करण्यासाठी, बुकिंग आयडी विचारा। "
        "विमा दाव्यांसाठी, फोन नंबर वापरून पात्रता तपासा आणि दावा तपशील गोळा करा। "
        "औषध चौकशीसाठी, औषधाबद्दल तपशीलवार माहिती द्या। "
        "नेहमी रुग्णासह कृतींची पुष्टी करा। सर्व उत्तरे मराठीत द्या।"
    ),
    "pa": (
        "ਤੁਸੀਂ ਰਿਆ ਹੋ, ਸਿਮਬਾਇਓਸਿਸ ਹਸਪਤਾਲ ਦੀ ਇੱਕ ਦਇਆਲੁ ਨਰਸ ਸਹਾਇਕ। ਕੋਈ ਇਮੋਜੀ ਜਾਂ ਵਿਸ਼ੇਸ਼ ਅੱਖਰ ਨਾ ਵਰਤੋ। "
        "ਤੁਹਾਡਾ ਕੰਮ ਮਰੀਜ਼ਾਂ ਨੂੰ ਸਿਹਤ ਮੁਲਾਂਕਣ, ਮੁਲਾਕਾਤ ਬੁਕਿੰਗ, ਬੀਮਾ ਪੁੱਛਗਿੱਛ, ਅਤੇ ਦਵਾਈ ਜਾਣਕਾਰੀ ਵਿੱਚ ਮਦਦ ਕਰਨਾ ਹੈ। "
        "ਸਿਹਤ ਮੁਲਾਂਕਣ ਲਈ, ਮਰੀਜ਼ ਦੀ ਸਥਿਤੀ ਨੂੰ ਸਮਝਣ ਲਈ ਵਿਸਤ੍ਰਿਤ ਸਵਾਲ ਪੁੱਛੋ: "
        "- ਸਰੀਰਕ ਸੱਟਾਂ ਲਈ, ਸੱਟ ਦੀ ਜਗ੍ਹਾ, ਦਰਦ ਦਾ ਪੱਧਰ (1-10), ਅਵਧੀ, ਸੋਜ, ਜਖਮ, ਜਾਂ ਹਿਲਜੁਲ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ ਬਾਰੇ ਪੁੱਛੋ। "
        "- ਮਾਨਸਿਕ ਸਿਹਤ ਲਈ, ਮੂਡ, ਸੌਣ ਦੇ ਪੈਟਰਨ, ਤਣਾਅ ਪੱਧਰ, ਚਿੰਤਾ, ਜਾਂ ਡਿਪਰੈਸ਼ਨ ਦੇ ਲੱਛਣ (ਉਦਾਹਰਨ ਲਈ, ਬਾਰੰਬਾਰਤਾ, ਗੰਭੀਰਤਾ) ਬਾਰੇ ਪੁੱਛੋ। "
        "ਮੁਲਾਂਕਣ ਦੇ ਆਧਾਰ 'ਤੇ, ਸੰਬੰਧਿਤ ਮਾਹਰ ਦਾ ਸੁਝਾਅ ਦਿਓ ਅਤੇ ਉਸ ਵਿਸ਼ੇਸ਼ਤਾ ਲਈ 10 ਭਾਰਤੀ ਡਾਕਟਰਾਂ ਦੀ ਸੂਚੀ ਪ੍ਰਦਾਨ ਕਰੋ। "
        "ਮੁਲਾਕਾਤ ਬੁਕ ਕਰਦੇ ਸਮੇਂ, ਹਮੇਸ਼ਾ ਪੁੱਛੋ ਕਿ ਕੀ ਮਰੀਜ਼ ਕੋਲ ਬੀਮਾ ਪਾਲਿਸੀ ਹੈ ਅਤੇ ਵੇਰਵੇ (ਪ੍ਰਦਾਤਾ ਅਤੇ ਪਾਲਿਸੀ ਨੰਬਰ) ਮੰਗੋ। "
        "ਮਰੀਜ਼ ਦਾ ਪੂਰਾ ਨਾਮ, ਫੋਨ ਨੰਬਰ, ਈਮੇਲ, ਅਤੇ ਪਸੰਦੀਦਾ ਮਿਤੀ/ਸਮਾਂ ਇਕੱਠਾ ਕਰੋ। "
        "ਮੁਲਾਕਾਤਾਂ ਵੇਖਣ ਲਈ, ਮਰੀਜ਼ ਦਾ ਫੋਨ ਨੰਬਰ ਮੰਗੋ। "
        "ਮੁਲਾਕਾਤਾਂ ਨੂੰ ਅਪਡੇਟ ਜਾਂ ਰੱਦ ਕਰਨ ਲਈ, ਬੁਕਿੰਗ ਆਈਡੀ ਮੰਗੋ। "
        "ਬੀਮਾ ਦਾਅਵਿਆਂ ਲਈ, ਫੋਨ ਨੰਬਰ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਯੋਗਤਾ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਦਾਅਵੇ ਦੇ ਵੇਰਵੇ ਇਕੱਠੇ ਕਰੋ। "
        "ਦਵਾਈ ਪੁੱਛਗਿੱਛ ਲਈ, ਦਵਾਈ ਬਾਰੇ ਵਿਸਤ੍ਰਿਤ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰੋ। "
        "ਹਮੇਸ਼ਾ ਮਰੀਜ਼ ਨਾਲ ਕਾਰਵਾਈਆਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ। ਜਵਾਬ ਪੰਜਾਬੀ ਵਿੱਚ ਦਿਓ।"
    ),
    "ta": (
        "நீங்கள் ரியா, சிம்பயோசிஸ் மருத்துவமனையின் கனிவான செவிலியர் உதவியாளர். எமோஜிகள் அல்லது சிறப்பு எழுத்துக்களைப் பயன்படுத்த வேண்டாம். "
        "உங்கள் பணி நோயாளிகளுக்கு உடல்நல மதிப்பீடு, சந்திப்பு முன்பதிவு, காப்பீட்டு வினவல்கள், மற்றும் மருந்து தகவல்களில் உதவுவது. "
        "உடல்நல மதிப்பீட்டிற்கு, நோயாளியின் நிலையைப் புரிந்துகொள்ள விரிவான கேள்விகளைக் கேளுங்கள்: "
        "- உடல் காயங்களுக்கு, காயத்தின் இடம், வலியின் அளவு (1-10), கால அளவு, வீக்கம், காயங்கள், அல்லது இயக்க சிக்கல்கள் பற்றி கேளுங்கள். "
        "- மனநலத்திற்கு, மனநிலை, தூக்க முறைகள், மன அழுத்த நிலைகள், பதட்டம், அல்லது மனச்சோர்வு அறிகுறிகள் (எ.கா., அதிர்வு, தீவிரம்) பற்றி கேளுங்கள். "
        "மதிப்பீட்டின் அடிப்படையில், தொடர்புடைய நிபுணரைப் பரிந்துரை செய்யுங்கள் மற்றும் அந்த நிபுணத்துவத்திற்கு 10 இந்திய மருத்துவர்களின் பட்டியலை வழங்கவும். "
        "சந்திப்பு முன்பதிவு செய்யும்போது, எப்போதும் நோயாளிக்கு காப்பீடு பாலிசி இருக்கிறதா என்று கேளுங்கள் மற்றும் விவரங்களை (வழங்குநர் மற்றும் பாலிசி எண்) கோருங்கள். "
        "நோயாளியின் முழு பெயர், கைபேசி எண், மின்னஞ்சல், மற்றும் விருப்பமான தேதி/நேரத்தை சேகரிக்கவும். "
        "சந்திப்புகளைப் பார்க்க, நோயாளியின் கைபேசி எண்ணைக் கேளுங்கள். "
        "சந்திப்புகளை புதுப்பிக்க அல்லது ரத்து செய்ய, புக்கிங் ஐடியைக் கேளுங்கள். "
        "காப்பீட்டு உரிமைகோரல்களுக்கு, கைபேசி எண்ணைப் பயன்படுத்தி தகுதியைச் சரிபார்க்கவும் மற்றும் உரிமைகோரல் விவரங்களைச் சேகரிக்கவும். "
        "மருந்து வினவல்களுக்கு, மருந்து பற்றிய விரிவான தகவல்களை வழங்கவும். "
        "எப்போதும் நோயாளியுடன் செயல்களை உறுதிப்படுத்தவும். பதில்கள் தமிழில் இருக்க வேண்டும்。"
    )
}

@dataclass
class UserData:
    """Class to store patient data during a call."""
    ctx: Optional[JobContext] = None
    language: str = "en"
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    patient_id: Optional[int] = None
    current_booking: Optional[dict] = None
    insurance_provider: Optional[str] = None
    insurance_number: Optional[str] = None

    def is_identified(self) -> bool:
        """Check if the patient is identified."""
        return self.name is not None and self.phone is not None and self.email is not None

    def reset(self) -> None:
        """Reset patient information."""
        self.name = None
        self.phone = None
        self.email = None
        self.patient_id = None
        self.current_booking = None
        self.insurance_provider = None
        self.insurance_number = None

    def summarize(self) -> str:
        """Return a summary of the patient data."""
        if self.is_identified():
            return f"Patient: {self.name} (Phone: {self.phone}, ID: {self.patient_id})"
        return "Patient not yet identified."

RunContext_T = RunContext[UserData]

class TriageAgent(Agent):
    def __init__(self, language: str = "en") -> None:
        super().__init__(
            instructions=PROMPTS.get(language, PROMPTS["en"]),
            llm=groq.LLM(model="gemma2-9b-it", api_key="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"),
            tts=self._get_tts(language),
            stt=self._get_stt(language),
            vad=silero.VAD.load(),
            turn_detection=MultilingualModel(),
        )
        self.language = language

    def _get_tts(self, language: str):
        """Return the appropriate TTS factory for the language."""
        # Use deepgram.TTS for all languages to avoid Google TTS streaming issues
        tts_factories = {
            "en": lambda: deepgram.TTS(model="aura-asteria-en"),
            "hi": lambda:elevenlabs.TTS(
                voice_id="eyVoIoi3vo6sJoHOKgAc",
                # name="Raghav – Skilled Hindi Support Specialist",
                model="eleven_multilingual_v2",
                api_key="sk_32eb6bc8c3c5632aeefc1b9d9de55a387452916284a5cc7c"
            ),
            "mr": lambda: deepgram.TTS(model="aura-asteria-en"),  # Fallback to English audio
            "pa": lambda: deepgram.TTS(model="aura-asteria-en"),  # Fallback to English audio
            "ta": lambda: deepgram.TTS(model="aura-asteria-en"),  # Fallback to English audio
        }
        return tts_factories.get(language, tts_factories["en"])()

    def _get_stt(self, language: str):
        """Return the appropriate STT factory for the language."""
        stt_factories = {
            "en": lambda: groq.STT(model="whisper-large-v3-turbo", language="en", api_key="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"),
            "hi": lambda: groq.STT(model="whisper-large-v3-turbo", language="hi", api_key="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"),
            "mr": lambda: groq.STT(model="whisper-large-v3-turbo", language="mr", api_key="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"),
            "pa": lambda: groq.STT(model="whisper-large-v3-turbo", language="pa", api_key="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"),
            "ta": lambda: groq.STT(model="whisper-large-v3-turbo", language="ta", api_key="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"),
        }
        return stt_factories.get(language, stt_factories["en"])()

    async def on_enter(self) -> None:
        logger.info("Entering TriageAgent")
        userdata: UserData = self.session.userdata
        if userdata.ctx and userdata.ctx.room:
            await userdata.ctx.room.local_participant.set_attributes({"agent": "TriageAgent"})

        chat_ctx = self.chat_ctx.copy()
        chat_ctx.add_message(
            role="system",
            content=f"You are Riya, the Triage Assistant. {userdata.summarize()}"
        )
        await self.update_chat_ctx(chat_ctx)
        await self.session.say(self.get_greeting())
        self.session.generate_reply()

    def get_greeting(self) -> str:
        """Return a language-specific greeting."""
        greetings = {
            "en": "Hello, I am Riya, a nurse assistant at Symbiosis Hospital. How can I assist you today?",
            "hi": "नमस्ते, मैं सिम्बायोसिस अस्पताल की नर्स सहायक रिया हूँ। मैं आपकी आज कैसे मदद कर सकती हूँ?",
            "mr": "नमस्कार, मी सिम्बायोसिस हॉस्पिटलची नर्स सहाय्यक रिया आहे. मी तुम्हाला आज कशी मदत करू शकते?",
            "pa": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਸਿਮਬਾਇਓਸਿਸ ਹਸਪਤਾਲ ਦੀ ਨਰਸ ਸਹਾਇਕ ਰੀਆ ਹਾਂ। ਮੈਂ ਅੱਜ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੀ ਹਾਂ?",
            "ta": "வணக்கம், நான் சிம்பயோசிஸ் மருத்துவமனையின் செவிலியர் உதவியாளர் ரியா. இன்று உங்களுக்கு எப்படி உதவ முடியும்?"
        }
        return greetings.get(self.language, greetings["en"])

    @function_tool
    async def identify_patient(self, name: str, phone: str, email: str, insurance_provider: Optional[str] = None, insurance_number: Optional[str] = None) -> str:
        """Identify a patient by their name, phone, email, and optional insurance details."""
        userdata: UserData = self.session.userdata
        if not re.match(r'^(?:\+91[-\s]?)?[6789]\d{9}$', phone):
            return "Please provide a valid phone number (e.g., +919876543210)."
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return "Please provide a valid email address (e.g., example@domain.com)."

        try:
            conn = sqlite3.connect("hospital.db")
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO patients (name, phone, email, insurance_provider, insurance_number) VALUES (?, ?, ?, ?, ?)",
                (name, phone, email, insurance_provider, insurance_number)
            )
            conn.commit()
            patient_id = cursor.lastrowid
            conn.close()

            userdata.name = name
            userdata.phone = phone
            userdata.email = email
            userdata.patient_id = patient_id
            userdata.insurance_provider = insurance_provider
            userdata.insurance_number = insurance_number

            return f"Thank you, {name}. I've registered your details."
        except sqlite3.IntegrityError:
            return "This phone number or email is already registered. Please provide unique details."

    @function_tool
    async def assess_injury(self, symptoms: str) -> str:
        """Assess physical injury symptoms and suggest a specialty."""
        # Enhanced symptom-to-specialty mapping
        symptom_map = {
            "pain in arm": "Orthopedics",
            "leg pain": "Orthopedics",
            "back pain": "Orthopedics",
            "sports injury": "Orthopedics",
            "fracture": "Orthopedics",
            "chest pain": "Cardiology",
            "heart": "Cardiology",
            "headache": "Neurology",
            "seizure": "Neurology",
            "fever": "General Medicine",
            "cough": "General Medicine",
            "fall": "Orthopedics",
            "accident": "Orthopedics"
        }
        specialty = None
        for symptom, spec in symptom_map.items():
            if symptom.lower() in symptoms.lower():
                specialty = spec
                break
        if not specialty:
            specialty = "General Medicine"

        conn = sqlite3.connect("hospital.db")
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM doctors WHERE specialty = ? LIMIT 10", (specialty,))
        doctors = [row[0] for row in cursor.fetchall()]
        conn.close()

        doctor_list = ", ".join(doctors) if doctors else "No doctors available."
        return (
            f"Based on your symptoms ('{symptoms}'), I recommend seeing a {specialty} specialist. "
            f"Available doctors: {doctor_list}. Would you like to book an appointment?"
        )

    @function_tool
    async def assess_mental_health(self, symptoms: str) -> str:
        """Assess mental health symptoms and suggest a specialty."""
        if any(keyword in symptoms.lower() for keyword in ["anxiety", "depression", "stress", "mood", "sleep"]):
            specialty = "Psychiatry"
        else:
            specialty = "General Medicine"

        conn = sqlite3.connect("hospital.db")
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM doctors WHERE specialty = ? LIMIT 10", (specialty,))
        doctors = [row[0] for row in cursor.fetchall()]
        conn.close()

        doctor_list = ", ".join(doctors) if doctors else "No doctors available."
        return (
            f"Based on your symptoms ('{symptoms}'), I recommend seeing a {specialty} specialist. "
            f"Available doctors: {doctor_list}. Would you like to book an appointment?"
        )

    @function_tool
    async def book_appointment(self, specialty: str, preferred_date: str, preferred_time: str, insurance_provider: Optional[str] = None, insurance_number: Optional[str] = None) -> str:
        """Book an appointment for a patient with a specific specialty."""
        userdata: UserData = self.session.userdata
        if not userdata.is_identified():
            return "Please identify yourself first using name, phone, and email."

        try:
            datetime.strptime(preferred_date, "%Y-%m-%d")
            datetime.strptime(preferred_time, "%H:%M")
        except ValueError:
            return "Please provide date in YYYY-MM-DD format and time in HH:MM format."

        conn = sqlite3.connect("hospital.db")
        cursor = conn.cursor()
        cursor.execute("SELECT id, name FROM doctors WHERE specialty = ? LIMIT 1", (specialty,))
        doctor = cursor.fetchone()
        if not doctor:
            conn.close()
            return f"Specialty '{specialty}' is not available. Please choose another specialty."

        doctor_id, doctor_name = doctor

        # Update insurance details if provided
        if insurance_provider and insurance_number:
            cursor.execute(
                "UPDATE patients SET insurance_provider = ?, insurance_number = ? WHERE id = ?",
                (insurance_provider, insurance_number, userdata.patient_id)
            )
            conn.commit()
            userdata.insurance_provider = insurance_provider
            userdata.insurance_number = insurance_number

        cursor.execute(
            "INSERT INTO appointments (patient_id, doctor_id, specialty, preferred_date, preferred_time) VALUES (?, ?, ?, ?, ?)",
            (userdata.patient_id, doctor_id, specialty, preferred_date, preferred_time)
        )
        conn.commit()
        booking_id = cursor.lastrowid
        conn.close()

        email_sent = await self._send_confirmation_email(userdata.email, booking_id, specialty, preferred_date, preferred_time)
        userdata.current_booking = None

        if email_sent:
            return (
                f"Great! Your appointment (#{booking_id}) has been confirmed for {preferred_date} at {preferred_time} "
                f"with {doctor_name} ({specialty}). You'll receive a confirmation email."
            )
        return (
            f"Great! Your appointment (#{booking_id}) has been confirmed for {preferred_date} at {preferred_time} "
            f"with {doctor_name} ({specialty}). However, there was an issue sending the confirmation email. "
            f"Please check your email later or contact us if you don’t receive it."
        )

    @function_tool
    async def view_appointments(self, phone: str) -> str:
        """View upcoming appointments for a patient by phone number."""
        conn = sqlite3.connect("hospital.db")
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT a.id, d.name, a.specialty, a.preferred_date, a.preferred_time 
            FROM appointments a 
            JOIN patients p ON a.patient_id = p.id 
            JOIN doctors d ON a.doctor_id = d.id 
            WHERE p.phone = ?
            """,
            (phone,)
        )
        bookings = cursor.fetchall()
        conn.close()

        if not bookings:
            return "You have no upcoming appointments."
        appointment_list = "\n".join([
            f"- Appointment #{b[0]} with {b[1]} ({b[2]}) on {b[3]} at {b[4]}" for b in bookings
        ])
        return f"You have the following upcoming appointments:\n{appointment_list}"

    @function_tool
    async def update_appointment(self, booking_id: int, new_date: Optional[str] = None, new_time: Optional[str] = None, new_specialty: Optional[str] = None) -> str:
        """Update an existing appointment by booking ID."""
        conn = sqlite3.connect("hospital.db")
        cursor = conn.cursor()
        cursor.execute(
            "SELECT patient_id, doctor_id, specialty, preferred_date, preferred_time FROM appointments WHERE id = ?",
            (booking_id,)
        )
        booking = cursor.fetchone()
        if not booking:
            conn.close()
            return "Appointment not found. Please check the booking ID."

        patient_id, current_doctor_id, current_specialty, current_date, current_time = booking
        new_specialty = new_specialty or current_specialty
        new_date = new_date or current_date
        new_time = new_time or current_time

        cursor.execute("SELECT id FROM doctors WHERE specialty = ? LIMIT 1", (new_specialty,))
        doctor = cursor.fetchone()
        if not doctor:
            conn.close()
            return f"Specialty '{new_specialty}' is not available. Please choose another specialty."

        new_doctor_id = doctor[0]

        try:
            datetime.strptime(new_date, "%Y-%m-%d")
            datetime.strptime(new_time, "%H:%M")
        except ValueError:
            conn.close()
            return "Please provide date in YYYY-MM-DD format and time in HH:MM format."

        cursor.execute(
            "UPDATE appointments SET doctor_id = ?, specialty = ?, preferred_date = ?, preferred_time = ? WHERE id = ?",
            (new_doctor_id, new_specialty, new_date, new_time, booking_id)
        )
        conn.commit()
        conn.close()
        return "Appointment updated successfully."

    @function_tool
    async def cancel_appointment(self, booking_id: int) -> str:
        """Cancel an appointment by booking ID."""
        conn = sqlite3.connect("hospital.db")
        cursor = conn.cursor()
        cursor.execute("DELETE FROM appointments WHERE id = ?", (booking_id,))
        if cursor.rowcount == 0:
            conn.close()
            return "Appointment not found. Please check the booking ID."
        conn.commit()
        conn.close()
        return "Appointment canceled successfully."

    @function_tool
    async def check_insurance(self, phone: str) -> str:
        """Check if a patient has health insurance by phone number."""
        conn = sqlite3.connect("hospital.db")
        cursor = conn.cursor()
        cursor.execute("SELECT id, insurance_provider, insurance_number FROM patients WHERE phone = ?", (phone,))
        patient = cursor.fetchone()
        conn.close()

        if not patient:
            return "No patient found with this phone number."
        patient_id, insurance_provider, insurance_number = patient
        if insurance_provider and insurance_number:
            return f"Insurance found: Provider={insurance_provider}, Policy Number={insurance_number}."
        return "No insurance details found for this patient."

    @function_tool
    async def submit_insurance_claim(self, phone: str, claim_amount: float) -> str:
        """Submit an insurance claim for a patient."""
        conn = sqlite3.connect("hospital.db")
        cursor = conn.cursor()
        cursor.execute("SELECT id, insurance_provider, insurance_number FROM patients WHERE phone = ?", (phone,))
        patient = cursor.fetchone()
        if not patient:
            conn.close()
            return "No patient found with this phone number."

        patient_id, insurance_provider, insurance_number = patient
        if not insurance_provider or not insurance_number:
            conn.close()
            return "No insurance details found. Please provide insurance information first."

        cursor.execute(
            "INSERT INTO insurance_claims (patient_id, insurance_provider, insurance_number, claim_amount, status) "
            "VALUES (?, ?, ?, ?, ?)",
            (patient_id, insurance_provider, insurance_number, claim_amount, "Pending")
        )
        conn.commit()
        claim_id = cursor.lastrowid
        conn.close()
        return f"Insurance claim #{claim_id} submitted for {claim_amount} INR. Status: Pending."

    @function_tool
    async def get_medicine_info(self, name: str) -> str:
        """Get information about a specific medicine."""
        conn = sqlite3.connect("hospital.db")
        cursor = conn.cursor()
        cursor.execute("SELECT name, description, side_effects FROM medicines WHERE name = ?", (name,))
        medicine = cursor.fetchone()
        conn.close()

        if not medicine:
            return f"No information found for medicine: {name}"
        return (
            f"Medicine: {medicine[0]}\n"
            f"Description: {medicine[1]}\n"
            f"Side Effects: {medicine[2]}"
        )

    async def _send_confirmation_email(self, patient_email: str, booking_id: int, specialty: str, preferred_date: str, preferred_time: str) -> bool:
        """Send a confirmation email for the appointment."""
        try:
            email_sender = os.getenv("EMAIL_SENDER")
            email_password = os.getenv("EMAIL_PASSWORD")
            if not email_sender or not email_password:
                logger.error("Email credentials are missing in the environment variables.")
                return False

            msg = EmailMessage()
            msg['Subject'] = "Appointment Confirmation"
            msg['From'] = email_sender
            msg['To'] = patient_email
            msg.set_content(
                f"Hello {self.session.userdata.name}, your appointment (#{booking_id}) is scheduled for "
                f"{preferred_date} at {preferred_time} with a {specialty} specialist."
            )

            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(email_sender, email_password)
                server.send_message(msg)

            logger.info(f"Confirmation email sent to {patient_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {patient_email}: {e}")
            return False

async def entrypoint(ctx: JobContext):
    await ctx.connect()

    # Wait for a participant to join
    while len(ctx.room.remote_participants) < 1:
        await asyncio.sleep(0.1)

    user_participant = next(iter(ctx.room.remote_participants.values()))
    language = user_participant.metadata or "en"

    logger.info(f"Job {ctx.job.id} received for language: {language}")

    # Initialize user data with context and language
    userdata = UserData(ctx=ctx, language=language)

    # Create triage agent
    triage_agent = TriageAgent(language=language)

    # Create session with userdata
    session = AgentSession[UserData](userdata=userdata)

    # Start the session with the triage agent
    await session.start(
        agent=triage_agent,
        room=ctx.room,
    )

    # Placeholder for metrics collection
    async def log_usage():
        logger.info(f"Job {ctx.job.id}: Metrics collection placeholder")

    ctx.add_shutdown_callback(log_usage)
    logger.info(f"Job {ctx.job.id}: Shutdown callback added")

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))