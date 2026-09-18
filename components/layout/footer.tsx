export default function Footer() {
  return (
    <footer className="py-6 px-6 text-xs text-muted-foreground border-t border-emerald-900/10 bg-background/80 backdrop-blur-md z-10 text-center">
      <span>© {new Date().getFullYear()} Green Collective. All rights reserved.</span>
    </footer>
  )
}
