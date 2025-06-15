
import GradientText from "@/components/ui/GradientText";


export default function DocsPage() {
    return (
        <div className="documentation-page rounded-2xl ">
          <div className="docs-container">
            <div className="docs-sidebar">
              <div className="docs-nav">
                <h3>Contents</h3>
                <ul>
                  <li>
                    <a href="#getting-started">Getting Started</a>
                  </li>
                  <li>
                    <a href="#features">Features</a>
                  </li>
                  <li>
                    <a href="#voice-assistant">Voice Assistant</a>
                  </li>
                  <li>
                    <a href="#chat-interface">Chat Interface</a>
                  </li>
                  <li>
                    <a href="#privacy">Privacy & Security</a>
                  </li>
                  <li>
                    <a href="#faq">FAQ</a>
                  </li>
                </ul>
              </div>
            </div>
    
            <div className="docs-content">
              <GradientText as="h1" className="docs-title flex items-center justify-between text-3xl mb-6">ArogyaMitra Documentation</GradientText>
              <p className="docs-intro">
                Welcome to the ArogyaMitra documentation. This guide will help you understand how to use our AI-powered
                health intelligence system effectively.
              </p>
    
              <section id="getting-started">
                <h2 >Getting Started</h2>
                <div className="docs-card">
                  <h3>What is ArogyaMitra?</h3>
                  <p>
                    BlueBox is an AI-powered business intelligence system designed to provide immediate business guidance and
                    support. Our platform combines advanced artificial intelligence with business expertise to deliver
                    personalized business solutions accessible to everyone, anytime, anywhere.
                  </p>
                </div>
    
                <div className="docs-card">
                  <h3>How to Start a Conversation</h3>
                  <ol>
                    <li>
                      Click on the <strong>"Voice Assistant"</strong> button on the Dashboard
                    </li>
                    <li>Enter your name when prompted</li>
                    <li>Enter your language</li>
                    <li>Once connected, you can start describing your health concerns</li>
                    <li>The AI assistant will respond with relevant questions and guidance</li>
                  </ol>
                </div>
              </section>
    
              <section id="features">
                <h2>Features</h2>
                <div className="docs-card">
                  <h3>24/7 Availability</h3>
                  <p>
                    ArogyaMitra is available round the clock to address your health concerns whenever they arise. No
                    appointments or waiting times are needed.
                  </p>
                </div>
    
                <div className="docs-card">
                  <h3>Health Knowledge Base</h3>
                  <p>
                    Our AI is trained on extensive health databases to provide accurate health information and guidance. It
                    can help with health assessment, general health queries, health information, and preventive
                    health tips.
                  </p>
                </div>
    
                <div className="docs-card">
                  <h3>Human Escalation</h3>
                  <p>
                    For complex cases that require human expertise, ArogyaMitra can seamlessly connect you with a health
                    professional. The system is designed to recognize when a case needs human intervention.
                  </p>
                </div>
              </section>
    
              <section id="voice-assistant">
                <h2>Voice Assistant</h2>
                <div className="docs-card">
                  <h3>Using Voice Commands</h3>
                  <p>
                    ArogyaMitra supports voice interaction, allowing you to speak directly to the assistant. This hands-free
                    approach is convenient for many situations.
                  </p>
                  <ul>
                    <li>
                      <strong>Start speaking</strong> after the connection is established
                    </li>
                    <li>Speak clearly and at a moderate pace</li>
                    <li>Pause briefly between sentences to allow the AI to process your input</li>
                    <li>
                      Use the <strong>Mute</strong> button when you want to temporarily disable your microphone
                    </li>
                  </ul>
                </div>
    
                <div className="docs-card">
                  <h3>Voice Controls</h3>
                  <p>Available controls during a voice session:</p>
                  <ul>
                    <li>
                      <strong>Mute/Unmute:</strong> Toggle your microphone on/off
                    </li>
                    <li>
                      <strong>End Call:</strong> Terminate the current session
                    </li>
                  </ul>
                </div>
              </section>
    
              <section id="chat-interface">
                <h2>Chat Interface</h2>
                <div className="docs-card">
                  <h3>Text-based Communication</h3>
                  <p>
                    If you prefer typing or are in a situation where speaking isn't convenient, you can use the text-based
                    chat interface. Simply type your messages in the input field and press Enter or click the send button.
                  </p>
                </div>
    
                <div className="docs-card">
                  <h3>Conversation History</h3>
                  <p>
                    Your conversation history is displayed in the chat window, allowing you to review previous exchanges.
                    This helps maintain context throughout your interaction with the assistant.
                  </p>
                </div>
              </section>
    
              <section id="privacy">
                <h2>Privacy & Security</h2>
                <div className="docs-card">
                  <h3>Data Protection</h3>
                  <p>
                    ArogyaMitra takes your privacy seriously. All conversations are encrypted and securely stored. Your
                    personal health information is protected according to health data protection standards.
                  </p>
                  <ul>
                    <li>End-to-end encryption for all communications</li>
                    <li>Secure data storage with limited access</li>
                    <li>Option to delete your conversation history</li>
                    <li>No sharing of personal data with third parties without consent</li>
                  </ul>
                </div>
              </section>
    
              <section id="faq">
                <h2>Frequently Asked Questions</h2>
                <div className="docs-card faq-section">
                  <div className="faq-item">
                    <h3>Is ArogyaMitra a replacement for a health advisor?</h3>
                    <p>
                      No, ArogyaMitra is designed to provide initial guidance and information but is not a substitute for
                      professional health advice. For serious health concerns, always consult with a qualified health
                      advisor.
                    </p>
                  </div>
    
                  <div className="faq-item">
                    <h3>How accurate is the information provided?</h3>
                    <p>
                      ArogyaMitra is trained on verified health information and continuously updated. However, it should be
                      used as a supplementary resource rather than the sole source of health advice.
                    </p>
                  </div>
    
                  <div className="faq-item">
                    <h3>Can I use ArogyaMitra for sales reasoning?</h3>
                    <p>
                      No, ArogyaMitra is not designed for sales reasoning. It is a general health assistant that can provide initial guidance and appointment booking information but is not a substitute for professional health advice.
                    </p>
                  </div>
    
                  <div className="faq-item">
                    <h3>Is there a limit to how often I can use the service?</h3>
                    <p>
                      No, you can use ArogyaMitra as often as needed. The service is designed to be available 24/7 without usage restrictions.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )
}
