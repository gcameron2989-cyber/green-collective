import Image from "next/image";

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#0f382c] select-none">
      {/* Uploaded JPEG Logo Image */}
      <div className={`relative w-8 h-8 ${className}`}>
        <Image
          src="/logo.jpeg"
          alt="Green Collective Logo"
          fill
          className="object-contain rounded-md"
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
