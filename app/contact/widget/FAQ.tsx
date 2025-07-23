'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown, HelpCircle, Search, MessageCircle } from 'lucide-react'
import Button from '@/components/Button'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { cn } from '@/lib/utils'

/**
 * FAQ component with searchable and expandable questions
 * Provides quick answers to common customer inquiries
 */
export default function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState<number[]>([0]) // First item expanded by default

  const faqData = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'How long does shipping take?',
          answer: 'We offer free standard shipping (5-7 business days) on orders over $75. Express shipping (2-3 business days) is available for $15, and overnight shipping for $25. International shipping times vary by location.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account on our website or clicking the tracking link in your shipping confirmation email.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'We currently ship to the US, Canada, and select European countries. International shipping costs are calculated at checkout based on your location and order weight. Please note that customs fees may apply.'
        }
      ]
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for unused items in original packaging. Custom or personalized items cannot be returned unless defective. Return shipping is free for exchanges, or $10 for refunds.'
        },
        {
          question: 'How do I start a return?',
          answer: 'Log into your account and go to "Order History" to initiate a return. You can also contact our customer service team. We\'ll provide a prepaid return label and instructions for packaging your items.'
        },
        {
          question: 'When will I receive my refund?',
          answer: 'Refunds are processed within 3-5 business days after we receive your returned items. The refund will appear on your original payment method within 5-10 business days, depending on your bank or credit card company.'
        }
      ]
    },
    {
      category: 'Products & Care',
      questions: [
        {
          question: 'Are your products eco-friendly?',
          answer: 'Yes! We\'re committed to sustainability. Our products are made from responsibly sourced materials, and we use minimal, recyclable packaging. Many items are handcrafted by local artisans using traditional, environmentally-friendly methods.'
        },
        {
          question: 'How do I care for my items?',
          answer: 'Each product comes with specific care instructions. Generally, dust regularly with a soft cloth, avoid direct sunlight for fabric items, and use coasters for wooden surfaces. For detailed care guides, check the product page or included documentation.'
        },
        {
          question: 'Do you offer custom orders?',
          answer: 'Yes! We love creating custom pieces. Contact us with your ideas, dimensions, and timeline. Custom orders typically take 4-8 weeks and require a 50% deposit. Pricing varies based on materials and complexity.'
        }
      ]
    },
    {
      category: 'Store & Services',
      questions: [
        {
          question: 'Can I visit your physical store?',
          answer: 'Absolutely! Our showroom is located at 123 Design Street in New York. We\'re open Monday-Saturday 10AM-8PM and Sunday 12PM-6PM. No appointment needed, but we recommend booking a consultation for personalized service.'
        },
        {
          question: 'Do you offer design consultations?',
          answer: 'Yes! Our design experts offer free 30-minute consultations in-store or virtual sessions. We can help with space planning, color coordination, and product selection. Book through our website or call us directly.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Klarna for buy-now-pay-later options. For custom orders, we also accept bank transfers.'
        }
      ]
    }
  ]

  // Flatten all questions for searching
  const allQuestions = faqData.flatMap((category, categoryIndex) =>
    category.questions.map((q, questionIndex) => ({
      ...q,
      categoryIndex,
      questionIndex,
      category: category.category,
      id: categoryIndex * 100 + questionIndex
    }))
  )

  // Filter questions based on search term
  const filteredQuestions = searchTerm
    ? allQuestions.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allQuestions

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <HelpCircle className="w-4 h-4" />
              Frequently Asked Questions
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Can We Help?
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Find quick answers to common questions. Can't find what you're looking for? 
              Our support team is here to help!
            </p>
            
            {/* Search Bar */}
            <motion.div
              variants={itemVariants}
              className="relative max-w-md mx-auto"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </motion.div>
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            variants={containerVariants}
            className="space-y-4"
          >
            <AnimatePresence mode="wait">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((item) => {
                  const isExpanded = expandedItems.includes(item.id)
                  
                  return (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="shadow-md hover:shadow-lg transition-all duration-300">
                        <button
                          onClick={() => toggleExpanded(item.id)}
                          className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
                        >
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="flex-1">
                              {searchTerm && (
                                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mb-2">
                                  {item.category}
                                </span>
                              )}
                              <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                {item.question}
                              </h3>
                            </div>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex-shrink-0"
                            >
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            </motion.div>
                          </CardHeader>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.4, 0, 0.6, 1] }}
                              className="overflow-hidden"
                            >
                              <CardContent className="pt-0">
                                <div className="border-t border-gray-100 pt-4">
                                  <p className="text-gray-600 leading-relaxed">
                                    {item.answer}
                                  </p>
                                </div>
                              </CardContent>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  )
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any questions matching "{searchTerm}"
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Still Have Questions?
                </h3>
                
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Our friendly support team is here to help. Get in touch and we'll 
                  respond as quickly as possible.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contact Support
                  </Button>
                  
                  <Button size="lg" variant="outline">
                    Schedule Call
                  </Button>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Usually responds in 1 hour</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span>Available 7 days a week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}