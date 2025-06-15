"use client"
import { useState, createContext, useContext } from "react"
import { motion, useScroll, useTransform ,useInView,AnimatePresence} from "framer-motion"
import Link from "next/link"
import {Button} from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade"

import  GradientText  from "@/components/ui/GradientText"

// Icons
import { Heart, Shield, Clock, Star, Globe, ChevronDown, Menu, X } from "lucide-react"
import FloatingPhone from "@/components/ui/phone";
import InfiniteMenu from "@/components/ui/infinitemenu";
import Threads from "@/components/ui/wave";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import ScrollVelocity from "@/components/ui/scrolll";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

import { useRef, useEffect } from "react";

import { Users, Hospital, Award , Quote, ChevronLeft, ChevronRight} from "lucide-react"
import TryChatbotSection from "@/components/ui/trychatbot";
import InteractiveChatbotPreview from "@/components/ui/chat";
import WhatsAppFeatures from "./components/whatsapp";
import ConnectivityFlowchart from "./components/flowchart";



// Create language context
const LanguageContext = createContext()

// Language provider component
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en")

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

// Custom hook to use language
const useLanguage = () => useContext(LanguageContext)

// Translations
const translations = {
  en: {
    nav: {
      home: "Home",
      pricing: "Pricing",
      features: "Features",
      demo: "Demo",
      contact: "Contact",

    },
    hero: {
      title: "Your Health,",
      titleGradient: "Our Priority",
      callUs: "Call Us: +1(920)-375-7113",
      description:
        "We are committed to your health and well-being by providing you with the best healthcare services"
    },
    features: {
      title: "Features",
      heading: "How ArogyaMitra Helps You",
      description: "Our platform provides comprehensive health and wellness support with these key features",
      personalizedCare: {
        title: "Personalized Care",
        description: "Get tailored care based on your specific needs and history.",
      },
      availability: {
        title: "24/7 Availability",
        description: "Access care anytime, day or night, without waiting for appointments.",
      },
      secure: {
        title: "Secure & Private",
        description: "Your health data is protected with enterprise-grade security.",
      },
    },
    video: {
      title: "Watch & Learn",
      heading: "See ArogyaMitra in Action",
      description: "Watch how our AI business intelligence assistant can transform your business insights experience",
      demo: "ArogyaMitra AI Demo",
      seeHow: "See how our AI assistant works",
      tryIt: "Try It Yourself",
    },
    testimonials: {
      title: "Testimonials",
      heading: "What Our Users Say",
      description: "Hear from people who have transformed their health and wellness experience with ArogyaMitra",
    },
    cta: {
      heading: "Ready to transform your health and wellness experience?",
      description: "Join thousands of users who have made ArogyaMitra their trusted health and wellness companion.",
      getStarted: "Get Started",
      contactUs: "Contact Us",
    },
    footer: {
      description:
        "AI-powered health and wellness assistant available 24/7 to address your health concerns and provide guidance with personalized insights.",
      rights: "All rights reserved.",
      quickLinks: "Quick Links",
      contact: "Contact",
      designedWith: "Designed with ❤️ by DataWizards",
    },
    languageSelector: "Language",
  },
  
}



// Language selector component
const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: "en", name: "English" },
  ]

  return (
    <div className="relative">
      <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900" onClick={() => setIsOpen(!isOpen)}>
        <Globe size={16} />
        <span>{languages.find((l) => l.code === language)?.name}</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


// Header Component
const Header = () => {
  const { language } = useLanguage()
  const t = translations[language]
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-orange-50 animate-fade-in backdrop-blur-md ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 text-3xl">
            <img src="Arogyalogo.png" alt="ArogyaMitra Logo" className="h-10 w-10" />
            <GradientText>ArogyaMitra</GradientText>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t.nav.home}
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t.nav.pricing}
              </Link>
              <Link href="#features" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t.nav.features}
              </Link>
              <Link href="#video-section" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t.nav.demo}
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t.nav.contact}
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <LanguageSelector />

              <Button
                asChild
                variant="ghost"
                className="text-white p-2 bg-gradient-to-r from-orange-500 to red-500 rounded-3xl"
              >
                <Link href="/handler/signup">Login</Link>
              </Button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <LanguageSelector />
            <button className="text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.home}
              </Link>
              <Link
                href="#features"
                className="text-gray-600 hover:text-blue-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.features}
              </Link>
              <Link
                href="#video-section"
                className="text-gray-600 hover:text-blue-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.demo}
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-blue-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.contact}
              </Link>

              <Button
                asChild
                variant="ghost"
                className="text-white p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl w-full mt-2"
              >
                <Link href="/handler/signup">Login</Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}


