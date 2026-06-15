/** Pill-shaped status badge with color based on order status */
export function StatusBadge({ status }) {
  const styles = {
    NEW: 'bg-brass/20 text-brass-dark',
    CONFIRMED: 'bg-sage/20 text-sage-dark',
    PREPARING: 'bg-sage/20 text-sage-dark',
    OUT_FOR_DELIVERY: 'bg-walnut/10 text-walnut',
    DELIVERED: 'bg-sage/30 text-sage-dark',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  const label = status?.replace(/_/g, ' ') || 'UNKNOWN';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-walnut/10 text-walnut'}`}>
      {label}
    </span>
  );
}

/** Simple card container used throughout the dashboard */
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-almond-light rounded-2xl border border-walnut/10 shadow-card ${className}`}>
      {children}
    </div>
  );
}

/** A modal dialog with a backdrop */
export function Modal({ title, onClose, children, wide = false }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-walnut-dark/60 backdrop-blur-sm px-4 py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} bg-almond rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-walnut/10">
          <h2 className="font-display text-xl text-walnut">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-walnut text-almond-light hover:bg-sage transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Reusable text/number/select form field */
export function Field({ label, name, value, onChange, type = 'text', required = false, as = 'input', options = [], placeholder, step }) {
  const baseClasses = 'w-full px-4 py-2.5 rounded-xl border border-walnut/15 bg-almond-light focus:outline-none focus:border-sage text-sm';

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-walnut/80 mb-1.5">
        {label}{required && <span className="text-sage-dark"> *</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={3}
          placeholder={placeholder}
          className={baseClasses}
        />
      ) : as === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClasses}
        >
          <option value="">Select…</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          step={step}
          className={baseClasses}
        />
      )}
    </div>
  );
}

/** Primary action button */
export function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) {
  const variants = {
    primary: 'bg-walnut text-almond-light hover:bg-sage',
    secondary: 'border border-walnut/20 text-walnut hover:border-sage hover:text-sage-dark',
    danger: 'border border-red-200 text-red-700 hover:bg-red-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
