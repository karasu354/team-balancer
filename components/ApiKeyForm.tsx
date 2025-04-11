import React, { useState } from 'react'

interface ApiKeyFormProps {
  onApiKeySubmit: (apiKey: string) => void
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApiKeySubmit(apiKey)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4"
    >
      <input
        type="password"
        placeholder="Enter Riot API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="p-2 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        保存
      </button>
    </form>
  )
}

export default ApiKeyForm
