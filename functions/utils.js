import { config } from "./config";

// Validate domain format
export function isValidDomain(domain) {
  const urlPattern =
    /^(?!:\/\/)(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  return urlPattern.test(domain);
}

// Create a standardized JSON response
export function createJsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...config.DEFAULT_HEADERS,
      ...headers,
    },
  });
}

// Error response helper
export function createErrorResponse(message, status = 400) {
  return createJsonResponse(
    {
      code: status,
      message,
      timestamp: new Date().toISOString(),
    },
    status
  );
}

// Logger utility
export function log(type, message, data = {}) {
  const logEntry = {
    type,
    message,
    timestamp: new Date().toISOString(),
    ...data,
  };
  console.log(JSON.stringify(logEntry));
}

// Parse proxy target from KV store
export async function getProxyTarget(domain) {
  try {
    const data = await PROXY_MAP.get(domain);
    log("info", "Retrieved proxy target", {
      domain,
      data: data ? JSON.parse(data) : null,
    });
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    log("error", "Failed to parse proxy target", {
      domain,
      error: error.message,
    });
    return null;
  }
}
