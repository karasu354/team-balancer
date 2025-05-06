import React, { useState } from 'react'

interface Option {
  label: string
  value: string
}

interface Props {
  value: string
  setValue: (value: string) => void
  label: string
  options: Option[]
}

const Dropdown: React.FC<Props> = ({ value, setValue, label, options }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative w-full">
      <select
        id="dropdown-field"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="h-10 w-80 rounded-md border-2 border-gray-400 bg-white px-2 pt-3 text-gray-900 outline-none focus:border-blue-500"
        required
      >
        <option value="" disabled hidden />
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        htmlFor="dropdown-field"
        className={`pointer-events-none absolute left-2 transition-all duration-300 ${
          isFocused || value
            ? 'top-0 px-1 text-xs text-gray-400'
            : 'top-1/2 -translate-y-1/2'
        }`}
      >
        {label}
      </label>
    </div>
  )
}

export default Dropdown
