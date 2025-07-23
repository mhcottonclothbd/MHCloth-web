'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Twitter,
  ExternalLink,
  Calendar,
  Users,
  Award
} from 'lucide-react'
import Button from '@/components/Button'
import { Card, CardContent, CardHeader } from '@/components/Card'

/**
 * Contact information component
 * Displays store details, hours, and social media links
 */
export default function ContactInfo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const contactDetails = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visit Our Store',
      primary: 'Physical Store Ltd',
      secondary: 'London, United Kingdom',
      action: {
        label: 'Get Directions',
        href: 'https://maps.google.com/?q=London+United+Kingdom',
        external: true
      }
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      primary: '+44 (0) 20 1234 5678',
      secondary: 'Mon-Fri 9AM-6PM GMT',
      action: {
        label: 'Call Now',
        href: 'tel:+442012345678',
        external: false
      }
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      primary: 'hello@physicalstore.co.uk',
      secondary: 'We reply within 24 hours',
      action: {
        label: 'Send Email',
        href: 'mailto:hello@physicalstore.co.uk',
        external: false
      }
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Live Chat',
      primary: 'Chat with our team',
      secondary: 'Available during business hours',
      action: {
        label: 'Start Chat',
        href: '#',
        external: false
      }
    }
  ]

  const storeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 5:00 PM' },
    { day: 'Sunday', hours: '11:00 AM - 4:00 PM' }
  ]

  const socialLinks = [
    {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      href: 'https://instagram.com/physicalstoreuk',
      color: 'from-pink-500 to-purple-600'
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      href: 'https://facebook.com/physicalstoreuk',
      color: 'from-blue-600 to-blue-700'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      href: 'https://twitter.com/physicalstoreuk',
      color: 'from-sky-400 to-sky-600'
    }
  ]

  const quickStats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: '10K+',
      label: 'Happy Customers'
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: '5 Years',
      label: 'In Business'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      value: '< 24hrs',
      label: 'Response Time'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
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
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="space-y-8"
    >
      {/* Contact Methods */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-xl">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get in Touch
            </h2>
            <p className="text-gray-600">
              Choose the best way to reach us. We're here to help!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {contactDetails.map((contact, index) => (
              <motion.div
                key={contact.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    {contact.icon}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {contact.title}
                  </h3>
                  <p className="text-gray-900 font-medium">
                    {contact.primary}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {contact.secondary}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <Link 
                    href={contact.action.href}
                    {...(contact.action.external && {
                      target: '_blank',
                      rel: 'noopener noreferrer'
                    })}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      {contact.action.label}
                      {contact.action.external && <ExternalLink className="w-4 h-4 ml-1" />}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Store Hours */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Store Hours
                </h3>
                <p className="text-gray-600 text-sm">
                  Visit us during these hours
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {storeHours.map((schedule, index) => (
                <motion.div
                  key={schedule.day}
                  variants={itemVariants}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="font-medium text-gray-900">
                    {schedule.day}
                  </span>
                  <span className="text-gray-600">
                    {schedule.hours}
                  </span>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              variants={itemVariants}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium text-sm">
                  Currently Open - Closes at 6:00 PM
                </span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Social Media */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg">
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Follow Us
            </h3>
            <p className="text-gray-600">
              Stay connected for updates, inspiration, and exclusive offers
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${social.color} text-white rounded-full hover:shadow-lg transition-all duration-300`}
                  >
                    {social.icon}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              variants={itemVariants}
              className="mt-6 p-4 bg-gray-50 rounded-lg"
            >
              <p className="text-sm text-gray-600 mb-2">
                <strong>Pro Tip:</strong> Follow us on Instagram for daily design inspiration 
                and behind-the-scenes content!
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>We post new content every Tuesday and Friday</span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}