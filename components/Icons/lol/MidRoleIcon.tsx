import React from 'react'

import IconBase from '../IconBase'

const MidRoleIcon: React.FC<{
  className?: string
  color?: string
  size?: number
}> = ({ className, color, size }) => {
  return (
    <IconBase
      className={className}
      color={color}
      size={size}
      viewBox="0 0 272 266"
    >
      <path
        d="M0.702637 0H201.93L152.068 49.8619H52.9389V148.991L0.702637 201.227V0Z"
        fill="currentColor"
        opacity={0.2}
      />
      <path
        d="M70.3004 265.93H271.382V64.8484L219.145 117.085V216.068H120.162L70.3004 265.93Z"
        fill="currentColor"
        opacity={0.2}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M271.382 43.2903L48.7417 265.93H0.702637V222.785L223.488 0H271.382V43.2903Z"
        fill="currentColor"
      />
    </IconBase>
  )
}

export default MidRoleIcon