// Hero Section Component
const HeroSection = () => {
  const { language } = useLanguage()
  const t = translations[language]
  const buttonRefs = [useRef(null), useRef(null)] // One ref per button

  // 3D button effect for each button
  useEffect(() => {
    buttonRefs.forEach((buttonRef) => {
      const button = buttonRef.current
      if (!button) return

      const handleMouseMove = (e) => {
        const rect = button.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10

        button.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
      }

      const handleMouseLeave = () => {
        button.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
      }

      button.addEventListener("mousemove", handleMouseMove)
      button.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        button.removeEventListener("mousemove", handleMouseMove)
        button.removeEventListener("mouseleave", handleMouseLeave)
      }
    })
  }, [])

  return (
    <div className="relative w-full min-h-[100vh] ">
      {/* Background Threads */}
      <div className="absolute inset-0 z-0">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>

      {/* Foreground Content */}
      <BlurFade delay={0.9} inView>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 py-12 space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="mb-4 md:mb-0 bg-transparent">
              <h1 className="text-7xl sm:text-7xl md:text-7xl lg:text-7xl bg-clip-text text-transparent bg-black">
                {t.hero.title}<GradientText>Our Priority</GradientText>
              </h1>
              <p className="text-gray-500">
                We are committed to providing you with the best possible healthcare experience by providing services <br />such as voice ai powered healthcare assistant, 24/7 availability, secure and private, personalized care, <br />and more.
              </p>
            </div>

            <div>
              <FloatingPhone />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {[
              { href: "/handler/signup", text: "Get Started", ref: buttonRefs[0] },
        
            ].map((button, index) => (
              <motion.div
                key={index}
                className="group relative inline-block"
                style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease" }}
                ref={button.ref}
              >
                {/* Button glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(168, 85, 247, 0.5)",
                      "0 0 40px rgba(168, 85, 247, 0.7)",
                      "0 0 20px rgba(168, 85, 247, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />

                {/* Main button */}
                <Button
                  asChild
                  variant="ghost"
                  className="relative p-6 pl-16 pr-16 bg-gradient-to-r from-orange-500 to-red-500 backdrop-blur-sm rounded-3xl text-white  text-lg shadow-lg overflow-hidden z-10"
                >
                  <Link href={button.href}>
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                    />

                    {/* Button content */}
                    <div className="flex items-center justify-center gap-3 relative">
                      <span>{button.text}</span>
                    </div>
                  </Link>
                </Button>

                {/* Floating particles around button */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-orange-500"
                    initial={{
                      x: Math.random() * 200 - 100,
                      y: Math.random() * 200 - 100,
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                      y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                      scale: [0, 1, 0],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: Math.random() * 2 + 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </BlurFade>
      <BlurFade delay={0.9} inView>
        <div className="mt-16 relative z-10 flex flex-col gap-0 m-0 p-0">
          <ScrollVelocity
            texts={['ArogyaMitra']}
            velocity={100}
            className="custom-scroll-text text-gray-500"
          />
        </div>
      </BlurFade>
    </div>
  )
}

const testimonials = [
  {
    id: 1,
    content:
      "ArogyaMitra's AI assistant helped me understand my medication when I couldn't read the doctor's handwriting. The voice instructions in Hindi made it so easy to follow!",
    author: "Rajesh Kumar",
    role: "Patient, Uttar Pradesh",
    avatar: "/asojaK.jpg?height=80&width=80",
  },
  {
    id: 2,
    content:
      "As a doctor serving in rural Maharashtra, the clinical note automation has saved me hours each day. I can now see more patients and provide better care.",
    author: "Dr. Priya Sharma",
    role: "Physician, Maharashtra",
    avatar: "/911677.jpg?height=80&width=80",
  },
  {
    id: 3,
    content:
      "The mental health chatbot has been a lifeline for many in our community who were hesitant to seek help due to stigma. Being able to talk in Tamil makes it accessible to everyone.",
    author: "Anitha Rajan",
    role: "Community Health Worker, Tamil Nadu",
    avatar: "/axa.jpeg?height=80&width=80",
  },
  {
    id: 4,
    content:
      "The fact-checking tool has been instrumental in combating health misinformation in our village WhatsApp groups. It's saving lives by preventing harmful practices.",
    author: "Vikram Singh",
    role: "Village Council Head, Rajasthan",
    avatar: "/axa.jpeg?height=80&width=80",
  },
]

const TestimonialCarousel = () => {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const timeoutRef = useRef(null)

  const nextTestimonial = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (autoplay) {
      timeoutRef.current = setTimeout(nextTestimonial, 5000)
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [current, autoplay])

  const handleMouseEnter = () => setAutoplay(false)
  const handleMouseLeave = () => setAutoplay(true)

  return (
    <div
      className="py-20 px-4 relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          style={{ filter: "blur(80px)" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-fuchsia-200/10 to-blue-500/10"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          style={{ filter: "blur(80px)" }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-fuchsia-200 to-blue-500">
              <GradientText>What People Are Saying</GradientText>
            </span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Real stories from people whose lives have been impacted by ArogyaMitra
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Large quote icon */}
          <motion.div
            className="absolute -top-10 -left-10 text-orange-500/20 z-0"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Quote size={120} />
          </motion.div>

          {/* Testimonial cards */}
          <div className="relative h-[400px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-orange-500/20 rounded-2xl p-8 md:p-12 shadow-xl">
                  <p className="text-gray-500 text-lg md:text-xl italic mb-8 relative z-10">
                    "{testimonials[current].content}"
                  </p>

                  <div className="flex items-center">
                    <div className="mr-4">
                      <img
                        src={testimonials[current].avatar || "/placeholder.svg"}
                        alt={testimonials[current].author}
                        className="w-16 h-16 rounded-full border-2 border-orange-500"
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to red 500">
                        {testimonials[current].author}
                      </h4>
                      <p className="text-gray-500/70">{testimonials[current].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation controls */}
          <div className="flex justify-center mt-8 gap-4">
            <motion.button
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-3 h-3 rounded-full ${current === index ? "bg-orange-500" : "bg-orange-500/30"}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
const StatCard2 = ({ icon, value, label, delay, suffix = "" }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = Number.parseInt(value.toString().replace(/,/g, ""))
      const duration = 2000
      const increment = end / (duration / 16) // 60fps

      const timer = setInterval(() => {
        start += increment
        if (start > end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className="relative p-6 rounded-xl backdrop-blur-lg border border-orange-500/20 bg-gradient-to-br from-white/5 to-white/10 overflow-hidden group"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-300/10 to-orange-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Icon */}
      <motion.div
        className="mb-4 text-orange-400 bg-orange-500/10 p-3 rounded-lg inline-block"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>

      {/* Counter */}
      <h3 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-fuchsia-500 to-blue-500">
        {formatNumber(count)}
        {suffix}
      </h3>

      {/* Label */}
      <p className="text-gray-500 text-lg">{label}</p>

      {/* Decorative corner element */}
      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-orange-300/20 to-orange-300/20 rounded-full blur-xl"></div>
    </motion.div>
  )
}





// Call to Action Section Component
const CTASection = () => {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section className="py-20 bg-orange-50 animate-fade-in">
      <div className="container mx-auto px-4">
        <BlurFade delay={0.3} inView>
          <div className="bg-white rounded-3xl p-12 shadow-xl max-w-5xl mx-auto relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-orange-300 via-orange-200 to-orange-300 opacity-50 rounded-l-full"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <GradientText>{t.cta.heading}</GradientText>
                </h2>
                <p className="text-xl text-gray-600 mb-6">{t.cta.description}</p>
                <div className="flex flex-wrap gap-4">
                  <Button className="px-8 py-3 bg-gradient-to-r from-orange-500 via-fuchsia-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all duration-300">
                    <Link href="/dashboard">{t.cta.getStarted}</Link>
                  </Button>
                  <Button variant="outline" className="px-8 py-3 border-2 rounded-full">
                    <Link href="#contact">{t.cta.contactUs}</Link>
                  </Button>
                </div>
              </div>

              <div className="w-full md:w-1/3 flex justify-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 5,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src="Arogyalogo.png"
                    alt="Healthcare illustration"
                    className="w-60 h-60"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </BlurFade>
        <BlurFade delay={1.2} inView>
      </BlurFade>
      </div>
    </section>
  )
}

// const items = [
//   {
//   image: '/e5385861-45f3-4b25-a1fc-7281293dc5df.png?grayscale',
//   link: 'http://localhost:3000/dashboard',
//   title: '',
//   description: 'Want to grow your business?'
//   },
//   {
//   image: '/mll.jpg?grayscale',
//   link: 'http://localhost:3000/dashboard',
//   title: '',
//   description: 'Start your journey with us today'
//   },
//   {
//   image: '/e5385861-45f3-4b25-a1fc-7281293dc5df.png?height=400&width=400?grayscale',
//   link: 'http://localhost:3000/dashboard',
//   title: '',
//   description: 'Your company needs BlueBox AI'
//   },
//   {
//   image: '/Sales-and-Marketing-Sales.png?grayscale',
//   link: 'http://localhost:3000/dashboard',
//   title: '',
//   description: 'Want to Boost your business?'
//   }
//   ];

 

// Footer Component
const Footer = () => {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <footer id="contact" className="py-10 bg-orange-50 animate-fade-in border-t border-gray-100 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="Arogyalogo.png" alt="logo" width={40} height={35} />
              <GradientText className="text-2xl font-semibold">ArogyaMitra</GradientText>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">{t.footer.description}</p>
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} ArogyaMitra. {t.footer.rights}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-500 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-600 hover:text-blue-500 transition-colors">
                  {t.nav.features}
                </Link>
              </li>
              <li>
                <Link href="#video-section" className="text-gray-600 hover:text-blue-500 transition-colors">
                  {t.nav.demo}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-600 hover:text-blue-500 transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                aravsaxena884@gmail.com
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +91 96534 13126
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Pune, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">{t.footer.designedWith}</p>

          <div className="flex gap-4">
            {/* GitHub */}
            <a
              href="https://github.com/arav7781"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 
      0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 
      1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.3-5.467-1.334-5.467-5.933 
      0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.51 11.51 0 0 1 3-.404c1.02.005 
      2.045.138 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 
      1.235 3.22 0 4.61-2.807 5.63-5.48 5.922.43.37.823 1.102.823 2.222 
      0 1.606-.015 2.896-.015 3.286 0 .32.218.694.825.576C20.565 21.795 
      24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.instagram.com/arav_6555"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 
                  2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 
                  5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 
                  1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}

// Main LandingPage Component
const LandingPage = () => {
  return (
    <LanguageProvider>
      <div className="bg-orange-50 animate-fade-in min-h-screen ">

        <Header />
      

        <HeroSection/>
     


    
        <div>
          <InteractiveChatbotPreview/>
        </div>

     
    
 
        <div>
      <TestimonialCarousel/>
    </div>

    
  
        {/* Call to Action */}
        <CTASection />
        <hr className="my-10" />
        {/* Footer */}
        <Footer />
     
      </div>
    </LanguageProvider>
  )
}

export default LandingPage
