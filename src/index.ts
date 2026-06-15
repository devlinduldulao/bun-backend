import { serve } from "@daloyjs/core/bun";
import { printStartupBanner, type StartupBannerLink } from "@daloyjs/core/banner";
import { buildApp } from "./build-app.ts";

const app = buildApp();
const port = Number(process.env.PORT ?? 3000);

const handle = serve(app, {
  port,
  // Bun closes idle keep-alive connections after this many seconds.
  idleTimeout: 30,
});

const url = handle.url ? String(handle.url) : `http://localhost:${port}`;
const links: StartupBannerLink[] = [
  // daloy-minimal:strip-start docs
  { label: "API docs", url: `${url}/docs` },
  { label: "OpenAPI JSON", url: `${url}/openapi.json` },
  { label: "OpenAPI YAML", url: `${url}/openapi.yaml` },
  // daloy-minimal:strip-end docs
  { label: "Health", url: `${url}/healthz` },
];

printStartupBanner({ name: "DaloyJS API", url, runtime: "Bun", links });

// NOTE: Do not `export default app` here. Bun auto-starts a server from a
// default export that looks like a server config ({ fetch, ... }). Since this
// file already starts the listener explicitly via serve() above, exporting it
// would make Bun bind a second server on the same port → EADDRINUSE → crash
// (seen on Railway as "Uncaught exception — exiting"). Tooling that needs the
// app imports buildApp() from ./build-app.ts instead.
