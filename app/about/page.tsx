import { Metadata } from 'next'
import HeroSection from './widget/HeroSection'
import StorySection from './widget/StorySection'
import ValuesSection from './widget/ValuesSection'
import TeamSection from './widget/TeamSection'
import StatsSection from './widget/StatsSection'

export const metadata: Metadata = {
  title: 'About Us - Physical Store | Our Story & Values',
  description: 'Learn about our journey, values, and the passionate team behind Physical Store. Discover what drives us to curate exceptional products for our customers.',
  keywords: 'about us, company story, team, values, mission, physical store',
}

/**
 * About page showcasing company story, values, and team
 * Features multiple sections with smooth animations and engaging content
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Company Story */}
      <StorySection />
      
      {/* Statistics */}
      <StatsSection />
      
      {/* Values & Mission */}
      <ValuesSection />
      
      {/* Team Section */}
      <TeamSection />
    </div>
  )
}