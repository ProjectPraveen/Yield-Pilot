interface YPLogoProps {
  size?: number;
  className?: string;
}

export function YPLogo({ size = 30, className }: YPLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="yp-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
      {/* Y letterform */}
      <path d="M2 4L8 13L8 23" stroke="url(#yp-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4L8 13" stroke="url(#yp-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* P backbone */}
      <path d="M16 4L16 25" stroke="url(#yp-grad)" strokeWidth="2.5" strokeLinecap="round" />
      {/* P bowl */}
      <path d="M16 4 Q25 4 25 10 Q25 16 16 16" stroke="url(#yp-grad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Rising bar chart inside P bowl */}
      <rect x="18" y="12" width="1.8" height="3" rx="0.4" fill="url(#yp-grad)" />
      <rect x="21" y="10" width="1.8" height="5" rx="0.4" fill="url(#yp-grad)" />
      <rect x="24" y="7.5" width="1.8" height="7.5" rx="0.4" fill="url(#yp-grad)" />
    </svg>
  );
}
