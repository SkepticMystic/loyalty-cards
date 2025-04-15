import mongoose from "mongoose";
import { z } from "zod";
import type { Timestamps } from "../interfaces";

export const modify_brand_schema = z.object({
  name: z.string().trim().min(1, "Brand name is required"),
});

export type ModifyBrand = z.infer<typeof modify_brand_schema>;

export const admin_modify_brand_schema = modify_brand_schema.extend({
  approved_at: z.coerce.date().nullable().optional(),
});

export type Brand = z.infer<typeof admin_modify_brand_schema> &
  Timestamps & {
    slug: string;
    team_id: string;
  };

const model_name = "Brands";

export const Brands: mongoose.Model<Brand> =
  mongoose.models[model_name] ||
  mongoose.model(
    model_name,
    new mongoose.Schema<Brand>({
      team_id: { type: String, required: true },
      approved_at: { type: mongoose.Schema.Types.Mixed, required: false },

      name: { type: String, required: true },
    }),
    model_name,
  );
