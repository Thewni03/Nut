/** Formats a number as Sri Lankan Rupees, e.g. 1500 -> "Rs. 1,500" */
export function formatPrice(amount) {
  const rounded = Math.round(amount);
  return `Rs. ${rounded.toLocaleString('en-LK')}`;
}
