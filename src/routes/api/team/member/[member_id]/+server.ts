import { auth, Users } from "$lib/auth/lucia";
import { get_seller } from "$lib/auth/server";
import { Teams } from "$lib/models/Teams";
import { Roles } from "$lib/utils/roles";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const { member_id } = params;

  const user = await get_seller(locals);

  if (user.userId === member_id) {
    error(400, "You cannot remove yourself from the team.");
  }

  const member = await Users.findOne({
    _id: member_id,
    team_id: user.team_id,
  }).lean();

  if (!member) {
    error(404, "Member not found.");
  } else if (member.kind !== "seller") {
    error(500, "Member is not a seller");
  } else if (!Roles.has_atleast(user, member.role)) {
    error(403, "You cannot remove a member with a higher role than you.");
  }

  // At this point, we know that
  // - The user is not removing themselves
  // - The user is removing a member of their team
  // - The user is not removing a member with a higher role than them

  const newTeam = new Teams();
  await Promise.all([
    auth.updateUserAttributes(member_id, {
      role: "owner",
      team_id: newTeam._id.toString(),
    }),
    newTeam.save(),
  ]);

  return json({ ok: true });
};
