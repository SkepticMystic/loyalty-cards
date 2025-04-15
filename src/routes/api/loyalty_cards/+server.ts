import { get_user } from "$lib/auth/server";
import {
  LoyaltyCards,
  modify_loyalty_card_schema,
} from "$lib/models/LoyaltyCards";
import { Parsers } from "$lib/schema/parsers";
import { err, suc } from "$lib/utils";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals, request }) => {
  const [user, input] = await Promise.all([
    get_user(locals, { role: "admin" }),
    Parsers.request(request, modify_loyalty_card_schema),
  ]);

  try {
    const loyalty_card = await LoyaltyCards.create({
      ...input,
      approved_at: null,
      team_id: user.team_id,
    });

    return json(suc(loyalty_card));
  } catch (e) {
    console.log(e);

    return json(err("Something went wrong"));
  }
};
