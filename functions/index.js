import { createJsonResponse } from "./utils";

export async function onRequest() {
  return createJsonResponse({
    name: "EdgeOne Pages Proxy",
    version: "1.0.0",
    endpoints: {
      "/": "API documentation",
      "/:domain":
        "Proxy requests to a specific domain, no authentication required",
      "/list": "List all registered domains",
      "/target/:domain": {
        POST: "Register or update a domain for proxying",
        DELETE: "Remove a domain from proxy list",
      },
      "/proxy/:domain/*": "Proxy requests to the specified registered domain",
    },
    documentation: "https://github.com/yourusername/edgeproxy",
  });
}
