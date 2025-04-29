import React from 'react'

interface Option {
  label: string
  value: string
}

interface Props {
  values: string[]
  setValues: (values: string[]) => void
  label: string
  options: Option[]
}

const CheckBox: React.FC<Props> = ({ values, setValues, label, options }) => {
  const handleCheck = (optionValue: string) => {
    if (values.includes(optionValue)) {
      // 選択済みの場合は削除
      setValues(values.filter((value) => value !== optionValue))
    } else {
      // 未選択の場合は追加
      setValues([...values, optionValue])
    }
  }

  return (
    <div className="relative w-full">
      <div className="flex w-100 flex-col rounded-md border-2 border-gray-400 bg-white">
        <p className="p-2 text-gray-900 select-none">{label}</p>
        <nav className="flex justify-between gap-2 p-2">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleCheck(option.value)}
              className={`min-w-[20px] flex-1 cursor-pointer rounded-md p-1 text-center text-sm transition-colors select-none hover:bg-gray-300 ${
                values.includes(option.value)
                  ? 'bg-gray-200 text-gray-900'
                  : 'bg-white text-gray-400'
              }`}
            >
              {option.label}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default CheckBox
