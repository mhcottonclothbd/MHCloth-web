'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react'
import Button from '@/components/Button'
import { Card, CardContent } from '@/components/Card'
import { cn } from '@/lib/utils'

/**
 * Instagram feed component for social media integration
 * Displays recent posts and encourages user engagement
 */
export default function InstagramFeed() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Mock Instagram posts data
  const instagramPosts = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80',
      likes: 234,
      comments: 12,
      caption: 'Minimalist workspace essentials ✨ #minimalism #workspace',
      url: 'https://instagram.com/p/example1'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
      likes: 189,
      comments: 8,
      caption: 'Perfect lighting for your home office 💡 #homedecor #lighting',
      url: 'https://instagram.com/p/example2'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80',
      likes: 156,
      comments: 15,
      caption: 'Handcrafted ceramics that tell a story 🏺 #ceramics #handmade',
      url: 'https://instagram.com/p/example3'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80',
      likes: 298,
      comments: 22,
      caption: 'Cozy living room vibes 🛋️ #interiordesign #cozy',
      url: 'https://instagram.com/p/example4'
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1493663284031-b7e3aaa4c4bc?w=400&h=400&fit=crop&q=80',
      likes: 167,
      comments: 9,
      caption: 'Natural textures and warm tones 🌿 #natural #textures',
      url: 'https://instagram.com/p/example5'
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop&q=80',
      likes: 203,
      comments: 18,
      caption: 'Kitchen essentials for the modern home 👨‍🍳 #kitchen #modern',
      url: 'https://instagram.com/p/example6'
    }
  ]

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
    hidden: { opacity: 0, y: 30 },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6"
          >
            <Instagram className="w-5 h-5" />
            Follow Us on Instagram
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Get Inspired by Our
            <br />
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Community
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            See how our customers style their spaces and share your own creations 
            with <span className="font-semibold text-pink-600">#YourStoreName</span>
          </motion.p>
        </motion.div>

        {/* Instagram Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
        >
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="group relative aspect-square cursor-pointer"
            >
              <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative h-full">
                  <Image
                    src={post.image}
                    alt={`Instagram post ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 mx-auto" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-6">
              <Instagram className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Share Your Style
            </h3>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Tag us in your photos for a chance to be featured! We love seeing how 
              you incorporate our pieces into your unique spaces.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="https://instagram.com/yourstorename" target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  Follow @YourStoreName
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">Use hashtag:</span>
                <code className="bg-gray-100 px-3 py-1 rounded-full text-sm font-mono text-pink-600">
                  #YourStoreName
                </code>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}