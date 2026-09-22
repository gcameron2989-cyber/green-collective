import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#0f382c] select-none ${className}`}>
      {/* Explicitly sized image wrapper that guarantees visibility */}
      <div className="flex items-center justify-center overflow-hidden rounded-md bg-emerald-50 border border-emerald-900/10 p-0.5">
        <Image
          src="/logo.jpg"
          alt="Green Collective Logo"
          width={32}
          height={32}
          className="object-contain"
          priority
        />
      </div>

      <span>
        Green <span className="text-emerald-600">Collective</span>
      </span>
    </div>
  );
}
