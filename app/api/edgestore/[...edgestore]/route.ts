// Provide fallback env vars so EdgeStore init doesn't crash the build
if (!process.env.EDGE_STORE_ACCESS_KEY) {
  process.env.EDGE_STORE_ACCESS_KEY = "mock-edge-access-key-placeholder";
}
if (!process.env.EDGE_STORE_SECRET_KEY) {
  process.env.EDGE_STORE_SECRET_KEY = "mock-edge-secret-key-placeholder";
}

import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

export type EdgeStoreRouter = typeof edgeStoreRouter;
