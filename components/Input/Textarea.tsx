import React from 'react'

interface Props {
  value: string
  setValue: (value: string) => void
  placeholder?: string
  label?: string
  description?: string
  required?: boolean
}

const Textarea: React.FC<Props> = ({
  value,
  setValue,
  placeholder,
  label,
  description,
  required = true,
}) => {
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between">
          <label
            htmlFor="textarea-field"
            className="text-sm font-medium text-[var(--tb-text-primary)]"
          >
            {label}
          </label>
          {required && <span className="text-xs text-red-500">※必須</span>}
        </div>
      )}

      {description && (
        <p className="mb-2 text-xs text-slate-500">{description}</p>
      )}

      <textarea
        id="textarea-field"
        value={value}
        placeholder={placeholder || ''}
        onChange={(e) => setValue(e.target.value)}
        className="h-60 w-full resize-none rounded-md border-2 border-gray-400 bg-white p-2 text-gray-900 outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-300"
        required={required}
      />
    </div>
  )
}

export default Textarea
