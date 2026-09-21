import type { RequestHandler } from "express";

export function requestLogger(write: (message: string) => void): RequestHandler {
  return (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      if (req.path.startsWith("/api")) {
        // Route templates omit identifiers, query strings and private payloads.
        const route = typeof req.route?.path === "string" ? req.route.path : "/api/*";
        write(`${req.method} ${route} ${res.statusCode} in ${Date.now() - start}ms`);
      }
    });
    next();
  };
}
