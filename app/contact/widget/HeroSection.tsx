"use client";

import { Card, CardContent } from "@/components/Card";
import { motion, useInView } from "framer-motion";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

/**
 * Hero section for the Contact page
 * Features engaging visuals and quick contact information
 */
export default function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const quickContactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      info: "+447575847048",
      subInfo: "Mon-Fri 9AM-6PM GMT",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Email Us",
      info: "hello@physicalstore.co.uk",
      subInfo: "We reply within 24hrs",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Store",
      info: "27 Old Gloucester Street",
      subInfo: "LONDON, WC1N 3AX United Kingdom",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Store Hours",
      info: "Mon-Sat 10AM-8PM",
      subInfo: "Sunday 12PM-6PM",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop&q=80"
          alt="Modern office space"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Decorative circles */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView ? { opacity: 0.1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-20 right-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView ? { opacity: 0.1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{ duration: 2, delay: 0.8 }}
          className="absolute bottom-20 left-20 w-48 h-48 bg-purple-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-white"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <MessageCircle className="w-4 h-4" />
              Get in Touch
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Let's Start a
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Conversation
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-200 mb-8 leading-relaxed max-w-lg"
            >
              We're here to help with questions, custom orders, or just to chat
              about design. Reach out and let's create something amazing
              together.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  Usually responds in 1 hour
                </span>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  Free consultation available
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Contact Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {quickContactInfo.map((contact, index) => (
              <motion.div
                key={contact.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 group-hover:shadow-lg transition-all duration-300"
                    >
                      {contact.icon}
                    </motion.div>

                    <h3 className="text-lg font-semibold text-white mb-2">
                      {contact.title}
                    </h3>

                    <p className="text-white/90 font-medium mb-1">
                      {contact.info}
                    </p>

                    <p className="text-white/70 text-sm">{contact.subInfo}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
