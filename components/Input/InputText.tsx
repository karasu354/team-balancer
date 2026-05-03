import React, { forwardRef } from 'react'

interface Props {
  value: string
  setValue: (value: string) => void
  label: string
  errorMessage?: string
  description?: string
  required?: boolean
}

const InputText = forwardRef<HTMLInputElement, Props>(
  (
    { value, setValue, label, errorMessage, description, required = true },
    ref
  ) => {
    return (
      <div className="w-full">
        <div className="mb-1 flex items-center justify-between">
          <label
            htmlFor="input-field"
            className="text-sm font-medium text-slate-700"
          >
            {label}
          </label>
          {required && <span className="text-xs text-red-500">※必須</span>}
        </div>

        {description && (
          <p className="mb-2 text-xs text-slate-500">{description}</p>
        )}

        <input
          ref={ref}
          id="input-field"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder=""
          className={`h-10 w-80 rounded-md border-2 bg-white px-2 py-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
            errorMessage
              ? 'border-red-500 focus-visible:border-red-600'
              : 'border-gray-400 focus-visible:border-blue-500'
          }`}
          required={required}
        />

        {errorMessage && (
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
    )
  }
)

InputText.displayName = 'InputText'

export default InputText
