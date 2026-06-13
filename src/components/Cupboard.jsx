import { useEffect, useRef } from 'react';

/**
 * The Cupboard component renders a closed wooden cupboard with two doors.
 * Clicking it opens a fullscreen modal showing shelves of content
 * (passed as children, organized by the parent into shelf groups).
 *
 * Props:
 * - title: heading shown in the modal
 * - subtitle: small description under the title
 * - isOpen: whether the modal is open
 * - onOpen / onClose: handlers
 * - children: shelf content (rendered inside the modal)
 */
export default function Cupboard({ title, subtitle, isOpen, onOpen, onClose, children }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Closed cupboard - clickable */}
      <button
        type="button"
        onClick={onOpen}
        className="group relative w-full max-w-md mx-auto block focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-4 focus-visible:ring-offset-almond rounded-2xl"
        aria-haspopup="dialog"
      >
        <CupboardIllustration />
        <span className="absolute inset-x-0 bottom-5 text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-almond-light text-walnut text-sm font-medium shadow-card group-hover:bg-brass group-hover:text-walnut-dark transition-colors">
            Open the cupboard
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </span>
      </button>

      {/* Fullscreen modal with shelves */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex flex-col bg-walnut-dark/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="mx-auto my-4 sm:my-8 w-[95%] sm:w-[90%] max-w-5xl flex-1 flex flex-col bg-almond rounded-3xl shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 px-6 sm:px-10 pt-6 sm:pt-8 pb-4 border-b border-walnut/10 wood-grain">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display text-walnut">{title}</h2>
                {subtitle && <p className="mt-1 text-sm text-walnut/70 max-w-md">{subtitle}</p>}
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close cupboard"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-walnut text-almond-light hover:bg-sage transition-colors shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Shelves - scrollable content area */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 scrollbar-thin">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * A single shelf row - a labeled wooden shelf with items arranged on top.
 */
export function Shelf({ label, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="font-display text-lg text-walnut">{label}</h3>
        <div className="flex-1 h-px bg-walnut/15" />
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin -mx-1 px-1">
          {children}
        </div>
        {/* Shelf board */}
        <div className="h-3 rounded-b-md bg-walnut wood-grain shelf-shadow" />
      </div>
    </div>
  );
}

/** Simple SVG illustration of a closed two-door cupboard */
function CupboardIllustration() {
  return (
    <svg viewBox="0 0 400 360" className="w-full h-auto drop-shadow-xl" role="img" aria-hidden="true">
      {/* Outer frame */}
      <rect x="20" y="20" width="360" height="320" rx="14" fill="#6B4F3F" />
      <rect x="32" y="32" width="336" height="296" rx="10" fill="#4A352A" />

      {/* Left door */}
      <rect x="44" y="44" width="156" height="272" rx="6" fill="#5C4434" stroke="#33231A" strokeWidth="2" />
      {/* Right door */}
      <rect x="200" y="44" width="156" height="272" rx="6" fill="#5C4434" stroke="#33231A" strokeWidth="2" />

      {/* Door panel details */}
      <rect x="58" y="60" width="128" height="110" rx="4" fill="none" stroke="#33231A" strokeWidth="1.5" opacity="0.5" />
      <rect x="58" y="186" width="128" height="110" rx="4" fill="none" stroke="#33231A" strokeWidth="1.5" opacity="0.5" />
      <rect x="214" y="60" width="128" height="110" rx="4" fill="none" stroke="#33231A" strokeWidth="1.5" opacity="0.5" />
      <rect x="214" y="186" width="128" height="110" rx="4" fill="none" stroke="#33231A" strokeWidth="1.5" opacity="0.5" />

      {/* Brass handles */}
      <rect x="178" y="170" width="8" height="36" rx="4" fill="#D1B27C" />
      <rect x="214" y="170" width="8" height="36" rx="4" fill="#D1B27C" />

      {/* Feet */}
      <rect x="56" y="332" width="16" height="14" rx="3" fill="#33231A" />
      <rect x="328" y="332" width="16" height="14" rx="3" fill="#33231A" />

      {/* Subtle sage accent ribbon top */}
      <rect x="32" y="32" width="336" height="8" fill="#8C9574" opacity="0.6" />
    </svg>
  );
}
