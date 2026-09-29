export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#0f382c] select-none ${className}`}>
      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#0f382c] shadow-sm border border-emerald-950/20">
        <div className="w-2.5 h-2.5 bg-white flex items-center justify-center">
          <div className="w-1 h-1 bg-[#0f382c]" />
        </div>
      </div>

      <span>
        Green <span className="text-emerald-600">Collective</span>
      </span>
    </div>
  );
}
