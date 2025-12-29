import { BaseSetting } from '@/types'

const Setting = ({
  setting,
  handleChangeSetting,
}: {
  setting: BaseSetting
  handleChangeSetting: (v: BaseSetting) => void
}) => {
  return (
    <section className="flex flex-col w-full p-[20px] gap-[10px] border border-solid border-[#333] rounded-[12px] shadow-[0_0_16px_0_rgba(0,0,0,0.08)]">
      <h2 className="text-[20px] text-[#333] w-full">기본 설정</h2>
      <div className="flex flex-wrap w-full gap-x-[20px] gap-y-[10px]">
        <label className="text-[12px] flex items-center gap-[4px] select-none cursor-pointer">
          <input
            type="checkbox"
            checked={setting.isDay}
            onChange={(e) => handleChangeSetting({ ...setting, isDay: e.target.checked })}
          />
          데이오프
        </label>
      </div>
    </section>
  )
}

export default Setting
