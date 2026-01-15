import { CF_NURSE_GRADE, CF_NURSE_SCHEDULE, CF_NURSE_SCHEDULE_TYPE } from '@/configs/nurse'
import { BaseSetting, Days, Nurse } from '@/types'

export const createSchedule = ({
  nurseList,
  days,
  setting,
}: {
  nurseList: Nurse[]
  days: Days[]
  setting: BaseSetting
}) => {
  /* 1. 초기화 */
  const nurses = [...nurseList]

  /* 2. 필요한 값 추출 */
  const availableValue: AvailableValue = getAvailableValue({ nurses, setting, days })

  if (!availableValue.isPossible) {
    alert('인원을 충당해주세요.')
    return
  }

  for (let i = 0; i < days.length; i++) {
    const day = days[i]
    setDateSchedule({ day, nurses, setting, availableValue })
  }

  return nurses
}

interface AvailableValue {
  shiftPerDay: number
  totalShift: number
  totalAvailable: number
  totalOffCount: number
  averageOffPerNurse: number
  averageNightPerNurse: number
  isPossible: boolean
}

const getAvailableValue = ({
  nurses,
  setting,
  days,
}: {
  nurses: Nurse[]
  setting: BaseSetting
  days: Days[]
}): AvailableValue => {
  const { day_staff_count, eve_staff_count, night_staff_count } = setting

  /* 1. 하루에 필요한 근무자 수 */
  const shiftPerDay = day_staff_count + eve_staff_count + night_staff_count

  /* 2. 한달 총 근무 수 */
  const totalShift = shiftPerDay * days.length

  /* 3. 총 근무 가능 일 수 */
  const totalAvailable = nurses.length * days.length

  /* 4. 전체 오프 개수 */
  const totalOffCount = totalAvailable - totalShift

  /* 5. 1인당 평균 오프개수 */
  const averageOffPerNurse = totalOffCount / nurses.length

  /* 6. 나이트 평균 개수 계산 */
  const averageNightPerNurse = (night_staff_count * days.length) / nurses.length

  /* 7. 근무 가능 여부 (평균 오프 1 이상) - 오프 개수 보장 시 여기 값 수정하면 됌 */
  const isPossible = averageOffPerNurse > 0

  return {
    shiftPerDay,
    totalShift,
    totalAvailable,
    totalOffCount,
    averageOffPerNurse,
    averageNightPerNurse,
    isPossible,
  }
}
interface ShiftWeights {
  day: { possible: boolean; weight: number }
  eve: { possible: boolean; weight: number }
  night: { possible: boolean; weight: number }
  off: { possible: boolean; weight: number }
}

const AVGOFF_SCORE = 60 // 오프 부족 시 제곱 가중치 배수 (높을수록 균등화 강제)
const OFF_GAP_PENALTY = 20 // 오프 여유 있을 시 페널티
const INTERVAL_SCORE = 50 // 연속 근무 페널티 배수
const CONTINUOUS_BONUS = 20 // 전날과 동일 근무 시 보너스
const OFF_BALANCE_POWER = 15 // 오프 편차를 근무 가중치에 반영하는 힘
const NIGHT_BALANCE_POWER = 30 // 나이트 균등화를 위한 가중치 강도 (높을수록 개수가 정확해짐)

