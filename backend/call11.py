from flask import Flask, request, Response
import requests
import os
from twilio.twiml.voice_response import VoiceResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
ULTRAVOX_API_KEY = "7Gbaa4qr.4MMlwkK2OdOJNbqiPTV2pCMPXVhhxSQ9"
ULTRAVOX_API_URL = 'https://api.ultravox.ai/api/calls'

# Load the prompt template from file at startup
prompt_file_path = os.path.join(os.path.dirname(__file__), "prompt1.md")
with open(prompt_file_path, "r") as file:
    PROMPT_TEMPLATE = file.read()

# Ultravox base configuration (excluding systemPrompt, which will be set dynamically)
ULTRAVOX_CALL_CONFIG = {
    
    "model": "fixie-ai/ultravox",
    "voice": "Riya-Rao-English-Indian",
    "temperature": 0.3,
    "firstSpeaker": "FIRST_SPEAKER_AGENT",
    "medium": {"twilio": {}}
}

# Function to create Ultravox call and get join URL
def create_ultravox_call(config):
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': ULTRAVOX_API_KEY
    }
    response = requests.post(ULTRAVOX_API_URL, json=config, headers=headers)
    response.raise_for_status()
    return response.json()

# Initialize Flask app
app = Flask(__name__)
print("Flask app initialized")
@app.route("/incoming", methods=['POST'])
def handle_incoming_call():
    print("Incoming call received")
    try:
        # Get caller's phone number from Twilio request
        caller_number = request.form.get('From')
        print(f"Incoming call from: {caller_number}")

        # Create dynamic system prompt by formatting the template with the caller's number
        dynamic_system_prompt = PROMPT_TEMPLATE.format(caller_number=caller_number)

        # Create a copy of the base config and update with the dynamic prompt
        call_config = ULTRAVOX_CALL_CONFIG.copy()
        call_config["systemPrompt"] = dynamic_system_prompt

        # Create Ultravox call with the updated configuration
        call_response = create_ultravox_call(call_config)
        join_url = call_response.get('joinUrl')

        # Generate TwiML response to connect the call
        twiml = VoiceResponse()
        connect = twiml.connect()
        connect.stream(url=join_url, name='ultravox')

        return Response(str(twiml), content_type='text/xml')

    except Exception as e:
        print(f"Error handling incoming call: {e}")
        twiml = VoiceResponse()
        twiml.say('Sorry, there was an error connecting your call.')
        return Response(str(twiml), content_type='text/xml')

# Run the Flask app
if __name__ == "__main__":
    app.run(port=5000)