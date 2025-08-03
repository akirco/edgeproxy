import { log } from "../utils";

export async function onRequest({ request, params, env }) {
  try {
    console.log("Received request for domain:", params);
    //params :
    // 1. { default:  'example.com' }
    // 2. { default: [ 'example.com', 'path', 'to', 'resource' ] }

    const domain = Array.isArray(params.default)
      ? params.default[0]
      : params.default;

    if (!domain || !domain.match(/^[a-zA-Z0-9.-]+$/)) {
      return new Response("Invalid proxy path", { status: 400 });
    }
    const domainKey = domain;
    log("info", "Processing proxy request for domain", { domain: domainKey });
    const kvValue = await PROXY_MAP.get(domainKey, "json");

    console.log("KV value for domain:", kvValue.target);

    const targetUrl = kvValue.target;
    if (!targetUrl) {
      return new Response(`No target URL configured for "${domainKey}"`, {
        status: 404,
      });
    }
    const urlInfo = new URL(request.url);
    //replace /proxy/${domainKey} to /
    const pathname = urlInfo.pathname.replace(`/proxy/${domainKey}`, "");
    const targetUrlWithPath = `${targetUrl}${pathname}${urlInfo.search}`;
    console.log("Target URL with path:", targetUrlWithPath);

    // Create new request with original properties
    const proxiedRequest = new Request(targetUrlWithPath, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      copyHeaders: true,
    });
    proxiedRequest.headers.set("Host", domainKey);

    // Forward the request
    const response = await fetch(proxiedRequest);
    response.headers.append("Access-Control-Allow-Origin", "*");
    response.headers.append("Access-Control-Allow-Methods", "GET,POST");
    response.headers.append("Access-Control-Allow-Headers", "Authorization");
    response.headers.append("Access-Control-Max-Age", "86400");
    response.headers.delete("X-Cache");

    return response;
  } catch (error) {
    return new Response("Proxy error: " + error.message, { status: 502 });
  }
}
