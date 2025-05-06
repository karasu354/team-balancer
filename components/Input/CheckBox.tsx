import React from 'react'

interface Option<T> {
  label: string
  value: T
}

interface Props<T> {
  values: T[]
  setValues: (values: T[]) => void
  label: string
  options: Option<T>[]
}

const CheckBox = <T,>({ values, setValues, label, options }: Props<T>) => {
  const handleCheck = (optionValue: T) => {
    if (values.includes(optionValue)) {
      setValues(values.filter((value) => value !== optionValue))
    } else {
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
              key={option.value as React.Key}
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
