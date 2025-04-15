import mongoose from "mongoose";
import type { Timestamps } from "../interfaces";
import type { LoyaltyCard } from "./LoyaltyCards";

export type MemberLoyaltyCard = Timestamps & {
  user_id: string;
  brand_id: string;
  loyalty_card_id: string;

  token: string;
  stamps: { date: Date }[];

  /** Locked in, not grabbed from the LoyaltyCard, so that the brand can't just change it */
  reward: LoyaltyCard["reward"];
  limits: LoyaltyCard["limits"];
  required_stamps: LoyaltyCard["required_stamps"];

  /** When stamps.length === limits.required_stamps */
  filled_at?: Date;
  /** When it's been redeemed for the reward */
  redeemed_at?: Date;
};

const model_name = "MemberLoyaltyCards";

export const MemberLoyaltyCards: mongoose.Model<MemberLoyaltyCard> =
  mongoose.models[model_name] ||
  mongoose.model<MemberLoyaltyCard>(
    model_name,
    new mongoose.Schema<MemberLoyaltyCard>(
      {
        user_id: { type: String, required: true },
        brand_id: { type: String, required: true },
        loyalty_card_id: { type: String, required: true },

        token: { type: String, required: true },
        stamps: { type: [Object], required: true },

        reward: { type: String, required: true },
        limits: { type: Object, required: true },
        required_stamps: { type: Number, required: true },

        filled_at: { type: Date },
        redeemed_at: { type: Date },
      },
      { timestamps: true, minimize: false },
    ),
    model_name,
  );
