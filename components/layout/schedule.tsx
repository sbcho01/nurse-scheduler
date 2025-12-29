'use client'

import { getMonthDays, getNextMonth } from '@/helpers/day'
import { Days, Nurse } from '@/types'
import { useState } from 'react'

const Schedule = ({
  nurse,
  handleChangeNurse,
}: {
  nurse: Nurse
  handleChangeNurse: (v: Nurse[]) => void
}) => {
  const { year, month } = getNextMonth()
  const [days] = useState<Days[]>(() => getMonthDays(year, month))

  return (
    <section className="flex flex-1 min-w-0 overflow-x-auto">
      <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-0">
        <colgroup>
          <col style={{ width: '80px' }} />
          <col style={{ width: '120px' }} />
          {days.map((_, i) => (
            <col key={i} style={{ width: '40px' }} />
          ))}
        </colgroup>

        <thead className="bg-gray-100">
          <tr>
            <th className="sticky left-0 z-30 bg-gray-100 ">
              <div className="h-full border border-[#d1d5db] px-[8px] py-[4px]">설정</div>
            </th>

            <th className="sticky left-[80px] z-30 bg-gray-100 ">
              <div className="h-full border-t border-r border-b border-[#d1d5db] px-[8px] py-[4px]">
                이름
              </div>
            </th>

            {days.map((day) => (
              <th
                key={`day_th_${day.dayNum}`}
                className="border-t border-r border-b border-[#d1d5db] text-center">
                {day.dayNum}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="sticky left-0 z-20 bg-white border-l border-r border-b border-[#d1d5db]">
              <div className="flex items-center justify-center">⚙️</div>
            </td>

            <td className="sticky left-[80px] z-20 bg-white border-r border-b border-[#d1d5db]">
              <div className="h-full px-[8px] py-[4px] break-keep text-center">홍길동</div>
            </td>

            {days.map((day) => (
              <td
                key={`day_td_${day.dayNum}`}
                className="border-r border-b border-[#d1d5db] h-[36px]"
              />
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default Schedule
