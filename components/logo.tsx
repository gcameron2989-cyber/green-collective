import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* Rectangular container proportioned for your full logo.jpg image */}
      <div className="relative w-36 h-10">
        <Image
          src="/logo.jpg"
          alt="Green Collective Logo"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
    </div>
  );
}
