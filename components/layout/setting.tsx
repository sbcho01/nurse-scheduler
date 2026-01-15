import { BaseSetting } from '@/types'
import { Text } from '../ui/Input'

const Setting = ({
  setting,
  handleChangeSetting,
}: {
  setting: BaseSetting
  handleChangeSetting: (v: BaseSetting) => void
}) => {
  return (
    <section className="flex flex-col w-full p-[20px] gap-[10px] border border-solid border-[#333] rounded-[12px] shadow-[0_0_16px_0_rgba(0,0,0,0.08)]">
      <h2 className="text-[20px] text-[#333] w-full font-[700]">기본 설정</h2>
      <div className="flex flex-wrap w-full gap-x-[20px] gap-y-[10px]">
        <Text
          type="number"
          label="데이 근무 인원수"
          value={setting.day_staff_count}
          onChange={(v: string | number) => {
            let value = Number(v)
            if (value <= 1) value = 1
            if (value >= 7) value = 7
            handleChangeSetting({ ...setting, day_staff_count: value })
          }}
        />
        <Text
          type="number"
          label="이브 근무 인원수"
          value={setting.eve_staff_count}
          onChange={(v: string | number) => {
            let value = Number(v)
            if (value <= 1) value = 1
            if (value >= 7) value = 7
            handleChangeSetting({ ...setting, eve_staff_count: value })
          }}
        />
        <Text
          type="number"
          label="나이브 근무 인원수"
          value={setting.night_staff_count}
          onChange={(v: string | number) => {
            let value = Number(v)
            if (value <= 1) value = 1
            if (value >= 7) value = 7
            handleChangeSetting({ ...setting, night_staff_count: value })
          }}
        />
        <Text
          type="number"
          label="연속 근무 최소 일수"
          value={setting.min_interval}
          onChange={(v: string | number) => {
            let value = Number(v)
            if (value <= 1) value = 1
            if (value >= 7) value = 7
            handleChangeSetting({ ...setting, min_interval: value })
          }}
        />
        <Text
          type="number"
          label="연속 근무 최대 일수"
          value={setting.max_interval}
          onChange={(v: string | number) => {
            let value = Number(v)
            if (value <= 1) value = 1
            if (value >= 7) value = 7
            handleChangeSetting({ ...setting, max_interval: value })
          }}
        />
      </div>
    </section>
  )
}

export default Setting
