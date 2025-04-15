import { get_seller } from "$lib/auth/server";
import { Branches, modify_branch_schema } from "$lib/models/Branches";
import { Parsers } from "$lib/schema/parsers";
import { err, suc } from "$lib/utils";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals, request }) => {
  const [user, input] = await Promise.all([
    get_seller(locals, { role: "admin" }),
    Parsers.request(request, modify_branch_schema),
  ]);

  try {
    const branch = await Branches.create({
      ...input,
      approved_at: null,
      team_id: user.team_id,
    });

    return json(suc(branch));
  } catch (e) {
    console.log(e);

    return json(err("Something went wrong"));
  }
};
