"use client"
import { api } from "@/convex/_generated/api"
import { Coachingexperts } from "@/services/Options"
import { useQuery } from "convex/react"
import { useParams } from "next/navigation"
import { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import { UserButton } from "@stackframe/stack"
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react"
import "@livekit/components-styles"
import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
} from "@livekit/components-react"
import { Track } from "livekit-client"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mic,
  AudioWaveform,
  MessageSquare,
  Languages,
  LogOut,
  HelpCircle,
  AlertCircle,
  Heart,
  Sparkles,
  Star,
  Shield,
  Clock,
  Zap,
  ChevronDown,
  Info,
  Headphones,
  Brain,
  Activity,
  Download,
  FileText,
  Send,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Groq from "groq-sdk"
import emailjs from "@emailjs/browser"
import GradientText from "@/components/ui/GradientText"
import "./disscusion.css"

// Message component for chat transcript
const Message = ({ type, text }) => {
  const variants = {
    initial: { opacity: 0, x: type === "agent" ? -20 : 20, y: 10 },
    animate: { opacity: 1, x: 0, y: 0, transition: { duration: 0.4, type: "spring" } },
  }

  return (
    <motion.div
      className={`message ${type === "agent" ? "message-agent-container" : "message-user-container"}`}
      initial="initial"
      animate="animate"
      variants={variants}
    >
      <strong className={`message-${type}`}>{type === "agent" ? "Agent:" : "You:"}</strong>
      <span className="message-text">{text}</span>
    </motion.div>
  )
}

