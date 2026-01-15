'use client'

import { useEffect, useState } from 'react'

import Header from '@/components/layout/header'
import Schedule from '@/components/layout/schedule'
import Setting from '@/components/layout/setting'
import { BaseSetting, Nurse } from '@/types'

const INIT_SETTING: BaseSetting = {
  day_staff_count: 3,
  eve_staff_count: 2,
  night_staff_count: 2,
  min_interval: 2,
  max_interval: 5,
}

const SETTING_KEY = 'base_setting'
const NURSE_LIST_KEY = 'nurse_list'

const Layout = () => {
  /* 기본 세팅 */
  const [setting, setSetting] = useState<BaseSetting>(INIT_SETTING)
  /* 간호사 목록 */
  const [nurseList, setNurseList] = useState<Nurse[]>([])

  useEffect(() => {
    try {
      const savedSetting = localStorage.getItem(SETTING_KEY)
      const savedNurseList = localStorage.getItem(NURSE_LIST_KEY)

      if (savedSetting)
        setTimeout(() => {
          setSetting(JSON.parse(savedSetting))
        }, 0)

      if (savedNurseList)
        setTimeout(() => {
          setNurseList(JSON.parse(savedNurseList))
        }, 0)
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(SETTING_KEY, JSON.stringify(setting))
  }, [setting])

  useEffect(() => {
    localStorage.setItem(NURSE_LIST_KEY, JSON.stringify(nurseList))
  }, [nurseList])

  const handleChangeSetting = (value: BaseSetting) => {
    setSetting(value)
  }

  const handleChangeNurseList = (value: Nurse[]) => {
    setNurseList(value)
  }

  return (
    <main className="min-h-screen flex w-full bg-[#3BA9E0] px-[30px] py-[30px]">
      <div className="flex flex-col flex-1 w-full mx-auto gap-[20px]">
        <div className="flex flex-col flex-1 gap-[20px] bg-white rounded-[24px]  p-[20px]">
          <Header />
          <Setting setting={setting} handleChangeSetting={handleChangeSetting} />
          <Schedule
            nurseList={nurseList}
            handleChangeNurseList={handleChangeNurseList}
            setting={setting}
          />
        </div>
      </div>
    </main>
  )
}

export default Layout
