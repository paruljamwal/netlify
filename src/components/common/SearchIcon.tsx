interface SearchIconProps {
  size?: number
  className?: string
}

export function SearchIcon({ size = 20, className = '' }: SearchIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="10.75"
        cy="10.75"
        r="6.25"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M15.5 15.5 20 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