// VoiceAssistantContent component (used inside LiveKitRoom)
const VoiceAssistantContent = ({ setMessages }) => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant()
  const localParticipant = useLocalParticipant()
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  })

  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime)
    setMessages(allMessages)
  }, [agentTranscriptions, userTranscriptions, setMessages])

  const containerVariants = {
    active: {
      scale: 1.05,
      boxShadow: "0 10px 30px -5px rgba(124, 58, 237, 0.5)",
      transition: {
        duration: 0.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
    inactive: {
      scale: 1,
      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)",
    },
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  }

  return (
    <div className="voice-assistant-container">
      <motion.div
        className="visualizer-container"
        variants={containerVariants}
        animate={state === "connecting" || state === "speaking" ? "active" : "inactive"}
      >
        <BarVisualizer
          state={state}
          barCount={32}
          trackRef={audioTrack}
          colors={["#8B5CF6", "#EC4899", "#3B82F6", "#10B981"]}
          className="visualizer"
        />

        <motion.div className="visualizer-orbs">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="orb"
              initial={{ opacity: 0.3 }}
              animate={state === "speaking" ? "pulse" : { opacity: 0.3 }}
              variants={pulseVariants}
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.2}s`,
                backgroundColor: i % 2 === 0 ? "#8B5CF6" : "#3B82F6",
              }}
            />
          ))}
        </motion.div>

        <motion.div
          className="absolute bottom-2 right-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Badge
            variant={state === "speaking" ? "default" : "outline"}
            className={state === "speaking" ? "animate-pulse bg-gradient-to-r from-orange-500 to red-500" : ""}
          >
            {state === "idle" && "Ready"}
            {state === "connecting" && "Connecting..."}
            {state === "speaking" && "Speaking"}
            {state === "error" && "Error"}
          </Badge>
        </motion.div>
      </motion.div>
      <motion.div
        className="control-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <VoiceAssistantControlBar />
      </motion.div>
    </div>
  )
}

// Product description component
const ProductDescription = () => {
  const featureVariants = {
    hover: {
      y: -8,
      boxShadow: "0 15px 30px -10px rgba(124, 58, 237, 0.2)",
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6"
    >
      <Card className="product-card overflow-hidden border-0 relative">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-olrange-300/30 to-pink-300/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-blue-300/30 to-green-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-white/50 backdrop-blur-sm -z-10 rounded-xl"></div>

        <CardHeader>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-orange-500" />
              <span>About ArogyaMitra Voice Assistant</span>
            </CardTitle>
            <CardDescription className="text-base">
              Your personal healthcare voice assistant powered by AI
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.p
            className="text-base text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ArogyaMitra is an advanced AI-powered voice assistant designed to provide healthcare guidance, answer
            medical questions, and offer personalized health advice in multiple Indian languages.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <motion.div
              className="feature-card flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-indigo-50 border border-orange-100 relative overflow-hidden"
              whileHover="hover"
              variants={featureVariants}
            >
              <div className="feature-icon-wrapper">
                <Languages className="feature-icon text-orange-500" />
                <motion.div
                  className="absolute inset-0 bg-orange-200 rounded-full opacity-20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
              <div>
                <h4 className="text-base font-medium">Multilingual Support</h4>
                <p className="text-sm text-muted-foreground">
                  Available in English, Hindi, Marathi, Punjabi, and Tamil
                </p>
              </div>
            </motion.div>

            <motion.div
              className="feature-card flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 relative overflow-hidden"
              whileHover="hover"
              variants={featureVariants}
            >
              <div className="feature-icon-wrapper">
                <Clock className="feature-icon text-blue-500" />
                <motion.div
                  className="absolute inset-0 bg-blue-200 rounded-full opacity-20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                />
              </div>
              <div>
                <h4 className="text-base font-medium">24/7 Availability</h4>
                <p className="text-sm text-muted-foreground">Get healthcare guidance anytime, anywhere</p>
              </div>
            </motion.div>

            <motion.div
              className="feature-card flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 relative overflow-hidden"
              whileHover="hover"
              variants={featureVariants}
            >
              <div className="feature-icon-wrapper">
                <Heart className="feature-icon text-pink-500" />
                <motion.div
                  className="absolute inset-0 bg-pink-200 rounded-full opacity-20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                />
              </div>
              <div>
                <h4 className="text-base font-medium">Personalized Advice</h4>
                <p className="text-sm text-muted-foreground">Tailored health recommendations based on your needs</p>
              </div>
            </motion.div>

            <motion.div
              className="feature-card flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 relative overflow-hidden"
              whileHover="hover"
              variants={featureVariants}
            >
              <div className="feature-icon-wrapper">
                <MessageSquare className="feature-icon text-emerald-500" />
                <motion.div
                  className="absolute inset-0 bg-emerald-200 rounded-full opacity-20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                />
              </div>
              <div>
                <h4 className="text-base font-medium">Conversation Transcript</h4>
                <p className="text-sm text-muted-foreground">
                  Automatic recording of your conversation for future reference
                </p>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// User instructions component
const UserInstructions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-6"
    >
      <Accordion type="single" collapsible className="w-full instruction-accordion">
        <AccordionItem value="instructions">
          <AccordionTrigger className="flex items-center gap-2 text-lg py-4 px-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-t-xl border border-violet-100">
            <div className="instruction-icon-wrapper">
              <HelpCircle className="instruction-icon text-violet-500" />
            </div>
            <span>How to use ArogyaMitra</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white p-6 rounded-b-xl shadow-inner border border-t-0 border-violet-100">
            <ol className="space-y-4 text-base text-muted-foreground list-none pl-0">
              {[
                {
                  step: 1,
                  icon: <MessageSquare size={18} />,
                  text: (
                    <>
                      <strong>Enter your name and select your preferred language</strong> from the dropdown menu.
                    </>
                  ),
                  color: "from-orange-400 to-red-400",
                },
                {
                  step: 2,
                  icon: <Headphones size={18} />,
                  text: (
                    <>
                      <strong>Click the "Connect" button</strong> to start a new conversation with the voice assistant.
                    </>
                  ),
                  color: "from-blue-400 to-cyan-400",
                },
                {
                  step: 3,
                  icon: <Mic size={18} />,
                  text: (
                    <>
                      <strong>Speak clearly into your microphone</strong> when you see the "Ready" status.
                    </>
                  ),
                  color: "from-pink-400 to-rose-400",
                },
                {
                  step: 4,
                  icon: <Brain size={18} />,
                  text: (
                    <>
                      <strong>Wait for the assistant to respond</strong> - you'll see the visualizer animate when it's
                      speaking.
                    </>
                  ),
                  color: "from-amber-400 to-yellow-400",
                },
                {
                  step: 5,
                  icon: <MessageSquare size={18} />,
                  text: (
                    <>
                      <strong>View the transcript</strong> of your conversation in the chat panel on the right.
                    </>
                  ),
                  color: "from-emerald-400 to-teal-400",
                },
                {
                  step: 6,
                  icon: <Activity size={18} />,
                  text: (
                    <>
                      <strong>Use the control bar</strong> to mute/unmute your microphone or adjust settings.
                    </>
                  ),
                  color: "from-violet-400 to-orange-400",
                },
                {
                  step: 7,
                  icon: <LogOut size={18} />,
                  text: (
                    <>
                      <strong>Click "Disconnect"</strong> when you're finished with your conversation.
                    </>
                  ),
                  color: "from-red-400 to-rose-400",
                },
                {
                  step: 8,
                  icon: <Download size={18} />,
                  text: (
                    <>
                      <strong>Download your conversation summary</strong> after disconnecting for future reference.
                    </>
                  ),
                  color: "from-green-400 to-emerald-400",
                },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="instruction-step"
                  whileHover={{ x: 5, backgroundColor: "rgba(124, 58, 237, 0.05)" }}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className={`step-number bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <div>{item.text}</div>
                </motion.li>
              ))}
            </ol>

            <Alert className="mt-6 border-0 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100">
              <div className="flex items-start gap-3">
                <div className="alert-icon-wrapper">
                  <AlertCircle className="alert-icon text-amber-500" />
                  <motion.div
                    className="absolute inset-0 bg-amber-200 rounded-full opacity-20"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>
                <div>
                  <AlertTitle className="text-amber-700">Important Note</AlertTitle>
                  <AlertDescription className="text-amber-600">
                    At the end of your conversation, ArogyaMitra will automatically generate a summary and
                    recommendations based on your discussion.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  )
}

