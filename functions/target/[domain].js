import { config } from "../config";
import {
  createErrorResponse,
  createJsonResponse,
  isValidDomain,
  log,
} from "../utils";

export async function onRequest({ request, params, env }) {
  const { domain } = params;

  try {
    // Validate request method
    if (!["GET", "DELETE"].includes(request.method)) {
      return createErrorResponse("Method not allowed", 405);
    }

    if (!domain || !isValidDomain(domain)) {
      return createErrorResponse(config.ERRORS.INVALID_DOMAIN);
    }

    // Handle DELETE request
    if (request.method === "DELETE") {
      await PROXY_MAP.delete(domain);
      log("info", "Domain removed from proxy map", { domain });
      return createJsonResponse({
        code: 200,
        message: `Domain ${domain} has been successfully removed from the proxy map.`,
      });
    }

    // Handle POST request
    const proxyInfo = {
      target: `https://${domain}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expirationTtl: config.DEFAULT_TTL,
    };

    // Allow custom configuration through request body
    if (request.headers.get("content-type")?.includes("application/json")) {
      try {
        const body = await request.json();
        if (body.target) proxyInfo.target = body.target;
        if (body.expirationTtl) proxyInfo.expirationTtl = body.expirationTtl;
      } catch (error) {
        log("warn", "Failed to parse request body", { error: error.message });
      }
    }

    await PROXY_MAP.put(domain, JSON.stringify(proxyInfo), {
      expirationTtl: proxyInfo.expirationTtl,
    });

    log("info", "Domain added to proxy map", { domain, ...proxyInfo });

    return createJsonResponse({
      code: 200,
      message: `Domain ${domain} has been successfully added to the proxy map.`,
      data: proxyInfo,
    });
  } catch (error) {
    log("error", "Failed to process domain request", {
      domain,
      error: error.message,
    });
    return createErrorResponse(config.ERRORS.INTERNAL_ERROR, 500);
  }
}
