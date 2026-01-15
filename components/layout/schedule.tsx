'use client'

import { useState } from 'react'

import { twMerge } from 'tailwind-merge'

import AddNurseModal from '@/components/modal/ModalAddNurse'
import ModalSetNurse from '@/components/modal/ModalSetNurse'
import { CF_NURSE_GRADE, CF_NURSE_SCHEDULE_TYPE } from '@/configs/nurse'
import { getMonthDays, getNextMonth } from '@/helpers/day'
import { BaseSetting, Days, Nurse } from '@/types'
import { createSchedule, resetSchedule } from '@/helpers/schedule'

const EMPTY_NURSE: Nurse = {
  name: '',
  grade: CF_NURSE_GRADE.RN,
  schedule: [],
}

const Schedule = ({
  nurseList,
  handleChangeNurseList,
  setting,
}: {
  nurseList: Nurse[]
  handleChangeNurseList: (v: Nurse[]) => void
  setting: BaseSetting
}) => {
  const { year, month } = getNextMonth()
  const [days] = useState<Days[]>(() => getMonthDays(year, month))

  const [openSetNurseModal, setOpenSetNurseModal] = useState<{
    nurse: Nurse
    index: number
  } | null>(null)
  const [openSetScheduleModal, setOpenSetScheduleModal] = useState<{
    nurse: Nurse
    nurseIndex: number
    day: number
  } | null>(null)

  return (
    <>
      <section className="flex flex-col flex-1 gap-[4px]">
        <div className="flex items-center justify-between">
          <button
            className="flex items-center justify-center px-[12px] py-[4px] bg-[#5E8AF9] text-[#fff] font-[700] text-[14px] rounded-[4px] cursor-pointer"
            onClick={() => setOpenSetNurseModal({ nurse: EMPTY_NURSE, index: -1 })}>
            인력 추가
          </button>
          <div className="flex items-center gap-[4px]">
            <button
              className="flex items-center justify-center px-[12px] py-[4px] bg-[#5E8AF9] text-[#fff] font-[700] text-[14px] rounded-[4px] cursor-pointer"
              onClick={() => {
                const resetNurses = resetSchedule(nurseList)
                handleChangeNurseList(resetNurses)
              }}>
              초기화
            </button>
            <button
              className="flex items-center justify-center px-[12px] py-[4px] bg-[#5E8AF9] text-[#fff] font-[700] text-[14px] rounded-[4px] cursor-pointer"
              onClick={() => {
                const assignNurses = createSchedule({
                  nurseList: nurseList,
                  days: days,
                  setting: setting,
                })
                if (assignNurses) handleChangeNurseList(assignNurses)
              }}>
              스케줄링
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-w-0 overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-0">
            <colgroup>
              <col style={{ width: '80px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '40px' }} />
              <col style={{ width: '40px' }} />
              <col style={{ width: '40px' }} />
              <col style={{ width: '40px' }} />
              {days.map((_, i) => (
                <col key={i} style={{ width: '40px' }} />
              ))}
            </colgroup>

            <thead className="bg-gray-100">
              <tr>
                <th className="sticky left-0 z-30 bg-gray-100" rowSpan={2}>
                  <div className="flex items-center justify-center h-[62px] border border-[#d1d5db] px-[8px] py-[4px] text-[14px] text-[#333]">
                    작급
                  </div>
                </th>

                <th className="sticky left-[80px] z-30 bg-gray-100" rowSpan={2}>
                  <div className="flex items-center justify-center h-[62px] border-t border-r border-b border-[#d1d5db] px-[8px] py-[4px] text-[14px] text-[#333]">
                    이름
                  </div>
                </th>
                <th colSpan={4} className="sticky left-[200px] z-30 bg-gray-100">
                  <div className="h-full border-t border-r border-b border-[#d1d5db] px-[8px] py-[4px] text-[14px] text-[#333]">
                    총합
                  </div>
                </th>

                {days.map((day) => (
                  <th
                    key={`day_th_${day.dayNum}`}
                    className={twMerge(
                      'border-t border-r border-b border-[#d1d5db] text-center text-[14px]',
                      day.dayOfWeek === 0 || day.dayOfWeek === 6 ? 'text-[red]' : 'text-[#333]'
                    )}
                    rowSpan={2}>
                    {day.dayNum}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="sticky left-[200px] z-30 bg-gray-100">
                  <div className="h-full border-r border-b border-[#d1d5db] px-[8px] py-[4px] text-[14px] text-[#333]">
                    D
                  </div>
                </th>
                <th className="sticky left-[240px] z-30 bg-gray-100">
                  <div className="h-full border-r border-b border-[#d1d5db] px-[8px] py-[4px] text-[14px] text-[#333]">
                    E
                  </div>
                </th>
                <th className="sticky left-[280px] z-30 bg-gray-100">
                  <div className="h-full border-r border-b border-[#d1d5db] px-[8px] py-[4px] text-[14px] text-[#333]">
                    N
                  </div>
                </th>
                <th className="sticky left-[320px] z-30 bg-gray-100">
                  <div className="h-full border-r border-b border-[#d1d5db] px-[8px] py-[4px] text-[14px] text-[#333]">
                    OFF
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {nurseList.map((n, i) => (
                <tr key={`nurse_${i}`}>
                  <td
                    className="sticky left-0 z-20 bg-white border-l border-r border-b border-[#d1d5db] text-[14px] text-[#333] cursor-pointer hover:bg-[#f0f6ff]"
                    onClick={() => setOpenSetNurseModal({ nurse: n, index: i })}>
                    <div className="flex items-center justify-center">{n.grade}</div>
                  </td>

                  <td
                    className="sticky left-[80px] z-20 bg-white border-r border-b border-[#d1d5db] text-[14px] text-[#333] cursor-pointer hover:bg-[#f0f6ff]"
                    onClick={() => setOpenSetNurseModal({ nurse: n, index: i })}>
                    <div className="h-full px-[8px] py-[4px] break-keep text-center">{n.name}</div>
                  </td>

                  <td className="sticky left-[200px] z-20 bg-white border-r border-b border-[#d1d5db] text-[14px] text-[#333]">
                    <div className="h-full px-[8px] py-[4px] break-keep text-center">
                      {n.schedule.filter((s) => s.value === 'D').length}
                    </div>
                  </td>
                  <td className="sticky left-[240px] z-20 bg-white border-r border-b border-[#d1d5db] text-[14px] text-[#333]">
                    <div className="h-full px-[8px] py-[4px] break-keep text-center">
                      {n.schedule.filter((s) => s.value === 'E').length}
                    </div>
                  </td>
                  <td className="sticky left-[280px] z-20 bg-white border-r border-b border-[#d1d5db] text-[14px] text-[#333]">
                    <div className="h-full px-[8px] py-[4px] break-keep text-center">
                      {n.schedule.filter((s) => s.value === 'N').length}
                    </div>
                  </td>
                  <td className="sticky left-[320px] z-20 bg-white border-r border-b border-[#d1d5db] text-[14px] text-[#333]">
                    <div className="h-full px-[8px] py-[4px] break-keep text-center">
                      {n.schedule.filter((s) => s.value === 'OFF').length}
                    </div>
                  </td>

                  {days.map((day, j) => (
                    <td
                      key={`day_td_${day.dayNum}_${j}`}
                      className={twMerge(
                        'border-r border-b border-[#d1d5db] text-center h-[36px] text-[14px] text-[#333] cursor-pointer hover:bg-[#f0f6ff]',
                        n.schedule[j].type === CF_NURSE_SCHEDULE_TYPE.TARGET ? 'bg-[#fff1f2]' : ''
                      )}
                      onClick={() =>
                        setOpenSetScheduleModal({ nurse: n, nurseIndex: i, day: j + 1 })
                      }>
                      {n.schedule[j].value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 인력추가 및 수정 */}
      {openSetNurseModal !== null && (
        <AddNurseModal
          open={openSetNurseModal !== null}
          onClose={() => setOpenSetNurseModal(null)}
          onSubmit={(newNurse: Partial<Nurse>) => {
            if (openSetNurseModal.index === -1) {
              const n = { ...newNurse, schedule: new Array(days.length).fill('') }
              handleChangeNurseList([...nurseList, n as Nurse])
            } else {
              const nurses = [...nurseList]
              nurses[openSetNurseModal.index] = newNurse as Nurse
              handleChangeNurseList(nurses)
            }

            setOpenSetNurseModal(null)
          }}
          data={openSetNurseModal}
          nurseList={nurseList}
        />
      )}

      {/* 지정 근무 */}
      {openSetScheduleModal !== null && (
        <ModalSetNurse
          open={openSetScheduleModal !== null}
          onClose={() => setOpenSetScheduleModal(null)}
          onSubmit={(nurse: Nurse) => {
            const copyNurseList = [...nurseList]
            copyNurseList[openSetScheduleModal.nurseIndex] = nurse
            handleChangeNurseList(copyNurseList)
            setOpenSetScheduleModal(null)
          }}
          data={openSetScheduleModal}
        />
      )}
    </>
  )
}

export default Schedule
