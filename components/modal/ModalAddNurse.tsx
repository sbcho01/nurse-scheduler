'use client'

import { useEffect, useRef, useState } from 'react'

import Modal from '@/components/ui/Modal'
import { CF_NURSE_GRADE } from '@/configs/nurse'
import { Nurse } from '@/types'

const AddNurseModal = ({
  open,
  onClose,
  onSubmit,
  data,
  nurseList,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (nurse: Partial<Nurse>) => void
  data: { nurse: Nurse; index: number }
  nurseList: Nurse[]
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [nurse, setNurse] = useState<Nurse>(data.nurse)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const handleChangeNurse = <K extends keyof Partial<Nurse>>(key: K, value: Partial<Nurse>[K]) => {
    setNurse((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onSubmit(nurse)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[400px] p-[20px] flex flex-col gap-[16px]">
        <h2 className="text-[18px] font-[700] text-[#333]">인력 추가</h2>

        <div className="flex flex-col gap-[12px]">
          {/* 이름 */}
          <div className="flex flex-col gap-[4px]">
            <span className="text-[14px] font-[700] text-[#333]">이름</span>
            <input
              ref={inputRef}
              value={nurse.name ?? ''}
              onChange={(e) => handleChangeNurse('name', e.target.value)}
              placeholder="이름 입력"
              className="h-[36px] px-[10px] border border-[#d1d5db] rounded-[6px] text-[14px]"
            />
          </div>

          {/* 직급 */}
          <div className="flex flex-col gap-[4px]">
            <span className="text-[14px] font-[700] text-[#333]">직급</span>
            <div className="flex items-center gap-[16px]">
              {Object.values(CF_NURSE_GRADE).map((grade) => (
                <label
                  key={`nurse_${grade}`}
                  className="text-[12px] flex items-center gap-[4px] cursor-pointer select-none">
                  <input
                    type="radio"
                    name="grade"
                    checked={nurse.grade === grade}
                    onChange={() => handleChangeNurse('grade', grade)}
                    disabled={
                      grade === CF_NURSE_GRADE.HN &&
                      !!nurseList.find((n) => n.grade === CF_NURSE_GRADE.HN)
                    }
                  />
                  {grade}
                </label>
              ))}
            </div>
          </div>
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
            onClick={handleSubmit}
            className="px-[12px] py-[6px] bg-[#5E8AF9] text-white rounded-[4px]">
            {data.index === -1 ? '추가' : '적용'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default AddNurseModal
