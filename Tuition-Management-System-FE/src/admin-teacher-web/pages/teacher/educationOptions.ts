/** Shared education level config: subjects and grades per level (used in Profile and Create Class) */
export interface EducationLevelConfig {
  subjects: string[]
  grades: string[]
}

export const educationLevelsConfig: Record<string, EducationLevelConfig> = {
  PRIMARY: {
    subjects: ['Mathematics', 'English', 'Environment', 'Sinhala', 'Tamil', 'Religion', 'Art', 'Music', 'Physical Education'],
    grades: ['1', '2', '3', '4', '5'],
  },
  OL: {
    subjects: ['Mathematics', 'Science', 'History', 'English', 'Sinhala', 'Tamil', 'Buddhism', 'Catholicism', 'Islam', 'Hinduism', 'Geography', 'Commerce', 'ICT', 'Art', 'Music', 'Drama', 'Dancing'],
    grades: ['6', '7', '8', '9', '10', '11'],
  },
  AL: {
    subjects: ['Combined Maths', 'Physics', 'Chemistry', 'Biology', 'ICT', 'Economics', 'Accounting', 'Business Studies', 'Geography', 'History', 'Political Science', 'Logic', 'Sinhala', 'Tamil', 'English', 'Arabic', 'French', 'German', 'Japanese', 'Chinese'],
    grades: ['12', '13'],
  },
}

export const educationLevelLabels: Record<string, string> = {
  PRIMARY: 'Primary',
  OL: 'O/L',
  AL: 'A/L',
}

export type EducationLevelCode = 'PRIMARY' | 'OL' | 'AL'

/** Teacher profile education level entry */
export interface ProfileEducationLevel {
  level: EducationLevelCode
  subjects: string[]
  grades: string[]
}

/** Get subject and grade options for create class based on teacher's selected education levels */
export function getCreateClassOptions(profileEducationLevels: ProfileEducationLevel[] | undefined) {
  if (!profileEducationLevels?.length) return { levels: [], subjectsByLevel: {} as Record<string, string[]>, gradesByLevel: {} as Record<string, string[]> }
  const levels = profileEducationLevels.map((el) => el.level)
  const subjectsByLevel: Record<string, string[]> = {}
  const gradesByLevel: Record<string, string[]> = {}
  profileEducationLevels.forEach((el) => {
    subjectsByLevel[el.level] = el.subjects || []
    gradesByLevel[el.level] = el.grades || []
  })
  return { levels, subjectsByLevel, gradesByLevel }
}
