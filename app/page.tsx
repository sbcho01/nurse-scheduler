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

  const handleChangeNurse = (value: Nurse[]) => {
    setNurse(value)
  }

  return (
    <main className="min-h-screen flex w-full bg-[#3BA9E0] px-[60px] py-[30px]">
      <div className="flex flex-col flex-1 w-full mx-auto gap-[20px]">
        <div className="flex flex-col flex-1 gap-[20px] bg-white rounded-[24px]  p-[20px]">
          <Header />
          <Setting setting={setting} handleChangeSetting={handleChangeSetting} />
          <Schedule nurse={nurse} handleChangeNurse={handleChangeNurse} />
        </div>
      </div>
    </main>
  )
}

export default Layout
