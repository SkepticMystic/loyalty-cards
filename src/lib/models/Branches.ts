import mongoose from "mongoose";
import { z } from "zod";
import type { Timestamps } from "../interfaces";
import { place_schema } from "../schema/place";

export const modify_branch_schema = z.object({
  brand_id: z.string(),

  name: z.string().trim().min(1, "Branch name is required"),

  place: place_schema,
});

export type ModifyBranch = z.infer<typeof modify_branch_schema>;

export const admin_modify_branch_schema = modify_branch_schema.extend({
  approved_at: z.coerce.date().nullable().optional(),
});

export type Branch = z.infer<typeof admin_modify_branch_schema> &
  Timestamps & {
    team_id: string;
  };

const model_name = "Branches";

export const Branches: mongoose.Model<Branch> =
  mongoose.models[model_name] ||
  mongoose.model(
    model_name,
    new mongoose.Schema<Branch>({
      team_id: { type: String, required: true },
      brand_id: { type: String, required: true },
      approved_at: { type: mongoose.Schema.Types.Mixed, required: false },

      name: { type: String, required: true },

      place: { type: Object, required: true },
    }),
    model_name,
  );
