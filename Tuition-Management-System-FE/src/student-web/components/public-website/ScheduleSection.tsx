import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Clock, Calendar } from 'lucide-react'

interface ScheduleItem {
  day: string
  batches: {
    time: string
    className: string
    grade: string
    availableSlots: number
  }[]
}

interface ScheduleSectionProps {
  schedule?: ScheduleItem[]
}

const defaultSchedule: ScheduleItem[] = [
  {
    day: 'Monday',
    batches: [
      { time: '10:00 AM - 11:30 AM', className: 'Advanced Mathematics', grade: '12th', availableSlots: 5 },
      { time: '4:00 PM - 5:30 PM', className: 'Physics Fundamentals', grade: '11th', availableSlots: 3 },
    ],
  },
  {
    day: 'Tuesday',
    batches: [
      { time: '10:00 AM - 11:30 AM', className: 'Chemistry Complete', grade: '12th', availableSlots: 2 },
      { time: '6:00 PM - 7:30 PM', className: 'Mathematics Basics', grade: '10th', availableSlots: 8 },
    ],
  },
  {
    day: 'Wednesday',
    batches: [
      { time: '10:00 AM - 11:30 AM', className: 'Advanced Mathematics', grade: '12th', availableSlots: 5 },
      { time: '4:00 PM - 5:30 PM', className: 'Physics Fundamentals', grade: '11th', availableSlots: 3 },
    ],
  },
  {
    day: 'Thursday',
    batches: [
      { time: '10:00 AM - 11:30 AM', className: 'Chemistry Complete', grade: '12th', availableSlots: 2 },
      { time: '6:00 PM - 7:30 PM', className: 'Mathematics Basics', grade: '10th', availableSlots: 8 },
    ],
  },
  {
    day: 'Friday',
    batches: [
      { time: '10:00 AM - 11:30 AM', className: 'Advanced Mathematics', grade: '12th', availableSlots: 5 },
      { time: '4:00 PM - 5:30 PM', className: 'Physics Fundamentals', grade: '11th', availableSlots: 3 },
    ],
  },
  {
    day: 'Saturday',
    batches: [
      { time: '9:00 AM - 12:00 PM', className: 'Doubt Clearing Session', grade: 'All', availableSlots: 20 },
      { time: '3:00 PM - 5:00 PM', className: 'Test Series', grade: '12th', availableSlots: 15 },
    ],
  },
]

export default function ScheduleSection({ schedule = defaultSchedule }: ScheduleSectionProps) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Weekly Schedule</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose a batch timing that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.map((daySchedule) => (
              <Card key={daySchedule.day}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {daySchedule.day}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {daySchedule.batches.map((batch, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-muted/50 border"
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        {batch.time}
                      </div>
                      <p className="font-medium">{batch.className}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline">Grade {batch.grade}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {batch.availableSlots} slots left
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
