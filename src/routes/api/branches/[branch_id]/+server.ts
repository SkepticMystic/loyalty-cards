import { get_seller } from "$lib/auth/server";
import { Branches, modify_branch_schema } from "$lib/models/Branches";
import { Parsers } from "$lib/schema/parsers";
import { err, suc } from "$lib/utils";
import { Objects } from "$lib/utils/objects";
import { json, type RequestHandler } from "@sveltejs/kit";

export const PATCH: RequestHandler = async ({ locals, request, params }) => {
  const [user, input] = await Promise.all([
    get_seller(locals, { role: "admin" }),
    Parsers.request(request, modify_branch_schema.partial()),
  ]);

  try {
    const branch = await Branches.findOneAndUpdate(
      { _id: params.branch_id, team_id: user.team_id },
      {
        $set: Object.assign(
          { approved_at: null },
          Objects.del_nullish_keys(input),
        ),
      },
      { new: true },
    ).lean();

    return json(suc(branch));
  } catch (e) {
    console.log(e);

    return json(err("Something went wrong"));
  }
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const user = await get_seller(locals, { role: "admin" });

  try {
    await Promise.all([
      Branches.deleteOne({
        _id: params.branch_id,
        team_id: user.team_id,
      }),
    ]);

    return json(suc());
  } catch (error) {
    console.log(error);

    return json(err("Something went wrong"));
  }
};
