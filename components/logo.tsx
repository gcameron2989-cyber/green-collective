import { Leaf } from "lucide-react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#0f382c] select-none ${className}`}>
      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm border border-emerald-900/10">
        <Leaf className="w-5 h-5" />
      </div>

      <span>
        Green <span className="text-emerald-600">Collective</span>
      </span>
    </div>
  );
}
