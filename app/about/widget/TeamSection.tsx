'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
// Social media imports removed
import { Card, CardContent } from '@/components/Card'

interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
}

const teamMembers: TeamMember[] = [
  {
    name: 'Sarah Chen',
    role: 'Founder & CEO',
    bio: 'Passionate about connecting people with beautiful, functional design. 10+ years in retail and product curation.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Head of Product',
    bio: 'Expert in product development and supplier relationships. Ensures every item meets our quality standards.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80'
  },
  {
    name: 'Emily Watson',
    role: 'Creative Director',
    bio: 'Brings visual stories to life through design and photography. Creates the aesthetic that defines our brand.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80'
  },
  {
    name: 'David Kim',
    role: 'Technology Lead',
    bio: 'Builds the digital experiences that make shopping seamless. Full-stack developer with a passion for UX.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80'
  },
  {
    name: 'Lisa Thompson',
    role: 'Customer Experience',
    bio: 'Ensures every customer interaction is exceptional. Leads our support team with empathy and expertise.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80'
  },
  {
    name: 'Alex Johnson',
    role: 'Sustainability Officer',
    bio: 'Champions our environmental initiatives and partners with eco-conscious brands to build a sustainable future.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80'
  }
]

/**
 * Team section showcasing company members with social links
 * Features animated cards with hover effects and professional profiles
 */
export default function TeamSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The passionate individuals behind Physical Store. Each bringing unique expertise 
            and shared commitment to exceptional customer experiences.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard 
              key={member.name} 
              member={member} 
              index={index} 
              isInView={isInView}
            />
          ))}
        </div>

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Join Our Growing Team
              </h3>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                We're always looking for talented individuals who share our passion for 
                quality, sustainability, and exceptional customer experiences.
              </p>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Open Positions
              </motion.a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Individual team member card component
 */
function TeamMemberCard({ 
  member, 
  index, 
  isInView 
}: { 
  member: TeamMember
  index: number
  isInView: boolean 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Social links overlay removed */}
        </div>
        
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {member.name}
          </h3>
          <p className="text-blue-600 font-medium mb-3">
            {member.role}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {member.bio}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}