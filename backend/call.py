from flask import Flask, request, Response, send_from_directory
from twilio.twiml.messaging_response import MessagingResponse
from dotenv import load_dotenv
from groq import Groq
import os
import logging
from datetime import datetime
import requests
import base64
from requests.auth import HTTPBasicAuth
from google.cloud import texttospeech

# Load environment variables
load_dotenv()

# Set path to Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "cred.json"

# Twilio credentials
TWILIO_ACCOUNT_SID = ""
TWILIO_AUTH_TOKEN = ""
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER", " ")

# Initialize clients
groq_client = Groq(api_key="")
tts_client = texttospeech.TextToSpeechClient()

# Initialize Flask app
app = Flask(__name__)
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("whatsapp_bot.log"),
        logging.StreamHandler()
    ]
)

# Load environment variables
load_dotenv()

# Configuration
ULTRAVOX_API_KEY = ""
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
        'X-API-Key': ""
    }
    response = requests.post(ULTRAVOX_API_URL, json=config, headers=headers)
    response.raise_for_status()
    return response.json()

logger.info("Flask app initialized")

# Ensure audio_files directory exists
if not os.path.exists('audio_files'):
    os.makedirs('audio_files')

# Conversation state to maintain context
conversation_state = {}

# System prompts
try:
    with open("prompt1.md", "r") as file:
        TEXT_PROMPT = file.read()
    with open("vision_prompt.md", "r") as file:
        VISION_PROMPT = file.read()
except FileNotFoundError as e:
    logger.error(f"Prompt file not found: {e}")
    TEXT_PROMPT = "You are Tanya, a nurse assistant at Symbiosis Hospital. Provide helpful, concise, and accurate responses to user queries."
    VISION_PROMPT = "You are Tanya, a nurse assistant at Symbiosis Hospital. Analyze the provided image and respond helpfully based on its content."

def fetch_twilio_media(media_url, return_base64=False):
    """Fetch media from Twilio and return as raw bytes or Base64-encoded string."""
    try:
        response = requests.get(
            media_url,
            auth=HTTPBasicAuth(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN),
            timeout=10
        )
        response.raise_for_status()
        if return_base64:
            content_type = response.headers.get('content-type', 'image/jpeg')
            image_data = base64.b64encode(response.content).decode('utf-8')
            return f"data:{content_type};base64,{image_data}"
        else:
            return response.content
    except Exception as e:
        logger.error(f"Failed to fetch media: {str(e)}")
        return None

def synthesize_text(text, language_code="en-US", voice_name="en-US-Wavenet-D", output_file="output.mp3"):
    """Synthesize text to speech using Google Cloud TTS and save to a file."""
    try:
        input_text = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code=language_code,
            name=voice_name
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
        response = tts_client.synthesize_speech(
            input=input_text,
            voice=voice,
            audio_config=audio_config
        )
        with open(os.path.join('audio_files', output_file), "wb") as out:
            out.write(response.audio_content)
        logger.info(f"Audio content written to audio_files/{output_file}")
        return True
    except Exception as e:
        logger.error(f"TTS synthesis failed: {str(e)}")
        return False

