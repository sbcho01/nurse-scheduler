import { twMerge } from 'tailwind-merge'

export const Text = ({
  type,
  label,
  value,
  onChange,
}: {
  type: string
  label: string
  value: string | number
  onChange: (v: string | number) => void
}) => {
  return (
    <div className="flex items-center gap-[4px]">
      {label} :{' '}
      <input
        className={twMerge(
          'h-[36px] px-[10px] border border-[#d1d5db] rounded-[6px] text-[14px]',
          type === 'number' ? 'w-[80px]' : 'w-[200px]'
        )}
        type={type || 'string'}
        value={value || ''}
        min={1}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
