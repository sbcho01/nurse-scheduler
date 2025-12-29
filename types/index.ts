export interface Nurse {
  grade: string
  name: string
}

export interface BaseSetting {
  isDay?: boolean
}

export interface Days {
  date: Date
  dayLabel: string
  dayNum: number
  dayOfWeek: number
}
