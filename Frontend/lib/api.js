// lib/api.js
// IMPORTANT: You MUST replace this with the public URL of your deployed backend API.
// Example: const BASE_URL = "https://your-deployed-backend.vercel.app/api";
const BASE_URL = "http://localhost:3000/api" // <--- REPLACE THIS WITH YOUR DEPLOYED BACKEND URL

async function fetcher(endpoint, options = {}) {
  const { headers, body, ...rest } = options
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(errorData.error || "An unknown error occurred")
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const api = {
  // Auth Endpoints
  ownerLogin: (username, password) =>
    fetcher("/owner/login", {
      method: "POST",
      body: { username, password },
    }),

  customerLogin: (name, mobile) =>
    fetcher("/customers/login", {
      method: "POST",
      body: { name, mobile },
    }),

  // Sweet Endpoints
  addSweet: (token, sweetData) =>
    fetcher("/sweets", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: sweetData,
    }),

  deleteSweet: (token, id) =>
    fetcher(`/sweets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),

  getAllSweets: () => fetcher("/sweets"),

  searchSweets: (params) => {
    const query = new URLSearchParams(params).toString()
    return fetcher(`/sweets/search?${query}`)
  },

  restockSweet: (token, id, quantity) =>
    fetcher(`/sweets/${id}/restock`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: { quantity },
    }),

  purchaseSweet: (token, id, quantity) =>
    fetcher(`/sweets/${id}/purchase`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: { quantity },
    }),
}
