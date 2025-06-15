"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const pricingTiers = [
    {
      name: "Starter",
      subtitle: "Perfect for Small Clinics",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      monthlyPrice: 299,
      annualPrice: 2390,
      popular: false,
      description: "Essential AI-powered patient engagement for growing practices",
      features: [
        "Up to 500 patient conversations/month",
        "WhatsApp virtual assistant",
        "Basic appointment booking",
        "Patient triage & health queries",
        "2 language support",
        "Standard EMR integration",
        "Email support",
        "Basic analytics dashboard",
        "Docker deployment guide",
      ],
      cta: "Start Free Trial",
      ctaType: "secondary",
    },
    {
      name: "Growth",
      subtitle: "Ideal for Mid-sized Hospitals",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      monthlyPrice: 1299,
      annualPrice: 10392,
      popular: true,
      description: "Comprehensive patient engagement with advanced features",
      features: [
        "Up to 2,500 patient conversations/month",
        "WhatsApp + Web voice agents",
        "Advanced appointment management",
        "Complete patient triage system",
        "Insurance assistance automation",
        "Follow-up care reminders",
        "5 language support",
        "Priority EMR integration",
        "Phone & chat support",
        "Advanced analytics & reporting",
        "API documentation & training",
        "Custom workflow setup",
      ],
      cta: "Schedule Demo",
      ctaType: "primary",
    },
    {
      name: "Enterprise",
      subtitle: "Built for Large Hospital Chains",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      monthlyPrice: null,
      annualPrice: null,
      popular: false,
      description: "Full-scale AI automation with enterprise-grade security",
      features: [
        "Unlimited patient conversations",
        "Multi-channel AI assistants",
        "Complete automation suite",
        "Advanced patient analytics",
        "Custom EMR integrations",
        "Unlimited language support",
        "Dedicated account manager",
        "24/7 priority support",
        "Custom API development",
        "Advanced security & compliance",
        "Multi-location deployment",
        "Staff training & onboarding",
        "SLA guarantees",
      ],
      cta: "Contact Sales",
      ctaType: "secondary",
    },
  ]

  const addOns = [
    {
      name: "Voice Bot Analytics",
      price: 199,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      description: "Advanced voice interaction analytics and conversation insights",
    },
    {
      name: "Custom EMR Integration",
      price: 499,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      description: "Tailored integration with your existing EMR system",
    },
    {
      name: "Multilingual Expansion",
      price: 99,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      description: "Add support for additional languages (per language)",
    },
    {
      name: "Priority Support",
      price: 299,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      description: "24/7 dedicated support with guaranteed response times",
    },
  ]

  // Check icon component
  const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )

  return (
    <div ref={containerRef} className="relative py-16 px-4 md:px-8 bg-orange-50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pricing-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M30 0C30 16.5685 16.5685 30 0 30C16.5685 30 30 46.5685 30 60C30 46.5685 46.5685 30 60 30C46.5685 30 30 16.5685 30 0Z"
              fill="currentColor"
              className="text-orange-900"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#pricing-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-orange-900 mb-4">Choose Your ArogyaMitra Plan</h2>
          <p className="text-orange-700 max-w-3xl mx-auto mb-8">
            Transform your patient engagement with AI-powered WhatsApp and voice assistants. Automate appointments,
            triage, and follow-ups while integrating seamlessly with your existing systems.
          </p>

          {/* Billing Toggle */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={`text-sm font-medium ${!isAnnual ? "text-orange-900" : "text-orange-600"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                isAnnual ? "bg-orange-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-orange-900" : "text-orange-600"}`}>Annual</span>
            {isAnnual && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Save 20%
              </span>
            )}
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate={controls}
        >
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                tier.popular ? "ring-2 ring-orange-500 scale-105" : ""
              }`}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  },
                },
              }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className={`p-8 ${tier.popular ? "pt-12" : ""}`}>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 text-orange-600">
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-orange-700 text-sm mb-4">{tier.subtitle}</p>
                  <p className="text-gray-600 text-sm">{tier.description}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  {tier.monthlyPrice ? (
                    <>
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        ${isAnnual ? Math.round(tier.annualPrice / 12) : tier.monthlyPrice}
                        <span className="text-lg font-normal text-gray-600">/month</span>
                      </div>
                      {isAnnual && (
                        <p className="text-sm text-green-600 font-medium">Billed annually (${tier.annualPrice}/year)</p>
                      )}
                    </>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900 mb-2">Custom Pricing</div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    tier.ctaType === "primary"
                      ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add-ons Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Optional Add-Ons</h3>
            <p className="text-gray-600">Enhance your ArogyaMitra experience with these additional features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <motion.div
                key={addon.name}
                className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 hover:shadow-md transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <div className="text-orange-600 mb-3">{addon.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{addon.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
                <div className="text-lg font-bold text-orange-600">
                  ${addon.price}
                  <span className="text-sm font-normal text-gray-600">/month</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-600 mb-4">
            Need a custom solution? Our team can help design the perfect plan for your organization.
          </p>
          <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200">
            Schedule Consultation
          </button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="flex justify-center items-center gap-8 mt-12 opacity-60"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.6 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            HIPAA Compliant
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4V7a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v4a2 2 0 002 2h4a2 2 0 002-2v-4"
              />
            </svg>
            30-Day Free Trial
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            24/7 Support
          </div>
        </motion.div>
      </div>
    </div>
  )
}
