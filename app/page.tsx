'use client'

import Header from '@/components/layout/header'
import Schedule from '@/components/layout/schedule'
import Setting from '@/components/layout/setting'
import { BaseSetting, Nurse } from '@/types'
import { useState } from 'react'

const Layout = () => {
  /* 기본 세팅 */
  const [setting, setSetting] = useState<Partial<BaseSetting>>({})
  /* 간호사 목록 */
  const [nurse, setNurse] = useState<Nurse[]>([])

  const handleChangeSetting = (value: BaseSetting) => {
    setSetting(value)
  }

  return (
    <main className="flex flex-col items-center justify-center px-[60px] py-[30px] box-border w-full min-h-screen gap-[20px] bg-[#3BA9E0]">
      <div className="flex flex-col p-[20px] box-border items-center justify-center flex-1 w-full max-w-[1024px] h-full gap-[20px] bg-[white] rounded-[24px]">
        <Header />
        <Setting handleChangeSetting={handleChangeSetting} />
        <Schedule />
      </div>
    </main>
  )
}

export default Layout
