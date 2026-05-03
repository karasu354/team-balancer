import React from 'react'

interface Option {
  label: string
  value: string
}

interface Props {
  value: string
  setValue: (value: string) => void
  label: string
  options: Option[]
  description?: string
  required?: boolean
}

const Dropdown: React.FC<Props> = ({
  value,
  setValue,
  label,
  options,
  description,
  required = true,
}) => {
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between">
        <label
          htmlFor="dropdown-field"
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
        {required && <span className="text-xs text-red-500">※必須</span>}
      </div>

      {description && (
        <p className="mb-2 text-xs text-slate-500">{description}</p>
      )}

      <select
        id="dropdown-field"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-10 w-80 rounded-md border-2 border-gray-400 bg-white px-2 py-2 text-gray-900 outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-300"
        required={required}
      >
        <option value="" disabled hidden />
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Dropdown
