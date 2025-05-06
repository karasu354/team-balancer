import React from 'react'

interface Props {
  value: string
  setValue: (value: string) => void
  placeholder?: string
}

const Textarea: React.FC<Props> = ({ value, setValue, placeholder }) => {
  return (
    <div className="w-full">
      <textarea
        id="textarea-field"
        value={value}
        placeholder={placeholder || ''}
        onChange={(e) => setValue(e.target.value)}
        className="h-50 w-full resize-none rounded-md border-2 border-gray-400 bg-white p-2 text-gray-900 outline-none focus:border-blue-500"
        required
      />
    </div>
  )
}

export default Textarea
