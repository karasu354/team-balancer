import React from 'react'

interface IconBaseProps {
  className?: string
  color?: string
  size?: number
  viewBox?: string
  children: React.ReactNode
}

const IconBase: React.FC<IconBaseProps> = ({
  className,
  color = 'currentColor',
  size,
  viewBox = '0 0 24 24',
  children,
}) => {
  return (
    <svg
      className={`inline-block align-middle ${className}`}
      fill={color}
      width={size || undefined}
      height={size || undefined}
      viewBox={viewBox}
    >
      {children}
    </svg>
  )
}

export default IconBase
