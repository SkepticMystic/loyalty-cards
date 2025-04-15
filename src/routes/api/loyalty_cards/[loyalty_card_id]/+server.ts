import { get_user } from "$lib/auth/server";
import {
  LoyaltyCards,
  modify_loyalty_card_schema,
} from "$lib/models/LoyaltyCards";
import { Parsers } from "$lib/schema/parsers";
import { err, suc } from "$lib/utils";
import { Objects } from "$lib/utils/objects";
import { json, type RequestHandler } from "@sveltejs/kit";

export const PATCH: RequestHandler = async ({ locals, request, params }) => {
  const [user, input] = await Promise.all([
    get_user(locals, { role: "admin" }),
    Parsers.request(request, modify_loyalty_card_schema.partial()),
  ]);

  try {
    const loyalty_card = await LoyaltyCards.findOneAndUpdate(
      { _id: params.loyalty_card_id, team_id: user.team_id },
      {
        $set: Object.assign(
          { approved_at: null },
          Objects.del_nullish_keys(input),
        ),
      },
      { new: true },
    ).lean();

    return json(suc(loyalty_card));
  } catch (e) {
    console.log(e);

    return json(err("Something went wrong"));
  }
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const user = await get_user(locals, { role: "admin" });

  try {
    await Promise.all([
      LoyaltyCards.deleteOne({
        _id: params.loyalty_card_id,
        team_id: user.team_id,
      }),
    ]);

    return json(suc());
  } catch (error) {
    console.log(error);

    return json(err("Something went wrong"));
  }
};
