import { config } from "../config";
import { createErrorResponse, createJsonResponse, log } from "../utils";

export async function onRequest({ request, params, env }) {
  try {
    const lists = await PROXY_MAP.list();
    log("info", "Retrieved domain list", { count: lists.keys.length });

    const domains = await Promise.all(
      lists.keys.map(async (item) => {
        const data = await PROXY_MAP.get(item.key);
        return {
          domain: item.key,
          ...JSON.parse(data),
        };
      })
    );

    return createJsonResponse({
      code: 200,
      message: "Successfully retrieved all domains",
      total: domains.length,
      domains,
    });
  } catch (error) {
    log("error", "Failed to retrieve domain list", { error: error.message });
    return createErrorResponse(config.ERRORS.INTERNAL_ERROR, 500);
  }
}
