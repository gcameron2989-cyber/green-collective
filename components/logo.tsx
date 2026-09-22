import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#0f382c] select-none ${className}`}>
      {/* Explicit width and height so Next.js renders the image immediately */}
      <Image
        src="/logo.jpg"
        alt="Green Collective Logo"
        width={32}
        height={32}
        className="rounded-md object-cover shadow-sm border border-emerald-900/10"
        priority
      />

      {/* Brand text wordmark */}
      <span>
        Green <span className="text-emerald-600">Collective</span>
      </span>
    </div>
  );
}
