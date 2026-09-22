import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#0f382c] select-none ${className}`}>
      {/* Standard non-fill image configuration */}
      <Image
        src="/logo.jpg"
        alt="Green Collective Logo"
        width={36}
        height={36}
        className="object-contain rounded-md"
        priority
      />

      <span>
        Green <span className="text-emerald-600">Collective</span>
      </span>
    </div>
  );
}
