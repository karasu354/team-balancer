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
        d="M171.225 168.581L99.9934 168.581L99.9934 97.3495L171.225 97.3495L171.225 168.581Z"
        fill="currentColor"
        opacity={0.2}
      />
      <path
        d="M240.213 2.68702e-06L0.269539 2.36635e-05L0.269559 239.943L52.5059 187.707L52.5059 49.8619L190.351 49.8619L240.213 2.68702e-06Z"
        fill="currentColor"
        opacity={0.2}
      />
      <path
        d="M84.5866 216.068L218.712 216.068L218.712 81.9427L270.949 29.7064L270.949 265.93L34.7247 265.93L84.5866 216.068Z"
        fill="currentColor"
        opacity={0.2}
      />
      <path
        d="M240.213 2.68702e-06L0.269539 2.36635e-05L0.269559 239.943L52.5059 187.707L52.5059 49.8619L190.351 49.8619L240.213 2.68702e-06Z"
        fill="currentColor"
      />
    </IconBase>
  )
}

export default TopRoleIcon
