export default function Footer() {
  return (
    <footer className="bg-walnut text-almond-light mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <span className="font-display text-2xl tracking-tight">Nutique Co</span>
          <p className="mt-3 text-sm text-almond/70 leading-relaxed max-w-xs">
            Thoughtfully assembled hampers for the people who matter — built by hand,
            wrapped with care, delivered across Sri Lanka.
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-brass-light mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-almond/80">
            <li><a href="/hampers" className="hover:text-sage-light transition-colors">All hampers</a></li>
            <li><a href="/build" className="hover:text-sage-light transition-colors">Build your own</a></li>
            <li><a href="/cart" className="hover:text-sage-light transition-colors">Your cart</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-brass-light mb-4">Get in touch</h4>
          <p className="text-sm text-almond/80 leading-relaxed">
            Orders are confirmed over WhatsApp — once you check out, we'll have
            your order details ready to send.
          </p>
        </div>
      </div>

      <div className="border-t border-almond/10 py-5 text-center text-xs text-almond/50">
        © {new Date().getFullYear()} Nutique Co. Made with care in Sri Lanka.
      </div>
    </footer>
  );
}
