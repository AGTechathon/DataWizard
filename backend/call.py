import os
import requests
from flask import Flask, request, Response
from twilio.twiml.voice_response import VoiceResponse
from dotenv import load_dotenv
import pywhatkit
from groq import Groq 

load_dotenv()

ULTRAVOX_API_KEY = os.getenv('ULTRAVOX_API_KEY')
ULTRAVOX_API_URL = 'https://api.ultravox.ai/api/calls'
GROQ_API_KEY = os.getenv('GROQ_API_KEY')


SYSTEM_PROMPT = 'You are Tanya, a nurse assistant at Symbiosis Hospital. Your role is to assist patients with injuries and book appointments.'

ULTRAVOX_CALL_CONFIG = {
    "systemPrompt": SYSTEM_PROMPT,
    "model": "fixie-ai/ultravox",
    "voice": "Riya-Rao-English-Indian",
    "temperature": 0.6,
    "firstSpeaker": "FIRST_SPEAKER_AGENT",
    "medium": {"twilio": {}}
}

app = Flask(_name_)
call_data = {}
groq_client = Groq(api_key=GROQ_API_KEY)

def create_ultravox_call(config):
    """Create an Ultravox call and return join URL and call ID."""
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': ULTRAVOX_API_KEY
    }
    try:
        response = requests.post(ULTRAVOX_API_URL, json=config, headers=headers)
        response.raise_for_status()
        data = response.json()
        print(f"Ultravox call created: {data}")
        return data['joinUrl'], data['callId']
    except Exception as e:
        print(f"Error creating Ultravox call: {e}")
        raise

def get_transcription_from_ultravox(call_id):
    """Retrieve transcription from Ultravox (hypothetical endpoint)."""
    headers = {
        'X-API-Key': ULTRAVOX_API_KEY
    }
    url = f'https://api.ultravox.ai/api/calls/{call_id}/transcription'
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        transcription_data = response.json()
        return transcription_data.get('transcript', '')
    except Exception as e:
        print(f"Error retrieving transcription: {e}")
        raise

@app.route("/incoming", methods=['POST'])
def handle_incoming_call():
    print("Received incoming call request")
    try:
        caller_number = request.form.get('From')
        call_sid = request.form.get('CallSid')
        print(f"Incoming call from: {caller_number}, Call SID: {call_sid}")
        dynamic_system_prompt = f"""You are Tanya, a nurse assistant at Symbiosis Hospital. Start the conversation by saying: 'Hello, this is Tanya from Symbiosis Hospital. How can I assist you today?' Then, wait for the caller's response and assist them with booking appointments or answering questions about injuries. The caller's phone number is {caller_number}."""

        call_config = ULTRAVOX_CALL_CONFIG.copy()
        call_config["systemPrompt"] = dynamic_system_prompt

        join_url, call_id = create_ultravox_call(call_config)

        call_data[call_sid] = {'call_id': call_id, 'caller_number': caller_number}

        twiml = VoiceResponse()
        connect = twiml.connect()   
        connect.stream(url=join_url, name='ultravox')
        twiml.action('/call_ended', method='POST')

        print("TwiML response generated")
        return Response(str(twiml), content_type='text/xml')

    except Exception as e:
        print(f"Error handling incoming call: {e}")
        twiml = VoiceResponse()
        twiml.say('Sorry, there was an error connecting your call.')
        return Response(str(twiml), content_type='text/xml')

@app.route("/call_ended", methods=['POST'])
def handle_call_ended():
    print("Received call ended request")
    try:
        call_sid = request.form.get('CallSid')
        print(f"Call ended, SID: {call_sid}")

        if call_sid not in call_data:
            print(f"No data found for Call SID: {call_sid}")
            return Response(status=404)

        call_info = call_data[call_sid]
        call_id = call_info['call_id']
        caller_number = call_info['caller_number']

        transcription = get_transcription_from_ultravox(call_id)
        print(f"Transcription: {transcription}")

        if not transcription:
            return Response(status=200)

        prompt = f"""Generate appointment confirmation details from this conversation:\n{transcription}"""
        response = groq_client.chat.completions.create(
            model="gemma2-9b-it",
            messages=[
                {"role": "system", "content": "Generate professional appointment confirmation details in plain text format."},
                {"role": "user", "content": prompt}
            ]
        )
        appointment_details = response.choices[0].message.content
        print(f"Appointment details: {appointment_details}")

        try:
            pywhatkit.sendwhatmsg_instantly(
                phone_no=caller_number,
                message=appointment_details,
                tab_close=True
            )
            print(f"WhatsApp message sent to {caller_number}")
        except Exception as e:
            print(f"Error sending WhatsApp message: {e}")

        del call_data[call_sid]

        return Response(status=200)

    except Exception as e:
        print(f"Error in call_ended: {e}")
        return Response(status=500)

if _name_ == "_main_":
    print("Starting Flask app...")
    app.run(port=5000)