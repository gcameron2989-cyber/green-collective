import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#0f382c] select-none ${className}`}>
      {/* Compact icon wrapper for your logo graphic */}
      <div className="relative w-8 h-8 rounded-md overflow-hidden bg-white shadow-sm border border-emerald-900/10">
        <Image
          src="/logo.jpg"
          alt="Green Collective Logo"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Brand text wordmark */}
      <span>
        Green <span className="text-emerald-600">Collective</span>
      </span>
    </div>
  );
}
