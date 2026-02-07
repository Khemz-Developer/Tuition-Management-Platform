import { Card, CardContent } from '@/shared/components/ui/card'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { Users, Award, Clock, Target } from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface AboutSectionProps {
  teacherName?: string
  teacherBio?: string
  experience?: string
  achievements?: string[]
}

export default function AboutSection({
  teacherName = 'John Smith',
  teacherBio = 'With over 10 years of teaching experience, I am passionate about making complex subjects accessible and engaging for all students. My approach focuses on building strong foundations and developing critical thinking skills.',
  experience = '10+ years',
  achievements = ['500+ Students Taught', 'M.Sc Mathematics', 'CTET Certified'],
}: AboutSectionProps) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Your Teacher</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get to know the expert who will guide your learning journey
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Teacher info */}
            <div className="flex flex-col items-center lg:items-start">
              <Avatar className="h-40 w-40 mb-6">
                <AvatarFallback className="text-4xl">
                  {getInitials(teacherName)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold mb-2">{teacherName}</h3>
              <p className="text-muted-foreground text-center lg:text-left mb-4">
                {teacherBio}
              </p>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {achievement}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <h4 className="font-semibold mb-2">Personalized Attention</h4>
                  <p className="text-sm text-muted-foreground">
                    Small batch sizes ensure every student gets individual focus
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Award className="h-10 w-10 text-primary mb-4" />
                  <h4 className="font-semibold mb-2">Proven Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Track record of students excelling in exams
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Clock className="h-10 w-10 text-primary mb-4" />
                  <h4 className="font-semibold mb-2">Flexible Schedule</h4>
                  <p className="text-sm text-muted-foreground">
                    Multiple batch timings to suit your convenience
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Target className="h-10 w-10 text-primary mb-4" />
                  <h4 className="font-semibold mb-2">Goal Oriented</h4>
                  <p className="text-sm text-muted-foreground">
                    Structured curriculum aligned with exam patterns
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
