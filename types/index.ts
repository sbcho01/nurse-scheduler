export interface Nurse {
  name: string
  grade: string
  schedule: NurseSchedule[]
}

export interface NurseSchedule {
  type: string
  value: string
}

export interface BaseSetting {
  // 데이 근무 인원수
  day_staff_count: number
  // 이브 근무 인원수
  eve_staff_count: number
  // 나이트 근무 인원수
  night_staff_count: number
  // 연속 근무 최소 일수
  min_interval: number
  // 연속 근무 최대 일수
  max_interval: number
}

export interface Days {
  date: Date
  dayLabel: string
  dayNum: number
  dayOfWeek: number
}
