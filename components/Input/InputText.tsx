import React, { useState } from 'react'

interface Props {
  value: string
  setValue: (value: string) => void
  label: string
}

const InputText: React.FC<Props> = ({ value, setValue, label }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative w-full">
      <input
        id="input-field"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="h-10 w-80 rounded-md border-2 border-gray-400 bg-white px-2 pt-3 outline-none focus:border-blue-500"
        required
      />

      <label
        htmlFor="input-field"
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

export default InputText
