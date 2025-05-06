import React from 'react'

import IconBase from '../IconBase'

const SupRoleIcon: React.FC<{
  className?: string
  color?: string
  size?: number
}> = ({ className, color, size }) => {
  return (
    <IconBase
      className={className}
      color={color}
      size={size}
      viewBox="0 0 324 271"
    >
      <path
        d="M149.918 93.7879L160.603 108.034L172.475 93.7879L200.967 238.625L160.603 270.679L122.613 238.625L149.918 93.7879Z"
        fill="currentColor"
      />
      <path
        d="M208.09 154.335L186.721 85.4776L218.775 53.4235L323.247 56.9851C318.499 62.1295 306.389 72.8934 295.942 79.5416C285.495 86.1899 271.011 93.7879 257.952 94.9751H230.647L257.952 134.152L208.09 154.335Z"
        fill="currentColor"
      />
      <path
        d="M160.603 77.1673L111.928 21.3694L122.613 0H200.967L210.465 21.3694L160.603 77.1673Z"
        fill="currentColor"
      />
      <path
        d="M133.297 85.4776L104.805 56.9851H0.332153C4.28945 60.1509 7.45529 70.0441 31.1991 81.916C49.5762 91.1046 64.8361 95.3708 68.0019 94.9751H91.7457L64.4403 134.152L115.489 154.335L133.297 85.4776Z"
        fill="currentColor"
      />
    </IconBase>
  )
}

export default SupRoleIcon
