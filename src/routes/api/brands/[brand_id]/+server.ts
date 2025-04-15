import { get_seller } from "$lib/auth/server";
import { Branches } from "$lib/models/Branches";
import { Brands, modify_brand_schema } from "$lib/models/Brands";
import { LoyaltyCards } from "$lib/models/LoyaltyCards";
import { Parsers } from "$lib/schema/parsers";
import { err, suc } from "$lib/utils";
import { Objects } from "$lib/utils/objects";
import { Strings } from "$lib/utils/strings";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { mongo } from "mongoose";

export const PATCH: RequestHandler = async ({ locals, request, params }) => {
  const [user, input] = await Promise.all([
    get_seller(locals, { role: "admin" }),
    Parsers.request(request, modify_brand_schema.partial()),
  ]);

  try {
    const brand = await Brands.findOneAndUpdate(
      { _id: params.brand_id, team_id: user.team_id },
      {
        $set: Object.assign(
          { approved_at: null },
          Objects.del_nullish_keys({
            ...input,
            slug: input.name ? Strings.slugify(input.name) : null,
          }),
        ),
      },
      { new: true },
    ).lean();

    return json(suc(brand));
  } catch (e) {
    console.log(e);

    if (e instanceof mongo.MongoServerError && e.code === 11000) {
      error(400, "Duplicate brand name");
    } else {
      return json(err("Something went wrong"));
    }
  }
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const user = await get_seller(locals, { role: "admin" });

  try {
    await Promise.all([
      Brands.deleteOne({
        _id: params.brand_id,
        team_id: user.team_id,
      }),
      Branches.deleteMany({
        team_id: user.team_id,
        brand_id: params.brand_id,
      }),
      LoyaltyCards.deleteMany({
        team_id: user.team_id,
        brand_id: params.brand_id,
      }),
    ]);

    return json(suc());
  } catch (error) {
    console.log(error);

    return json(err("Something went wrong"));
  }
};
