import React, { useState } from 'react'

import { TeamBalancer } from '../utils/teamBalancer'
import ChatLogInputForm from './Form/ChatLogInputForm'
import SinglePlayerInputForm from './Form/SinglePlayerInputForm'
import Tabs from './Navigation/Tabs'

interface PlayerInputFormProps {
  teamBalancer: TeamBalancer
  onAppUpdate: () => void
}

const PlayerInputForm: React.FC<PlayerInputFormProps> = ({
  teamBalancer,
  onAppUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0)

  return (
    <div className="w-full">
      <div className="mb-2 text-xs text-slate-500">
        入力方式を選択してください（Single: 1人ずつ / Multi:
        チャットログから一括追加）
      </div>
      <div className="pb-4">
        <Tabs
          labels={['Single', 'Multi']}
          activeTab={activeTab}
          onActiveTab={setActiveTab}
        />
      </div>
      <div>
        {activeTab === 0 ? (
          <SinglePlayerInputForm
            teamBalancer={teamBalancer}
            onAppUpdate={onAppUpdate}
          />
        ) : (
          <ChatLogInputForm
            teamBalancer={teamBalancer}
            onAppUpdate={onAppUpdate}
          />
        )}
      </div>
    </div>
  )
}

export default PlayerInputForm