// Function to generate conversation summary using Groq
const generateConversationSummary = async (messages) => {
  try {
    const groq = new Groq({
      apiKey: "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",
      dangerouslyAllowBrowser: true,
    })

    const conversationText = messages.map((msg) => `${msg.type === "agent" ? "Agent" : "User"}: ${msg.text}`).join("\n")

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a healthcare assistant that summarizes conversations. Provide a concise summary with key points, any health recommendations, appointment details if discussed, and future steps.",
        },
        {
          role: "user",
          content: `Please summarize the following healthcare conversation and include any appointment-related details if mentioned:\n\n${conversationText}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
    })

    return chatCompletion.choices[0]?.message?.content || "No summary available."
  } catch (error) {
    console.error("Error generating summary:", error)
    return "Unable to generate summary at this time."
  }
}

// Main DiscussionRoom component
export default function DiscussionRoom() {
  const { roomid } = useParams()
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid })
  const [Expert, setExpert] = useState()
  const [token, setToken] = useState(null)
  const [isSubmittingName, setIsSubmittingName] = useState(true)
  const [name, setName] = useState("")
  const [language, setLanguage] = useState("en-US")
  const [messages, setMessages] = useState([])
  const chatContentRef = useRef(null)
  const [showDetails, setShowDetails] = useState(false)
  const mainContainerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState("")
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showEmailPopup, setShowEmailPopup] = useState(false)
  const [email, setEmail] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    if (DiscussionRoomData) {
      const foundExpert = Coachingexperts.find((item) => item.name === DiscussionRoomData.expertName)
      console.log("Expert:", foundExpert)
      setExpert(foundExpert)
    }
  }, [DiscussionRoomData])

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    document.body.style.overflow = "auto"
    document.body.style.height = "auto"
    window.scrollTo(0, 0)
    return () => {
      document.body.style.overflow = ""
      document.body.style.height = ""
    }
  }, [])

  useEffect(() => {
    // Initialize EmailJS with your public key
    emailjs.init("hu_M4uuMBZAMKjX1h")
  }, [])

  const getToken = useCallback(async (userName, selectedLanguage) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/getToken?name=${encodeURIComponent(userName)}&language=${encodeURIComponent(selectedLanguage)}`,
      )
      const token = await response.text()
      setToken(token)
      setIsSubmittingName(false)
    } catch (error) {
      console.error("Error fetching token:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      getToken(name, language)
    }
  }

  const handleDisconnect = () => {
    setShowEmailPopup(true)
    setToken(null)
    setIsSubmittingName(true)
  }

  const sendSummaryEmail = async () => {
    if (!email) return
    setIsSendingEmail(true)
    setIsGeneratingSummary(true)
    try {
      const conversationSummary = await generateConversationSummary(messages)
      setSummary(conversationSummary)

      // Format current date and time
      const now = new Date()
      const formattedDate = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })

      const templateParams = {
        to_name: name,
        to_email: email,
        conversation_summary: conversationSummary,
        conversation_date: formattedDate,
        conversation_time: formattedTime,
        message_count: messages.length.toString(),
      }

      // Send email using EmailJS
      await emailjs.send(
        "service_fd2lz7r", // Your EmailJS service ID
        "template_d9ztlxb", // Your EmailJS template ID
        templateParams,
      )
 
      setEmailSent(true)
      setShowSummary(true)
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to send email. Please try again.")
    } finally {
      setIsSendingEmail(false)
      setIsGeneratingSummary(false)
      setShowEmailPopup(false)
    }
  }

  const downloadConversation = () => {
    const conversationText = messages
      .map((msg) => `${msg.type === "agent" ? "Agent" : "User"}: ${msg.text}`)
      .join("\n\n")

    const fullText = summary
      ? `# ArogyaMitra Conversation Summary\n\n${summary}\n\n# Full Conversation Transcript\n\n${conversationText}`
      : `# ArogyaMitra Conversation Transcript\n\n${conversationText}`

    const blob = new Blob([fullText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ArogyaMitra-Conversation-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const closeSummary = () => {
    setShowSummary(false)
    setMessages([])
    setEmail("")
    setEmailSent(false)
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const pulseAnimation = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  const scrollToDetails = () => {
    setShowDetails(!showDetails)
    if (!showDetails) {
      setTimeout(() => {
        const detailsElement = document.querySelector(".additional-details")
        if (detailsElement) {
          detailsElement.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 300)
    }
  }

  return (
    <div className="min-h-screen bg-main" ref={mainContainerRef}>
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      <div className="bg-blob-3"></div>

      {/* Animated background elements */}
      <motion.div
        className="floating-particle particle-1"
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="floating-particle particle-2"
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 1,
        }}
      />
      <motion.div
        className="floating-particle particle-3"
        animate={{
          y: [0, -20, 0],
          x: [0, -30, 0],
          opacity: [0.1, 0.4, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 2,
        }}
      />

      <motion.div
        className="discussion-room-container pt-8 relative z-10 mt-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div
          className="page-title-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GradientText
            className="page-title text-3xl md:text-4xl mt-15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {DiscussionRoomData?.coachingOption || "ArogyaMitra Voice Assistant"}
          </GradientText>
        </motion.div>

        <div className="main-interaction-area">
          <div className="interaction-grid">
            <motion.div className="expert-container" variants={fadeIn} transition={{ delay: 0.3 }}>
              <div className="expert-card">
                <div className="expert-content">
                  {Expert?.avatar && (
                    <motion.div className="expert-profile" variants={pulseAnimation} animate="pulse">
                      <div className="avatar-container">
                        <motion.div
                          className="avatar-glow"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                        ></motion.div>
                        <Image
                          src={Expert.avatar || "/placeholder.svg?height=120&width=120"}
                          alt="Avatar"
                          width={120}
                          height={120}
                          className="expert-avatar"
                        />
                        <motion.div
                          className="status-indicator"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                            boxShadow: [
                              "0 0 0 rgba(74, 222, 128, 0.4)",
                              "0 0 20px rgba(74, 222, 128, 0.6)",
                              "0 0 0 rgba(74, 222, 128, 0.4)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        />
                      </div>
                      <GradientText className="expert-name">{Expert?.name || "Healthcare Expert"}</GradientText>
                      <div className="expert-title-container">
                        <p className="expert-title">Healthcare Expert</p>
                        <motion.div className="expert-badge" whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                          <Shield className="expert-badge-icon" />
                          <span>Certified</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {token ? (
                    <LiveKitRoom
                      serverUrl="wss://app-zq7e4mya.livekit.cloud"
                      token={token}
                      connect={true}
                      video={false}
                      audio={true}
                      onDisconnected={handleDisconnect}
                    >
                      <RoomAudioRenderer />
                      <VoiceAssistantContent setMessages={setMessages} />
                    </LiveKitRoom>
                  ) : (
                    <motion.div
                      className="connect-prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="connect-icon-container">
                        <Mic className="connect-icon" />
                        <div className="connect-icon-rings">
                          <motion.div
                            className="ring ring1"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "reverse",
                              delay: 0,
                            }}
                          ></motion.div>
                          <motion.div
                            className="ring ring2"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "reverse",
                              delay: 0.5,
                            }}
                          ></motion.div>
                          <motion.div
                            className="ring ring3"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "reverse",
                              delay: 1,
                            }}
                          ></motion.div>
                        </div>
                      </div>
                      <h3 className="connect-title">Ready to Start Conversation</h3>
                      <p className="connect-description">Enter your name and select a language to begin</p>
                    </motion.div>
                  )}

                  <motion.div className="user-button-container" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <div className="p-7 bg-gradient-to-r from-orange-200 to red-200 px-10 rounded-lg absolute bottom-2 right-2 shadow-lg">
                      <UserButton />
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div
                className="form-container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {isSubmittingName ? (
                  <form onSubmit={handleNameSubmit} className="connect-form">
                    <div className="input-container">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="name-input"
                        required
                      />
                      <div className="input-icon">
                        <MessageSquare size={16} />
                      </div>
                    </div>

                    <div className="input-container">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="language-select"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="mr">Marathi</option>
                        <option value="pa">Punjabi</option>
                        <option value="ta">Tamil</option>
                      </select>
                      <div className="input-icon">
                        <Languages size={16} />
                      </div>
                    </div>

                    <Button type="submit" className="connect-button" disabled={isLoading}>
                      {isLoading ? (
                        <motion.div
                          className="loading-spinner"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </form>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={handleDisconnect} variant="destructive" className="disconnect-button">
                      <LogOut size={16} />
                      Disconnect
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            <motion.div className="chat-container" variants={fadeIn} transition={{ delay: 0.4 }}>
              <div className="chat-card">
                <div className="chat-header">
                  <GradientText>
                    <h2 className="chat-title">
                      <MessageSquare className="chat-icon" />
                      Chat Transcript
                    </h2>
                  </GradientText>
                  <div className="chat-actions">
                    {messages.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="download-button"
                              onClick={downloadConversation}
                            >
                              <Download size={18} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download conversation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <motion.div
                      className="message-counter"
                      animate={{
                        scale: messages.length > 0 ? [1, 1.05, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {messages.length} messages
                    </motion.div>
                  </div>
                </div>

                <div className="chat-content" ref={chatContentRef}>
                  <AnimatePresence>
                    {token ? (
                      messages.length > 0 ? (
                        messages.map((msg, index) => <Message key={msg.id || index} type={msg.type} text={msg.text} />)
                      ) : (
                        <motion.div
                          className="empty-chat"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div>
                            <div className="empty-chat-icon-container">
                              <AudioWaveform className="empty-chat-icon" />
                              <motion.div
                                className="empty-chat-icon-glow"
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: "reverse",
                                }}
                              ></motion.div>
                            </div>
                            <p>Your conversation will appear here.</p>
                            <p className="empty-chat-subtitle">Start speaking to see the transcript.</p>
                          </div>
                        </motion.div>
                      )
                    ) : (
                      <motion.div
                        className="empty-chat"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div>
                          <div className="empty-chat-icon-container">
                            <MessageSquare className="empty-chat-icon" />
                            <motion.div
                              className="empty-chat-icon-glow"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                              }}
                            ></motion.div>
                          </div>
                          <p>Connect to start the conversation.</p>
                          <p className="empty-chat-subtitle">Enter your name and select a language.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.2)" }}
          >
            <div className="footer-card">
              <AudioWaveform className="footer-icon" />
              <p className="footer-text">
                At the end of the conversation, we will automatically generate feedback/notes from your conversation.
              </p>
              <div className="footer-stars">
                <motion.div
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.2, 1, 1.2, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 0,
                  }}
                >
                  <Star className="star star1" />
                </motion.div>
                <motion.div
                  animate={{
                    rotate: [0, -10, 0, 10, 0],
                    scale: [1, 1.2, 1, 1.2, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 1,
                  }}
                >
                  <Star className="star star2" />
                </motion.div>
                <motion.div
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.2, 1, 1.2, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 2,
                  }}
                >
                  <Star className="star star3" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="details-toggle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={scrollToDetails}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(124, 58, 237, 0.1)" }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="details-toggle-content">
            <Info className="details-toggle-icon" />
            <span>{showDetails ? "Hide Details" : "Show Details"}</span>
            <motion.div animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="details-toggle-arrow" />
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="additional-details"
              id="details-section"
            >
              <ProductDescription />
              <UserInstructions />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Email Popup */}
      <AnimatePresence>
        {showEmailPopup && (
          <motion.div
            className="email-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="email-popup"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Send Summary to Email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We'll send a detailed summary of your conversation to your email address.
              </p>
              <div className="relative mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="email-input pl-10"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                  <MessageSquare size={16} />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={sendSummaryEmail}
                  disabled={isSendingEmail || !email}
                  className="flex-1 bg-gradient-to-r from-orange-500 to red-500 hover:from-orange-700 hover:to-red-700"
                >
                  {isSendingEmail ? (
                    <motion.div
                      className="loading-spinner mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                  ) : (
                    <Send size={16} className="mr-2" />
                  )}
                  {isSendingEmail ? "Sending..." : "Send Summary"}
                </Button>
                <Button variant="outline" onClick={() => setShowEmailPopup(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Modal */}
      <AnimatePresence>
        {isGeneratingSummary && (
          <motion.div
            className="summary-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="summary-loading-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="summary-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <h3>Generating Conversation Summary...</h3>
              <p>Please wait while we analyze your conversation</p>
            </motion.div>
          </motion.div>
        )}

        {showSummary && (
          <motion.div
            className="summary-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="summary-modal"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="summary-header">
                <div className="summary-title">
                  <FileText className="summary-icon" />
                  <h2>Conversation Summary</h2>
                </div>
                <div className="summary-actions">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="summary-download-button"
                          onClick={downloadConversation}
                        >
                          <Download size={18} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download summary and conversation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="summary-content">
                <div className="summary-text">
                  {summary.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                {emailSent && (
                  <motion.div
                    className="email-sent-note flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CheckCircle2 size={16} />
                    <span>The summary has been sent to {email}.</span>
                  </motion.div>
                )}
              </div>
              <div className="summary-footer">
                <Button variant="outline" onClick={closeSummary}>
                  Close
                </Button>
                <Button className="download-summary-button" onClick={downloadConversation}>
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
