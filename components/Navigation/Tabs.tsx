import React, { useState } from 'react'

interface TabsProps {
  labels: string[]
  activeTab: number
  onActiveTab: (index: number) => void
}

const Tabs: React.FC<TabsProps> = ({ labels, activeTab, onActiveTab }) => {
  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="relative">
        <ul
          className="relative flex list-none flex-wrap rounded-md bg-gray-200"
          role="list"
        >
          {/* 背景色の移動用の要素 */}
          <div
            className={`absolute top-0 left-0 h-full rounded-md ${activeTab >= 0 && 'bg-blue-500'} transition-transform duration-300`}
            style={{
              width: `${100 / labels.length}%`,
              transform: `translateX(${activeTab * 100}%)`,
            }}
          ></div>

          {labels.map((label, index) => (
            <li
              key={index}
              className="z-30 flex-1 text-center"
              role="tab"
              aria-selected={activeTab === index}
            >
              <button
                onClick={() => onActiveTab(index)}
                className={`z-30 flex w-full cursor-pointer items-center justify-center rounded-md border-0 p-3 text-sm transition-all duration-300 ease-in-out ${
                  activeTab === index && 'text-white'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Tabs
