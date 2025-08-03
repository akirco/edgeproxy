export const config = {
  // Default TTL for cached entries (30 days)
  DEFAULT_TTL: 60 * 60 * 24 * 30,

  // Proxy configurations
  PROXY: {
    MAX_REDIRECTS: 5, // Maximum number of redirects to follow
    TIMEOUT: 30000, // Request timeout in milliseconds
    MAX_BODY_SIZE: 20 * 1024 * 1024 * 1024, // 20GB max body size
  },

  // Response headers
  DEFAULT_HEADERS: {
    "content-type": "application/json",
    "x-powered-by": "EdgeOne Pages",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "Content-Type",
  },

  // Error messages
  ERRORS: {
    INVALID_DOMAIN: "Invalid domain parameter",
    NOT_FOUND: "Domain not found in proxy map",
    INTERNAL_ERROR: "Internal server error",
    TOO_MANY_REDIRECTS: "Maximum redirect limit exceeded",
    TARGET_UNREACHABLE: "Target server is unreachable",
    REQUEST_TIMEOUT: "Request timeout exceeded",
    PAYLOAD_TOO_LARGE: "Request payload too large",
  },
};
