import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#0f382c] select-none ${className}`}>
      {/* Fixed explicit width and height for a rectangular logo */}
      <Image
        src="/logo.jpg"
        alt="Green Collective Logo"
        width={120}
        height={40}
        className="object-contain"
        priority
      />
    </div>
  );
}
