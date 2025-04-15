import { z } from "zod";

export const place_schema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("physical"),
    data: z.object({
      name: z.string(),
      place_id: z.string(),
      formatted_address: z.string(),
      coords: z.object({ lat: z.number(), lng: z.number() }),
    }),
  }),

  z.object({
    kind: z.literal("online"),
    data: z.object({
      name: z.string(),
      href: z.string().url(),
    }),
  }),
]);

export type Place = z.infer<typeof place_schema>;
