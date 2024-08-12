import { createRouteHandler } from "uploadthing/server";
import { fileRouter } from "./core";
import { NextRequest } from "next/server";

const { GET: rawGET, POST: rawPOST } = createRouteHandler({
  router: fileRouter,
});

export const GET = (request: NextRequest) => rawGET(request as any);
export const POST = (request: NextRequest) => rawPOST(request as any);
