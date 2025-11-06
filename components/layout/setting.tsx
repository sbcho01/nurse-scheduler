import { BaseSetting } from '@/types'

const Setting = ({ handleChangeSetting }: { handleChangeSetting: (v: BaseSetting) => void }) => {
  return (
    <section className="flex flex-col w-full gap-[10px]">
      <h2 className="text-[20px] text-[#333] w-full">기본 설정</h2>
      <div className="flex w-full gap-x-[20px] gap-y-[10px]">
        <label className="text-[12px] flex items-center gap-[4px] select-none cursor-pointer">
          <input type="checkbox" checked={true} onChange={() => null} /> 데이오프
        </label>
      </div>
    </section>
  )
}

export default Setting
