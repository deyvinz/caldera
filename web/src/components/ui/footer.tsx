export function Footer() {
  return (
    <footer className="border-t border-emerald-900/10 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-charcoal-900/70 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Caldera Luxury Travel</p>
        <nav className="flex gap-4">
          <a href="#" className="hover:text-emerald-900">Privacy</a>
          <a href="#" className="hover:text-emerald-900">Terms</a>
          <a href="#" className="hover:text-emerald-900">Contact</a>
        </nav>
      </div>
    </footer>
  );
}