@app.route("/whatsapp", methods=['POST'])
def whatsapp_reply():
    """Handle incoming WhatsApp messages."""
    try:
        incoming_msg = request.form.get('Body', '').strip()
        sender_number = request.form.get('From', '')
        media_url = request.form.get('MediaUrl0')
        media_content_type = request.form.get('MediaContentType0')

        logger.info(f"Incoming message from {sender_number}: {incoming_msg}, Media: {media_url}")

        if sender_number not in conversation_state:
            conversation_state[sender_number] = {
                'history': [],
                'last_interaction': datetime.now().isoformat(),
                'language': 'en' 
            }

        
        if incoming_msg.lower() in ["start over", "reset"]:
            conversation_state[sender_number]['history'] = []
            resp = MessagingResponse()
            resp.message("Conversation reset. Hello! I'm Tanya, your nurse assistant at Symbiosis Hospital. How can I assist you today?")
            return Response(str(resp), mimetype="application/xml")

        
        language_map = {
            "en": ("en-US", "en-US-Wavenet-D"),
            "hi": ("hi-IN", "hi-IN-Wavenet-A"),
            "mr": ("mr-IN", "mr-IN-Wavenet-A")
        }
        for lang, (lang_code, voice_name) in language_map.items():
            if f"use {lang}" in incoming_msg.lower():
                conversation_state[sender_number]['language'] = lang
                incoming_msg = incoming_msg.replace(f"use {lang}", "").strip()
                logger.info(f"Language set to {lang} for {sender_number}")

        
        audio_keywords = ["send as audio", "voice response", "audio reply"]
        request_audio = any(keyword in incoming_msg.lower() for keyword in audio_keywords)
        if request_audio:
            incoming_msg = incoming_msg.lower()
            for keyword in audio_keywords:
                incoming_msg = incoming_msg.replace(keyword, "").strip()

        
        has_image = media_url and media_content_type and media_content_type.startswith('image/')
        has_audio = media_url and media_content_type and media_content_type.startswith('audio/')

        
        if has_image:
            base64_image = fetch_twilio_media(media_url, return_base64=True)
            if not base64_image:
                user_content = "Sorry, I couldn't access the image. Please try sending it again."
                user_input_for_history = "Sent an image (failed to access)"
            else:
                user_content = []
                if incoming_msg:
                    user_content.append({"type": "text", "text": incoming_msg})
                    user_input_for_history = incoming_msg
                else:
                    user_input_for_history = "Sent an image"
                user_content.append({"type": "image_url", "image_url": {"url": base64_image}})
        elif has_audio:
            audio_data = fetch_twilio_media(media_url, return_base64=False)
            if audio_data:
                audio_file_path = f"audio_files/temp_audio_{datetime.now().timestamp()}.wav"
                with open(audio_file_path, "wb") as f:
                    f.write(audio_data)
                try:
                    with open(audio_file_path, "rb") as audio_file:
                        transcription = groq_client.audio.transcriptions.create(
                            model="whisper-large-v3-turbo",
                            file=audio_file
                        )
                    transcribed_text = transcription.text
                    user_content = transcribed_text
                    user_input_for_history = transcribed_text
                except Exception as e:
                    logger.error(f"Transcription failed: {str(e)}")
                    user_content = "Sorry, I couldn't transcribe the audio. Please try sending it again."
                    user_input_for_history = "Sent an audio message (transcription failed)"
                finally:
                    try:
                        if os.path.exists(audio_file_path):
                            os.remove(audio_file_path)
                    except PermissionError as e:
                        logger.warning(f"Could not delete {audio_file_path}: {str(e)}")
            else:
                user_content = "Sorry, I couldn't access the audio. Please try sending it again."
                user_input_for_history = "Sent an audio message (failed to access)"
        elif media_url:
            user_content = "Sorry, I can only process text, images, or audio messages."
            user_input_for_history = "Sent an unsupported media type"
        else:
            user_content = incoming_msg
            user_input_for_history = incoming_msg

        system_prompt = VISION_PROMPT if has_image else TEXT_PROMPT

        messages = [{"role": "system", "content": system_prompt}]
        for turn in conversation_state[sender_number]['history']:
            messages.append({"role": "user", "content": turn['user']})
            messages.append({"role": "assistant", "content": str(turn['assistant'])})

    
        messages.append({"role": "user", "content": user_content})
        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0.7,
            max_tokens=300
        )
        llm_response = chat_completion.choices[0].message.content.strip()
        logger.info(f"LLM Response: {llm_response}")


        conversation_state[sender_number]['history'].append({
            'user': user_input_for_history,
            'assistant': llm_response
        })
        if len(conversation_state[sender_number]['history']) > 5:
            conversation_state[sender_number]['history'] = conversation_state[sender_number]['history'][-5:]
        conversation_state[sender_number]['last_interaction'] = datetime.now().isoformat()

        resp = MessagingResponse()
        if request_audio:
        
            audio_filename = f"response_{sender_number.replace(':', '_')}_{datetime.now().timestamp()}.mp3"
            lang = conversation_state[sender_number]['language']
            lang_code, voice_name = language_map.get(lang, ("en-US", "en-US-Wavenet-D"))
            success = synthesize_text(
                text=llm_response,
                language_code=lang_code,
                voice_name=voice_name,
                output_file=audio_filename
            )
            if success:
               
                base_url = os.getenv("BASE_URL", "http://localhost:5000")  
                audio_url = f"{base_url}/audio/{audio_filename}"
                msg = resp.message()
                msg.body("Here is your audio response:")
                msg.media(audio_url)
                logger.info(f"Audio response generated: {audio_url}")
            else:
                resp.message("Sorry, I couldn't generate the audio response. Here's the text instead:\n" + llm_response)
                logger.error("Failed to generate audio response")
        else:
            resp.message(llm_response)

        logger.info(f"Sending TwiML: {str(resp)}")
        return Response(str(resp), mimetype="application/xml")

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        resp = MessagingResponse()
        resp.message("Sorry, I encountered an issue. Please try again or contact Symbiosis Hospital directly.")
        logger.info(f"Sending TwiML: {str(resp)}")
        return Response(str(resp), mimetype="application/xml")

@app.route('/audio/<filename>')
def serve_audio(filename):
    """Serve audio files from the audio_files directory."""
    return send_from_directory('audio_files', filename)

@app.route("/incoming", methods=['POST'])
def handle_incoming_call():
    print("Incoming call received")
    try:
        caller_number = request.form.get('From')
        print(f"Incoming call from: {caller_number}")

        dynamic_system_prompt = PROMPT_TEMPLATE.format(caller_number=caller_number)

        call_config = ULTRAVOX_CALL_CONFIG.copy()
        call_config["systemPrompt"] = dynamic_system_prompt

        call_response = create_ultravox_call(call_config)
        join_url = call_response.get('joinUrl')

        twiml = VoiceResponse()
        connect = twiml.connect()
        connect.stream(url=join_url, name='ultravox')

        return Response(str(twiml), content_type='text/xml')

    except Exception as e:
        print(f"Error handling incoming call: {e}")
        twiml = VoiceResponse()
        twiml.say('Sorry, there was an error connecting your call.')
        return Response(str(twiml), content_type='text/xml')


@app.route("/health", methods=['GET'])
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}, 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)