import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 font-bold text-xl tracking-tight text-[#0f382c] select-none ${className}`}>
      {/* Fixed square container that matches the navbar height cleanly */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <Image
          src="/logo.jpg"
          alt="Green Collective Logo"
          fill
          className="object-contain rounded-md"
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
