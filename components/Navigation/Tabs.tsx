import React from 'react'

interface TabsProps {
  labels: string[]
  activeTab: number
  onActiveTab: (index: number) => void
}

const Tabs: React.FC<TabsProps> = ({ labels, activeTab, onActiveTab }) => {
  return (
    <div className="w-full rounded-md border border-[var(--tb-border)] bg-[#0b1730] p-1">
      <ul className="flex list-none flex-wrap gap-1" role="tablist">
        {labels.map((label, index) => (
          <li key={label} className="flex-1 text-center" role="presentation">
            <button
              onClick={() => onActiveTab(index)}
              role="tab"
              aria-selected={activeTab === index}
              className={`w-full rounded px-3 py-2 text-sm font-semibold transition ${
                activeTab === index
                  ? 'bg-[var(--tb-accent)] text-white'
                  : 'text-[var(--tb-text-secondary)] hover:bg-[var(--tb-surface-muted)] hover:text-[var(--tb-text-primary)]'
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Tabs
