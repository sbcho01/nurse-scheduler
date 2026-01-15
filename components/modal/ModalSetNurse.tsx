'use client'

import { useState } from 'react'

import Modal from '@/components/ui/Modal'
import { CF_NURSE_SCHEDULE, CF_NURSE_SCHEDULE_TYPE } from '@/configs/nurse'
import { Nurse } from '@/types'

const AddNurseModal = ({
  open,
  onClose,
  onSubmit,
  data,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (nurse: Nurse) => void
  data: { nurse: Nurse; nurseIndex: number; day: number }
}) => {
  const [nurse, setNurse] = useState<Nurse>(data.nurse)
  if (!data) return <></>

  const handleSubmit = () => {
    onSubmit(nurse)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[400px] p-[20px] flex flex-col gap-[16px]">
        <h2 className="text-[18px] font-[700] text-[#333]">스케줄 설정</h2>

        {/* 직급 */}
        <div className="flex items-center justify-center gap-[16px]">
          {Object.values(CF_NURSE_SCHEDULE).map((schedule) => (
            <label
              key={`nurse_${schedule}`}
              className="text-[12px] flex flex-1 items-center gap-[4px] cursor-pointer select-none">
              <input
                type="radio"
                name="schedule"
                checked={nurse.schedule[data.day - 1].value === schedule}
                onChange={() => {
                  const copySchedule = [...nurse.schedule]
                  copySchedule[data.day - 1] = {
                    type: CF_NURSE_SCHEDULE_TYPE.TARGET,
                    value: schedule,
                  }
                  setNurse({ ...nurse, schedule: copySchedule })
                }}
              />
              {schedule}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-[8px] pt-[8px]">
          <button
            type="button"
            onClick={onClose}
            className="px-[12px] py-[6px] border border-[#d1d5db] rounded-[4px]">
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              const copySchedule = [...nurse.schedule]
              copySchedule[data.day - 1] = { type: CF_NURSE_SCHEDULE_TYPE.BASIC, value: '' }
              onSubmit({ ...nurse, schedule: copySchedule })
            }}
            className="px-[12px] py-[6px] border border-[#d1d5db] rounded-[4px]">
            제거
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-[12px] py-[6px] bg-[#5E8AF9] text-white rounded-[4px]">
            확인
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default AddNurseModal
