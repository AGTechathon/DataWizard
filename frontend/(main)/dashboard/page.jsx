"use client"

import { useState, useEffect } from "react"
import FeaturesAssistants from "./_components/FeaturesAssistants"
import History from "./_components/History"
import Feedback from "./_components/Feedback"
import ProductDescription from "./_components/ProductDescription"
import DeveloperInfo from "./_components/DeveloperInfo"
import { BlurFade } from "@/components/magicui/blur-fade"
import IndiaGradient from "@/components/ui/IndiaGradient"
import Link from "next/link"
import AppHeader from "../_components/AppHeader"
import { ArrowRight, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import GradientText from "@/components/ui/GradientText"
import { motion } from "framer-motion"
import Threads from "@/components/ui/wave"
import WebFaetues from "./_components/WebFaetues"
import CircularGallery from "@/components/ui/gallery"
import { Vortex } from "@/components/ui/vortex"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import Image from "next/image"
import { TextComponent } from "./_components/fea"
import { cn } from "@/lib/utils";
import MeetOur from "./_components/DeveloperInfo"

// Health quotes list
const businessQuotes = [
  "The greatest wealth is health. — Virgil",
  "Health is a state of complete harmony of the body, mind, and spirit. — B.K.S. Iyengar",
  "Take care of your body. It's the only place you have to live. — Jim Rohn",
  "Health is not valued until sickness comes. — Thomas Fuller",
  "The first wealth is health. — Ralph Waldo Emerson",
  "A healthy outside starts from the inside. — Robert Urich",
  "Health is a relationship between you and your body. — Terri Guillemets",
  "Your body hears everything your mind says. — Naomi Judd",
  "Good health is not something we can buy. However, it can be an extremely valuable savings account. — Anne Wilson Schaef",
  "Health is like money, we never have a true idea of its value until we lose it. — Josh Billings",
  "The human body is the best picture of the human soul. — Ludwig Wittgenstein",
  "Happiness is nothing more than good health and a bad memory. — Albert Schweitzer",
  "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear. — Buddha",
  "A good laugh and a long sleep are the best cures in the doctor's book. — Irish Proverb",
  "Let food be thy medicine and medicine be thy food. — Hippocrates",
  "The doctor of the future will no longer treat the human frame with drugs, but rather will cure and prevent disease with nutrition. — Thomas Edison",
  "Walking is man's best medicine. — Hippocrates",
  "Sleep is that golden chain that ties health and our bodies together. — Thomas Dekker",
  "Early to bed and early to rise makes a man healthy, wealthy, and wise. — Benjamin Franklin",
  "The groundwork for all happiness is good health. — Leigh Hunt",
  "Health and cheerfulness naturally beget each other. — Joseph Addison",
  "He who has health has hope, and he who has hope has everything. — Arabian Proverb",
  "It is health that is real wealth and not pieces of gold and silver. — Mahatma Gandhi",
  "The greatest of follies is to sacrifice health for any other kind of happiness. — Arthur Schopenhauer",
  "Healthy citizens are the greatest asset any country can have. — Winston Churchill",
  "Physical fitness is not only one of the most important keys to a healthy body, it is the basis of dynamic and creative intellectual activity. — John F. Kennedy",
  "The body is a sacred garment. — Martha Graham",
  "Health is a large word. It embraces not the body only, but the mind and spirit as well. — James H. West",
  "The mind and body are not separate. what affects one, affects the other. — Anonymous",
  "Nurturing yourself is not selfish – it's essential to your survival and your well-being. — Renee Peterson Trudeau",
  "Almost everything will work again if you unplug it for a few minutes, including you. — Anne Lamott",
  "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit. Then get back to work. — Ralph Marston",
  "Your health is what you make of it. Everything you do and think either adds to the vitality, energy, and spirit you possess or takes away from it. — Ann Wigmore",
  "The part can never be well unless the whole is well. — Plato",
  "Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship. — Buddha",
  "The secret of health for both mind and body is not to mourn for the past, worry about the future, or anticipate troubles, but to live in the present moment wisely and earnestly. — Buddha",
  "Keeping your body healthy is an expression of gratitude to the whole cosmos – the trees, the clouds, everything. — Thich Nhat Hanh",
  "If you don't take care of your body, where will you live? — Unknown",
  "Those who think they have no time for bodily exercise will sooner or later have to find time for illness. — Edward Stanley",
  "The best six doctors anywhere, and no one can deny it, are sunshine, water, rest, air, exercise, and diet. — Wayne Fields",
  "Health is a state of body. Wellness is a state of being. — J. Stanford",
  "The greatest miracle on Earth is the human body. It is stronger and wiser than you may realize, and improving its ability to heal is within your control. — Dr. Fabrizio Mancini",
  "Your body is a temple, but only if you treat it as one. — Astrid Alauda",
  "The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison. — Ann Wigmore",
  "Health is not simply the absence of sickness. — Hannah Green",
  "Wellness is the complete integration of body, mind, and spirit – the realization that everything we do, think, feel, and believe has an effect on our state of well-being. — Greg Anderson",
  "The higher your energy level, the more efficient your body. The more efficient your body, the better you feel and the more you will use your talent to produce outstanding results. — Tony Robbins",
  "A healthy attitude is contagious but don't wait to catch it from others. Be a carrier. — Tom Stoppard",
  "Wellness encompasses a healthy body, a sound mind, and a tranquil spirit. Enjoy the journey as you strive for wellness. — Laurette Gagnon Beaulieu",
  "The mind has great influence over the body, and maladies often have their origin there. — Moliere",
];

const footer = {
  description:
    "AI-powered medical assistant available 24/7 to address your health concerns and provide guidance with personalized insights.",
  rights: "All rights reserved.",
  quickLinks: "Quick Links",
  contact: "Contact",
  designedWith: "Designed with ❤️ by DataWizards",
}

const nav = {
  home: "Home",
  features: "Features",
  demo: "Demo",
  contact: "Contact",
}

const Footer = () => {
  return (
    <footer id="contact" className="py-10 bg-orange-50 w-full rounded-2xl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/f2881fdf-d2ac-41a3-8c0a-7e9c30219a74.png" alt="logo" width={40} height={35} />
              <GradientText className="text-2xl font-semibold">ArogyaMitra</GradientText>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">{footer.description}</p>
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} ArogyaMitra. {footer.rights}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {nav.features}
                </Link>
              </li>
              <li>
                <Link
                  href="#video-section"
                  className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {nav.demo}
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{footer.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                <Mail className="h-5 w-5" />
                github@7781
              </li>
              <li className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                <Phone className="h-5 w-5" />
                +91 96534 13126
              </li>
              <li className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                <MapPin className="h-5 w-5" />
                Pune, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">{footer.designedWith}</p>

          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-pink-500 transition-colors p-2 rounded-full hover:bg-pink-50"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-50"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
const HeroScrollDen = () => {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Medical Intelligence 
              </span>
            </h1>
          </>
        }
      >
        <Image
          src="/aaa.png"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

const data = [
  {
    title: "Easy to Use",
    content: "Our ArogyaMitra is built with simplicity in mind, so you can get easy access to your health data.",
    srcImage: "/a3.jpg",
  },
  {
    title: "Chatbot Assistance",
    content: "Our chatbots are designed to help you with your health needs.",
    srcImage: "/a4.png",
  },
  {
    title: "Voice-to-Voice",
    content: "Our voice-to-voice multilingual chatbots can help you with your health needs.",
    srcImage: "/a1.jpg",
  },
  {
    title: "Vision",
    content: "Our vision capabilities can help you with your health needs.",
    srcImage: "/a2.jpg",
  },
];

const FeatureFourImages = () => {
  const [featureOpen, setFeatureOpen] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 10);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer > 10000) {
      setFeatureOpen((prev) => (prev + 1) % data.length);
      setTimer(0);
    }
  }, [timer]);

  return (
    <div className="container">
      <div className="mb-20 text-center">
        <p className="mb-2 text-sm font-medium uppercase text-neutral-500">
          How does it work?
        </p>
        <h2 className="mb-4 text-3xl font-semibold tracking-tighter text-neutral-800 dark:text-neutral-300">
          <GradientText>How to use the ArogyaMitra for your health?</GradientText>
        </h2>
      </div>

      {/* On mobile, use flex-col to stack; on md+, use grid-cols-2 */}
      <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-4 ">
        <div className="space-y-6">
          {data.map((item, index) => (
            <button
              className="w-full"
              key={item.title}
              onClick={() => {
                setFeatureOpen(index);
                setTimer(0);
              }}
              type="button"
            >
              <TextComponent
                content={item.content}
                isOpen={featureOpen === index}
                loadingWidthPercent={featureOpen === index ? timer / 100 : 0}
                number={index + 1}
                title={item.title}
              />
            </button>
          ))}
        </div>

        <div className="h-full mb-6 md:mb-0">
          <div
            className={cn(
              "relative h-96 w-full overflow-hidden rounded-lg md:h-[500px]"
            )}
          >
            {data.map((item, index) => (
              <img
                alt={item.title}
                className={cn(
                  "absolute h-[500px] w-full transform-gpu rounded-lg object-cover transition-all duration-300",
                  featureOpen === index ? "scale-100" : "scale-70",
                  featureOpen > index ? "translate-y-full" : ""
                )}
                key={item.title}
                src={item.srcImage}
                style={{ zIndex: data.length - index }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function DashBoard() {
  const [quote, setQuote] = useState("")

  // Get a random quote when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * businessQuotes.length)
    setQuote(businessQuotes[randomIndex])
  }, [])

  return (
    <div className="min-h-screen w-full bg-orange-50">
      <AppHeader />

      {/* Main Content Container */}
      <div className="mt-1 pt-7 w-full max-w-[1800px] mx-auto space-y-8 px-4 sm:px-6 lg:px-8 pb-12">

        {/* Health Quote Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-transparent backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 overflow-hidden"
        >
          <Vortex>
            <div className="rounded-2xl overflow-hidden w-full">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full">
                <div className="bg-white/80 rounded-full p-3 shadow-md">
                  <Quote className="h-6 w-6 text-[#2AC9AF]" />
                </div>
                <p className="text-gray-300 italic font-medium text-sm sm:text-base flex-1 min-w-0">
                  {quote}
                </p>
              </div>
            </div>
          </Vortex>
        </motion.div>

        <BlurFade delay={0.3} inView>

       
        {/* Features Section */}
          {/* Features Section */}
          <div className="bg-orange-50 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 rounded-lg">
            <div className="relative">
              <FeaturesAssistants />
            </div>
    

     
        </div>

        </BlurFade>
        <BlurFade delay={0.4} inView>
          <div className="bg-orange-50 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 rounded-lg">
            <div className="relative">
              <MeetOur />
            </div>
          </div>
        </BlurFade>


        {/* Footer Section */}
        <BlurFade delay={0.5} inView>
          <div className="bg-orange-50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-100">
            <Footer />
          </div>
        </BlurFade>
      </div>
    </div>
  )
}

export default DashBoard
