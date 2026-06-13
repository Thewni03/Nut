import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-almond-light/95 backdrop-blur-sm border-b border-walnut/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-walnut text-almond-light font-display text-lg tracking-wide group-hover:bg-sage transition-colors">
            N
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl text-walnut tracking-tight">Nutique Co</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-sage-dark">Curated Hampers</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-walnut/80">
          <Link to="/" className="hover:text-sage-dark transition-colors">Home</Link>
          <Link to="/hampers" className="hover:text-sage-dark transition-colors">Hampers</Link>
          <Link to="/build" className="hover:text-sage-dark transition-colors">Build Your Own</Link>
        </nav>

        <Link
          to="/cart"
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-walnut text-almond-light text-sm font-medium hover:bg-sage transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span className="hidden sm:inline">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-brass text-walnut text-[11px] font-semibold">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
