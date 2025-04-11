import React, { useState } from 'react'

import { TeamDivider } from '../utils/team-divider'

interface ChatLogInputFormProps {
  teamDivider: TeamDivider
  onPlayersUpdate: () => void
}

const ChatLogInputForm: React.FC<ChatLogInputFormProps> = ({
  teamDivider,
  onPlayersUpdate,
}) => {
  const [logInput, setLogInput] = useState<string>('')

  const handleLogSubmit = () => {
    if (logInput.trim()) {
      teamDivider.getPlayersByLog(logInput)
      onPlayersUpdate()
      setLogInput('') // 入力内容をクリア
    }
  }

  return (
    <div className="flex flex-col items-start space-y-2 w-full max-w-md">
      <textarea
        value={logInput}
        onChange={(e) => setLogInput(e.target.value)}
        placeholder={`Player1 #JP1がロビーに参加しました。
Player2 #meowがロビーに参加しました。
Player1 #JP1がロビーから退出しました。
Player3 #catがロビーに参加しました。
Player4 #dogがロビーに参加しました。
Player2 #meowがロビーから退出しました。`}
        className="w-full p-2 border border-gray-300 rounded resize-none"
        rows={4}
      />
      <button
        onClick={handleLogSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        取り込む
      </button>
    </div>
  )
}

export default ChatLogInputForm
