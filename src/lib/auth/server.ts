import { error, redirect } from "@sveltejs/kit";
import { App } from "../utils/app";
import { Roles } from "../utils/roles";
import { type Role } from "./roles";

type GetUserOptions = {
  /** Must have atleast this role */
  role?: Role;
  /** Must be an admin */
  admin?: boolean;
};

/** The catch-all function to get the current user.
 * Check roles.
 * Redirect to signin if not logged in.
 */
export const get_user = async (
  locals: App.Locals,
  options?: GetUserOptions,
) => {
  const { admin, role } = {
    admin: false,
    role: undefined,
    ...(options ?? {}),
  };

  const session = await locals.auth.validate();
  if (!session) {
    redirect(302, App.url("/auth/signin", { redirect: "/" }));
  }
  const { user } = session;

  if (admin && !user.admin) {
    error(403, "Forbidden");
  } else if (role && !Roles.has_atleast(user, role)) {
    console.log("role check failed", user, { role });
    error(403, `Forbidden. You must be atleast ${role} to do this.`);
  }

  return user;
};

export const get_seller = async (
  locals: App.Locals,
  options?: GetUserOptions,
) => {
  const user = await get_user(locals, options);

  if (user.kind !== "seller") {
    error(400, "User is not a seller");
  }

  return user;
};

export const get_buyer = async (
  locals: App.Locals,
  options?: GetUserOptions,
) => {
  const user = await get_user(locals, options);

  if (user.kind !== "buyer") {
    error(400, "User is not a buyer");
  }

  return user;
};