const getShiftWeights = ({
  nurse,
  day,
  availableValue,
  setting,
}: {
  nurse: Nurse
  day: Days
  availableValue: AvailableValue
  setting: BaseSetting
}): ShiftWeights => {
  /* 현재 근무 상태 */
  const dayIdx = day.dayNum - 1
  const daySchedule = nurse.schedule[dayIdx]

  /* 지정 근무 여부 (Target) */
  const isTarget = daySchedule.type === CF_NURSE_SCHEDULE_TYPE.TARGET
  if (isTarget) {
    const v = daySchedule.value
    return {
      day: { possible: v === 'D', weight: v === 'D' ? 9999 : -9999 },
      eve: { possible: v === 'E', weight: v === 'E' ? 9999 : -9999 },
      night: { possible: v === 'N', weight: v === 'N' ? 9999 : -9999 },
      off: { possible: v === 'OFF', weight: v === 'OFF' ? 9999 : -9999 },
    }
  }

  /* 데이터 추출 */
  const lastShift = nurse.schedule[dayIdx - 1]?.value || CF_NURSE_SCHEDULE.OFF
  const beforeLastShift = nurse.schedule[dayIdx - 2]?.value || CF_NURSE_SCHEDULE.OFF

  const scheduleValues = nurse.schedule.slice(0, dayIdx).map((s) => s.value)
  const dayCount = scheduleValues.filter((v) => v === CF_NURSE_SCHEDULE.D).length
  const eveCount = scheduleValues.filter((v) => v === CF_NURSE_SCHEDULE.E).length
  const offCount = scheduleValues.filter((v) => v === CF_NURSE_SCHEDULE.OFF).length
  const nightCount = scheduleValues.filter((v) => v === CF_NURSE_SCHEDULE.N).length

  // 현재 연속 근무 일수(Interval) 계산
  const lastOffIndex = scheduleValues.lastIndexOf(CF_NURSE_SCHEDULE.OFF)
  const consecutiveDays =
    lastOffIndex < 0 ? scheduleValues.length : scheduleValues.length - 1 - lastOffIndex

  // 나이트 한 지 얼마나 됐는지
  const lastNightIndex = scheduleValues.lastIndexOf(CF_NURSE_SCHEDULE.N)
  const daysSinceLastNight = lastNightIndex < 0 ? 100 : dayIdx - lastNightIndex

  /* -----------------------------------------------------------
     1. 가능여부 체크 (Hard Constraints)
  ----------------------------------------------------------- */
  let canDay = true
  let canEve = true
  let canNight = true
  let canOff = true

  // [규칙 1] N 다음 날 (퇴근 당일)
  if (lastShift === CF_NURSE_SCHEDULE.N) {
    canDay = false // 아침에 데이 출근 불가
    canEve = false // 오후에 이브닝 출근 불가
    canNight = true // 하지만 밤에 다시 나이트 출근(N-N)은 가능!
  }

  // [규칙 2] N - OFF - D
  if (lastShift === CF_NURSE_SCHEDULE.OFF && beforeLastShift === CF_NURSE_SCHEDULE.N) {
    canDay = false
  }

  // [규칙 3] E 다음날 D 불가 (E-D 방지)
  if (lastShift === CF_NURSE_SCHEDULE.E) {
    canDay = false
  }

  // [규칙 4] Max Interval (최대 근무 일수 초과 시 무조건 OFF)
  if (consecutiveDays >= setting.max_interval) {
    canDay = false
    canEve = false
    canNight = false
  }

  // [규칙 5] Min Interval (최소 근무 일수 미달 시 OFF 불가)
  if (lastShift !== CF_NURSE_SCHEDULE.OFF && consecutiveDays < setting.min_interval) {
    canOff = false
  }

  /* -----------------------------------------------------------
     2. 가중치 계산 (Soft Constraints)
  ----------------------------------------------------------- */

  // [A] 오프 균형 보정치 (Off Balance Factor)
  // 평균보다 많이 쉰 사람은 이 값이 음수가 되어 근무 가중치를 높이고,
  // 못 쉰 사람은 양수가 되어 근무 가중치를 낮춥니다.
  const offGap = availableValue.averageOffPerNurse - offCount
  const offBalanceFactor = offGap * -OFF_BALANCE_POWER

  // 1. 나이트 균형 보정치 (나이트 적게 한 사람 점수 높이기)
  const nightGap = availableValue.averageNightPerNurse - nightCount
  const nightBalanceFactor = nightGap * NIGHT_BALANCE_POWER

  // [B] Off 가중치 (쉬어야 할 점수)
  const offBaseWeight = offGap > 0 ? Math.pow(offGap, 2) * AVGOFF_SCORE : offGap * OFF_GAP_PENALTY
  const intervalWeight = Math.pow(consecutiveDays, 2) * INTERVAL_SCORE
  const offWeight = offBaseWeight + intervalWeight

  // [C] Day 가중치
  let dayWeight = (availableValue.averageOffPerNurse - dayCount) * 2
  dayWeight += offBalanceFactor // 오프 편차 보정
  if (lastShift === CF_NURSE_SCHEDULE.D) dayWeight += CONTINUOUS_BONUS // D-D 연속성

  // [D] Eve 가중치
  let eveWeight = (availableValue.averageOffPerNurse - eveCount) * 2
  eveWeight += offBalanceFactor // 오프 편차 보정
  if (lastShift === CF_NURSE_SCHEDULE.E) eveWeight += CONTINUOUS_BONUS // E-E 연속성

  // [E] Night 가중치
  let nightWeight = daysSinceLastNight * 5
  nightWeight += offBalanceFactor // 오프가 너무 많으면 일을 더 시킴
  nightWeight += nightBalanceFactor // 나이트가 평균보다 적으면 나이트를 시킴
  if (lastShift === CF_NURSE_SCHEDULE.N) nightWeight += CONTINUOUS_BONUS + 20 // N-N은 더 강하게 권장

  // 직급별 조정: RN이 가급적 나이트를 더 전담하게 유도
  if (nurse.grade === CF_NURSE_GRADE.RN) nightWeight += 20
  if (nurse.grade === CF_NURSE_GRADE.CN) nightWeight -= 30

  return {
    day: { possible: canDay, weight: canDay ? dayWeight : -9999 },
    eve: { possible: canEve, weight: canEve ? eveWeight : -9999 },
    night: { possible: canNight, weight: canNight ? nightWeight : -9999 },
    off: { possible: canOff, weight: canOff ? offWeight : -9999 },
  }
}

