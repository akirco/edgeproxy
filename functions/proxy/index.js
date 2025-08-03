import { createJsonResponse } from "../utils";

export async function onRequest() {
  return createJsonResponse({
    code: 200,
    message: "Proxy API endpoint",
    usage: {
      description: "Use /proxy/:domain to proxy requests to a specific domain",
      example: "/proxy/example.com/path?query=value",
      note: "Domain must be registered first using /target/:domain",
    },
  });
}
