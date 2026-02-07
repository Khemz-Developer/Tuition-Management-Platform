import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
import ClassesSection from './ClassesSection'
import ScheduleSection from './ScheduleSection'
import TestimonialsSection from './TestimonialsSection'
import FAQSection from './FAQSection'
import ContactSection from './ContactSection'
import AIChatWidget from './AIChatWidget'

interface PageSection {
  type: 'hero' | 'about' | 'classes' | 'schedule' | 'testimonials' | 'faq' | 'contact'
  props?: Record<string, unknown>
  enabled?: boolean
}

interface PageConfig {
  title: string
  sections: PageSection[]
  showChatWidget?: boolean
}

interface PageRendererProps {
  config: PageConfig
}

const sectionComponents = {
  hero: HeroSection,
  about: AboutSection,
  classes: ClassesSection,
  schedule: ScheduleSection,
  testimonials: TestimonialsSection,
  faq: FAQSection,
  contact: ContactSection,
}

export default function PageRenderer({ config }: PageRendererProps) {
  const { sections, showChatWidget = true } = config

  return (
    <div className="min-h-screen">
      {sections
        .filter((section) => section.enabled !== false)
        .map((section, index) => {
          const Component = sectionComponents[section.type]
          if (!Component) return null
          return <Component key={`${section.type}-${index}`} {...(section.props || {})} />
        })}
      
      {showChatWidget && <AIChatWidget />}
    </div>
  )
}

// Example page configurations
export const defaultHomePage: PageConfig = {
  title: 'Home',
  sections: [
    { type: 'hero', enabled: true },
    { type: 'about', enabled: true },
    { type: 'classes', enabled: true },
    { type: 'schedule', enabled: true },
    { type: 'testimonials', enabled: true },
    { type: 'faq', enabled: true },
    { type: 'contact', enabled: true },
  ],
  showChatWidget: true,
}

export const classesPage: PageConfig = {
  title: 'Classes',
  sections: [
    { 
      type: 'hero', 
      enabled: true,
      props: {
        title: 'Our Classes',
        subtitle: 'Explore our comprehensive range of courses designed for academic excellence',
        ctaText: 'Browse All Classes',
        ctaLink: '/student/classes',
      },
    },
    { type: 'classes', enabled: true },
    { type: 'schedule', enabled: true },
    { type: 'faq', enabled: true },
    { type: 'contact', enabled: true },
  ],
  showChatWidget: true,
}

export const aboutPage: PageConfig = {
  title: 'About',
  sections: [
    { 
      type: 'hero', 
      enabled: true,
      props: {
        title: 'About Us',
        subtitle: 'Learn about our mission to provide quality education and empower students',
      },
    },
    { type: 'about', enabled: true },
    { type: 'testimonials', enabled: true },
    { type: 'contact', enabled: true },
  ],
  showChatWidget: true,
}

export const contactPage: PageConfig = {
  title: 'Contact',
  sections: [
    { 
      type: 'hero', 
      enabled: true,
      props: {
        title: 'Contact Us',
        subtitle: 'Get in touch with us for any inquiries or to schedule a demo class',
      },
    },
    { type: 'contact', enabled: true },
    { type: 'faq', enabled: true },
  ],
  showChatWidget: true,
}