const setDateSchedule = ({
  day,
  nurses,
  setting,
  availableValue,
}: {
  day: Days
  nurses: Nurse[]
  setting: BaseSetting
  availableValue: AvailableValue
}) => {
  const { HN, CN, RN } = classifyNurses(nurses)
  const dayIdx = day.dayNum - 1

  let reqD = setting.day_staff_count
  const reqE = setting.eve_staff_count
  const reqN = setting.night_staff_count

  // 1. 수간호사 배정 (인원 카운트에서 제외되지 않도록 수정 가능)
  if (HN[0]) {
    setHNSchedule(HN[0], day)
    if (HN[0].schedule[dayIdx].value === 'D') reqD--
  }

  /**
   * 엄격한 직급 배정 함수
   * 규칙: 1순위 CN 1명 배정 -> 2순위 RN 1명 배정 -> 3순위 남은 인원 가중치 배정
   */
  const assignStrictShift = (
    shift: string,
    totalCount: number,
    shiftKey: 'day' | 'eve' | 'night'
  ) => {
    let assigned = 0

    // [Step 1] 주임(CN) 필수 1명 배정 시도
    const cnCands = getSpecificCandidates(CN, shiftKey, day, availableValue, setting)
    if (totalCount >= 1 && cnCands.length > 0) {
      cnCands[0].nurse.schedule[dayIdx] = { type: CF_NURSE_SCHEDULE_TYPE.BASIC, value: shift }
      assigned++
    }

    // [Step 2] 일반(RN) 필수 1명 배정 시도
    const rnCands = getSpecificCandidates(RN, shiftKey, day, availableValue, setting)
    if (totalCount > assigned && rnCands.length > 0) {
      rnCands[0].nurse.schedule[dayIdx] = { type: CF_NURSE_SCHEDULE_TYPE.BASIC, value: shift }
      assigned++
    }

    // [Step 3] 남은 인원수(totalCount - assigned)만큼 가중치 순으로 "무조건" 채움
    while (assigned < totalCount) {
      const allCands = getSpecificCandidates([...CN, ...RN], shiftKey, day, availableValue, setting)

      if (allCands.length === 0) {
        console.error(`${day.dayNum}일 ${shift} 근무를 채울 인력이 부족합니다!`)
        break
      }

      // 가장 가중치 높은 사람 배정
      allCands[0].nurse.schedule[dayIdx] = { type: CF_NURSE_SCHEDULE_TYPE.BASIC, value: shift }
      assigned++
    }
  }

  // 2. 각 근무 배정 (N -> E -> D 순서)
  assignStrictShift(CF_NURSE_SCHEDULE.N, reqN, 'night')
  assignStrictShift(CF_NURSE_SCHEDULE.E, reqE, 'eve')
  assignStrictShift(CF_NURSE_SCHEDULE.D, reqD, 'day')

  // 3. 나머지 OFF 처리
  nurses.forEach((n) => {
    if (!n.schedule[dayIdx].value) {
      n.schedule[dayIdx] = { type: CF_NURSE_SCHEDULE_TYPE.BASIC, value: CF_NURSE_SCHEDULE.OFF }
    }
  })
}

/* 도우미 함수: 특정 인원 집합에서 가중치 계산 및 정렬 */
const getSpecificCandidates = (
  targetList: Nurse[],
  shiftKey: 'day' | 'eve' | 'night',
  day: Days,
  availableValue: AvailableValue,
  setting: BaseSetting
) => {
  return targetList
    .filter((n) => !n.schedule[day.dayNum - 1].value)
    .map((n) => ({
      nurse: n,
      weights: getShiftWeights({ nurse: n, day, availableValue, setting }),
    }))
    .filter((item) => item.weights[shiftKey].possible)
    .sort((a, b) => {
      const diff = b.weights[shiftKey].weight - a.weights[shiftKey].weight
      // 가중치가 같으면(차이가 거의 없으면) 랜덤 정렬
      if (Math.abs(diff) < 0.01) return Math.random() - 0.5
      return diff
    })
}

const setHNSchedule = (nurse: Nurse, day: Days) => {
  /* 0. 없으면  */
  if (!nurse) return

  /* 1. 이미 세팅된 값 있으면 return */
  if (nurse.schedule[day.dayNum - 1] && nurse.schedule[day.dayNum - 1].value !== '') return

  const isWeekend = day.dayOfWeek === 0 || day.dayOfWeek === 6

  if (isWeekend) {
    nurse.schedule[day.dayNum - 1] = {
      type: CF_NURSE_SCHEDULE_TYPE.BASIC,
      value: CF_NURSE_SCHEDULE.OFF,
    }
  } else {
    nurse.schedule[day.dayNum - 1] = {
      type: CF_NURSE_SCHEDULE_TYPE.BASIC,
      value: CF_NURSE_SCHEDULE.D,
    }
  }
}

/* 간호사 분류 ( 수, 주임, 일반 ) */
const classifyNurses = (nurses: Nurse[]) => {
  return {
    HN: nurses.filter((n) => n.grade === CF_NURSE_GRADE.HN),
    CN: nurses.filter((n) => n.grade === CF_NURSE_GRADE.CN),
    RN: nurses.filter((n) => n.grade === CF_NURSE_GRADE.RN),
  }
}

export const resetSchedule = (nurses: Nurse[]) => {
  return nurses.map((n) => {
    const reset = n.schedule.map((s) => {
      if (s.type === CF_NURSE_SCHEDULE_TYPE.TARGET) return { ...s }
      return { type: '', value: '' }
    })
    return { ...n, schedule: reset }
  })
}
