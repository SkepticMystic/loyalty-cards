import type { User } from "lucia";

const admin = (user?: Pick<User, "admin"> | undefined | null) =>
  Boolean(user?.admin);

const owns = (resource: { team_id: string }, user: User | undefined | null) =>
  Boolean(user?.kind === "seller" && user.team_id === resource.team_id);

const approved = (resource: { approved_at?: Date | null | undefined }) =>
  Boolean(resource.approved_at);

const member_visible = (resource: {
  active?: boolean;
  approved_at?: Date | null | undefined;
}) => Boolean(resource.active && approved(resource));

const admin_or_owned = (
  resource: { team_id: string },
  user: User | undefined | null,
) => admin(user) || owns(resource, user);

const admin_or_owned_or_visible = (
  resource: { team_id: string; approved_at?: Date | null | undefined },
  user: User | undefined | null,
) => admin_or_owned(resource, user) || approved(resource);

export const Check = {
  owns,
  admin,
  approved,
  member_visible,

  admin_or_owned,
  admin_or_owned_or_visible,
};
