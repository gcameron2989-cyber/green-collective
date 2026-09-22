import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#0f382c] select-none ${className}`}>
      {/* Scaled down into a compact square icon to fit the navbar height */}
      <div className="relative w-9 h-9 overflow-hidden rounded-md border border-emerald-900/10">
        <Image
          src="/logo.jpg"
          alt="Green Collective Logo"
          fill
          className="object-cover scale-110"
          priority
        />
      </div>

      {/* Wordmark */}
      <span>
        Green <span className="text-emerald-600">Collective</span>
      </span>
    </div>
  );
}
