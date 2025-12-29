import dayjs from 'dayjs'

/**
 * 특정 년/월의 일자별 정보 반환
 * @param year  년 (예: 2025)
 * @param month 월 (1~12)
 * @returns 각 날짜의 { date, dayOfWeek, dayLabel } 배열
 */
export const getMonthDays = (year: number, month: number) => {
  const start = dayjs(`${year}-${month}-01`)
  const daysInMonth = start.daysInMonth()

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = start.date(i + 1)
    return {
      date: date.toDate(), // Date 객체
      dayOfWeek: date.day(), // 0=일, 1=월, ... 6=토
      dayLabel: ['일', '월', '화', '수', '목', '금', '토'][date.day()],
      dayNum: i + 1, // 1~31
    }
  })
}

/**
 * 다음 달과 연도 가져오기
 * @returns { year, month }
 */
export const getNextMonth = () => {
  const next = dayjs().add(1, 'month')

  return {
    year: next.year(),
    month: next.month() + 1, // month는 0~11 이라 +1
  }
}
