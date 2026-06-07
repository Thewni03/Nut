// Base URL for the Spring Boot backend API.
// In development this points to localhost:8080.
// In production, set VITE_API_BASE_URL in your .env file.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch {
      // response body wasn't JSON - ignore
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // ---- Products ----
  getProducts: (category) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return request(`/api/products${query}`);
  },
  getCustomBuilderProducts: () => request('/api/products/custom-builder'),
  getProductCategories: () => request('/api/products/categories'),
  getProduct: (id) => request(`/api/products/${id}`),

  // ---- Hampers ----
  getHampers: (occasion) => {
    const query = occasion ? `?occasion=${encodeURIComponent(occasion)}` : '';
    return request(`/api/hampers${query}`);
  },
  getFeaturedHampers: () => request('/api/hampers/featured'),
  getOccasions: () => request('/api/occasions'),
  getHamper: (id) => request(`/api/hampers/${id}`),

  // ---- Orders ----
  placeOrder: (orderData) =>
    request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
};

export default api;
