import { serve } from "https://deno.land/std@0.164.0/http/server.ts";
import { config as dotenvConfig } from "https://deno.land/std@0.164.0/dotenv/mod.ts";

import { PrismaClient } from "./generated/client/deno/edge.ts";

await dotenvConfig({ export: true });

console.log(Deno.env.get("DATABASE_URL"));

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: Deno.env.get("DATABASE_URL"),
    },
  },
});

async function handler(req: Request): Promise<Response> {
  const log = await prisma.log.create({
    data: {
      level: "Info",
      message: `${req.method} ${req.url}`,
      meta: {
        headers: JSON.stringify(req.headers),
      },
    },
  });

  const body = JSON.stringify(log, null, 2);

  return Response.json(body);
}

serve(handler, { port: 3000 });
