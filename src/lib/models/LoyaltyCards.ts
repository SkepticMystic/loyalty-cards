import mongoose from "mongoose";
import { z } from "zod";
import type { Timestamps } from "../interfaces";

export const modify_loyalty_card_schema = z.object({
  active: z.boolean(),

  brand_id: z.string().min(1, "Brand is required"),

  name: z.string().trim().min(1, "Name must be atleast 1 character."),

  reward: z
    .string()
    .min(1, "Reward is required")
    .max(50, "Reward cannot be longer than 50 characters"),

  required_stamps: z
    .number()
    .positive("Required stamps must be positive")
    .int("Required stamps must be an integer"),

  limits: z.object({
    /** Expiry date */
    date: z.coerce.date().nullable().optional(),
  }),
});

export type ModifyLoyaltyCard = z.infer<typeof modify_loyalty_card_schema>;

export const admin_modify_loyalty_card_schema =
  modify_loyalty_card_schema.extend({
    approved_at: z.coerce.date().nullable().optional(),
  });

export type LoyaltyCard = z.infer<typeof admin_modify_loyalty_card_schema> & {
  team_id: string;
} & Timestamps;

const model_name = "LoyaltyCards";

export const LoyaltyCards: mongoose.Model<LoyaltyCard> =
  mongoose.models[model_name] ||
  mongoose.model(
    model_name,
    new mongoose.Schema<LoyaltyCard>(
      {
        active: { type: Boolean, required: true },

        team_id: { type: String, required: true },
        brand_id: { type: String, required: true },
        approved_at: { type: mongoose.Schema.Types.Mixed, required: false },

        name: { type: String, required: true },
        reward: { type: String, required: true },

        required_stamps: { type: Number, required: true },
        limits: { type: Object, required: true },
      },
      { timestamps: true, minimize: false },
    ),
    model_name,
  );
