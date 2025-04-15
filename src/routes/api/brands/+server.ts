import { get_seller } from "$lib/auth/server";
import { Brands, modify_brand_schema } from "$lib/models/Brands";
import { Parsers } from "$lib/schema/parsers";
import { err, suc } from "$lib/utils";
import { Strings } from "$lib/utils/strings";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { mongo } from "mongoose";

export const POST: RequestHandler = async ({ locals, request }) => {
  const [user, input] = await Promise.all([
    get_seller(locals, { role: "admin" }),
    Parsers.request(request, modify_brand_schema),
  ]);

  try {
    const brand = await Brands.create({
      ...input,
      approved_at: null,
      team_id: user.team_id,
      slug: Strings.slugify(input.name),
    });

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
