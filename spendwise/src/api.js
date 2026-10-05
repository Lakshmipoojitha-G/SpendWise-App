// Base URL for the Django backend API
const BASE_URL = "http://localhost:8000/api";

// ─── Token Helpers ──────────────────────────────────────────────────────────

export function getAccessToken() {
  return localStorage.getItem("sw_access");
}

export function getRefreshToken() {
  return localStorage.getItem("sw_refresh");
}

function saveTokens({ access, refresh }) {
  localStorage.setItem("sw_access", access);
  if (refresh) localStorage.setItem("sw_refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("sw_access");
  localStorage.removeItem("sw_refresh");
}

// ─── Core Fetch Wrapper ─────────────────────────────────────────────────────

async function request(path, options = {}, retry = true) {
  const token = getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Token expired — try refreshing once
  if (res.status === 401 && retry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return request(path, options, false); // retry with new token
    } else {
      clearTokens();
      window.location.reload(); // kick user to login
      return;
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw error;
  }

  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

async function tryRefreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    saveTokens({ access: data.access, refresh: data.refresh || refresh });
    return true;
  } catch {
    return false;
  }
}

// ─── Auth API ───────────────────────────────────────────────────────────────

export const authAPI = {
  async register({ name, email, password, password2 }) {
    const data = await request("/auth/register/", {
      method: "POST",
      body: JSON.stringify({ name, email, password, password2 }),
    });
    saveTokens(data.tokens);
    return data.user;
  },

  async login({ email, password }) {
    const data = await request("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveTokens(data.tokens);
    return data.user;
  },

  async logout() {
    const refresh = getRefreshToken();
    try {
      await request("/auth/logout/", {
        method: "POST",
        body: JSON.stringify({ refresh }),
      });
    } catch {
      // ignore logout errors
    } finally {
      clearTokens();
    }
  },

  async getProfile() {
    return request("/auth/profile/");
  },

  async updateProfile({ name, currency }) {
    return request("/auth/profile/", {
      method: "PATCH",
      body: JSON.stringify({ name, currency }),
    });
  },
};

// ─── Expenses API ────────────────────────────────────────────────────────────

export const expensesAPI = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.category && params.category !== "All") query.set("category", params.category);
    if (params.ordering) query.set("ordering", params.ordering);
    const qs = query.toString();
    return request(`/expenses/${qs ? "?" + qs : ""}`);
  },

  async create({ description, category, amount, date }) {
    return request("/expenses/", {
      method: "POST",
      body: JSON.stringify({ description, category, amount, date }),
    });
  },

  async update(id, { description, category, amount, date }) {
    return request(`/expenses/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ description, category, amount, date }),
    });
  },

  async delete(id) {
    return request(`/expenses/${id}/`, { method: "DELETE" });
  },
};

// ─── Budget API ──────────────────────────────────────────────────────────────

export const budgetAPI = {
  async get() {
    return request("/budgets/");
  },

  async set(amount) {
    return request("/budgets/", {
      method: "PUT",
      body: JSON.stringify({ amount }),
    });
  },
};
