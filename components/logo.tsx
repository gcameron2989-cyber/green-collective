export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#0f382c] select-none ${className}`}>
      <div className="w-9 h-9 flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm border border-emerald-950/20 p-1">
        <img
          src="/logo.jpg"
          alt="Green Collective Logo"
          className="w-full h-full object-contain"
        />
      </div>

      <span>
        Green <span className="text-emerald-600">Collective</span>
      </span>
    </div>
  );
}
