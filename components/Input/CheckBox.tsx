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
  description?: string
  required?: boolean
}

const CheckBox = <T,>({
  values,
  setValues,
  label,
  options,
  description,
  required = true,
}: Props<T>) => {
  const handleCheck = (optionValue: T) => {
    if (values.includes(optionValue)) {
      setValues(values.filter((value) => value !== optionValue))
    } else {
      setValues([...values, optionValue])
    }
  }

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--tb-text-primary)]">
          {label}
        </label>
        {required && <span className="text-xs text-red-500">※必須</span>}
      </div>

      {description && (
        <p className="mb-2 text-xs text-slate-500">{description}</p>
      )}

      <div className="relative w-full">
        <div className="flex w-full flex-col rounded-md border-2 border-gray-400 bg-white">
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
    </div>
  )
}

export default CheckBox
