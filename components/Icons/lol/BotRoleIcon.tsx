import React from 'react'

import IconBase from '../IconBase'

const TopRoleIcon: React.FC<{
  className?: string
  color?: string
  size?: number
}> = ({ className, color, size }) => {
  return (
    <IconBase
      className={className}
      color={color}
      size={size}
      viewBox="0 0 271 266"
    >
      <path
        d="M99.922 97.3495H171.153V168.581H99.922V97.3495Z"
        fill="currentColor"
        opacity={0.2}
      />
      <path
        d="M30.934 265.93H270.877V25.9871L218.641 78.2234V216.068H80.7959L30.934 265.93Z"
        fill="currentColor"
        opacity={0.2}
      />
      <path
        d="M186.56 49.8619H52.4344V183.988L0.19812 236.224V0H236.422L186.56 49.8619Z"
        fill="currentColor"
        opacity={0.2}
      />
      <path
        d="M30.934 265.93H270.877V25.9871L218.641 78.2234V216.068H80.7959L30.934 265.93Z"
        fill="currentColor"
      />
    </IconBase>
  )
}

export default TopRoleIcon
