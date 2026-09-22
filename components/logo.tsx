import Image from "next/image";

export default function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#0f382c] select-none">
      {/* Increased wrapper size so the JPEG is easily visible */}
      <div className={`relative w-10 h-10 ${className}`}>
        <Image
          src="/logo.jpeg"
          alt="Green Collective Logo"
          fill
          className="object-contain rounded-md"
          priority
        />
      </div>

      <span>
        Green <span className="text-emerald-600">Collective</span>
      </span>
    </div>
  );
}
