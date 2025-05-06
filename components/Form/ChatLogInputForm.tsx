import React, { useState } from 'react'

import { TeamBalancer } from '../../utils/teamBalancer'
import Textarea from '../Input/Textarea'

interface ChatLogInputFormProps {
  teamBalancer: TeamBalancer
  onAppUpdate: () => void
}

const ChatLogInputForm: React.FC<ChatLogInputFormProps> = ({
  teamBalancer,
  onAppUpdate,
}) => {
  const [logInput, setLogInput] = useState<string>('')

  const handleLogSubmit = () => {
    if (logInput.trim()) {
      teamBalancer.addPlayersByLog(logInput)
      onAppUpdate()
      setLogInput('')
    }
  }

  return (
    <div className="mb-4 flex w-full max-w-4xl flex-col space-y-2">
      <Textarea
        value={logInput}
        setValue={setLogInput}
        placeholder={`Player1 #JP1がロビーに参加しました。
Player2 #meowがロビーに参加しました。
Player1 #JP1がロビーから退出しました。
Player3 #catがロビーに参加しました。
Player4 #dogがロビーに参加しました。
Player2 #meowがロビーから退出しました。`}
      />
      <button
        onClick={handleLogSubmit}
        className="rounded bg-blue-500 px-4 py-2 whitespace-nowrap text-white transition hover:bg-blue-600"
      >
        Import
      </button>
    </div>
  )
}

export default ChatLogInputForm
