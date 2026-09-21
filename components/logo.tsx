export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#0f382c] select-none">
      {/* Icon: Connected Leaf & Network Node */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Outer Leaf Path */}
        <path
          d="M16 2C8.268 2 2 8.268 2 16c0 4.14 1.79 7.87 4.67 10.46L14 19l-2-5 5-2 7 7C25.63 21.6 28 19.04 28 16c0-7.732-6.268-14-14-14z"
          fill="#10b981"
          fillOpacity="0.15"
        />
        <path
          d="M16 2C8.268 2 2 8.268 2 16c0 7.732 6.268 14 14 14s14-6.268 14-14S23.732 2 16 2z"
          stroke="#0f382c"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Network Stem & Nodes */}
        <path
          d="M10 22C12 18 16 14 22 10"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="22" r="2.5" fill="#0f382c" />
        <circle cx="16" cy="16" r="2" fill="#10b981" />
        <circle cx="22" cy="10" r="3" fill="#0f382c" />
      </svg>

      {/* Wordmark */}
      <span>
        Green <span className="text-emerald-600">Collective</span>
      </span>
    </div>
  );
}
