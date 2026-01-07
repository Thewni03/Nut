const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch {
      // body wasn't JSON
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // ---- Auth ----
  login: (username, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // ---- Products ----
  getProducts: (token) => request('/api/admin/products', {}, token),
  createProduct: (token, product) =>
    request('/api/admin/products', { method: 'POST', body: JSON.stringify(product) }, token),
  updateProduct: (token, id, product) =>
    request(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }, token),
  deleteProduct: (token, id) =>
    request(`/api/admin/products/${id}`, { method: 'DELETE' }, token),
  getCategories: () => request('/api/products/categories'),

  // ---- Hampers ----
  getHampers: (token) => request('/api/admin/hampers', {}, token),
  createHamper: (token, hamper) =>
    request('/api/admin/hampers', { method: 'POST', body: JSON.stringify(hamper) }, token),
  updateHamper: (token, id, hamper) =>
    request(`/api/admin/hampers/${id}`, { method: 'PUT', body: JSON.stringify(hamper) }, token),
  deleteHamper: (token, id) =>
    request(`/api/admin/hampers/${id}`, { method: 'DELETE' }, token),
  getOccasions: () => request('/api/occasions'),

  // ---- Orders ----
  getOrders: (token, status) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request(`/api/admin/orders${query}`, {}, token);
  },
  getOrder: (token, id) => request(`/api/admin/orders/${id}`, {}, token),
  updateOrderStatus: (token, id, status, adminNote) =>
    request(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNote }),
    }, token),

  // ---- Customers ----
  getCustomers: (token) => request('/api/admin/customers', {}, token),

  // ---- Analytics ----
  getAnalytics: (token) => request('/api/admin/analytics', {}, token),

  // ---- Image upload ----
  // Images are uploaded as multipart/form-data and stored as Base64 in MongoDB.
  uploadProductImage: async (token, productId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/api/admin/images/product/${productId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new ApiError('Image upload failed', res.status);
    return res.json();
  },

  uploadHamperImage: async (token, hamperId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/api/admin/images/hamper/${hamperId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new ApiError('Image upload failed', res.status);
    return res.json();
  },
};

export { ApiError };
export default api;
