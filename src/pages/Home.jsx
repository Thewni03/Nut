import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import HamperCard from '../components/HamperCard';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addHamper } = useCart();

  useEffect(() => {
    api
      .getFeaturedHampers()
      .then(setFeatured)
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-24 pb-16 sm:pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sage-dark font-medium mb-4">
              Handpacked in Sri Lanka
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-walnut leading-[1.1] tracking-tight">
              A hamper for
              <br />
              <span className="text-sage-dark">every moment</span>
              <br />
              that matters.
            </h1>
            <p className="mt-6 text-walnut/70 text-base sm:text-lg leading-relaxed max-w-md">
              From a quiet thank you to a celebration that deserves the works —
              choose a ready-made hamper, or open the cupboard and build one
              entirely your own.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/hampers"
                className="px-6 py-3.5 rounded-full bg-walnut text-almond-light font-medium hover:bg-sage transition-colors"
              >
                Browse hampers
              </Link>
              <Link
                to="/build"
                className="px-6 py-3.5 rounded-full border border-walnut/20 text-walnut font-medium hover:border-sage hover:text-sage-dark transition-colors"
              >
                Build your own
              </Link>
            </div>
          </div>

          <div className="relative">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid sm:grid-cols-2 gap-6">
          <PathCard
            to="/hampers"
            eyebrow="Ready to gift"
            title="Choose a hamper"
            description="Browse hampers curated for birthdays, anniversaries, Avurudu, Christmas and more — ready to order as they are."
          />
          <PathCard
            to="/build"
            eyebrow="Make it personal"
            title="Build your own"
            description="Pick a box size, then open the cupboard and choose each item yourself — for a hamper that feels truly thought through."
          />
        </div>
      </section>

      {/* Featured hampers */}
      {!loading && featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sage-dark font-medium mb-2">Featured</p>
              <h2 className="font-display text-2xl sm:text-3xl text-walnut">A few favourites</h2>
            </div>
            <Link to="/hampers" className="text-sm font-medium text-sage-dark hover:text-walnut transition-colors hidden sm:block">
              View all hampers →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((hamper) => (
              <HamperCard key={hamper.id} hamper={hamper} onAdd={addHamper} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PathCard({ to, eyebrow, title, description }) {
  return (
    <Link
      to={to}
      className="group relative p-8 rounded-3xl bg-almond-light border border-walnut/10 hover:border-sage/40 shadow-card transition-colors flex flex-col gap-3"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-brass-dark font-medium">{eyebrow}</p>
      <h3 className="font-display text-2xl sm:text-3xl text-walnut">{title}</h3>
      <p className="text-walnut/65 leading-relaxed">{description}</p>
      <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sage-dark group-hover:gap-3 transition-all">
        Open the cupboard
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 420" className="w-full h-auto" role="img" aria-hidden="true">
      {/* Backdrop shape */}
      <ellipse cx="240" cy="360" rx="200" ry="32" fill="#EADFCC" />

      {/* Hamper basket */}
      <g>
        <path d="M110 230 L370 230 L340 360 L140 360 Z" fill="#6B4F3F" />
        <path d="M110 230 L370 230 L362 250 L118 250 Z" fill="#8C6F58" />
        {/* Weave lines */}
        {[270, 290, 310, 330, 350].map((y, i) => (
          <line key={i} x1={122 + i * 1.5} y1={y} x2={358 - i * 1.5} y2={y} stroke="#33231A" strokeWidth="1.5" opacity="0.25" />
        ))}
        {/* Handle */}
        <path d="M170 230 C170 160 310 160 310 230" fill="none" stroke="#4A352A" strokeWidth="14" strokeLinecap="round" />
      </g>

      {/* Items poking out of the hamper */}
      <g>
        {/* Tea box */}
        <rect x="150" y="170" width="60" height="70" rx="4" fill="#8C9574" />
        <rect x="150" y="170" width="60" height="14" rx="4" fill="#6E7659" />

        {/* Candle jar */}
        <rect x="225" y="150" width="46" height="90" rx="8" fill="#FAF6EF" stroke="#EADFCC" strokeWidth="2" />
        <rect x="240" y="138" width="16" height="16" rx="2" fill="#B8924F" />

        {/* Wrapped chocolate box */}
        <rect x="285" y="175" width="64" height="65" rx="4" fill="#D1B27C" />
        <rect x="285" y="200" width="64" height="10" fill="#4A352A" opacity="0.4" />
        <rect x="310" y="175" width="10" height="65" fill="#4A352A" opacity="0.4" />

        {/* Ribbon bow on top */}
        <circle cx="240" cy="120" r="10" fill="#8C9574" />
        <path d="M240 120 C220 100 200 110 210 130 C220 145 240 130 240 120" fill="#8C9574" />
        <path d="M240 120 C260 100 280 110 270 130 C260 145 240 130 240 120" fill="#A8B091" />
      </g>

      {/* Small floating leaf accents */}
      <g opacity="0.6">
        <path d="M80 120 C100 110 100 140 80 150 C60 140 60 110 80 120Z" fill="#8C9574" />
        <path d="M420 160 C440 150 440 180 420 190 C400 180 400 150 420 160Z" fill="#B8924F" />
      </g>
    </svg>
  );
}
